/**
 * Diag — for the first upcoming match, lists every OddsPapi market id the
 * first bookmaker offers, with each market's outcome ids + prices, so we
 * can identify which numeric ids are Over/Under (totals) and BTTS. Bearer
 * auth. Temporary — delete after the market map is built.
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
  const apiKey = process.env.ODDS_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "no key" }, { status: 500 });

  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("tm_matches")
    .select("external_id, home_team, away_team")
    .eq("status", "upcoming")
    .order("commence_at", { ascending: true })
    .limit(8);
  const candidates = (data ?? []) as Array<{
    external_id: string;
    home_team: string;
    away_team: string;
  }>;
  if (candidates.length === 0) {
    return NextResponse.json({ error: "no match" }, { status: 404 });
  }

  // Try several fixtures — individual ones can 403 once they lock/start.
  let m: (typeof candidates)[number] | undefined;
  let odds:
    | {
        bookmakerOdds?: Record<
          string,
          {
            markets?: Record<
              string,
              { outcomes?: Record<string, { players?: Record<string, { price?: number }> }> }
            >;
          }
        >;
      }
    | undefined;
  const errors: string[] = [];
  for (const c of candidates) {
    const url = new URL("https://api.oddspapi.io/v4/odds");
    url.searchParams.set("apiKey", apiKey);
    url.searchParams.set("fixtureId", c.external_id);
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (res.ok) {
      m = c;
      odds = await res.json();
      break;
    }
    errors.push(`${c.home_team} v ${c.away_team}: ${res.status}`);
  }
  if (!m || !odds) {
    return NextResponse.json({ error: "all fixtures failed", errors }, { status: 502 });
  }

  const bo = odds.bookmakerOdds ?? {};
  const firstKey = Object.keys(bo)[0];
  const markets = bo[firstKey]?.markets ?? {};

  // Compact: marketId → [{outcomeId, price}], capped at a few outcomes each.
  const summary: Record<string, Array<{ outcome: string; price: number | undefined }>> = {};
  for (const [marketId, market] of Object.entries(markets)) {
    const rows: Array<{ outcome: string; price: number | undefined }> = [];
    for (const [outcomeId, oc] of Object.entries(market.outcomes ?? {})) {
      rows.push({ outcome: outcomeId, price: oc.players?.["0"]?.price });
      if (rows.length >= 6) break;
    }
    summary[marketId] = rows;
  }

  return NextResponse.json({
    match: `${m.home_team} v ${m.away_team}`,
    bookmaker: firstKey,
    marketCount: Object.keys(markets).length,
    markets: summary,
  });
}
