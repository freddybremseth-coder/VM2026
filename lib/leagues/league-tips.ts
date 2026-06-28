/**
 * Data layer for the league-tips comparison surface.
 *
 * Returns everything the LiveTipsBoard client component needs: the fixture
 * window around `now`, each league member's tip on each fixture (RLS-
 * filtered server-side, so pre-kickoff teammate tips are silently dropped),
 * any recorded results, and the trusted server clock.
 *
 * The supabase client passed in is intentionally the user-bound one — that's
 * how the predictions RLS policy from migration 0004 enforces the kickoff
 * gate. Calling this with the admin client would defeat the purpose.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { FIXTURES, type Fixture } from "@/lib/wc26-fixtures";
import { teamById, teamName } from "@/lib/wc26-data";
import type { FixtureStatus } from "@/lib/predictions-visibility";
import { computeAllGroupStandings, type ResultRow } from "@/lib/group-standings";
import { resolveAllKnockout } from "@/lib/knockout-resolve";

const WINDOW_PAST_MS = 36 * 60 * 60 * 1000;
const WINDOW_FUTURE_MS = 36 * 60 * 60 * 1000;

const STAGE_LABEL_KO: Record<string, string> = {
  R32: "16-delsfinale",
  R16: "8-delsfinale",
  QF: "Kvartfinale",
  SF: "Semifinale",
  "3RD": "Bronsefinale",
  FINAL: "Finale",
};

function stageLabel(f: Fixture): string {
  return f.stage.kind === "group"
    ? `Gruppe ${f.stage.group} · MD${f.stage.matchday}`
    : STAGE_LABEL_KO[f.stage.round] ?? "Sluttspill";
}

export interface BoardMember {
  userId: string;
  label: string;
}

export interface BoardTip {
  userId: string;
  homeScore: number;
  awayScore: number;
}

export interface BoardResult {
  homeScore: number;
  awayScore: number;
  status: string;
  minute: number | null;
}

export interface BoardFixture {
  matchId: number;
  stageLabel: string;
  /** ISO UTC. Browser converts to local for display only. */
  kickoff: string;
  /** From public.fixtures — drives the reveal rule. */
  status: FixtureStatus;
  homeName: string;
  awayName: string;
  homeFlag: string | null;
  awayFlag: string | null;
  /** RLS-filtered: empty array pre-kickoff (except for own tip). */
  tips: BoardTip[];
  result: BoardResult | null;
}

export interface LeagueTipsData {
  /** Authoritative server clock. Client uses this — never Date.now(). */
  serverNow: string;
  fixtures: BoardFixture[];
  members: BoardMember[];
  /** The caller's own user id, so the client can highlight "you" and split
   *  own/teammate render decisions. */
  youId: string;
}

interface FetchOpts {
  /** Override window — handy for tests. */
  now?: Date;
}

export async function getLeagueTipsData(
  supabase: SupabaseClient,
  leagueId: string,
  opts: FetchOpts = {},
): Promise<LeagueTipsData | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Membership check — RLS would block downstream queries anyway, but a
  // clean null here keeps the caller out of partial-state branches.
  const { data: membership } = await supabase
    .from("league_members")
    .select("user_id")
    .eq("league_id", leagueId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!membership) {
    // Owner-but-not-member edge case: check ownership.
    const { data: league } = await supabase
      .from("mini_leagues")
      .select("owner_id")
      .eq("id", leagueId)
      .maybeSingle();
    if (!league || league.owner_id !== user.id) return null;
  }

  // ─── Members in this league ───
  const { data: rawMembers } = await supabase
    .from("league_members")
    .select("user_id, profiles(username, display_name)")
    .eq("league_id", leagueId);

  type MemRow = {
    user_id: string;
    profiles: { username: string; display_name: string | null } | null;
  };
  const members: BoardMember[] = ((rawMembers as MemRow[] | null) ?? []).map(
    (m) => ({
      userId: m.user_id,
      label: m.profiles?.display_name || m.profiles?.username || "(anonym)",
    }),
  );

  // ─── Resolve knockout teams (so sluttspill ties show up too) ───
  // Load all results once: drives the standings + slot resolution and the
  // per-fixture result display below.
  const { data: allResultsData } = await supabase
    .from("match_results")
    .select("match_id, home_score, away_score, status, minute");
  const allResultRows = ((allResultsData as Array<{
    match_id: number;
    home_score: number | null;
    away_score: number | null;
    status: string;
    minute: number | null;
  }> | null) ?? []).filter((r) => r.home_score !== null && r.away_score !== null);
  const resultRowsForStandings: ResultRow[] = allResultRows.map((r) => ({
    match_id: r.match_id,
    home_score: r.home_score as number,
    away_score: r.away_score as number,
    status: r.status,
  }));
  const resultsByMatchAll = new Map(
    resultRowsForStandings.map((r) => [r.match_id, r]),
  );
  const standings = computeAllGroupStandings(resultRowsForStandings);
  const koTeams = resolveAllKnockout(standings, resultsByMatchAll);

  /** Effective team ids for any fixture (group direct, knockout resolved). */
  const teamsOf = (f: Fixture): { homeId: number | null; awayId: number | null } => {
    const r = koTeams.get(f.id);
    return {
      homeId: f.homeId ?? r?.homeId ?? null,
      awayId: f.awayId ?? r?.awayId ?? null,
    };
  };

  // ─── Window around now ───
  // Past + a 36h base future window, but ALWAYS extend to cover the whole of
  // the next match-day — even if those games are 2+ days away (rest days
  // between knockout rounds) — so the league board never goes blank.
  const now = opts.now ?? new Date();
  const nowMs = now.getTime();
  const windowStart = nowMs - WINDOW_PAST_MS;
  let windowEnd = nowMs + WINDOW_FUTURE_MS;

  const nextUp = FIXTURES.filter((f) => {
    const { homeId, awayId } = teamsOf(f);
    return homeId && awayId && new Date(f.kickoff).getTime() > nowMs;
  }).sort((a, b) => a.kickoff.localeCompare(b.kickoff));
  if (nextUp.length > 0) {
    const firstDay = nextUp[0].kickoff.slice(0, 10); // YYYY-MM-DD
    const endOfFirstDay = Date.parse(`${firstDay}T23:59:59Z`);
    if (endOfFirstDay > windowEnd) windowEnd = endOfFirstDay;
  }

  const candidateFixtures = FIXTURES.filter((f) => {
    const { homeId, awayId } = teamsOf(f);
    if (!homeId || !awayId) return false;
    const ts = new Date(f.kickoff).getTime();
    return ts >= windowStart && ts <= windowEnd;
  }).sort((a, b) => b.kickoff.localeCompare(a.kickoff));

  const matchIds = candidateFixtures.map((f) => f.id);

  // ─── Fixture status from DB (postponement-aware) ───
  const statusByMatch = new Map<number, { kickoff: string; status: FixtureStatus }>();
  if (matchIds.length > 0) {
    const { data: fixtureRows } = await supabase
      .from("fixtures")
      .select("id, kickoff, status")
      .in("id", matchIds);
    for (const r of (fixtureRows as { id: number; kickoff: string; status: FixtureStatus }[] | null) ?? []) {
      statusByMatch.set(r.id, { kickoff: r.kickoff, status: r.status });
    }
  }

  // ─── Tips (RLS does the kickoff gating) ───
  const memberIds = members.map((m) => m.userId);
  const tipsByMatch = new Map<number, BoardTip[]>();
  if (matchIds.length > 0 && memberIds.length > 0) {
    const { data: tips } = await supabase
      .from("predictions")
      .select("user_id, match_id, home_score, away_score")
      .in("user_id", memberIds)
      .in("match_id", matchIds);
    type TipRow = {
      user_id: string;
      match_id: number;
      home_score: number;
      away_score: number;
    };
    for (const t of (tips as TipRow[] | null) ?? []) {
      const arr = tipsByMatch.get(t.match_id) ?? [];
      arr.push({ userId: t.user_id, homeScore: t.home_score, awayScore: t.away_score });
      tipsByMatch.set(t.match_id, arr);
    }
  }

  // ─── Recorded results (for showing actual score / grading colour) ───
  // Reuse the single results load from above.
  const resultByMatch = new Map<number, BoardResult>();
  for (const r of allResultRows) {
    resultByMatch.set(r.match_id, {
      homeScore: r.home_score as number,
      awayScore: r.away_score as number,
      status: r.status,
      minute: r.minute,
    });
  }

  const fixtures: BoardFixture[] = candidateFixtures.map((f) => {
    const { homeId, awayId } = teamsOf(f);
    const home = homeId ? teamById(homeId) : undefined;
    const away = awayId ? teamById(awayId) : undefined;
    const fromDb = statusByMatch.get(f.id);
    return {
      matchId: f.id,
      stageLabel: stageLabel(f),
      // Prefer the DB row — that's the postponement-aware kickoff.
      kickoff: fromDb?.kickoff ?? f.kickoff,
      status: fromDb?.status ?? "scheduled",
      homeName: teamName(home),
      awayName: teamName(away),
      homeFlag: home?.flag ?? null,
      awayFlag: away?.flag ?? null,
      tips: tipsByMatch.get(f.id) ?? [],
      result: resultByMatch.get(f.id) ?? null,
    };
  });

  return {
    serverNow: now.toISOString(),
    fixtures,
    members,
    youId: user.id,
  };
}
