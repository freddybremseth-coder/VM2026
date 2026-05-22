/**
 * Computed leaderboards built on top of the static squad data.
 *
 * Functions are pure and synchronous — they read from `wc26-squads`
 * and `player-form` and return sorted lists / top performers.
 */

import { getSquad, getAllPlayers, getPlayerMinutes, type Player } from "./wc26-squads";
import { getPlayerForm } from "./player-form";

// ─────────────────────────────────────────────────────────────────────────────
// Per-team top performers
// ─────────────────────────────────────────────────────────────────────────────

export interface TeamLeader {
  player: Player;
  value: number;
}

/** Most international goals on this team's roster. */
export function getTopScorer(teamId: number): TeamLeader | null {
  const squad = getSquad(teamId);
  const sorted = [...squad]
    .filter((p) => typeof p.goals === "number" && p.goals! > 0)
    .sort((a, b) => (b.goals ?? 0) - (a.goals ?? 0));
  if (sorted.length === 0) return null;
  return { player: sorted[0], value: sorted[0].goals ?? 0 };
}

/** Most international assists on this team's roster. */
export function getTopAssister(teamId: number): TeamLeader | null {
  const squad = getSquad(teamId);
  const sorted = [...squad]
    .filter((p) => typeof p.assists === "number" && p.assists! > 0)
    .sort((a, b) => (b.assists ?? 0) - (a.assists ?? 0));
  if (sorted.length === 0) return null;
  return { player: sorted[0], value: sorted[0].assists ?? 0 };
}

/** Most-capped player in this team's squad. */
export function getMostCapped(teamId: number): TeamLeader | null {
  const squad = getSquad(teamId);
  const sorted = [...squad]
    .filter((p) => typeof p.caps === "number" && p.caps! > 0)
    .sort((a, b) => (b.caps ?? 0) - (a.caps ?? 0));
  if (sorted.length === 0) return null;
  return { player: sorted[0], value: sorted[0].caps ?? 0 };
}

/** Most international minutes (explicit or estimated from caps). */
export function getMostMinutes(teamId: number): TeamLeader | null {
  const squad = getSquad(teamId);
  const sorted = [...squad]
    .map((p) => ({ player: p, value: getPlayerMinutes(p) }))
    .filter((x) => x.value > 0)
    .sort((a, b) => b.value - a.value);
  return sorted[0] ?? null;
}

/** Top N goal-scorers in this squad — for leaderboard cards. */
export function getTopScorers(teamId: number, n = 5): TeamLeader[] {
  return getSquad(teamId)
    .filter((p) => typeof p.goals === "number" && p.goals! > 0)
    .sort((a, b) => (b.goals ?? 0) - (a.goals ?? 0))
    .slice(0, n)
    .map((p) => ({ player: p, value: p.goals ?? 0 }));
}

/** Top N assisters in this squad. */
export function getTopAssisters(teamId: number, n = 5): TeamLeader[] {
  return getSquad(teamId)
    .filter((p) => typeof p.assists === "number" && p.assists! > 0)
    .sort((a, b) => (b.assists ?? 0) - (a.assists ?? 0))
    .slice(0, n)
    .map((p) => ({ player: p, value: p.assists ?? 0 }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Cross-tournament leaderboards (all squads pooled)
// ─────────────────────────────────────────────────────────────────────────────

export interface TournamentLeader extends TeamLeader {
  teamId: number;
}

/** Top N scorers across every team where squad data exists. */
export function getTournamentTopScorers(n = 10): TournamentLeader[] {
  return getAllPlayers()
    .filter((p) => typeof p.goals === "number" && p.goals! > 0)
    .sort((a, b) => (b.goals ?? 0) - (a.goals ?? 0))
    .slice(0, n)
    .map((p) => ({ player: p, value: p.goals ?? 0, teamId: p.teamId }));
}

/** Top N international assisters across every team with squad data. */
export function getTournamentTopAssisters(n = 10): TournamentLeader[] {
  return getAllPlayers()
    .filter((p) => typeof p.assists === "number" && p.assists! > 0)
    .sort((a, b) => (b.assists ?? 0) - (a.assists ?? 0))
    .slice(0, n)
    .map((p) => ({ player: p, value: p.assists ?? 0, teamId: p.teamId }));
}

/** Top N club-season scorers (from player-form data). */
export function getClubSeasonTopScorers(n = 10): TournamentLeader[] {
  const all = getAllPlayers();
  return all
    .map((p) => {
      const form = getPlayerForm(p.id);
      return form ? { player: p, value: form.goals, teamId: p.teamId } : null;
    })
    .filter((x): x is TournamentLeader => x !== null && x.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, n);
}

/** Top N club-season assisters (from player-form data). */
export function getClubSeasonTopAssisters(n = 10): TournamentLeader[] {
  const all = getAllPlayers();
  return all
    .map((p) => {
      const form = getPlayerForm(p.id);
      return form ? { player: p, value: form.assists, teamId: p.teamId } : null;
    })
    .filter((x): x is TournamentLeader => x !== null && x.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, n);
}
