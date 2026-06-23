"use client";

import { useEffect, useState, useTransition } from "react";
import { Sparkles, Check, X } from "lucide-react";
import { Kicker } from "@/components/shared/EditorialKicker";
import {
  getAllGuestPredictions,
  clearGuestPredictions,
} from "@/lib/guest-predictions";
import { migrateGuestPredictionsAction } from "@/app/(app)/predictions/migrate-actions";

/**
 * Shown to authenticated users only. On mount, peeks at localStorage for any
 * guest predictions left over from before sign-in and offers to import them.
 *
 * Renders nothing if there are no guest predictions to migrate.
 */
export function GuestMigrationPrompt() {
  const [guestCount, setGuestCount] = useState<number | null>(null);
  const [done, setDone] = useState<null | {
    imported: number;
    skipped: number;
  }>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setGuestCount(getAllGuestPredictions().length);
  }, []);

  if (guestCount === null) return null; // not hydrated
  if (guestCount === 0 && !done) return null;
  if (done) {
    return (
      <div className="surface p-4 ring-1 ring-signal/30 flex items-center gap-3 text-sm">
        <Check size={16} className="text-signal shrink-0" />
        <div className="flex-1 text-cream/85">
          Importerte{" "}
          <span className="font-semibold text-signal stat-num">{done.imported}</span>{" "}
          gjeste-tips inn på kontoen din.
          {done.skipped > 0 && (
            <span className="text-cream/60 ml-2 font-mono text-xs">
              ({done.skipped} hoppet over — allerede tippet eller startet)
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setDone(null)}
          className="text-cream/55 hover:text-cream"
          aria-label="Lukk"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  function migrate() {
    const tips = getAllGuestPredictions().map((t) => ({
      matchId: t.matchId,
      homeScore: t.homeScore,
      awayScore: t.awayScore,
    }));
    startTransition(async () => {
      const result = await migrateGuestPredictionsAction(tips);
      if (result.ok) {
        clearGuestPredictions();
        setDone({
          imported: result.imported ?? 0,
          skipped: result.skipped ?? 0,
        });
      }
    });
  }

  function discard() {
    clearGuestPredictions();
    setGuestCount(0);
  }

  return (
    <div className="surface p-5 ring-1 ring-signal/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-signal/10 via-transparent to-transparent">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-10 w-10 bg-signal/15 flex items-center justify-center shrink-0">
          <Sparkles size={18} className="text-amber" />
        </div>
        <div className="min-w-0">
          <Kicker tone="signal">Gjeste-tips funnet</Kicker>
          <div className="font-serif text-base font-semibold tracking-editorial text-cream mt-0.5">
            {guestCount} gjeste-tips{guestCount === 1 ? "" : ""} på denne enheten
          </div>
          <div className="text-xs text-cream/55 mt-1 leading-relaxed">
            Importer dem inn på kontoen så de gir poeng når kampene er ferdige.
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={migrate}
          disabled={pending}
          className="bg-signal hover:bg-signalD disabled:bg-paper disabled:text-cream/50 text-cream text-xs font-semibold px-3 py-1.5 transition-colors"
        >
          {pending ? "Importerer…" : "Importer"}
        </button>
        <button
          type="button"
          onClick={discard}
          disabled={pending}
          className="bg-paper hover:bg-paperHi border border-cream/8 text-cream/70 text-xs font-semibold px-3 py-1.5 transition-colors"
        >
          Forkast
        </button>
      </div>
    </div>
  );
}
