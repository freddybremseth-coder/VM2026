/**
 * Read-only status endpoint — shows the last cron run report.
 *
 * Returns 200 + report when a run has happened on this instance, or 200 +
 * { ok: true, report: null } if the instance is cold. We don't gate this
 * behind auth because the report contains no secrets — just timing data
 * and short summaries of what changed.
 */

import { NextResponse } from "next/server";
import { getLastCronRun } from "@/lib/cron/store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const report = getLastCronRun();
  return NextResponse.json(
    {
      ok: true,
      hasRun: report !== null,
      report,
    },
    {
      headers: {
        // Don't cache — we always want the freshest in-memory state.
        "Cache-Control": "no-store",
      },
    },
  );
}
