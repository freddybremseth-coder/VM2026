/**
 * One-shot setup: ensure the tippemodell league row matches OddsPapi's
 * actual tournament name ("World Cup", verified against the live feed).
 * Idempotent DML — safe to call repeatedly. Bearer CRON_SECRET auth.
 */

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("tm_leagues")
    .update({ name: "World Cup" })
    .eq("external_id", "fifa-wc-2026")
    .select("id, external_id, name");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, updated: data });
}
