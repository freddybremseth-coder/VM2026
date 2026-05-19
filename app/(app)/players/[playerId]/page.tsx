import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TeamFlag } from "@/components/shared/TeamFlag";
import { getAllPlayers } from "@/lib/wc26-squads";
import { teamById } from "@/lib/wc26-data";

export default function PlayerProfilePage({
  params,
}: {
  params: { playerId: string };
}) {
  const id = Number(params.playerId);
  const player = getAllPlayers().find((p) => p.id === id);
  if (!player) notFound();
  const team = teamById(player.teamId);

  return (
    <div className="px-6 py-6 max-w-[1100px] mx-auto space-y-5">
      <Link
        href="/players"
        className="inline-flex items-center gap-1.5 text-xs text-pitch-400 hover:text-accent-300 transition-colors"
      >
        <ArrowLeft size={12} /> All players
      </Link>

      <div className="card-panel p-6">
        <div className="flex items-start gap-5">
          <div className="h-20 w-20 rounded-md bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-pitch-950 font-mono font-bold text-2xl stat-num">
            {player.number}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-pitch-400 font-mono mb-1">
              {team && (
                <span className="flex items-center gap-1.5">
                  <TeamFlag code={team.flag} size="sm" /> {team.name}
                </span>
              )}
              <span>·</span>
              <span>{player.position}</span>
              {player.isCaptain && <span className="text-accent-400">· (C)</span>}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {player.name}
            </h1>
            <p className="text-sm text-pitch-400 mt-1">{player.club}</p>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-pitch-700/60 grid grid-cols-3 gap-4">
          <Stat label="Age" value={player.age} />
          <Stat label="Caps" value={player.caps} />
          <Stat label="Goals" value={player.goals} />
        </div>
      </div>

      <div className="card-panel p-8 text-center">
        <div className="text-sm font-semibold text-pitch-200">
          Heatmap, club stats and WC26 form
        </div>
        <div className="text-xs text-pitch-500 mt-1">
          Coming next — these depend on event-level data feeds.
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-pitch-500 mb-1">
        {label}
      </div>
      <div className="font-mono text-2xl font-bold stat-num text-accent-300">
        {value}
      </div>
    </div>
  );
}
