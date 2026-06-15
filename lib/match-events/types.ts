/**
 * Event-level data types shared by all providers (mock + real).
 *
 * Designed to map cleanly to:
 *   - Opta / Stats Perform F24 event feed
 *   - API-Football's `/fixtures/events` + `/fixtures/players`
 *   - StatsBomb open data
 *   - FotMob's unofficial JSON
 *
 * Coordinates use a 0-100 unit pitch (Opta-style):
 *   x: 0 (own goal line) → 100 (opponent's goal line)
 *   y: 0 (right touchline) → 100 (left touchline)
 * For two-team visualisations we always flip the away team's events on
 * x-axis when rendering, so both teams' chances appear to attack the same way.
 */

export type Side = "home" | "away";

export type ShotOutcome =
  | "goal"
  | "saved"
  | "blocked"
  | "off-target"
  | "post"
  | "own-goal";

export type ShotBodyPart = "left-foot" | "right-foot" | "head" | "other";
export type ShotSituation =
  | "open-play"
  | "set-piece"
  | "corner"
  | "free-kick"
  | "penalty"
  | "counter";

export interface ShotEvent {
  id: string;
  minute: number;
  /** Stoppage time within the minute, if known. */
  addedMinute?: number;
  side: Side;
  playerId?: number;
  playerName: string;
  /** Pitch coords from the *shooting* team's attacking perspective. */
  x: number;
  y: number;
  xg: number;
  outcome: ShotOutcome;
  bodyPart?: ShotBodyPart;
  situation?: ShotSituation;
  assistedBy?: string;
}

export interface XGTimelinePoint {
  minute: number;
  home: number;
  away: number;
}

/**
 * Player heatmap as an 8×12 density grid (cells of `value` 0-1).
 * Real providers send touch events; we aggregate touches into the grid.
 * Mock provider samples a Gaussian around the player's typical position.
 */
export interface PlayerHeatmap {
  playerId: number;
  playerName: string;
  side: Side;
  touches: number;
  /** 8 rows (y axis) × 12 cols (x axis), each 0-1 normalised. */
  grid: number[][];
}

export interface MatchEventData {
  matchId: number;
  status: "scheduled" | "live" | "halftime" | "finished";
  minute?: number;
  homeName: string;
  awayName: string;
  homeShort: string;
  awayShort: string;
  xgTimeline: XGTimelinePoint[];
  shots: ShotEvent[];
  /** Optional. Mock + some real providers omit this. */
  heatmaps?: PlayerHeatmap[];
  /** Where the data came from — surfaced in the UI as the source-of-truth chip. */
  source: "mock" | "api-football" | "espn" | "fotmob" | "opta" | "statsbomb";
  /** ISO timestamp. */
  generatedAt: string;
}
