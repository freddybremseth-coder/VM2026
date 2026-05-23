/**
 * Cron task #1 — refresh recently-finished matches.
 *
 * For each fixture in our schedule whose kickoff is within the last 36 hours
 * (i.e. plausibly finished or live recently), call the API-Football events
 * endpoint to refresh the cached stat snapshot, then invalidate the Next.js
 * cache for that match page so visitors see fresh data on the next load.
 *
 * Returns a CronTaskResult with the IDs that were refreshed.
 */

import { revalidatePath, revalidateTag } from "next/cache";
import { FIXTURES } from "@/lib/wc26-fixtures";
import { getMatchEvents } from "@/lib/match-events/provider";
import type { CronTaskResult } from "./types";

const LOOKBACK_HOURS = 36;
const LOOKAHEAD_HOURS = 2; // pick up matches that just kicked off too

export async function refreshFinishedMatches(): Promise<CronTaskResult> {
  const startedAt = performance.now();
  const task = "refresh-finished-matches";

  if (!process.env.API_FOOTBALL_KEY) {
    return {
      task,
      status: "skipped",
      summary: "API_FOOTBALL_KEY not set — skipping live refresh",
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

  // Sequential with a small cap — the API-Football free tier is 100 req/day
  // and we want to stay polite. 10 matches per run × 12 runs/day = 120 req.
  const cap = Math.min(candidates.length, 10);
  for (let i = 0; i < cap; i++) {
    const fx = candidates[i];
    try {
      const data = await getMatchEvents(fx.id);
      refreshed.push({
        id: fx.id,
        status: data.status,
        minute: data.minute,
      });
      // Invalidate the cached SSR snapshot for that match page
      revalidatePath(`/matches/${fx.id}/stats`);
      revalidatePath(`/matches/${fx.id}`);
    } catch (err) {
      errors.push({ id: fx.id, error: err instanceof Error ? err.message : String(err) });
    }
  }

  // Tag-based invalidation so any component that opts in via `next.tags`
  // also rebuilds on the next request.
  revalidateTag("matches");

  const failedCount = errors.length;
  const okCount = refreshed.length;

  return {
    task,
    status: failedCount > 0 && okCount === 0 ? "failed" : "ok",
    summary: `${okCount} kamper refreshet${failedCount ? `, ${failedCount} feilet` : ""} (vindu: ±${LOOKBACK_HOURS}t)`,
    detail: { refreshed, errors, considered: candidates.length },
    durationMs: Math.round(performance.now() - startedAt),
  };
}
