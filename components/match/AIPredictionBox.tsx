import { Cpu, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AIPrediction, MatchDetail } from "@/lib/types";

interface Props {
  prediction: AIPrediction;
  home: MatchDetail["teams"]["home"];
  away: MatchDetail["teams"]["away"];
}

export function AIPredictionBox({ prediction, home, away }: Props) {
  const { probabilities, expectedFinalScore, btts, over25, topFactors, model, asOfMinute } = prediction;
  const homePct = Math.round(probabilities.home * 100);
  const drawPct = Math.round(probabilities.draw * 100);
  const awayPct = Math.round(probabilities.away * 100);
  const favoured: "home" | "draw" | "away" =
    homePct >= drawPct && homePct >= awayPct
      ? "home"
      : awayPct >= drawPct
        ? "away"
        : "draw";

  return (
    <div className="card-panel p-5 ring-1 ring-accent-500/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-accent-500/15 flex items-center justify-center">
            <Cpu size={14} className="text-accent-400" />
          </div>
          <div>
            <div className="text-xs font-semibold">AI Prediction</div>
            <div className="text-[10px] uppercase tracking-widest text-pitch-500 font-mono">
              {model} · @ {asOfMinute}'
            </div>
          </div>
        </div>
        <Sparkles size={14} className="text-accent-400" />
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <ProbCell label={home.shortName} pct={homePct} highlight={favoured === "home"} tone="accent" />
        <ProbCell label="Draw" pct={drawPct} highlight={favoured === "draw"} tone="draw" />
        <ProbCell label={away.shortName} pct={awayPct} highlight={favoured === "away"} tone="data" />
      </div>

      <div className="flex h-2 rounded-full overflow-hidden bg-pitch-900 mb-5">
        <div className="bg-accent-500" style={{ width: `${homePct}%` }} />
        <div className="bg-draw" style={{ width: `${drawPct}%` }} />
        <div className="bg-data-500" style={{ width: `${awayPct}%` }} />
      </div>

      <div className="grid grid-cols-3 gap-2 pb-4 border-b border-pitch-700/60">
        <Mini label="Expected final" value={`${expectedFinalScore.home.toFixed(1)}–${expectedFinalScore.away.toFixed(1)}`} />
        <Mini label="BTTS" value={`${Math.round(btts * 100)}%`} />
        <Mini label="Over 2.5" value={`${Math.round(over25 * 100)}%`} />
      </div>

      <div className="mt-4">
        <div className="text-[10px] uppercase tracking-widest text-pitch-400 mb-2">
          Top factors
        </div>
        <ul className="space-y-1.5">
          {topFactors.map((f, i) => (
            <li key={i} className="text-xs text-pitch-200 leading-snug flex gap-2">
              <span className="text-accent-400 font-mono shrink-0">›</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ProbCell({
  label,
  pct,
  highlight,
  tone,
}: {
  label: string;
  pct: number;
  highlight: boolean;
  tone: "accent" | "draw" | "data";
}) {
  const tones = {
    accent: { bg: "bg-accent-500/15", ring: "ring-accent-500/40", text: "text-accent-300" },
    draw: { bg: "bg-draw/15", ring: "ring-draw/40", text: "text-draw" },
    data: { bg: "bg-data-500/15", ring: "ring-data-500/40", text: "text-data-300" },
  }[tone];
  return (
    <div
      className={cn(
        "rounded-md px-2 py-2 text-center transition-all",
        highlight ? `${tones.bg} ring-1 ${tones.ring}` : "bg-pitch-800/60",
      )}
    >
      <div className="text-[10px] uppercase tracking-widest text-pitch-400">{label}</div>
      <div
        className={cn(
          "font-mono text-xl font-bold stat-num mt-0.5",
          highlight ? tones.text : "text-pitch-200",
        )}
      >
        {pct}%
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-[10px] uppercase tracking-widest text-pitch-500">{label}</div>
      <div className="font-mono font-semibold stat-num text-sm mt-0.5">{value}</div>
    </div>
  );
}
