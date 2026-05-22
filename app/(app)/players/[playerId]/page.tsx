import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Cpu, MapPin, TrendingUp } from "lucide-react";
import { TeamFlag } from "@/components/shared/TeamFlag";
import { DataSourceBanner } from "@/components/shared/DataSourceBanner";
import { getAllPlayers, getSquad, type Player } from "@/lib/wc26-squads";
import { teamById } from "@/lib/wc26-data";
import { getPlayerForm, type ClubOutcome } from "@/lib/player-form";

export default function PlayerProfilePage({
  params,
}: {
  params: { playerId: string };
}) {
  const id = Number(params.playerId);
  const player = getAllPlayers().find((p) => p.id === id);
  if (!player) notFound();
  const team = teamById(player.teamId);
  const form = getPlayerForm(player.id);
  const teammates = team
    ? getSquad(team.id).filter(
        (p) => p.id !== player.id && p.position === player.position,
      )
    : [];

  // Goals-per-cap ratio is the simplest "scoring rate" we can compute.
  const goalsPerCap =
    player.caps && player.caps > 0 ? (player.goals ?? 0) / player.caps : null;

  return (
    <div className="px-4 sm:px-6 py-6 max-w-[1100px] mx-auto space-y-5">
      <Link
        href="/players"
        className="inline-flex items-center gap-1.5 text-xs text-pitch-400 hover:text-accent-300 transition-colors"
      >
        <ArrowLeft size={12} /> All players
      </Link>

      <div className="card-panel p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] grid-lines pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row items-start gap-5">
          <div className="h-20 w-20 rounded-md bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-pitch-950 font-mono font-bold text-2xl stat-num shrink-0">
            {player.number || "—"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-pitch-300 font-mono mb-1 flex-wrap">
              {team && (
                <Link
                  href={`/teams/${team.id}`}
                  className="flex items-center gap-1.5 hover:text-accent-300"
                >
                  <TeamFlag code={team.flag} size="sm" /> {team.name}
                </Link>
              )}
              <span>·</span>
              <span>{player.position}</span>
              {player.isCaptain && <span className="text-accent-400">· (C)</span>}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {player.name}
            </h1>
            <p className="text-sm text-pitch-400 mt-1">{player.club}</p>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-pitch-700/60 grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
          <Stat label="Age" value={player.age ?? "—"} />
          <Stat label="Caps" value={player.caps ?? "—"} />
          <Stat label="Int. goals" value={player.goals ?? "—"} accent />
          {goalsPerCap !== null && (
            <Stat
              label="Goals / cap"
              value={goalsPerCap.toFixed(2)}
              hint="all-time"
            />
          )}
        </div>
      </div>

      {form && (
        <section className="card-panel p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} className="text-data-400" />
            <h2 className="text-xs uppercase tracking-widest font-semibold text-pitch-200">
              Club form · {form.season}
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <Stat label="Appearances" value={form.apps} />
            <Stat label="Goals" value={form.goals} accent />
            <Stat label="Assists" value={form.assists} />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-pitch-400 font-mono">
              Last 5
            </span>
            <div className="flex items-center gap-1">
              {form.last5.map((o, i) => (
                <OutcomeDot key={i} outcome={o} />
              ))}
            </div>
          </div>

          {form.note && (
            <p className="mt-3 text-xs text-pitch-400 italic leading-relaxed">
              {form.note}
            </p>
          )}
        </section>
      )}

      {teammates.length > 0 && (
        <section className="card-panel p-5">
          <h2 className="text-xs uppercase tracking-widest font-semibold text-pitch-200 mb-3">
            Other {player.position}s in this squad
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {teammates.map((t) => (
              <Link
                key={t.id}
                href={`/players/${t.id}`}
                className="rounded-md bg-pitch-800/50 hover:bg-pitch-800 px-3 py-2 text-sm flex items-center gap-2"
              >
                <span className="font-mono text-pitch-400 w-6 text-right stat-num">
                  {t.number || "—"}
                </span>
                <span className="flex-1 truncate text-pitch-200">{t.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <DataSourceBanner
        caveat="Heatmaps, shot maps and per-match event data populate when the tournament starts and a live feed is wired up."
      />

      <div className="card-panel p-5 flex items-start gap-3">
        <Cpu size={14} className="text-accent-400 shrink-0 mt-0.5" />
        <p className="text-xs text-pitch-300 leading-relaxed">
          <span className="font-semibold text-pitch-100">Coming next:</span>{" "}
          heatmap pitch from event data, fantasy/tipping value, per-tournament
          form sparkline, and an AI-written "scouting brief" tab.
        </p>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
  hint,
}: {
  label: string;
  value: number | string;
  accent?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-pitch-400 mb-1">
        {label}
      </div>
      <div
        className={`font-mono text-2xl font-bold stat-num ${
          accent ? "text-accent-300" : "text-pitch-100"
        }`}
      >
        {value}
      </div>
      {hint && (
        <div className="text-[10px] uppercase tracking-widest text-pitch-500 mt-0.5">
          {hint}
        </div>
      )}
    </div>
  );
}

function OutcomeDot({ outcome }: { outcome: ClubOutcome }) {
  const cls = {
    W: "bg-win/30 text-win ring-win/50",
    D: "bg-draw/15 text-draw ring-draw/40",
    L: "bg-loss/15 text-loss ring-loss/40",
    B: "bg-pitch-800 text-pitch-500 ring-pitch-700",
  }[outcome];
  return (
    <span
      className={`h-6 w-6 inline-flex items-center justify-center rounded-sm text-[10px] font-bold font-mono ring-1 ${cls}`}
    >
      {outcome}
    </span>
  );
}
