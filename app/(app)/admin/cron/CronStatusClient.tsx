"use client";

/**
 * Client-side polling view for the periodic refresh worker.
 *
 * Auth-gating lives in the server `page.tsx` wrapper — by the time this
 * renders, the visitor is already a verified admin. Polls
 * /api/cron/status every 30s while open.
 */

import { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, Clock, RefreshCw, Cpu, Activity } from "lucide-react";
import { Kicker, Headline } from "@/components/shared/EditorialKicker";
import type { CronRunReport, CronTaskResult } from "@/lib/cron/types";

const PHASE_LABEL = { pre: "Før VM", during: "Under VM", post: "Etter VM" } as const;

interface StatusResponse {
  ok: boolean;
  hasRun: boolean;
  report: CronRunReport | null;
}

export function CronStatusClient() {
  const [data, setData] = useState<StatusResponse | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchStatus() {
    try {
      const res = await fetch("/api/cron/status", { cache: "no-store" });
      const json = (await res.json()) as StatusResponse;
      setData(json);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchStatus();
    const id = setInterval(fetchStatus, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="px-4 sm:px-6 md:px-10 py-8 max-w-[1100px] mx-auto space-y-5">
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <Kicker tone="signal">
            <span className="inline-flex items-center gap-2">
              <Cpu size={11} /> Admin
            </span>
          </Kicker>
          <Headline rank="h2" className="mt-2">
            Cron status
          </Headline>
          <p className="text-sm text-cream/55 mt-3 max-w-2xl leading-relaxed">
            Periodisk refresh kjører <span className="font-mono text-cream">hver 6. time</span>{" "}
            (00:00, 06:00, 12:00, 18:00 UTC). Hva som kjøres avhenger av VM-fase
            — målet er &lt; 100 API-calls/dag (free-tier-grensen).
          </p>
        </div>
        <button
          onClick={() => {
            setRefreshing(true);
            fetchStatus();
          }}
          className="bg-paper hover:bg-paperHi border border-cream/8 text-cream/85 text-xs font-semibold px-3 py-2 flex items-center gap-1.5 shrink-0 transition-colors"
        >
          <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
          Oppdater
        </button>
      </header>

      {error && (
        <div className="surface p-4 ring-1 ring-loss/30 text-loss text-sm font-mono">
          {error}
        </div>
      )}

      {!data ? (
        <div className="surface p-6 text-cream/55 text-sm italic font-serif">Laster…</div>
      ) : !data.hasRun ? (
        <div className="surface p-6 text-center">
          <Clock size={24} className="text-cream/45 mx-auto mb-2" />
          <div className="text-sm text-cream/85 font-serif tracking-editorial">
            Cron har ikke kjørt ennå på denne instansen.
          </div>
          <div className="text-xs text-cream/55 mt-2 leading-relaxed">
            Vercel kjører den ved neste 6-timers tick — eller trigg manuelt med en{" "}
            <code className="font-mono text-cream/70">curl</code> mot{" "}
            <code className="font-mono text-cream/70">/api/cron/refresh</code>{" "}
            (krever{" "}
            <code className="font-mono text-cream/70">CRON_SECRET</code>
            -header).
          </div>
        </div>
      ) : (
        <ReportView report={data.report!} />
      )}
    </div>
  );
}

function ReportView({ report }: { report: CronRunReport }) {
  const startedDate = new Date(report.startedAt);
  const finishedDate = new Date(report.finishedAt);
  const minutesAgo = Math.floor((Date.now() - finishedDate.getTime()) / 60000);

  // Defensive: phase + budget may be undefined on a report stored before the upgrade.
  const phase = report.phase ?? "pre";
  const callsMade = report.callsMade ?? 0;
  const dailyBudget = report.dailyBudgetEstimate ?? 0;
  const utilization = dailyBudget > 0 ? Math.round((dailyBudget / 100) * 100) : 0;
  const budgetTone =
    dailyBudget < 50 ? "text-win" : dailyBudget < 90 ? "text-amber" : "text-loss";

  return (
    <div className="space-y-4">
      {/* Phase banner */}
      <div className="surface p-4 ring-1 ring-signal/20">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-signal/15 text-signal">
            <Activity size={12} />
            <span className="text-[10px] font-semibold uppercase tracking-kicker font-mono">
              {PHASE_LABEL[phase]}
            </span>
          </div>
          <div className="flex-1 min-w-[160px]">
            <div className="text-[10px] uppercase tracking-kicker text-cream/55 font-mono mb-0.5">
              Daglig budsjett (estimat)
            </div>
            <div className={`font-serif text-2xl font-semibold stat-num ${budgetTone}`}>
              ~{dailyBudget} <span className="text-cream/45 text-xs font-mono font-normal">/ 100 calls</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-kicker text-cream/55 font-mono mb-0.5">
              Denne kjøringen
            </div>
            <div className="font-serif text-2xl font-semibold stat-num text-cream">
              {callsMade} <span className="text-cream/45 text-xs font-mono font-normal">calls</span>
            </div>
          </div>
        </div>
        {/* Budget bar */}
        <div className="mt-3 h-1.5 bg-paper overflow-hidden">
          <div
            className={`h-full ${
              dailyBudget < 50 ? "bg-win" : dailyBudget < 90 ? "bg-amber" : "bg-loss"
            }`}
            style={{ width: `${utilization}%` }}
          />
        </div>
      </div>

      <div className="surface p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {report.ok ? (
              <CheckCircle2 size={16} className="text-win" />
            ) : (
              <AlertTriangle size={16} className="text-loss" />
            )}
            <span className="font-serif text-sm font-semibold tracking-editorial text-cream">
              Siste kjøring · {report.ok ? "OK" : "Feil"}
            </span>
          </div>
          <span className="text-[11px] text-cream/55 font-mono">
            for {minutesAgo} min siden
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <Stat label="Startet" value={startedDate.toLocaleTimeString("nb-NO", { timeZone: "Europe/Oslo" })} />
          <Stat label="Ferdig" value={finishedDate.toLocaleTimeString("nb-NO", { timeZone: "Europe/Oslo" })} />
          <Stat label="Varighet" value={`${(report.durationMs / 1000).toFixed(1)}s`} />
          <Stat label="Tasks OK" value={`${report.tasks.filter((t) => t.status !== "failed").length}/${report.tasks.length}`} />
        </div>
      </div>

      <div className="space-y-3">
        {report.tasks.map((task) => (
          <TaskCard key={task.task} task={task} />
        ))}
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: CronTaskResult }) {
  const statusStyles = {
    ok: { ring: "ring-win/30", badge: "bg-win/15 text-win", icon: <CheckCircle2 size={12} /> },
    skipped: { ring: "ring-cream/8", badge: "bg-paper text-cream/55", icon: <Clock size={12} /> },
    failed: { ring: "ring-loss/30", badge: "bg-loss/15 text-loss", icon: <AlertTriangle size={12} /> },
  }[task.status];

  return (
    <div className={`surface p-4 ring-1 ${statusStyles.ring}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-cream/85">{task.task}</span>
        <span className={`flex items-center gap-1 text-[10px] font-mono uppercase tracking-kicker px-2 py-0.5 ${statusStyles.badge}`}>
          {statusStyles.icon}
          {task.status}
        </span>
      </div>
      <div className="text-sm text-cream mb-1">{task.summary ?? "(ingen oppsummering)"}</div>
      <div className="text-[10px] text-cream/45 font-mono stat-num">{task.durationMs}ms</div>
      {task.detail !== undefined && task.detail !== null && (
        <details className="mt-2">
          <summary className="text-[11px] text-cream/55 cursor-pointer hover:text-cream font-mono">
            Detaljer
          </summary>
          <pre className="mt-2 text-[10px] font-mono text-cream/70 bg-canvas border border-cream/8 p-3 overflow-x-auto">
            {JSON.stringify(task.detail, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-kicker text-cream/55 mb-1 font-mono">
        {label}
      </div>
      <div className="font-serif text-base font-semibold stat-num text-cream">{value}</div>
    </div>
  );
}
