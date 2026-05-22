/**
 * Team pre-tournament form — last N international matches.
 *
 * Uses API-Football v3 when `API_FOOTBALL_KEY` is present, otherwise returns
 * a deterministic mock so the UI always has something to render.
 *
 * API docs:
 *   GET /fixtures?team={afId}&last=5&type=national
 *
 * Cache strategy: revalidate every 6 hours (pre-tournament data doesn't change
 * minute-to-minute, but we still want to pick up results on match days).
 */

import { getAFTeamId } from "./api-football-ids";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type FormResult = "W" | "D" | "L";

export interface FormMatch {
  date: string;          // ISO date, e.g. "2026-03-22"
  opponent: string;      // opponent short name / display name
  opponentFlag?: string; // emoji flag
  goalsFor: number;
  goalsAgainst: number;
  result: FormResult;
  venue: "H" | "A" | "N"; // home / away / neutral
  competition: string;   // "Friendly", "UEFA Nations League", etc.
}

export interface TeamFormData {
  teamId: number;        // our internal WCTeam.id
  afTeamId?: number;     // API-Football team id (if mapped)
  matches: FormMatch[];  // most recent first
  source: "api-football" | "mock";
  fetchedAt: string;     // ISO timestamp
}

// ─────────────────────────────────────────────────────────────────────────────
// Mock data (deterministic, seeded per team)
// ─────────────────────────────────────────────────────────────────────────────

/** Simple seeded RNG — same seed always produces same sequence */
function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

const MOCK_OPPONENTS = [
  ["NED", "🇳🇱"], ["GER", "🇩🇪"], ["ESP", "🇪🇸"], ["ITA", "🇮🇹"],
  ["FRA", "🇫🇷"], ["ENG", "🇬🇧"], ["POR", "🇵🇹"], ["BEL", "🇧🇪"],
  ["SWE", "🇸🇪"], ["DEN", "🇩🇰"], ["CRO", "🇭🇷"], ["AUT", "🇦🇹"],
  ["URU", "🇺🇾"], ["BRA", "🇧🇷"], ["ARG", "🇦🇷"], ["MEX", "🇲🇽"],
  ["USA", "🇺🇸"], ["MAR", "🇲🇦"], ["SEN", "🇸🇳"], ["JPN", "🇯🇵"],
];
const MOCK_COMPS = [
  "UEFA Nations League", "FIFA Friendly", "EURO Qualifier", "WC Qualifier",
];
const MOCK_DATES = [
  "2026-03-22", "2026-03-25", "2026-02-12", "2026-02-15", "2025-11-14",
];

function buildMockForm(internalId: number): FormMatch[] {
  const rng = mulberry32(internalId * 9973);
  const matches: FormMatch[] = [];

  for (let i = 0; i < 5; i++) {
    const opp = MOCK_OPPONENTS[Math.floor(rng() * MOCK_OPPONENTS.length)];
    const gf = Math.floor(rng() * 4);
    let ga = Math.floor(rng() * 4);
    // Bias: good teams win more
    if (internalId <= 15 && rng() > 0.4) ga = Math.max(0, ga - 1);

    const result: FormResult = gf > ga ? "W" : gf < ga ? "L" : "D";
    matches.push({
      date: MOCK_DATES[i],
      opponent: opp[0],
      opponentFlag: opp[1],
      goalsFor: gf,
      goalsAgainst: ga,
      result,
      venue: rng() > 0.6 ? "H" : rng() > 0.3 ? "A" : "N",
      competition: MOCK_COMPS[Math.floor(rng() * MOCK_COMPS.length)],
    });
  }
  return matches;
}

// ─────────────────────────────────────────────────────────────────────────────
// API-Football fetcher
// ─────────────────────────────────────────────────────────────────────────────

interface AFFixtureResponse {
  fixture: { date: string; venue?: { name?: string } };
  league: { name: string };
  teams: {
    home: { id: number; name: string };
    away: { id: number; name: string };
  };
  goals: { home: number | null; away: number | null };
}

async function fetchFromAF(afTeamId: number, last = 5): Promise<FormMatch[]> {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) throw new Error("API_FOOTBALL_KEY not configured");

  const url = `https://v3.football.api-sports.io/fixtures?team=${afTeamId}&last=${last}&type=national`;
  const res = await fetch(url, {
    headers: { "x-apisports-key": key },
    next: { revalidate: 6 * 3600 }, // cache 6 hours
  });

  if (!res.ok) throw new Error(`api-football: ${res.status}`);

  const json = (await res.json()) as { response: AFFixtureResponse[] };
  const fixtures = json.response;

  return fixtures
    .slice()
    .reverse() // API returns most recent first; we want chronological for easy reversal later
    .map((fx): FormMatch => {
      const isHome = fx.teams.home.id === afTeamId;
      const gf = isHome ? (fx.goals.home ?? 0) : (fx.goals.away ?? 0);
      const ga = isHome ? (fx.goals.away ?? 0) : (fx.goals.home ?? 0);
      const oppName = isHome ? fx.teams.away.name : fx.teams.home.name;
      const result: FormResult = gf > ga ? "W" : gf < ga ? "L" : "D";

      return {
        date: fx.fixture.date.slice(0, 10),
        opponent: oppName.length > 12 ? oppName.slice(0, 3).toUpperCase() : oppName,
        goalsFor: gf,
        goalsAgainst: ga,
        result,
        venue: isHome ? "H" : "A",
        competition: fx.league.name,
      };
    })
    .reverse(); // back to most-recent-first
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get the last 5 international matches for a team.
 * Falls back to mock data when:
 *   - API key not set, OR
 *   - team ID not mapped, OR
 *   - API request fails
 */
export async function getTeamForm(internalId: number): Promise<TeamFormData> {
  const afTeamId = getAFTeamId(internalId);

  if (process.env.API_FOOTBALL_KEY && afTeamId) {
    try {
      const matches = await fetchFromAF(afTeamId);
      return {
        teamId: internalId,
        afTeamId,
        matches,
        source: "api-football",
        fetchedAt: new Date().toISOString(),
      };
    } catch (err) {
      console.warn(`[team-form] API-Football failed for team ${internalId}:`, err);
      // fall through to mock
    }
  }

  return {
    teamId: internalId,
    afTeamId,
    matches: buildMockForm(internalId),
    source: "mock",
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Batch-fetch form for multiple teams. Results are fetched in parallel
 * but rate-limited to 3 concurrent requests to stay within free tier.
 */
export async function getTeamFormBatch(
  internalIds: number[],
): Promise<Map<number, TeamFormData>> {
  const CONCURRENCY = 3;
  const result = new Map<number, TeamFormData>();

  for (let i = 0; i < internalIds.length; i += CONCURRENCY) {
    const chunk = internalIds.slice(i, i + CONCURRENCY);
    const settled = await Promise.allSettled(chunk.map((id) => getTeamForm(id)));
    settled.forEach((s, idx) => {
      if (s.status === "fulfilled") result.set(chunk[idx], s.value);
    });
  }

  return result;
}
