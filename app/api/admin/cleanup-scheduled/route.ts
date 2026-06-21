/**
 * One-shot cleanup: delete match_results rows that were written as
 * status=scheduled (they came in as ESPN's 0-0 placeholder for unstarted
 * fixtures and skewed the simulator).
 *
 * Bearer CRON_SECRET auth.
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
    .from("match_results")
    .delete()
    .eq("status", "scheduled")
    .select("match_id");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const rows = (data ?? []) as Array<{ match_id: number }>;
  return NextResponse.json({
    deleted: rows.length,
    matchIds: rows.map((r) => r.match_id),
  });
}
