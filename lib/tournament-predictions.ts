/**
 * Cached entry point for the tournament simulator — the 10k-iteration
 * Poisson Monte Carlo isn't free (~400ms), so we wrap it in Next.js
 * `unstable_cache` keyed on the current count of match_results.
 *
 * The cache invalidates automatically once cron writes a new result row,
 * so the sim re-runs at most once per cron tick (15 min via cron-job.org).
 */

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  runTournamentSim,
  type SimResult,
  type TeamPrediction,
} from "@/lib/tournament-sim";
import type { ResultRow } from "@/lib/group-standings";

async function loadResultRows(): Promise<ResultRow[]> {
  try {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase
      .from("match_results")
      .select("match_id, home_score, away_score, status");
    // Only count matches that have actually been played. ESPN sometimes
    // writes score=0 for scheduled fixtures, so a null-only filter
    // wrongly treats them as real 0-0 draws.
    return ((data as ResultRow[] | null) ?? []).filter(
      (r) =>
        r.home_score !== null &&
        r.away_score !== null &&
        (r.status === "finished" || r.status === "live" || r.status === "halftime"),
    );
  } catch {
    return [];
  }
}

/**
 * Fingerprint of the result set — covers row count, every score, and every
 * status. Any change (new row, edited score, status flip) flips the
 * fingerprint and invalidates the cache. Using only row count missed
 * mid-fixture edits where a score moved up but the row count stayed put.
 */
function fingerprintResults(rows: ResultRow[]): string {
  let sumScores = 0;
  let statusHash = 0;
  for (const r of rows) {
    sumScores += (r.home_score ?? 0) + (r.away_score ?? 0);
    // Mix the status into the fingerprint so a status-only flip
    // (scheduled → finished) is detected even at 0-0.
    for (let i = 0; i < r.status.length; i++) {
      statusHash = (statusHash * 31 + r.status.charCodeAt(i)) | 0;
    }
  }
  return `${rows.length}-${sumScores}-${statusHash}`;
}

/**
 * Per-Vercel-instance in-memory cache, keyed on the result fingerprint.
 * Earlier attempt used unstable_cache, but Vercel's Data Cache held the
 * old SimResult even when our cache key changed — so a 0-9 Tunisia kept
 * showing a 41% R32 from when scheduled rows were polluting the input.
 *
 * In-memory is per-instance (each serverless function warms its own
 * Map), but that's fine: every instance recomputes once per fingerprint
 * change, the sim runs in ~700ms, and there's never stale data.
 *
 * We cap the map at 4 entries so an instance can't grow without bound
 * when results churn during a match.
 */
const memCache = new Map<string, SimResult>();
const MAX_ENTRIES = 4;

/**
 * Get tournament predictions for the current state of match_results.
 * Recomputes when the fingerprint changes (count, any score, or any
 * status flip). Otherwise returns the cached SimResult instantly.
 */
export async function getTournamentPredictions(): Promise<SimResult> {
  const rows = await loadResultRows();
  const fingerprint = fingerprintResults(rows);

  const hit = memCache.get(fingerprint);
  if (hit) return hit;

  const sim = runTournamentSim(rows);
  memCache.set(fingerprint, sim);

  // Trim the oldest entry if we're over the cap.
  if (memCache.size > MAX_ENTRIES) {
    const oldest = memCache.keys().next().value;
    if (oldest !== undefined) memCache.delete(oldest);
  }

  return sim;
}

/** Convenience: probability rows for one team, or null. */
export async function getTeamPrediction(
  teamId: number,
): Promise<TeamPrediction | null> {
  const sim = await getTournamentPredictions();
  return sim.perTeam.find((p) => p.teamId === teamId) ?? null;
}
