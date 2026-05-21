"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { fixtureById } from "@/lib/wc26-fixtures";

export interface MigrationResult {
  ok?: true;
  imported?: number;
  skipped?: number;
  error?: string;
}

/**
 * Bulk-import guest predictions (from localStorage on the client) into the
 * authenticated user's predictions table. Rejects entries for matches that
 * have already kicked off. Skips silently if the user already has a tip on
 * a given match (no overwrites).
 */
export async function migrateGuestPredictionsAction(
  raw: Array<{ matchId: number; homeScore: number; awayScore: number }>,
): Promise<MigrationResult> {
  if (!Array.isArray(raw) || raw.length === 0) {
    return { ok: true, imported: 0, skipped: 0 };
  }

  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const now = Date.now();
  let imported = 0;
  let skipped = 0;

  // Look up existing tips so we don't overwrite anything the user might have
  // placed after signing in.
  const matchIds = raw.map((r) => Number(r.matchId)).filter(Number.isInteger);
  const { data: existing } = await supabase
    .from("predictions")
    .select("match_id")
    .eq("user_id", user.id)
    .in("match_id", matchIds);
  const existingMatchIds = new Set((existing ?? []).map((r) => r.match_id));

  for (const entry of raw) {
    const matchId = Number(entry.matchId);
    const homeScore = Number(entry.homeScore);
    const awayScore = Number(entry.awayScore);

    if (!Number.isInteger(matchId)) { skipped++; continue; }
    if (!Number.isInteger(homeScore) || homeScore < 0 || homeScore > 20) { skipped++; continue; }
    if (!Number.isInteger(awayScore) || awayScore < 0 || awayScore > 20) { skipped++; continue; }
    if (existingMatchIds.has(matchId)) { skipped++; continue; }

    const fixture = fixtureById(matchId);
    if (!fixture) { skipped++; continue; }
    if (new Date(fixture.kickoff).getTime() <= now) { skipped++; continue; }
    if (!fixture.homeId || !fixture.awayId) { skipped++; continue; }

    const { error } = await supabase.from("predictions").insert({
      user_id: user.id,
      match_id: matchId,
      home_score: homeScore,
      away_score: awayScore,
    });
    if (error) { skipped++; continue; }
    imported++;
  }

  revalidatePath("/predictions");
  return { ok: true, imported, skipped };
}
