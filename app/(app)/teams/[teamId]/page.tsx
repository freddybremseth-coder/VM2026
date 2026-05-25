import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HoloFlag } from "@/components/shared/HoloFlag";
import { StadiumBackdrop } from "@/components/shared/StadiumBackdrop";
import { Kicker, Headline } from "@/components/shared/EditorialKicker";
import { TopScorersList } from "@/components/shared/TopScorersList";
import { TeamStarsCard } from "@/components/team/TeamStarsCard";
import { TeamFormStripStatic } from "@/components/shared/TeamFormStrip";
import { teamById, teamName } from "@/lib/wc26-data";
import { getSquad } from "@/lib/wc26-squads";
import { SquadList } from "@/components/match/SquadList";
import { getTopScorers, getTopAssisters } from "@/lib/team-stats";
import { getTeamForm } from "@/lib/team-form";

export default async function TeamProfilePage({ params }: { params: { teamId: string } }) {
  const id = Number(params.teamId);
  const team = teamById(id);
  if (!team) notFound();

  const squad = getSquad(id);
  const startingXI = squad.filter((p) => p.startX !== undefined);
  const bench = squad.filter((p) => p.startX === undefined);

  const teamForm = await getTeamForm(id);

  const topScorers = getTopScorers(id, 5).map((l) => ({ ...l, teamId: id }));
  const topAssisters = getTopAssisters(id, 5).map((l) => ({ ...l, teamId: id }));

  return (
    <>
      {/* Cinematic team hero — StadiumBackdrop + huge flag + serif name */}
      <StadiumBackdrop className="border-b border-cream/8" height={320}>
        <div className="px-5 md:px-10 py-6 h-full flex flex-col">
          <Link
            href="/teams"
            className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-kicker font-mono text-cream/55 hover:text-signal transition-colors w-fit"
          >
            <ArrowLeft size={11} /> Alle lag
          </Link>

          <div className="flex-1" />

          <div className="flex items-end gap-5 sm:gap-7">
            <HoloFlag code={team.flag} w={84} radius={6} shimmer="strong" />
            <div className="flex-1 min-w-0">
              <Kicker tone="cream">
                Gruppe {team.group} · {team.confederation}
              </Kicker>
              <h1 className="font-serif text-3xl md:text-5xl font-semibold tracking-editorial leading-[1.02] mt-1.5 truncate">
                {teamName(team)}
              </h1>
              <div className="mt-3 text-[11px] text-cream/55 flex flex-wrap gap-x-5 gap-y-1 font-mono">
                {team.manager && <span>Manager: {team.manager}</span>}
                {team.preferredFormation && (
                  <span>Formasjon: {team.preferredFormation}</span>
                )}
                {team.fifaRank && (
                  <span>
                    FIFA rang: <span className="stat-num text-cream">#{team.fifaRank}</span>
                  </span>
                )}
              </div>
            </div>
            <SquadBadge status={team.squadStatus} />
          </div>
        </div>
      </StadiumBackdrop>

      <div className="px-5 md:px-10 py-8 max-w-[1100px] mx-auto space-y-5">
        {/* Pre-tournament form strip */}
        <div className="surface p-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Kicker tone="muted">Siste 5 landskamper</Kicker>
            <TeamFormStripStatic form={teamForm} />
          </div>
          <Link
            href="/predictions"
            className="text-[11px] uppercase tracking-kicker font-mono text-signal hover:text-amber font-semibold transition-colors"
          >
            Tipp {team.shortName} →
          </Link>
        </div>

        {squad.length > 0 && <TeamStarsCard teamId={id} />}

        {squad.length > 0 && (topScorers.length > 0 || topAssisters.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {topScorers.length > 0 && (
              <TopScorersList
                title={`Toppscorere · ${team.shortName}`}
                leaders={topScorers}
                metric="goals"
                subtitle="int. mål"
              />
            )}
            {topAssisters.length > 0 && (
              <TopScorersList
                title={`Assistkonger · ${team.shortName}`}
                leaders={topAssisters}
                metric="assists"
                subtitle="int. assists"
              />
            )}
          </div>
        )}

        {squad.length > 0 ? (
          <SquadList
            startingXI={startingXI}
            bench={bench}
            side="home"
            teamShortName={team.shortName}
          />
        ) : (
          <div className="surface p-8 text-center">
            <div className="font-serif text-base font-semibold tracking-editorial text-cream">
              Tropp ikke offentliggjort ennå
            </div>
            <div className="text-xs text-cream/55 mt-1 font-mono">
              Forbundet har ikke publisert preliminær tropp.
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function SquadBadge({ status }: { status: "official" | "preliminary" | "pending" }) {
  const styles = {
    official: "bg-win/15 text-win",
    preliminary: "bg-amber/15 text-amber",
    pending: "bg-paper/40 text-cream/55 border border-cream/12",
  }[status];
  const label =
    status === "preliminary" ? "Preliminær" : status === "official" ? "Offisiell" : "Pending";
  return (
    <span
      className={`text-[10px] uppercase tracking-kicker font-mono px-2 py-1 shrink-0 self-start ${styles}`}
    >
      {label}
    </span>
  );
}
