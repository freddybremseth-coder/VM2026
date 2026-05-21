import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, UserCircle2 } from "lucide-react";
import { TeamFlag } from "@/components/shared/TeamFlag";
import { MatchHeader } from "@/components/match/MatchHeader";
import { MatchTabs } from "@/components/match/MatchTabs";
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

      <div className="card-panel p-8 text-center">
        <div className="text-sm font-semibold text-pitch-200">
          Match data available at kickoff
        </div>
        <div className="text-xs text-pitch-500 mt-1">
          xG timeline, shots, possession and tactics will populate live once the
          match starts. In the meantime you can{" "}
          <Link href="/predictions" className="text-accent-300 hover:text-accent-200 underline underline-offset-2">
            submit a prediction
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
