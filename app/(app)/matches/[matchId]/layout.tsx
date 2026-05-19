import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MatchHeader } from "@/components/match/MatchHeader";
import { MatchTabs } from "@/components/match/MatchTabs";
import { getMatchDetail } from "@/lib/match-data";

export default function MatchLayout({
  params,
  children,
}: {
  params: { matchId: string };
  children: React.ReactNode;
}) {
  const match = getMatchDetail(params.matchId);
  if (!match) notFound();

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
