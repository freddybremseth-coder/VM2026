/**
 * /tippemodell/[matchId] — line-movement detail for one match.
 *
 * Shows how the best 1X2 price moved across every cron snapshot since the
 * match was first ingested. Sparse early (one point per 3-hour tick) and
 * fills in over time. Renders an honest "not enough history yet" state
 * when there's only a single snapshot.
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { Kicker, Headline } from "@/components/shared/EditorialKicker";
import { LineMovementChart } from "@/components/tippemodell/LineMovementChart";
import { getLineMovement } from "@/lib/tippemodell/line-movement";
import { formatKickoff, formatDateLabel } from "@/lib/utils";

export default async function LineMovementPage({
  params,
}: {
  params: { matchId: string };
}) {
  const matchId = Number(params.matchId);
  if (!Number.isFinite(matchId)) notFound();

  const movement = await getLineMovement(matchId);
  if (!movement) notFound();

  return (
    <div className="px-5 md:px-10 py-8 max-w-[1000px] mx-auto">
      <Link
        href="/tippemodell"
        className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-kicker font-mono text-cream/55 hover:text-signal transition-colors"
      >
        <ArrowLeft size={11} /> Tilbake til tippemodell
      </Link>

      <header className="mt-4 mb-6">
        <Kicker tone="signal">
          <span className="inline-flex items-center gap-2">
            <TrendingUp size={11} /> Linjebevegelse
          </span>
        </Kicker>
        <Headline rank="h1" className="mt-2">
          {movement.homeTeam} — {movement.awayTeam}
        </Headline>
        <p className="text-sm text-cream/55 mt-2 font-mono">
          {formatDateLabel(movement.commenceAt)} · {formatKickoff(movement.commenceAt)} ·{" "}
          {movement.snapshots}{" "}
          {movement.snapshots === 1 ? "måling" : "målinger"}
        </p>
      </header>

      {movement.snapshots < 2 ? (
        <div className="surface p-8 text-center">
          <TrendingUp size={18} className="text-cream/35 mx-auto mb-3" />
          <h2 className="font-serif text-lg tracking-editorial text-cream/85 mb-1">
            Ikke nok historikk ennå
          </h2>
          <p className="text-xs text-cream/55 max-w-md mx-auto">
            Linjebevegelse trenger minst to målinger. Cron-jobben lagrer et
            nytt øyeblikksbilde hver 3. time — kom tilbake senere for å se
            hvordan oddsen utvikler seg fram mot avspark.
          </p>
        </div>
      ) : (
        <div className="surface p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-[10px] uppercase tracking-kicker font-mono font-semibold text-cream/70">
              Beste 1X2-pris over tid
            </h2>
          </div>
          <LineMovementChart
            points={movement.points}
            homeTeam={movement.homeTeam}
            awayTeam={movement.awayTeam}
          />
          <div className="mt-4 pt-3 border-t border-cream/8 text-[10px] text-cream/45 font-mono leading-relaxed">
            Hver linje er den beste tilgjengelige oddsen på tvers av alle
            bookmakere for det utfallet, målt ved hvert cron-øyeblikksbilde.
            Stigende linje = utfallet blir mindre sannsynlig i markedet;
            fallende = mer sannsynlig.
          </div>
        </div>
      )}
    </div>
  );
}
