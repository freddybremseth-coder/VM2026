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
 * Four-tile grid showing the team's top performers (editorial).
 *   ⚽ top scorer · ✶ top assister · ♔ most caps · ⏱ most minutes
 * Each tile is a Link → /players/[id].
 */
export function TeamStarsCard({ teamId }: Props) {
  const topScorer = getTopScorer(teamId);
  const topAssister = getTopAssister(teamId);
  const mostCapped = getMostCapped(teamId);
  const mostMinutes = getMostMinutes(teamId);

  const anyStats = topScorer || topAssister || mostCapped || mostMinutes;
  if (!anyStats) return null;

  return (
    <div className="surface p-5">
      <div className="flex items-center gap-2 mb-4">
        <Trophy size={12} className="text-signal" />
        <h2 className="text-[10px] uppercase tracking-kicker font-mono font-semibold text-cream/70">
          Lagets stjerner
        </h2>
        <span className="text-[9px] uppercase tracking-kicker text-cream/45 font-mono ml-auto">
          all-time int.
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-cream/8">
        <StarTile
          icon={<Trophy size={12} />}
          label="Toppscorer"
          leader={topScorer}
          unit="mål"
          accent="signal"
        />
        <StarTile
          icon={<Sparkles size={12} />}
          label="Assistkonge"
          leader={topAssister}
          unit="assists"
          accent="amber"
        />
        <StarTile
          icon={<Crown size={12} />}
          label="Flest caps"
          leader={mostCapped}
          unit="caps"
          accent="signal"
        />
        <StarTile
          icon={<Clock size={12} />}
          label="Mest spilletid"
          leader={mostMinutes}
          unit="min"
          accent="amber"
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
  accent: "signal" | "amber";
}) {
  if (!leader) {
    return (
      <div className="bg-paper p-3">
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-kicker text-cream/45 font-mono mb-2">
          {icon}
          {label}
        </div>
        <div className="text-cream/35 text-xs italic">Ingen data</div>
      </div>
    );
  }

  const iconColor = accent === "signal" ? "text-signal" : "text-amber";
  const valueColor = accent === "signal" ? "text-signal" : "text-amber";

  return (
    <Link
      href={`/players/${leader.player.id}`}
      className="bg-paper hover:bg-paperHi p-3 transition-colors group"
    >
      <div
        className={`flex items-center gap-1.5 text-[10px] uppercase tracking-kicker font-mono mb-2 ${iconColor}`}
      >
        {icon}
        <span>{label}</span>
      </div>
      <div
        className={`font-serif text-3xl font-semibold stat-num leading-none tracking-[-0.02em] ${valueColor}`}
      >
        {leader.value.toLocaleString("nb-NO")}
        <span className="text-[10px] text-cream/55 ml-1 font-mono font-normal lowercase tracking-normal">
          {unit}
        </span>
      </div>
      <div className="mt-2 font-serif text-sm font-semibold text-cream truncate group-hover:text-amber transition-colors">
        {leader.player.name}
      </div>
      <div className="text-[10px] text-cream/45 truncate font-mono mt-0.5">
        #{leader.player.number || "—"} · {leader.player.position}
      </div>
    </Link>
  );
}
