/**
 * Tournament simulator — Poisson + Monte Carlo over the remaining group
 * fixtures, with R32 qualification probabilities per team.
 *
 * Model overview:
 *  1. Each team has an attack rate (expected goals scored) and defense
 *     rate (expected goals conceded). Both start from a FIFA-rank-based
 *     prior and update with goals scored/conceded in completed matches.
 *  2. For an unplayed fixture between A and B, expected goals follow:
 *       λ_A = BASE_RATE × attack_A / defense_B
 *       λ_B = BASE_RATE × attack_B / defense_A
 *     where BASE_RATE ≈ 1.2 reflects the average goals per side at a
 *     World Cup neutral-venue match.
 *  3. Per simulation: for every team in every group, sample Poisson goals
 *     for each remaining fixture, build the group table, take top-2.
 *     Then rank all 12 third-place finishers and let the 8 best through.
 *  4. Repeat N times. Per-team probability = fraction of sims they
 *     qualified for R32.
 *
 * This is intentionally simple and auditable. We don't try to model
 * managerial changes, injuries, weather, or knockout luck — those are
 * outside what we can credibly estimate from public data.
 *
 * Output is cached via Next.js `unstable_cache` for 15 minutes since the
 * underlying match_results only change after a cron tick.
 */

import { FIXTURES, type Fixture } from "@/lib/wc26-fixtures";
import { TEAMS, teamsByGroup, type WCTeam, type GroupId } from "@/lib/wc26-data";
import {
  computeGroupStandings,
  type ResultRow,
  type GroupStandingRow,
} from "@/lib/group-standings";

const SIMULATIONS = 10_000;
const BASE_RATE = 1.2; // average goals-per-side at WC neutral venue
const FIFA_RANK_WEIGHT = 0.6; // 0..1 — how much prior matters vs played matches
const GROUPS: GroupId[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

export interface TeamPrediction {
  teamId: number;
  /** Probability of finishing top-2 in their group (direct qualification). */
  pTop2: number;
  /** Probability of finishing 3rd AND advancing as one of the 8 best 3rds. */
  pThirdQualify: number;
  /** Sum of the two — probability of reaching the Round of 32. */
  pR32: number;
}

export interface SimResult {
  generatedAt: string;
  simulations: number;
  perTeam: TeamPrediction[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Team strength derivation
// ─────────────────────────────────────────────────────────────────────────────

interface TeamStrength {
  teamId: number;
  attack: number; // goals scored per game expected vs an average opponent
  defense: number; // goals conceded per game expected vs an average opponent
}

/**
 * FIFA-rank prior. Best team in the world gets attack ≈ 1.45 / defense ≈ 0.83,
 * worst seed gets attack ≈ 0.83 / defense ≈ 1.45. Linear in rank percentile.
 */
function priorFromRank(team: WCTeam): { attack: number; defense: number } {
  const rank = team.fifaRank ?? 50;
  // Rank percentile: 1 = best (rank 1), 0 = worst (rank ≥ 60).
  const pct = Math.max(0, Math.min(1, (60 - rank) / 59));
  const swing = 0.45;
  return {
    attack: 1.0 + swing * (pct - 0.5) * 2, // -> 1 - swing .. 1 + swing
    defense: 1.0 - swing * (pct - 0.5) * 2, // inverse
  };
}

/**
 * Bayesian-ish update: blend the FIFA prior with per-team goal averages
 * from completed matches. Heavier weight on the prior early; as more
 * matches are played the actual numbers dominate.
 */
function buildStrengths(results: Map<number, ResultRow>): Map<number, TeamStrength> {
  const out = new Map<number, TeamStrength>();
  // Aggregate goals-for / goals-against per team from played group matches.
  const played = new Map<number, { gf: number; ga: number; n: number }>();
  for (const f of FIXTURES) {
    if (f.stage.kind !== "group" || !f.homeId || !f.awayId) continue;
    const r = results.get(f.id);
    if (!r) continue;
    const home = played.get(f.homeId) ?? { gf: 0, ga: 0, n: 0 };
    const away = played.get(f.awayId) ?? { gf: 0, ga: 0, n: 0 };
    home.gf += r.home_score;
    home.ga += r.away_score;
    home.n += 1;
    away.gf += r.away_score;
    away.ga += r.home_score;
    away.n += 1;
    played.set(f.homeId, home);
    played.set(f.awayId, away);
  }

  for (const t of TEAMS) {
    const prior = priorFromRank(t);
    const stats = played.get(t.id);
    if (!stats || stats.n === 0) {
      out.set(t.id, { teamId: t.id, attack: prior.attack, defense: prior.defense });
      continue;
    }
    // Weight: prior_weight at n=0 → 1, decays toward 0 as more games are played.
    const priorWeight = FIFA_RANK_WEIGHT / (FIFA_RANK_WEIGHT + stats.n);
    const observedAttack = stats.gf / stats.n / BASE_RATE;
    const observedDefense = stats.ga / stats.n / BASE_RATE;
    out.set(t.id, {
      teamId: t.id,
      attack: priorWeight * prior.attack + (1 - priorWeight) * observedAttack,
      defense: priorWeight * prior.defense + (1 - priorWeight) * observedDefense,
    });
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// Poisson sampler (Knuth's algorithm — fine for λ ≤ ~10)
// ─────────────────────────────────────────────────────────────────────────────

function samplePoisson(lambda: number): number {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

// ─────────────────────────────────────────────────────────────────────────────
// Simulate one fixture
// ─────────────────────────────────────────────────────────────────────────────

function simulateFixture(
  homeStr: TeamStrength,
  awayStr: TeamStrength,
): { home: number; away: number } {
  const lambdaHome = BASE_RATE * homeStr.attack * awayStr.defense;
  const lambdaAway = BASE_RATE * awayStr.attack * homeStr.defense;
  return {
    home: samplePoisson(lambdaHome),
    away: samplePoisson(lambdaAway),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Simulate the remaining group fixtures + return final standings
// ─────────────────────────────────────────────────────────────────────────────

interface ThirdPlaceCandidate {
  group: GroupId;
  teamId: number;
  points: number;
  goalDiff: number;
  goalsFor: number;
}

function simulateAll(
  results: Map<number, ResultRow>,
  strengths: Map<number, TeamStrength>,
): {
  top2: Map<number, number>; // teamId -> count of top-2 finishes
  thirdQualify: Map<number, number>; // teamId -> count of qualifying as best 3rd
} {
  const top2 = new Map<number, number>();
  const thirdQualify = new Map<number, number>();

  for (let sim = 0; sim < SIMULATIONS; sim++) {
    // Build synthetic results: existing real ones + Poisson-sampled future ones.
    const mergedResults = new Map<number, ResultRow>(results);
    for (const f of FIXTURES) {
      if (f.stage.kind !== "group" || !f.homeId || !f.awayId) continue;
      if (mergedResults.has(f.id)) continue;
      const homeStr = strengths.get(f.homeId);
      const awayStr = strengths.get(f.awayId);
      if (!homeStr || !awayStr) continue;
      const { home, away } = simulateFixture(homeStr, awayStr);
      mergedResults.set(f.id, {
        match_id: f.id,
        home_score: home,
        away_score: away,
        status: "finished",
      });
    }

    // Build the array form computeGroupStandings expects.
    const allResults = Array.from(mergedResults.values());
    const thirdPlaces: ThirdPlaceCandidate[] = [];

    for (const g of GROUPS) {
      const rows = computeGroupStandings(g, allResults);
      if (rows[0]) top2.set(rows[0].teamId, (top2.get(rows[0].teamId) ?? 0) + 1);
      if (rows[1]) top2.set(rows[1].teamId, (top2.get(rows[1].teamId) ?? 0) + 1);
      if (rows[2]) {
        thirdPlaces.push({
          group: g,
          teamId: rows[2].teamId,
          points: rows[2].points,
          goalDiff: rows[2].goalDiff,
          goalsFor: rows[2].goalsFor,
        });
      }
    }

    // Rank the 12 third-place finishers: take top 8.
    thirdPlaces.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
      return b.goalsFor - a.goalsFor;
    });
    for (let i = 0; i < Math.min(8, thirdPlaces.length); i++) {
      const t = thirdPlaces[i];
      thirdQualify.set(t.teamId, (thirdQualify.get(t.teamId) ?? 0) + 1);
    }
  }

  return { top2, thirdQualify };
}

// ─────────────────────────────────────────────────────────────────────────────
// Public entry — runs the simulation and returns probabilities per team
// ─────────────────────────────────────────────────────────────────────────────

export function runTournamentSim(rawResults: ResultRow[]): SimResult {
  const validResults = rawResults.filter(
    (r) => r.home_score !== null && r.away_score !== null,
  );
  const resultsByMatch = new Map<number, ResultRow>();
  for (const r of validResults) resultsByMatch.set(r.match_id, r);

  const strengths = buildStrengths(resultsByMatch);
  const { top2, thirdQualify } = simulateAll(resultsByMatch, strengths);

  const perTeam: TeamPrediction[] = TEAMS.map((t) => {
    const top2Count = top2.get(t.id) ?? 0;
    const thirdCount = thirdQualify.get(t.id) ?? 0;
    const pTop2 = top2Count / SIMULATIONS;
    const pThirdQualify = thirdCount / SIMULATIONS;
    return {
      teamId: t.id,
      pTop2,
      pThirdQualify,
      pR32: pTop2 + pThirdQualify,
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    simulations: SIMULATIONS,
    perTeam,
  };
}

/**
 * Convenience helper: returns the R32 probability for a single team.
 * Returns null if the team isn't in TEAMS.
 */
export function teamR32Probability(
  sim: SimResult,
  teamId: number,
): TeamPrediction | null {
  return sim.perTeam.find((p) => p.teamId === teamId) ?? null;
}
