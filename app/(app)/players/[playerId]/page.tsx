import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Cpu, Trophy, Crown, Clock, Sparkles, Target } from "lucide-react";
import { HoloFlag } from "@/components/shared/HoloFlag";
import { Kicker } from "@/components/shared/EditorialKicker";
import { DataSourceBanner } from "@/components/shared/DataSourceBanner";
import { getAllPlayers, getSquad, getPlayerMinutes } from "@/lib/wc26-squads";
import { teamById } from "@/lib/wc26-data";
import { getPlayerEventData } from "@/lib/match-events/provider";
import { PlayerMatchData } from "@/components/match/PlayerMatchData";

/**
 * Player profile — editorial portrait card + tactician stats grid.
 *
 * Number tile in amber/signal radial, serif name, mono kicker for team/position.
 * Six-stat international block (alder · caps · mål · assists · minutter · G+A)
 * with a minutes-per-goal sentence underneath when applicable.
 */
export default async function PlayerProfilePage({
  params,
}: {
  params: { playerId: string };
}) {
  const id = Number(params.playerId);
  const player = getAllPlayers().find((p) => p.id === id);
  if (!player) notFound();
  const team = teamById(player.teamId);
  const teammates = team
    ? getSquad(team.id).filter(
        (p) => p.id !== player.id && p.position === player.position,
      )
    : [];
  const eventData = await getPlayerEventData(player.id);

  const intMinutes = getPlayerMinutes(player);
  const goalsPerCap =
    player.caps && player.caps > 0 ? (player.goals ?? 0) / player.caps : null;
  const minutesPerGoal =
    player.goals && player.goals > 0 ? Math.round(intMinutes / player.goals) : null;
  const goalsPlusAssists = (player.goals ?? 0) + (player.assists ?? 0);

  return (
    <div className="px-4 sm:px-6 md:px-10 py-8 max-w-[1100px] mx-auto space-y-5">
      <Link
        href="/players"
        className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-kicker font-mono text-cream/55 hover:text-signal transition-colors"
      >
        <ArrowLeft size={11} /> Alle spillere
      </Link>

      <div className="surface p-5 sm:p-6 relative overflow-hidden">
        <div className="relative flex flex-col sm:flex-row items-start gap-5">
          <div
            className="h-24 w-24 flex items-center justify-center font-serif font-semibold text-canvas text-3xl tracking-[-0.04em] shrink-0"
            style={{
              background:
                "radial-gradient(circle at 40% 40%, hsl(var(--amber)) 0%, hsl(var(--signal-deep)) 100%)",
            }}
          >
            {player.number || "—"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-kicker font-mono text-cream/55 flex-wrap mb-2">
              {team && (
                <Link
                  href={`/teams/${team.id}`}
                  className="flex items-center gap-1.5 hover:text-amber transition-colors"
                >
                  <HoloFlag code={team.flag} w={18} radius={2} /> {team.name}
                </Link>
              )}
              <span className="text-cream/35">·</span>
              <span>{player.position}</span>
              {player.isCaptain && <span className="text-signal">· (C)</span>}
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-editorial leading-[1.02]">
              {player.name}
            </h1>
            <p className="text-sm text-cream/55 mt-1.5 font-mono">{player.club}</p>
          </div>
        </div>

        {/* International stats */}
        <div className="mt-6 pt-4 border-t border-cream/8">
          <Kicker tone="muted">
            <span className="inline-flex items-center gap-1.5">
              <Target size={10} className="text-signal" />
              Landslagsstatistikk
            </span>
          </Kicker>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 mt-3">
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
              amber
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
            <p className="mt-3 text-[11px] text-cream/55 font-mono">
              <span className="stat-num text-cream">
                {minutesPerGoal.toLocaleString("nb-NO")}
              </span>{" "}
              minutter per mål for landslaget
            </p>
          )}
        </div>
      </div>

      {teammates.length > 0 && (
        <section className="surface p-5">
          <Kicker tone="muted">Andre {player.position}-er i troppen</Kicker>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-cream/8 mt-3">
            {teammates.map((t) => (
              <Link
                key={t.id}
                href={`/players/${t.id}`}
                className="bg-paper hover:bg-paperHi px-3 py-2 text-sm flex items-center gap-2 transition-colors group"
              >
                <span className="font-mono text-cream/55 w-6 text-right stat-num">
                  {t.number || "—"}
                </span>
                <span className="flex-1 truncate font-serif tracking-editorial text-cream group-hover:text-amber transition-colors">
                  {t.name}
                </span>
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
        <DataSourceBanner caveat="Heatmaps og kampdata aktiveres når turneringen starter og live-feed er koblet til." />
      )}

      <div className="surface p-5 flex items-start gap-3">
        <Cpu size={14} className="text-signal shrink-0 mt-0.5" />
        <p className="text-xs text-cream/70 leading-relaxed">
          <span className="font-serif font-semibold text-cream tracking-editorial">
            Kommer:
          </span>{" "}
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
  amber,
  hint,
  icon,
}: {
  label: string;
  value: number | string;
  accent?: boolean;
  amber?: boolean;
  hint?: string;
  icon?: React.ReactNode;
}) {
  const valueClr = accent
    ? "text-signal"
    : amber
    ? "text-amber"
    : "text-cream";

  return (
    <div>
      <div className="text-[10px] uppercase tracking-kicker text-cream/55 mb-1 flex items-center gap-1 font-mono">
        {icon && <span className="text-cream/45">{icon}</span>}
        {label}
      </div>
      <div
        className={`font-serif text-2xl sm:text-3xl font-semibold stat-num leading-none tracking-[-0.02em] ${valueClr}`}
      >
        {value}
      </div>
      {hint && (
        <div className="text-[9px] uppercase tracking-kicker text-cream/45 mt-1 font-mono">
          {hint}
        </div>
      )}
    </div>
  );
}

