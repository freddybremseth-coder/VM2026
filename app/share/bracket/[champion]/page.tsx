import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Crown, ArrowRight, Share2 } from "lucide-react";
import { teamByShortName, teamName } from "@/lib/wc26-data";
import { TeamFlag } from "@/components/shared/TeamFlag";
import { AppLogoWordmark } from "@/components/shared/Logo";
import { CopyLinkButton } from "@/components/shared/CopyLinkButton";

interface Params {
  params: { champion: string };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const team = teamByShortName(params.champion.toUpperCase());
  const title = team ? `Min mester: ${teamName(team)} vinner VM 2026` : "WC26 bracket";
  return {
    title,
    description: "Build your own World Cup 2026 bracket with the ChatGenius simulator.",
    openGraph: { title, type: "website" },
    twitter: { card: "summary_large_image", title },
  };
}

export default function BracketSharePage({ params }: Params) {
  const team = teamByShortName(params.champion.toUpperCase());
  if (!team) notFound();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 grid-lines">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <AppLogoWordmark size={36} />
          </Link>
          <Link
            href="/bracket"
            className="text-xs text-pitch-400 hover:text-accent-300 flex items-center gap-1"
          >
            Build yours <ArrowRight size={11} />
          </Link>
        </div>

        <div className="card-panel p-8 ring-1 ring-accent-500/30 relative overflow-hidden bg-gradient-to-br from-accent-500/10 via-transparent to-data-500/10">
          <div className="absolute inset-0 opacity-[0.04] grid-lines pointer-events-none" />
          <div className="relative flex flex-col items-center text-center gap-5">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-draw font-semibold">
              <Crown size={14} />
              My predicted champion
            </div>
            <TeamFlag code={team.flag} size="lg" className="!h-20 !w-32" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{teamName(team)}</h1>
            <div className="text-xs uppercase tracking-widest text-pitch-400 font-mono px-3 py-1 rounded-full bg-pitch-800/60">
              Group {team.group} · FIFA #{team.fifaRank ?? "—"}
            </div>
          </div>
        </div>

        <div className="card-panel p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-accent-500/15 flex items-center justify-center">
              <Share2 size={18} className="text-accent-400" />
            </div>
            <div>
              <div className="text-sm font-semibold">Share your bracket</div>
              <div className="text-xs text-pitch-400 mt-0.5">
                Posted in Slack, X or Discord the card auto-previews.
              </div>
            </div>
          </div>
          <CopyLinkButton />
        </div>

        <Link
          href="/bracket"
          className="block text-center text-xs text-accent-300 hover:text-accent-200 underline underline-offset-2"
        >
          Build a different bracket →
        </Link>
      </div>
    </div>
  );
}
