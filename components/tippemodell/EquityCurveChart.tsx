"use client";

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

/**
 * Bankroll-over-time curve for the paper-trading auto-pilot. One point per
 * settled bet (plus the starting point), x = bet number. A reference line
 * marks the starting bankroll so break-even is obvious at a glance.
 */
export function EquityCurveChart({
  curve,
  starting,
}: {
  curve: Array<{ t: string; bankroll: number; label: string }>;
  starting: number;
}) {
  const data = curve.map((p, i) => ({ n: i, bankroll: p.bankroll, label: p.label }));
  const last = data.at(-1)?.bankroll ?? starting;
  const up = last >= starting;
  const color = up ? "hsl(var(--win))" : "hsl(var(--loss))";

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: -8 }}>
          <defs>
            <linearGradient id="eq" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis
            dataKey="n"
            tick={{ fontSize: 9, fontFamily: "monospace", fill: "rgba(255,255,255,0.45)" }}
            tickLine={false}
            axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
            label={{
              value: "antall avgjorte spill",
              position: "insideBottom",
              offset: -2,
              fontSize: 9,
              fontFamily: "monospace",
              fill: "rgba(255,255,255,0.35)",
            }}
          />
          <YAxis
            tick={{ fontSize: 9, fontFamily: "monospace", fill: "rgba(255,255,255,0.45)" }}
            tickLine={false}
            axisLine={false}
            width={48}
            domain={["auto", "auto"]}
            tickFormatter={(v: number) => `${Math.round(v)}`}
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
            labelFormatter={(n: number) => (n === 0 ? "Start" : `Etter spill ${n}`)}
            formatter={(v: number) => [`${v.toFixed(0)} kr`, "Bankroll"]}
          />
          <ReferenceLine
            y={starting}
            stroke="rgba(255,255,255,0.25)"
            strokeDasharray="3 3"
          />
          <Area
            type="monotone"
            dataKey="bankroll"
            stroke={color}
            strokeWidth={1.5}
            fill="url(#eq)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
