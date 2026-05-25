import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Share2 } from "lucide-react";
import { fixtureById } from "@/lib/wc26-fixtures";
import { teamById, teamName } from "@/lib/wc26-data";
import { TeamFlag } from "@/components/shared/TeamFlag";
import { AppLogoWordmark } from "@/components/shared/Logo";
import { CopyLinkButton } from "@/components/shared/CopyLinkButton";

interface Params {
  params: { matchId: string; score: string };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const fixture = fixtureById(Number(params.matchId));
  if (!fixture) return { title: "WC26 — my tip" };
  const home = fixture.homeId ? teamById(fixture.homeId) : undefined;
  const away = fixture.awayId ? teamById(fixture.awayId) : undefined;
  const title =
    home && away
      ? `My tip: ${home.shortName} ${params.score.replace("-", "–")} ${away.shortName}`
      : "WC26 — my tip";
  return {
    title,
    description: "My World Cup 2026 score prediction — ChatGenius",
    openGraph: { title, type: "website" },
    twitter: { card: "summary_large_image", title },
  };
}

export default function TipSharePage({ params }: Params) {
  const fixture = fixtureById(Number(params.matchId));
  if (!fixture) notFound();
  const home = fixture.homeId ? teamById(fixture.homeId) : undefined;
  const away = fixture.awayId ? teamById(fixture.awayId) : undefined;
  if (!home || !away) notFound();

  const [hRaw, aRaw] = params.score.split("-");
  const homeScore = Number.parseInt(hRaw ?? "", 10);
  const awayScore = Number.parseInt(aRaw ?? "", 10);
  if (!Number.isInteger(homeScore) || !Number.isInteger(awayScore)) notFound();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 grid-lines">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <AppLogoWordmark size={36} />
          </Link>
          <Link
            href={`/matches/${fixture.id}`}
            className="text-xs text-pitch-300 hover:text-accent-300 flex items-center gap-1"
          >
            Match center <ArrowRight size={11} />
          </Link>
        </div>

        <div className="card-panel p-6 sm:p-8 ring-1 ring-accent-500/30 relative overflow-hidden bg-gradient-to-br from-accent-500/10 via-transparent to-data-500/10">
          <div className="absolute inset-0 opacity-[0.04] grid-lines pointer-events-none" />
          <div className="relative flex flex-col items-center text-center gap-5">
            <div className="text-[10px] uppercase tracking-widest text-accent-400 font-semibold">
              My tip
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-5 sm:gap-8 w-full">
              <div className="flex flex-col items-end gap-2 text-right">
                <TeamFlag code={home.flag} size="lg" />
                <div className="text-base sm:text-lg font-bold tracking-tight">
                  {teamName(home)}
                </div>
              </div>
              <div className="flex items-center gap-3 font-mono font-extrabold stat-num text-data-300 text-5xl sm:text-7xl leading-none">
                <span>{homeScore}</span>
                <span className="text-pitch-500 text-3xl sm:text-5xl">·</span>
                <span>{awayScore}</span>
              </div>
              <div className="flex flex-col items-start gap-2">
                <TeamFlag code={away.flag} size="lg" />
                <div className="text-base sm:text-lg font-bold tracking-tight">
                  {teamName(away)}
                </div>
              </div>
            </div>

            <div className="text-[11px] uppercase tracking-widest text-pitch-400 font-mono">
              3 pts exact · 1 pt outcome
            </div>
          </div>
        </div>

        <div className="card-panel p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-accent-500/15 flex items-center justify-center">
              <Share2 size={18} className="text-accent-400" />
            </div>
            <div>
              <div className="text-sm font-semibold">Share my tip</div>
              <div className="text-xs text-pitch-400 mt-0.5">
                Posted in Slack / X / Discord the card auto-previews.
              </div>
            </div>
          </div>
          <CopyLinkButton />
        </div>

        <Link
          href="/predictions"
          className="block text-center text-xs text-accent-300 hover:text-accent-200 underline underline-offset-2"
        >
          Tip more matches →
        </Link>
      </div>
    </div>
  );
}
