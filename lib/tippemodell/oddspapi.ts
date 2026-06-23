/**
 * OddsPapi v4 adapter. Vendor-agnostic from the rest of the app's
 * perspective: everything outside this file deals with NormalisedOutcome[]
 * and never touches the raw API shape. Swap to a different aggregator
 * (the-odds-api.com, etc.) by writing a new adapter with the same return
 * type and pointing the ingest cron at it.
 *
 * Cooldown: OddsPapi's free tier asks for ~0.88s between calls to the same
 * endpoint. We sleep that amount between per-fixture odds fetches so the
 * cron doesn't get rate-limited mid-run.
 *
 * No-key fallback: when ODDS_API_KEY is unset, every function returns an
 * empty array. The cron will skip cleanly and the dashboard renders an
 * honest "set ODDS_API_KEY to activate" placeholder rather than crashing.
 */

const BASE_URL = "https://api.oddspapi.io/v4";

export type NormalisedOutcome = {
  bookmakerKey: string;
  bookmakerTitle: string;
  marketKey: string; // 'h2h' | 'totals' | 'btts'
  outcome: string; // 'home' | 'draw' | 'away' | 'Over 2.5' | ...
  price: number;
  point?: number;
};

export type NormalisedFixture = {
  externalId: string;
  startTime: string; // ISO
  homeTeam: string;
  awayTeam: string;
  tournamentName?: string;
};

/** Sharp bookmakers we trust to set the fair line. Order doesn't matter. */
export const SHARP_BOOKMAKERS = new Set(["pinnacle", "sbobet", "singbet"]);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function apiKey(): string | null {
  const k = process.env.ODDS_API_KEY;
  return k && k.length > 0 ? k : null;
}

async function papiGet<T>(
  path: string,
  params: Record<string, string>,
): Promise<T> {
  const key = apiKey();
  if (!key) throw new Error("ODDS_API_KEY not set");
  const qs = new URLSearchParams({ apiKey: key, ...params }).toString();
  const res = await fetch(`${BASE_URL}${path}?${qs}`, {
    headers: { accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `OddsPapi ${path} ${res.status}: ${body.slice(0, 300)}`,
    );
  }
  return (await res.json()) as T;
}

// ─── Raw response shapes (kept private to this file) ──────────────────────

interface RawFixture {
  fixtureId: string;
  startTime: string;
  participant1Name: string;
  participant2Name: string;
  hasOdds: boolean;
  tournamentName?: string;
}

// OddsPapi v4 /odds actual shape (verified against the live feed — differs
// substantially from the documented form):
//
//   bookmakerOdds: {
//     "<bookmakerKey>": {
//       bookmakerIsActive, suspended,
//       markets: {
//         "<numericMarketId>": {
//           marketActive,
//           outcomes: {
//             "<numericOutcomeId>": {
//               players: { "0": { price, active, mainLine, ... } }
//             }
//           }
//         }
//       }
//     }
//   }
//
// Market 101 is 1X2; its outcome ids map 101→home, 102→draw, 103→away.
interface RawPlayer {
  active?: boolean;
  mainLine?: boolean;
  price?: number;
}
interface RawOutcome {
  players?: Record<string, RawPlayer>;
}
interface RawMarket {
  marketActive?: boolean;
  outcomes?: Record<string, RawOutcome>;
}
interface RawBookmakerOdds {
  bookmakerIsActive?: boolean;
  suspended?: boolean;
  markets?: Record<string, RawMarket>;
}
interface RawOddsResponse {
  fixtureId: string;
  bookmakerOdds?: Record<string, RawBookmakerOdds>;
}

// Numeric market id → our canonical market key. Verified against OddsPapi's
// /markets reference for sportId 10 (football):
//   101  Full Time Result  → h2h   (101=1, 102=X, 103=2)
//   104  Both Teams Score  → btts  (104=Yes, 105=No)
//   1010 Over/Under 2.5    → totals (1010=Over, 1011=Under), point 2.5
const MARKET_ID_TO_KEY: Record<string, string> = {
  "101": "h2h",
  "104": "btts",
  "1010": "totals",
};

// Per-market outcome-id → our canonical outcome key, from the same reference.
const OUTCOME_ID_TO_KEY: Record<string, Record<string, string>> = {
  "101": { "101": "home", "102": "draw", "103": "away" },
  "104": { "104": "yes", "105": "no" },
  "1010": { "1010": "over", "1011": "under" },
};

// The totals line (handicap) each totals market id carries. Only 2.5 for now.
const MARKET_POINT: Record<string, number> = {
  "1010": 2.5,
};

/** Prettify a bookmaker key into a display title ("3et" → "3ET"). */
function prettifyBookmaker(key: string): string {
  return key
    .split(/[-_\s]/)
    .map((w) => (w.length <= 3 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

// ─── Public API ────────────────────────────────────────────────────────────

export function isOddsApiConfigured(): boolean {
  return apiKey() !== null;
}

/**
 * Fetch fixtures with odds for a date window. `tournamentName` filters by the
 * exact OddsPapi name — verify the value at first run by logging one raw
 * response and adjust the seed in tm_leagues if it doesn't match.
 */
export async function fetchFixtures(opts: {
  sportId: string; // 10 = football
  from: string; // YYYY-MM-DD
  to: string; // ≤10 days from `from`
  tournamentName?: string;
}): Promise<NormalisedFixture[]> {
  if (!isOddsApiConfigured()) return [];
  const raw = await papiGet<RawFixture[]>("/fixtures", {
    sportId: opts.sportId,
    from: opts.from,
    to: opts.to,
  });
  const withOdds = raw.filter((f) => f.hasOdds);
  const byTournament = opts.tournamentName
    ? withOdds.filter((f) => f.tournamentName === opts.tournamentName)
    : withOdds;
  // Drop simulated/virtual football ("SRL" = eSoccer Battle simulated
  // reality leagues). These share the "World Cup" tournament name but are
  // bot-vs-bot esports, not the real tournament — must never leak in.
  const filtered = byTournament.filter((f) => !isSimulated(f));
  return filtered.map((f) => ({
    externalId: f.fixtureId,
    startTime: f.startTime,
    homeTeam: f.participant1Name,
    awayTeam: f.participant2Name,
    tournamentName: f.tournamentName,
  }));
}

/**
 * Detect OddsPapi's simulated/virtual football. These appear under the same
 * tournamentName as the real event but use an "SRL" / "Srl" suffix on team
 * names ("Norway Srl", "France SRL") and are bot-vs-bot esports. We never
 * want them in the real odds table.
 */
function isSimulated(f: RawFixture): boolean {
  const srl = /\bsrl\b/i;
  return srl.test(f.participant1Name) || srl.test(f.participant2Name);
}

/**
 * Fetch all bookmaker odds for one fixture and normalise to
 * NormalisedOutcome[]. Phase 1 keeps only the 1X2 market (id 101).
 *
 * Walks bookmakerOdds → markets → outcomes → players["0"].price, skipping
 * suspended bookmakers, inactive markets, and inactive/non-main-line
 * outcomes. The homeTeam/awayTeam args are unused for this structure
 * (outcome ids carry the 1X2 mapping) but kept in the signature so the
 * batch caller and any future name-based markets stay compatible.
 */
export async function fetchOddsForFixture(
  fixtureId: string,
  _homeTeam: string,
  _awayTeam: string,
): Promise<NormalisedOutcome[]> {
  if (!isOddsApiConfigured()) return [];
  const data = await papiGet<RawOddsResponse>("/odds", { fixtureId });
  const out: NormalisedOutcome[] = [];

  for (const [bookmakerKey, bm] of Object.entries(data.bookmakerOdds ?? {})) {
    if (bm.suspended || bm.bookmakerIsActive === false) continue;
    for (const [marketId, market] of Object.entries(bm.markets ?? {})) {
      const marketKey = MARKET_ID_TO_KEY[marketId];
      if (!marketKey) continue; // we keep 1X2 (101), BTTS (104), O/U 2.5 (1010)
      if (market.marketActive === false) continue;
      const outcomeMap = OUTCOME_ID_TO_KEY[marketId];
      const point = MARKET_POINT[marketId];

      for (const [outcomeId, outcome] of Object.entries(market.outcomes ?? {})) {
        const selection = outcomeMap?.[outcomeId];
        if (!selection) continue;
        // The primary line lives under players["0"]; alt lines (if any)
        // sit under other keys — we only take the main line.
        const player = outcome.players?.["0"];
        if (!player || player.active === false) continue;
        if (typeof player.price !== "number" || player.price <= 1) continue;

        out.push({
          bookmakerKey,
          bookmakerTitle: prettifyBookmaker(bookmakerKey),
          marketKey,
          outcome: selection,
          price: player.price,
          ...(point !== undefined ? { point } : {}),
        });
      }
    }
  }
  return out;
}

/**
 * Batch-fetch odds for many fixtures using a small concurrency pool.
 *
 * Sequential fetching with the full 900ms cooldown took ~46s for a typical
 * 14-match window — past cron-job.org's 30s request timeout. A pool of
 * CONCURRENCY workers with a light per-worker stagger cuts wall-clock to
 * ~12-15s while staying polite to OddsPapi. A fixture that 429s (rate
 * limited) or errors is simply skipped and picked up on the next cron tick.
 */
const CONCURRENCY = 4;
const STAGGER_MS = 250;

export async function fetchOddsBatch(
  fixtures: Array<{
    externalId: string;
    homeTeam: string;
    awayTeam: string;
  }>,
): Promise<Map<string, NormalisedOutcome[]>> {
  const out = new Map<string, NormalisedOutcome[]>();
  let cursor = 0;

  async function worker(workerIndex: number): Promise<void> {
    // Stagger worker starts so we don't fire CONCURRENCY requests at the
    // exact same instant.
    await sleep(workerIndex * STAGGER_MS);
    while (true) {
      const i = cursor++;
      if (i >= fixtures.length) return;
      const f = fixtures[i];
      try {
        const odds = await fetchOddsForFixture(
          f.externalId,
          f.homeTeam,
          f.awayTeam,
        );
        out.set(f.externalId, odds);
      } catch (err) {
        console.warn(`[oddspapi] odds failed for ${f.externalId}:`, err);
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, fixtures.length) }, (_, w) =>
      worker(w),
    ),
  );
  return out;
}
