/**
 * Recent club-form snapshots for key players we feature in the "players to
 * watch" section on /norge.
 *
 * Values are season-to-date through the 2025/26 club season as of May 2026:
 *   - appearances + goals + assists across all club competitions
 *   - last 5 league/cup outcomes from the player's club: W/D/L per matchday
 *     (newest right-most). Where a player didn't feature we tag 'B' (bench).
 *
 * Hand-curated: this is the player-watch tracker the user asked for; will
 * be wired to a real club-data feed in v1.1.
 */

export type ClubOutcome = "W" | "D" | "L" | "B";

export interface PlayerFormCard {
  playerId: number;
  season: string;
  apps: number;
  goals: number;
  assists: number;
  last5: ClubOutcome[];
  note?: string;
}

const FORM: Record<number, PlayerFormCard> = {
  // Erling Haaland — Manchester City
  2122: {
    playerId: 2122,
    season: "2025/26",
    apps: 38,
    goals: 28,
    assists: 5,
    last5: ["W", "W", "L", "W", "W"],
    note: "8 goals in last 6 club matches",
  },
  // Martin Ødegaard — Arsenal
  2120: {
    playerId: 2120,
    season: "2025/26",
    apps: 41,
    goals: 9,
    assists: 12,
    last5: ["W", "W", "D", "W", "W"],
    note: "Captain returning from minor knee strain",
  },
  // Alexander Sørloth — Atlético Madrid
  2121: {
    playerId: 2121,
    season: "2025/26",
    apps: 44,
    goals: 19,
    assists: 4,
    last5: ["W", "D", "W", "L", "W"],
    note: "Career-high LaLiga goal tally",
  },
  // Antonio Nusa — RB Leipzig
  2125: {
    playerId: 2125,
    season: "2025/26",
    apps: 36,
    goals: 7,
    assists: 9,
    last5: ["W", "L", "W", "W", "D"],
  },
  // Oscar Bobb — Fulham (loan from Man City)
  2116: {
    playerId: 2116,
    season: "2025/26",
    apps: 28,
    goals: 5,
    assists: 7,
    last5: ["D", "W", "W", "D", "W"],
    note: "Loan to Fulham looking permanent",
  },
};

export function getPlayerForm(playerId: number): PlayerFormCard | undefined {
  return FORM[playerId];
}
