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

  // Mirror the dashboard's match window, then report per-market presence
  // for exactly those matches.
  const { data: upcoming } = await db
    .from("tm_matches")
    .select("id, home_team, away_team, commence_at")
    .eq("status", "upcoming")
    .gte("commence_at", new Date().toISOString())
    .order("commence_at", { ascending: true })
    .limit(30);
  const upMatches = (upcoming ?? []) as Array<{
    id: number;
    home_team: string;
    away_team: string;
    commence_at: string;
  }>;
  const upIds = upMatches.map((m) => m.id);

  const marketById = new Map(
    ((markets ?? []) as Array<{ id: number; key: string }>).map((m) => [m.id, m.key]),
  );
  const { data: latestForUp } = await db
    .from("tm_latest_odds")
    .select("match_id, market_id, outcome")
    .in("match_id", upIds.length ? upIds : [-1]);
  const byMatch: Record<number, Set<string>> = {};
  for (const r of (latestForUp ?? []) as Array<{ match_id: number; market_id: number }>) {
    const key = marketById.get(r.market_id) ?? String(r.market_id);
    (byMatch[r.match_id] ??= new Set()).add(key);
  }
  const dashboardMatches = upMatches.map((m) => ({
    match: `${m.home_team} v ${m.away_team}`,
    commence_at: m.commence_at,
    markets: [...(byMatch[m.id] ?? [])],
  }));

  // Sample the totals + btts latest odds with match name + commence time, to
  // confirm the ingested rows are real (and which matches own them).
  const totalsId = (markets ?? []).find(
    (m: { key: string }) => m.key === "totals",
  )?.id;
  const bttsId = (markets ?? []).find(
    (m: { key: string }) => m.key === "btts",
  )?.id;
  const sampleFor = async (marketId: number | undefined) => {
    if (marketId === undefined) return [];
    const { data } = await db
      .from("tm_latest_odds")
      .select("match_id, outcome, price, tm_matches(home_team, away_team, commence_at)")
      .eq("market_id", marketId)
      .limit(8);
    return (data ?? []) as unknown as Array<{
      match_id: number;
      outcome: string;
      price: number;
      tm_matches: { home_team: string; away_team: string; commence_at: string } | null;
    }>;
  };
  const now = new Date().toISOString();
  const totalsSample = (await sampleFor(totalsId)).map((r) => ({
    match: r.tm_matches ? `${r.tm_matches.home_team} v ${r.tm_matches.away_team}` : `#${r.match_id}`,
    commence_at: r.tm_matches?.commence_at,
    past: r.tm_matches ? r.tm_matches.commence_at < now : null,
    outcome: r.outcome,
    price: r.price,
  }));
  const bttsSample = (await sampleFor(bttsId)).map((r) => ({
    match: r.tm_matches ? `${r.tm_matches.home_team} v ${r.tm_matches.away_team}` : `#${r.match_id}`,
    commence_at: r.tm_matches?.commence_at,
    past: r.tm_matches ? r.tm_matches.commence_at < now : null,
    outcome: r.outcome,
    price: r.price,
  }));

  return NextResponse.json({
    markets,
    perMarket,
    dashboardMatches,
    totalsSample,
    bttsSample,
  });
}
