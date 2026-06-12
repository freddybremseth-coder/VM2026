/**
 * Cron task — fetch live/final scores and write them into match_results.
 *
 * Phase-aware: only runs during the tournament. Each fixture costs ONE
 * api-football call (`/fixtures?id=`), much cheaper than the events task
 * (3 calls per fixture). Default cap is 10 fixtures per run.
 *
 * Once a row in `match_results` flips to `status='finished'`, the
 * grade_predictions_for_match trigger awards points and rolls
 * league_members.points — no app-side grading code needed.
 */

import { FIXTURES } from "@/lib/wc26-fixtures";
import { fetchApiFootballScore } from "@/lib/match-events/api-football-provider";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getPhase } from "./phase";
import type { CronTaskResult } from "./types";

const LOOKBACK_HOURS = 30;
const LOOKAHEAD_HOURS = 2;
const MAX_FIXTURES_PER_RUN = 10;

interface RunOptions {
  /** Override the default fixture cap (manual admin trigger). */
  maxFixtures?: number;
  /** Override the kickoff window in hours. */
  lookbackHours?: number;
  lookaheadHours?: number;
}

export async function fetchAndStoreResults(
  options: RunOptions = {},
): Promise<CronTaskResult> {
  const startedAt = performance.now();
  const task = "fetch-results";

  if (!process.env.API_FOOTBALL_KEY) {
    return {
      task,
      status: "skipped",
      summary: "API_FOOTBALL_KEY not set — skipped",
      durationMs: Math.round(performance.now() - startedAt),
    };
  }

  const phase = getPhase();
  if (phase !== "during") {
    return {
      task,
      status: "skipped",
      summary: `Phase=${phase} — ingen kamper å hente`,
      detail: { phase },
      durationMs: Math.round(performance.now() - startedAt),
    };
  }

  const lookback = (options.lookbackHours ?? LOOKBACK_HOURS) * 3_600_000;
  const lookahead = (options.lookaheadHours ?? LOOKAHEAD_HOURS) * 3_600_000;
  const max = options.maxFixtures ?? MAX_FIXTURES_PER_RUN;

  const now = Date.now();
  const windowStart = now - lookback;
  const windowEnd = now + lookahead;

  const candidates = FIXTURES.filter((f) => {
    const ts = new Date(f.kickoff).getTime();
    return ts >= windowStart && ts <= windowEnd;
  });

  const wrote: Array<{
    id: number;
    status: string;
    h: number | null;
    a: number | null;
  }> = [];
  const errors: Array<{ id: number; error: string }> = [];

  // Lazily create the admin client only if we'll use it.
  const admin = candidates.length > 0 ? createSupabaseAdminClient() : null;
  const cap = Math.min(candidates.length, max);

  for (let i = 0; i < cap; i++) {
    const fx = candidates[i];
    try {
      const score = await fetchApiFootballScore(fx.id);
      // Defensive: if the API returns no score yet (pre-kickoff edge case),
      // skip writing — we don't want a row of (0, 0, scheduled).
      if (score.homeScore === null || score.awayScore === null) {
        continue;
      }
      const { error } = await admin!.from("match_results").upsert(
        {
          match_id: fx.id,
          home_score: score.homeScore,
          away_score: score.awayScore,
          status: score.status,
          minute: score.minute,
        },
        { onConflict: "match_id" },
      );
      if (error) throw new Error(error.message);
      wrote.push({
        id: fx.id,
        status: score.status,
        h: score.homeScore,
        a: score.awayScore,
      });
    } catch (err) {
      errors.push({
        id: fx.id,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return {
    task,
    status: errors.length > 0 && wrote.length === 0 ? "failed" : "ok",
    summary: `Skrev ${wrote.length} resultat${wrote.length === 1 ? "" : "er"}${
      errors.length > 0 ? ` · ${errors.length} feilet` : ""
    }`,
    detail: { wrote, errors, callsMade: wrote.length + errors.length },
    durationMs: Math.round(performance.now() - startedAt),
  };
}
