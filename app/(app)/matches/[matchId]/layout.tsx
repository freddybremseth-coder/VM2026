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
} from "lucide-react";
import { TeamFlag } from "@/components/shared/TeamFlag";
import { MatchHeader } from "@/components/match/MatchHeader";
import { MatchTabs } from "@/components/match/MatchTabs";
import { DataSourceBanner } from "@/components/shared/DataSourceBanner";
import { getMatchDetail, getFixtureView } from "@/lib/match-data";
import { formatKickoff, formatDateLabel } from "@/lib/utils";

export default function MatchLayout({
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
      <div className="px-6 py-6 max-w-[1600px] mx-auto space-y-5">
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
    );
  }

  // Real fixture from the official schedule — render a lighter header
  const fixture = getFixtureView(params.matchId);
  if (!fixture) notFound();

  return (
    <div className="px-6 py-6 max-w-[1600px] mx-auto space-y-5">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-pitch-400 hover:text-accent-300 transition-colors"
      >
        <ArrowLeft size={12} /> Back to dashboard
      </Link>

      <div className="card-panel p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] grid-lines pointer-events-none" />
        <div className="relative">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-widest mb-5">
            <span className="text-accent-400 font-semibold">{fixture.stage}</span>
            <span className="font-mono text-pitch-300">
              {formatDateLabel(fixture.kickoff)} · {formatKickoff(fixture.kickoff)}
            </span>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6">
            {fixture.teams.home ? (
              <div className="flex items-center justify-end gap-4 text-right">
                <div>
                  <div className="text-xl font-bold tracking-tight">{fixture.teams.home.name}</div>
                  <div className="text-[11px] uppercase tracking-widest text-pitch-400 font-mono mt-0.5">
                    {fixture.teams.home.formation}
                    {fixture.teams.home.manager && ` · ${fixture.teams.home.manager}`}
                  </div>
                </div>
                <TeamFlag code={fixture.teams.home.flag} size="lg" />
              </div>
            ) : (
              <div className="text-right text-pitch-500 font-mono text-lg">TBD</div>
            )}
            <div className="font-mono text-3xl text-pitch-400">VS</div>
            {fixture.teams.away ? (
              <div className="flex items-center gap-4">
                <TeamFlag code={fixture.teams.away.flag} size="lg" />
                <div>
                  <div className="text-xl font-bold tracking-tight">{fixture.teams.away.name}</div>
                  <div className="text-[11px] uppercase tracking-widest text-pitch-400 font-mono mt-0.5">
                    {fixture.teams.away.formation}
                    {fixture.teams.away.manager && ` · ${fixture.teams.away.manager}`}
                  </div>
                </div>
              </div>
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
      <div className="card-panel p-5 ring-1 ring-accent-500/30 flex items-center justify-between gap-4 bg-gradient-to-r from-accent-500/10 via-transparent to-transparent">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-11 w-11 rounded-md bg-accent-500/15 flex items-center justify-center shrink-0">
            <Target size={20} className="text-accent-400" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold">Tipp denne kampen</div>
            <div className="text-xs text-pitch-400 mt-0.5">
              3 pts for exact score · 1 pt for correct outcome · locks at kickoff
            </div>
          </div>
        </div>
        <Link
          href="/predictions"
          className="rounded-md bg-accent-500 hover:bg-accent-400 text-pitch-950 text-xs font-semibold px-4 py-2 transition-colors flex items-center gap-1.5 shrink-0"
        >
          Tipp nå
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <PrematchCard
          icon={<Users size={14} className="text-accent-400" />}
          title="Expected starting XI"
          status="Available 30 min before kickoff"
        />
        <PrematchCard
          icon={<Activity size={14} className="text-data-400" />}
          title="Last 5 matches"
          status="Coming next"
        />
        <PrematchCard
          icon={<Sparkles size={14} className="text-accent-400" />}
          title="AI match preview"
          status="ChatGenius will draft a 3-line scouting brief at kickoff"
        />
        <PrematchCard
          icon={<Trophy size={14} className="text-draw" />}
          title="Head-to-head history"
          status="Coming next"
        />
      </div>

      <DataSourceBanner
        caveat="xG timeline, shots, possession and tactics populate live once the match starts."
      />
    </div>
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
