"use client";

/**
 * Slim global status strip under the top bar.
 *
 *  • Pre-tournament  → ticking countdown to the opening match (dismissible).
 *  • Live window     → "N kamper live nå" with auto-refreshing match chips
 *                      and a manual refresh; not dismissible while live.
 *  • Post-tournament → renders nothing.
 *
 * Data comes from /api/live-state. There's no real score feed yet, so during
 * a live window we show the fixtures that are in progress (clock-derived)
 * without invented scores — `hasScoreFeed` flips this on later.
 *
 * The countdown ticks locally every second but is anchored to the server
 * clock (offset computed on each fetch) so a wrong device clock can't make
 * it drift.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RefreshCw, X, ChevronRight } from "lucide-react";
import { HoloFlag } from "@/components/shared/HoloFlag";
import type { LiveState } from "@/lib/live-state";

const DISMISS_KEY = "vm-livebar-dismissed";

function fmtCountdown(ms: number): string {
  if (ms <= 0) return "straks";
  const totalSec = Math.floor(ms / 1000);
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (d >= 1) return `${d}d ${h}t ${m}m`;
  if (h >= 1) return `${h}t ${m}m ${s}s`;
  return `${m}m ${s}s`;
}

export function LiveStatusBar() {
  const [state, setState] = useState<LiveState | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [dismissed, setDismissed] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  // Server-clock offset (serverTime − clientNow) applied to the local tick.
  const offsetRef = useRef(0);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/live-state", { cache: "no-store" });
      const json = (await res.json()) as LiveState;
      offsetRef.current = new Date(json.serverTime).getTime() - Date.now();
      setState(json);
    } catch {
      /* keep last good state */
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    setDismissed(
      typeof window !== "undefined" && localStorage.getItem(DISMISS_KEY) === "1",
    );
    load();
  }, [load]);

  // Re-poll: faster while live, calmer otherwise.
  useEffect(() => {
    const period = state?.phase === "live" ? 20_000 : 60_000;
    const id = setInterval(load, period);
    return () => clearInterval(id);
  }, [load, state?.phase]);

  // Local 1s tick for a smooth countdown.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now() + offsetRef.current), 1000);
    return () => clearInterval(id);
  }, []);

  if (!state || state.phase === "post") return null;

  // ─── Live ──────────────────────────────────────────────────────────────
  if (state.phase === "live" && state.liveMatches.length > 0) {
    return (
      <div className="border-b border-signal/25 bg-signal/8">
        <div className="flex items-center gap-3 px-3 sm:px-6 py-2 overflow-hidden">
          <span className="flex items-center gap-1.5 shrink-0 text-[11px] font-mono font-bold uppercase tracking-kicker text-signal">
            <span className="live-dot" />
            {state.liveMatches.length} live
          </span>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin">
            {state.liveMatches.map((m) => (
              <Link
                key={m.id}
                href={`/matches/${m.id}`}
                className="flex items-center gap-2 shrink-0 bg-paper border border-cream/8 hover:border-signal/40 px-2.5 py-1 transition-colors"
              >
                {m.homeFlag && <HoloFlag code={m.homeFlag} w={16} radius={1} />}
                <span className="text-xs text-cream font-semibold">
                  {state.hasScoreFeed && m.homeScore !== null && m.awayScore !== null
                    ? `${m.homeScore}–${m.awayScore}`
                    : "vs"}
                </span>
                {m.awayFlag && <HoloFlag code={m.awayFlag} w={16} radius={1} />}
                <span className="text-[10px] font-mono text-cream/45 hidden sm:inline">
                  {m.homeName} · {m.awayName}
                </span>
              </Link>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setRefreshing(true);
              load();
            }}
            className="ml-auto shrink-0 p-1 text-cream/55 hover:text-signal transition-colors"
            aria-label="Oppdater"
            title="Oppdater"
          >
            <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>
    );
  }

  // ─── Pre-tournament countdown (dismissible) ──────────────────────────────
  if (state.phase === "pre" && !dismissed) {
    const target = new Date(state.tournamentStart).getTime();
    const remaining = target - now;
    const next = state.nextMatch;

    return (
      <div className="border-b border-cream/8 bg-paper/60">
        <div className="flex items-center gap-2.5 px-3 sm:px-6 py-2 text-sm">
          <span className="text-[10px] uppercase tracking-kicker font-mono font-semibold text-amber shrink-0">
            Avspark om
          </span>
          <span className="font-mono font-semibold text-cream stat-num shrink-0">
            {fmtCountdown(remaining)}
          </span>
          <span className="text-cream/55 truncate hidden sm:inline">
            til VM 2026
          </span>

          {next && (
            <Link
              href={`/matches/${next.id}`}
              className="ml-auto hidden md:flex items-center gap-1.5 shrink-0 text-xs text-cream/55 hover:text-signal transition-colors"
            >
              Først ut: {next.homeName}–{next.awayName}
              <ChevronRight size={13} />
            </Link>
          )}

          <button
            type="button"
            onClick={() => {
              localStorage.setItem(DISMISS_KEY, "1");
              setDismissed(true);
            }}
            className={`${next ? "" : "ml-auto"} shrink-0 p-1 text-cream/45 hover:text-cream transition-colors`}
            aria-label="Skjul"
            title="Skjul"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  return null;
}
