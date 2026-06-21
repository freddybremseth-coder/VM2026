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
    return ((data as ResultRow[] | null) ?? []).filter(
      (r) => r.home_score !== null && r.away_score !== null,
    );
  } catch {
    return [];
  }
}

const cached = unstable_cache(
  async (resultCount: number): Promise<SimResult> => {
    // resultCount is part of the cache key — it changes when cron writes
    // a new result row, which invalidates this cache automatically.
    void resultCount;
    const rows = await loadResultRows();
    return runTournamentSim(rows);
  },
  ["tournament-predictions"],
  { revalidate: 900 }, // 15 min safety net
);

/**
 * Get the cached tournament predictions. Re-runs the sim when either:
 *   - 15 min have passed since the last run, OR
 *   - The number of result rows has changed (a cron tick wrote a result).
 */
export async function getTournamentPredictions(): Promise<SimResult> {
  // Cheap COUNT query to use as part of the cache key.
  let count = 0;
  try {
    const supabase = createSupabaseServerClient();
    const { count: c } = await supabase
      .from("match_results")
      .select("*", { count: "exact", head: true });
    count = c ?? 0;
  } catch {
    // fall through with count=0 — cache will key on 0 until DB is reachable.
  }
  return cached(count);
}

/** Convenience: probability rows for one team, or null. */
export async function getTeamPrediction(
  teamId: number,
): Promise<TeamPrediction | null> {
  const sim = await getTournamentPredictions();
  return sim.perTeam.find((p) => p.teamId === teamId) ?? null;
}
