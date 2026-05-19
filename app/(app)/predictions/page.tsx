import Link from "next/link";
import { Target, LogIn, Lock } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PredictionForm } from "@/components/prediction/PredictionForm";
import { TeamFlag } from "@/components/shared/TeamFlag";
import { formatKickoff } from "@/lib/utils";
import todayData from "@/mock/matches/today.json";
import type { MatchSummary } from "@/lib/types";

export default async function PredictionsPage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const matches = todayData.matches as MatchSummary[];

  const openMatches = matches.filter((m) => m.status === "scheduled");
  const lockedMatches = matches.filter((m) => m.status !== "scheduled");

  let existingByMatch = new Map<number, { home_score: number; away_score: number }>();
  if (user) {
    const ids = matches.map((m) => m.id);
    const { data } = await supabase
      .from("predictions")
      .select("match_id, home_score, away_score")
      .eq("user_id", user.id)
      .in("match_id", ids);
    if (data) {
      existingByMatch = new Map(
        data.map((r) => [r.match_id, { home_score: r.home_score, away_score: r.away_score }]),
      );
    }
  }

  return (
    <div className="px-6 py-6 max-w-[1100px] mx-auto space-y-8">
      <header>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-accent-400 font-semibold mb-1">
          <Target size={12} />
          Predictions
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Your tips for today
        </h1>
        <p className="text-sm text-pitch-400 mt-1">
          Tip the score before kickoff. Predictions lock as soon as the match starts.
        </p>
      </header>

      {!user && <SignInPrompt />}

      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest font-semibold text-pitch-200">
          Open · {openMatches.length} {openMatches.length === 1 ? "match" : "matches"}
        </h2>
        {openMatches.length === 0 ? (
          <div className="card-panel p-6 text-center text-sm text-pitch-500">
            No more matches open for tips today.
          </div>
        ) : !user ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 opacity-50 pointer-events-none">
            {openMatches.map((m) => (
              <PreviewCard key={m.id} match={m} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {openMatches.map((m) => (
              <PredictionForm
                key={m.id}
                match={m}
                existing={existingByMatch.get(m.id)}
              />
            ))}
          </div>
        )}
      </section>

      {lockedMatches.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest font-semibold text-pitch-200 flex items-center gap-1.5">
            <Lock size={11} /> Locked
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {lockedMatches.map((m) => (
              <LockedCard
                key={m.id}
                match={m}
                tip={existingByMatch.get(m.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SignInPrompt() {
  return (
    <div className="card-panel p-5 ring-1 ring-accent-500/20 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-md bg-accent-500/15 flex items-center justify-center">
          <LogIn size={18} className="text-accent-400" />
        </div>
        <div>
          <div className="text-sm font-semibold">Sign in to save tips</div>
          <div className="text-xs text-pitch-400 mt-0.5">
            Your tips are stored in your account and earn points when matches end.
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href="/login"
          className="rounded-md bg-accent-500 hover:bg-accent-400 text-pitch-950 text-xs font-semibold px-3 py-1.5"
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className="rounded-md bg-pitch-800 hover:bg-pitch-700 text-pitch-100 text-xs font-semibold px-3 py-1.5"
        >
          Register
        </Link>
      </div>
    </div>
  );
}

function PreviewCard({ match }: { match: MatchSummary }) {
  return (
    <div className="card-panel p-4">
      <div className="text-[11px] uppercase tracking-widest text-pitch-400 mb-3">
        {match.stage} · {formatKickoff(match.kickoff)}
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <TeamFlag code={match.home.flag} size="md" />
          <span className="text-sm font-semibold">{match.home.shortName}</span>
        </div>
        <span className="font-mono text-pitch-500 text-sm">VS</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{match.away.shortName}</span>
          <TeamFlag code={match.away.flag} size="md" />
        </div>
      </div>
    </div>
  );
}

function LockedCard({
  match,
  tip,
}: {
  match: MatchSummary;
  tip?: { home_score: number; away_score: number };
}) {
  return (
    <div className="card-panel p-4 opacity-80">
      <div className="text-[11px] uppercase tracking-widest text-pitch-400 mb-3 flex items-center justify-between">
        <span>{match.stage}</span>
        <span className="text-pitch-500 font-mono">
          {match.status === "finished" ? "FT" : match.status === "live" ? `${match.minute}'` : "—"}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <TeamFlag code={match.home.flag} size="md" />
          <span className="text-sm font-semibold">{match.home.shortName}</span>
        </div>
        <div className="font-mono text-lg font-bold stat-num">
          {match.score ? `${match.score.home}–${match.score.away}` : "—"}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{match.away.shortName}</span>
          <TeamFlag code={match.away.flag} size="md" />
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-pitch-700/60 text-[11px] font-mono text-pitch-400 flex justify-between">
        <span>Your tip</span>
        <span className={tip ? "text-pitch-100" : "text-pitch-500"}>
          {tip ? `${tip.home_score}–${tip.away_score}` : "Not submitted"}
        </span>
      </div>
    </div>
  );
}
