"use client";

/**
 * XGEventTimeline — xG area chart driven by MatchEventData types.
 *
 * Differs from XGTimelineChart (which uses lib/types) in that it:
 *   - accepts XGTimelinePoint[] from match-events/types (same shape, compatible)
 *   - marks goal shots (outcome === "goal") as vertical reference lines
 */

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { XGTimelinePoint, ShotEvent } from "@/lib/match-events/types";

interface Props {
  timeline: XGTimelinePoint[];
  shots: ShotEvent[];
  homeShort: string;
  awayShort: string;
}

export function XGEventTimeline({ timeline, shots, homeShort, awayShort }: Props) {
  const goals = shots.filter((s) => s.outcome === "goal" || s.outcome === "own-goal");
  const finalHome = timeline.at(-1)?.home ?? 0;
  const finalAway = timeline.at(-1)?.away ?? 0;

  return (
    <div className="card-panel p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-pitch-400 mb-1">
            Expected goals
          </div>
          <h3 className="text-base font-semibold">xG timeline</h3>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <LegendItem color="hsl(var(--accent-500))" label={homeShort} value={finalHome.toFixed(2)} />
          <LegendItem color="hsl(var(--data-500))" label={awayShort} value={finalAway.toFixed(2)} />
        </div>
      </div>

      <div className="h-64 -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timeline} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="xget-home" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--accent-500))" stopOpacity={0.55} />
                <stop offset="100%" stopColor="hsl(var(--accent-500))" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="xget-away" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--data-500))" stopOpacity={0.5} />
                <stop offset="100%" stopColor="hsl(var(--data-500))" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="hsl(var(--pitch-700))" strokeDasharray="2 4" vertical={false} />
            <XAxis
              dataKey="minute"
              tickFormatter={(v) => `${v}'`}
              tick={{ fontSize: 10, fill: "hsl(var(--pitch-400))", fontFamily: "var(--font-mono)" }}
              axisLine={{ stroke: "hsl(var(--pitch-700))" }}
              tickLine={false}
              ticks={[0, 15, 30, 45, 60, 75, 90]}
              domain={[0, 90]}
              type="number"
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(var(--pitch-400))", fontFamily: "var(--font-mono)" }}
              axisLine={{ stroke: "hsl(var(--pitch-700))" }}
              tickLine={false}
              tickFormatter={(v) => v.toFixed(1)}
              width={40}
            />
            <Tooltip
              content={<XGTooltip homeName={homeShort} awayName={awayShort} />}
              cursor={{ stroke: "hsl(var(--pitch-500))", strokeWidth: 1 }}
            />
            {goals.map((g, i) => (
              <ReferenceLine
                key={i}
                x={g.minute}
                stroke={g.side === "home" ? "hsl(var(--accent-400))" : "hsl(var(--data-400))"}
                strokeWidth={1.5}
                strokeDasharray="3 3"
                label={{
                  value: `⚽ ${g.minute}'`,
                  position: "top",
                  fill: g.side === "home" ? "hsl(var(--accent-300))" : "hsl(var(--data-300))",
                  fontSize: 10,
                  fontFamily: "var(--font-mono)",
                }}
              />
            ))}
            <Area
              type="monotone"
              dataKey="home"
              stroke="hsl(var(--accent-500))"
              strokeWidth={2}
              fill="url(#xget-home)"
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="away"
              stroke="hsl(var(--data-500))"
              strokeWidth={2}
              fill="url(#xget-away)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function LegendItem({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} />
      <span className="font-mono text-pitch-300">{label}</span>
      <span className="font-mono font-semibold text-pitch-100 stat-num">{value}</span>
    </div>
  );
}

function XGTooltip({
  active,
  payload,
  label,
  homeName,
  awayName,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string }>;
  label?: number;
  homeName: string;
  awayName: string;
}) {
  if (!active || !payload?.length) return null;
  const home = payload.find((p) => p.dataKey === "home")?.value ?? 0;
  const away = payload.find((p) => p.dataKey === "away")?.value ?? 0;
  return (
    <div className="card-panel px-3 py-2 text-xs">
      <div className="font-mono text-pitch-400 mb-1">Minute {label}'</div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-accent-300 font-mono stat-num">{homeName} {home.toFixed(2)}</span>
        <span className="text-data-300 font-mono stat-num">{awayName} {away.toFixed(2)}</span>
      </div>
    </div>
  );
}
