"use client";

/**
 * ShotMap — SVG half-pitch showing every shot as a circle.
 *
 * Layout: 0-100 coord system (Opta).
 *   x: 0 (own goal) → 100 (opponent goal). We only render x > 50 (attack half).
 *   y: 0 (right touchline) → 100 (left touchline).
 *
 * Each shot is a circle whose radius scales with √xg, filled by outcome colour.
 */

import type { ShotEvent } from "@/lib/match-events/types";

interface Props {
  shots: ShotEvent[];
  side: "home" | "away";
  teamShort: string;
  /** Accent colour token — CSS var string like "hsl(var(--accent-500))" */
  color: string;
}

const OUTCOME_FILL: Record<ShotEvent["outcome"], string> = {
  goal:        "hsl(var(--win))",
  saved:       "hsl(var(--accent-500))",
  blocked:     "hsl(var(--pitch-500))",
  "off-target": "hsl(var(--pitch-600))",
  post:        "hsl(var(--draw))",
  "own-goal":  "hsl(var(--loss))",
};

const OUTCOME_STROKE: Record<ShotEvent["outcome"], string> = {
  goal:        "hsl(var(--win))",
  saved:       "hsl(var(--accent-400))",
  blocked:     "hsl(var(--pitch-400))",
  "off-target": "hsl(var(--pitch-500))",
  post:        "hsl(var(--draw))",
  "own-goal":  "hsl(var(--loss))",
};

// Pitch drawing constants (viewBox coordinates)
const VB_W = 500;   // viewBox width
const VB_H = 380;   // viewBox height
// We show only the attacking half (x 50–100) from each team's POV.
// Map pitch coords to SVG:
//   pitch x 50→100  ↦  svg x 0→VB_W
//   pitch y 0→100   ↦  svg y 0→VB_H (y is flipped: 0=right → left, in SVG top=left-touchline)

function px(pitchX: number) {
  return ((pitchX - 50) / 50) * VB_W;
}
function py(pitchY: number) {
  return (pitchY / 100) * VB_H;
}
function radius(xg: number) {
  // √xg scaled — min 6, max 24
  return Math.min(24, Math.max(6, Math.sqrt(xg) * 52));
}

// ---------------------------------------------------------------------------
// Pitch markings (attacking half)
// ---------------------------------------------------------------------------
function PitchMarkings() {
  // Goal line is at SVG x=VB_W (right edge)
  // Centre circle boundary is at SVG x=0
  const GL = VB_W; // goal line x
  const MID = 0;   // halfway line x
  // 18-yard box: width ≈ 16.5m/100m*VB_W = 82.5px. Height ≈ 40.32/68*VB_H ≈ 225px
  const BOX_X = GL - 165;  // box starts ~33% from goal
  const BOX_YT = py(21);   // top of 18-yd box
  const BOX_YB = py(79);   // bottom of 18-yd box
  const SBOX_X = GL - 68;
  const SBOX_YT = py(36.8);
  const SBOX_YB = py(63.2);
  // Penalty spot at 11m from goal ≈ 11% * VB_W from goal
  const PEN_X = GL - 110;
  const PEN_Y = py(50);
  // Goal mouth
  const GOAL_YT = py(44);
  const GOAL_YB = py(56);
  const GOAL_DEPTH = 20;

  const stroke = "hsl(var(--pitch-700))";
  const sw = "1.5";

  return (
    <g>
      {/* Pitch outline (left/top/bottom only — goal line on right) */}
      <line x1={MID} y1={0} x2={MID} y2={VB_H} stroke={stroke} strokeWidth={sw} />
      <line x1={MID} y1={0} x2={GL} y2={0} stroke={stroke} strokeWidth={sw} />
      <line x1={MID} y1={VB_H} x2={GL} y2={VB_H} stroke={stroke} strokeWidth={sw} />
      {/* Goal line */}
      <line x1={GL} y1={0} x2={GL} y2={VB_H} stroke={stroke} strokeWidth={sw} />
      {/* 18-yard box */}
      <rect x={BOX_X} y={BOX_YT} width={GL - BOX_X} height={BOX_YB - BOX_YT} fill="none" stroke={stroke} strokeWidth={sw} />
      {/* 6-yard box */}
      <rect x={SBOX_X} y={SBOX_YT} width={GL - SBOX_X} height={SBOX_YB - SBOX_YT} fill="none" stroke={stroke} strokeWidth={sw} />
      {/* Penalty spot */}
      <circle cx={PEN_X} cy={PEN_Y} r={3} fill={stroke} />
      {/* Goal mouth */}
      <rect x={GL} y={GOAL_YT} width={GOAL_DEPTH} height={GOAL_YB - GOAL_YT} fill="none" stroke={stroke} strokeWidth={sw} />
      {/* Centre arc (partial) */}
      <path
        d={`M ${MID} ${py(25)} A ${VB_H * 0.25} ${VB_H * 0.25} 0 0 1 ${MID} ${py(75)}`}
        fill="none" stroke={stroke} strokeWidth={sw}
      />
    </g>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function ShotMap({ shots, side, teamShort, color }: Props) {
  // Filter to this side's shots only, in the attacking half (x ≥ 50)
  const myShots = shots.filter((s) => s.side === side && s.x >= 50);
  const goals = myShots.filter((s) => s.outcome === "goal" || s.outcome === "own-goal");

  // Sort by xg ascending so high-xg shots render on top
  const sorted = [...myShots].sort((a, b) => a.xg - b.xg);

  return (
    <div className="card-panel p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-pitch-400 mb-0.5">Shot map</div>
          <span className="text-sm font-semibold">{teamShort}</span>
          <span className="text-xs text-pitch-400 ml-2">
            {myShots.length} shots · {goals.length} goals
          </span>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {(["goal", "saved", "blocked", "off-target", "post"] as const).map((o) => (
            <LegendItem key={o} outcome={o} />
          ))}
        </div>
      </div>

      <svg
        viewBox={`0 0 ${VB_W + 30} ${VB_H}`}
        className="w-full h-auto"
        style={{ maxHeight: 300 }}
        aria-label={`Shot map for ${teamShort}`}
      >
        {/* Pitch fill */}
        <rect x={0} y={0} width={VB_W + 30} height={VB_H} fill="hsl(var(--pitch-900))" rx={4} />

        <PitchMarkings />

        {sorted.map((s) => {
          const cx = px(s.x);
          const cy = py(s.y);
          const r = radius(s.xg);
          const fill = OUTCOME_FILL[s.outcome];
          const stroke = OUTCOME_STROKE[s.outcome];
          const isGoal = s.outcome === "goal" || s.outcome === "own-goal";
          return (
            <g key={s.id}>
              <title>{`${s.playerName} ${s.minute}' — xG ${s.xg.toFixed(2)} — ${s.outcome}`}</title>
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill={fill}
                fillOpacity={isGoal ? 0.9 : 0.5}
                stroke={stroke}
                strokeWidth={isGoal ? 2 : 1}
              />
              {isGoal && (
                <text
                  x={cx}
                  y={cy + 4}
                  textAnchor="middle"
                  fontSize={10}
                  fill="hsl(var(--pitch-950))"
                  fontWeight="bold"
                  fontFamily="var(--font-mono)"
                >
                  ⚽
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <p className="mt-2 text-[11px] text-pitch-500">
        Circle size ∝ xG. Attacking towards the right.
      </p>
    </div>
  );
}

function LegendItem({ outcome }: { outcome: ShotEvent["outcome"] }) {
  const labels: Record<string, string> = {
    goal: "Goal",
    saved: "Saved",
    blocked: "Blocked",
    "off-target": "Off target",
    post: "Post",
    "own-goal": "Own goal",
  };
  return (
    <div className="flex items-center gap-1">
      <span
        className="h-2.5 w-2.5 rounded-full border"
        style={{
          background: OUTCOME_FILL[outcome],
          borderColor: OUTCOME_STROKE[outcome],
          opacity: 0.85,
        }}
      />
      <span className="text-[10px] text-pitch-400">{labels[outcome]}</span>
    </div>
  );
}
