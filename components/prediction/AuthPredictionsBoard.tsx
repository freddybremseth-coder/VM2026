"use client";

import * as React from "react";
import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Check, Save, MapPin, Calendar, Share2, Cpu, Lock } from "lucide-react";
import { HoloFlag } from "@/components/shared/HoloFlag";
import { formatKickoff, formatDateLabel } from "@/lib/utils";
import { suggestTip, TIP_MODE_META, type TipMode } from "@/lib/ai-tip-helper";
import {
  savePredictionsBatchAction,
  type BatchPredictionResult,
} from "@/app/(app)/predictions/actions";

export interface BoardTeam {
  id: number;
  name: string;
  shortName: string;
  flag: string;
}

export interface BoardFixture {
  matchId: number;
  stageLabel: string;
  kickoff: string;
  venueLabel: string;
  /** True once kickoff has passed — card renders read-only. */
  locked: boolean;
  home: BoardTeam;
  away: BoardTeam;
  existing?: { home: number; away: number };
}

export interface BoardDay {
  day: string;
  fixtures: BoardFixture[];
}

type Score = { home: number; away: number };

/**
 * Authenticated predictions board with a sticky "Lagre alle" bar.
 *
 * All score inputs report up into a single draft store. The floating bar
 * at the bottom shows how many tips are unsaved and saves them in ONE
 * round-trip — so filling in dozens of matches no longer means dozens of
 * clicks. Per-card save is gone; the bar is the single commit point.
 */
export function AuthPredictionsBoard({
  days,
  modelTips = {},
}: {
  days: BoardDay[];
  /** Freddy's model-optimal scoreline per matchId (same engine as the bot). */
  modelTips?: Record<number, { home: number; away: number }>;
}) {
  // Server truth, seeded from existing predictions.
  const [saved, setSaved] = useState<Record<number, Score>>(() => {
    const seed: Record<number, Score> = {};
    for (const d of days) {
      for (const f of d.fixtures) {
        if (f.existing) seed[f.matchId] = { ...f.existing };
      }
    }
    return seed;
  });
  // User edits not yet persisted (only matches the user touched).
  const [draft, setDraft] = useState<Record<number, Score>>({});
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  const dirtyIds = useMemo(() => {
    const ids: number[] = [];
    for (const [idStr, val] of Object.entries(draft)) {
      const id = Number(idStr);
      const s = saved[id];
      if (!s || s.home !== val.home || s.away !== val.away) ids.push(id);
    }
    return ids;
  }, [draft, saved]);

  // Warn before leaving the page with unsaved edits — saving is manual now,
  // so this stops the user losing a session's worth of tips.
  useEffect(() => {
    if (dirtyIds.length === 0) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirtyIds.length]);

  function valueFor(matchId: number): Score {
    return draft[matchId] ?? saved[matchId] ?? { home: 0, away: 0 };
  }

  function setScore(matchId: number, side: "home" | "away", n: number) {
    setFeedback(null);
    setDraft((prev) => {
      const base = prev[matchId] ?? saved[matchId] ?? { home: 0, away: 0 };
      return { ...prev, [matchId]: { ...base, [side]: n } };
    });
  }

  function applyAITip(matchId: number, mode: TipMode) {
    const tip = suggestTip(matchId, mode);
    if (!tip) return;
    setFeedback(null);
    setDraft((prev) => ({ ...prev, [matchId]: { home: tip.home, away: tip.away } }));
  }

  function applyModelTip(matchId: number) {
    const tip = modelTips[matchId];
    if (!tip) return;
    setFeedback(null);
    setDraft((prev) => ({ ...prev, [matchId]: { home: tip.home, away: tip.away } }));
  }

  function saveAll() {
    if (dirtyIds.length === 0) return;
    const entries = dirtyIds.map((id) => {
      const v = valueFor(id);
      return { matchId: id, homeScore: v.home, awayScore: v.away };
    });
    startTransition(async () => {
      const res: BatchPredictionResult = await savePredictionsBatchAction(entries);
      if (res.error) {
        setFeedback(res.error);
        return;
      }
      // Commit drafts into saved truth.
      setSaved((prev) => {
        const next = { ...prev };
        for (const id of dirtyIds) next[id] = valueFor(id);
        return next;
      });
      setDraft({});
      setFeedback(
        `Lagret ${res.saved ?? entries.length} tips${
          res.skipped ? ` · ${res.skipped} hoppet over (låst)` : ""
        }`,
      );
    });
  }

  return (
    <>
      <div className="space-y-8 pb-24">
        {days.map((d) => (
          <div key={d.day}>
            <div className="sticky top-[57px] z-10 bg-canvas/85 backdrop-blur py-2 mb-3 flex items-center gap-3 border-b border-cream/8">
              <Calendar size={11} className="text-signal" />
              <span className="text-[10px] uppercase tracking-kicker font-semibold text-cream font-mono">
                {formatDateLabel(d.day + "T12:00:00Z")}
              </span>
              <span className="text-[10px] font-mono text-cream/45 stat-num">
                {d.fixtures.length} {d.fixtures.length === 1 ? "kamp" : "kamper"}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {d.fixtures.map((f) =>
                f.locked ? (
                  <LockedRow
                    key={f.matchId}
                    fixture={f}
                    savedValue={saved[f.matchId]}
                  />
                ) : (
                  <PredictionRow
                    key={f.matchId}
                    fixture={f}
                    value={valueFor(f.matchId)}
                    savedValue={saved[f.matchId]}
                    isDirty={dirtyIds.includes(f.matchId)}
                    modelTip={modelTips[f.matchId]}
                    onScore={(side, n) => setScore(f.matchId, side, n)}
                    onAITip={(mode) => applyAITip(f.matchId, mode)}
                    onModelTip={() => applyModelTip(f.matchId)}
                  />
                ),
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Sticky save-all bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 lg:pl-60 pointer-events-none">
        <div className="px-4 sm:px-6 md:px-10 pb-4 pt-8 bg-gradient-to-t from-canvas via-canvas/90 to-transparent">
          <div className="max-w-[1100px] mx-auto pointer-events-auto">
            <div className="surface px-4 py-3 flex items-center gap-3 shadow-lg shadow-black/30">
              <div className="flex-1 min-w-0 text-[11px] font-mono">
                {feedback ? (
                  <span className="text-signal flex items-center gap-1.5">
                    <Check size={12} /> {feedback}
                  </span>
                ) : dirtyIds.length > 0 ? (
                  <span className="text-cream/70">
                    <span className="text-amber font-semibold stat-num">
                      {dirtyIds.length}
                    </span>{" "}
                    {dirtyIds.length === 1 ? "tips" : "tips"} ikke lagret
                  </span>
                ) : (
                  <span className="text-cream/45">Alle tips lagret</span>
                )}
              </div>
              <button
                type="button"
                onClick={saveAll}
                disabled={pending || dirtyIds.length === 0}
                className="flex items-center gap-1.5 bg-signal hover:bg-signalD disabled:bg-paper disabled:text-cream/35 text-cream text-xs font-semibold px-4 py-2 transition-colors shrink-0"
              >
                <Save size={13} />
                {pending
                  ? "Lagrer…"
                  : dirtyIds.length > 0
                    ? `Lagre alle (${dirtyIds.length})`
                    : "Lagre alle"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function PredictionRow({
  fixture,
  value,
  savedValue,
  isDirty,
  modelTip,
  onScore,
  onAITip,
  onModelTip,
}: {
  fixture: BoardFixture;
  value: Score;
  savedValue?: Score;
  isDirty: boolean;
  modelTip?: { home: number; away: number };
  onScore: (side: "home" | "away", n: number) => void;
  onAITip: (mode: TipMode) => void;
  onModelTip: () => void;
}) {
  const { home, away, stageLabel, kickoff, venueLabel, matchId } = fixture;
  return (
    <div className="surface p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono uppercase tracking-kicker text-cream/55">
          {stageLabel}
        </span>
        <span className="font-mono text-[11px] text-cream/70 stat-num">
          {formatDateLabel(kickoff).split(",")[0]} · {formatKickoff(kickoff)}
        </span>
      </div>

      <div className="flex flex-col sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center gap-3 sm:gap-4">
        <TeamSide team={home} align="right" />
        <div className="flex items-center justify-center gap-2">
          <ScoreInput value={value.home} onChange={(n) => onScore("home", n)} />
          <span className="text-cream/35 font-serif italic">·</span>
          <ScoreInput value={value.away} onChange={(n) => onScore("away", n)} />
        </div>
        <TeamSide team={away} align="left" />
      </div>

      <AITipChips onPick={onAITip} modelTip={modelTip} onModelTip={onModelTip} />

      <div className="mt-4 pt-3 border-t border-cream/8 flex items-center justify-between gap-3">
        <div className="min-h-[18px] text-[11px] flex items-center gap-1.5 font-mono">
          {isDirty ? (
            <span className="text-amber">Endret · ikke lagret</span>
          ) : savedValue ? (
            <span className="text-signal flex items-center gap-1">
              <Check size={11} /> Lagret {savedValue.home}–{savedValue.away}
            </span>
          ) : (
            <span className="text-cream/55 flex items-center gap-1">
              <MapPin size={10} /> {venueLabel}
            </span>
          )}
        </div>
        {savedValue && !isDirty && (
          <Link
            href={`/share/tip/${matchId}/${savedValue.home}-${savedValue.away}`}
            className="bg-paper hover:bg-paperHi border border-cream/8 text-cream/85 text-xs font-semibold px-2.5 py-1.5 transition-colors flex items-center gap-1.5"
            aria-label="Del mitt tips"
          >
            <Share2 size={12} />
            <span className="hidden sm:inline">Del</span>
          </Link>
        )}
      </div>
    </div>
  );
}

/**
 * Read-only card for a match where kickoff has passed. The saved tip is
 * the headline so the user can immediately see what they predicted on the
 * match that's playing right now (or just finished). No inputs, no AI
 * helper, no save. Share is still allowed.
 */
function LockedRow({
  fixture,
  savedValue,
}: {
  fixture: BoardFixture;
  savedValue?: Score;
}) {
  const { home, away, stageLabel, kickoff, matchId } = fixture;
  return (
    <div className="surface p-4 ring-1 ring-cream/8 bg-paper/70">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono uppercase tracking-kicker text-cream/55">
          {stageLabel}
        </span>
        <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-kicker text-signal bg-signal/12 px-1.5 py-0.5">
          <Lock size={10} /> Låst
        </span>
      </div>

      <div className="flex flex-col sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center gap-3 sm:gap-4">
        <TeamSide team={home} align="right" />
        <div className="flex items-center justify-center gap-2">
          {savedValue ? (
            <>
              <div className="w-14 h-12 flex items-center justify-center font-serif text-2xl font-semibold stat-num text-amber bg-canvas border border-cream/8">
                {savedValue.home}
              </div>
              <span className="text-cream/35 font-serif italic">·</span>
              <div className="w-14 h-12 flex items-center justify-center font-serif text-2xl font-semibold stat-num text-amber bg-canvas border border-cream/8">
                {savedValue.away}
              </div>
            </>
          ) : (
            <span className="text-[11px] font-mono text-cream/45 italic max-w-[10rem] text-center leading-snug">
              Du tippet ikke denne kampen
            </span>
          )}
        </div>
        <TeamSide team={away} align="left" />
      </div>

      <div className="mt-4 pt-3 border-t border-cream/8 flex items-center justify-between gap-3">
        <div className="text-[11px] font-mono text-cream/55">
          {savedValue ? (
            <span className="flex items-center gap-1">
              <Check size={11} className="text-signal" /> Ditt tips: {savedValue.home}–{savedValue.away}
            </span>
          ) : (
            <span>Kickoff har vært — kan ikke endres</span>
          )}
        </div>
        {savedValue && (
          <Link
            href={`/share/tip/${matchId}/${savedValue.home}-${savedValue.away}`}
            className="bg-paper hover:bg-paperHi border border-cream/8 text-cream/85 text-xs font-semibold px-2.5 py-1.5 transition-colors flex items-center gap-1.5"
            aria-label="Del mitt tips"
          >
            <Share2 size={12} />
            <span className="hidden sm:inline">Del</span>
          </Link>
        )}
      </div>
    </div>
  );
}

function TeamSide({ team, align }: { team: BoardTeam; align: "left" | "right" }) {
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
          {team.name}
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
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <input
      type="number"
      min={0}
      max={20}
      value={value}
      onChange={(e) => onChange(Math.max(0, Math.min(20, Number(e.currentTarget.value || 0))))}
      onFocus={(e) => e.currentTarget.select()}
      onClick={(e) => e.currentTarget.select()}
      className="w-14 h-12 text-center font-serif text-2xl font-semibold stat-num text-cream bg-canvas border border-cream/8 focus:outline-none focus:border-signal/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    />
  );
}

function AITipChips({
  onPick,
  modelTip,
  onModelTip,
}: {
  onPick: (mode: TipMode) => void;
  modelTip?: { home: number; away: number };
  onModelTip: () => void;
}) {
  return (
    <div className="mt-3 pt-3 border-t border-cream/8">
      <div className="flex items-center gap-2 flex-wrap">
        <Cpu size={11} className="text-amber" />
        <span className="text-[10px] uppercase tracking-kicker text-cream/55 font-mono">
          AI tippehjelp
        </span>
        <div className="flex gap-1 ml-auto items-center">
          {modelTip && (
            <button
              type="button"
              onClick={onModelTip}
              title="Spill med Freddy — modellens poeng-optimale tips (Dixon-Coles)"
              className="flex items-center gap-1 px-2 py-1 text-[10px] uppercase tracking-kicker font-mono font-semibold ring-1 bg-win/15 text-win ring-win/40 hover:brightness-125 transition"
            >
              <span aria-hidden>🤖</span>
              Freddy {modelTip.home}–{modelTip.away}
            </button>
          )}
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
    </div>
  );
}
