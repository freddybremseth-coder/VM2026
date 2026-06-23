/**
 * Diag — inspects tm_markets + odds counts per market so we can see whether
 * totals/btts rows exist and whether the latest-odds view returns them.
 * Bearer auth. Temporary.
 */

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const db = createSupabaseAdminClient();

  const { data: markets } = await db.from("tm_markets").select("id, key, name");

  // Snapshot + latest-odds counts per market.
  const perMarket: Record<string, { snapshots: number; latest: number; sampleOutcomes: string[] }> = {};
  for (const m of (markets ?? []) as Array<{ id: number; key: string }>) {
    const { count: snap } = await db
      .from("tm_odds_snapshots")
      .select("*", { count: "exact", head: true })
      .eq("market_id", m.id);
    const { data: latestRows, count: latest } = await db
      .from("tm_latest_odds")
      .select("outcome", { count: "exact" })
      .eq("market_id", m.id)
      .limit(5);
    perMarket[m.key] = {
      snapshots: snap ?? 0,
      latest: latest ?? 0,
      sampleOutcomes: [
        ...new Set(((latestRows ?? []) as Array<{ outcome: string }>).map((r) => r.outcome)),
      ],
    };
  }

  return NextResponse.json({ markets, perMarket });
}
