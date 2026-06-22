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
const COOLDOWN_MS = 900; // a hair over the documented 880ms

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

interface RawOddsBookmaker {
  key: string;
  title: string;
  markets: Array<{
    key: string;
    outcomes: Array<{ name: string; price: number; point?: number }>;
  }>;
}

interface RawOddsResponse {
  fixtureId: string;
  bookmakers: RawOddsBookmaker[];
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

/** Canonicalise outcome names so 1X2 markets always use 'home'/'draw'/'away'. */
function canonicalOutcome(name: string, home: string, away: string): string {
  if (name === home) return "home";
  if (name === away) return "away";
  if (/^draw$/i.test(name) || name === "X") return "draw";
  return name;
}

/**
 * Fetch all bookmaker odds for one fixture. Returns one entry per
 * (bookmaker, market, outcome). Restricts to the markets we care about
 * (h2h / totals / btts).
 */
export async function fetchOddsForFixture(
  fixtureId: string,
  homeTeam: string,
  awayTeam: string,
): Promise<NormalisedOutcome[]> {
  if (!isOddsApiConfigured()) return [];
  const data = await papiGet<RawOddsResponse>("/odds", { fixtureId });
  const out: NormalisedOutcome[] = [];
  for (const bm of data.bookmakers ?? []) {
    for (const market of bm.markets ?? []) {
      if (!["h2h", "totals", "btts"].includes(market.key)) continue;
      for (const o of market.outcomes ?? []) {
        out.push({
          bookmakerKey: bm.key,
          bookmakerTitle: bm.title,
          marketKey: market.key,
          outcome: canonicalOutcome(o.name, homeTeam, awayTeam),
          price: o.price,
          point: o.point,
        });
      }
    }
  }
  return out;
}

/** Convenience: batch-fetch odds for many fixtures with the documented cooldown. */
export async function fetchOddsBatch(
  fixtures: Array<{
    externalId: string;
    homeTeam: string;
    awayTeam: string;
  }>,
): Promise<Map<string, NormalisedOutcome[]>> {
  const out = new Map<string, NormalisedOutcome[]>();
  for (let i = 0; i < fixtures.length; i++) {
    const f = fixtures[i];
    try {
      const odds = await fetchOddsForFixture(f.externalId, f.homeTeam, f.awayTeam);
      out.set(f.externalId, odds);
    } catch (err) {
      console.warn(`[oddspapi] odds failed for ${f.externalId}:`, err);
    }
    if (i < fixtures.length - 1) await sleep(COOLDOWN_MS);
  }
  return out;
}
