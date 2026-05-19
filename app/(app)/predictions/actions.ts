"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import todayData from "@/mock/matches/today.json";
import type { MatchSummary } from "@/lib/types";

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

  // Enforce kickoff cutoff server-side (RLS does not know match data).
  const match = (todayData.matches as MatchSummary[]).find((m) => m.id === matchId);
  if (!match) return { error: "Match not found." };
  if (match.status !== "scheduled") {
    return { error: "Predictions are locked once the match has started." };
  }
  if (new Date(match.kickoff).getTime() <= Date.now()) {
    return { error: "Kickoff has passed — predictions are locked." };
  }

  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

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
