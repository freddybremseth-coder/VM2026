/**
 * AI scoreline predictor — "Freddy foreslår".
 *
 * Predicts a scoreline by maximising expected competition points (3 for an
 * exact score, 1 for the correct outcome) under the same Dixon-Coles model
 * that powers the value dashboard. Used for the one-tap "Freddy" tip
 * suggestion shown to users on the predictions board.
 *
 * (The standalone bot competitor that auto-entered the leagues was removed —
 * this is purely the suggestion engine now.)
 */

import { FIXTURES } from "@/lib/wc26-fixtures";
import { getTeamStrengths } from "@/lib/tournament-predictions";
import { expectedPointsScoreline } from "@/lib/tippemodell/dixon-coles";
import type { TeamStrength } from "@/lib/tournament-sim";

export interface Scoreline {
  home: number;
  away: number;
}

/** Suggested scoreline for two teams from preloaded strengths (sync). */
export function suggestScoreline(
  homeId: number,
  awayId: number,
  strengths: Map<number, TeamStrength>,
): Scoreline | null {
  const home = strengths.get(homeId);
  const away = strengths.get(awayId);
  if (!home || !away) return null;
  const s = expectedPointsScoreline(home, away);
  return { home: s.home, away: s.away };
}

/**
 * Suggested scorelines for many fixtures at once (loads strengths once).
 * Returns a map of matchId → scoreline for every group fixture we can model.
 */
export async function suggestScorelines(
  matchIds: number[],
): Promise<Map<number, Scoreline>> {
  const strengths = await getTeamStrengths();
  const out = new Map<number, Scoreline>();
  for (const id of matchIds) {
    const fx = FIXTURES.find((f) => f.id === id);
    if (!fx?.homeId || !fx?.awayId) continue;
    const s = suggestScoreline(fx.homeId, fx.awayId, strengths);
    if (s) out.set(id, s);
  }
  return out;
}

/**
 * Suggestions from explicit (matchId, homeId, awayId) triples — for knockout
 * fixtures whose teams are resolved from group standings at request time, not
 * stored on the static fixture.
 */
export async function suggestScorelinesFor(
  pairs: Array<{ matchId: number; homeId: number; awayId: number }>,
): Promise<Map<number, Scoreline>> {
  const strengths = await getTeamStrengths();
  const out = new Map<number, Scoreline>();
  for (const p of pairs) {
    const s = suggestScoreline(p.homeId, p.awayId, strengths);
    if (s) out.set(p.matchId, s);
  }
  return out;
}
