import { User, Info } from "lucide-react";
import { PlayerFilters } from "@/components/player/PlayerFilters";
import { DataSourceBanner } from "@/components/shared/DataSourceBanner";
import { getAllPlayers } from "@/lib/wc26-squads";
import { TEAMS } from "@/lib/wc26-data";

export default function PlayersPage() {
  const players = getAllPlayers();
  const teamsWithSquads = new Set(players.map((p) => p.teamId));
  const teamsPending = TEAMS.filter((t) => !teamsWithSquads.has(t.id)).length;

  return (
    <div className="px-6 py-6 max-w-[1400px] mx-auto">
      <header className="mb-6">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-accent-400 font-semibold mb-1">
          <User size={12} />
          Players
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Player database
        </h1>
        <p className="text-sm text-pitch-400 mt-1">
          Search and filter across all WC26 squads. {players.length} players
          across {teamsWithSquads.size} nations.
        </p>
      </header>

      <div className="space-y-3 mb-5">
        <DataSourceBanner
          caveat="Caps and goals reflect each squad's announcement snapshot — they may lag behind live results until we wire a real-time feed."
        />
        {teamsPending > 0 && (
          <div className="flex items-start gap-3 rounded-md bg-pitch-800/60 border border-pitch-700 px-4 py-3">
            <Info size={14} className="text-data-400 shrink-0 mt-0.5" />
            <div className="text-xs text-pitch-300 leading-relaxed">
              <span className="font-semibold text-pitch-100">{teamsPending} nations</span>{" "}
              have not announced their final 26-man rosters yet. Squad lists are
              added as federations publish them — preliminary squads are clearly
              marked.
            </div>
          </div>
        )}
      </div>

      <PlayerFilters players={players} />
    </div>
  );
}
