/**
 * the-odds-api.com v4 adapter — drop-in replacement for the OddsPapi adapter
 * (same exported surface: NormalisedFixture/NormalisedOutcome, fetchFixtures,
 * fetchOddsBatch, isOddsApiConfigured, SHARP_BOOKMAKERS).
 *
 * Why the switch: OddsPapi's free tier is a hard 250-request total cap that
 * was exhausted. the-odds-api gives 500 requests/MONTH that resets, and — key
 * difference — a single /odds call returns EVERY upcoming match's odds at once
 * (cost = markets × regions), instead of one call per fixture. So a whole
 * refresh costs ~3 credits, not ~30.
 *
 * Quota math: markets=h2h,totals,btts (3) × regions=eu (1) = 3 credits per
 * odds refresh. At a 6-hourly cron that's 4×3 = 12/day ≈ 360/month — under 500
 * with headroom. /events (fixtures) and /sports are free.
 *
 * Set THE_ODDS_API_KEY in the environment. No key → every function returns
 * empty and the dashboard shows its honest "not configured" placeholder.
 */

import type {
  NormalisedFixture,
  NormalisedOutcome,
} from "@/lib/tippemodell/oddspapi";

export type { NormalisedFixture, NormalisedOutcome };
export { SHARP_BOOKMAKERS } from "@/lib/tippemodell/oddspapi";

const BASE_URL = "https://api.the-odds-api.com/v4";
const REGIONS = "eu";
const MARKETS = "h2h,totals,btts";
/** Only the standard Over/Under line is modelled downstream. */
const TOTALS_LINE = 2.5;

function apiKey(): string | null {
  const k = process.env.THE_ODDS_API_KEY;
  return k && k.length > 0 ? k : null;
}

export function isOddsApiConfigured(): boolean {
  return apiKey() !== null;
}

// ─── Raw response shapes (only what we need) ────────────────────────────────
interface RawSport {
  key: string;
  group: string;
  title: string;
  active: boolean;
}
interface RawOutcome {
  name: string;
  price: number;
  point?: number;
}
interface RawMarket {
  key: string; // 'h2h' | 'totals' | 'btts'
  outcomes: RawOutcome[];
}
interface RawBookmaker {
  key: string;
  title: string;
  markets: RawMarket[];
}
interface RawEvent {
  id: string;
  sport_key: string;
  commence_time: string; // ISO
  home_team: string;
  away_team: string;
  bookmakers?: RawBookmaker[];
}

// ─── Sport-key resolution (cached) ──────────────────────────────────────────
// The WC key is "soccer_fifa_world_cup", but resolve it from /sports so a
// renamed key doesn't silently break everything.
let _sportKey: string | null = null;
async function resolveSportKey(key: string): Promise<string | null> {
  if (_sportKey) return _sportKey;
  try {
    const res = await fetch(`${BASE_URL}/sports?apiKey=${key}`, { cache: "no-store" });
    if (!res.ok) return "soccer_fifa_world_cup";
    const sports = (await res.json()) as RawSport[];
    const wc =
      sports.find((s) => s.key === "soccer_fifa_world_cup") ??
      sports.find(
        (s) => s.group === "Soccer" && /world cup/i.test(s.title) && !/women/i.test(s.title),
      );
    _sportKey = wc?.key ?? "soccer_fifa_world_cup";
    return _sportKey;
  } catch {
    return "soccer_fifa_world_cup";
  }
}

/** Drop simulated/virtual football (team names carrying an "SRL"/"Srl" tag). */
function isSimulated(home: string, away: string): boolean {
  const srl = /\bsrl\b/i;
  return srl.test(home) || srl.test(away);
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Upcoming fixtures from the free /events endpoint (0 quota cost). `from`/`to`
 * filter the window; sportId/tournamentName are ignored — the sport key IS the
 * tournament here.
 */
export async function fetchFixtures(opts: {
  sportId: string;
  from: string; // YYYY-MM-DD
  to: string;
  tournamentName?: string;
}): Promise<NormalisedFixture[]> {
  const key = apiKey();
  if (!key) return [];
  const sport = await resolveSportKey(key);
  if (!sport) return [];

  const res = await fetch(
    `${BASE_URL}/sports/${sport}/events?apiKey=${key}&dateFormat=iso`,
    { cache: "no-store" },
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`the-odds-api /events ${res.status}: ${body.slice(0, 200)}`);
  }
  const events = (await res.json()) as RawEvent[];

  const fromMs = Date.parse(`${opts.from}T00:00:00Z`);
  const toMs = Date.parse(`${opts.to}T23:59:59Z`);
  return events
    .filter((e) => !isSimulated(e.home_team, e.away_team))
    .filter((e) => {
      const ts = Date.parse(e.commence_time);
      return ts >= fromMs && ts <= toMs;
    })
    .map((e) => ({
      externalId: e.id,
      startTime: e.commence_time,
      homeTeam: e.home_team,
      awayTeam: e.away_team,
      tournamentName: e.sport_key,
    }));
}

/** Map a raw market outcome to our canonical (marketKey, outcome) + point. */
function normaliseOutcome(
  event: RawEvent,
  marketKey: string,
  o: RawOutcome,
): { marketKey: string; outcome: string; point?: number } | null {
  if (marketKey === "h2h") {
    if (o.name === event.home_team) return { marketKey: "h2h", outcome: "home" };
    if (o.name === event.away_team) return { marketKey: "h2h", outcome: "away" };
    if (o.name === "Draw") return { marketKey: "h2h", outcome: "draw" };
    return null;
  }
  if (marketKey === "totals") {
    if (o.point !== TOTALS_LINE) return null;
    if (o.name === "Over") return { marketKey: "totals", outcome: "over", point: TOTALS_LINE };
    if (o.name === "Under") return { marketKey: "totals", outcome: "under", point: TOTALS_LINE };
    return null;
  }
  if (marketKey === "btts") {
    if (o.name === "Yes") return { marketKey: "btts", outcome: "yes" };
    if (o.name === "No") return { marketKey: "btts", outcome: "no" };
    return null;
  }
  return null;
}

function prettify(key: string): string {
  return key
    .split(/[-_\s]/)
    .map((w) => (w.length <= 3 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

/**
 * ONE /odds call returns every upcoming match's odds; we index by event id and
 * return the requested fixtures' outcomes. `fixtures` only supplies which
 * external ids the caller cares about. Returns a Map<externalId, outcomes>.
 */
export async function fetchOddsBatch(
  fixtures: Array<{ externalId: string; homeTeam: string; awayTeam: string }>,
): Promise<Map<string, NormalisedOutcome[]>> {
  const out = new Map<string, NormalisedOutcome[]>();
  const key = apiKey();
  if (!key || fixtures.length === 0) return out;
  const sport = await resolveSportKey(key);
  if (!sport) return out;

  const url =
    `${BASE_URL}/sports/${sport}/odds?apiKey=${key}` +
    `&regions=${REGIONS}&markets=${MARKETS}&oddsFormat=decimal&dateFormat=iso`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`the-odds-api /odds ${res.status}: ${body.slice(0, 200)}`);
  }
  const events = (await res.json()) as RawEvent[];

  const wanted = new Set(fixtures.map((f) => f.externalId));
  for (const e of events) {
    if (!wanted.has(e.id)) continue;
    const rows: NormalisedOutcome[] = [];
    for (const bm of e.bookmakers ?? []) {
      for (const m of bm.markets ?? []) {
        for (const o of m.outcomes ?? []) {
          const n = normaliseOutcome(e, m.key, o);
          if (!n) continue;
          if (typeof o.price !== "number" || o.price <= 1) continue;
          rows.push({
            bookmakerKey: bm.key,
            bookmakerTitle: bm.title || prettify(bm.key),
            marketKey: n.marketKey,
            outcome: n.outcome,
            price: o.price,
            ...(n.point !== undefined ? { point: n.point } : {}),
          });
        }
      }
    }
    if (rows.length > 0) out.set(e.id, rows);
  }
  return out;
}
