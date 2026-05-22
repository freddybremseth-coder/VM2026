import Link from "next/link";
import { Trophy, Sparkles, Crown, Clock } from "lucide-react";
import {
  getTopScorer,
  getTopAssister,
  getMostCapped,
  getMostMinutes,
  type TeamLeader,
} from "@/lib/team-stats";

interface Props {
  teamId: number;
}

/**
 * Four-tile grid showing the team's top performers:
 *   ⚽ top scorer · 🅰️ top assister · ⭐ most caps · ⏱ most minutes
 *
 * Tiles are clickable — they link straight to the player profile.
 */
export function TeamStarsCard({ teamId }: Props) {
  const topScorer = getTopScorer(teamId);
  const topAssister = getTopAssister(teamId);
  const mostCapped = getMostCapped(teamId);
  const mostMinutes = getMostMinutes(teamId);

  const anyStats = topScorer || topAssister || mostCapped || mostMinutes;
  if (!anyStats) return null;

  return (
    <div className="card-panel p-5">
      <div className="flex items-center gap-2 mb-4">
        <Trophy size={12} className="text-accent-400" />
        <h2 className="text-xs uppercase tracking-widest font-semibold text-pitch-200">
          Lagets stjerner
        </h2>
        <span className="text-[10px] text-pitch-500 font-mono ml-auto">
          all-time int.
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StarTile
          icon={<Trophy size={14} />}
          label="Toppscorer"
          leader={topScorer}
          unit="mål"
          accent="accent"
        />
        <StarTile
          icon={<Sparkles size={14} />}
          label="Assistkonge"
          leader={topAssister}
          unit="assists"
          accent="data"
        />
        <StarTile
          icon={<Crown size={14} />}
          label="Flest caps"
          leader={mostCapped}
          unit="caps"
          accent="accent"
        />
        <StarTile
          icon={<Clock size={14} />}
          label="Mest spilletid"
          leader={mostMinutes}
          unit="min"
          accent="data"
        />
      </div>
    </div>
  );
}

function StarTile({
  icon,
  label,
  leader,
  unit,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  leader: TeamLeader | null;
  unit: string;
  accent: "accent" | "data";
}) {
  if (!leader) {
    return (
      <div className="rounded-md bg-pitch-800/40 p-3 border border-pitch-700/50">
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-pitch-500 font-mono mb-2">
          {icon}
          {label}
        </div>
        <div className="text-pitch-600 text-xs italic">Ingen data</div>
      </div>
    );
  }

  const iconColor = accent === "accent" ? "text-accent-400" : "text-data-400";
  const valueColor = accent === "accent" ? "text-accent-300" : "text-data-300";

  return (
    <Link
      href={`/players/${leader.player.id}`}
      className="rounded-md bg-pitch-800/40 hover:bg-pitch-800 p-3 border border-pitch-700/50 hover:border-accent-500/40 transition-colors group"
    >
      <div className={`flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-mono mb-2 ${iconColor}`}>
        {icon}
        <span>{label}</span>
      </div>
      <div className={`font-mono text-2xl font-bold stat-num leading-none ${valueColor}`}>
        {leader.value.toLocaleString("nb-NO")}
        <span className="text-[10px] text-pitch-500 ml-1 font-sans font-normal lowercase">
          {unit}
        </span>
      </div>
      <div className="mt-2 text-xs font-semibold text-pitch-100 truncate group-hover:text-accent-200">
        {leader.player.name}
      </div>
      <div className="text-[10px] text-pitch-500 truncate">
        #{leader.player.number || "—"} · {leader.player.position}
      </div>
    </Link>
  );
}
