/**
 * PlayerMatchData — shows a player's heatmap + shot stats from a match.
 * Rendered server-side on the player profile page.
 * Gracefully returns nothing if no data is available.
 */

import { Activity } from "lucide-react";
import type { PlayerHeatmap, ShotEvent } from "@/lib/match-events/types";
import { HeatmapGrid } from "@/components/match/HeatmapGrid";

interface Props {
  heatmap: PlayerHeatmap | null;
  shots: ShotEvent[];
  matchLabel: string;
  side: "home" | "away";
}

const OUTCOME_STYLE: Record<string, string> = {
  goal:         "bg-win/15 text-win ring-win/30",
  saved:        "bg-accent-500/10 text-accent-300 ring-accent-500/20",
  blocked:      "bg-pitch-700 text-pitch-400 ring-pitch-600",
  "off-target": "bg-pitch-800 text-pitch-500 ring-pitch-700",
  post:         "bg-draw/10 text-draw ring-draw/25",
  "own-goal":   "bg-loss/15 text-loss ring-loss/30",
};
const OUTCOME_LABEL: Record<string, string> = {
  goal: "Mål", saved: "Reddet", blocked: "Blokkert",
  "off-target": "Utenfor", post: "Stolpe", "own-goal": "Selvmål",
};

export function PlayerMatchData({ heatmap, shots, matchLabel, side }: Props) {
  if (!heatmap && shots.length === 0) return null;

  const totalXg = shots.reduce((sum, s) => sum + s.xg, 0);
  const goals = shots.filter((s) => s.outcome === "goal");

  return (
    <section className="card-panel p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Activity size={14} className="text-data-400" />
        <h2 className="text-xs uppercase tracking-widest font-semibold text-pitch-200">
          Kampdata · {matchLabel}
        </h2>
      </div>

      {/* Quick stats row */}
      {shots.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-pitch-400 mb-1">Skudd</div>
            <div className="font-mono text-2xl font-bold stat-num text-pitch-100">{shots.length}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-pitch-400 mb-1">Mål</div>
            <div className="font-mono text-2xl font-bold stat-num text-win">{goals.length}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-pitch-400 mb-1">xG</div>
            <div className="font-mono text-2xl font-bold stat-num text-accent-300">
              {totalXg.toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* Shot list */}
      {shots.length > 0 && (
        <div className="space-y-1.5">
          {shots.map((s, i) => (
            <div key={i} className="flex items-center gap-3 text-xs">
              <span className="font-mono text-pitch-500 w-8 text-right stat-num">{s.minute}'</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ring-1 ${OUTCOME_STYLE[s.outcome] ?? "bg-pitch-800 text-pitch-400 ring-pitch-700"}`}>
                {OUTCOME_LABEL[s.outcome] ?? s.outcome}
              </span>
              <span className="text-pitch-400">
                xG <span className="font-mono text-pitch-200 stat-num">{s.xg.toFixed(2)}</span>
              </span>
              {s.bodyPart && (
                <span className="text-pitch-600 hidden sm:inline">{s.bodyPart}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Heatmap */}
      {heatmap && (
        <HeatmapGrid
          heatmap={heatmap}
          hotColor={side === "home" ? "hsl(var(--accent-500))" : "hsl(var(--data-500))"}
        />
      )}
    </section>
  );
}
