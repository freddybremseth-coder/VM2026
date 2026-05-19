import { cn } from "@/lib/utils";
import type { MatchStats, MatchDetail } from "@/lib/types";

interface Props {
  stats: MatchStats;
  home: MatchDetail["teams"]["home"];
  away: MatchDetail["teams"]["away"];
}

const ROWS: Array<{
  key: keyof MatchStats;
  label: string;
  /** Optional suffix like "%". */
  suffix?: string;
  /** Number of decimals to render. */
  decimals?: number;
  /** When true a lower value is better (e.g. fouls, cards). */
  lowerIsBetter?: boolean;
}> = [
  { key: "possession", label: "Possession", suffix: "%" },
  { key: "shots", label: "Shots" },
  { key: "shotsOnTarget", label: "Shots on target" },
  { key: "xg", label: "Expected goals (xG)", decimals: 2 },
  { key: "passes", label: "Passes" },
  { key: "passAccuracy", label: "Pass accuracy", suffix: "%" },
  { key: "corners", label: "Corners" },
  { key: "offsides", label: "Offsides", lowerIsBetter: true },
  { key: "fouls", label: "Fouls", lowerIsBetter: true },
  { key: "yellowCards", label: "Yellow cards", lowerIsBetter: true },
  { key: "redCards", label: "Red cards", lowerIsBetter: true },
];

export function StatComparisonBars({ stats, home, away }: Props) {
  return (
    <div className="card-panel p-5">
      <div className="flex items-end justify-between mb-5">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-pitch-400 mb-1">
            Head to head
          </div>
          <h3 className="text-base font-semibold">Match statistics</h3>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono uppercase tracking-widest">
          <span className="text-accent-300">{home.shortName}</span>
          <span className="text-pitch-600">vs</span>
          <span className="text-data-300">{away.shortName}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3.5">
        {ROWS.map((row) => {
          const value = stats[row.key];
          return (
            <StatRow
              key={row.key}
              label={row.label}
              homeValue={value.home}
              awayValue={value.away}
              suffix={row.suffix}
              decimals={row.decimals}
              lowerIsBetter={row.lowerIsBetter}
            />
          );
        })}
      </div>
    </div>
  );
}

interface RowProps {
  label: string;
  homeValue: number;
  awayValue: number;
  suffix?: string;
  decimals?: number;
  lowerIsBetter?: boolean;
}

function StatRow({ label, homeValue, awayValue, suffix = "", decimals = 0, lowerIsBetter }: RowProps) {
  const total = homeValue + awayValue;
  const homePct = total > 0 ? (homeValue / total) * 100 : 50;
  const awayPct = total > 0 ? (awayValue / total) * 100 : 50;

  const fmt = (n: number) => n.toFixed(decimals) + suffix;
  const homeWins = lowerIsBetter ? homeValue < awayValue : homeValue > awayValue;
  const awayWins = lowerIsBetter ? awayValue < homeValue : awayValue > homeValue;
  const tied = homeValue === awayValue;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5 text-xs">
        <span
          className={cn(
            "font-mono stat-num font-semibold w-14",
            homeWins && !tied ? "text-accent-300" : "text-pitch-400",
          )}
        >
          {fmt(homeValue)}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-pitch-500">
          {label}
        </span>
        <span
          className={cn(
            "font-mono stat-num font-semibold w-14 text-right",
            awayWins && !tied ? "text-data-300" : "text-pitch-400",
          )}
        >
          {fmt(awayValue)}
        </span>
      </div>
      <div className="flex h-1.5 gap-px rounded-full overflow-hidden bg-pitch-900">
        <div
          className={cn(
            "transition-all",
            homeWins && !tied ? "bg-accent-500" : "bg-pitch-600",
          )}
          style={{ width: `${homePct}%` }}
        />
        <div
          className={cn(
            "transition-all",
            awayWins && !tied ? "bg-data-500" : "bg-pitch-600",
          )}
          style={{ width: `${awayPct}%` }}
        />
      </div>
    </div>
  );
}
