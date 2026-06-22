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
import type { LinePoint } from "@/lib/tippemodell/line-movement";

/**
 * Best-price-over-time chart for one match's 1X2 market. Three lines
 * (home / draw / away) on a shared decimal-odds axis. Recharts, themed to
 * the app's dark editorial palette.
 */
export function LineMovementChart({
  points,
  homeTeam,
  awayTeam,
}: {
  points: LinePoint[];
  homeTeam: string;
  awayTeam: string;
}) {
  // Format the x-axis label as "dd.MM HH:mm" in local time.
  const data = points.map((p) => {
    const d = new Date(p.t);
    const label = `${d.getDate()}.${d.getMonth() + 1} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    return { ...p, label };
  });

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: -12 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 9, fontFamily: "monospace", fill: "rgba(255,255,255,0.45)" }}
            tickLine={false}
            axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
            minTickGap={24}
          />
          <YAxis
            tick={{ fontSize: 9, fontFamily: "monospace", fill: "rgba(255,255,255,0.45)" }}
            tickLine={false}
            axisLine={false}
            width={42}
            domain={["auto", "auto"]}
            tickFormatter={(v: number) => v.toFixed(2)}
          />
          <Tooltip
            contentStyle={{
              background: "#15151a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 0,
              fontSize: 11,
              fontFamily: "monospace",
            }}
            labelStyle={{ color: "rgba(255,255,255,0.55)" }}
            formatter={(value: number, name: string) => [
              value?.toFixed(2),
              name,
            ]}
          />
          <Line
            type="monotone"
            dataKey="home"
            name={`1 ${homeTeam}`}
            stroke="hsl(var(--signal))"
            strokeWidth={1.5}
            dot={false}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="draw"
            name="X uavgjort"
            stroke="hsl(var(--amber))"
            strokeWidth={1.5}
            dot={false}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="away"
            name={`2 ${awayTeam}`}
            stroke="rgba(255,255,255,0.7)"
            strokeWidth={1.5}
            dot={false}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
