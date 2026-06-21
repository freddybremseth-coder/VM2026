/**
 * Debug endpoint — dumps every match_results row so we can spot stale or
 * mis-mapped entries that wouldn't show up via ESPN today.
 *
 * Bearer CRON_SECRET auth. Throwaway, can be deleted after investigation.
 */

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("match_results")
    .select("match_id, home_score, away_score, status, minute, updated_at")
    .order("match_id");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ count: data?.length ?? 0, rows: data ?? [] });
}
