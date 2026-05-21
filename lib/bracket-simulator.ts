/**
 * Bracket-simulator data and helpers.
 *
 * The real WC26 bracket pairings depend on group standings, which won't be
 * finalised until 27 June. Until then we provide a *what-if* simulator: pick
 * 32 seed teams (top 2 from each of 12 groups + 8 best 3rds), then play out
 * R32 → R16 → QF → SF → Final by picking winners.
 *
 * Auto-fill modes:
 *   - `rank`    — favourite by FIFA rank always wins
 *   - `chaos`   — every match is 50/50
 *   - `norway`  — Norway goes as deep as possible; otherwise rank-based
 */

import { GROUPS, TEAMS, teamById, type WCTeam } from "./wc26-data";

export type SimulatorMode = "rank" | "chaos" | "norway";

/** All 48 teams from the 12 groups, sorted by FIFA rank ascending. */
function teamsByRank(): WCTeam[] {
  return [...TEAMS].sort(
    (a, b) => (a.fifaRank ?? 200) - (b.fifaRank ?? 200),
  );
}

/**
 * Returns 32 teams seeded by FIFA rank — close enough proxy for "top 2 +
 * best 3rds" until we have real group standings.
 */
export function seedR32(): WCTeam[] {
  return teamsByRank().slice(0, 32);
}

/** Picks one of two teams based on the simulator mode. */
export function pickWinner(
  a: WCTeam,
  b: WCTeam,
  mode: SimulatorMode,
  random: () => number = Math.random,
): WCTeam {
  if (mode === "chaos") {
    return random() < 0.5 ? a : b;
  }
  if (mode === "norway") {
    if (a.shortName === "NOR") return a;
    if (b.shortName === "NOR") return b;
    // Fallthrough to rank
  }
  return (a.fifaRank ?? 200) <= (b.fifaRank ?? 200) ? a : b;
}

/**
 * Plays out an entire bracket from a 32-team seed list. Returns the team that
 * won each tie at each round, with the final winner at the end.
 */
export function simulate(
  seed: WCTeam[],
  mode: SimulatorMode,
  random: () => number = Math.random,
): {
  rounds: { name: string; ties: Array<[WCTeam, WCTeam]>; winners: WCTeam[] }[];
  champion: WCTeam;
} {
  const roundNames = [
    "Round of 32",
    "Round of 16",
    "Quarter-finals",
    "Semi-finals",
    "Final",
  ];
  let current = seed;
  const rounds: { name: string; ties: Array<[WCTeam, WCTeam]>; winners: WCTeam[] }[] = [];

  for (const name of roundNames) {
    const ties: Array<[WCTeam, WCTeam]> = [];
    const winners: WCTeam[] = [];
    for (let i = 0; i < current.length; i += 2) {
      const a = current[i];
      const b = current[i + 1];
      ties.push([a, b]);
      winners.push(pickWinner(a, b, mode, random));
    }
    rounds.push({ name, ties, winners });
    current = winners;
  }

  return { rounds, champion: current[0] };
}

export function modeLabel(mode: SimulatorMode): string {
  switch (mode) {
    case "rank":
      return "By FIFA rank";
    case "chaos":
      return "Chaos mode";
    case "norway":
      return "Norway dream run";
  }
}

export function modeDescription(mode: SimulatorMode): string {
  switch (mode) {
    case "rank":
      return "The higher-ranked team wins every tie. Boring but realistic.";
    case "chaos":
      return "Every match is a coin flip. Re-roll until you like the answer.";
    case "norway":
      return "Norway wins every match they play. Other ties go by rank.";
  }
}

export const GROUPS_ID = GROUPS;
export type { WCTeam };
