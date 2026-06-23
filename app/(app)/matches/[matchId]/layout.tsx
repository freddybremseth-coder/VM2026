import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  UserCircle2,
  Target,
  Users,
  Share2,
  Lock,
} from "lucide-react";
import { HoloFlag } from "@/components/shared/HoloFlag";
import { StadiumBackdrop } from "@/components/shared/StadiumBackdrop";
import { Kicker } from "@/components/shared/EditorialKicker";
import { MatchHeader } from "@/components/match/MatchHeader";
import { MatchTabs } from "@/components/match/MatchTabs";
import { HeadToHeadCard } from "@/components/match/HeadToHeadCard";
import { LiveResultHero } from "@/components/match/LiveResultHero";
import { LiveGoalsList } from "@/components/match/LiveGoalsList";
import { DataSourceBanner } from "@/components/shared/DataSourceBanner";
import { ModelExplainer } from "@/components/shared/ModelExplainer";
import { StickyMobileCTA } from "@/components/match/StickyMobileCTA";
import { getMatchDetail, getFixtureView } from "@/lib/match-data";
import { getLiveMatch } from "@/lib/live-match";
import { canStillEdit } from "@/lib/predictions-visibility";
import { teamById, teamName } from "@/lib/wc26-data";
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
          <BackLink />
          <MatchHeader match={match} />
          <MatchTabs matchId={match.id} />
          <div className="pt-2">{children}</div>
        </div>
        <StickyMobileCTA matchId={match.id} />
      </>
    );
  }

  // Pre-match fixture view — cinematic StadiumBackdrop hero.
  // Fetch the authoritative live state in parallel with the AI preview so
  // a finished match can swap in a result hero + goals list instead of the
  // "Tipp denne kampen" CTA.
  const fixture = getFixtureView(params.matchId);
  if (!fixture) notFound();

  const matchId = Number(params.matchId);
  const live = await getLiveMatch(matchId);

  // Treat as started/finished if Supabase has a non-scheduled status row.
  const started =
    live !== null &&
    (live.status === "live" ||
      live.status === "halftime" ||
      live.status === "finished");
  const tippable = !started && canStillEdit(new Date(), {
    kickoff: live?.kickoff ?? fixture.kickoff,
    status: live?.status ?? "scheduled",
  });

  return (
    <>
      <div className="px-4 sm:px-6 py-6 pb-24 lg:pb-6 max-w-[1600px] mx-auto space-y-5">
        <BackLink />

        {started && live ? (
          <LiveResultHero match={live} />
        ) : (
          <StadiumBackdrop className="border border-cream/8">
            <div className="px-4 sm:px-6 py-6 sm:py-8">
              <div className="flex items-center justify-between gap-3 mb-6">
                <Kicker tone="signal">{fixture.stage}</Kicker>
                <span className="font-mono text-[11px] text-cream/70 text-right shrink-0 stat-num">
                  <span className="hidden sm:inline">
                    {formatDateLabel(fixture.kickoff)} · {formatKickoff(fixture.kickoff)}
                  </span>
                  <span className="sm:hidden">{formatKickoff(fixture.kickoff)}</span>
                </span>
              </div>

              <div className="flex flex-col sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center gap-5 sm:gap-8">
                {fixture.teams.home ? (
                  <FixtureTeamRow team={fixture.teams.home} align="right" />
                ) : (
                  <div className="font-mono text-cream/50 text-lg sm:text-right">TBD</div>
                )}
                <div className="font-serif text-3xl sm:text-5xl text-cream/50 text-center italic">
                  vs
                </div>
                {fixture.teams.away ? (
                  <FixtureTeamRow team={fixture.teams.away} align="left" />
                ) : (
                  <div className="font-mono text-cream/50 text-lg">TBD</div>
                )}
              </div>

              <div className="mt-7 pt-4 border-t border-cream/8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-kicker font-mono text-cream/55">
                <span className="flex items-center gap-1.5">
                  <MapPin size={11} />
                  {fixture.venue.name} · {fixture.venue.city}
                </span>
                {fixture.venue.capacity > 0 && (
                  <span className="flex items-center gap-1.5">
                    <UserCircle2 size={11} />
                    {fixture.venue.capacity.toLocaleString("nb-NO")} kapasitet
                  </span>
                )}
              </div>
            </div>
          </StadiumBackdrop>
        )}

        {tippable ? (
          // Pre-kickoff: invite the user to tip.
          <div className="surface p-4 sm:p-5 ring-1 ring-signal/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 bg-gradient-to-r from-signal/10 via-transparent to-transparent">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-11 w-11 bg-signal/15 flex items-center justify-center shrink-0">
                <Target size={20} className="text-signal" />
              </div>
              <div className="min-w-0">
                <div className="font-serif text-base font-semibold tracking-editorial">
                  Tipp denne kampen
                </div>
                <div className="text-[11px] text-cream/55 mt-0.5 font-mono">
                  3 pts for eksakt resultat · 1 pt for utfall
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:shrink-0">
              <Link
                href={`/share/match/${fixture.id}`}
                className="flex-1 sm:flex-initial text-center bg-paper hover:bg-paperHi border border-cream/8 text-cream/85 text-xs font-semibold px-3 py-2 transition-colors flex items-center justify-center gap-1.5"
              >
                <Share2 size={12} /> Del
              </Link>
              <Link
                href="/predictions"
                className="flex-1 sm:flex-initial text-center bg-signal hover:bg-signalD text-cream text-xs font-semibold px-4 py-2 transition-colors flex items-center justify-center gap-1.5"
              >
                Tipp nå
              </Link>
            </div>
          </div>
        ) : (
          // Kickoff passed (or cancelled): tipping closed.
          <div className="surface p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 bg-cream/5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-11 w-11 bg-cream/10 flex items-center justify-center shrink-0">
                <Lock size={18} className="text-cream/55" />
              </div>
              <div className="min-w-0">
                <div className="font-serif text-base font-semibold tracking-editorial">
                  Tipping er stengt
                </div>
                <div className="text-[11px] text-cream/55 mt-0.5 font-mono">
                  {live?.status === "finished"
                    ? "Kampen er ferdig — sjekk hvordan tippet ditt scoret."
                    : "Avspark har passert — tippene er låst og avsløres for ligaen."}
                </div>
              </div>
            </div>
            <Link
              href="/predictions"
              className="flex-1 sm:flex-initial text-center bg-paper hover:bg-paperHi border border-cream/8 text-cream/85 text-xs font-semibold px-4 py-2 transition-colors"
            >
              Se mine tips
            </Link>
          </div>
        )}

        {/* Goal log — only when there are goals to show (live + finished). */}
        {live && live.goals.length > 0 && (
          <LiveGoalsList
            goals={live.goals}
            home={live.teams.home}
            away={live.teams.away}
          />
        )}

        {fixture.teams.home && fixture.teams.away && (() => {
          const homeTeam = teamById(fixture.teams.home.id);
          const awayTeam = teamById(fixture.teams.away.id);
          if (!homeTeam || !awayTeam) return null;
          return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <PrematchCard
                icon={<Users size={14} className="text-signal" />}
                title="Forventet startoppstilling"
                status="Trykk på Lineups-fanen — bekreftede tropper har sannsynlig XI på en pitch-graf."
              />
              <HeadToHeadCard home={homeTeam} away={awayTeam} />
            </div>
          );
        })()}

        {!started && (
          <DataSourceBanner caveat="xG-timeline, skudd, ballbesittelse og taktikk populerer live når kampen er i gang." />
        )}

        <ModelExplainer />
      </div>
      <StickyMobileCTA matchId={fixture.id} tippable={tippable} />
    </>
  );
}

function BackLink() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-kicker font-mono text-cream/55 hover:text-signal transition-colors"
    >
      <ArrowLeft size={11} /> Tilbake til oversikt
    </Link>
  );
}

/**
 * Editorial fixture team row — links to /teams/[id]. Mobile shows flag-left,
 * desktop mirrors the home side flag-right around the central "vs".
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
        "flex items-center gap-3 sm:gap-4 min-w-0 group -mx-2 px-2 py-1 hover:bg-cream/5 transition-colors" +
        (align === "right"
          ? " sm:flex-row sm:justify-end sm:text-right"
          : " sm:flex-row sm:justify-start")
      }
    >
      <HoloFlag code={team.flag} w={42} className={align === "right" ? "sm:hidden" : ""} />
      <div className={"min-w-0 flex-1 sm:flex-initial" + (align === "right" ? " sm:text-right" : "")}>
        <div className="font-serif text-xl sm:text-2xl font-semibold tracking-editorial truncate group-hover:text-amber transition-colors">
          {teamName(team)}
        </div>
        <div className="text-[10px] uppercase tracking-kicker font-mono text-cream/55 mt-0.5 truncate">
          {team.formation}
          {team.manager && ` · ${team.manager}`}
        </div>
      </div>
      {align === "right" && (
        <HoloFlag code={team.flag} w={42} className="hidden sm:inline-block" />
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
    <div className="surface p-4">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-kicker text-cream/70 font-semibold mb-2">
        {icon}
        {title}
      </div>
      <div className="text-xs text-cream/55 leading-relaxed">{status}</div>
    </div>
  );
}
