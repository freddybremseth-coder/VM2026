"use client";

import { useEffect, useState, useTransition } from "react";
import { Sparkles, Check, X } from "lucide-react";
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
      <div className="card-panel p-4 ring-1 ring-accent-500/30 flex items-center gap-3 text-sm">
        <Check size={16} className="text-accent-400 shrink-0" />
        <div className="flex-1 text-pitch-200">
          Imported <span className="font-semibold text-accent-300">{done.imported}</span>{" "}
          guest tip{done.imported === 1 ? "" : "s"} into your account.
          {done.skipped > 0 && (
            <span className="text-pitch-500 ml-2">
              ({done.skipped} skipped — already tipped or kicked off)
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setDone(null)}
          className="text-pitch-400 hover:text-pitch-100"
          aria-label="Dismiss"
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
    <div className="card-panel p-5 ring-1 ring-accent-500/30 flex items-center justify-between gap-4 bg-gradient-to-r from-accent-500/10 via-transparent to-transparent">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-10 w-10 rounded-md bg-accent-500/15 flex items-center justify-center shrink-0">
          <Sparkles size={18} className="text-accent-400" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold">
            {guestCount} guest tip{guestCount === 1 ? "" : "s"} found on this device
          </div>
          <div className="text-xs text-pitch-400 mt-0.5">
            Import them into your account so they earn points when the matches finish.
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={migrate}
          disabled={pending}
          className="rounded-md bg-accent-500 hover:bg-accent-400 disabled:bg-pitch-700 text-pitch-950 text-xs font-semibold px-3 py-1.5 transition-colors"
        >
          {pending ? "Importing…" : "Import"}
        </button>
        <button
          type="button"
          onClick={discard}
          disabled={pending}
          className="rounded-md bg-pitch-800 hover:bg-pitch-700 text-pitch-300 text-xs font-semibold px-3 py-1.5 transition-colors"
        >
          Discard
        </button>
      </div>
    </div>
  );
}
