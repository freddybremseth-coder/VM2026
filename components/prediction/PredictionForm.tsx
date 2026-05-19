"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Check, Save } from "lucide-react";
import { TeamFlag } from "@/components/shared/TeamFlag";
import { formatKickoff } from "@/lib/utils";
import {
  savePredictionAction,
  type PredictionResult,
} from "@/app/(app)/predictions/actions";
import type { MatchSummary } from "@/lib/types";

interface Props {
  match: MatchSummary;
  existing?: { home_score: number; away_score: number };
}

export function PredictionForm({ match, existing }: Props) {
  const [state, formAction] = useFormState<PredictionResult, FormData>(
    savePredictionAction,
    {},
  );

  return (
    <form action={formAction} className="card-panel p-4">
      <input type="hidden" name="matchId" value={match.id} />

      <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-pitch-400 mb-3">
        <span>{match.stage}</span>
        <span className="font-mono text-pitch-300">
          {formatKickoff(match.kickoff)} · {match.venue.city}
        </span>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <TeamSide team={match.home} align="right" />
        <div className="flex items-center gap-2">
          <ScoreInput name="homeScore" defaultValue={existing?.home_score ?? 0} />
          <span className="text-pitch-600 font-mono">·</span>
          <ScoreInput name="awayScore" defaultValue={existing?.away_score ?? 0} />
        </div>
        <TeamSide team={match.away} align="left" />
      </div>

      <div className="mt-4 pt-3 border-t border-pitch-700/60 flex items-center justify-between gap-3">
        <div className="min-h-[18px] text-[11px]">
          {state.error && <span className="text-loss">{state.error}</span>}
          {state.ok && (
            <span className="text-accent-300 flex items-center gap-1">
              <Check size={11} /> Saved
            </span>
          )}
          {!state.error && !state.ok && existing && (
            <span className="text-pitch-500">
              Last saved: {existing.home_score}–{existing.away_score}
            </span>
          )}
        </div>
        <SubmitButton hasExisting={!!existing} />
      </div>
    </form>
  );
}

function TeamSide({
  team,
  align,
}: {
  team: MatchSummary["home"];
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

function ScoreInput({ name, defaultValue }: { name: string; defaultValue: number }) {
  return (
    <input
      type="number"
      name={name}
      min={0}
      max={20}
      defaultValue={defaultValue}
      className="w-14 h-12 text-center font-mono text-xl font-bold stat-num bg-pitch-900 border border-pitch-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      required
    />
  );
}

function SubmitButton({ hasExisting }: { hasExisting: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-1.5 rounded-md bg-accent-500 hover:bg-accent-400 disabled:bg-pitch-700 disabled:text-pitch-500 text-pitch-950 text-xs font-semibold px-3 py-1.5 transition-colors"
    >
      <Save size={12} />
      {pending ? "Saving…" : hasExisting ? "Update tip" : "Save tip"}
    </button>
  );
}
