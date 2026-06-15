/**
 * Lightweight diagnostic endpoint — reports which Supabase project the
 * deployed app is actually wired to, plus row counts in the cron-managed
 * tables. Useful when you have multiple projects and need to confirm the
 * env-var swap landed.
 *
 * Auth: same Bearer CRON_SECRET as /api/cron/refresh, so it's not
 * publicly enumerable. Never returns service-role keys.
 */

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? null;
  const projectRef = supabaseUrl
    ? supabaseUrl.replace(/^https?:\/\//, "").split(".")[0]
    : null;

  let matchResultsCount: number | null = null;
  let tournamentGoalsCount: number | null = null;
  let dbError: string | null = null;

  try {
    const supabase = createSupabaseServerClient();
    const [mr, tg] = await Promise.all([
      supabase
        .from("match_results")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("tournament_goals")
        .select("*", { count: "exact", head: true }),
    ]);
    matchResultsCount = mr.count ?? null;
    tournamentGoalsCount = tg.count ?? null;
    if (mr.error) dbError = `match_results: ${mr.error.message}`;
    if (tg.error)
      dbError = (dbError ? `${dbError}; ` : "") + `tournament_goals: ${tg.error.message}`;
  } catch (err) {
    dbError = err instanceof Error ? err.message : String(err);
  }

  return NextResponse.json({
    supabaseUrl,
    projectRef,
    counts: {
      match_results: matchResultsCount,
      tournament_goals: tournamentGoalsCount,
    },
    dbError,
    vercelEnv: process.env.VERCEL_ENV ?? null,
    deployedSha: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
  });
}
