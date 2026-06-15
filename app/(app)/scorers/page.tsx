/**
 * Top-scorers leaderboard page — same data as the dashboard widget, but
 * full-bleed so you can browse the entire WC 2026 scoring race in one
 * view. Reads from `public.tournament_goals` via
 * `getTournamentTopScorersLive`.
 *
 * Sections:
 *   - Headline + tournament-wide goal counts
 *   - Top-50 scorers (links to player profiles)
 *   - Penalty-only ranking (separate column when ties exist)
 *
 * Empty state: rendered honest — "ingen mål registrert ennå" — never stubs.
 */

import Link from "next/link";
import { Trophy, Sparkles } from "lucide-react";
import { Kicker, Headline } from "@/components/shared/EditorialKicker";
import { HoloFlag } from "@/components/shared/HoloFlag";
import { TournamentTopScorers } from "@/components/scorers/TournamentTopScorers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getTournamentTopScorersLive } from "@/lib/tournament-scorers";

export default async function ScorersPage() {
  const supabase = createSupabaseServerClient();
  const scorers = await getTournamentTopScorersLive(supabase, 50);
  const totalGoals = scorers.reduce((sum, s) => sum + s.goals, 0);
  const totalPens = scorers.reduce((sum, s) => sum + s.penalties, 0);

  return (
    <div className="px-5 md:px-10 py-8 max-w-[1200px] mx-auto">
      <header className="mb-8">
        <Kicker tone="signal">
          <span className="inline-flex items-center gap-2">
            <Trophy size={11} /> Toppscorerlisten
          </span>
        </Kicker>
        <Headline rank="h1" className="mt-2">
          VM 2026 — målscorere
        </Headline>
        <p className="text-sm text-cream/55 mt-3 max-w-xl">
          Live fra første kamp. Selvmål teller for det andre laget, ikke for
          spilleren. Listen oppdateres automatisk når en ny kamp er ferdig.
        </p>
        {scorers.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-6 text-[10px] uppercase tracking-kicker font-mono text-cream/55">
            <span>
              <span className="text-cream font-bold text-base stat-num mr-1">
                {totalGoals}
              </span>
              mål i topp 50
            </span>
            <span>
              <span className="text-amber font-bold text-base stat-num mr-1">
                {totalPens}
              </span>
              fra straffe
            </span>
            <span>
              <span className="text-cream font-bold text-base stat-num mr-1">
                {scorers.length}
              </span>
              spillere på listen
            </span>
          </div>
        )}
      </header>

      {scorers.length === 0 ? (
        <div className="surface p-8 text-center">
          <Sparkles size={20} className="text-cream/35 mx-auto mb-3" />
          <h2 className="font-serif text-lg tracking-editorial text-cream/85 mb-1">
            Ingen mål registrert ennå
          </h2>
          <p className="text-xs text-cream/55 max-w-md mx-auto">
            Listen våkner så snart første kamp er ferdig og målene synkroniseres
            inn. Sjekk{" "}
            <Link href="/matches" className="text-signal hover:text-signalD underline">
              kampprogrammet
            </Link>
            .
          </p>
        </div>
      ) : (
        <TournamentTopScorers scorers={scorers} />
      )}
    </div>
  );
}
