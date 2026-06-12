/**
 * Admin — manually record / override match results.
 *
 * Why this exists even with the cron-driven API-Football fetch:
 *   • The cron only runs once per day on Vercel Hobby. During an actual
 *     live match you need on-demand control.
 *   • API-Football might be wrong / delayed for some fixtures; admin can
 *     override.
 *   • If API_FOOTBALL_KEY isn't set at all, this is the only way to grade
 *     predictions and roll the leaderboard.
 *
 * Each row is one fixture in the 36h-back / 12h-ahead window. Entering a
 * score and submitting fires the DB grading trigger — points & leaderboard
 * update automatically.
 */

import { notFound, redirect } from "next/navigation";
import { Trophy, Cpu } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Kicker, Headline } from "@/components/shared/EditorialKicker";
import { FIXTURES, type Fixture } from "@/lib/wc26-fixtures";
import { teamById, teamName } from "@/lib/wc26-data";
import { ResultsForm } from "./ResultsForm";

const LOOKBACK_MS = 36 * 60 * 60 * 1000;
const LOOKAHEAD_MS = 12 * 60 * 60 * 1000;

interface ResultRow {
  match_id: number;
  home_score: number;
  away_score: number;
  status: string;
  minute: number | null;
  updated_at: string;
}

export interface FixtureRow {
  matchId: number;
  stageLabel: string;
  kickoff: string;
  homeName: string;
  awayName: string;
  homeFlag: string | null;
  awayFlag: string | null;
  // Existing recorded result, if any.
  existing: ResultRow | null;
}

function stageLabel(f: Fixture): string {
  return f.stage.kind === "group"
    ? `Gruppe ${f.stage.group} · MD${f.stage.matchday}`
    : "Sluttspill";
}

export default async function AdminResultsPage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const allow = (process.env.ADMIN_USER_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (allow.length > 0 && !allow.includes(user.id)) notFound();

  const now = Date.now();
  const fixtures = FIXTURES.filter((f) => {
    if (!f.homeId || !f.awayId) return false;
    const ts = new Date(f.kickoff).getTime();
    return ts >= now - LOOKBACK_MS && ts <= now + LOOKAHEAD_MS;
  }).sort((a, b) => b.kickoff.localeCompare(a.kickoff));

  let resultByMatch = new Map<number, ResultRow>();
  if (fixtures.length > 0) {
    const { data } = await supabase
      .from("match_results")
      .select("match_id, home_score, away_score, status, minute, updated_at")
      .in("match_id", fixtures.map((f) => f.id));
    for (const r of (data as ResultRow[] | null) ?? []) {
      resultByMatch.set(r.match_id, r);
    }
  }

  const rows: FixtureRow[] = fixtures.map((f) => {
    const home = teamById(f.homeId!);
    const away = teamById(f.awayId!);
    return {
      matchId: f.id,
      stageLabel: stageLabel(f),
      kickoff: f.kickoff,
      homeName: teamName(home),
      awayName: teamName(away),
      homeFlag: home?.flag ?? null,
      awayFlag: away?.flag ?? null,
      existing: resultByMatch.get(f.id) ?? null,
    };
  });

  const hasApiKey = Boolean(process.env.API_FOOTBALL_KEY);

  return (
    <div className="px-4 sm:px-6 md:px-10 py-8 max-w-[1100px] mx-auto space-y-5">
      <header>
        <Kicker tone="signal">
          <span className="inline-flex items-center gap-2">
            <Trophy size={11} /> Admin
          </span>
        </Kicker>
        <Headline rank="h2" className="mt-2">
          Resultater
        </Headline>
        <p className="text-sm text-cream/55 mt-3 max-w-2xl leading-relaxed">
          Legg inn sluttresultatet for en kamp. Når du lagrer med status
          «Slutt», graderer databasen alle tippene automatisk (3 p eksakt,
          1 p utfall) og ruller poengsummene i hver liga. «Live» og «Pause»
          oppdaterer scoren uten å gradere.
        </p>
      </header>

      <ResultsForm rows={rows} hasApiKey={hasApiKey} />

      {rows.length === 0 && (
        <div className="surface p-6 text-center text-sm text-cream/55 italic font-serif">
          Ingen kamper i admin-vinduet (36 timer bakover, 12 timer framover).
        </div>
      )}

      <div className="surface p-4 text-xs text-cream/55 leading-relaxed flex gap-3 items-start">
        <Cpu size={13} className="text-amber shrink-0 mt-0.5" />
        <div>
          API-Football-nøkkel{" "}
          {hasApiKey ? (
            <span className="text-win font-mono">✓ satt</span>
          ) : (
            <span className="text-loss font-mono">✗ ikke satt</span>
          )}
          . {hasApiKey
            ? "«Hent live»-knappen henter scorer for kamper i vinduet og lagrer dem direkte."
            : "Sett API_FOOTBALL_KEY på Vercel for å aktivere auto-henting."}
        </div>
      </div>
    </div>
  );
}
