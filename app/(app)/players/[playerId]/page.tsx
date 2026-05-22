import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Cpu, TrendingUp, Trophy, Crown, Clock, Sparkles, Target } from "lucide-react";
import { TeamFlag } from "@/components/shared/TeamFlag";
import { DataSourceBanner } from "@/components/shared/DataSourceBanner";
import { getAllPlayers, getSquad, getPlayerMinutes } from "@/lib/wc26-squads";
import { teamById } from "@/lib/wc26-data";
import { getPlayerForm, type ClubOutcome } from "@/lib/player-form";
import { getPlayerEventData } from "@/lib/match-events/provider";
import { PlayerMatchData } from "@/components/match/PlayerMatchData";

export default async function PlayerProfilePage({
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
  const eventData = await getPlayerEventData(player.id);

  // Derived stats
  const intMinutes = getPlayerMinutes(player);
  const goalsPerCap =
    player.caps && player.caps > 0 ? (player.goals ?? 0) / player.caps : null;
  const minutesPerGoal =
    player.goals && player.goals > 0 ? Math.round(intMinutes / player.goals) : null;
  const goalsPlusAssists = (player.goals ?? 0) + (player.assists ?? 0);

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

        {/* International stats — 2 rows on mobile, single row from sm */}
        <div className="mt-5 pt-4 border-t border-pitch-700/60">
          <div className="text-[10px] uppercase tracking-widest text-pitch-500 font-mono mb-3 flex items-center gap-1.5">
            <Target size={10} className="text-accent-400" />
            Landslagsstatistikk
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
            <Stat label="Alder" value={player.age ?? "—"} />
            <Stat
              icon={<Crown size={10} />}
              label="Caps"
              value={player.caps ?? "—"}
            />
            <Stat
              icon={<Trophy size={10} />}
              label="Mål"
              value={player.goals ?? "—"}
              accent
            />
            <Stat
              icon={<Sparkles size={10} />}
              label="Assists"
              value={player.assists ?? "—"}
              data
            />
            <Stat
              icon={<Clock size={10} />}
              label="Minutter"
              value={intMinutes > 0 ? intMinutes.toLocaleString("nb-NO") : "—"}
              hint={player.minutes === undefined ? "estimat" : undefined}
            />
            <Stat
              label="G+A"
              value={goalsPlusAssists > 0 ? goalsPlusAssists : "—"}
              hint={
                goalsPerCap !== null ? `${goalsPerCap.toFixed(2)}/cap` : undefined
              }
            />
          </div>
          {minutesPerGoal && (
            <p className="mt-3 text-[11px] text-pitch-500">
              <span className="font-mono stat-num text-pitch-300">
                {minutesPerGoal.toLocaleString("nb-NO")}
              </span>{" "}
              minutter per mål for landslaget
            </p>
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

      {eventData ? (
        <PlayerMatchData
          heatmap={eventData.heatmap}
          shots={eventData.shots}
          matchLabel={eventData.matchLabel}
          side={team?.id === 21 ? "home" : "away"}
        />
      ) : (
        <DataSourceBanner
          caveat="Heatmaps og kampdata aktiveres når turneringen starter og live-feed er koblet til."
        />
      )}

      <div className="card-panel p-5 flex items-start gap-3">
        <Cpu size={14} className="text-accent-400 shrink-0 mt-0.5" />
        <p className="text-xs text-pitch-300 leading-relaxed">
          <span className="font-semibold text-pitch-100">Kommer:</span>{" "}
          per-turnering form-sparkline, fantasy/tipping-verdi og AI-skrevet
          &quot;scout-brief&quot;-fane.
        </p>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
  data,
  hint,
  icon,
}: {
  label: string;
  value: number | string;
  accent?: boolean;
  data?: boolean;
  hint?: string;
  icon?: React.ReactNode;
}) {
  const valueClr = accent
    ? "text-accent-300"
    : data
    ? "text-data-300"
    : "text-pitch-100";

  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-pitch-400 mb-1 flex items-center gap-1">
        {icon && <span className="text-pitch-500">{icon}</span>}
        {label}
      </div>
      <div className={`font-mono text-xl sm:text-2xl font-bold stat-num leading-none ${valueClr}`}>
        {value}
      </div>
      {hint && (
        <div className="text-[10px] uppercase tracking-widest text-pitch-500 mt-1">
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
