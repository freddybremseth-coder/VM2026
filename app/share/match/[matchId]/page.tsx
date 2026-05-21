import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Share2 } from "lucide-react";
import { fixtureById } from "@/lib/wc26-fixtures";
import { teamById } from "@/lib/wc26-data";
import { buildPreview } from "@/lib/ai-preview";
import { TeamFlag } from "@/components/shared/TeamFlag";
import { AppLogoWordmark } from "@/components/shared/Logo";
import { CopyLinkButton } from "@/components/shared/CopyLinkButton";
import { formatKickoff, formatDateLabel } from "@/lib/utils";

interface Params {
  params: { matchId: string };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const fixture = fixtureById(Number(params.matchId));
  if (!fixture) return { title: "WC26 — Share" };
  const home = fixture.homeId ? teamById(fixture.homeId) : undefined;
  const away = fixture.awayId ? teamById(fixture.awayId) : undefined;
  const title = home && away ? `${home.name} vs ${away.name} — WC26` : "WC26 match";
  return {
    title,
    description: "AI-powered World Cup predictions with friends — by ChatGenius.",
    openGraph: { title, type: "website" },
    twitter: { card: "summary_large_image", title },
  };
}

export default function MatchSharePage({ params }: Params) {
  const fixture = fixtureById(Number(params.matchId));
  if (!fixture) notFound();
  const home = fixture.homeId ? teamById(fixture.homeId) : undefined;
  const away = fixture.awayId ? teamById(fixture.awayId) : undefined;
  if (!home || !away) notFound();
  const preview = buildPreview(fixture.id);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 grid-lines">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <AppLogoWordmark size={36} />
          </Link>
          <Link
            href={`/matches/${fixture.id}`}
            className="text-xs text-pitch-400 hover:text-accent-300 flex items-center gap-1"
          >
            Match center <ArrowRight size={11} />
          </Link>
        </div>

        <div className="card-panel p-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04] grid-lines pointer-events-none" />
          <div className="relative">
            <div className="text-[10px] uppercase tracking-widest text-accent-400 font-semibold mb-4">
              {fixture.stage.kind === "group"
                ? `Group ${fixture.stage.group} · Matchday ${fixture.stage.matchday}`
                : "Knockout"}{" "}
              · {formatDateLabel(fixture.kickoff)} · {formatKickoff(fixture.kickoff)} CET
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 mb-6">
              <div className="flex items-center justify-end gap-3 text-right">
                <div>
                  <div className="text-2xl font-bold tracking-tight">{home.name}</div>
                  <div className="text-[11px] uppercase tracking-widest text-pitch-400 font-mono mt-1">
                    {home.shortName}
                  </div>
                </div>
                <TeamFlag code={home.flag} size="lg" />
              </div>
              <div className="font-mono text-2xl font-bold text-data-300">VS</div>
              <div className="flex items-center gap-3">
                <TeamFlag code={away.flag} size="lg" />
                <div>
                  <div className="text-2xl font-bold tracking-tight">{away.name}</div>
                  <div className="text-[11px] uppercase tracking-widest text-pitch-400 font-mono mt-1">
                    {away.shortName}
                  </div>
                </div>
              </div>
            </div>

            {preview && (
              <div className="rounded-md bg-data-500/10 ring-1 ring-data-500/30 p-4 text-sm text-pitch-200 leading-relaxed">
                <span className="text-data-300 font-mono text-xs mr-2 font-bold">AI</span>
                {preview.recommendation}
              </div>
            )}
          </div>
        </div>

        <div className="card-panel p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-accent-500/15 flex items-center justify-center">
              <Share2 size={18} className="text-accent-400" />
            </div>
            <div>
              <div className="text-sm font-semibold">Share this match</div>
              <div className="text-xs text-pitch-400 mt-0.5">
                Slack, X and Discord will preview the card automatically.
              </div>
            </div>
          </div>
          <CopyLinkButton />
        </div>

        <Link
          href="/predictions"
          className="block text-center text-xs text-accent-300 hover:text-accent-200 underline underline-offset-2"
        >
          Tip the rest of the tournament →
        </Link>
      </div>
    </div>
  );
}
