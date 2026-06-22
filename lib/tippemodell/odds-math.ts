/**
 * Pure odds-math helpers used by the Tippemodell dashboard.
 *
 *   - impliedProb:     decimal odds → implied probability
 *   - marketMargin:    summed implied prob − 1 (bookmaker overround)
 *   - devig:           strip the margin proportionally so probs sum to 1
 *   - bestPrice:       highest decimal odds (most upside) across a list
 *   - edge:            how much the best price beats the fair line (>0 = value)
 *   - pct:             format a probability as "x.x%"
 *
 * All functions are pure / side-effect-free; trivially unit-testable.
 */

export function impliedProb(decimalOdds: number): number {
  return decimalOdds > 0 ? 1 / decimalOdds : 0;
}

export function marketMargin(decimalOddsList: number[]): number {
  return decimalOddsList.reduce((acc, o) => acc + impliedProb(o), 0) - 1;
}

/** Strip margin proportionally so the implied probs sum to 1. */
export function devig(decimalOddsList: number[]): number[] {
  const raw = decimalOddsList.map(impliedProb);
  const sum = raw.reduce((a, b) => a + b, 0);
  return sum > 0 ? raw.map((p) => p / sum) : raw;
}

/** Highest price wins — that's the bookmaker giving the most for your stake. */
export function bestPrice<T extends { price: number }>(rows: T[]): T | null {
  if (rows.length === 0) return null;
  return rows.reduce((best, r) => (r.price > best.price ? r : best));
}

/**
 * Edge of the best available market price over the fair (de-vigged) line.
 *   edge = (bestPrice / fairOdds) - 1
 * Positive → market is offering more than the fair price implies (value).
 * Returns null when we can't compute (missing inputs, fairProb ≤ 0).
 */
export function edge(
  bestPriceVal: number | null,
  fairProb: number | null,
): number | null {
  if (bestPriceVal == null || fairProb == null || fairProb <= 0) return null;
  const fairOdds = 1 / fairProb;
  return bestPriceVal / fairOdds - 1;
}

export function pct(p: number): string {
  return `${(p * 100).toFixed(1)}%`;
}
