"use client";

import { useState, useTransition } from "react";
import { Check, Save, RefreshCw, Lock } from "lucide-react";
import { HoloFlag } from "@/components/shared/HoloFlag";
import { formatKickoff, formatDateLabel } from "@/lib/utils";
import {
  recordMatchResultAction,
  triggerFetchResultsAction,
} from "./actions";
import type { FixtureRow } from "./page";

type Status = "finished" | "live" | "halftime";

interface Draft {
  home: number;
  away: number;
  status: Status;
}

export function ResultsForm({
  rows,
  hasApiKey,
}: {
  rows: FixtureRow[];
  hasApiKey: boolean;
}) {
  const [drafts, setDrafts] = useState<Record<number, Draft>>(() => {
    const seed: Record<number, Draft> = {};
    for (const r of rows) {
      if (r.existing) {
        seed[r.matchId] = {
          home: r.existing.home_score,
          away: r.existing.away_score,
          status: (r.existing.status as Status) ?? "finished",
        };
      } else {
        seed[r.matchId] = { home: 0, away: 0, status: "finished" };
      }
    }
    return seed;
  });
  const [feedback, setFeedback] = useState<Record<number, string>>({});
  const [globalFeedback, setGlobalFeedback] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();

  function setField(matchId: number, patch: Partial<Draft>) {
    setDrafts((prev) => ({ ...prev, [matchId]: { ...prev[matchId], ...patch } }));
    setFeedback((prev) => ({ ...prev, [matchId]: "" }));
  }

  function save(matchId: number) {
    const d = drafts[matchId];
    if (!d) return;
    setSavingId(matchId);
    startTransition(async () => {
      const res = await recordMatchResultAction(matchId, d.home, d.away, d.status);
      setSavingId(null);
      setFeedback((prev) => ({
        ...prev,
        [matchId]: res.error
          ? res.error
          : d.status === "finished"
            ? "Lagret · tipp gradert"
            : "Lagret",
      }));
    });
  }

  function triggerFetch() {
    setGlobalFeedback("Henter…");
    startTransition(async () => {
      const res = await triggerFetchResultsAction();
      setGlobalFeedback(
        res.status === "failed"
          ? `Feil: ${res.summary}`
          : `${res.summary ?? "OK"} (${res.durationMs} ms)`,
      );
    });
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={triggerFetch}
          disabled={!hasApiKey || pending}
          className="flex items-center gap-1.5 bg-signal hover:bg-signalD disabled:bg-paper disabled:text-cream/35 text-cream text-xs font-semibold px-3 py-2 transition-colors"
        >
          <RefreshCw size={13} className={pending ? "animate-spin" : ""} />
          Hent live fra API-Football
        </button>
        {globalFeedback && (
          <span className="text-[11px] font-mono text-cream/70">{globalFeedback}</span>
        )}
      </div>

      <div className="space-y-3">
        {rows.map((r) => {
          const draft = drafts[r.matchId];
          const fb = feedback[r.matchId];
          const isSaving = savingId === r.matchId && pending;
          const graded =
            r.existing?.status === "finished" &&
            r.existing.home_score === draft.home &&
            r.existing.away_score === draft.away &&
            draft.status === "finished";

          return (
            <div key={r.matchId} className="surface p-4">
              <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-kicker text-cream/55">
                    {r.stageLabel}
                  </div>
                  <div className="text-[11px] font-mono text-cream/45 mt-0.5">
                    {formatDateLabel(r.kickoff)} · {formatKickoff(r.kickoff)}
                  </div>
                </div>
                {graded && (
                  <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-kicker text-win bg-win/12 px-1.5 py-0.5">
                    <Lock size={10} /> Gradert
                  </span>
                )}
              </div>

              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div className="flex items-center gap-2 justify-end min-w-0">
                  <span className="font-serif text-base font-semibold tracking-editorial text-cream truncate">
                    {r.homeName}
                  </span>
                  {r.homeFlag && <HoloFlag code={r.homeFlag} w={22} radius={2} />}
                </div>
                <div className="flex items-center gap-2">
                  <ScoreInput
                    value={draft.home}
                    onChange={(n) => setField(r.matchId, { home: n })}
                  />
                  <span className="text-cream/35 font-serif italic">·</span>
                  <ScoreInput
                    value={draft.away}
                    onChange={(n) => setField(r.matchId, { away: n })}
                  />
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  {r.awayFlag && <HoloFlag code={r.awayFlag} w={22} radius={2} />}
                  <span className="font-serif text-base font-semibold tracking-editorial text-cream truncate">
                    {r.awayName}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-cream/8 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-kicker font-mono text-cream/55">
                    Status
                  </span>
                  <select
                    value={draft.status}
                    onChange={(e) =>
                      setField(r.matchId, { status: e.currentTarget.value as Status })
                    }
                    className="bg-paper border border-cream/8 text-cream text-xs font-mono px-2 py-1 focus:outline-none focus:border-signal/50"
                  >
                    <option value="finished">Slutt — graderer tipp</option>
                    <option value="live">Live</option>
                    <option value="halftime">Pause</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  {fb && (
                    <span
                      className={`text-[11px] font-mono ${
                        fb.startsWith("Lagret") ? "text-signal" : "text-loss"
                      }`}
                    >
                      {fb.startsWith("Lagret") ? <Check size={11} className="inline" /> : null}{" "}
                      {fb}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => save(r.matchId)}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 bg-paper hover:bg-paperHi border border-cream/8 text-cream text-xs font-semibold px-3 py-1.5 transition-colors disabled:opacity-50"
                  >
                    <Save size={12} />
                    {isSaving ? "Lagrer…" : "Lagre"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
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
      onChange={(e) =>
        onChange(Math.max(0, Math.min(20, Number(e.currentTarget.value || 0))))
      }
      onFocus={(e) => e.currentTarget.select()}
      className="w-14 h-12 text-center font-serif text-2xl font-semibold stat-num text-cream bg-canvas border border-cream/8 focus:outline-none focus:border-signal/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    />
  );
}
