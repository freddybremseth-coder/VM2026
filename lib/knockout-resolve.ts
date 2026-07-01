/**
 * Shared knockout team resolver — turns every knockout fixture's slots into
 * concrete team ids, including the eight "best third-placed" slots ("3X").
 *
 * Used by every surface that shows knockout ties (predictions, the home
 * bracket strip, the schedule, the tree) so they all agree.
 *
 * Best-thirds: once all 12 groups are complete, rank the twelve third-placed
 * teams by the FIFA group criteria (points, goal difference, goals for) and
 * take the top 8. They fill the eight "3X" R32 slots, assigned greedily to the
 * highest-ranked third that doesn't create a same-group rematch with the group
 * winner on the other side of the tie. (This is a best-effort allocation — the
 * official FIFA combination table can differ — but grading is score-based per
 * match id, and results attach via the group-winner side, so it stays correct
 * where it counts.)
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { FIXTURES, type Fixture } from "@/lib/wc26-fixtures";
import {
  computeAllGroupStandings,
  resolveSlotToTeam,
  type GroupStandingRow,
  type ResultRow,
} from "@/lib/group-standings";
import { GROUPS, type GroupId } from "@/lib/wc26-data";

export interface ResolvedTeams {
  homeId: number | null;
  awayId: number | null;
}

const GROUP_IDS: readonly GroupId[] = GROUPS;

/** True only when every group has all four teams done with three matches. */
function allGroupsComplete(standings: Record<GroupId, GroupStandingRow[]>): boolean {
  return GROUP_IDS.every((g) => {
    const rows = standings[g];
    return rows && rows.length === 4 && rows.every((r) => r.played >= 3);
  });
}

interface ThirdRow {
  groupId: GroupId;
  teamId: number;
  points: number;
  goalDiff: number;
  goalsFor: number;
}

/** The twelve third-placed teams ranked best→worst (FIFA criteria). */
export function rankThirds(
  standings: Record<GroupId, GroupStandingRow[]>,
): ThirdRow[] {
  const thirds: ThirdRow[] = [];
  for (const g of GROUP_IDS) {
    const r = standings[g]?.[2];
    if (r) {
      thirds.push({
        groupId: g,
        teamId: r.teamId,
        points: r.points,
        goalDiff: r.goalDiff,
        goalsFor: r.goalsFor,
      });
    }
  }
  thirds.sort(
    (a, b) =>
      b.points - a.points ||
      b.goalDiff - a.goalDiff ||
      b.goalsFor - a.goalsFor ||
      a.teamId - b.teamId,
  );
  return thirds;
}

/** group letter from a winner/runner-up slot like "1E" / "2B". */
function slotGroup(slot: string | undefined): GroupId | null {
  if (!slot || slot.length < 2) return null;
  const g = slot.slice(1) as GroupId;
  return GROUP_IDS.includes(g) ? g : null;
}

/**
 * The OFFICIAL best-third → R32-slot assignment (from the real WC 2026 draw).
 * Each "3X" fixture id maps to the group whose third-placed team fills it.
 * This replaces the earlier heuristic, which produced the wrong pairings —
 * the draw's combination table isn't derivable from our data, but the actual
 * result is known, so we pin it. (Verified against ESPN's R32 schedule.)
 */
const BEST_THIRD_GROUP_BY_FIXTURE: Record<number, GroupId> = {
  74: "D", // Germany   vs 3D (Paraguay)
  77: "F", // France    vs 3F (Sweden)
  79: "E", // Mexico    vs 3E (Ecuador)
  80: "K", // England   vs 3K (DR Congo)
  81: "B", // USA       vs 3B (Bosnia)
  82: "I", // Belgium   vs 3I (Senegal)
  85: "J", // Switzerland vs 3J (Algeria)
  87: "L", // Colombia  vs 3L (Ghana)
};

/**
 * Map of "3X" fixture id → assigned best-third team id. Empty until all groups
 * are complete (the third-placed teams aren't final before then).
 */
export function assignBestThirds(
  standings: Record<GroupId, GroupStandingRow[]>,
): Map<number, number> {
  const out = new Map<number, number>();
  if (!allGroupsComplete(standings)) return out;
  for (const [fid, group] of Object.entries(BEST_THIRD_GROUP_BY_FIXTURE)) {
    const third = standings[group]?.[2];
    if (third) out.set(Number(fid), third.teamId);
  }
  return out;
}

/** Resolve one knockout fixture's two team ids (null where not yet known). */
export function resolveFixtureTeams(
  fixture: Fixture,
  standings: Record<GroupId, GroupStandingRow[]>,
  resultsByMatch: Map<number, ResultRow>,
  bestThirdByFixture: Map<number, number>,
): ResolvedTeams {
  const side = (slot: string | undefined): number | null => {
    if (slot === "3X") return bestThirdByFixture.get(fixture.id) ?? null;
    return resolveSlotToTeam(slot, standings, resultsByMatch);
  };
  return {
    homeId: fixture.homeId ?? side(fixture.homeSlot),
    awayId: fixture.awayId ?? side(fixture.awaySlot),
  };
}

/**
 * Resolve EVERY knockout fixture in one pass. Returns fixtureId → {homeId,
 * awayId}. Group fixtures are omitted (use their static homeId/awayId).
 */
export function resolveAllKnockout(
  standings: Record<GroupId, GroupStandingRow[]>,
  resultsByMatch: Map<number, ResultRow>,
): Map<number, ResolvedTeams> {
  const bestThirds = assignBestThirds(standings);
  const out = new Map<number, ResolvedTeams>();
  for (const f of FIXTURES) {
    if (f.stage.kind !== "knockout") continue;
    out.set(f.id, resolveFixtureTeams(f, standings, resultsByMatch, bestThirds));
  }
  return out;
}

/** Load results from the DB and resolve every knockout tie's teams. */
export async function loadKnockoutTeams(
  supabase: SupabaseClient,
): Promise<Map<number, ResolvedTeams>> {
  const { data } = await supabase
    .from("match_results")
    .select("match_id, home_score, away_score, status");
  const rows = ((data as Array<{
    match_id: number;
    home_score: number | null;
    away_score: number | null;
    status: string;
  }> | null) ?? [])
    .filter((r) => r.home_score !== null && r.away_score !== null)
    .map((r) => ({
      match_id: r.match_id,
      home_score: r.home_score as number,
      away_score: r.away_score as number,
      status: r.status,
    })) as ResultRow[];
  const resultsByMatch = new Map(rows.map((r) => [r.match_id, r]));
  const standings = computeAllGroupStandings(rows);
  return resolveAllKnockout(standings, resultsByMatch);
}

/** Effective home/away ids: group fixtures direct, knockout resolved. */
export function effectiveTeams(
  fixture: Fixture,
  koTeams: Map<number, ResolvedTeams>,
): { homeId: number | null; awayId: number | null } {
  const r = koTeams.get(fixture.id);
  return {
    homeId: fixture.homeId ?? r?.homeId ?? null,
    awayId: fixture.awayId ?? r?.awayId ?? null,
  };
}
