/**
 * Team pre-tournament form — last N international matches.
 *
 * Fetches from ESPN's public team-schedule endpoint (covers ALL leagues
 * including friendlies, qualifiers, and WC), keeps the most recent N
 * finished matches and computes W/D/L. Falls back to a deterministic mock
 * only when ESPN is unreachable so the UI never goes blank.
 *
 * Endpoint:
 *   GET https://site.api.espn.com/apis/site/v2/sports/soccer/all/teams/{espnId}/schedule
 *
 * Cache strategy: revalidate every 6 hours — match data lands in this feed
 * within minutes, but pre-tournament friendlies don't change minute-to-minute.
 */

import { getEspnTeamId } from "./espn-team-ids";

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
  espnTeamId?: string;   // ESPN team id (if mapped)
  matches: FormMatch[];  // most recent first
  source: "espn" | "mock";
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
// ESPN fetcher (public, no API key required)
// ─────────────────────────────────────────────────────────────────────────────

interface EspnCompetitor {
  homeAway: "home" | "away";
  team: { id: string; displayName: string };
  // Score lands as either a string or a { displayValue } depending on whether
  // ESPN has populated the rich event detail yet. We handle both.
  score?: string | { displayValue?: string; value?: number };
}
interface EspnSchedEvent {
  date: string;
  league?: { name?: string };
  competitions: Array<{
    competitors: EspnCompetitor[];
    status?: { type?: { completed?: boolean; name?: string } };
  }>;
}

function readScore(s: EspnCompetitor["score"]): number | null {
  if (s === undefined || s === null) return null;
  if (typeof s === "string") {
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }
  if (typeof s.value === "number") return s.value;
  if (s.displayValue !== undefined) {
    const n = Number(s.displayValue);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

async function fetchFromEspn(
  espnTeamId: string,
  last = 5,
): Promise<FormMatch[]> {
  const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/all/teams/${espnTeamId}/schedule`;
  const res = await fetch(url, { next: { revalidate: 6 * 3600 } });
  if (!res.ok) throw new Error(`espn: ${res.status}`);

  const json = (await res.json()) as { events?: EspnSchedEvent[] };
  const events = json.events ?? [];

  // Keep only finished matches and sort newest-first.
  const finished = events
    .filter((e) => e.competitions[0]?.status?.type?.completed === true)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, last);

  return finished
    .map((e): FormMatch | null => {
      const comp = e.competitions[0];
      const us = comp.competitors.find((c) => c.team.id === espnTeamId);
      const them = comp.competitors.find((c) => c.team.id !== espnTeamId);
      if (!us || !them) return null;
      const gf = readScore(us.score);
      const ga = readScore(them.score);
      if (gf === null || ga === null) return null;
      const result: FormResult = gf > ga ? "W" : gf < ga ? "L" : "D";
      const oppName = them.team.displayName;
      return {
        date: e.date.slice(0, 10),
        opponent: oppName.length > 12 ? oppName.slice(0, 12) : oppName,
        goalsFor: gf,
        goalsAgainst: ga,
        result,
        venue: us.homeAway === "home" ? "H" : "A",
        competition: e.league?.name ?? "International",
      };
    })
    .filter((m): m is FormMatch => m !== null);
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get the last 5 international matches for a team.
 * Falls back to mock data when:
 *   - team ID not mapped to ESPN, OR
 *   - ESPN request fails
 */
export async function getTeamForm(internalId: number): Promise<TeamFormData> {
  const espnTeamId = getEspnTeamId(internalId);

  if (espnTeamId) {
    try {
      const matches = await fetchFromEspn(espnTeamId);
      if (matches.length > 0) {
        return {
          teamId: internalId,
          espnTeamId,
          matches,
          source: "espn",
          fetchedAt: new Date().toISOString(),
        };
      }
    } catch (err) {
      console.warn(`[team-form] ESPN failed for team ${internalId}:`, err);
      // fall through to mock
    }
  }

  return {
    teamId: internalId,
    espnTeamId,
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
