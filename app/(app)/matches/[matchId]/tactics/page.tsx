import { TabStub } from "@/components/match/TabStub";
import { TacticsView } from "@/components/match/TacticsView";
import { fetchEspnMatchInfo } from "@/lib/match-events/espn-match-info";

export default async function TacticsPage({
  params,
}: {
  params: { matchId: string };
}) {
  const matchId = Number(params.matchId);
  if (!Number.isFinite(matchId)) {
    return <TabStub title="Tactical breakdown" />;
  }
  const info = await fetchEspnMatchInfo(matchId);
  if (!info) {
    return <TabStub title="Tactical breakdown" />;
  }
  return <TacticsView info={info} />;
}
