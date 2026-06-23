"use client";

import { useState, useTransition } from "react";
import { setStartingBankrollAction } from "@/app/(app)/tippemodell/autopilot/actions";

/**
 * Inline form to set the starting bankroll (the deposited sum the auto-pilot
 * sizes Kelly stakes against). Optimistic-ish: shows a status line after the
 * server action resolves.
 */
export function BankrollForm({ current }: { current: number }) {
  const [value, setValue] = useState(String(current));
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function submit() {
    const amount = Number(value);
    startTransition(async () => {
      const res = await setStartingBankrollAction(amount);
      if (res.ok) setMsg({ ok: true, text: "Bankroll oppdatert." });
      else setMsg({ ok: false, text: res.error ?? "Noe gikk galt." });
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="text-[10px] uppercase tracking-kicker font-mono text-cream/55">
        Innskutt sum
      </label>
      <div className="flex items-center gap-1">
        <input
          type="number"
          min={1}
          step={50}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-28 bg-paper border border-cream/15 px-2 py-1 font-mono text-sm text-cream stat-num focus:border-signal outline-none"
        />
        <span className="font-mono text-xs text-cream/45">kr</span>
      </div>
      <button
        onClick={submit}
        disabled={pending}
        className="px-3 py-1 text-[10px] uppercase tracking-kicker font-mono bg-signal/15 text-signal hover:bg-signal/25 disabled:opacity-50 transition-colors"
      >
        {pending ? "Lagrer…" : "Sett"}
      </button>
      {msg && (
        <span className={`text-[10px] font-mono ${msg.ok ? "text-win" : "text-loss"}`}>
          {msg.text}
        </span>
      )}
    </div>
  );
}
