import { describe, expect, it } from "vitest";
import {
  poissonPmf,
  dixonColesTau,
  matchProbabilities,
  kellyFraction,
  expectedValue,
  RHO,
} from "@/lib/tippemodell/dixon-coles";
import type { TeamStrength } from "@/lib/tournament-sim";

const T = (attack: number, defense: number, teamId = 1): TeamStrength => ({
  teamId,
  attack,
  defense,
});

describe("dixon-coles", () => {
  it("poissonPmf sums to ~1 over its support", () => {
    let s = 0;
    for (let k = 0; k < 25; k++) s += poissonPmf(k, 1.5);
    expect(s).toBeCloseTo(1, 4);
  });

  it("poissonPmf handles lambda 0", () => {
    expect(poissonPmf(0, 0)).toBe(1);
    expect(poissonPmf(1, 0)).toBe(0);
  });

  it("dixonColesTau lifts 0-0 and 1-1, lowers 1-0 and 0-1", () => {
    const lambda = 1.5;
    const mu = 1.0;
    expect(dixonColesTau(0, 0, lambda, mu, RHO)).toBeGreaterThan(1);
    expect(dixonColesTau(1, 1, lambda, mu, RHO)).toBeGreaterThan(1);
    expect(dixonColesTau(1, 0, lambda, mu, RHO)).toBeLessThan(1);
    expect(dixonColesTau(0, 1, lambda, mu, RHO)).toBeLessThan(1);
  });

  it("dixonColesTau is 1 for scorelines outside the correction window", () => {
    expect(dixonColesTau(2, 2, 1.5, 1.0, RHO)).toBe(1);
    expect(dixonColesTau(3, 0, 1.5, 1.0, RHO)).toBe(1);
  });

  it("matchProbabilities sums to 1", () => {
    const p = matchProbabilities(T(1.4, 0.7), T(0.8, 1.3, 2));
    expect(p.home + p.draw + p.away).toBeCloseTo(1, 6);
  });

  it("a much stronger home team is the clear favourite", () => {
    const p = matchProbabilities(T(1.4, 0.7), T(0.8, 1.3, 2));
    expect(p.home).toBeGreaterThan(p.away);
    expect(p.home).toBeGreaterThan(p.draw);
    expect(p.home).toBeGreaterThan(0.6);
  });

  it("evenly matched teams give a slight home edge and a realistic draw rate", () => {
    const p = matchProbabilities(T(1.0, 1.0), T(1.0, 1.0, 2));
    // Home advantage (1.05) tilts it home-ward but only slightly.
    expect(p.home).toBeGreaterThan(p.away);
    // Football draw rate is typically 24–30%.
    expect(p.draw).toBeGreaterThan(0.22);
    expect(p.draw).toBeLessThan(0.34);
  });

  it("expectedValue is positive when prob beats the implied odds", () => {
    // odds 2.10 imply 47.6%; at 55% we have edge.
    expect(expectedValue(0.55, 2.1)).toBeCloseTo(0.155, 3);
    expect(expectedValue(0.4, 2.1)).toBeLessThan(0);
  });

  it("kellyFraction is positive with edge, zero without", () => {
    expect(kellyFraction(0.55, 2.1)).toBeGreaterThan(0);
    expect(kellyFraction(0.4, 2.1)).toBe(0);
    expect(kellyFraction(0.5, 1)).toBe(0);
  });
});
