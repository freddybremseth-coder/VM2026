/**
 * Server-side loader for the /tippemodell dashboard.
 *
 * Pulls the latest snapshot per (match, bookmaker, market, outcome) from
 * tm_latest_odds, joins it with bookmaker metadata, and computes:
 *   - bestPrice per outcome (highest decimal odds anyone is offering)
 *   - fair probability via de-vigging the sharp line (Pinnacle/SBOBet)
 *     when all three sharp prices exist, falling back to de-vigging the
 *     best market prices when not.
 *   - edge of the best price over fair, which the UI uses to flag value.
 *
 * Restricted to the 1X2 (`h2h`) market for fase 1; totals/btts come later.
 */

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { bestPrice, devig, edge } from "@/lib/tippemodell/odds-math";

export interface BookPrice {
  bookmaker: string;
  isSharp: boolean;
  price: number;
}

export type OutcomeKey = "home" | "draw" | "away";

export interface OutcomeView {
  outcome: OutcomeKey;
  label: "1" | "X" | "2";
  best: BookPrice | null;
  sharp: number | null;
  fairProb: number | null;
  bookCount: number;
  /** > 0 means best market price beats fair odds — potential value. */
  edge: number | null;
}

export interface MatchView {
  matchId: number;
  externalId: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  commenceAt: string;
  wc26FixtureId: number | null;
  outcomes: OutcomeView[];
}

const LABELS: Record<OutcomeKey, "1" | "X" | "2"> = {
  home: "1",
  draw: "X",
  away: "2",
};

interface MatchRow {
  id: number;
  external_id: string;
  home_team: string;
  away_team: string;
  commence_at: string;
  wc26_fixture_id: number | null;
  tm_leagues: { name: string } | null;
}

interface OddsRow {
  outcome: string;
  price: number;
  bookmaker_id: number;
}

interface BookmakerRow {
  id: number;
  title: string;
  is_sharp: boolean;
}

interface MarketRow {
  id: number;
  key: string;
}

export async function getTippemodellDashboard(): Promise<MatchView[]> {
  const supabase = createSupabaseServerClient();

  // Find the h2h market id once.
  const { data: marketData } = await supabase
    .from("tm_markets")
    .select("id, key")
    .eq("key", "h2h")
    .maybeSingle();
  const market = marketData as MarketRow | null;
  if (!market) return [];

  // Upcoming matches, soonest first.
  const { data: matchesData } = await supabase
    .from("tm_matches")
    .select(
      "id, external_id, home_team, away_team, commence_at, wc26_fixture_id, tm_leagues(name)",
    )
    .eq("status", "upcoming")
    .gte("commence_at", new Date().toISOString())
    .order("commence_at", { ascending: true })
    .limit(30);
  const matches = (matchesData ?? []) as unknown as MatchRow[];
  if (matches.length === 0) return [];

  const matchIds = matches.map((m) => m.id);

  // Latest odds for those matches + h2h market.
  const { data: oddsData } = await supabase
    .from("tm_latest_odds")
    .select("match_id, outcome, price, bookmaker_id")
    .in("match_id", matchIds)
    .eq("market_id", market.id);
  const oddsRows = (oddsData ?? []) as unknown as Array<
    OddsRow & { match_id: number }
  >;

  // Bookmaker metadata.
  const bmIds = [...new Set(oddsRows.map((o) => o.bookmaker_id))];
  let bmById = new Map<number, BookmakerRow>();
  if (bmIds.length > 0) {
    const { data: bmsData } = await supabase
      .from("tm_bookmakers")
      .select("id, title, is_sharp")
      .in("id", bmIds);
    bmById = new Map(
      ((bmsData ?? []) as BookmakerRow[]).map((b) => [b.id, b]),
    );
  }

  const out: MatchView[] = [];
  for (const m of matches) {
    const matchOdds = oddsRows.filter((o) => o.match_id === m.id);
    if (matchOdds.length === 0) continue;

    const outcomes: OutcomeView[] = (["home", "draw", "away"] as const).map(
      (oc) => {
        const rows = matchOdds
          .filter((o) => o.outcome === oc)
          .map((o) => {
            const bm = bmById.get(o.bookmaker_id);
            return {
              bookmaker: bm?.title ?? "?",
              isSharp: bm?.is_sharp ?? false,
              price: Number(o.price),
            };
          });
        const best = bestPrice(rows);
        const sharpRow = rows.find((r) => r.isSharp) ?? null;
        return {
          outcome: oc,
          label: LABELS[oc],
          best,
          sharp: sharpRow?.price ?? null,
          fairProb: null,
          bookCount: rows.length,
          edge: null,
        };
      },
    );

    // Compute fair probabilities — prefer sharp line, fall back to best.
    const sharpPrices = outcomes.map((o) => o.sharp);
    let fair: number[] | null = null;
    if (sharpPrices.every((p): p is number => p != null)) {
      fair = devig(sharpPrices);
    } else {
      const bp = outcomes.map((o) => o.best?.price ?? null);
      if (bp.every((p): p is number => p != null)) {
        fair = devig(bp as number[]);
      }
    }
    if (fair) {
      outcomes.forEach((o, i) => {
        o.fairProb = fair![i];
        o.edge = edge(o.best?.price ?? null, fair![i]);
      });
    }

    out.push({
      matchId: m.id,
      externalId: m.external_id,
      league: m.tm_leagues?.name ?? "—",
      homeTeam: m.home_team,
      awayTeam: m.away_team,
      commenceAt: m.commence_at,
      wc26FixtureId: m.wc26_fixture_id,
      outcomes,
    });
  }

  return out;
}
