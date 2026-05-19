import { Clock, CheckCircle2 } from "lucide-react";
import todayData from "@/mock/matches/today.json";
import { LiveTicker } from "@/components/dashboard/LiveTicker";
import { TopStatsToday } from "@/components/dashboard/TopStatsToday";
import { MatchesSection } from "@/components/dashboard/MatchesSection";
import { formatDateLabel } from "@/lib/utils";
import type { MatchSummary, TopStat } from "@/lib/types";

export default function DashboardPage() {
  const matches = todayData.matches as MatchSummary[];
  const topStats = todayData.topStats as TopStat[];

  const live = matches.filter((m) => m.status === "live" || m.status === "halftime");
  const upcoming = matches
    .filter((m) => m.status === "scheduled")
    .sort((a, b) => a.kickoff.localeCompare(b.kickoff));
  const finished = matches.filter((m) => m.status === "finished");

  return (
    <div className="px-6 py-6 max-w-[1600px] mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-accent-400 font-semibold mb-1">
            Matchday
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {formatDateLabel(todayData.date)}
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-pitch-400">
          <span className="stat-pill">
            <span className="live-dot" /> {live.length} live
          </span>
          <span className="stat-pill">{upcoming.length} upcoming</span>
          <span className="stat-pill">{finished.length} finished</span>
        </div>
      </header>

      <LiveTicker matches={matches} />

      <TopStatsToday stats={topStats} />

      <MatchesSection
        title="Live & in-play"
        icon={<span className="live-dot" />}
        matches={live}
        emptyLabel="No live matches right now."
      />

      <MatchesSection
        title="Upcoming today"
        icon={<Clock size={14} className="text-data-400" />}
        matches={upcoming}
      />

      <MatchesSection
        title="Finished today"
        icon={<CheckCircle2 size={14} className="text-pitch-400" />}
        matches={finished}
      />
    </div>
  );
}
