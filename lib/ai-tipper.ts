/**
 * "Spill med Freddy" — the AI tipper.
 *
 * Predicts a scoreline for each match by maximising expected competition
 * points (3 for an exact score, 1 for the correct outcome) under the same
 * Dixon-Coles model that powers the value dashboard. The same predictor backs
 * two things:
 *   - the bot user that competes in the prediction leagues, and
 *   - the "Freddy foreslår" suggestion shown to human users.
 *
 * Bot mechanics use the service-role client: it creates an auth user (the
 * profile trigger fills profiles), joins every mini-league, and upserts a
 * prediction for every upcoming match before kickoff — graded by the existing
 * match_results trigger exactly like a human tip.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { FIXTURES } from "@/lib/wc26-fixtures";
import { getTeamStrengths } from "@/lib/tournament-predictions";
import { expectedPointsScoreline } from "@/lib/tippemodell/dixon-coles";
import type { TeamStrength } from "@/lib/tournament-sim";

export const BOT_USERNAME = "spill_med_freddy";
export const BOT_DISPLAY_NAME = "Spill med Freddy";
const BOT_EMAIL = "freddy-bot@vm2026.local";

export interface Scoreline {
  home: number;
  away: number;
}

/** Suggested scoreline for two teams from preloaded strengths (sync). */
export function suggestScoreline(
  homeId: number,
  awayId: number,
  strengths: Map<number, TeamStrength>,
): Scoreline | null {
  const home = strengths.get(homeId);
  const away = strengths.get(awayId);
  if (!home || !away) return null;
  const s = expectedPointsScoreline(home, away);
  return { home: s.home, away: s.away };
}

/**
 * Suggested scorelines for many fixtures at once (loads strengths once).
 * Returns a map of matchId → scoreline for every group fixture we can model.
 */
export async function suggestScorelines(
  matchIds: number[],
): Promise<Map<number, Scoreline>> {
  const strengths = await getTeamStrengths();
  const out = new Map<number, Scoreline>();
  for (const id of matchIds) {
    const fx = FIXTURES.find((f) => f.id === id);
    if (!fx?.homeId || !fx?.awayId) continue;
    const s = suggestScoreline(fx.homeId, fx.awayId, strengths);
    if (s) out.set(id, s);
  }
  return out;
}

interface ProfileRow {
  id: string;
}

/**
 * Ensure the bot's auth user + profile exist and it's a member of every
 * mini-league. Idempotent — returns the bot's user id.
 */
export async function ensureBotUser(admin: SupabaseClient): Promise<string> {
  // Already provisioned?
  const { data: existing } = await admin
    .from("profiles")
    .select("id")
    .eq("username", BOT_USERNAME)
    .maybeSingle();
  let botId = (existing as ProfileRow | null)?.id ?? null;

  if (!botId) {
    const { data, error } = await admin.auth.admin.createUser({
      email: BOT_EMAIL,
      email_confirm: true,
      password: crypto.randomUUID() + crypto.randomUUID(),
      user_metadata: { username: BOT_USERNAME, display_name: BOT_DISPLAY_NAME },
    });
    if (error || !data.user) {
      throw new Error(`create bot user: ${error?.message ?? "no user returned"}`);
    }
    botId = data.user.id;
    // The on_auth_user_created trigger inserts the profile; make sure the
    // display name is set even if metadata didn't carry through.
    await admin
      .from("profiles")
      .update({ display_name: BOT_DISPLAY_NAME, username: BOT_USERNAME })
      .eq("id", botId);
  }

  // Join every mini-league so Freddy shows up in each standings table.
  const { data: leagues } = await admin.from("mini_leagues").select("id");
  const rows = ((leagues ?? []) as Array<{ id: string }>).map((l) => ({
    league_id: l.id,
    user_id: botId as string,
  }));
  if (rows.length > 0) {
    await admin.from("league_members").upsert(rows, { onConflict: "league_id,user_id" });
  }

  return botId;
}

/**
 * Upsert Freddy's prediction for every upcoming match (kickoff still in the
 * future, both teams known). Returns the number of predictions written.
 * Never tips a match that has already kicked off — same lock as humans.
 */
export async function generateBotPredictions(
  admin: SupabaseClient,
  botId: string,
): Promise<number> {
  const strengths = await getTeamStrengths();
  const now = Date.now();

  const rows: Array<{
    user_id: string;
    match_id: number;
    home_score: number;
    away_score: number;
  }> = [];
  for (const fx of FIXTURES) {
    if (!fx.homeId || !fx.awayId) continue; // knockout slots: teams unknown
    if (new Date(fx.kickoff).getTime() <= now) continue; // locked / already played
    const s = suggestScoreline(fx.homeId, fx.awayId, strengths);
    if (!s) continue;
    rows.push({
      user_id: botId,
      match_id: fx.id,
      home_score: s.home,
      away_score: s.away,
    });
  }

  if (rows.length === 0) return 0;
  const { error } = await admin
    .from("predictions")
    .upsert(rows, { onConflict: "user_id,match_id" });
  if (error) throw new Error(`bot predictions: ${error.message}`);
  return rows.length;
}
