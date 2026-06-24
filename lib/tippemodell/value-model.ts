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
import { TEAMS } from "@/lib/wc26-data";
import { getTeamStrengths } from "@/lib/tournament-predictions";
import {
  matchProbabilities,
  expectedPointsScoreline,
  kellyFraction,
  expectedValue,
} from "@/lib/tippemodell/dixon-coles";
import type { OutcomeKey } from "@/lib/tippemodell/dashboard";

// Name → internal team id, built once. Lets us model knockout fixtures
// (whose static fixture rows carry slots like "W74", not team ids) using
// the concrete team names OddsPapi already knows.
function normName(s: string): string {
  const base = s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "");
  return NAME_ALIASES[base] ?? base;
}
const NAME_ALIASES: Record<string, string> = {
  czechrepublic: "czechia",
  turkey: "turkiye",
  ivorycoast: "cotedivoire",
  korearepublic: "southkorea",
  unitedstates: "usa",
  capeverdeislands: "capeverde",
  caboverde: "capeverde",
  bosnia: "bosniaandherzegovina",
  bosniaherzegovina: "bosniaandherzegovina",
  congodr: "drcongo",
  democraticrepublicofthecongo: "drcongo",
};
const INTERNAL_BY_NAME: Map<string, number> = (() => {
  const m = new Map<string, number>();
  for (const t of TEAMS) m.set(normName(t.name), t.id);
  return m;
})();

function teamIdByName(name: string): number | null {
  return INTERNAL_BY_NAME.get(normName(name)) ?? null;
}

/** Quarter-Kelly for safety; full Kelly is famously too aggressive. */
const KELLY_FRACTION = 0.25;
/** Never suggest staking more than this share of bankroll on one bet. */
const KELLY_CAP = 0.05;
/** Minimum EV to call something "value" (covers model noise). */
export const VALUE_EV_THRESHOLD = 0.02;
/**
 * Upper bound on a believable edge. Against a 90+ bookmaker market the
 * closing line is sharp; an apparent edge above this is almost always our
 * model being overconfident on thin data, not free money. We still show
 * the model probability, but we do NOT flag it as value or suggest a
 * stake — flagging a 40% "edge" as a bet would be dishonest.
 */
export const MAX_BELIEVABLE_EV = 0.15;

export interface OutcomeValue {
  outcome: string;
  /** Our Dixon-Coles probability for this outcome. */
  modelProb: number;
  /** Expected value per unit at the best market price (null if no price). */
  ev: number | null;
  /** Suggested stake as a fraction of bankroll (quarter-Kelly, capped). */
  kelly: number | null;
  /** True when ev is in the believable value band. */
  isValue: boolean;
  /** True when the model diverges from the market beyond what's credible —
   *  shown as "model disagrees", never as a value bet. */
  modelDiverges: boolean;
}

export interface MatchValue {
  lambdaHome: number;
  lambdaAway: number;
  /** 1X2 market. */
  outcomes: Record<OutcomeKey, OutcomeValue>;
  /** Over/Under 2.5 goals — keyed "over" / "under". */
  totals: Record<"over" | "under", OutcomeValue>;
  /** Both teams to score — keyed "yes" / "no". */
  btts: Record<"yes" | "no", OutcomeValue>;
  /** Most likely scoreline (maximises expected 3/1 points) + its probability. */
  predictedScore: { home: number; away: number; prob: number };
}

/**
 * EV / Kelly / value-band classification for one outcome, shared by every
 * market so the honesty rules (believable-edge band, no stake on diverging
 * lines) apply identically to 1X2, totals and BTTS.
 */
function evaluate(
  outcome: string,
  modelProb: number,
  odds: number | null,
): OutcomeValue {
  let ev: number | null = null;
  let kelly: number | null = null;
  let isValue = false;
  let modelDiverges = false;
  if (odds && odds > 1) {
    ev = expectedValue(modelProb, odds);
    if (ev > MAX_BELIEVABLE_EV) {
      modelDiverges = true;
    } else if (ev > VALUE_EV_THRESHOLD) {
      isValue = true;
      const fullKelly = kellyFraction(modelProb, odds);
      kelly = Math.min(KELLY_CAP, fullKelly * KELLY_FRACTION);
    }
  }
  return { outcome, modelProb, ev, kelly, isValue, modelDiverges };
}

/**
 * Compute model probabilities + value metrics for a single WC fixture.
 * `bestOddsByOutcome` carries the best market decimal odds we already
 * pulled for the dashboard, so we don't re-query.
 */
export interface BestOdds {
  /** 1X2 best decimal odds. */
  h2h?: Partial<Record<OutcomeKey, number>>;
  /** Over/Under 2.5 best decimal odds. */
  totals?: Partial<Record<"over" | "under", number>>;
  /** BTTS best decimal odds. */
  btts?: Partial<Record<"yes" | "no", number>>;
}

export async function getMatchValue(
  wc26FixtureId: number,
  best: BestOdds,
  teamNames?: { home: string; away: string },
): Promise<MatchValue | null> {
  // Resolve internal team ids. Group fixtures carry homeId/awayId directly;
  // knockout fixtures only have slots ("W74"), so fall back to resolving the
  // concrete team names OddsPapi provided.
  const fixture = FIXTURES.find((f) => f.id === wc26FixtureId);
  let homeId = fixture?.homeId ?? null;
  let awayId = fixture?.awayId ?? null;
  if ((!homeId || !awayId) && teamNames) {
    homeId = homeId ?? teamIdByName(teamNames.home);
    awayId = awayId ?? teamIdByName(teamNames.away);
  }
  if (!homeId || !awayId) return null;

  const strengths = await getTeamStrengths();
  const home = strengths.get(homeId);
  const away = strengths.get(awayId);
  if (!home || !away) return null;

  const probs = matchProbabilities(home, away);
  const modelByOutcome: Record<OutcomeKey, number> = {
    home: probs.home,
    draw: probs.draw,
    away: probs.away,
  };

  const outcomes = {} as Record<OutcomeKey, OutcomeValue>;
  for (const oc of ["home", "draw", "away"] as const) {
    outcomes[oc] = evaluate(oc, modelByOutcome[oc], best.h2h?.[oc] ?? null);
  }

  const totals = {
    over: evaluate("over", probs.over25, best.totals?.over ?? null),
    under: evaluate("under", probs.under25, best.totals?.under ?? null),
  };

  const btts = {
    yes: evaluate("yes", probs.bttsYes, best.btts?.yes ?? null),
    no: evaluate("no", probs.bttsNo, best.btts?.no ?? null),
  };

  const score = expectedPointsScoreline(home, away);

  return {
    lambdaHome: probs.lambdaHome,
    lambdaAway: probs.lambdaAway,
    outcomes,
    totals,
    btts,
    predictedScore: { home: score.home, away: score.away, prob: score.prob },
  };
}
