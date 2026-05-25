"use client";

import { useEffect, useState } from "react";
import { Check, Save, Lock, MapPin } from "lucide-react";
import { HoloFlag } from "@/components/shared/HoloFlag";
import { teamName } from "@/lib/wc26-data";
import { formatKickoff, formatDateLabel } from "@/lib/utils";
import {
  GUEST_LIMIT,
  getGuestCount,
  getGuestPrediction,
  saveGuestPrediction,
} from "@/lib/guest-predictions";
import { suggestTip, TIP_MODE_META, type TipMode } from "@/lib/ai-tip-helper";
import { AITipBar } from "./PredictionForm";

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
}

export function GuestPredictionForm({
  matchId,
  stageLabel,
  kickoff,
  venueLabel,
  home,
  away,
}: Props) {
  const [hydrated, setHydrated] = useState(false);
  const [count, setCount] = useState(0);
  const [hasTip, setHasTip] = useState(false);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [feedback, setFeedback] = useState<
    { kind: "ok"; saved: { h: number; a: number } } | { kind: "limit" } | null
  >(null);
  const [aiHint, setAiHint] = useState<string | null>(null);

  function fillAITip(mode: TipMode) {
    const tip = suggestTip(matchId, mode);
    if (!tip) return;
    setHomeScore(tip.home);
    setAwayScore(tip.away);
    setAiHint(`${TIP_MODE_META[mode].icon} ${tip.reasoning}`);
  }

  useEffect(() => {
    setHydrated(true);
    setCount(getGuestCount());
    const existing = getGuestPrediction(matchId);
    if (existing) {
      setHasTip(true);
      setHomeScore(existing.homeScore);
      setAwayScore(existing.awayScore);
    }
  }, [matchId]);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = saveGuestPrediction(matchId, homeScore, awayScore);
    if (result.ok) {
      setHasTip(true);
      setCount(getGuestCount());
      setFeedback({ kind: "ok", saved: { h: homeScore, a: awayScore } });
    } else if (result.reason === "limit_reached") {
      setFeedback({ kind: "limit" });
    }
  }

  const limitReached = hydrated && !hasTip && count >= GUEST_LIMIT;
  const remaining = Math.max(0, GUEST_LIMIT - count);

  return (
    <form onSubmit={submit} className="surface p-4 relative">
      <input type="hidden" name="matchId" value={matchId} />

      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono uppercase tracking-kicker text-cream/55">
          {stageLabel}
        </span>
        <span className="font-mono text-[11px] text-cream/70 stat-num">
          {formatDateLabel(kickoff).split(",")[0]} · {formatKickoff(kickoff)}
        </span>
      </div>

      {/* Mobile: stacked rows so long country names fit. Desktop: 3-col grid. */}
      <div className="flex flex-col sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center gap-3 sm:gap-4">
        <TeamSide team={home} align="right" />
        <div className="flex items-center justify-center gap-2">
          <ScoreInput value={homeScore} onChange={setHomeScore} disabled={limitReached} />
          <span className="text-cream/35 font-serif italic">·</span>
          <ScoreInput value={awayScore} onChange={setAwayScore} disabled={limitReached} />
        </div>
        <TeamSide team={away} align="left" />
      </div>

      {!limitReached && <AITipBar onPick={fillAITip} hint={aiHint} />}

      <div className="mt-4 pt-3 border-t border-cream/8 flex items-center justify-between gap-3">
        <div className="min-h-[18px] text-[11px] flex items-center gap-1.5">
          {feedback?.kind === "ok" && (
            <span className="text-signal font-mono flex items-center gap-1">
              <Check size={11} /> Lagret som gjeste-tips
            </span>
          )}
          {feedback?.kind === "limit" && (
            <span className="text-loss font-mono">
              Du har brukt alle {GUEST_LIMIT} gratis tips — registrer deg for å fortsette
            </span>
          )}
          {!feedback && hasTip && (
            <span className="text-cream/55 font-mono stat-num">
              Gjeste-tips: {homeScore}–{awayScore}
            </span>
          )}
          {!feedback && !hasTip && !limitReached && (
            <span className="text-cream/55 font-mono flex items-center gap-1">
              <MapPin size={10} /> {venueLabel}
              <span className="ml-1 text-amber/80">·</span>
              <span className="text-amber/85 stat-num">{remaining} gratis igjen</span>
            </span>
          )}
          {!feedback && limitReached && (
            <span className="text-cream/55 font-mono flex items-center gap-1">
              <Lock size={10} /> Registrer deg for å fortsette
            </span>
          )}
        </div>
        <button
          type="submit"
          disabled={limitReached}
          className="flex items-center gap-1.5 bg-signal hover:bg-signalD disabled:bg-paper disabled:text-cream/35 text-cream text-xs font-semibold px-3 py-1.5 transition-colors"
        >
          <Save size={12} />
          {hasTip ? "Oppdater" : "Lagre"}
        </button>
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
  return (
    <div
      className={
        "flex items-center gap-2.5 min-w-0" +
        (align === "right" ? " sm:flex-row-reverse sm:text-right" : "")
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

function ScoreInput({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <input
      type="number"
      min={0}
      max={20}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(Number(e.currentTarget.value || 0))}
      onFocus={(e) => e.currentTarget.select()}
      onClick={(e) => e.currentTarget.select()}
      className="w-14 h-12 text-center font-serif text-2xl font-semibold stat-num text-cream bg-canvas border border-cream/8 focus:outline-none focus:border-signal/50 disabled:opacity-50 disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      required
    />
  );
}
