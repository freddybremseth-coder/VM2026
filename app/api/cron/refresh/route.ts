/**
 * Periodic refresh worker — invoked by Vercel Cron every 2 hours.
 *
 * Schedule lives in vercel.json (`0 *​/2 * * *`). The endpoint:
 *
 *   1. Authenticates via the `Authorization: Bearer ${CRON_SECRET}` header
 *      that Vercel automatically sends. Reject anyone else.
 *   2. Runs three tasks in parallel (matches, squads, news/form).
 *   3. Builds a CronRunReport, stores it in-memory for /api/cron/status,
 *      and returns it as JSON so it's visible in the Vercel cron-run UI.
 *
 * Manual trigger for debugging:
 *   curl -H "Authorization: Bearer <CRON_SECRET>" https://<host>/api/cron/refresh
 */

import { NextRequest, NextResponse } from "next/server";
import { refreshFinishedMatches } from "@/lib/cron/refresh-matches";
import { checkSquadAnnouncements } from "@/lib/cron/check-squads";
import { refreshFormAndDetectNews } from "@/lib/cron/news-feed";
import { setLastCronRun } from "@/lib/cron/store";
import { getPhase } from "@/lib/cron/phase";
import type { CronRunReport, CronTaskResult } from "@/lib/cron/types";

// Worst-case calls per run, by phase, given the current caps:
//   pre    → 0 match + 3 squad + 3 form = 6 calls/run × 4 runs/day = 24/day
//   during → 15 match + 0 squad + 0 form = 15 calls/run × 4 runs/day = 60/day
//   post   → 0 (everything skipped)
const DAILY_BUDGET: Record<"pre" | "during" | "post", number> = {
  pre: 24,
  during: 60,
  post: 0,
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
// 60s should be plenty for 3 parallel API-Football calls; bumping to 300s to be safe.
export const maxDuration = 300;

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

async function safeRun(
  taskName: string,
  fn: () => Promise<CronTaskResult>,
): Promise<CronTaskResult> {
  const start = performance.now();
  try {
    return await fn();
  } catch (err) {
    return {
      task: taskName,
      status: "failed",
      summary: err instanceof Error ? err.message : String(err),
      detail: { error: String(err) },
      durationMs: Math.round(performance.now() - start),
    };
  }
}

export async function GET(req: NextRequest) {
  // Auth: only Vercel Cron (with CRON_SECRET) or explicit manual debug.
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) return unauthorized();
  } else {
    // No secret set → only allow from Vercel's cron infrastructure, identified
    // by the `x-vercel-cron` header (1 = invoked by cron). Block everything
    // else so the endpoint isn't publicly callable by accident.
    if (req.headers.get("x-vercel-cron") !== "1") return unauthorized();
  }

  const startedAt = new Date().toISOString();
  const t0 = performance.now();

  const [matches, squads, news] = await Promise.all([
    safeRun("refresh-finished-matches", refreshFinishedMatches),
    safeRun("check-squad-announcements", checkSquadAnnouncements),
    safeRun("refresh-form-detect-news", refreshFormAndDetectNews),
  ]);

  const tasks = [matches, squads, news];
  const ok = tasks.every((t) => t.status !== "failed");
  const phase = getPhase();

  // Sum up the per-task `callsMade` value if present in detail.
  const callsMade = tasks.reduce((sum, t) => {
    const d = t.detail as { callsMade?: number } | undefined;
    return sum + (typeof d?.callsMade === "number" ? d.callsMade : 0);
  }, 0);

  const report: CronRunReport = {
    startedAt,
    finishedAt: new Date().toISOString(),
    durationMs: Math.round(performance.now() - t0),
    tasks,
    ok,
    phase,
    callsMade,
    dailyBudgetEstimate: DAILY_BUDGET[phase],
  };

  setLastCronRun(report);

  // Log a structured line so Vercel's log explorer can filter on it.
  console.log("[cron/refresh]", JSON.stringify({
    ok,
    phase,
    callsMade,
    dailyBudgetEstimate: DAILY_BUDGET[phase],
    durationMs: report.durationMs,
    summaries: tasks.map((t) => `${t.task}: ${t.status} — ${t.summary ?? ""}`),
  }));

  return NextResponse.json(report, { status: ok ? 200 : 500 });
}
