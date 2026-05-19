import { notFound } from "next/navigation";
import { XGTimelineChart } from "@/components/match/XGTimelineChart";
import { StatComparisonBars } from "@/components/match/StatComparisonBars";
import { AIPredictionBox } from "@/components/match/AIPredictionBox";
import { GoalsList } from "@/components/match/GoalsList";
import { getMatchDetail } from "@/lib/match-data";

export default function MatchOverview({ params }: { params: { matchId: string } }) {
  const match = getMatchDetail(params.matchId);
  if (!match) notFound();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <div className="xl:col-span-2 space-y-5">
        <XGTimelineChart
          timeline={match.xgTimeline}
          goals={match.goals}
          home={match.teams.home}
          away={match.teams.away}
        />
        <StatComparisonBars
          stats={match.stats}
          home={match.teams.home}
          away={match.teams.away}
        />
      </div>
      <div className="space-y-5">
        <AIPredictionBox
          prediction={match.aiPrediction}
          home={match.teams.home}
          away={match.teams.away}
        />
        <GoalsList
          goals={match.goals}
          home={match.teams.home}
          away={match.teams.away}
        />
      </div>
    </div>
  );
}
