/**
 * Cron task #1 — refresh recently-finished matches.
 *
 * Phase-aware: only runs during the tournament. Before kickoff there are no
 * WC fixtures to refresh — international friendlies & qualifiers are handled
 * by the form-news task instead.
 *
 * Per run we refresh at most 5 fixtures (3 API calls each = 15 calls/run).
 * With the 6-hour cron schedule = 4 runs/day → max 60 match calls/day.
 */

import { revalidatePath, revalidateTag } from "next/cache";
import { FIXTURES } from "@/lib/wc26-fixtures";
import { getMatchEvents } from "@/lib/match-events/provider";
import { getPhase } from "./phase";
import type { CronTaskResult } from "./types";

const LOOKBACK_HOURS = 30;   // catch matches that just finished
const LOOKAHEAD_HOURS = 1;   // and the one currently in progress
const MAX_FIXTURES_PER_RUN = 5;
const CALLS_PER_FIXTURE = 3; // fixtures + events + statistics

export async function refreshFinishedMatches(): Promise<CronTaskResult> {
  const startedAt = performance.now();
  const task = "refresh-finished-matches";

  if (!process.env.API_FOOTBALL_KEY) {
    return {
      task,
      status: "skipped",
      summary: "API_FOOTBALL_KEY not set",
      durationMs: Math.round(performance.now() - startedAt),
    };
  }

  const phase = getPhase();
  if (phase !== "during") {
    return {
      task,
      status: "skipped",
      summary: `Phase=${phase} — ingen WC-kamper å oppdatere`,
      detail: { phase, callsMade: 0 },
      durationMs: Math.round(performance.now() - startedAt),
    };
  }

  const now = Date.now();
  const windowStart = now - LOOKBACK_HOURS * 3600_000;
  const windowEnd = now + LOOKAHEAD_HOURS * 3600_000;

  const candidates = FIXTURES.filter((f) => {
    const ts = new Date(f.kickoff).getTime();
    return ts >= windowStart && ts <= windowEnd;
  });

  const refreshed: Array<{ id: number; status: string; minute?: number }> = [];
  const errors: Array<{ id: number; error: string }> = [];

  const cap = Math.min(candidates.length, MAX_FIXTURES_PER_RUN);
  for (let i = 0; i < cap; i++) {
    const fx = candidates[i];
    try {
      const data = await getMatchEvents(fx.id);
      refreshed.push({ id: fx.id, status: data.status, minute: data.minute });
      revalidatePath(`/matches/${fx.id}/stats`);
      revalidatePath(`/matches/${fx.id}`);
    } catch (err) {
      errors.push({ id: fx.id, error: err instanceof Error ? err.message : String(err) });
    }
  }

  revalidateTag("matches");

  const okCount = refreshed.length;
  const failedCount = errors.length;
  const callsMade = (okCount + failedCount) * CALLS_PER_FIXTURE;

  return {
    task,
    status: failedCount > 0 && okCount === 0 ? "failed" : "ok",
    summary: `${okCount} kamper refreshet${failedCount ? `, ${failedCount} feilet` : ""} · ~${callsMade} API-calls`,
    detail: {
      refreshed,
      errors,
      considered: candidates.length,
      callsMade,
      capPerRun: MAX_FIXTURES_PER_RUN * CALLS_PER_FIXTURE,
    },
    durationMs: Math.round(performance.now() - startedAt),
  };
}
