/**
 * Cached entry point for the tournament simulator — the 10k-iteration
 * Poisson Monte Carlo isn't free (~400ms), so we wrap it in Next.js
 * `unstable_cache` keyed on the current count of match_results.
 *
 * The cache invalidates automatically once cron writes a new result row,
 * so the sim re-runs at most once per cron tick (15 min via cron-job.org).
 */

import { unstable_cache } from "next/cache";
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

const cached = unstable_cache(
  async (fingerprint: string): Promise<SimResult> => {
    // fingerprint is part of the cache key — when results change, this
    // string changes and the cache misses, re-running the sim.
    void fingerprint;
    const rows = await loadResultRows();
    return runTournamentSim(rows);
  },
  ["tournament-predictions"],
  { revalidate: 900 }, // 15 min safety net
);

/**
 * Get the cached tournament predictions. Re-runs the sim when either:
 *   - 15 min have passed since the last run, OR
 *   - The result fingerprint changes (count, any score, or any status).
 */
export async function getTournamentPredictions(): Promise<SimResult> {
  const rows = await loadResultRows();
  return cached(fingerprintResults(rows));
}

/** Convenience: probability rows for one team, or null. */
export async function getTeamPrediction(
  teamId: number,
): Promise<TeamPrediction | null> {
  const sim = await getTournamentPredictions();
  return sim.perTeam.find((p) => p.teamId === teamId) ?? null;
}
