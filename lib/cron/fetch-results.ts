/**
 * Cron task — fetch live/final scores and write them into match_results.
 *
 * v2: uses the AF fixture resolver. ONE api-football call per run
 * (`/fixtures?league=1&season=2026&from=…&to=…`) returns every WC fixture in
 * the window WITH goals + status, and we match them to our internal fixture
 * ids by team names + kickoff. The old version passed our internal ids
 * (1–110) straight to `/fixtures?id=` — which are API-Football's own,
 * unrelated fixture ids — so results never landed.
 *
 * Once a row in `match_results` flips to `status='finished'`, the
 * grade_predictions_for_match trigger awards points and rolls
 * league_members.points — no app-side grading code needed.
 */

import { FIXTURES } from "@/lib/wc26-fixtures";
import {
  fetchAfFixturesInWindow,
  matchAfToInternal,
} from "@/lib/cron/af-fixture-resolver";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getPhase } from "./phase";
import type { CronTaskResult } from "./types";

const LOOKBACK_HOURS = 30;
const LOOKAHEAD_HOURS = 2;

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

  // ONE api call for the whole window — response includes goals + status.
  let resolved;
  try {
    const af = await fetchAfFixturesInWindow(windowStart, windowEnd);
    resolved = matchAfToInternal(af, candidates);
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
    afId: number;
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
        afId: r.afId,
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
