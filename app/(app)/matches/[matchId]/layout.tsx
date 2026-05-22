import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  UserCircle2,
  Target,
  Users,
  Activity,
  Sparkles,
  Trophy,
  Share2,
} from "lucide-react";
import { TeamFlag } from "@/components/shared/TeamFlag";
import { MatchHeader } from "@/components/match/MatchHeader";
import { MatchTabs } from "@/components/match/MatchTabs";
import { AIMatchPreview } from "@/components/match/AIMatchPreview";
import { FormCard } from "@/components/match/FormCard";
import { HeadToHeadCard } from "@/components/match/HeadToHeadCard";
import { DataSourceBanner } from "@/components/shared/DataSourceBanner";
import { ModelExplainer } from "@/components/shared/ModelExplainer";
import { StickyMobileCTA } from "@/components/match/StickyMobileCTA";
import { getMatchDetail, getFixtureView } from "@/lib/match-data";
import { buildPreviewLive } from "@/lib/ai-preview";
import { teamById } from "@/lib/wc26-data";
import { formatKickoff, formatDateLabel } from "@/lib/utils";

export default async function MatchLayout({
  params,
  children,
}: {
  params: { matchId: string };
  children: React.ReactNode;
}) {
  // Demo match with full event data
  const match = getMatchDetail(params.matchId);
  if (match) {
    return (
      <>
        <div className="px-4 sm:px-6 py-6 pb-24 lg:pb-6 max-w-[1600px] mx-auto space-y-5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-pitch-400 hover:text-accent-300 transition-colors"
          >
            <ArrowLeft size={12} /> Back to dashboard
          </Link>
          <MatchHeader match={match} />
          <MatchTabs matchId={match.id} />
          <div className="pt-2">{children}</div>
        </div>
        <StickyMobileCTA matchId={match.id} />
      </>
    );
  }

  // Real fixture from the official schedule — render a lighter header
  const fixture = getFixtureView(params.matchId);
  if (!fixture) notFound();

  const preview = await buildPreviewLive(Number(params.matchId));

  return (
    <>
    <div className="px-4 sm:px-6 py-6 pb-24 lg:pb-6 max-w-[1600px] mx-auto space-y-5">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-pitch-400 hover:text-accent-300 transition-colors"
      >
        <ArrowLeft size={12} /> Back to dashboard
      </Link>

      <div className="card-panel p-4 sm:p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] grid-lines pointer-events-none" />
        <div className="relative">
          <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-widest mb-5">
            <span className="text-accent-400 font-semibold truncate">{fixture.stage}</span>
            <span className="font-mono text-pitch-300 text-right shrink-0">
              <span className="hidden sm:inline">
                {formatDateLabel(fixture.kickoff)} · {formatKickoff(fixture.kickoff)}
              </span>
              <span className="sm:hidden">{formatKickoff(fixture.kickoff)}</span>
            </span>
          </div>

          {/* Mobile: stack home / VS / away. Desktop: 3-col grid */}
          <div className="flex flex-col sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center gap-4 sm:gap-6">
            {fixture.teams.home ? (
              <FixtureTeamRow team={fixture.teams.home} align="right" />
            ) : (
              <div className="text-pitch-500 font-mono text-lg sm:text-right">TBD</div>
            )}
            <div className="font-mono text-2xl sm:text-3xl text-pitch-400 text-center">VS</div>
            {fixture.teams.away ? (
              <FixtureTeamRow team={fixture.teams.away} align="left" />
            ) : (
              <div className="text-pitch-500 font-mono text-lg">TBD</div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-pitch-700/60 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-pitch-400">
            <span className="flex items-center gap-1.5">
              <MapPin size={12} />
              {fixture.venue.name} · {fixture.venue.city}
            </span>
            {fixture.venue.capacity > 0 && (
              <span className="flex items-center gap-1.5">
                <UserCircle2 size={12} />
                {fixture.venue.capacity.toLocaleString()} capacity
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tipp denne — primary CTA, prominent before kickoff */}
      <div className="card-panel p-4 sm:p-5 ring-1 ring-accent-500/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 bg-gradient-to-r from-accent-500/10 via-transparent to-transparent">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-11 w-11 rounded-md bg-accent-500/15 flex items-center justify-center shrink-0">
            <Target size={20} className="text-accent-400" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold">Tipp denne kampen</div>
            <div className="text-xs text-pitch-400 mt-0.5">
              3 pts for exact score · 1 pt for correct outcome
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:shrink-0">
          <Link
            href={`/share/match/${fixture.id}`}
            className="flex-1 sm:flex-initial text-center rounded-md bg-pitch-800 hover:bg-pitch-700 text-pitch-200 text-xs font-semibold px-3 py-2 transition-colors flex items-center justify-center gap-1.5"
          >
            <Share2 size={12} /> Share
          </Link>
          <Link
            href="/predictions"
            className="flex-1 sm:flex-initial text-center rounded-md bg-accent-500 hover:bg-accent-400 text-pitch-950 text-xs font-semibold px-4 py-2 transition-colors flex items-center justify-center gap-1.5"
          >
            Tipp nå
          </Link>
        </div>
      </div>

      {preview && <AIMatchPreview preview={preview} />}

      {fixture.teams.home && fixture.teams.away && (() => {
        const homeTeam = teamById(fixture.teams.home.id);
        const awayTeam = teamById(fixture.teams.away.id);
        if (!homeTeam || !awayTeam) return null;
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <PrematchCard
              icon={<Users size={14} className="text-accent-400" />}
              title="Expected starting XI"
              status="Tap the Lineups tab — confirmed squads have probable XI on a pitch graphic."
            />
            <FormCard home={homeTeam} away={awayTeam} />
            <HeadToHeadCard home={homeTeam} away={awayTeam} />
          </div>
        );
      })()}

      <DataSourceBanner
        caveat="xG timeline, shots, possession and tactics populate live once the match starts."
      />

      <ModelExplainer />
    </div>
    <StickyMobileCTA matchId={fixture.id} />
    </>
  );
}

/**
 * Mobile-friendly team row: flag-left, name + formation right. On desktop
 * the home side is mirrored so it reads "name + flag" pinned to the right.
 */
function FixtureTeamRow({
  team,
  align,
}: {
  team: { id: number; name: string; shortName: string; flag: string; formation: string; manager: string };
  align: "left" | "right";
}) {
  return (
    <Link
      href={`/teams/${team.id}`}
      className={
        "flex items-center gap-3 sm:gap-4 min-w-0 group rounded-md -mx-2 px-2 py-1 hover:bg-pitch-800/40 transition-colors" +
        (align === "right"
          ? " sm:flex-row sm:justify-end sm:text-right"
          : " sm:flex-row sm:justify-start")
      }
    >
      <TeamFlag code={team.flag} size="lg" className={align === "right" ? "sm:hidden" : ""} />
      <div className={"min-w-0 flex-1 sm:flex-initial" + (align === "right" ? " sm:text-right" : "")}>
        <div className="text-lg sm:text-xl font-bold tracking-tight truncate group-hover:text-accent-200 transition-colors">
          {team.name}
        </div>
        <div className="text-[11px] uppercase tracking-widest text-pitch-400 font-mono mt-0.5 truncate">
          {team.formation}
          {team.manager && ` · ${team.manager}`}
        </div>
      </div>
      {align === "right" && (
        <TeamFlag code={team.flag} size="lg" className="hidden sm:inline-block" />
      )}
    </Link>
  );
}

function PrematchCard({
  icon,
  title,
  status,
}: {
  icon: React.ReactNode;
  title: string;
  status: string;
}) {
  return (
    <div className="card-panel p-4">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-pitch-300 font-semibold mb-2">
        {icon}
        {title}
      </div>
      <div className="text-xs text-pitch-500">{status}</div>
    </div>
  );
}
