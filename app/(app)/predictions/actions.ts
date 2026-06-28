"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { fixtureById } from "@/lib/wc26-fixtures";
import { canStillEdit, type FixtureStatus } from "@/lib/predictions-visibility";
import { loadKnockoutTeams, effectiveTeams } from "@/lib/knockout-resolve";

/**
 * Server-side lock check. Pulls the trusted status from public.fixtures so
 * an early kickoff (status flipped before clock) and a postponed match
 * both behave correctly — never trusts the in-code kickoff alone.
 */
async function isEditLocked(matchId: number): Promise<boolean> {
  const fx = fixtureById(matchId);
  if (!fx) return true;
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("fixtures")
    .select("kickoff, status")
    .eq("id", matchId)
    .maybeSingle();
  const kickoff = (data?.kickoff as string | undefined) ?? fx.kickoff;
  const status = ((data?.status as FixtureStatus | undefined) ?? "scheduled");
  return !canStillEdit(new Date(), { kickoff, status });
}

export interface PredictionResult {
  ok?: true;
  error?: string;
}

export async function savePredictionAction(
  _: PredictionResult,
  formData: FormData,
): Promise<PredictionResult> {
  const matchId = Number(formData.get("matchId"));
  const homeScore = Number(formData.get("homeScore"));
  const awayScore = Number(formData.get("awayScore"));

  if (!Number.isInteger(matchId)) return { error: "Invalid match." };
  if (!Number.isInteger(homeScore) || homeScore < 0 || homeScore > 20) {
    return { error: "Home score must be 0–20." };
  }
  if (!Number.isInteger(awayScore) || awayScore < 0 || awayScore > 20) {
    return { error: "Away score must be 0–20." };
  }

  const fixture = fixtureById(matchId);
  if (!fixture) return { error: "Match not found." };

  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  // Resolve teams (knockout slots → ids); reject only if still unknown.
  const koTeams = await loadKnockoutTeams(supabase);
  const { homeId, awayId } = effectiveTeams(fixture, koTeams);
  if (!homeId || !awayId) {
    return { error: "Knockout pairing not yet known." };
  }
  if (await isEditLocked(matchId)) {
    return { error: "Kickoff has passed — predictions are locked." };
  }

  const { error } = await supabase
    .from("predictions")
    .upsert(
      {
        user_id: user.id,
        match_id: matchId,
        home_score: homeScore,
        away_score: awayScore,
      },
      { onConflict: "user_id,match_id" },
    );

  if (error) return { error: error.message };

  revalidatePath("/predictions");
  return { ok: true };
}

export interface BatchPredictionResult {
  ok?: true;
  saved?: number;
  skipped?: number;
  error?: string;
}

/**
 * Bulk-upsert many predictions in one round-trip. Powers the sticky
 * "Lagre alle" bar so the user can fill in dozens of matches and save
 * once instead of clicking save on every card.
 *
 * Unlike the guest-migration action, this DOES overwrite existing tips —
 * the entries are the user's deliberate current edits. Matches that have
 * already kicked off are skipped (locked).
 */
export async function savePredictionsBatchAction(
  raw: Array<{ matchId: number; homeScore: number; awayScore: number }>,
): Promise<BatchPredictionResult> {
  if (!Array.isArray(raw) || raw.length === 0) {
    return { ok: true, saved: 0, skipped: 0 };
  }

  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Du må være innlogget." };

  // Pre-fetch trusted kickoff + status for every match in the batch in one
  // round-trip. Then the lock decision per row is a pure helper call.
  const matchIds = raw
    .map((r) => Number(r.matchId))
    .filter((n) => Number.isInteger(n));
  let dbByMatch = new Map<number, { kickoff: string; status: FixtureStatus }>();
  if (matchIds.length > 0) {
    const { data: dbFixtures } = await supabase
      .from("fixtures")
      .select("id, kickoff, status")
      .in("id", matchIds);
    for (const r of (dbFixtures as { id: number; kickoff: string; status: FixtureStatus }[] | null) ?? []) {
      dbByMatch.set(r.id, { kickoff: r.kickoff, status: r.status });
    }
  }
  const koTeams = await loadKnockoutTeams(supabase);

  const now = new Date();
  const rows: Array<{
    user_id: string;
    match_id: number;
    home_score: number;
    away_score: number;
  }> = [];
  let skipped = 0;

  for (const entry of raw) {
    const matchId = Number(entry.matchId);
    const homeScore = Number(entry.homeScore);
    const awayScore = Number(entry.awayScore);

    if (!Number.isInteger(matchId)) { skipped++; continue; }
    if (!Number.isInteger(homeScore) || homeScore < 0 || homeScore > 20) { skipped++; continue; }
    if (!Number.isInteger(awayScore) || awayScore < 0 || awayScore > 20) { skipped++; continue; }

    const fixture = fixtureById(matchId);
    if (!fixture) { skipped++; continue; }
    // Require both teams known — resolving knockout slots so R32+ ties save.
    const { homeId, awayId } = effectiveTeams(fixture, koTeams);
    if (!homeId || !awayId) { skipped++; continue; }
    const db = dbByMatch.get(matchId);
    const kickoff = db?.kickoff ?? fixture.kickoff;
    const status: FixtureStatus = db?.status ?? "scheduled";
    if (!canStillEdit(now, { kickoff, status })) { skipped++; continue; }

    rows.push({
      user_id: user.id,
      match_id: matchId,
      home_score: homeScore,
      away_score: awayScore,
    });
  }

  if (rows.length === 0) {
    return { ok: true, saved: 0, skipped };
  }

  const { error } = await supabase
    .from("predictions")
    .upsert(rows, { onConflict: "user_id,match_id" });

  if (error) return { error: error.message };

  revalidatePath("/predictions");
  return { ok: true, saved: rows.length, skipped };
}
