/**
 * Aggregate the per-goal log in `public.tournament_goals` into a real WC
 * 2026 top-scorer leaderboard. Own goals are NEVER credited to the
 * "scorer" — they're a side-effect on the OTHER team's tally only.
 *
 * Reads via the user-bound supabase client. `tournament_goals` is `read
 * all`, so this works for guests and authed users alike. The fixtures and
 * teams sides are still resolved against the in-code data so we get
 * Norwegian team names + flag codes without an extra JOIN.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { teamById, teamName } from "@/lib/wc26-data";

export interface TournamentScorer {
  scorerName: string;
  scorerPlayerId: number | null;
  teamId: number;
  teamName: string;
  teamFlag: string | null;
  goals: number;
  penalties: number;
}

interface GoalRow {
  team_id: number;
  scorer_name: string;
  scorer_player_id: number | null;
  is_own_goal: boolean;
  is_penalty: boolean;
}

export async function getTournamentTopScorersLive(
  supabase: SupabaseClient,
  n = 10,
): Promise<TournamentScorer[]> {
  const { data } = await supabase
    .from("tournament_goals")
    .select("team_id, scorer_name, scorer_player_id, is_own_goal, is_penalty");
  const rows = (data as GoalRow[] | null) ?? [];

  type Key = string;
  const byKey = new Map<Key, TournamentScorer>();
  for (const r of rows) {
    if (r.is_own_goal) continue; // never credited
    const key: Key = r.scorer_player_id
      ? `id:${r.scorer_player_id}`
      : `name:${r.team_id}|${r.scorer_name.toLowerCase()}`;
    const existing = byKey.get(key);
    if (existing) {
      existing.goals++;
      if (r.is_penalty) existing.penalties++;
      continue;
    }
    const team = teamById(r.team_id);
    byKey.set(key, {
      scorerName: r.scorer_name,
      scorerPlayerId: r.scorer_player_id,
      teamId: r.team_id,
      teamName: teamName(team),
      teamFlag: team?.flag ?? null,
      goals: 1,
      penalties: r.is_penalty ? 1 : 0,
    });
  }

  return Array.from(byKey.values())
    .sort((a, b) => {
      if (b.goals !== a.goals) return b.goals - a.goals;
      // Tiebreak: fewer penalties wins (open-play goals weighted higher).
      if (a.penalties !== b.penalties) return a.penalties - b.penalties;
      return a.scorerName.localeCompare(b.scorerName);
    })
    .slice(0, n);
}
