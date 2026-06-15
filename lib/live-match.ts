/**
 * Single fetch helper for "live state of one fixture" — pulls the
 * authoritative score, status, minute, and goal log from Supabase, joins it
 * with the in-code fixture / team / venue data, and returns one shape the
 * match-detail UI can render directly.
 *
 * Used by the match layout to decide between:
 *   - scheduled  → pre-match preview + "Tipp denne kampen" CTA
 *   - live/ht    → score hero + locked tip CTA
 *   - finished   → final score + goal list + locked tip CTA + stats
 *
 * Returns null when the fixture id doesn't exist; never throws.
 */

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { fixtureById } from "@/lib/wc26-fixtures";
import { teamById, teamName, venueById } from "@/lib/wc26-data";
import type { FixtureStatus } from "@/lib/predictions-visibility";

export interface LiveMatchTeam {
  id: number;
  name: string;
  shortName: string;
  flag: string;
  formation: string;
  manager: string;
}

export interface LiveMatchGoal {
  /** Internal team id credited with the goal. */
  teamId: number;
  /** "home" / "away" relative to this fixture. */
  side: "home" | "away";
  scorerName: string;
  scorerPlayerId: number | null;
  assistName: string | null;
  minute: number;
  isOwnGoal: boolean;
  isPenalty: boolean;
}

export interface LiveMatchView {
  id: number;
  stage: string;
  kickoff: string;
  venue: { name: string; city: string; capacity: number };
  teams: {
    home?: LiveMatchTeam;
    away?: LiveMatchTeam;
  };
  /**
   * Status for this fixture. Mirrors `match_results.status` when a row
   * exists; falls back to "scheduled" otherwise. Used for lock decisions
   * and rendering branches.
   */
  status: FixtureStatus;
  /** Goals scored so far, in chronological order. Empty until kickoff. */
  goals: LiveMatchGoal[];
  /** Final / current score. null when match hasn't started. */
  score: { home: number; away: number } | null;
  /** In-progress minute (1–130). null when not live. */
  minute: number | null;
}

const STAGE_LABELS: Record<string, string> = {
  R32: "Round of 32",
  R16: "Round of 16",
  QF: "Quarter-final",
  SF: "Semi-final",
  "3RD": "Third place playoff",
  FINAL: "Final",
};

function wrapTeam(id: number): LiveMatchTeam | undefined {
  const t = teamById(id);
  if (!t) return undefined;
  return {
    id: t.id,
    name: teamName(t),
    shortName: t.shortName,
    flag: t.flag,
    formation: t.preferredFormation ?? "4-3-3",
    manager: t.manager ?? "",
  };
}

interface ResultRow {
  status: string;
  home_score: number | null;
  away_score: number | null;
  minute: number | null;
}

interface GoalRow {
  team_id: number;
  scorer_name: string;
  scorer_player_id: number | null;
  assist_name: string | null;
  minute: number;
  is_own_goal: boolean;
  is_penalty: boolean;
}

function isValidStatus(s: string): s is FixtureStatus {
  return (
    s === "scheduled" ||
    s === "postponed" ||
    s === "cancelled" ||
    s === "live" ||
    s === "halftime" ||
    s === "finished"
  );
}

export async function getLiveMatch(id: number): Promise<LiveMatchView | null> {
  const fx = fixtureById(id);
  if (!fx) return null;
  const venue = venueById(fx.venueId);
  const stage =
    fx.stage.kind === "group"
      ? `Gruppe ${fx.stage.group} · Matchday ${fx.stage.matchday}`
      : STAGE_LABELS[fx.stage.round] ?? "Sluttspill";

  let status: FixtureStatus = "scheduled";
  let score: LiveMatchView["score"] = null;
  let minute: number | null = null;
  let goals: LiveMatchGoal[] = [];

  try {
    const supabase = createSupabaseServerClient();

    // Pull score + status in parallel with goals.
    const [resultRes, goalsRes] = await Promise.all([
      supabase
        .from("match_results")
        .select("status, home_score, away_score, minute")
        .eq("match_id", id)
        .maybeSingle(),
      supabase
        .from("tournament_goals")
        .select("team_id, scorer_name, scorer_player_id, assist_name, minute, is_own_goal, is_penalty")
        .eq("match_id", id)
        .order("minute", { ascending: true }),
    ]);

    const result = resultRes.data as ResultRow | null;
    if (result) {
      if (isValidStatus(result.status)) status = result.status;
      if (result.home_score !== null && result.away_score !== null) {
        score = { home: result.home_score, away: result.away_score };
      }
      minute = result.minute;
    }

    const goalRows = (goalsRes.data as GoalRow[] | null) ?? [];
    goals = goalRows.map((g) => ({
      teamId: g.team_id,
      side: g.team_id === fx.homeId ? "home" : "away",
      scorerName: g.scorer_name,
      scorerPlayerId: g.scorer_player_id,
      assistName: g.assist_name,
      minute: g.minute,
      isOwnGoal: g.is_own_goal,
      isPenalty: g.is_penalty,
    }));
  } catch {
    // Supabase unreachable — degrade to pure-fixture view.
  }

  return {
    id: fx.id,
    stage,
    kickoff: fx.kickoff,
    venue: {
      name: venue?.name ?? "TBD",
      city: venue?.city ?? "TBD",
      capacity: venue?.capacity ?? 0,
    },
    teams: {
      home: fx.homeId ? wrapTeam(fx.homeId) : undefined,
      away: fx.awayId ? wrapTeam(fx.awayId) : undefined,
    },
    status,
    goals,
    score,
    minute,
  };
}
