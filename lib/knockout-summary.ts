/**
 * Knockout summary for the home page. Resolves each knockout fixture's two
 * teams from the live group standings + earlier results (slots → teams), and
 * classifies the tournament phase so the dashboard can promote the bracket
 * once the group stage is done and demote it again once the final is played.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { FIXTURES } from "@/lib/wc26-fixtures";
import { teamById } from "@/lib/wc26-data";
import { computeAllGroupStandings, type ResultRow } from "@/lib/group-standings";
import { resolveAllKnockout, type ResolvedTeams } from "@/lib/knockout-resolve";

export type TournamentPhase = "group" | "knockout" | "done";

export interface KnockoutTeam {
  name: string;
  shortName: string;
  flag: string;
}

export interface KnockoutMatch {
  id: number;
  round: string;
  kickoff: string;
  home: KnockoutTeam | null;
  away: KnockoutTeam | null;
  homeLabel: string;
  awayLabel: string;
  result: { home: number; away: number; finished: boolean } | null;
}

export interface KnockoutSummary {
  phase: TournamentPhase;
  /** Matches to feature (next not-yet-finished round; or last results if done). */
  matches: KnockoutMatch[];
  /** fixtureId → resolved teams, so other home-page surfaces agree. */
  koTeams: Map<number, ResolvedTeams>;
}

const ROUND_LABEL: Record<string, string> = {
  R32: "16-delsfinale",
  R16: "8-delsfinale",
  QF: "Kvartfinale",
  SF: "Semifinale",
  "3RD": "Bronsefinale",
  FINAL: "Finale",
};

function slotLabel(slot: string | undefined): string {
  if (!slot) return "TBD";
  if (slot === "3X") return "Beste 3.-plass";
  if (slot.startsWith("W")) return `Vinner kamp ${slot.slice(1)}`;
  if (slot.startsWith("L")) return "Taper semifinale";
  const place = slot[0];
  const group = slot.slice(1);
  if (place === "1") return `Vinner gruppe ${group}`;
  if (place === "2") return `2.-plass gruppe ${group}`;
  if (place === "3") return `3.-plass gruppe ${group}`;
  return slot;
}

function teamLite(id: number | null): KnockoutTeam | null {
  if (!id) return null;
  const t = teamById(id);
  return t ? { name: t.name, shortName: t.shortName, flag: t.flag } : null;
}

export async function getKnockoutSummary(
  supabase: SupabaseClient,
): Promise<KnockoutSummary> {
  let rows: ResultRow[] = [];
  try {
    const { data } = await supabase
      .from("match_results")
      .select("match_id, home_score, away_score, status");
    rows = ((data as ResultRow[] | null) ?? []).filter(
      (r) =>
        r.home_score !== null &&
        r.away_score !== null &&
        (r.status === "finished" || r.status === "live" || r.status === "halftime"),
    );
  } catch {
    rows = [];
  }
  const resultsByMatch = new Map<number, ResultRow>();
  for (const r of rows) resultsByMatch.set(r.match_id, r);
  const standings = computeAllGroupStandings(rows);
  const koTeams = resolveAllKnockout(standings, resultsByMatch);

  const koFixtures = FIXTURES.filter((f) => f.stage.kind === "knockout").sort(
    (a, b) => a.kickoff.localeCompare(b.kickoff),
  );

  const all: KnockoutMatch[] = koFixtures.map((f) => {
    const resolved = koTeams.get(f.id);
    const homeId = f.homeId ?? resolved?.homeId ?? null;
    const awayId = f.awayId ?? resolved?.awayId ?? null;
    const r = resultsByMatch.get(f.id);
    const round = f.stage.kind === "knockout" ? f.stage.round : "";
    return {
      id: f.id,
      round: ROUND_LABEL[round] ?? round,
      kickoff: f.kickoff,
      home: teamLite(homeId),
      away: teamLite(awayId),
      homeLabel: slotLabel(f.homeSlot),
      awayLabel: slotLabel(f.awaySlot),
      result:
        r && (r.status === "finished" || r.status === "live")
          ? { home: r.home_score, away: r.away_score, finished: r.status === "finished" }
          : null,
    };
  });

  const now = Date.now();
  const final = koFixtures.find(
    (f) => f.stage.kind === "knockout" && f.stage.round === "FINAL",
  );
  const finalFinished =
    final != null && resultsByMatch.get(final.id)?.status === "finished";

  // The bracket becomes "what matters" as the group stage wraps up: once any
  // knockout matchup is resolved, or we've reached the last group-stage
  // kickoff (matchups about to be locked in).
  const groupKickoffs = FIXTURES.filter((f) => f.stage.kind === "group").map((f) =>
    new Date(f.kickoff).getTime(),
  );
  const lastGroupKo = groupKickoffs.length ? Math.max(...groupKickoffs) : 0;
  const anyKoResolved = all.some((m) => m.home && m.away);

  const phase: TournamentPhase = finalFinished
    ? "done"
    : anyKoResolved || now >= lastGroupKo
      ? "knockout"
      : "group";

  // Feature the soonest matches that haven't finished (or the last round if done).
  let matches: KnockoutMatch[];
  if (phase === "done") {
    // Final + bronze, plus the semis — last 4 by kickoff.
    matches = all.slice(-4);
  } else {
    const upcoming = all.filter((m) => !m.result?.finished);
    matches = (upcoming.length > 0 ? upcoming : all).slice(0, 8);
  }

  return { phase, matches, koTeams };
}
