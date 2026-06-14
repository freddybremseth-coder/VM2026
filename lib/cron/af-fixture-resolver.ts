/**
 * API-Football fixture resolver.
 *
 * PROBLEM: our internal Fixture.id values (1–110) are NOT API-Football
 * fixture ids. Calling `/fixtures?id=3` returns API-Football's fixture #3 —
 * some ancient unrelated match — so results never landed in match_results.
 *
 * SOLUTION: fetch the official WC-2026 fixture list from API-Football
 * (league=1, season=2026) for a date window — ONE api call — and match each
 * AF fixture to our internal fixtures by normalized team names (with an
 * alias table for naming differences) plus kickoff-day proximity.
 *
 * Bonus: the list response already carries goals + status, so the results
 * cron doesn't need any per-fixture calls at all.
 */

import { FIXTURES, type Fixture } from "@/lib/wc26-fixtures";
import { teamById } from "@/lib/wc26-data";

const BASE_URL = "https://v3.football.api-sports.io";
/** API-Football league id for the FIFA World Cup. */
const WC_LEAGUE_ID = 1;
const WC_SEASON = 2026;

export interface AfFixtureLite {
  afId: number;
  kickoffIso: string;
  homeName: string;
  awayName: string;
  homeScore: number | null;
  awayScore: number | null;
  statusShort: string;
  elapsed: number | null;
}

export interface ResolvedResult {
  internalId: number;
  afId: number;
  homeScore: number | null;
  awayScore: number | null;
  status: "scheduled" | "live" | "halftime" | "finished";
  minute: number | null;
}

interface AFListFixture {
  fixture: {
    id: number;
    date: string;
    status: { short: string; elapsed: number | null };
  };
  teams: {
    home: { id: number; name: string };
    away: { id: number; name: string };
  };
  goals: { home: number | null; away: number | null };
}

// ---------------------------------------------------------------------------
// Status mapping (same family as match_results.status check constraint)
// ---------------------------------------------------------------------------
export function mapAfStatus(short: string): ResolvedResult["status"] {
  if (["FT", "AET", "PEN"].includes(short)) return "finished";
  if (short === "HT") return "halftime";
  if (["1H", "2H", "ET", "P", "BT", "LIVE"].includes(short)) return "live";
  return "scheduled";
}

// ---------------------------------------------------------------------------
// Team-name normalization + aliases (AF naming → our naming, canonical form)
// ---------------------------------------------------------------------------
function normName(s: string): string {
  const base = s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics (Türkiye → turkiye)
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "");
  return ALIASES[base] ?? base;
}

/** Map known API-Football spellings onto our canonical normalized names. */
const ALIASES: Record<string, string> = {
  czechrepublic: "czechia",
  turkey: "turkiye",
  ivorycoast: "cotedivoire",
  korearepublic: "southkorea",
  unitedstates: "usa",
  capeverdeislands: "capeverde",
  caboverde: "capeverde",
  iran: "iran",
  irislamicrepublicofiran: "iran",
};

// ---------------------------------------------------------------------------
// Fetch the AF fixture list for a date window (ONE api call)
// ---------------------------------------------------------------------------
async function apiFetch<T>(path: string): Promise<T> {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) throw new Error("API_FOOTBALL_KEY not set");
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "x-apisports-key": key },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`api-football: ${res.status} ${res.statusText}`);
  const json = (await res.json()) as { response: T; errors?: unknown };
  return json.response;
}

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function fetchAfFixturesInWindow(
  windowStartMs: number,
  windowEndMs: number,
): Promise<AfFixtureLite[]> {
  const from = ymd(new Date(windowStartMs));
  const to = ymd(new Date(windowEndMs));
  const raw = await apiFetch<AFListFixture[]>(
    `/fixtures?league=${WC_LEAGUE_ID}&season=${WC_SEASON}&from=${from}&to=${to}&timezone=UTC`,
  );
  return (raw ?? []).map((f) => ({
    afId: f.fixture.id,
    kickoffIso: f.fixture.date,
    homeName: f.teams.home.name,
    awayName: f.teams.away.name,
    homeScore: f.goals.home,
    awayScore: f.goals.away,
    statusShort: f.fixture.status.short,
    elapsed: f.fixture.status.elapsed,
  }));
}

// ---------------------------------------------------------------------------
// Matching: AF fixture ↔ internal fixture
// ---------------------------------------------------------------------------
function internalNames(f: Fixture): { home: string | null; away: string | null } {
  const home = f.homeId ? teamById(f.homeId)?.name ?? null : null;
  const away = f.awayId ? teamById(f.awayId)?.name ?? null : null;
  return {
    home: home ? normName(home) : null,
    away: away ? normName(away) : null,
  };
}

const DAY_MS = 86_400_000;

/**
 * Match AF fixtures against the given internal fixtures.
 * Strategy, in priority order:
 *   1. Both team names match (normalized + aliases).
 *   2. One team name matches AND kickoff is within ±6h.
 *   3. Kickoff timestamps are equal AND no other internal fixture shares it.
 */
export function matchAfToInternal(
  afFixtures: AfFixtureLite[],
  internal: Fixture[],
): ResolvedResult[] {
  const out: ResolvedResult[] = [];
  const usedAf = new Set<number>();

  for (const fx of internal) {
    const names = internalNames(fx);
    const koMs = new Date(fx.kickoff).getTime();

    let best: AfFixtureLite | undefined;

    // Pass 1: both names
    if (names.home && names.away) {
      best = afFixtures.find(
        (af) =>
          !usedAf.has(af.afId) &&
          normName(af.homeName) === names.home &&
          normName(af.awayName) === names.away,
      );
    }

    // Pass 2: one name + kickoff within ±6h
    if (!best && (names.home || names.away)) {
      best = afFixtures.find((af) => {
        if (usedAf.has(af.afId)) return false;
        const afHome = normName(af.homeName);
        const afAway = normName(af.awayName);
        const nameHit =
          (names.home && (afHome === names.home || afAway === names.home)) ||
          (names.away && (afHome === names.away || afAway === names.away));
        if (!nameHit) return false;
        const dt = Math.abs(new Date(af.kickoffIso).getTime() - koMs);
        return dt <= DAY_MS / 4; // ±6h
      });
    }

    // Pass 3: unique identical kickoff timestamp
    if (!best) {
      const sameKo = afFixtures.filter(
        (af) =>
          !usedAf.has(af.afId) &&
          new Date(af.kickoffIso).getTime() === koMs,
      );
      const internalSameKo = internal.filter(
        (f) => new Date(f.kickoff).getTime() === koMs,
      );
      if (sameKo.length === 1 && internalSameKo.length === 1) best = sameKo[0];
    }

    if (!best) continue;
    usedAf.add(best.afId);

    out.push({
      internalId: fx.id,
      afId: best.afId,
      homeScore: best.homeScore,
      awayScore: best.awayScore,
      status: mapAfStatus(best.statusShort),
      minute: best.elapsed,
    });
  }

  return out;
}

// ---------------------------------------------------------------------------
// Single-id translation with module cache (used by the events provider)
// ---------------------------------------------------------------------------
const idCache = new Map<number, number>(); // internalId → afId (ids never change)

export async function getAfFixtureId(internalId: number): Promise<number> {
  const hit = idCache.get(internalId);
  if (hit) return hit;

  const fx = FIXTURES.find((f) => f.id === internalId);
  if (!fx) throw new Error(`Unknown internal fixture id ${internalId}`);

  const ko = new Date(fx.kickoff).getTime();
  const af = await fetchAfFixturesInWindow(ko - DAY_MS, ko + DAY_MS);
  const resolved = matchAfToInternal(af, [fx]);
  const found = resolved.find((r) => r.internalId === internalId);
  if (!found) {
    // Build a diagnostic so we can SEE why: was the AF response empty
    // (wrong league/season?) or were there fixtures but names didn't match?
    const home = fx.homeId ? teamById(fx.homeId)?.name : "?";
    const away = fx.awayId ? teamById(fx.awayId)?.name : "?";
    const sample = af
      .slice(0, 3)
      .map((a) => `${a.homeName} vs ${a.awayName} @ ${a.kickoffIso.slice(0, 16)}`)
      .join(" | ");
    throw new Error(
      `Resolver miss for #${internalId} ${home} vs ${away} @ ${fx.kickoff.slice(0, 16)} — ` +
        `AF returned ${af.length} fixtures (league=${WC_LEAGUE_ID}, season=${WC_SEASON})${
          af.length > 0 ? ` · sample: ${sample}` : ""
        }`,
    );
  }
  // Cache every resolution from this window while we're at it.
  for (const r of matchAfToInternal(af, FIXTURES)) {
    idCache.set(r.internalId, r.afId);
  }
  idCache.set(internalId, found.afId);
  return found.afId;
}
