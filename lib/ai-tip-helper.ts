/**
 * AI tip helper — generates suggested scorelines in three flavours.
 *
 *   - safe  : favourite wins by a believable margin (1-0 or 2-1)
 *   - bold  : favourite blows it open OR underdog steals it
 *   - chaos : random high-scoring score (4-3, 3-3, etc.)
 *
 * Same shape as buildPreview — deterministic v1, ready to swap to Claude in
 * v1.1 by replacing `pickScore` with an SDK call.
 */

import { teamById } from "./wc26-data";
import { fixtureById } from "./wc26-fixtures";

export type TipMode = "safe" | "bold" | "chaos";

export interface TipSuggestion {
  home: number;
  away: number;
  /** Short narrative shown next to the score (1 line). */
  reasoning: string;
}

export function suggestTip(matchId: number, mode: TipMode): TipSuggestion | null {
  const fixture = fixtureById(matchId);
  if (!fixture?.homeId || !fixture?.awayId) return null;
  const home = teamById(fixture.homeId);
  const away = teamById(fixture.awayId);
  if (!home || !away) return null;

  const homeRank = home.fifaRank ?? 80;
  const awayRank = away.fifaRank ?? 80;
  const homeFavourite = homeRank <= awayRank;
  const favName = homeFavourite ? home.shortName : away.shortName;
  const dogName = homeFavourite ? away.shortName : home.shortName;
  const rankGap = Math.abs(homeRank - awayRank);

  if (mode === "safe") {
    // Favourite by 1 — the most common World Cup outcome.
    const fav = rankGap >= 20 ? 2 : 1;
    const dog = rankGap >= 25 ? 0 : 1;
    return {
      home: homeFavourite ? fav : dog,
      away: homeFavourite ? dog : fav,
      reasoning: `${favName} edges it ${fav}–${dog} — banker, low risk.`,
    };
  }

  if (mode === "bold") {
    // 50/50 between an emphatic favourite win and a clean upset.
    const flip = ((homeRank * 13 + awayRank * 7 + matchId) % 100) >= 55;
    if (flip) {
      // Big favourite win
      const fav = 3;
      const dog = rankGap >= 30 ? 0 : 1;
      return {
        home: homeFavourite ? fav : dog,
        away: homeFavourite ? dog : fav,
        reasoning: `${favName} blows it open ${fav}–${dog}. Big call.`,
      };
    }
    // Upset
    return {
      home: homeFavourite ? 1 : 2,
      away: homeFavourite ? 2 : 1,
      reasoning: `${dogName} steals it 2–1. Brave but possible.`,
    };
  }

  // chaos
  // Pick a deterministic but eye-catching high-scoring scoreline.
  const seed = (matchId * 31 + homeRank * 7 + awayRank * 11) % 7;
  const candidates: Array<[number, number, string]> = [
    [3, 3, "Six goals, both keepers shipping water. Why not."],
    [4, 3, `${homeFavourite ? home.shortName : home.shortName} edge a basketball game.`],
    [2, 4, `${away.shortName} dismantle the press in the second half.`],
    [4, 2, `${home.shortName} go full pinball machine.`],
    [3, 2, "Late drama settles it 3–2."],
    [5, 1, "One side breaks completely. Highlight reel."],
    [1, 5, "Underdog day: shock five-goal masterclass."],
  ];
  const pick = candidates[seed];
  return { home: pick[0], away: pick[1], reasoning: pick[2] };
}

export const TIP_MODE_META: Record<TipMode, { label: string; icon: string; tone: string }> = {
  safe:  { label: "Safe",  icon: "🛡️", tone: "bg-paper text-cream/85 ring-cream/14" },
  bold:  { label: "Bold",  icon: "⚡", tone: "bg-signal/15 text-signal ring-signal/30" },
  chaos: { label: "Chaos", icon: "🎲", tone: "bg-amber/15 text-amber ring-amber/30" },
};
