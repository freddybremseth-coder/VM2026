/**
 * Group-stage standings computed from match_results.
 *
 * Tiebreakers follow FIFA's WC 2026 regulation order, abbreviated:
 *   1. Points (3 win, 1 draw, 0 loss)
 *   2. Goal difference across all group matches
 *   3. Goals for across all group matches
 *   4. Head-to-head points among tied teams
 *   5. Head-to-head goal difference among tied teams
 *   6. Head-to-head goals for among tied teams
 *
 * Fair play and drawing of lots (the final two FIFA tiebreakers) are not
 * modelled — they almost never apply and we don't have the data anyway.
 *
 * Until the group is fully played the rows are still sorted by whatever
 * tiebreaker is decisive at that point, so the table is meaningful all the
 * way through the matchdays.
 */

import { FIXTURES } from "@/lib/wc26-fixtures";
import { teamsByGroup, type GroupId } from "@/lib/wc26-data";

export interface ResultRow {
  match_id: number;
  home_score: number;
  away_score: number;
  /** match_results.status — must be one of these before we count it. */
  status: "live" | "halftime" | "finished" | string;
}

export interface GroupStandingRow {
  teamId: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
}

/**
 * Compute the standings for a single group. Pass the in-memory match results;
 * the function will only count matches whose status is finished/live/halftime
 * (live counts but minute may keep changing).
 */
export function computeGroupStandings(
  group: GroupId,
  results: ResultRow[],
): GroupStandingRow[] {
  const teams = teamsByGroup(group);
  const groupFixtures = FIXTURES.filter(
    (f) =>
      f.stage.kind === "group" &&
      f.stage.group === group &&
      f.homeId &&
      f.awayId,
  );

  // Build empty rows in seed order.
  const byTeam = new Map<number, GroupStandingRow>();
  for (const t of teams) {
    byTeam.set(t.id, {
      teamId: t.id,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDiff: 0,
      points: 0,
    });
  }

  const resultsByMatch = new Map<number, ResultRow>();
  for (const r of results) {
    if (
      r.status === "finished" ||
      r.status === "live" ||
      r.status === "halftime"
    ) {
      resultsByMatch.set(r.match_id, r);
    }
  }

  for (const f of groupFixtures) {
    const r = resultsByMatch.get(f.id);
    if (!r || f.homeId === undefined || f.awayId === undefined) continue;
    const home = byTeam.get(f.homeId);
    const away = byTeam.get(f.awayId);
    if (!home || !away) continue;
    home.played++;
    away.played++;
    home.goalsFor += r.home_score;
    home.goalsAgainst += r.away_score;
    away.goalsFor += r.away_score;
    away.goalsAgainst += r.home_score;
    if (r.home_score > r.away_score) {
      home.won++;
      away.lost++;
      home.points += 3;
    } else if (r.home_score < r.away_score) {
      away.won++;
      home.lost++;
      away.points += 3;
    } else {
      home.drawn++;
      away.drawn++;
      home.points += 1;
      away.points += 1;
    }
  }

  for (const r of byTeam.values()) r.goalDiff = r.goalsFor - r.goalsAgainst;

  // Sort with FIFA tiebreakers. Head-to-head is only consulted between teams
  // that are tied on points; we resolve in groups of equal points.
  const rows = Array.from(byTeam.values());
  rows.sort((a, b) => sortPair(a, b, resultsByMatch));
  return rows;
}

function sortPair(
  a: GroupStandingRow,
  b: GroupStandingRow,
  resultsByMatch: Map<number, ResultRow>,
): number {
  if (b.points !== a.points) return b.points - a.points;
  if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
  if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
  // Head-to-head between the two tied teams.
  const h2h = headToHead(a.teamId, b.teamId, resultsByMatch);
  if (h2h !== 0) return h2h;
  return 0; // stable — original seed order preserved
}

/**
 * Returns the comparator sign for the head-to-head between two teams, applying
 * FIFA's nested tiebreakers in order: points → goal diff → goals for.
 * Returns 0 if they haven't played yet or are still tied.
 */
function headToHead(
  teamA: number,
  teamB: number,
  resultsByMatch: Map<number, ResultRow>,
): number {
  const direct = FIXTURES.find(
    (f) =>
      f.stage.kind === "group" &&
      ((f.homeId === teamA && f.awayId === teamB) ||
        (f.homeId === teamB && f.awayId === teamA)),
  );
  if (!direct) return 0;
  const r = resultsByMatch.get(direct.id);
  if (!r) return 0;
  const homeIsA = direct.homeId === teamA;
  const goalsA = homeIsA ? r.home_score : r.away_score;
  const goalsB = homeIsA ? r.away_score : r.home_score;
  if (goalsA > goalsB) return -1;
  if (goalsA < goalsB) return 1;
  return 0;
}

/**
 * Convenience: compute standings for all 12 groups in one call.
 */
export function computeAllGroupStandings(
  results: ResultRow[],
): Record<GroupId, GroupStandingRow[]> {
  const groups: GroupId[] = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
  ];
  const out = {} as Record<GroupId, GroupStandingRow[]>;
  for (const g of groups) {
    out[g] = computeGroupStandings(g, results);
  }
  return out;
}

/**
 * Slot resolver — turn a FIFA bracket slot code ("1A", "2B", "3X", "W74",
 * "L101") into a real team id once the relevant group is decided. Returns
 * null if the slot can't be resolved yet (group still in progress, or for
 * W/L slots when the feeder match hasn't finished).
 *
 * "3X" (best third-place) is too complex to resolve here — it requires
 * cross-group third-place ranking — so we leave it null. The bracket page
 * shows the slot label in that case.
 */
export function resolveSlotToTeam(
  slot: string | undefined,
  standings: Record<GroupId, GroupStandingRow[]>,
  resultsByMatch: Map<number, ResultRow>,
): number | null {
  if (!slot) return null;
  if (slot === "3X") return null;
  if (slot.startsWith("W") || slot.startsWith("L")) {
    const feederId = Number(slot.slice(1));
    if (!Number.isFinite(feederId)) return null;
    const feeder = FIXTURES.find((f) => f.id === feederId);
    if (!feeder) return null;
    const r = resultsByMatch.get(feeder.id);
    if (!r || r.status !== "finished") return null;
    // For W/L we need the resolved teams in the feeder match. If it's a
    // group-stage feeder we know homeId/awayId directly; if it's another
    // knockout, recursive resolve.
    let homeId = feeder.homeId ?? null;
    let awayId = feeder.awayId ?? null;
    if (!homeId)
      homeId = resolveSlotToTeam(feeder.homeSlot, standings, resultsByMatch);
    if (!awayId)
      awayId = resolveSlotToTeam(feeder.awaySlot, standings, resultsByMatch);
    if (!homeId || !awayId) return null;
    const homeWon = r.home_score > r.away_score;
    if (slot.startsWith("W")) return homeWon ? homeId : awayId;
    return homeWon ? awayId : homeId;
  }
  // "1A", "2B", etc. — only resolves once the group is fully played.
  const placeChar = slot[0];
  const group = slot.slice(1) as GroupId;
  const rows = standings[group];
  if (!rows) return null;
  // All three matchdays must be played before we trust the order.
  const fullyPlayed = rows.every((r) => r.played === 3);
  if (!fullyPlayed) return null;
  const idx = placeChar === "1" ? 0 : placeChar === "2" ? 1 : null;
  if (idx === null) return null;
  return rows[idx]?.teamId ?? null;
}
