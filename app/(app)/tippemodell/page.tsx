/**
 * /tippemodell — odds-comparison dashboard.
 *
 * For each upcoming match (next 30 fixtures with odds):
 *   - Three cells (1 / X / 2) showing the best market price + bookmaker
 *   - A fair-probability % derived from the sharp line (Pinnacle/SBOBet),
 *     fallback de-vigging on the best market prices when no sharp price
 *     is available
 *   - An amber outline + "+x.x%" badge when the best price beats the fair
 *     line by ≥0.5% — potential value
 *
 * Renders an honest placeholder when the odds feed isn't wired up yet
 * (ODDS_API_KEY unset) so the page is never misleading.
 */

import Link from "next/link";
import { TrendingUp, AlertCircle, Info } from "lucide-react";
import { Kicker, Headline } from "@/components/shared/EditorialKicker";
import { MatchOddsCard } from "@/components/tippemodell/MatchOddsCard";
import { getTippemodellDashboard } from "@/lib/tippemodell/dashboard";
import { isOddsApiConfigured } from "@/lib/tippemodell/oddspapi";

export default async function TippemodellPage() {
  const apiConfigured = isOddsApiConfigured();
  const matches = apiConfigured ? await getTippemodellDashboard() : [];

  return (
    <div className="px-5 md:px-10 py-8 max-w-[1400px] mx-auto">
      <header className="mb-6">
        <Kicker tone="signal">
          <span className="inline-flex items-center gap-2">
            <TrendingUp size={11} /> Tippemodell
          </span>
        </Kicker>
        <Headline rank="h1" className="mt-2">
          Beste pris · fair sannsynlighet · verdi.
        </Headline>
        <p className="text-sm text-cream/55 mt-3 max-w-2xl leading-relaxed">
          Odds samles fra alle store bookmakere på tvers av VM-kampene. Per
          utfall vises beste tilgjengelige pris, en fair sannsynlighet utledet
          fra skarpe linjer (margin fjernet), og en verdi-markering når
          markedet betaler bedre enn fair-linja tilsier.
        </p>
      </header>

      {!apiConfigured ? (
        <NotConfigured />
      ) : matches.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <Legend />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {matches.map((m) => (
              <MatchOddsCard key={m.matchId} match={m} />
            ))}
          </div>
        </>
      )}

      <Disclaimer />
    </div>
  );
}

function Legend() {
  return (
    <div className="surface p-3 mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] uppercase tracking-kicker font-mono text-cream/55">
      <span className="flex items-center gap-1.5">
        <Info size={11} className="text-cream/45" /> Slik leser du:
      </span>
      <span>
        <span className="font-mono font-bold stat-num text-cream">2.45</span>{" "}
        beste pris
      </span>
      <span>
        <span className="font-mono stat-num text-cream/85">45%</span> fair
        sannsynlighet
      </span>
      <span>
        <span className="font-mono stat-num text-cream/85">P 2.20</span> Pinnacle/sharp
      </span>
      <span>
        <span className="font-mono stat-num text-cream/85">Modell 45%</span>{" "}
        Dixon-Coles
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-3 w-3 bg-win/30 border border-win/60" />
        Modell-verdi (+EV)
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-3 w-3 bg-amber/30 border border-amber/60" />
        Markeds-edge
      </span>
    </div>
  );
}

function NotConfigured() {
  return (
    <div className="surface p-6 ring-1 ring-amber/20">
      <div className="flex items-start gap-3">
        <AlertCircle size={18} className="text-amber shrink-0 mt-0.5" />
        <div>
          <h2 className="font-serif text-lg font-semibold tracking-editorial text-cream mb-1">
            Tippemodell er klar, men mangler odds-nøkkel.
          </h2>
          <p className="text-sm text-cream/55 leading-relaxed max-w-2xl">
            Hele infrastrukturen er på plass — database-skjema, cron-jobb,
            adapter og dashbord. Når{" "}
            <code className="px-1.5 py-0.5 bg-paper text-cream font-mono text-xs">
              ODDS_API_KEY
            </code>{" "}
            er satt i Vercel-prosjektet og en{" "}
            <Link
              href="https://oddspapi.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-signal hover:text-amber underline"
            >
              OddsPapi-konto
            </Link>{" "}
            er koblet inn, vil cron-en automatisk fylle tabellen og denne
            siden viser live priser fra 370+ bookmakere per kamp.
          </p>
          <ul className="mt-3 text-[11px] text-cream/55 font-mono leading-relaxed list-disc pl-5">
            <li>Beste pris per utfall på tvers av bookmakere</li>
            <li>Fair sannsynlighet (margin fjernet) basert på Pinnacle</li>
            <li>Verdi-flagg når markedet betaler bedre enn fair-linja</li>
            <li>Full historikk — hver henting lagres som et snapshot</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="surface p-8 text-center">
      <Info size={18} className="text-cream/35 mx-auto mb-3" />
      <h2 className="font-serif text-lg tracking-editorial text-cream/85 mb-1">
        Ingen odds registrert ennå
      </h2>
      <p className="text-xs text-cream/55 max-w-md mx-auto">
        Cron-jobben har ikke kjørt enda, eller OddsPapi har ikke priser på
        kommende VM-kamper. Sjekk tilbake etter første cron-tick.
      </p>
    </div>
  );
}

function Disclaimer() {
  return (
    <div className="mt-8 pt-5 border-t border-cream/8 text-[10px] text-cream/45 font-mono leading-relaxed max-w-3xl">
      Til eget bruk · beslutningsstøtte, ikke gevinstgaranti. Bookmakernes
      margin gjør at det er vanskelig å slå markedet over tid selv med gode
      modeller. Spill ansvarlig — sett grenser og ta pauser. Hjelpelinjen for
      spilleavhengighet: 800 800 40.
    </div>
  );
}
