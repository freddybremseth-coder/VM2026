"use client";

import * as React from "react";
import { useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { Check, Save, MapPin, Cpu, Share2 } from "lucide-react";
import { HoloFlag } from "@/components/shared/HoloFlag";
import { teamName } from "@/lib/wc26-data";
import { formatKickoff, formatDateLabel } from "@/lib/utils";
import {
  savePredictionAction,
  type PredictionResult,
} from "@/app/(app)/predictions/actions";
import { suggestTip, TIP_MODE_META, type TipMode } from "@/lib/ai-tip-helper";

interface TeamRef {
  id: number;
  name: string;
  shortName: string;
  flag: string;
}

interface Props {
  matchId: number;
  stageLabel: string;
  kickoff: string;
  venueLabel: string;
  home: TeamRef;
  away: TeamRef;
  existing?: { home_score: number; away_score: number };
}

export function PredictionForm({
  matchId,
  stageLabel,
  kickoff,
  venueLabel,
  home,
  away,
  existing,
}: Props) {
  const [state, formAction] = useFormState<PredictionResult, FormData>(
    savePredictionAction,
    {},
  );
  const homeRef = useRef<HTMLInputElement>(null);
  const awayRef = useRef<HTMLInputElement>(null);
  const [aiHint, setAiHint] = useState<string | null>(null);

  function fillAITip(mode: TipMode) {
    const tip = suggestTip(matchId, mode);
    if (!tip || !homeRef.current || !awayRef.current) return;
    homeRef.current.value = String(tip.home);
    awayRef.current.value = String(tip.away);
    setAiHint(`${TIP_MODE_META[mode].icon} ${tip.reasoning}`);
  }

  return (
    <form action={formAction} className="surface p-4">
      <input type="hidden" name="matchId" value={matchId} />

      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono uppercase tracking-kicker text-cream/55">
          {stageLabel}
        </span>
        <span className="font-mono text-[11px] text-cream/70 stat-num">
          {formatDateLabel(kickoff).split(",")[0]} · {formatKickoff(kickoff)}
        </span>
      </div>

      {/* Mobile: stacked rows (home / score / away) so long country names fit.
          Desktop (sm+): 3-col grid keeps the compact horizontal form. */}
      <div className="flex flex-col sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center gap-3 sm:gap-4">
        <TeamSide team={home} align="right" />
        <div className="flex items-center justify-center gap-2">
          <ScoreInput ref={homeRef} name="homeScore" defaultValue={existing?.home_score ?? 0} />
          <span className="text-cream/35 font-serif italic">·</span>
          <ScoreInput ref={awayRef} name="awayScore" defaultValue={existing?.away_score ?? 0} />
        </div>
        <TeamSide team={away} align="left" />
      </div>

      <AITipBar onPick={fillAITip} hint={aiHint} />

      <div className="mt-4 pt-3 border-t border-cream/8 flex items-center justify-between gap-3">
        <div className="min-h-[18px] text-[11px] flex items-center gap-1.5">
          {state.error && <span className="text-loss font-mono">{state.error}</span>}
          {state.ok && (
            <span className="text-signal font-mono flex items-center gap-1">
              <Check size={11} /> Lagret
            </span>
          )}
          {!state.error && !state.ok && existing && (
            <span className="text-cream/55 font-mono stat-num">
              Lagret: {existing.home_score}–{existing.away_score}
            </span>
          )}
          {!state.error && !state.ok && !existing && (
            <span className="text-cream/55 font-mono flex items-center gap-1">
              <MapPin size={10} /> {venueLabel}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {existing && (
            <Link
              href={`/share/tip/${matchId}/${existing.home_score}-${existing.away_score}`}
              className="bg-paper hover:bg-paperHi border border-cream/8 text-cream/85 text-xs font-semibold px-2.5 py-1.5 transition-colors flex items-center gap-1.5"
              aria-label="Del mitt tips"
            >
              <Share2 size={12} />
              <span className="hidden sm:inline">Del</span>
            </Link>
          )}
          <SubmitButton hasExisting={!!existing} />
        </div>
      </div>
    </form>
  );
}

function TeamSide({
  team,
  align,
}: {
  team: TeamRef;
  align: "left" | "right";
}) {
  // On mobile: always left-anchored (flag → name), full width.
  // On desktop: home pinned right (flag flips to the right of the name).
  return (
    <div
      className={
        "flex items-center gap-2.5 min-w-0" +
        (align === "right"
          ? " sm:flex-row-reverse sm:text-right"
          : "")
      }
    >
      <HoloFlag code={team.flag} w={22} radius={2} />
      <div className="min-w-0 flex-1 sm:flex-initial">
        <div className="font-serif text-sm font-semibold tracking-editorial text-cream truncate">
          {teamName(team)}
        </div>
        <div className="text-[10px] uppercase tracking-kicker text-cream/45 font-mono">
          {team.shortName}
        </div>
      </div>
    </div>
  );
}

const ScoreInput = React.forwardRef<
  HTMLInputElement,
  { name: string; defaultValue: number }
>(function ScoreInput({ name, defaultValue }, ref) {
  return (
    <input
      ref={ref}
      type="number"
      name={name}
      min={0}
      max={20}
      defaultValue={defaultValue}
      // Select the existing value on focus so typing replaces it (otherwise
      // typing "2" into a field showing "0" produces "20").
      onFocus={(e) => e.currentTarget.select()}
      onClick={(e) => e.currentTarget.select()}
      className="w-14 h-12 text-center font-serif text-2xl font-semibold stat-num text-cream bg-canvas border border-cream/8 focus:outline-none focus:border-signal/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      required
    />
  );
});

/**
 * Three "AI tip" chip buttons + the most recent reasoning line. Filling tips
 * is a pure DOM write so the form's existing default-value flow stays intact.
 */
export function AITipBar({
  onPick,
  hint,
}: {
  onPick: (mode: TipMode) => void;
  hint: string | null;
}) {
  return (
    <div className="mt-3 pt-3 border-t border-cream/8">
      <div className="flex items-center gap-2 mb-1.5">
        <Cpu size={11} className="text-amber" />
        <span className="text-[10px] uppercase tracking-kicker text-cream/55 font-mono">
          AI tippehjelp
        </span>
        <div className="flex gap-1 ml-auto">
          {(Object.keys(TIP_MODE_META) as TipMode[]).map((m) => {
            const meta = TIP_MODE_META[m];
            return (
              <button
                key={m}
                type="button"
                onClick={() => onPick(m)}
                className={`flex items-center gap-1 px-2 py-1 text-[10px] uppercase tracking-kicker font-mono font-semibold ring-1 ${meta.tone} hover:brightness-125 transition`}
              >
                <span>{meta.icon}</span>
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>
      {hint && (
        <div className="text-[11px] text-cream/70 italic font-serif">{hint}</div>
      )}
    </div>
  );
}

function SubmitButton({ hasExisting }: { hasExisting: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-1.5 bg-signal hover:bg-signalD disabled:bg-paper disabled:text-cream/35 text-cream text-xs font-semibold px-3 py-1.5 transition-colors"
    >
      <Save size={12} />
      {pending ? "Lagrer…" : hasExisting ? "Oppdater" : "Lagre tips"}
    </button>
  );
}
