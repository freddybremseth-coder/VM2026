"use client";

/**
 * Admin status page for the periodic refresh worker.
 *
 * Lives under /admin/cron — no auth-gating here in v1 since the data is
 * inert (only run timing + change summaries), but tighten with a Supabase
 * role check before exposing publicly if needed.
 *
 * Polls /api/cron/status every 30s while open.
 */

import { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, Clock, RefreshCw, Cpu } from "lucide-react";
import type { CronRunReport, CronTaskResult } from "@/lib/cron/types";

interface StatusResponse {
  ok: boolean;
  hasRun: boolean;
  report: CronRunReport | null;
}

export default function CronStatusPage() {
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
    <div className="px-4 sm:px-6 py-6 max-w-[1100px] mx-auto space-y-5">
      <header className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-accent-400 font-mono mb-1">
            <Cpu size={12} /> Admin
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Cron status</h1>
          <p className="text-sm text-pitch-400 mt-1">
            Periodisk refresh kjører <span className="font-mono">hver 2. time</span>{" "}
            (00:00, 02:00, 04:00 UTC …). Henter kampresultater, sjekker
            troppendringer og oppdaterer landslagsform.
          </p>
        </div>
        <button
          onClick={() => {
            setRefreshing(true);
            fetchStatus();
          }}
          className="rounded-md bg-pitch-800 hover:bg-pitch-700 text-pitch-200 text-xs font-semibold px-3 py-2 flex items-center gap-1.5 shrink-0"
        >
          <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </header>

      {error && (
        <div className="card-panel p-4 ring-1 ring-loss/30 text-loss text-sm">
          {error}
        </div>
      )}

      {!data ? (
        <div className="card-panel p-6 text-pitch-400 text-sm">Laster…</div>
      ) : !data.hasRun ? (
        <div className="card-panel p-6 text-center">
          <Clock size={24} className="text-pitch-500 mx-auto mb-2" />
          <div className="text-sm text-pitch-300">
            Cron har ikke kjørt ennå på denne instansen.
          </div>
          <div className="text-xs text-pitch-500 mt-1">
            Vercel kjører den ved neste 2-timers tick — eller trigg manuelt med en{" "}
            <code className="font-mono text-pitch-400">curl</code> mot{" "}
            <code className="font-mono text-pitch-400">/api/cron/refresh</code>{" "}
            (krever{" "}
            <code className="font-mono text-pitch-400">CRON_SECRET</code>
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

  return (
    <div className="space-y-4">
      <div className="card-panel p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {report.ok ? (
              <CheckCircle2 size={16} className="text-win" />
            ) : (
              <AlertTriangle size={16} className="text-loss" />
            )}
            <span className="text-sm font-semibold">
              Siste kjøring · {report.ok ? "OK" : "Feil"}
            </span>
          </div>
          <span className="text-[11px] text-pitch-400 font-mono">
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
    skipped: { ring: "ring-pitch-700", badge: "bg-pitch-800 text-pitch-400", icon: <Clock size={12} /> },
    failed: { ring: "ring-loss/30", badge: "bg-loss/15 text-loss", icon: <AlertTriangle size={12} /> },
  }[task.status];

  return (
    <div className={`card-panel p-4 ring-1 ${statusStyles.ring}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-pitch-300">{task.task}</span>
        <span className={`flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded ${statusStyles.badge}`}>
          {statusStyles.icon}
          {task.status}
        </span>
      </div>
      <div className="text-sm text-pitch-100 mb-1">{task.summary ?? "(ingen oppsummering)"}</div>
      <div className="text-[10px] text-pitch-500 font-mono">{task.durationMs}ms</div>
      {task.detail !== undefined && task.detail !== null && (
        <details className="mt-2">
          <summary className="text-[11px] text-pitch-400 cursor-pointer hover:text-pitch-200">
            Detaljer
          </summary>
          <pre className="mt-2 text-[10px] font-mono text-pitch-300 bg-pitch-900/60 rounded p-3 overflow-x-auto">
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
      <div className="text-[10px] uppercase tracking-widest text-pitch-500 mb-1 font-mono">
        {label}
      </div>
      <div className="font-mono text-base font-bold stat-num text-pitch-100">{value}</div>
    </div>
  );
}
