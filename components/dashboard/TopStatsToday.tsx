import { TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TopStat } from "@/lib/types";

interface Props {
  stats: TopStat[];
}

export function TopStatsToday({ stats }: Props) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={14} className="text-accent-400" />
        <h2 className="text-xs uppercase tracking-widest font-semibold text-pitch-200">
          Top stats today
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {stats.map((s) => {
          const TrendIcon =
            s.trend === "up" ? TrendingUp : s.trend === "down" ? TrendingDown : Minus;
          const trendColor =
            s.trend === "up"
              ? "text-win"
              : s.trend === "down"
                ? "text-loss"
                : "text-pitch-500";
          return (
            <div key={s.label} className="card-panel p-3">
              <div className="flex items-start justify-between mb-1">
                <div className="text-[10px] uppercase tracking-widest text-pitch-400 leading-tight">
                  {s.label}
                </div>
                <TrendIcon size={12} className={cn("shrink-0", trendColor)} />
              </div>
              <div className="font-mono text-xl font-bold stat-num text-accent-300 leading-none mt-2">
                {s.value}
              </div>
              <div className="text-[11px] text-pitch-400 mt-1.5 truncate">
                {s.context}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
