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
import { getMatchValue, type OutcomeValue } from "@/lib/tippemodell/value-model";

export interface BookPrice {
  bookmaker: string;
  isSharp: boolean;
  price: number;
}

export type OutcomeKey = "home" | "draw" | "away";

export interface OutcomeView {
  outcome: string;
  label: string;
  best: BookPrice | null;
  sharp: number | null;
  fairProb: number | null;
  bookCount: number;
  /** > 0 means best market price beats fair odds — potential value. */
  edge: number | null;
  /** Our Dixon-Coles model probability for this outcome (null off-model). */
  modelProb: number | null;
  /** Expected value of the best price vs our model (null when no model/odds). */
  modelEv: number | null;
  /** Quarter-Kelly stake fraction (null when no edge). */
  kelly: number | null;
  /** True when our model rates this a positive-EV value bet. */
  modelValue: boolean;
  /** True when the model diverges from the market beyond credible bounds. */
  modelDiverges: boolean;
}

export interface MatchView {
  matchId: number;
  externalId: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  commenceAt: string;
  wc26FixtureId: number | null;
  /** 1X2 — always present (a match is only listed if it has h2h odds). */
  outcomes: OutcomeView[];
  /** Over/Under 2.5 goals — null when no bookmaker offered it. */
  totals: OutcomeView[] | null;
  /** Both teams to score — null when no bookmaker offered it. */
  btts: OutcomeView[] | null;
}

const H2H_LABELS: Record<string, string> = { home: "1", draw: "X", away: "2" };
const TOTALS_LABELS: Record<string, string> = {
  over: "Over 2.5",
  under: "Under 2.5",
};
const BTTS_LABELS: Record<string, string> = { yes: "Ja", no: "Nei" };

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

/**
 * Build the per-outcome view for one market: best price, sharp price, fair
 * probability (de-vig sharp line, else de-vig best), and edge. Shared by
 * 1X2, totals and BTTS. `keys` is the canonical outcome order.
 */
function buildMarketOutcomes(
  marketOdds: Array<OddsRow & { match_id: number }>,
  bmById: Map<number, BookmakerRow>,
  keys: string[],
  labels: Record<string, string>,
): OutcomeView[] | null {
  const outcomes: OutcomeView[] = keys.map((oc) => {
    const rows = marketOdds
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
      label: labels[oc] ?? oc,
      best,
      sharp: sharpRow?.price ?? null,
      fairProb: null,
      bookCount: rows.length,
      edge: null,
      modelProb: null,
      modelEv: null,
      kelly: null,
      modelValue: false,
      modelDiverges: false,
    };
  });

  // A market is only worth showing if at least one outcome has a price.
  if (outcomes.every((o) => o.best === null)) return null;

  // Fair probabilities — prefer the sharp line, fall back to best prices.
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
  return outcomes;
}

/** Attach model probability + value metrics onto a built outcome list. */
function applyModelValues(
  outcomes: OutcomeView[] | null,
  byOutcome: Record<string, OutcomeValue> | undefined,
): void {
  if (!outcomes || !byOutcome) return;
  for (const o of outcomes) {
    const v = byOutcome[o.outcome];
    if (!v) continue;
    o.modelProb = v.modelProb;
    o.modelEv = v.ev;
    o.kelly = v.kelly;
    o.modelValue = v.isValue;
    o.modelDiverges = v.modelDiverges;
  }
}

function bestByOutcome(
  outcomes: OutcomeView[] | null,
): Record<string, number> {
  const r: Record<string, number> = {};
  for (const o of outcomes ?? []) if (o.best) r[o.outcome] = o.best.price;
  return r;
}

export async function getTippemodellDashboard(): Promise<MatchView[]> {
  const supabase = createSupabaseServerClient();

  // Market ids for the three markets we ingest.
  const { data: marketsData } = await supabase
    .from("tm_markets")
    .select("id, key")
    .in("key", ["h2h", "totals", "btts"]);
  const marketIdByKey = new Map(
    ((marketsData ?? []) as MarketRow[]).map((m) => [m.key, m.id]),
  );
  const h2hMarketId = marketIdByKey.get("h2h");
  if (!h2hMarketId) return [];
  const allMarketIds = [...marketIdByKey.values()];

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

  // Latest odds for those matches across all three markets.
  const { data: oddsData } = await supabase
    .from("tm_latest_odds")
    .select("match_id, market_id, outcome, price, bookmaker_id")
    .in("match_id", matchIds)
    .in("market_id", allMarketIds);
  const oddsRows = (oddsData ?? []) as unknown as Array<
    OddsRow & { match_id: number; market_id: number }
  >;

  // Bookmaker metadata.
  const bmIds = [...new Set(oddsRows.map((o) => o.bookmaker_id))];
  let bmById = new Map<number, BookmakerRow>();
  if (bmIds.length > 0) {
    const { data: bmsData } = await supabase
      .from("tm_bookmakers")
      .select("id, title, is_sharp")
      .in("id", bmIds);
    bmById = new Map(((bmsData ?? []) as BookmakerRow[]).map((b) => [b.id, b]));
  }

  const totalsMarketId = marketIdByKey.get("totals");
  const bttsMarketId = marketIdByKey.get("btts");

  const out: MatchView[] = [];
  for (const m of matches) {
    const matchOdds = oddsRows.filter((o) => o.match_id === m.id);
    const h2hOdds = matchOdds.filter((o) => o.market_id === h2hMarketId);
    if (h2hOdds.length === 0) continue; // need at least the 1X2 market

    const outcomes = buildMarketOutcomes(
      h2hOdds,
      bmById,
      ["home", "draw", "away"],
      H2H_LABELS,
    )!;
    const totals =
      totalsMarketId !== undefined
        ? buildMarketOutcomes(
            matchOdds.filter((o) => o.market_id === totalsMarketId),
            bmById,
            ["over", "under"],
            TOTALS_LABELS,
          )
        : null;
    const btts =
      bttsMarketId !== undefined
        ? buildMarketOutcomes(
            matchOdds.filter((o) => o.market_id === bttsMarketId),
            bmById,
            ["yes", "no"],
            BTTS_LABELS,
          )
        : null;

    // Dixon-Coles value model. Passing team names lets knockout fixtures
    // (whose static fixture row carries slots, not team ids) still resolve
    // strengths from the concrete teams OddsPapi knows. wc26_fixture_id is
    // used when present; -1 lets the model fall back to name resolution.
    const value = await getMatchValue(
      m.wc26_fixture_id ?? -1,
      {
        h2h: bestByOutcome(outcomes) as Partial<Record<OutcomeKey, number>>,
        totals: bestByOutcome(totals),
        btts: bestByOutcome(btts),
      },
      { home: m.home_team, away: m.away_team },
    );
    if (value) {
      applyModelValues(outcomes, value.outcomes);
      applyModelValues(totals, value.totals);
      applyModelValues(btts, value.btts);
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
      totals,
      btts,
    });
  }

  return out;
}
