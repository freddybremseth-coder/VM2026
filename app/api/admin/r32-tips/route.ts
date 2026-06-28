/**
 * Diag — inspect predictions on the knockout rounds, especially R32
 * (16-delsfinale, match ids 73–88), to find tips that may be "orphaned"
 * (on a match id that isn't a current fixture) or users missing R32 tips.
 * Bearer CRON_SECRET. Temporary.
 */

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { FIXTURES } from "@/lib/wc26-fixtures";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const R32_IDS = FIXTURES.filter(
  (f) => f.stage.kind === "knockout" && f.stage.round === "R32",
).map((f) => f.id);
const VALID_IDS = new Set(FIXTURES.map((f) => f.id));

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const db = createSupabaseAdminClient();

  const { data: preds } = await db
    .from("predictions")
    .select("user_id, match_id, home_score, away_score, points_awarded");
  const rows = (preds ?? []) as Array<{
    user_id: string;
    match_id: number;
    home_score: number;
    away_score: number;
    points_awarded: number | null;
  }>;

  const { data: profs } = await db.from("profiles").select("id, username, display_name");
  const nameById = new Map(
    ((profs ?? []) as Array<{ id: string; username: string; display_name: string | null }>).map(
      (p) => [p.id, p.display_name || p.username],
    ),
  );

  // Predictions whose match_id is NOT a current fixture — the "old/gone" ones.
  const orphanByMatch: Record<number, number> = {};
  for (const r of rows) {
    if (!VALID_IDS.has(r.match_id)) {
      orphanByMatch[r.match_id] = (orphanByMatch[r.match_id] ?? 0) + 1;
    }
  }

  // R32 coverage per user.
  const r32Set = new Set(R32_IDS);
  const perUser = new Map<string, { r32: number[]; total: number }>();
  for (const r of rows) {
    const u = perUser.get(r.user_id) ?? { r32: [], total: 0 };
    u.total++;
    if (r32Set.has(r.match_id)) u.r32.push(r.match_id);
    perUser.set(r.user_id, u);
  }

  // Per R32 match: how many tipped it.
  const r32Counts = R32_IDS.map((id) => ({
    matchId: id,
    tips: rows.filter((r) => r.match_id === id).length,
  }));

  const users = [...perUser.entries()].map(([id, u]) => ({
    user: nameById.get(id) ?? id.slice(0, 8),
    r32Tipped: u.r32.length,
    r32Matches: u.r32.sort((a, b) => a - b),
    totalTips: u.total,
  }));

  return NextResponse.json({
    r32Ids: R32_IDS,
    totalPredictions: rows.length,
    orphanPredictions: orphanByMatch, // match_id (not a fixture) -> count
    r32CountsPerMatch: r32Counts,
    users: users.sort((a, b) => b.r32Tipped - a.r32Tipped),
  });
}
