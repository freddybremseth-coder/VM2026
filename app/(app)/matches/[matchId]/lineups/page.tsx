/**
 * /matches/[id]/lineups
 *
 * Real starting XI + bench per team, pulled from ESPN summary. Replaces
 * the previous getMatchDetail()-based implementation which only had
 * hard-coded data for the demo fixture (id=1001) and rendered "squad not
 * yet announced" for every real WC fixture.
 */

import { AlertTriangle } from "lucide-react";
import { Kicker } from "@/components/shared/EditorialKicker";
import { LineupCard } from "@/components/match/LineupCard";
import { fetchEspnMatchInfo } from "@/lib/match-events/espn-match-info";

export default async function LineupsPage({
  params,
}: {
  params: { matchId: string };
}) {
  const matchId = Number(params.matchId);
  if (!Number.isFinite(matchId)) return null;

  const info = await fetchEspnMatchInfo(matchId);

  if (!info) {
    return <NotReady />;
  }

  const hasLineups =
    info.home.starters.length > 0 || info.away.starters.length > 0;

  if (!hasLineups) {
    return <NotReady published="Startoppstillinger publiseres typisk én time før avspark." />;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between">
        <Kicker tone="signal">Oppstilling</Kicker>
        <span className="text-[10px] uppercase tracking-kicker font-mono text-cream/60">
          via ESPN
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <LineupCard side={info.home} teamName={info.homeName} prominent />
        <LineupCard side={info.away} teamName={info.awayName} prominent />
      </div>
    </div>
  );
}

function NotReady({
  published = "ESPN publiserer startoppstilling og benk like før avspark. Sjekk tilbake omtrent én time før kickoff.",
}: {
  published?: string;
}) {
  return (
    <div className="surface p-8 text-center">
      <AlertTriangle size={20} className="text-cream/50 mx-auto mb-3" />
      <h2 className="font-serif text-lg tracking-editorial text-cream/85 mb-1">
        Oppstilling er ikke klar ennå
      </h2>
      <p className="text-xs text-cream/55 max-w-md mx-auto">{published}</p>
    </div>
  );
}
