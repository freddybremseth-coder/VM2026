/**
 * Bracket-simulator data and helpers.
 *
 * FIFA's December 2025 draw locked the R32 bracket structure: every match
 * has a specific slot pair (e.g. K77 = 1I vs Best-3rd) and each later round
 * follows fixed winner-of chains. So if we know which team will likely
 * finish 1st/2nd/3rd in each group, we can seed the simulator with REAL
 * R32 pairings — not just "top 32 by rank".
 *
 * Pre-tournament assumption: within each group, the team with the best FIFA
 * rank wins, second-best is runner-up, third-best is 3rd-placed. The 8 best
 * 3rd-placed teams across all groups are then ordered by FIFA rank and
 * dropped into the 8 "Best-3rd" R32 slots in slot order.
 *
 * Auto-fill modes:
 *   - `rank`    — favourite by FIFA rank always wins
 *   - `chaos`   — every match is 50/50
 *   - `norway`  — Norway goes as deep as possible; otherwise rank-based
 */

import { GROUPS, TEAMS, type GroupId, type WCTeam, teamsByGroup } from "./wc26-data";

export type SimulatorMode = "rank" | "chaos" | "norway";

/** All 48 teams from the 12 groups, sorted by FIFA rank ascending. */
function teamsByRank(): WCTeam[] {
  return [...TEAMS].sort(
    (a, b) => (a.fifaRank ?? 200) - (b.fifaRank ?? 200),
  );
}

/**
 * R32 slot order — the 32 positions in the simulator's seed[] array map to
 * the FIFA-trekning slots in the exact order they need to feed into R16,
 * QF, SF and the Final.
 *
 * Pair 0 (positions 0,1) is match K74; pair 1 (positions 2,3) is K77; etc.
 * Verified against `wc26-fixtures.ts` knockout chain (W74→K89, W77→K89,
 * W89→K97, …).
 *
 *   Pair  R32 match  Slots         Down-stream
 *   0     K74        1E vs 3X      K89 → K97 → K101 → Final
 *   1     K77        1I vs 3X      K89 → K97 → K101 → Final   ← Norway 1I
 *   2     K73        2A vs 2B      K90 → K97 → K101 → Final
 *   3     K75        1F vs 2C      K90 → K97 → K101 → Final
 *   4     K83        2K vs 2L      K93 → K98 → K101 → Final
 *   5     K84        1H vs 2J      K93 → K98 → K101 → Final
 *   6     K81        1D vs 3X      K94 → K98 → K101 → Final
 *   7     K82        1G vs 3X      K94 → K98 → K101 → Final
 *   8     K76        1C vs 2F      K91 → K99 → K102 → Final
 *   9     K78        2E vs 2I      K91 → K99 → K102 → Final   ← Norway 2I
 *   10    K79        1A vs 3X      K92 → K99 → K102 → Final
 *   11    K80        1L vs 3X      K92 → K99 → K102 → Final
 *   12    K86        1J vs 2H      K95 → K100 → K102 → Final
 *   13    K88        2D vs 2G      K95 → K100 → K102 → Final
 *   14    K85        1B vs 3X      K96 → K100 → K102 → Final
 *   15    K87        1K vs 3X      K96 → K100 → K102 → Final
 */
const R32_SLOT_ORDER: string[] = [
  "1E", "3X",  // K74
  "1I", "3X",  // K77
  "2A", "2B",  // K73
  "1F", "2C",  // K75
  "2K", "2L",  // K83
  "1H", "2J",  // K84
  "1D", "3X",  // K81
  "1G", "3X",  // K82
  "1C", "2F",  // K76
  "2E", "2I",  // K78
  "1A", "3X",  // K79
  "1L", "3X",  // K80
  "1J", "2H",  // K86
  "2D", "2G",  // K88
  "1B", "3X",  // K85
  "1K", "3X",  // K87
];

/**
 * Per-group predicted finish order using FIFA rank. The team with the lowest
 * rank number wins the group. Returns Map<group letter, sorted teams>.
 */
function predictedGroupOrder(): Map<GroupId, WCTeam[]> {
  const map = new Map<GroupId, WCTeam[]>();
  for (const g of GROUPS) {
    const sorted = [...teamsByGroup(g)].sort(
      (a, b) => (a.fifaRank ?? 200) - (b.fifaRank ?? 200),
    );
    map.set(g, sorted);
  }
  return map;
}

/**
 * Seeds the simulator with the REAL FIFA bracket pairings.
 *
 * Resolves each slot in R32_SLOT_ORDER:
 *   "1X"  → predicted Group X winner (best FIFA rank in group)
 *   "2X"  → predicted runner-up
 *   "3X"  → next-best 3rd-placed team (we take 8 from the 12 group thirds
 *           by FIFA rank and assign them in slot order)
 */
export function seedR32(): WCTeam[] {
  const order = predictedGroupOrder();

  // 8 best 3rd-placed teams by FIFA rank
  const thirdsAll: WCTeam[] = [];
  for (const g of GROUPS) {
    const sorted = order.get(g);
    if (sorted && sorted[2]) thirdsAll.push(sorted[2]);
  }
  const best8Thirds = thirdsAll
    .sort((a, b) => (a.fifaRank ?? 200) - (b.fifaRank ?? 200))
    .slice(0, 8);

  let thirdIdx = 0;
  const seed: WCTeam[] = [];
  for (const slot of R32_SLOT_ORDER) {
    if (slot === "3X") {
      seed.push(best8Thirds[thirdIdx++]);
      continue;
    }
    const place = slot[0]; // "1" | "2"
    const grp = slot.slice(1) as GroupId;
    const sorted = order.get(grp);
    if (!sorted) throw new Error(`Unknown group ${grp}`);
    const team = place === "1" ? sorted[0] : sorted[1];
    if (!team) throw new Error(`Group ${grp} missing place ${place}`);
    seed.push(team);
  }
  return seed;
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
