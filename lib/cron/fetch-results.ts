/**
 * Cron task — fetch live/final scores and write them into match_results.
 *
 * v3: uses the ESPN fixture resolver. API-Football's free tier doesn't cover
 * the 2026 season, so we hit ESPN's public scoreboard
 * (https://site.api.espn.com/.../soccer/fifa.world/scoreboard) instead — no
 * API key required and the response carries goals + status, so still ONE
 * fetch per UTC day in the window.
 *
 * Once a row in `match_results` flips to `status='finished'`, the
 * grade_predictions_for_match trigger awards points and rolls
 * league_members.points — no app-side grading code needed.
 */

import { FIXTURES } from "@/lib/wc26-fixtures";
import {
  fetchEspnFixturesInWindow,
  matchEspnToInternal,
} from "@/lib/cron/espn-fixture-resolver";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getPhase } from "./phase";
import type { CronTaskResult } from "./types";

// ESPN is free + has no daily quota, so we widen the window to cover the
// whole tournament. The earlier 30h lookback was an API-Football-era safety
// margin; under ESPN it left earlier matches stuck out of the candidate
// set forever.
const LOOKBACK_HOURS = 24 * 40; // 40 days — covers the entire WC 2026
const LOOKAHEAD_HOURS = 12;

interface RunOptions {
  /** Override the kickoff window in hours. */
  lookbackHours?: number;
  lookaheadHours?: number;
}

export async function fetchAndStoreResults(
  options: RunOptions = {},
): Promise<CronTaskResult> {
  const startedAt = performance.now();
  const task = "fetch-results";

  // ESPN's public endpoint needs no key — the previous gate on
  // API_FOOTBALL_KEY would block this cron forever. Removed.

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

  const now = Date.now();
  const windowStart = now - lookback;
  const windowEnd = now + lookahead;

  const candidates = FIXTURES.filter((f) => {
    const ts = new Date(f.kickoff).getTime();
    return ts >= windowStart && ts <= windowEnd;
  });

  if (candidates.length === 0) {
    return {
      task,
      status: "ok",
      summary: "Ingen kamper i vinduet",
      detail: { callsMade: 0 },
      durationMs: Math.round(performance.now() - startedAt),
    };
  }

  // One fetch per UTC day in the window — response includes goals + status.
  let resolved;
  try {
    const espn = await fetchEspnFixturesInWindow(windowStart, windowEnd);
    resolved = matchEspnToInternal(espn, candidates);
  } catch (err) {
    return {
      task,
      status: "failed",
      summary: err instanceof Error ? err.message : String(err),
      detail: { callsMade: 1 },
      durationMs: Math.round(performance.now() - startedAt),
    };
  }

  const wrote: Array<{
    id: number;
    espnId: string;
    status: string;
    h: number | null;
    a: number | null;
  }> = [];
  const skipped: number[] = [];
  const errors: Array<{ id: number; error: string }> = [];

  let admin: ReturnType<typeof createSupabaseAdminClient>;
  try {
    admin = createSupabaseAdminClient();
  } catch (err) {
    return {
      task,
      status: "failed",
      summary: err instanceof Error ? err.message : String(err),
      detail: { callsMade: 1 },
      durationMs: Math.round(performance.now() - startedAt),
    };
  }

  for (const r of resolved) {
    // Defensive: pre-kickoff fixtures have null goals — don't write (0,0).
    if (r.homeScore === null || r.awayScore === null) {
      skipped.push(r.internalId);
      continue;
    }
    // ESPN returns score=0 for scheduled fixtures, which would otherwise
    // land as a real 0-0 draw in match_results. Skip anything that
    // hasn't actually kicked off yet.
    if (r.status === "scheduled") {
      skipped.push(r.internalId);
      continue;
    }
    const { error } = await admin.from("match_results").upsert(
      {
        match_id: r.internalId,
        home_score: r.homeScore,
        away_score: r.awayScore,
        status: r.status,
        minute: r.minute,
      },
      { onConflict: "match_id" },
    );
    if (error) {
      errors.push({ id: r.internalId, error: error.message });
    } else {
      wrote.push({
        id: r.internalId,
        espnId: r.espnId,
        status: r.status,
        h: r.homeScore,
        a: r.awayScore,
      });
    }
  }

  const unmatched = candidates.length - resolved.length;

  return {
    task,
    status: errors.length > 0 && wrote.length === 0 ? "failed" : "ok",
    summary: `Skrev ${wrote.length} resultat${wrote.length === 1 ? "" : "er"}${
      unmatched > 0 ? ` · ${unmatched} umatchet` : ""
    }${errors.length > 0 ? ` · ${errors.length} feilet` : ""}`,
    detail: { wrote, skipped, errors, unmatched, callsMade: 1 },
    durationMs: Math.round(performance.now() - startedAt),
  };
}
