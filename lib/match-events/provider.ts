/**
 * Provider abstraction for match-event data.
 *
 * Every provider must implement `fetchMatchEvents`. The router in
 * `getMatchEvents()` picks the live ESPN provider first (no key required),
 * and falls back to deterministic mock data on failure.
 *
 * Callers import `getMatchEvents` — never the individual providers directly.
 */

import type { MatchEventData, PlayerHeatmap, ShotEvent } from "./types";
import { fetchMockEvents } from "./mock-provider";
import { fetchEspnEvents } from "./espn-provider";

export interface EventProvider {
  fetchMatchEvents(matchId: number): Promise<MatchEventData>;
}

/**
 * Returns full match event data for the given match ID.
 * Tries ESPN's public endpoint first; falls back to mock data on error
 * (network issue, fixture not in window, etc.).
 */
export async function getMatchEvents(matchId: number): Promise<MatchEventData> {
  try {
    return await fetchEspnEvents(matchId);
  } catch (err) {
    console.warn("[match-events] ESPN failed, falling back to mock:", err);
  }
  return fetchMockEvents(matchId);
}

/**
 * Returns heatmap + shots for a specific player across all known matches.
 * Returns null if no data is available for this player.
 */
export async function getPlayerEventData(playerId: number): Promise<{
  heatmap: PlayerHeatmap | null;
  shots: ShotEvent[];
  matchId: number;
  matchLabel: string;
} | null> {
  // For now we only have event data for the demo match (1001).
  // When real matches start, extend this to query all finished matches.
  const KNOWN_MATCH_IDS = [1001];

  for (const matchId of KNOWN_MATCH_IDS) {
    const data = await getMatchEvents(matchId);
    const heatmap = data.heatmaps?.find((h) => h.playerId === playerId) ?? null;
    const shots = data.shots.filter((s) => s.playerName && s.playerId === playerId);
    // Fall back to name-matching for shots in mock data (shots don't carry playerId yet)
    const namedShots = data.shots.filter((s) => {
      if (!heatmap) return false;
      const n = heatmap.playerName.toLowerCase();
      return s.playerName?.toLowerCase().includes(n.split(".").pop()?.trim() ?? "NOMATCH");
    });

    if (heatmap || namedShots.length > 0) {
      const label = `${data.homeName} vs ${data.awayName}`;
      return { heatmap, shots: shots.length ? shots : namedShots, matchId, matchLabel: label };
    }
  }
  return null;
}
