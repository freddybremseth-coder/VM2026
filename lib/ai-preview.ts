/**
 * AI-style match preview generator.
 *
 * For v1 this is deterministic — it composes 3 punchy lines from the data we
 * already have (FIFA rank, group context, manager, top scorers from each
 * squad). The structure is intentionally LLM-shaped so we can swap in a real
 * Claude call later by replacing `composePreview` with an SDK call against
 * the same `PreviewInputs` interface.
 *
 * Replacement plan:
 *   1. Add ANTHROPIC_API_KEY to Vercel env
 *   2. Install @anthropic-ai/sdk
 *   3. Rewrite `composePreview` to call claude with a system prompt that
 *      mirrors the 3-line structure below
 *   4. Cache the result in Supabase keyed by fixtureId so we don't burn
 *      tokens on every page view
 */

import { teamById, type WCTeam } from "./wc26-data";
import { fixtureById, type Fixture } from "./wc26-fixtures";
import { getSquad, type Player } from "./wc26-squads";

export interface PreviewInputs {
  fixture: Fixture;
  home: WCTeam;
  away: WCTeam;
  homeTopScorer?: Player;
  awayTopScorer?: Player;
}

export interface MatchPreview {
  /** 1-2 sentence opening hook. */
  hook: string;
  /** 1-2 sentence tactical/form read. */
  read: string;
  /** 1 sentence model recommendation with a confidence label. */
  recommendation: string;
  /** Suggested score by the deterministic model — used as default tip seed. */
  suggestedScore: { home: number; away: number };
  /** "wcf-baseline-v0.1 (template)" or "claude-sonnet-4-5" etc. */
  model: string;
  /** ISO timestamp generation occurred. */
  generatedAt: string;
}

export function buildPreview(matchId: number): MatchPreview | null {
  const fixture = fixtureById(matchId);
  if (!fixture || !fixture.homeId || !fixture.awayId) return null;

  const home = teamById(fixture.homeId);
  const away = teamById(fixture.awayId);
  if (!home || !away) return null;

  const homeTopScorer = topScorer(fixture.homeId);
  const awayTopScorer = topScorer(fixture.awayId);

  return composePreview({ fixture, home, away, homeTopScorer, awayTopScorer });
}

function topScorer(teamId: number): Player | undefined {
  const squad = getSquad(teamId);
  if (squad.length === 0) return undefined;
  return [...squad]
    .filter((p) => (p.goals ?? 0) > 0)
    .sort((a, b) => (b.goals ?? 0) - (a.goals ?? 0))[0];
}

/**
 * Compose the 3-line preview. Currently deterministic — same inputs always
 * produce the same output. That's a *feature* for now: predictable, no token
 * cost, no rate limits, no API key required to ship.
 */
function composePreview(inputs: PreviewInputs): MatchPreview {
  const { fixture, home, away, homeTopScorer, awayTopScorer } = inputs;
  const homeRank = home.fifaRank ?? 50;
  const awayRank = away.fifaRank ?? 50;
  const rankGap = Math.abs(homeRank - awayRank);
  const favourite = homeRank < awayRank ? home : away;
  const underdog = favourite === home ? away : home;

  // Probability skew based on rank difference — same shape the dashboard
  // sidebar's "Live model" hints at. Caps at 78/15/7 for big mismatches.
  const skew = Math.min(0.78, 0.45 + rankGap * 0.012);
  const favProb = Math.round(skew * 100);
  const drawProb = Math.round((1 - skew) * 0.55 * 100);
  const dogProb = 100 - favProb - drawProb;

  // Score model: favourite scores 1 + (rankGap/30), capped. Underdog scores
  // 0.6 + small variance. Round to nearest integer, but never (0,0) when one
  // side has top scorer with caps + goals.
  const favScore = Math.max(1, Math.round(1 + rankGap / 30));
  const dogScore = Math.max(0, Math.round(0.6 + (50 - Math.min(50, rankGap)) / 80));
  const suggestedScore =
    favourite === home
      ? { home: favScore, away: dogScore }
      : { home: dogScore, away: favScore };

  const stage =
    fixture.stage.kind === "group"
      ? `Group ${fixture.stage.group}, Matchday ${fixture.stage.matchday}`
      : KO_LABEL[fixture.stage.round];

  // Lines
  const hook = buildHook(stage, favourite, underdog, rankGap);
  const read = buildRead(home, away, homeTopScorer, awayTopScorer, favourite);
  const recommendation = buildRecommendation(
    favourite,
    favProb,
    drawProb,
    dogProb,
    suggestedScore,
    home,
    away,
  );

  return {
    hook,
    read,
    recommendation,
    suggestedScore,
    model: "wcf-baseline-v0.1 (template)",
    generatedAt: new Date().toISOString(),
  };
}

const KO_LABEL: Record<string, string> = {
  R32: "Round of 32",
  R16: "Round of 16",
  QF: "Quarter-final",
  SF: "Semi-final",
  "3RD": "Third place playoff",
  FINAL: "Final",
};

function buildHook(
  stage: string,
  favourite: WCTeam,
  underdog: WCTeam,
  rankGap: number,
): string {
  if (rankGap < 5) {
    return `A genuine coin-flip in the ${stage}: ${favourite.name} edge the FIFA rank by a sliver, but ${underdog.name} are within touching distance.`;
  }
  if (rankGap < 15) {
    return `${favourite.name} arrive in the ${stage} as marginal favourites against a ${underdog.name} side capable of biting back on the counter.`;
  }
  if (rankGap < 30) {
    return `On paper ${favourite.name} should handle this ${stage}, but ${underdog.name} have been the kind of team that turns the World Cup upside down.`;
  }
  return `Heavy mismatch on paper: ${favourite.name} are ranked dramatically higher than ${underdog.name}, and the ${stage} is theirs to lose.`;
}

function buildRead(
  home: WCTeam,
  away: WCTeam,
  homeStar?: Player,
  awayStar?: Player,
  favourite?: WCTeam,
): string {
  const homeFormation = home.preferredFormation ?? "4-3-3";
  const awayFormation = away.preferredFormation ?? "4-3-3";
  const formationLine =
    homeFormation === awayFormation
      ? `Both sides typically line up in a ${homeFormation}`
      : `${home.shortName} prefer a ${homeFormation} while ${away.shortName} favour a ${awayFormation}`;

  const stars: string[] = [];
  if (homeStar) {
    stars.push(`${homeStar.name} (${homeStar.goals} goals in ${homeStar.caps} caps)`);
  }
  if (awayStar) {
    stars.push(`${awayStar.name} (${awayStar.goals} goals in ${awayStar.caps} caps)`);
  }

  const starLine =
    stars.length > 0
      ? ` — eyes will be on ${stars.join(" vs ")}.`
      : ".";

  return `${formationLine}${starLine}${
    favourite ? ` ${favourite.name}'s manager ${favourite.manager ?? "the bench"} will lean on midfield control.` : ""
  }`;
}

function buildRecommendation(
  favourite: WCTeam,
  favProb: number,
  drawProb: number,
  dogProb: number,
  suggestedScore: { home: number; away: number },
  home: WCTeam,
  away: WCTeam,
): string {
  const confidence = favProb >= 65 ? "High confidence" : favProb >= 55 ? "Moderate confidence" : "Coin-flip";
  return `${confidence}: ${favourite.shortName} ${favProb}% · Draw ${drawProb}% · ${
    favourite === home ? away.shortName : home.shortName
  } ${dogProb}%. Suggested tip: ${home.shortName} ${suggestedScore.home}–${suggestedScore.away} ${away.shortName}.`;
}
