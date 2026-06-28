"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PointsProgression } from "@/lib/leagues/points-progression";

/**
 * Cumulative-points race: one line per league member across the tournament
 * days a match was decided. The slope shows each player's form — steepening =
 * rising, flat = stalling. Players are coloured from a fixed palette; the
 * leader (highest total) gets the signal red.
 */
const PALETTE = [
  "hsl(var(--signal))",
  "hsl(var(--amber))",
  "hsl(var(--win))",
  "#6aa9ff",
  "#c084fc",
  "#f472b6",
  "#34d399",
  "#fb923c",
];

/** Compare the last decided day's gain to the one before → momentum arrow. */
function trendOf(cumulative: number[]): "up" | "down" | "flat" {
  const n = cumulative.length;
  if (n < 2) return "flat";
  const lastGain = cumulative[n - 1] - cumulative[n - 2];
  const prevGain = n >= 3 ? cumulative[n - 2] - cumulative[n - 3] : 0;
  if (lastGain > prevGain) return "up";
  if (lastGain < prevGain) return "down";
  return "flat";
}

export function PointsProgressionChart({ data }: { data: PointsProgression }) {
  // Order players by final total so the legend/colours read top-down.
  const ordered = [...data.players].sort((a, b) => b.total - a.total);

  return (
    <>
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data.rows} margin={{ top: 8, right: 14, bottom: 4, left: -16 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 9, fontFamily: "monospace", fill: "rgba(255,255,255,0.55)" }}
            tickLine={false}
            axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
            minTickGap={16}
          />
          <YAxis
            tick={{ fontSize: 9, fontFamily: "monospace", fill: "rgba(255,255,255,0.55)" }}
            tickLine={false}
            axisLine={false}
            width={40}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: "#15151a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 0,
              fontSize: 11,
              fontFamily: "monospace",
            }}
            labelStyle={{ color: "rgba(255,255,255,0.6)" }}
            itemSorter={(item) => -(item.value as number)}
          />
          {ordered.map((p, i) => (
            <Line
              key={p.userId}
              type="monotone"
              dataKey={p.label}
              stroke={PALETTE[i % PALETTE.length]}
              strokeWidth={i === 0 ? 2.2 : 1.5}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>

    {/* Legend + form (trend vs the previous decided day) */}
    <div className="mt-3 pt-3 border-t border-cream/8 flex flex-wrap gap-x-5 gap-y-2">
      {ordered.map((p, i) => {
        const trend = trendOf(p.cumulative);
        const trendMeta =
          trend === "up"
            ? { sym: "▲", cls: "text-win", word: "økende" }
            : trend === "down"
              ? { sym: "▼", cls: "text-loss", word: "fallende" }
              : { sym: "▬", cls: "text-cream/45", word: "stabil" };
        return (
          <div key={p.userId} className="flex items-center gap-2 min-w-0">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ background: PALETTE[i % PALETTE.length] }}
            />
            <span className="font-serif text-[13px] tracking-editorial text-cream truncate max-w-[10rem]">
              {p.label}
            </span>
            <span className="font-mono text-[11px] text-cream/60 stat-num">{p.total}p</span>
            <span className={`font-mono text-[10px] ${trendMeta.cls}`} title={`Siste dag: +${p.lastDelta}p`}>
              {trendMeta.sym} {trendMeta.word}
            </span>
          </div>
        );
      })}
    </div>
    </>
  );
}
