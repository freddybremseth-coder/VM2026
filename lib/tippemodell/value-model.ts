/**
 * Value model — joins our Dixon-Coles match probabilities with the live
 * market odds to flag positive-expectation bets.
 *
 * For a WC fixture we know both teams' internal ids (via wc26_fixture_id),
 * look up their attack/defense ratings, run Dixon-Coles for the 1X2
 * probabilities, then for each outcome compare our probability to the best
 * market price:
 *
 *   EV    = ourProb · bestOdds − 1      (>0 → positive expectation)
 *   Kelly = quarter-Kelly stake fraction, capped
 *
 * Non-WC fixtures (no wc26 link) return null — we don't have a strength
 * model for arbitrary leagues yet. That's phase 3+.
 */

import { FIXTURES } from "@/lib/wc26-fixtures";
import { getTeamStrengths } from "@/lib/tournament-predictions";
import {
  matchProbabilities,
  kellyFraction,
  expectedValue,
} from "@/lib/tippemodell/dixon-coles";
import type { OutcomeKey } from "@/lib/tippemodell/dashboard";

/** Quarter-Kelly for safety; full Kelly is famously too aggressive. */
const KELLY_FRACTION = 0.25;
/** Never suggest staking more than this share of bankroll on one bet. */
const KELLY_CAP = 0.05;
/** Minimum EV to call something "value" (covers model noise). */
export const VALUE_EV_THRESHOLD = 0.02;

export interface OutcomeValue {
  outcome: OutcomeKey;
  /** Our Dixon-Coles probability for this outcome. */
  modelProb: number;
  /** Expected value per unit at the best market price (null if no price). */
  ev: number | null;
  /** Suggested stake as a fraction of bankroll (quarter-Kelly, capped). */
  kelly: number | null;
  /** True when ev exceeds the value threshold. */
  isValue: boolean;
}

export interface MatchValue {
  lambdaHome: number;
  lambdaAway: number;
  outcomes: Record<OutcomeKey, OutcomeValue>;
}

/**
 * Compute model probabilities + value metrics for a single WC fixture.
 * `bestOddsByOutcome` carries the best market decimal odds we already
 * pulled for the dashboard, so we don't re-query.
 */
export async function getMatchValue(
  wc26FixtureId: number,
  bestOddsByOutcome: Partial<Record<OutcomeKey, number>>,
): Promise<MatchValue | null> {
  const fixture = FIXTURES.find((f) => f.id === wc26FixtureId);
  if (!fixture || !fixture.homeId || !fixture.awayId) return null;

  const strengths = await getTeamStrengths();
  const home = strengths.get(fixture.homeId);
  const away = strengths.get(fixture.awayId);
  if (!home || !away) return null;

  const probs = matchProbabilities(home, away);
  const modelByOutcome: Record<OutcomeKey, number> = {
    home: probs.home,
    draw: probs.draw,
    away: probs.away,
  };

  const outcomes = {} as Record<OutcomeKey, OutcomeValue>;
  for (const oc of ["home", "draw", "away"] as const) {
    const modelProb = modelByOutcome[oc];
    const odds = bestOddsByOutcome[oc] ?? null;
    let ev: number | null = null;
    let kelly: number | null = null;
    if (odds && odds > 1) {
      ev = expectedValue(modelProb, odds);
      const fullKelly = kellyFraction(modelProb, odds);
      kelly = Math.min(KELLY_CAP, fullKelly * KELLY_FRACTION);
    }
    outcomes[oc] = {
      outcome: oc,
      modelProb,
      ev,
      kelly,
      isValue: ev !== null && ev > VALUE_EV_THRESHOLD,
    };
  }

  return {
    lambdaHome: probs.lambdaHome,
    lambdaAway: probs.lambdaAway,
    outcomes,
  };
}
