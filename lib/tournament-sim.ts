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
// Effective sample size of the FIFA-rank prior — equivalent to "this many
// neutral-venue matches" worth of evidence. After N actual matches the
// prior weight is PRIOR_PSEUDO_GAMES / (PRIOR_PSEUDO_GAMES + N), so with
// pseudo=4 a team that's played 1 game still gets 80% prior weight (4/5),
// 2 games → 67%, 3 games → 57%. Earlier we used 0.6, which collapsed to
// 38% prior weight after a single match — that turned one strong result
// (Norway 4-1 Iraq → modelled at 2.4 attack rating) into near-certain
// qualification, which doesn't match how much we should actually update
// our belief from a single 90-minute match against the group's weakest
// side. Three pseudo-games is the value that lets the model accept a
// genuinely dominant performance over the full group stage while
// staying skeptical after one match.
const PRIOR_PSEUDO_GAMES = 4;
const GROUPS: GroupId[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

export interface TeamPrediction {
  teamId: number;
  /** Probability of finishing top-2 in their group (direct qualification). */
  pTop2: number;
  /** Probability of finishing 3rd AND advancing as one of the 8 best 3rds. */
  pThirdQualify: number;
  /** Sum of the two — probability of reaching the Round of 32. */
  pR32: number;
  /** Probability of reaching the Round of 16 (won their R32 match). */
  pR16: number;
  /** Probability of reaching the Quarter-finals. */
  pQF: number;
  /** Probability of reaching the Semi-finals. */
  pSF: number;
  /** Probability of reaching the Final. */
  pFinal: number;
  /** Probability of winning the tournament. */
  pChampion: number;
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
    // Bayesian-ish blend: treat the FIFA-rank prior as PRIOR_PSEUDO_GAMES
    // worth of evidence and add the actual played matches on top. Weight
    // decays as n grows: n=1 → 80% prior, n=3 → 57%, n=6 → 40%.
    const priorWeight = PRIOR_PSEUDO_GAMES / (PRIOR_PSEUDO_GAMES + stats.n);
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

interface RoundCounters {
  top2: Map<number, number>;
  thirdQualify: Map<number, number>;
  r16: Map<number, number>; // reached R16
  qf: Map<number, number>;
  sf: Map<number, number>;
  final: Map<number, number>;
  champion: Map<number, number>;
}

function bump(map: Map<number, number>, key: number) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

/**
 * Simulate a knockout match between two teams. Poisson goals; if tied after
 * "regulation" we re-sample once (penalty-style coin-flip if still tied).
 * Returns the winning team id.
 */
function simulateKnockout(
  homeStr: TeamStrength,
  awayStr: TeamStrength,
): number {
  const { home, away } = simulateFixture(homeStr, awayStr);
  if (home > away) return homeStr.teamId;
  if (away > home) return awayStr.teamId;
  // Re-sample once (extra time)
  const et = simulateFixture(homeStr, awayStr);
  if (et.home > et.away) return homeStr.teamId;
  if (et.away > et.home) return awayStr.teamId;
  // Penalty shoot-out: 50/50 (real shoot-outs are ~52/48 in favour of
  // the higher-rated team, but the swing is tiny — coin-flip is fine).
  return Math.random() < 0.5 ? homeStr.teamId : awayStr.teamId;
}

// Cached knockout fixture metadata so we don't re-filter per simulation.
const KO_FIXTURES = {
  R32: FIXTURES.filter((f) => f.stage.kind === "knockout" && f.stage.round === "R32"),
  R16: FIXTURES.filter((f) => f.stage.kind === "knockout" && f.stage.round === "R16"),
  QF: FIXTURES.filter((f) => f.stage.kind === "knockout" && f.stage.round === "QF"),
  SF: FIXTURES.filter((f) => f.stage.kind === "knockout" && f.stage.round === "SF"),
  FINAL: FIXTURES.filter((f) => f.stage.kind === "knockout" && f.stage.round === "FINAL"),
};

/**
 * Translate slot codes ("1A", "2B", "3X", "W74") into team ids using the
 * group-stage standings + a list of best-third placers + already-decided
 * knockout winners.
 *
 * Strategy: top-2 slots and W/L slots resolve deterministically. The 8
 * "3X" slots in R32 are filled by the 8 best 3rd-placers, randomly
 * permuted — FIFA's actual mapping rule depends on which 4 groups produce
 * the qualifying 3rds, so a uniform shuffle is a reasonable approximation
 * that doesn't bias any single team's probability much across 10k runs.
 */
function resolveSlot(
  slot: string | undefined,
  group2Top2: Map<string, [number, number]>,
  thirdQueue: number[],
  winners: Map<number, number>,
): number | null {
  if (!slot) return null;
  if (slot.startsWith("W")) return winners.get(Number(slot.slice(1))) ?? null;
  if (slot.startsWith("L")) {
    // SF1/SF2 loser feed into 3rd-place playoff; not used in the qualification
    // model so return null is fine.
    return null;
  }
  if (slot === "3X") return thirdQueue.shift() ?? null;
  const place = slot[0];
  const grp = slot.slice(1);
  const tt = group2Top2.get(grp);
  if (!tt) return null;
  return place === "1" ? tt[0] : place === "2" ? tt[1] : null;
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function simulateAll(
  results: Map<number, ResultRow>,
  strengths: Map<number, TeamStrength>,
): RoundCounters {
  const counters: RoundCounters = {
    top2: new Map(),
    thirdQualify: new Map(),
    r16: new Map(),
    qf: new Map(),
    sf: new Map(),
    final: new Map(),
    champion: new Map(),
  };

  for (let sim = 0; sim < SIMULATIONS; sim++) {
    // ── Group stage ───────────────────────────────────────────────────
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
    const allResults = Array.from(mergedResults.values());

    const group2Top2 = new Map<string, [number, number]>();
    const thirdPlaces: ThirdPlaceCandidate[] = [];
    for (const g of GROUPS) {
      const rows = computeGroupStandings(g, allResults);
      if (rows[0] && rows[1]) {
        group2Top2.set(g, [rows[0].teamId, rows[1].teamId]);
        bump(counters.top2, rows[0].teamId);
        bump(counters.top2, rows[1].teamId);
      }
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

    thirdPlaces.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
      return b.goalsFor - a.goalsFor;
    });
    const qualifiedThirds = thirdPlaces.slice(0, 8);
    for (const t of qualifiedThirds) bump(counters.thirdQualify, t.teamId);
    const thirdQueue = shuffle(qualifiedThirds.map((t) => t.teamId));

    // ── Knockouts ─────────────────────────────────────────────────────
    const winners = new Map<number, number>(); // match_id -> winning team id

    /**
     * Run all fixtures in a knockout round. Each winner is recorded in
     * `winners` (keyed by fixture id, so downstream rounds can look up
     * "W74") and bumped in `nextRoundCounter` — winning this round means
     * reaching the next one.
     */
    const runRound = (
      fixtures: Fixture[],
      nextRoundCounter: Map<number, number>,
    ) => {
      for (const f of fixtures) {
        const homeId = resolveSlot(f.homeSlot, group2Top2, thirdQueue, winners);
        const awayId = resolveSlot(f.awaySlot, group2Top2, thirdQueue, winners);
        if (!homeId || !awayId) continue;
        const homeStr = strengths.get(homeId);
        const awayStr = strengths.get(awayId);
        if (!homeStr || !awayStr) continue;
        const winner = simulateKnockout(homeStr, awayStr);
        winners.set(f.id, winner);
        bump(nextRoundCounter, winner);
      }
    };

    runRound(KO_FIXTURES.R32, counters.r16); // R32 winner → reached R16
    runRound(KO_FIXTURES.R16, counters.qf); //  R16 winner → reached QF
    runRound(KO_FIXTURES.QF, counters.sf); //   QF winner  → reached SF
    runRound(KO_FIXTURES.SF, counters.final); // SF winner → reached Final
    runRound(KO_FIXTURES.FINAL, counters.champion); // Final winner = Champion
  }

  return counters;
}

// ─────────────────────────────────────────────────────────────────────────────
// Public entry — runs the simulation and returns probabilities per team
// ─────────────────────────────────────────────────────────────────────────────

export function runTournamentSim(rawResults: ResultRow[]): SimResult {
  const validResults = rawResults.filter(
    (r) =>
      r.home_score !== null &&
      r.away_score !== null &&
      (r.status === "finished" || r.status === "live" || r.status === "halftime"),
  );
  const resultsByMatch = new Map<number, ResultRow>();
  for (const r of validResults) resultsByMatch.set(r.match_id, r);

  const strengths = buildStrengths(resultsByMatch);
  const counters = simulateAll(resultsByMatch, strengths);

  const perTeam: TeamPrediction[] = TEAMS.map((t) => {
    const top2Count = counters.top2.get(t.id) ?? 0;
    const thirdCount = counters.thirdQualify.get(t.id) ?? 0;
    const pTop2 = top2Count / SIMULATIONS;
    const pThirdQualify = thirdCount / SIMULATIONS;
    return {
      teamId: t.id,
      pTop2,
      pThirdQualify,
      pR32: pTop2 + pThirdQualify,
      pR16: (counters.r16.get(t.id) ?? 0) / SIMULATIONS,
      pQF: (counters.qf.get(t.id) ?? 0) / SIMULATIONS,
      pSF: (counters.sf.get(t.id) ?? 0) / SIMULATIONS,
      pFinal: (counters.final.get(t.id) ?? 0) / SIMULATIONS,
      pChampion: (counters.champion.get(t.id) ?? 0) / SIMULATIONS,
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
