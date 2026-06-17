/**
 * Admin-only one-shot endpoint to restore a user's mini-league membership
 * and point total — used when someone got kicked or left by accident.
 *
 * Auth: same Bearer CRON_SECRET as the cron endpoint, so it's not
 * publicly callable.
 *
 * Usage:
 *   POST /api/admin/league-restore
 *   Authorization: Bearer <CRON_SECRET>
 *   Body: { "league": "freddy mini liga", "user": "Bremsethinho", "points": 14 }
 *
 * Response: details on what was matched + the upsert result.
 */

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { league?: string; user?: string; points?: number };
  try {
    body = (await req.json()) as { league?: string; user?: string; points?: number };
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const { league: leagueNeedle, user: userNeedle, points } = body;
  if (!leagueNeedle || !userNeedle || typeof points !== "number") {
    return NextResponse.json(
      { error: "missing league / user / points" },
      { status: 400 },
    );
  }

  const admin = createSupabaseAdminClient();

  // Match league by case-insensitive partial name (so "freddy mini liga"
  // matches "Freddy mini liga", "Freddys mini-liga", etc.).
  const { data: leagues, error: leagueErr } = await admin
    .from("mini_leagues")
    .select("id, name, owner_id")
    .ilike("name", `%${leagueNeedle}%`);
  if (leagueErr) {
    return NextResponse.json({ error: `league lookup: ${leagueErr.message}` }, { status: 500 });
  }
  if (!leagues || leagues.length === 0) {
    // Help the caller discover the right name: list every league we have.
    const { data: allLeagues } = await admin
      .from("mini_leagues")
      .select("id, name")
      .order("created_at", { ascending: false })
      .limit(50);
    return NextResponse.json(
      { error: "no league matches", needle: leagueNeedle, candidates: allLeagues ?? [] },
      { status: 404 },
    );
  }
  if (leagues.length > 1) {
    return NextResponse.json(
      { error: "ambiguous league name", candidates: leagues.map((l) => l.name) },
      { status: 409 },
    );
  }
  const league = leagues[0];

  // Match user by username OR display_name (case-insensitive).
  const { data: profiles, error: profileErr } = await admin
    .from("profiles")
    .select("user_id, username, display_name")
    .or(`username.ilike.%${userNeedle}%,display_name.ilike.%${userNeedle}%`);
  if (profileErr) {
    return NextResponse.json({ error: `profile lookup: ${profileErr.message}` }, { status: 500 });
  }
  if (!profiles || profiles.length === 0) {
    return NextResponse.json({ error: "no user matches", needle: userNeedle }, { status: 404 });
  }
  if (profiles.length > 1) {
    return NextResponse.json(
      {
        error: "ambiguous user",
        candidates: profiles.map((p) => ({ username: p.username, display_name: p.display_name })),
      },
      { status: 409 },
    );
  }
  const profile = profiles[0];

  // Upsert membership with the requested point total.
  const { error: upsertErr } = await admin
    .from("league_members")
    .upsert(
      {
        league_id: league.id,
        user_id: profile.user_id,
        points,
      },
      { onConflict: "league_id,user_id" },
    );
  if (upsertErr) {
    return NextResponse.json({ error: `upsert: ${upsertErr.message}` }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    league: { id: league.id, name: league.name },
    user: { user_id: profile.user_id, username: profile.username, display_name: profile.display_name },
    points,
  });
}
