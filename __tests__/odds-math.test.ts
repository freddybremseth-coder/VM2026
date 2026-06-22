import { describe, expect, it } from "vitest";
import {
  impliedProb,
  marketMargin,
  devig,
  bestPrice,
  edge,
} from "@/lib/tippemodell/odds-math";

describe("odds-math", () => {
  it("impliedProb is 1/price", () => {
    expect(impliedProb(2)).toBeCloseTo(0.5);
    expect(impliedProb(4)).toBeCloseTo(0.25);
    expect(impliedProb(0)).toBe(0);
  });

  it("marketMargin sums implied probs and subtracts 1", () => {
    // 2.0/3.5/4.0 → 0.5 + 0.286 + 0.25 = 1.036 → margin 0.036
    expect(marketMargin([2.0, 3.5, 4.0])).toBeCloseTo(0.036, 2);
  });

  it("devig produces probs summing to ~1", () => {
    const fair = devig([2.0, 3.5, 4.0]);
    const sum = fair.reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 5);
    // Each fair value is implied/sum — home favourite stays favourite.
    expect(fair[0]).toBeGreaterThan(fair[1]);
    expect(fair[1]).toBeGreaterThan(fair[2]);
  });

  it("devig returns empty-equivalent on zero list", () => {
    expect(devig([])).toEqual([]);
  });

  it("bestPrice returns the row with the highest decimal odds", () => {
    const rows = [
      { bookmaker: "A", price: 2.1 },
      { bookmaker: "B", price: 2.3 },
      { bookmaker: "C", price: 1.9 },
    ];
    expect(bestPrice(rows)?.bookmaker).toBe("B");
  });

  it("bestPrice handles empty input", () => {
    expect(bestPrice([])).toBeNull();
  });

  it("edge is positive when best price beats fair odds", () => {
    // fairProb 0.5 → fairOdds 2.0. Best price 2.20 → edge = 2.2/2.0 - 1 = 0.10
    expect(edge(2.2, 0.5)).toBeCloseTo(0.1);
  });

  it("edge is negative when best price is worse than fair", () => {
    expect(edge(1.8, 0.5)).toBeCloseTo(-0.1);
  });

  it("edge handles missing inputs", () => {
    expect(edge(null, 0.5)).toBeNull();
    expect(edge(2.0, null)).toBeNull();
    expect(edge(2.0, 0)).toBeNull();
  });
});
