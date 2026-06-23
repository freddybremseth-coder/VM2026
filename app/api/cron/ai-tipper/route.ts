/**
 * AI-tipper cron — keep "Spill med Freddy" in the competition.
 *
 * Ensures the bot user exists + is in every mini-league, then upserts its
 * model-optimal scoreline for every upcoming match before kickoff. Idempotent;
 * point it at cron-job.org alongside the other triggers. The match_results
 * grading trigger scores Freddy's tips exactly like a human's.
 *
 * Auth: Bearer CRON_SECRET.
 */

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ensureBotUser, generateBotPredictions, BOT_DISPLAY_NAME } from "@/lib/ai-tipper";

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

  try {
    const botId = await ensureBotUser(admin);
    const predictions = await generateBotPredictions(admin, botId);
    return NextResponse.json({
      ok: true,
      startedAt,
      finishedAt: new Date().toISOString(),
      bot: BOT_DISPLAY_NAME,
      botId,
      predictionsWritten: predictions,
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
