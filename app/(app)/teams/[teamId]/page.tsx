import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TeamFlag } from "@/components/shared/TeamFlag";
import { teamById } from "@/lib/wc26-data";
import { getSquad } from "@/lib/wc26-squads";
import { SquadList } from "@/components/match/SquadList";

export default function TeamProfilePage({ params }: { params: { teamId: string } }) {
  const id = Number(params.teamId);
  const team = teamById(id);
  if (!team) notFound();

  const squad = getSquad(id);
  const startingXI = squad.filter((p) => p.startX !== undefined);
  const bench = squad.filter((p) => p.startX === undefined);

  return (
    <div className="px-6 py-6 max-w-[1100px] mx-auto space-y-5">
      <Link
        href="/teams"
        className="inline-flex items-center gap-1.5 text-xs text-pitch-400 hover:text-accent-300 transition-colors"
      >
        <ArrowLeft size={12} /> All teams
      </Link>

      <div className="card-panel p-6 flex items-center gap-5">
        <TeamFlag code={team.flag} size="lg" />
        <div className="flex-1">
          <div className="text-[10px] uppercase tracking-widest text-pitch-400 font-mono">
            Group {team.group} · {team.confederation}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-1">
            {team.name}
          </h1>
          <div className="mt-2 text-xs text-pitch-400 flex flex-wrap gap-x-4 gap-y-1">
            {team.manager && <span>Manager: {team.manager}</span>}
            {team.preferredFormation && (
              <span>Formation: {team.preferredFormation}</span>
            )}
            {team.fifaRank && <span>FIFA rank: #{team.fifaRank}</span>}
          </div>
        </div>
        <span
          className={`text-[10px] uppercase tracking-widest font-mono px-2 py-0.5 rounded ${
            team.squadStatus === "preliminary"
              ? "bg-draw/15 text-draw"
              : team.squadStatus === "official"
                ? "bg-accent-500/15 text-accent-300"
                : "bg-pitch-800 text-pitch-500"
          }`}
        >
          {team.squadStatus}
        </span>
      </div>

      {squad.length > 0 ? (
        <SquadList
          startingXI={startingXI}
          bench={bench}
          side="home"
          teamShortName={team.shortName}
        />
      ) : (
        <div className="card-panel p-8 text-center">
          <div className="text-sm font-semibold text-pitch-200">
            Squad not yet announced
          </div>
          <div className="text-xs text-pitch-500 mt-1">
            The federation has not published a preliminary roster.
          </div>
        </div>
      )}
    </div>
  );
}
