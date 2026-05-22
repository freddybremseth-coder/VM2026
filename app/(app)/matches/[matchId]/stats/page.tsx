/**
 * /matches/:matchId/stats
 *
 * Server component: fetches MatchEventData once at render time (SSR snapshot),
 * then hands it to the LiveEventPanel client component which polls for updates.
 */

import { getMatchEvents } from "@/lib/match-events/provider";
import { LiveEventPanel } from "@/components/match/LiveEventPanel";

export default async function StatsPage({
  params,
}: {
  params: { matchId: string };
}) {
  const id = Number(params.matchId);
  let initialData = null;
  try {
    initialData = await getMatchEvents(id);
  } catch {
    // Let the client component handle the error state
  }

  return (
    <LiveEventPanel
      matchId={id}
      initialData={initialData ?? undefined}
    />
  );
}
