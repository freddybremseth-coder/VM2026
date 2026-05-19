import { notFound } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { FormationPitch } from "@/components/match/FormationPitch";
import { SquadList } from "@/components/match/SquadList";
import { getMatchDetail } from "@/lib/match-data";
import { teamById } from "@/lib/wc26-data";
import { getStartingXI, getBench } from "@/lib/wc26-squads";

export default function LineupsPage({ params }: { params: { matchId: string } }) {
  const match = getMatchDetail(params.matchId);
  if (!match) notFound();

  const homeTeam = teamById(match.teams.home.id);
  const awayTeam = teamById(match.teams.away.id);

  const homeXI = getStartingXI(match.teams.home.id);
  const awayXI = getStartingXI(match.teams.away.id);
  const homeBench = getBench(match.teams.home.id);
  const awayBench = getBench(match.teams.away.id);

  const homeHasSquad = homeXI.length > 0;
  const awayHasSquad = awayXI.length > 0;

  return (
    <div className="space-y-5">
      {(homeTeam?.squadStatus !== "official" || awayTeam?.squadStatus !== "official") && (
        <div className="flex items-start gap-3 rounded-md bg-draw/10 border border-draw/30 px-4 py-3">
          <AlertTriangle size={14} className="text-draw shrink-0 mt-0.5" />
          <div className="text-xs text-pitch-200 leading-relaxed">
            <span className="font-semibold text-draw">Preliminary squads.</span>{" "}
            Final 26-man rosters are typically submitted a week before kickoff.
            What's shown here reflects probable selections based on current club
            form, not official lists.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {homeHasSquad ? (
          <FormationPitch
            startingXI={homeXI}
            formation={match.teams.home.formation}
            side="home"
            teamShortName={match.teams.home.shortName}
          />
        ) : (
          <PitchUnavailable shortName={match.teams.home.shortName} />
        )}
        {awayHasSquad ? (
          <FormationPitch
            startingXI={awayXI}
            formation={match.teams.away.formation}
            side="away"
            teamShortName={match.teams.away.shortName}
          />
        ) : (
          <PitchUnavailable shortName={match.teams.away.shortName} />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {homeHasSquad && (
          <SquadList
            startingXI={homeXI}
            bench={homeBench}
            side="home"
            teamShortName={match.teams.home.shortName}
          />
        )}
        {awayHasSquad && (
          <SquadList
            startingXI={awayXI}
            bench={awayBench}
            side="away"
            teamShortName={match.teams.away.shortName}
          />
        )}
      </div>
    </div>
  );
}

function PitchUnavailable({ shortName }: { shortName: string }) {
  return (
    <div className="card-panel p-8 text-center flex flex-col items-center justify-center min-h-[320px]">
      <AlertTriangle size={20} className="text-pitch-500 mb-2" />
      <div className="text-sm font-semibold text-pitch-200">
        {shortName} squad not yet announced
      </div>
      <div className="text-xs text-pitch-500 mt-1 max-w-xs">
        Final roster will be added once the federation publishes it (typically 7 days before kickoff).
      </div>
    </div>
  );
}
