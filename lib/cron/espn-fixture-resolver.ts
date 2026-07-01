/**
 * ESPN fixture resolver — drop-in replacement for af-fixture-resolver.ts.
 *
 * Why: API-Football's free tier doesn't cover the 2026 season ("Free plans do
 * not have access to this season, try from 2022 to 2024"). ESPN's public
 * site.api endpoint exposes the full WC 2026 schedule, live scores, and
 * scoring details with NO API key required.
 *
 * Endpoint:
 *   GET https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=YYYYMMDD
 *
 * The scoreboard returns ALL fixtures for one calendar date. We fan out one
 * fetch per UTC date in the window (typically 2–3 dates), match by team
 * names against our internal fixture list, and the response already carries
 * goals + status — no per-fixture call needed for the results cron.
 *
 * Same exported surface as af-fixture-resolver.ts so the cron tasks can
 * switch over with just an import swap.
 */

import { FIXTURES, type Fixture } from "@/lib/wc26-fixtures";
import { teamById } from "@/lib/wc26-data";

const SCOREBOARD_URL =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";

export interface EspnFixtureLite {
  espnId: string;
  kickoffIso: string;
  homeName: string;
  awayName: string;
  homeEspnTeamId: string;
  awayEspnTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  /** ESPN status: e.g. "STATUS_SCHEDULED", "STATUS_IN_PROGRESS", "STATUS_FINAL", "STATUS_HALFTIME". */
  statusName: string;
  /** Display value from clock, e.g. "67'", "HT", "FT". */
  statusDetail: string;
  /** Numeric minute when in-progress, else null. */
  minute: number | null;
}

export interface ResolvedResult {
  internalId: number;
  espnId: string;
  homeScore: number | null;
  awayScore: number | null;
  status: "scheduled" | "live" | "halftime" | "finished";
  minute: number | null;
}

// ---------------------------------------------------------------------------
// ESPN raw types (only what we need)
// ---------------------------------------------------------------------------
interface EspnScoreboardEvent {
  id: string;
  date: string; // ISO
  status: {
    type: { name: string; state: string; completed: boolean; detail?: string; shortDetail?: string };
    displayClock?: string;
  };
  competitions: Array<{
    competitors: Array<{
      id: string;
      homeAway: "home" | "away";
      score?: string;
      team: { id: string; displayName: string; name: string; abbreviation: string };
    }>;
  }>;
}

interface EspnScoreboardResponse {
  events?: EspnScoreboardEvent[];
}

// ---------------------------------------------------------------------------
// Status mapping (same family as match_results.status check constraint)
// ---------------------------------------------------------------------------
export function mapEspnStatus(name: string): ResolvedResult["status"] {
  switch (name) {
    case "STATUS_FINAL":
    case "STATUS_FULL_TIME":
    case "STATUS_END_OF_REGULATION":
    case "STATUS_END_EXTRA_TIME":
    case "STATUS_END_PENALTY_SHOOTOUT":
    // Knockout ties decided after extra time / penalties — ESPN reports these
    // as FINAL_AET / FINAL_PEN. Without them a penalty tie (e.g. Netherlands–
    // Morocco) stays "scheduled" and never grades, showing "live" forever.
    case "STATUS_FINAL_AET":
    case "STATUS_FINAL_PEN":
    case "STATUS_FINAL_AFTER_EXTRA_TIME":
    case "STATUS_FINAL_AFTER_PENALTIES":
      return "finished";
    case "STATUS_HALFTIME":
      return "halftime";
    case "STATUS_IN_PROGRESS":
    case "STATUS_FIRST_HALF":
    case "STATUS_SECOND_HALF":
    case "STATUS_EXTRA_TIME":
    case "STATUS_PENALTY_SHOOTOUT":
      return "live";
    default:
      // Any other terminal "FINAL"/"FT" variant → finished (defensive: better
      // to grade a done match than leave it stuck live).
      if (/final|full_time|fulltime|_ft\b|_end_/i.test(name)) return "finished";
      return "scheduled";
  }
}

// ---------------------------------------------------------------------------
// Team-name normalization + aliases (ESPN naming → our canonical normalized)
// ---------------------------------------------------------------------------
function normName(s: string): string {
  const base = s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "");
  return ALIASES[base] ?? base;
}

/** ESPN spellings that differ from ours, normalized → canonical normalized. */
const ALIASES: Record<string, string> = {
  czechrepublic: "czechia",
  turkey: "turkiye",
  ivorycoast: "cotedivoire",
  korearepublic: "southkorea",
  korearep: "southkorea",
  unitedstates: "usa",
  unitedstatesofamerica: "usa",
  capeverdeislands: "capeverde",
  caboverde: "capeverde",
  irislamicrepublicofiran: "iran",
  bosniaandherzegovina: "bosniaandherzegovina",
  bosnia: "bosniaandherzegovina",
  // ESPN spelling: "Bosnia-Herzegovina" (hyphen). After normalisation
  // becomes "bosniaherzegovina" — needs an explicit alias.
  bosniaherzegovina: "bosniaandherzegovina",
  // ESPN spells it "Congo DR" (→ "congodr"); our data has "DR Congo"
  // (→ "drcongo"). Without this alias the exact-name pass misses all
  // three DR Congo group matches and falls back to the fragile
  // one-name+time pass. Map both to our canonical "drcongo".
  congodr: "drcongo",
  democraticrepublicofthecongo: "drcongo",
  democraticrepublicofcongo: "drcongo",
};

// ---------------------------------------------------------------------------
// Fetch ESPN scoreboard for a date window (fans out one fetch per UTC date)
// ---------------------------------------------------------------------------
function ymdCompact(d: Date): string {
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}

async function fetchEspnScoreboard(yyyymmdd: string): Promise<EspnFixtureLite[]> {
  const url = `${SCOREBOARD_URL}?dates=${yyyymmdd}`;
  const res = await fetch(url, {
    next: { revalidate: 30 }, // ISR — fresh every 30s during live matches
  });
  if (!res.ok) throw new Error(`espn: ${res.status} ${res.statusText}`);
  const json = (await res.json()) as EspnScoreboardResponse;
  const events = json.events ?? [];
  return events.map((e) => {
    const comp = e.competitions[0];
    const home = comp.competitors.find((c) => c.homeAway === "home")!;
    const away = comp.competitors.find((c) => c.homeAway === "away")!;
    const homeScore = home.score === undefined || home.score === "" ? null : Number(home.score);
    const awayScore = away.score === undefined || away.score === "" ? null : Number(away.score);
    const statusName = e.status.type.name;
    const displayClock = e.status.displayClock ?? "";
    // Parse minute from "67'" or "67:00" formats; null if not in-progress.
    let minute: number | null = null;
    if (mapEspnStatus(statusName) === "live") {
      const m = displayClock.match(/(\d+)/);
      if (m) minute = Math.min(130, Math.max(1, Number(m[1])));
    }
    return {
      espnId: e.id,
      kickoffIso: e.date,
      homeName: home.team.displayName,
      awayName: away.team.displayName,
      homeEspnTeamId: home.team.id,
      awayEspnTeamId: away.team.id,
      homeScore: Number.isFinite(homeScore as number) ? homeScore : null,
      awayScore: Number.isFinite(awayScore as number) ? awayScore : null,
      statusName,
      statusDetail: e.status.type.shortDetail ?? displayClock,
      minute,
    };
  });
}

export async function fetchEspnFixturesInWindow(
  windowStartMs: number,
  windowEndMs: number,
): Promise<EspnFixtureLite[]> {
  // Build the set of UTC dates the window touches. ESPN's scoreboard
  // returns one calendar day at a time.
  const dates = new Set<string>();
  const ONE_DAY = 86_400_000;
  for (let t = windowStartMs - ONE_DAY; t <= windowEndMs + ONE_DAY; t += ONE_DAY) {
    dates.add(ymdCompact(new Date(t)));
  }
  const all: EspnFixtureLite[] = [];
  for (const d of dates) {
    try {
      const batch = await fetchEspnScoreboard(d);
      all.push(...batch);
    } catch (err) {
      // Soft-fail one day rather than crash the whole window — ESPN
      // occasionally 5xx-s on individual dates.
      console.warn(`[espn-resolver] scoreboard ${d} failed:`, err);
    }
  }
  // De-dupe by espnId (date boundaries can overlap)
  const seen = new Set<string>();
  return all.filter((f) => {
    if (seen.has(f.espnId)) return false;
    seen.add(f.espnId);
    // Filter to the actual window — ESPN day-buckets are UTC, but a fixture
    // at 23:00 UTC on day X belongs to X, not X+1.
    const ts = new Date(f.kickoffIso).getTime();
    return ts >= windowStartMs - ONE_DAY / 2 && ts <= windowEndMs + ONE_DAY / 2;
  });
}

// ---------------------------------------------------------------------------
// Matching: ESPN fixture ↔ internal fixture (same algorithm as AF version)
// ---------------------------------------------------------------------------
/**
 * Resolved-team ids per fixture id (group fixtures direct, knockout resolved
 * from standings). Lets us name-match knockout ties — their static rows carry
 * slots, not homeId/awayId, so without this they'd only ever match by kickoff.
 */
export type ResolvedTeamsMap = Map<number, { homeId: number | null; awayId: number | null }>;

function internalNames(
  f: Fixture,
  resolved?: ResolvedTeamsMap,
): { home: string | null; away: string | null } {
  const r = resolved?.get(f.id);
  const homeId = f.homeId ?? r?.homeId ?? null;
  const awayId = f.awayId ?? r?.awayId ?? null;
  const home = homeId ? teamById(homeId)?.name ?? null : null;
  const away = awayId ? teamById(awayId)?.name ?? null : null;
  return {
    home: home ? normName(home) : null,
    away: away ? normName(away) : null,
  };
}

const DAY_MS = 86_400_000;

/**
 * Match ESPN fixtures against the given internal fixtures.
 * Strategy, in priority order:
 *   1. Both team names match (normalized + aliases).
 *   2. One team name matches AND kickoff is within ±6h.
 *   3. Identical kickoff timestamp with no other internal fixture sharing it.
 * Pass `resolved` so knockout ties match by team name (pass 1/2) rather than
 * only by kickoff (pass 3), which mis-assigns when kickoffs collide.
 */
export function matchEspnToInternal(
  espnFixtures: EspnFixtureLite[],
  internal: Fixture[],
  resolved?: ResolvedTeamsMap,
): ResolvedResult[] {
  const out: ResolvedResult[] = [];
  const usedEspn = new Set<string>();

  for (const fx of internal) {
    const names = internalNames(fx, resolved);
    const koMs = new Date(fx.kickoff).getTime();

    let best: EspnFixtureLite | undefined;

    // Pass 1: both names
    if (names.home && names.away) {
      best = espnFixtures.find(
        (e) =>
          !usedEspn.has(e.espnId) &&
          normName(e.homeName) === names.home &&
          normName(e.awayName) === names.away,
      );
    }

    // Pass 2: one name + kickoff within ±6h
    if (!best && (names.home || names.away)) {
      best = espnFixtures.find((e) => {
        if (usedEspn.has(e.espnId)) return false;
        const eh = normName(e.homeName);
        const ea = normName(e.awayName);
        const nameHit =
          (names.home && (eh === names.home || ea === names.home)) ||
          (names.away && (eh === names.away || ea === names.away));
        if (!nameHit) return false;
        const dt = Math.abs(new Date(e.kickoffIso).getTime() - koMs);
        return dt <= DAY_MS / 4; // ±6h
      });
    }

    // Pass 3: unique identical kickoff
    if (!best) {
      const sameKo = espnFixtures.filter(
        (e) => !usedEspn.has(e.espnId) && new Date(e.kickoffIso).getTime() === koMs,
      );
      const internalSameKo = internal.filter(
        (f) => new Date(f.kickoff).getTime() === koMs,
      );
      if (sameKo.length === 1 && internalSameKo.length === 1) best = sameKo[0];
    }

    if (!best) continue;
    usedEspn.add(best.espnId);

    out.push({
      internalId: fx.id,
      espnId: best.espnId,
      homeScore: best.homeScore,
      awayScore: best.awayScore,
      status: mapEspnStatus(best.statusName),
      minute: best.minute,
    });
  }

  return out;
}

// ---------------------------------------------------------------------------
// Single-id translation with module cache (used by the events provider)
// ---------------------------------------------------------------------------
const idCache = new Map<number, string>(); // internalId → espnId

export async function getEspnFixtureId(internalId: number): Promise<string> {
  const hit = idCache.get(internalId);
  if (hit) return hit;

  const fx = FIXTURES.find((f) => f.id === internalId);
  if (!fx) throw new Error(`Unknown internal fixture id ${internalId}`);

  const ko = new Date(fx.kickoff).getTime();
  const espn = await fetchEspnFixturesInWindow(ko - DAY_MS, ko + DAY_MS);
  const resolved = matchEspnToInternal(espn, [fx]);
  const found = resolved.find((r) => r.internalId === internalId);
  if (!found) {
    const home = fx.homeId ? teamById(fx.homeId)?.name : "?";
    const away = fx.awayId ? teamById(fx.awayId)?.name : "?";
    const sample = espn
      .slice(0, 3)
      .map((a) => `${a.homeName} vs ${a.awayName} @ ${a.kickoffIso.slice(0, 16)}`)
      .join(" | ");
    throw new Error(
      `Resolver miss for #${internalId} ${home} vs ${away} @ ${fx.kickoff.slice(0, 16)} — ` +
        `ESPN returned ${espn.length} fixtures${
          espn.length > 0 ? ` · sample: ${sample}` : ""
        }`,
    );
  }
  // Warm the cache for every fixture in this window while we're at it.
  for (const r of matchEspnToInternal(espn, FIXTURES)) {
    idCache.set(r.internalId, r.espnId);
  }
  idCache.set(internalId, found.espnId);
  return found.espnId;
}
