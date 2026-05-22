"use client";

import { useState } from "react";
import { ChevronDown, Cpu, Info, Zap, Sparkles } from "lucide-react";

// Detect at runtime whether Claude is configured on this deployment.
const CLAUDE_ACTIVE = !!(
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_CLAUDE_ACTIVE === "1"
);

/**
 * Expandable "Why these odds?" card. Sits at the bottom of any page that
 * shows a model recommendation (match center, bracket coach, banter).
 * Building trust beats hiding the implementation.
 */
export function ModelExplainer() {
  const [open, setOpen] = useState(false);
  return (
    <div className="card-panel">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 sm:px-5 py-3 text-left"
      >
        <div className="h-8 w-8 rounded-md bg-data-500/15 flex items-center justify-center shrink-0">
          <Cpu size={14} className="text-data-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold">Hvorfor disse oddsa?</div>
          <div className="text-[10px] uppercase tracking-widest text-pitch-400 font-mono">
            Modell: wcf-baseline-v0.1 · ChatGenius
          </div>
        </div>
        {CLAUDE_ACTIVE ? (
          <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest bg-win/10 text-win px-2 py-1 rounded-md shrink-0">
            <Zap size={10} /> Claude live
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest bg-pitch-800 text-pitch-500 px-2 py-1 rounded-md shrink-0">
            <Sparkles size={10} /> Mal-modus
          </span>
        )}
        <ChevronDown
          size={16}
          className={`text-pitch-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 text-sm text-pitch-200 leading-relaxed space-y-3 border-t border-pitch-700/60">
          <p>
            <span className="text-data-300 font-semibold">What the model does.</span>{" "}
            Takes each team's published FIFA ranking and turns the gap between them into a win-probability skew (45 % base when ranks are equal, +1.2 percentage points per rank position up to a 78/15/7 cap).
          </p>
          <p>
            <span className="text-data-300 font-semibold">What it sees.</span>{" "}
            FIFA rank · tournament stage · preferred formations · each team's top scorer with caps/goals from the official-or-preliminary 26-man squad.
          </p>
          <p>
            <span className="text-data-300 font-semibold">What it doesn't see (yet).</span>{" "}
            Injuries, suspensions, weather, fatigue/travel, line-up changes, head-to-head bias, market odds, and any live event data. These come in v0.2.
          </p>
          <p>
            <span className="text-data-300 font-semibold">Calibration tracker.</span>{" "}
            Once group games start we'll surface the model's hit rate here. The target: when v0.1 says 60 %, it should actually win about 60 % of those matches.
          </p>
          <div className="flex items-start gap-2 pt-2 mt-2 border-t border-pitch-700/60 text-[11px] text-pitch-400">
            <Info size={12} className="shrink-0 mt-0.5" />
            <p>
              Set <code className="px-1 rounded bg-pitch-800 text-pitch-200 font-mono text-[10px]">ANTHROPIC_API_KEY</code> on Vercel to upgrade the preview/coach copy to Claude Sonnet 4.5. The underlying probability math stays the same — Claude just writes the explanation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
