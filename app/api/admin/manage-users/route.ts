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

  // Debug: raw league_members rows for a given user id.
  const rawFor = req.nextUrl.searchParams.get("rawLeagues");
  if (rawFor) {
    const { data, error } = await admin
      .from("league_members")
      .select("league_id, user_id, points")
      .eq("user_id", rawFor);
    return NextResponse.json({ rawFor, rows: data, error: error?.message });
  }

  const deleteParam = req.nextUrl.searchParams.get("delete");
  const leaveParam = req.nextUrl.searchParams.get("leave");
  if (!deleteParam && !leaveParam) {
    return NextResponse.json({ count: listing.length, profiles: listing });
  }

  const param = deleteParam ?? leaveParam ?? "";
  const wanted = param.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  const targets = profiles.filter(
    (p) =>
      wanted.includes((p.display_name ?? "").toLowerCase()) ||
      wanted.includes(p.username.toLowerCase()),
  );

  const result: Array<{
    id: string;
    label: string;
    action: "deleted" | "left-leagues";
    ok: boolean;
    error?: string;
  }> = [];
  for (const t of targets) {
    const label = t.display_name || t.username;
    if (deleteParam) {
      // Full account delete — cascades to predictions + league_members.
      const { error } = await admin.auth.admin.deleteUser(t.id);
      result.push({ id: t.id, label, action: "deleted", ok: !error, error: error?.message });
    } else {
      // Just remove from every league (keep the account + its tips).
      const { data: del, error } = await admin
        .from("league_members")
        .delete()
        .eq("user_id", t.id)
        .select("league_id");
      result.push({
        id: t.id,
        label,
        action: "left-leagues",
        ok: !error,
        error: error?.message,
        ...(del ? { deletedRows: del.length } : {}),
      } as never);
    }
  }

  return NextResponse.json({ requested: wanted, matched: targets.length, result });
}
