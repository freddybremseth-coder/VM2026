/**
 * Cron task — pull goal events from API-Football and persist them into
 * public.tournament_goals.
 *
 * Strategy:
 *   1. Pick finished matches (status='finished' in match_results) that have
 *      LESS than match_results.home_score + away_score rows already in
 *      tournament_goals — i.e. we're missing at least one goal.
 *   2. For each, call api-football's events endpoint (1 API call per match).
 *   3. Map AF team id → our internal team id via AF_TEAM_ID (inverted).
 *   4. Best-effort resolve scorer / assist names against the player DB so
 *      the leaderboard can link to player profiles.
 *   5. Upsert with the unique key (match_id, scorer_name, minute, is_own_goal),
 *      so re-runs are no-ops.
 *
 * Bounded at MAX_FIXTURES_PER_RUN matches per invocation; safe under the
 * 100/day API-Football free-tier ceiling.
 */

import { fetchApiFootballGoals, type MatchGoal } from "@/lib/match-events/api-football-provider";
import { AF_TEAM_ID } from "@/lib/api-football-ids";
import { getAllPlayers } from "@/lib/wc26-squads";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getPhase } from "./phase";
import type { CronTaskResult } from "./types";

const MAX_FIXTURES_PER_RUN = 5;

interface RunOptions {
  /** Override the cap on fixtures per run. */
  maxFixtures?: number;
  /** Force-resync these specific match ids (admin override). */
  matchIds?: number[];
}

/** Reverse map: AF team id → our internal team id. */
const INTERNAL_BY_AF_ID: Map<number, number> = (() => {
  const m = new Map<number, number>();
  for (const [internalStr, afId] of Object.entries(AF_TEAM_ID)) {
    if (afId > 0) m.set(afId, Number(internalStr));
  }
  return m;
})();

/**
 * Build a best-effort name → playerId lookup over the entire squad
 * database. Keyed by normalized full name AND by surname-within-team so
 * "L. Foster" still matches "Lyle Foster" on Burnley.
 */
function buildPlayerLookup() {
  const byNorm = new Map<string, number>();
  const surnameByTeam = new Map<string, number>();
  const norm = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[.\-']/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  for (const p of getAllPlayers()) {
    const fullN = norm(p.name);
    byNorm.set(fullN, p.id);
    // Surname (last word) within team
    const parts = fullN.split(" ");
    const surname = parts[parts.length - 1];
    surnameByTeam.set(`${p.teamId}|${surname}`, p.id);
  }
  return { byNorm, surnameByTeam, norm };
}

function resolvePlayerId(
  name: string,
  teamId: number,
  lookup: ReturnType<typeof buildPlayerLookup>,
): number | null {
  const n = lookup.norm(name);
  const direct = lookup.byNorm.get(n);
  if (direct) return direct;
  // Try "F. Surname" → "surname" within team
  const parts = n.split(" ");
  const surname = parts[parts.length - 1];
  return lookup.surnameByTeam.get(`${teamId}|${surname}`) ?? null;
}

export async function syncTournamentGoals(
  options: RunOptions = {},
): Promise<CronTaskResult> {
  const startedAt = performance.now();
  const task = "sync-goals";

  if (!process.env.API_FOOTBALL_KEY) {
    return {
      task,
      status: "skipped",
      summary: "API_FOOTBALL_KEY not set — skipped",
      durationMs: Math.round(performance.now() - startedAt),
    };
  }

  const phase = getPhase();
  if (phase !== "during" && !options.matchIds) {
    return {
      task,
      status: "skipped",
      summary: `Phase=${phase} — ingen kamper å synkronisere`,
      detail: { phase },
      durationMs: Math.round(performance.now() - startedAt),
    };
  }

  let admin: ReturnType<typeof createSupabaseAdminClient>;
  try {
    admin = createSupabaseAdminClient();
  } catch (err) {
    return {
      task,
      status: "failed",
      summary: err instanceof Error ? err.message : String(err),
      durationMs: Math.round(performance.now() - startedAt),
    };
  }

  // ─── Find finished matches with missing goals ───
  type MR = { match_id: number; home_score: number; away_score: number };
  let candidates: MR[];
  if (options.matchIds && options.matchIds.length > 0) {
    const { data } = await admin
      .from("match_results")
      .select("match_id, home_score, away_score")
      .in("match_id", options.matchIds);
    candidates = (data as MR[] | null) ?? [];
  } else {
    const { data } = await admin
      .from("match_results")
      .select("match_id, home_score, away_score")
      .eq("status", "finished");
    candidates = (data as MR[] | null) ?? [];
  }

  if (candidates.length === 0) {
    return {
      task,
      status: "ok",
      summary: "Ingen ferdige kamper å hente",
      detail: { callsMade: 0 },
      durationMs: Math.round(performance.now() - startedAt),
    };
  }

  // Already-logged counts per match.
  const ids = candidates.map((c) => c.match_id);
  type CountRow = { match_id: number; cnt: number };
  const { data: existingRows } = await admin
    .from("tournament_goals")
    .select("match_id")
    .in("match_id", ids);
  const existingByMatch = new Map<number, number>();
  for (const r of ((existingRows as { match_id: number }[] | null) ?? [])) {
    existingByMatch.set(r.match_id, (existingByMatch.get(r.match_id) ?? 0) + 1);
  }

  // Anything missing goals goes in the to-fetch queue.
  const queue = candidates
    .filter((c) => {
      if (options.matchIds) return true;
      const have = existingByMatch.get(c.match_id) ?? 0;
      const expected = c.home_score + c.away_score;
      return have < expected;
    })
    .slice(0, options.maxFixtures ?? MAX_FIXTURES_PER_RUN);

  if (queue.length === 0) {
    return {
      task,
      status: "ok",
      summary: "Alt allerede synkronisert",
      detail: { callsMade: 0, finishedMatches: candidates.length },
      durationMs: Math.round(performance.now() - startedAt),
    };
  }

  const playerLookup = buildPlayerLookup();
  let wrote = 0;
  let unresolvedTeam = 0;
  let callsMade = 0;
  const errors: Array<{ matchId: number; error: string }> = [];

  for (const c of queue) {
    try {
      const { goals } = await fetchApiFootballGoals(c.match_id);
      callsMade++;

      // For an admin re-sync, clear out existing rows for this match so we
      // don't fight the unique-key on naming corrections. Skipped on the
      // normal cron path to avoid losing manual edits.
      if (options.matchIds) {
        await admin.from("tournament_goals").delete().eq("match_id", c.match_id);
      }

      const rowsToInsert: Array<{
        match_id: number;
        team_id: number;
        scorer_name: string;
        scorer_player_id: number | null;
        assist_name: string | null;
        assist_player_id: number | null;
        minute: number;
        is_own_goal: boolean;
        is_penalty: boolean;
      }> = [];

      for (const g of goals) {
        const internalTeam = INTERNAL_BY_AF_ID.get(g.scoringAfTeamId);
        if (!internalTeam) {
          unresolvedTeam++;
          continue;
        }
        rowsToInsert.push({
          match_id: g.matchId,
          team_id: internalTeam,
          scorer_name: g.scorerName,
          scorer_player_id: resolvePlayerId(g.scorerName, internalTeam, playerLookup),
          assist_name: g.assistName,
          assist_player_id: g.assistName
            ? resolvePlayerId(g.assistName, internalTeam, playerLookup)
            : null,
          minute: g.minute,
          is_own_goal: g.isOwnGoal,
          is_penalty: g.isPenalty,
        });
      }

      if (rowsToInsert.length === 0) continue;
      const { error } = await admin
        .from("tournament_goals")
        .upsert(rowsToInsert, {
          onConflict: "match_id,scorer_name,minute,is_own_goal",
          ignoreDuplicates: !options.matchIds,
        });
      if (error) {
        errors.push({ matchId: c.match_id, error: error.message });
        continue;
      }
      wrote += rowsToInsert.length;
    } catch (err) {
      errors.push({
        matchId: c.match_id,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return {
    task,
    status: errors.length > 0 && wrote === 0 ? "failed" : "ok",
    summary: `Skrev ${wrote} mål fra ${queue.length} kamp${queue.length === 1 ? "" : "er"}${
      errors.length > 0 ? ` · ${errors.length} feilet` : ""
    }${unresolvedTeam > 0 ? ` · ${unresolvedTeam} ukjent lag` : ""}`,
    detail: { wrote, queue: queue.map((c) => c.match_id), callsMade, errors, unresolvedTeam },
    durationMs: Math.round(performance.now() - startedAt),
  };
}
