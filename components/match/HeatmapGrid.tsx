"use client";

/**
 * HeatmapGrid — renders a player's 8×12 touch-density grid as a coloured SVG.
 *
 * The grid is laid out over a simplified pitch outline.
 * Hot cells (high density) are rendered in the team's accent colour.
 * Cold cells fade to transparent so the pitch shows through.
 */

import type { PlayerHeatmap } from "@/lib/match-events/types";

interface Props {
  heatmap: PlayerHeatmap;
  /** CSS colour for the hot end of the gradient, e.g. "hsl(var(--accent-500))" */
  hotColor: string;
}

const ROWS = 8;
const COLS = 12;
const CELL_W = 500 / COLS;    // SVG units per column
const CELL_H = 340 / ROWS;    // SVG units per row
const SVG_W = 500;
const SVG_H = 340;

// Simple pitch markings (full pitch, top-down)
function FullPitchMarkings() {
  const s = "hsl(var(--pitch-700))";
  const sw = "1";
  const W = SVG_W, H = SVG_H;
  // Halfway line
  const midX = W / 2;
  // Centre circle radius
  const cr = H * 0.12;
  // 18-yd box (each end)
  const boxH = H * 0.594;  // ~40.32 / 68m
  const boxYt = (H - boxH) / 2;
  const boxW = W * 0.165;  // 16.5 / 100m
  // 6-yd box
  const sBoxH = H * 0.235;
  const sBoxYt = (H - sBoxH) / 2;
  const sBoxW = W * 0.066;
  // Goal mouths
  const goalH = H * 0.12;
  const goalYt = (H - goalH) / 2;
  const goalDepth = 12;

  return (
    <g>
      {/* Pitch outline */}
      <rect x={0} y={0} width={W} height={H} fill="none" stroke={s} strokeWidth={sw} />
      {/* Halfway line */}
      <line x1={midX} y1={0} x2={midX} y2={H} stroke={s} strokeWidth={sw} />
      {/* Centre circle */}
      <circle cx={midX} cy={H / 2} r={cr} fill="none" stroke={s} strokeWidth={sw} />
      <circle cx={midX} cy={H / 2} r={2} fill={s} />
      {/* Left 18-yd box */}
      <rect x={0} y={boxYt} width={boxW} height={boxH} fill="none" stroke={s} strokeWidth={sw} />
      {/* Right 18-yd box */}
      <rect x={W - boxW} y={boxYt} width={boxW} height={boxH} fill="none" stroke={s} strokeWidth={sw} />
      {/* Left 6-yd box */}
      <rect x={0} y={sBoxYt} width={sBoxW} height={sBoxH} fill="none" stroke={s} strokeWidth={sw} />
      {/* Right 6-yd box */}
      <rect x={W - sBoxW} y={sBoxYt} width={sBoxW} height={sBoxH} fill="none" stroke={s} strokeWidth={sw} />
      {/* Left goal */}
      <rect x={-goalDepth} y={goalYt} width={goalDepth} height={goalH} fill="none" stroke={s} strokeWidth={sw} />
      {/* Right goal */}
      <rect x={W} y={goalYt} width={goalDepth} height={goalH} fill="none" stroke={s} strokeWidth={sw} />
      {/* Left penalty spot */}
      <circle cx={W * 0.11} cy={H / 2} r={2} fill={s} />
      {/* Right penalty spot */}
      <circle cx={W * 0.89} cy={H / 2} r={2} fill={s} />
    </g>
  );
}

export function HeatmapGrid({ heatmap, hotColor }: Props) {
  const { grid, playerName, touches } = heatmap;

  return (
    <div className="card-panel p-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-pitch-400 mb-0.5">
            Touch heatmap
          </div>
          <span className="text-sm font-semibold">{playerName}</span>
          <span className="text-xs text-pitch-400 ml-2">{touches} touches</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-12 rounded-sm" style={{
            background: `linear-gradient(to right, transparent, ${hotColor})`,
          }} />
          <span className="text-[10px] text-pitch-500">density</span>
        </div>
      </div>

      <svg
        viewBox={`-14 0 ${SVG_W + 28} ${SVG_H}`}
        className="w-full h-auto"
        style={{ maxHeight: 220 }}
        aria-label={`Touch heatmap for ${playerName}`}
      >
        {/* Background */}
        <rect x={-14} y={0} width={SVG_W + 28} height={SVG_H} fill="hsl(var(--pitch-900))" rx={4} />

        {/* Heatmap cells (render before pitch lines so lines show through) */}
        {grid.map((row, ri) =>
          row.map((val, ci) => {
            if (val < 0.05) return null; // skip near-empty cells for perf
            return (
              <rect
                key={`${ri}-${ci}`}
                x={ci * CELL_W}
                y={ri * CELL_H}
                width={CELL_W}
                height={CELL_H}
                fill={hotColor}
                fillOpacity={val * 0.75}
              />
            );
          })
        )}

        {/* Pitch markings on top */}
        <FullPitchMarkings />
      </svg>
    </div>
  );
}
