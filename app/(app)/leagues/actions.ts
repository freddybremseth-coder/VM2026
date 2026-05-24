"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface LeagueResult {
  error?: string;
  ok?: true;
}

export async function createLeagueAction(
  _: LeagueResult,
  formData: FormData,
): Promise<LeagueResult> {
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const isPrivate = formData.get("isPrivate") === "on";

  if (name.length < 3 || name.length > 40) {
    return { error: "Name must be 3–40 characters." };
  }

  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in first." };

  const { data: league, error } = await supabase
    .from("mini_leagues")
    .insert({
      name,
      description: description || null,
      owner_id: user.id,
      is_private: isPrivate,
    })
    .select("id")
    .single();

  if (error || !league) return { error: error?.message || "Could not create league." };

  // Owner is automatically a member.
  await supabase.from("league_members").insert({
    league_id: league.id,
    user_id: user.id,
  });

  revalidatePath("/leagues");
  redirect(`/leagues/${league.id}`);
}

export async function joinLeagueAction(
  _: LeagueResult,
  formData: FormData,
): Promise<LeagueResult> {
  const code = String(formData.get("inviteCode") || "").trim().toLowerCase();
  if (!code) return { error: "Invite code required." };

  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in first." };

  const { data: league } = await supabase
    .from("mini_leagues")
    .select("id, name")
    .eq("invite_code", code)
    .maybeSingle();

  if (!league) return { error: "No league found for that code." };

  const { error } = await supabase
    .from("league_members")
    .upsert(
      { league_id: league.id, user_id: user.id },
      { onConflict: "league_id,user_id", ignoreDuplicates: true },
    );

  if (error) return { error: error.message };

  revalidatePath("/leagues");
  redirect(`/leagues/${league.id}`);
}

/**
 * Join an open (non-private) league directly — no invite code needed.
 * Validates the league is actually public before adding the membership so
 * this can't be used to slip into a private league by id.
 */
export async function joinPublicLeagueAction(formData: FormData) {
  const leagueId = String(formData.get("leagueId") || "").trim();
  if (!leagueId) return;

  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: league } = await supabase
    .from("mini_leagues")
    .select("id, is_private")
    .eq("id", leagueId)
    .maybeSingle();

  // Only open leagues are joinable this way.
  if (!league || league.is_private) return;

  await supabase
    .from("league_members")
    .upsert(
      { league_id: league.id, user_id: user.id },
      { onConflict: "league_id,user_id", ignoreDuplicates: true },
    );

  revalidatePath("/leagues");
  redirect(`/leagues/${league.id}`);
}

export async function leaveLeagueAction(formData: FormData) {
  const leagueId = String(formData.get("leagueId") || "");
  if (!leagueId) return;

  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("league_members")
    .delete()
    .eq("league_id", leagueId)
    .eq("user_id", user.id);

  revalidatePath("/leagues");
  redirect("/leagues");
}
