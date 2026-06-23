/**
 * Admin user management (Bearer CRON_SECRET). Temporary.
 *
 *   GET                      → list all profiles with league + prediction counts
 *   GET ?delete=Name1,Name2  → delete users whose display_name OR username
 *                              matches (auth user delete cascades profile →
 *                              predictions + league_members). Returns what was
 *                              removed.
 */

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface ProfileRow {
  id: string;
  username: string;
  display_name: string | null;
  created_at?: string;
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const admin = createSupabaseAdminClient();

  const { data: profilesRaw } = await admin
    .from("profiles")
    .select("id, username, display_name, created_at");
  const profiles = (profilesRaw ?? []) as ProfileRow[];

  // Counts per user.
  const { data: lm } = await admin.from("league_members").select("user_id");
  const { data: preds } = await admin.from("predictions").select("user_id");
  const leagueCount = new Map<string, number>();
  for (const r of (lm ?? []) as Array<{ user_id: string }>)
    leagueCount.set(r.user_id, (leagueCount.get(r.user_id) ?? 0) + 1);
  const predCount = new Map<string, number>();
  for (const r of (preds ?? []) as Array<{ user_id: string }>)
    predCount.set(r.user_id, (predCount.get(r.user_id) ?? 0) + 1);

  const listing = profiles.map((p) => ({
    id: p.id,
    username: p.username,
    displayName: p.display_name,
    createdAt: p.created_at,
    leagues: leagueCount.get(p.id) ?? 0,
    predictions: predCount.get(p.id) ?? 0,
  }));

  const deleteParam = req.nextUrl.searchParams.get("delete");
  if (!deleteParam) {
    return NextResponse.json({ count: listing.length, profiles: listing });
  }

  const wanted = deleteParam.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  const targets = profiles.filter(
    (p) =>
      wanted.includes((p.display_name ?? "").toLowerCase()) ||
      wanted.includes(p.username.toLowerCase()),
  );

  const removed: Array<{ id: string; displayName: string | null; ok: boolean; error?: string }> = [];
  for (const t of targets) {
    const { error } = await admin.auth.admin.deleteUser(t.id);
    removed.push({
      id: t.id,
      displayName: t.display_name,
      ok: !error,
      error: error?.message,
    });
  }

  return NextResponse.json({ requested: wanted, removed });
}
