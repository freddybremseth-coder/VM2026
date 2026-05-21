"use client";

import { useEffect, useState } from "react";
import { Check, Save, Lock, MapPin } from "lucide-react";
import { TeamFlag } from "@/components/shared/TeamFlag";
import { formatKickoff, formatDateLabel } from "@/lib/utils";
import {
  GUEST_LIMIT,
  getGuestCount,
  getGuestPrediction,
  saveGuestPrediction,
} from "@/lib/guest-predictions";

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
    <form onSubmit={submit} className="card-panel p-4 relative">
      <input type="hidden" name="matchId" value={matchId} />

      <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-pitch-400 mb-3">
        <span>{stageLabel}</span>
        <span className="font-mono text-pitch-300">
          {formatDateLabel(kickoff).split(",")[0]} · {formatKickoff(kickoff)}
        </span>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <TeamSide team={home} align="right" />
        <div className="flex items-center gap-2">
          <ScoreInput value={homeScore} onChange={setHomeScore} disabled={limitReached} />
          <span className="text-pitch-600 font-mono">·</span>
          <ScoreInput value={awayScore} onChange={setAwayScore} disabled={limitReached} />
        </div>
        <TeamSide team={away} align="left" />
      </div>

      <div className="mt-4 pt-3 border-t border-pitch-700/60 flex items-center justify-between gap-3">
        <div className="min-h-[18px] text-[11px] flex items-center gap-1.5">
          {feedback?.kind === "ok" && (
            <span className="text-accent-300 flex items-center gap-1">
              <Check size={11} /> Saved as guest tip
            </span>
          )}
          {feedback?.kind === "limit" && (
            <span className="text-loss">
              You've used all {GUEST_LIMIT} guest tips — sign up to keep tipping
            </span>
          )}
          {!feedback && hasTip && (
            <span className="text-pitch-500">
              Guest tip: {homeScore}–{awayScore}
            </span>
          )}
          {!feedback && !hasTip && !limitReached && (
            <span className="text-pitch-500 flex items-center gap-1">
              <MapPin size={10} /> {venueLabel}
              <span className="ml-1 text-accent-400/80">·</span>
              <span className="text-accent-400/80">{remaining} free left</span>
            </span>
          )}
          {!feedback && limitReached && (
            <span className="text-pitch-500 flex items-center gap-1">
              <Lock size={10} /> Sign up to keep tipping
            </span>
          )}
        </div>
        <button
          type="submit"
          disabled={limitReached}
          className="flex items-center gap-1.5 rounded-md bg-accent-500 hover:bg-accent-400 disabled:bg-pitch-700 disabled:text-pitch-500 text-pitch-950 text-xs font-semibold px-3 py-1.5 transition-colors"
        >
          <Save size={12} />
          {hasTip ? "Update guest tip" : "Save as guest"}
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
      className={`flex items-center gap-2.5 min-w-0 ${
        align === "right" ? "flex-row-reverse text-right" : ""
      }`}
    >
      <TeamFlag code={team.flag} size="md" />
      <div className="min-w-0">
        <div className="font-semibold text-sm truncate">{team.name}</div>
        <div className="text-[10px] uppercase tracking-widest text-pitch-500 font-mono">
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
      className="w-14 h-12 text-center font-mono text-xl font-bold stat-num bg-pitch-900 border border-pitch-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50 disabled:opacity-50 disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      required
    />
  );
}
