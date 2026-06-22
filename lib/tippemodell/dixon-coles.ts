/**
 * Dixon-Coles bivariate-Poisson model for 1X2 match probabilities.
 *
 * Classic Poisson treats home and away goals as independent, which
 * under-predicts low-scoring draws (0-0, 1-1). Dixon & Coles (1997) add a
 * dependence correction τ for the four lowest scorelines, controlled by a
 * single parameter ρ (rho ≈ -0.1 for football: nudges 0-0/1-1 up and
 * 1-0/0-1 down).
 *
 *   P(home=i, away=j) = τ(i,j,λ,μ,ρ) · Poisson(i;λ) · Poisson(j;μ)
 *
 * We build the full score matrix up to MAX_GOALS for each side, then sum it
 * into P(home win) / P(draw) / P(away win).
 *
 * λ (home expected goals) and μ (away expected goals) come from the same
 * attack/defense ratings the tournament Monte Carlo uses, so the per-match
 * model and the tournament model never disagree about team strength.
 *
 * Pure / deterministic — fully unit-tested.
 */

import { BASE_RATE, type TeamStrength } from "@/lib/tournament-sim";

/** Low-score dependence parameter. Negative lifts 0-0 and 1-1. */
export const RHO = -0.1;

/** Mild home edge — WC 2026 is mostly neutral venues, so keep it small. */
export const HOME_ADVANTAGE = 1.05;

/**
 * Clamp expected goals to a sane band. Without this, a team that won its
 * group games heavily gets an inflated attack rating and the model spits
 * out λ ≈ 3.7 (→ 92% win), far more confident than a 90-bookmaker market.
 * Real international λ almost never exceeds ~2.6 even against minnows.
 */
const LAMBDA_MIN = 0.25;
const LAMBDA_MAX = 2.6;

const MAX_GOALS = 10; // score matrix dimension; P(>10 goals) is negligible

export interface MatchProbabilities {
  home: number;
  draw: number;
  away: number;
  /** Expected goals each side — surfaced for transparency. */
  lambdaHome: number;
  lambdaAway: number;
}

function factorial(n: number): number {
  let f = 1;
  for (let i = 2; i <= n; i++) f *= i;
  return f;
}

export function poissonPmf(k: number, lambda: number): number {
  if (lambda <= 0) return k === 0 ? 1 : 0;
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

/**
 * Dixon-Coles τ correction for the four lowest scorelines.
 * Everything else returns 1 (no correction).
 */
export function dixonColesTau(
  i: number,
  j: number,
  lambda: number,
  mu: number,
  rho: number,
): number {
  if (i === 0 && j === 0) return 1 - lambda * mu * rho;
  if (i === 0 && j === 1) return 1 + lambda * rho;
  if (i === 1 && j === 0) return 1 + mu * rho;
  if (i === 1 && j === 1) return 1 - rho;
  return 1;
}

/**
 * Expected goals for a fixture from attack/defense ratings.
 *   λ_home = BASE · atk_home · def_away · HOME_ADV
 *   λ_away = BASE · atk_away · def_home
 */
export function expectedGoals(
  home: TeamStrength,
  away: TeamStrength,
): { lambdaHome: number; lambdaAway: number } {
  const clamp = (x: number) => Math.max(LAMBDA_MIN, Math.min(LAMBDA_MAX, x));
  return {
    lambdaHome: clamp(BASE_RATE * home.attack * away.defense * HOME_ADVANTAGE),
    lambdaAway: clamp(BASE_RATE * away.attack * home.defense),
  };
}

/**
 * Full 1X2 probabilities for a match given the two teams' strengths.
 * Builds the Dixon-Coles-corrected score matrix and renormalises (the τ
 * correction means the raw matrix doesn't sum to exactly 1).
 */
export function matchProbabilities(
  home: TeamStrength,
  away: TeamStrength,
): MatchProbabilities {
  const { lambdaHome, lambdaAway } = expectedGoals(home, away);

  let pHome = 0;
  let pDraw = 0;
  let pAway = 0;
  let total = 0;

  for (let i = 0; i <= MAX_GOALS; i++) {
    const pi = poissonPmf(i, lambdaHome);
    for (let j = 0; j <= MAX_GOALS; j++) {
      const pj = poissonPmf(j, lambdaAway);
      const cell = dixonColesTau(i, j, lambdaHome, lambdaAway, RHO) * pi * pj;
      total += cell;
      if (i > j) pHome += cell;
      else if (i === j) pDraw += cell;
      else pAway += cell;
    }
  }

  // Renormalise so the three outcomes sum to 1.
  const norm = total > 0 ? total : 1;
  return {
    home: pHome / norm,
    draw: pDraw / norm,
    away: pAway / norm,
    lambdaHome,
    lambdaAway,
  };
}

/**
 * Kelly stake fraction for a single bet.
 *   f* = p − (1−p)/(odds−1)
 * Returns the FULL-Kelly fraction (≥0; 0 means no edge). Callers should
 * apply a fractional multiplier (e.g. 0.25 for quarter-Kelly) and a cap.
 */
export function kellyFraction(prob: number, decimalOdds: number): number {
  if (decimalOdds <= 1 || prob <= 0) return 0;
  const b = decimalOdds - 1;
  const f = prob - (1 - prob) / b;
  return f > 0 ? f : 0;
}

/**
 * Expected value per unit staked at these odds with our probability.
 * EV > 0 means a positive-expectation bet.
 *   EV = p · odds − 1
 */
export function expectedValue(prob: number, decimalOdds: number): number {
  return prob * decimalOdds - 1;
}
