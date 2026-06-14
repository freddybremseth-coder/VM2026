/**
 * REST endpoint used by LiveTipsBoard for refetch on:
 *   - kickoff timer firing
 *   - Realtime payload arriving
 *   - polling tick (every 15–30 s near a kickoff)
 *   - visibilitychange / focus
 *
 * The user-bound supabase client runs the query, so the RLS policy from
 * migration 0004 enforces the kickoff reveal rule at the database layer
 * regardless of what the client asks for.
 */

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getLeagueTipsData } from "@/lib/leagues/league-tips";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: { leagueId: string } },
) {
  const supabase = createSupabaseServerClient();
  const data = await getLeagueTipsData(supabase, params.leagueId);
  if (!data) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.json(data, {
    headers: { "Cache-Control": "no-store" },
  });
}
