"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { fixtureById } from "@/lib/wc26-fixtures";
import { fetchAndStoreResults } from "@/lib/cron/fetch-results";
import { syncTournamentGoals } from "@/lib/cron/sync-goals";
import type { CronTaskResult } from "@/lib/cron/types";

export interface RecordResultResponse {
  ok?: true;
  error?: string;
}

function isAdmin(userId: string): boolean {
  const allow = (process.env.ADMIN_USER_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  // No allowlist set → any signed-in user is allowed (same convention as
  // /admin/cron). When you want to lock it down, set ADMIN_USER_IDS.
  if (allow.length === 0) return true;
  return allow.includes(userId);
}

/**
 * Upsert a final score for a match. The grading trigger awards points and
 * updates league_members.points automatically.
 *
 * `status` defaults to "finished" — that's what fires the grading. Pass
 * "live" to set a provisional score that won't grade until you flip the
 * status. Most admin entries are end-of-match, so "finished" is the default.
 */
export async function recordMatchResultAction(
  matchId: number,
  homeScore: number,
  awayScore: number,
  status: "finished" | "live" | "halftime" = "finished",
): Promise<RecordResultResponse> {
  if (!Number.isInteger(matchId)) return { error: "Ugyldig kamp-ID." };
  if (!Number.isInteger(homeScore) || homeScore < 0 || homeScore > 20) {
    return { error: "Hjemme-mål må være 0–20." };
  }
  if (!Number.isInteger(awayScore) || awayScore < 0 || awayScore > 20) {
    return { error: "Borte-mål må være 0–20." };
  }

  const fixture = fixtureById(matchId);
  if (!fixture) return { error: "Fant ikke kampen." };
  // Allow recording even on knockout pairings without resolved teams — the
  // result table is keyed by matchId, and the kickoff/teams won't actually
  // appear in the admin UI until they're known.

  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Du må være innlogget." };
  if (!isAdmin(user.id)) return { error: "Mangler admin-tilgang." };

  // Service-role client because the RLS policy on match_results denies all
  // public writes. Wrapped so a missing env var (SUPABASE_SERVICE_ROLE_KEY)
  // surfaces as a readable form error instead of a digest crash page.
  try {
    const admin = createSupabaseAdminClient();
    const { error } = await admin
      .from("match_results")
      .upsert(
        {
          match_id: matchId,
          home_score: homeScore,
          away_score: awayScore,
          status,
          minute: status === "finished" ? 90 : null,
        },
        { onConflict: "match_id" },
      );

    if (error) return { error: error.message };
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) };
  }

  // Invalidate downstream surfaces that read from match_results.
  revalidatePath("/admin/results");
  revalidatePath("/leagues", "layout");
  revalidatePath("/", "layout");
  return { ok: true };
}

/**
 * Manual trigger for the fetch-results cron task. Lets the admin pull a
 * fresh round of scores from API-Football without waiting for the daily
 * cron. Returns the same shape as a cron task result so the UI can show it.
 */
export async function triggerFetchResultsAction(): Promise<CronTaskResult> {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return {
      task: "fetch-results",
      status: "failed",
      summary: "Du må være innlogget.",
      durationMs: 0,
    };
  }
  if (!isAdmin(user.id)) {
    return {
      task: "fetch-results",
      status: "failed",
      summary: "Mangler admin-tilgang.",
      durationMs: 0,
    };
  }
  let result: CronTaskResult;
  try {
    result = await fetchAndStoreResults();
  } catch (err) {
    return {
      task: "fetch-results",
      status: "failed",
      summary: err instanceof Error ? err.message : String(err),
      durationMs: 0,
    };
  }
  revalidatePath("/admin/results");
  return result;
}

/**
 * Manual trigger for the sync-goals task. Lets the admin backfill goal
 * events on demand — useful when API_FOOTBALL_KEY was added after a
 * match finished, or after correcting a result.
 */
export async function triggerSyncGoalsAction(matchIds?: number[]): Promise<CronTaskResult> {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { task: "sync-goals", status: "failed", summary: "Du må være innlogget.", durationMs: 0 };
  }
  if (!isAdmin(user.id)) {
    return { task: "sync-goals", status: "failed", summary: "Mangler admin-tilgang.", durationMs: 0 };
  }
  let result: CronTaskResult;
  try {
    result = await syncTournamentGoals({ matchIds });
  } catch (err) {
    return {
      task: "sync-goals",
      status: "failed",
      summary: err instanceof Error ? err.message : String(err),
      durationMs: 0,
    };
  }
  revalidatePath("/admin/results");
  revalidatePath("/", "layout");
  return result;
}

/**
 * Probe API-Football directly so we can SEE what the key is allowed to
 * pull. Used when the resolver reports 0 fixtures, to distinguish a
 * plan/coverage issue from a wrong league/season.
 */
export interface AfProbeResult {
  apiKeySet: boolean;
  statusOk: boolean;
  statusBody?: string;
  leagueOk: boolean;
  leagueCoverage?: string;
  fixturesAllOk: boolean;
  fixturesAllCount: number;
  fixturesAllSample?: string[];
  fixturesDatedOk: boolean;
  fixturesDatedCount: number;
  errors: string[];
}

export async function triggerAfProbeAction(): Promise<AfProbeResult> {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const baseFail: AfProbeResult = {
    apiKeySet: Boolean(process.env.API_FOOTBALL_KEY),
    statusOk: false,
    leagueOk: false,
    fixturesAllOk: false,
    fixturesAllCount: 0,
    fixturesDatedOk: false,
    fixturesDatedCount: 0,
    errors: [],
  };
  if (!user) return { ...baseFail, errors: ["Du må være innlogget."] };
  if (!isAdmin(user.id)) return { ...baseFail, errors: ["Mangler admin-tilgang."] };

  const key = process.env.API_FOOTBALL_KEY;
  if (!key) return { ...baseFail, errors: ["API_FOOTBALL_KEY ikke satt."] };

  const result: AfProbeResult = { ...baseFail, apiKeySet: true };
  const BASE = "https://v3.football.api-sports.io";
  const headers = { "x-apisports-key": key } as const;

  // 1) /status — verifies key + plan quota
  try {
    const r = await fetch(`${BASE}/status`, { headers, cache: "no-store" });
    if (!r.ok) throw new Error(`status: HTTP ${r.status}`);
    const j = (await r.json()) as { response?: { account?: { firstname?: string }; subscription?: { plan?: string; end?: string }; requests?: { current?: number; limit_day?: number } } };
    result.statusOk = true;
    result.statusBody = `plan=${j.response?.subscription?.plan ?? "?"} · requests=${
      j.response?.requests?.current ?? "?"
    }/${j.response?.requests?.limit_day ?? "?"}`;
  } catch (e) {
    result.errors.push(`/status: ${e instanceof Error ? e.message : String(e)}`);
  }

  // 2) /leagues?id=1&season=2026 — does the WC league exist on this plan?
  try {
    const r = await fetch(`${BASE}/leagues?id=1&season=2026`, { headers, cache: "no-store" });
    if (!r.ok) throw new Error(`leagues: HTTP ${r.status}`);
    const j = (await r.json()) as { response?: Array<{ league?: { name?: string }; seasons?: Array<{ year: number; coverage?: { fixtures?: { events?: boolean } } }> }> };
    const found = j.response?.[0];
    result.leagueOk = Boolean(found);
    if (found) {
      const s2026 = found.seasons?.find((x) => x.year === 2026);
      result.leagueCoverage = `league=${found.league?.name ?? "?"} · season-2026 events=${
        s2026?.coverage?.fixtures?.events ?? "?"
      }`;
    }
  } catch (e) {
    result.errors.push(`/leagues: ${e instanceof Error ? e.message : String(e)}`);
  }

  // 3) /fixtures?league=1&season=2026 — full WC fixture set (no date filter)
  try {
    const r = await fetch(`${BASE}/fixtures?league=1&season=2026`, { headers, cache: "no-store" });
    if (!r.ok) throw new Error(`fixtures-all: HTTP ${r.status}`);
    const j = (await r.json()) as { response?: Array<{ teams: { home: { name: string }; away: { name: string } }; fixture: { date: string } }> };
    const arr = j.response ?? [];
    result.fixturesAllOk = arr.length > 0;
    result.fixturesAllCount = arr.length;
    result.fixturesAllSample = arr
      .slice(0, 3)
      .map((f) => `${f.teams.home.name} vs ${f.teams.away.name} @ ${f.fixture.date.slice(0, 16)}`);
  } catch (e) {
    result.errors.push(`/fixtures (all): ${e instanceof Error ? e.message : String(e)}`);
  }

  // 4) /fixtures?league=1&season=2026&from=…&to=… for a known WC date — does
  //    the date filter reduce to 0? (Compares against #3.)
  try {
    const r = await fetch(
      `${BASE}/fixtures?league=1&season=2026&from=2026-06-11&to=2026-06-12&timezone=UTC`,
      { headers, cache: "no-store" },
    );
    if (!r.ok) throw new Error(`fixtures-dated: HTTP ${r.status}`);
    const j = (await r.json()) as { response?: unknown[] };
    result.fixturesDatedOk = (j.response?.length ?? 0) > 0;
    result.fixturesDatedCount = j.response?.length ?? 0;
  } catch (e) {
    result.errors.push(`/fixtures (date): ${e instanceof Error ? e.message : String(e)}`);
  }

  return result;
}
