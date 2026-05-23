import { User, Info } from "lucide-react";
import { PlayerFilters } from "@/components/player/PlayerFilters";
import { Kicker, Headline } from "@/components/shared/EditorialKicker";
import { DataSourceBanner } from "@/components/shared/DataSourceBanner";
import { getAllPlayers } from "@/lib/wc26-squads";
import { TEAMS } from "@/lib/wc26-data";

export default function PlayersPage() {
  const players = getAllPlayers();
  const teamsWithSquads = new Set(players.map((p) => p.teamId));
  const teamsPending = TEAMS.filter((t) => !teamsWithSquads.has(t.id)).length;

  return (
    <div className="px-5 md:px-10 py-8 max-w-[1400px] mx-auto">
      <header className="mb-6">
        <Kicker tone="signal">
          <span className="inline-flex items-center gap-2">
            <User size={11} /> Spillere
          </span>
        </Kicker>
        <Headline rank="h1" className="mt-2">
          Spillerdatabasen.
        </Headline>
        <p className="text-sm text-cream/55 mt-3 max-w-2xl">
          Søk og filtrer på tvers av alle VM26-tropper. {players.length} spillere
          fra {teamsWithSquads.size} nasjoner.
        </p>
      </header>

      <div className="space-y-3 mb-5">
        <DataSourceBanner
          caveat="Caps og mål reflekterer hver tropps annonseringsøyeblikk — kan henge etter live-resultater inntil sann-tids-feed er koblet til."
        />
        {teamsPending > 0 && (
          <div className="flex items-start gap-3 surface px-4 py-3">
            <Info size={14} className="text-amber shrink-0 mt-0.5" />
            <div className="text-xs text-cream/70 leading-relaxed">
              <span className="font-semibold text-cream">{teamsPending} nasjoner</span>{" "}
              har ikke annonsert sin endelige 26-manns-tropp ennå. Tropper legges til
              fortløpende — preliminære oppstillinger er tydelig merket.
            </div>
          </div>
        )}
      </div>

      <PlayerFilters players={players} />
    </div>
  );
}
