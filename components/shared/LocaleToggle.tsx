"use client";

import { useTransition } from "react";
import { setLocaleAction } from "@/app/actions/set-locale";
import type { Locale } from "@/lib/i18n";

/**
 * Two-state language toggle (EN | NO) shown in the TopBar. Calls a server
 * action that sets a 1-year cookie and revalidates the layout.
 */
export function LocaleToggle({ current }: { current: Locale }) {
  const [pending, startTransition] = useTransition();

  function pick(next: Locale) {
    if (next === current || pending) return;
    startTransition(async () => {
      await setLocaleAction(next);
    });
  }

  return (
    <div className="flex items-center gap-px rounded-md bg-pitch-800/70 border border-pitch-700/70 p-0.5 text-[10px] font-mono font-semibold uppercase tracking-widest">
      <button
        type="button"
        onClick={() => pick("en")}
        disabled={pending}
        className={`px-2 py-1 rounded transition-colors ${
          current === "en"
            ? "bg-accent-500 text-pitch-950"
            : "text-pitch-400 hover:text-pitch-100"
        }`}
        aria-label="English"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => pick("nb")}
        disabled={pending}
        className={`px-2 py-1 rounded transition-colors ${
          current === "nb"
            ? "bg-accent-500 text-pitch-950"
            : "text-pitch-400 hover:text-pitch-100"
        }`}
        aria-label="Norsk"
      >
        NO
      </button>
    </div>
  );
}
