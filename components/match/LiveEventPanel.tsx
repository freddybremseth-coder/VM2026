"use client";

/**
 * LiveEventPanel — fetches /api/match-events/:matchId and renders:
 *   - xG timeline (cumulative)
 *   - Shot maps (home + away side by side)
 *   - Player heatmaps (if available)
 *
 * Polls every 30 s when the match is live.
 * Falls back gracefully if the API is unavailable.
 */

import { useEffect, useState, useCallback } from "react";
import { RefreshCw, Wifi, WifiOff, Clock } from "lucide-react";
import type { MatchEventData } from "@/lib/match-events/types";
import { ShotMap } from "./ShotMap";
import { HeatmapGrid } from "./HeatmapGrid";
import { XGEventTimeline } from "./XGEventTimeline";

const LIVE_POLL_MS = 30_000;
const BADGE_COLOR: Record<MatchEventData["source"], string> = {
  mock:           "bg-pitch-700 text-pitch-300",
  "api-football": "bg-data-500/15 text-data-300",
  fotmob:         "bg-accent-500/15 text-accent-300",
  opta:           "bg-win/15 text-win",
  statsbomb:      "bg-draw/15 text-draw",
};

interface Props {
  matchId: number;
  /** Pre-fetched SSR snapshot (avoids a flash of loading state) */
  initialData?: MatchEventData;
}

export function LiveEventPanel({ matchId, initialData }: Props) {
  const [data, setData] = useState<MatchEventData | null>(initialData ?? null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(initialData ? new Date() : null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(`/api/match-events/${matchId}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: MatchEventData = await res.json();
      setData(json);
      setLastFetch(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  // Initial fetch if no SSR snapshot provided
  useEffect(() => {
    if (!initialData) fetchData();
  }, [fetchData, initialData]);

  // Live polling
  useEffect(() => {
    if (!data) return;
    if (data.status !== "live" && data.status !== "halftime") return;
    const t = setInterval(fetchData, LIVE_POLL_MS);
    return () => clearInterval(t);
  }, [data, fetchData]);

  if (loading) return <PanelSkeleton />;
  if (error && !data) return <PanelError message={error} onRetry={fetchData} />;

  if (!data) return null;

  const isLive = data.status === "live" || data.status === "halftime";

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {isLive && (
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-loss bg-loss/10 px-2 py-1 rounded-md">
              <span className="h-1.5 w-1.5 rounded-full bg-loss animate-pulse" />
              Live{data.minute ? ` · ${data.minute}'` : ""}
            </span>
          )}
          <span className={`text-[10px] px-2 py-1 rounded-md font-mono uppercase tracking-wider ${BADGE_COLOR[data.source]}`}>
            {data.source}
          </span>
        </div>
        <div className="flex items-center gap-2 text-pitch-500 text-[11px]">
          {error && <span className="flex items-center gap-1 text-draw"><WifiOff size={11} /> Stale data</span>}
          {!error && <span className="flex items-center gap-1"><Wifi size={11} /></span>}
          {lastFetch && (
            <span className="flex items-center gap-1">
              <Clock size={10} />
              {lastFetch.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
          {isLive && (
            <button
              onClick={fetchData}
              className="flex items-center gap-1 hover:text-pitch-200 transition-colors"
              title="Refresh now"
            >
              <RefreshCw size={11} />
              Refresh
            </button>
          )}
        </div>
      </div>

      {/* xG timeline */}
      {data.xgTimeline.length > 1 && (
        <XGEventTimeline
          timeline={data.xgTimeline}
          shots={data.shots}
          homeShort={data.homeShort}
          awayShort={data.awayShort}
        />
      )}

      {/* Shot maps */}
      {data.shots.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ShotMap
            shots={data.shots}
            side="home"
            teamShort={data.homeShort}
            color="hsl(var(--accent-500))"
          />
          <ShotMap
            shots={data.shots}
            side="away"
            teamShort={data.awayShort}
            color="hsl(var(--data-500))"
          />
        </div>
      )}

      {/* Player heatmaps */}
      {data.heatmaps && data.heatmaps.length > 0 && (
        <section>
          <div className="text-[10px] uppercase tracking-widest text-pitch-400 mb-3">
            Player heatmaps
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {data.heatmaps.map((hm) => (
              <HeatmapGrid
                key={hm.playerId}
                heatmap={hm}
                hotColor={
                  hm.side === "home"
                    ? "hsl(var(--accent-500))"
                    : "hsl(var(--data-500))"
                }
              />
            ))}
          </div>
        </section>
      )}

      {/* Shot table */}
      {data.shots.length > 0 && (
        <ShotTable shots={data.shots} homeShort={data.homeShort} awayShort={data.awayShort} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shot log table
// ---------------------------------------------------------------------------
function ShotTable({
  shots,
  homeShort,
  awayShort,
}: {
  shots: MatchEventData["shots"];
  homeShort: string;
  awayShort: string;
}) {
  const sorted = [...shots].sort((a, b) => a.minute - b.minute);
  return (
    <div className="card-panel p-4">
      <div className="text-[10px] uppercase tracking-widest text-pitch-400 mb-3">
        Shot log
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-pitch-500 text-left border-b border-pitch-700/60">
              <th className="pb-2 pr-3 font-mono">Min</th>
              <th className="pb-2 pr-3">Team</th>
              <th className="pb-2 pr-3">Player</th>
              <th className="pb-2 pr-3 text-right font-mono">xG</th>
              <th className="pb-2">Outcome</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pitch-800/60">
            {sorted.map((s) => (
              <tr key={s.id} className="hover:bg-pitch-800/40 transition-colors">
                <td className="py-1.5 pr-3 font-mono text-pitch-400 stat-num">
                  {s.minute}{s.addedMinute ? `+${s.addedMinute}` : ""}'
                </td>
                <td className="py-1.5 pr-3">
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                      s.side === "home"
                        ? "bg-accent-500/10 text-accent-300"
                        : "bg-data-500/10 text-data-300"
                    }`}
                  >
                    {s.side === "home" ? homeShort : awayShort}
                  </span>
                </td>
                <td className="py-1.5 pr-3 text-pitch-200">{s.playerName}</td>
                <td className="py-1.5 pr-3 font-mono text-right stat-num text-pitch-300">
                  {s.xg.toFixed(2)}
                </td>
                <td className="py-1.5">
                  <OutcomePill outcome={s.outcome} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const OUTCOME_STYLES: Record<string, string> = {
  goal:          "bg-win/15 text-win",
  saved:         "bg-accent-500/10 text-accent-300",
  blocked:       "bg-pitch-700 text-pitch-400",
  "off-target":  "bg-pitch-800 text-pitch-500",
  post:          "bg-draw/10 text-draw",
  "own-goal":    "bg-loss/15 text-loss",
};
const OUTCOME_LABELS: Record<string, string> = {
  goal: "Goal", saved: "Saved", blocked: "Blocked",
  "off-target": "Off target", post: "Post", "own-goal": "Own goal",
};

function OutcomePill({ outcome }: { outcome: string }) {
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${OUTCOME_STYLES[outcome] ?? "bg-pitch-800 text-pitch-400"}`}>
      {OUTCOME_LABELS[outcome] ?? outcome}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Loading / error states
// ---------------------------------------------------------------------------
function PanelSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-72 rounded-lg bg-pitch-800/60" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-52 rounded-lg bg-pitch-800/60" />
        <div className="h-52 rounded-lg bg-pitch-800/60" />
      </div>
    </div>
  );
}

function PanelError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="card-panel p-6 text-center space-y-3">
      <WifiOff size={20} className="mx-auto text-pitch-500" />
      <p className="text-sm text-pitch-400">Could not load match events</p>
      <p className="text-xs text-pitch-600 font-mono">{message}</p>
      <button
        onClick={onRetry}
        className="text-xs font-semibold text-accent-400 hover:text-accent-300"
      >
        Try again
      </button>
    </div>
  );
}
