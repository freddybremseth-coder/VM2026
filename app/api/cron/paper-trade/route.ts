/**
 * Paper-trading cron — settle finished bets, then place new ones.
 *
 * Order matters: settle first so the realized bankroll is up to date before
 * we size the next round of Kelly stakes. Both steps are idempotent — settling
 * only touches open bets with a finished result, and placing skips selections
 * we already hold (DB unique constraint is the backstop).
 *
 * Auth: Bearer CRON_SECRET. Point cron-job.org at this in addition to the
 * existing /api/cron/tippemodell + /api/cron/refresh triggers (run it a few
 * minutes after those so fresh odds + results are already in).
 */

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { settleOpenBets, placeNewBets, resetAllBets } from "@/lib/tippemodell/paper-trade";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 120;

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const startedAt = new Date().toISOString();
  const admin = createSupabaseAdminClient();

  let settled = 0;
  let placed = 0;
  let reset = 0;
  const errors: string[] = [];

  // ?reset=1 wipes the ledger first — used to recover after the id-space fix.
  if (req.nextUrl.searchParams.get("reset") === "1") {
    try {
      reset = await resetAllBets(admin);
    } catch (e) {
      errors.push(`reset: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  try {
    settled = await settleOpenBets(admin);
  } catch (e) {
    errors.push(`settle: ${e instanceof Error ? e.message : String(e)}`);
  }
  try {
    placed = await placeNewBets(admin);
  } catch (e) {
    errors.push(`place: ${e instanceof Error ? e.message : String(e)}`);
  }

  return NextResponse.json({
    ok: errors.length === 0,
    startedAt,
    finishedAt: new Date().toISOString(),
    reset,
    settled,
    placed,
    errors,
  });
}
