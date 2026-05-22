import Link from "next/link";
import { Target, LogIn, Lock, Calendar, Sparkles } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PredictionForm } from "@/components/prediction/PredictionForm";
import { GuestPredictionForm } from "@/components/prediction/GuestPredictionForm";
import { GuestMigrationPrompt } from "@/components/prediction/GuestMigrationPrompt";
import { formatDateLabel } from "@/lib/utils";
import { nextFixtures, type Fixture } from "@/lib/wc26-fixtures";
import { teamById, venueById } from "@/lib/wc26-data";
import { getDictionary } from "@/lib/i18n";

const STAGE_LABEL_KO: Record<string, string> = {
  R32: "Round of 32",
  R16: "Round of 16",
  QF: "Quarter-final",
  SF: "Semi-final",
  "3RD": "Third place",
  FINAL: "Final",
};

function stageLabel(f: Fixture): string {
  return f.stage.kind === "group"
    ? `Group ${f.stage.group} · MD${f.stage.matchday}`
    : STAGE_LABEL_KO[f.stage.round];
}

function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

export default async function PredictionsPage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const t = getDictionary();

  const now = new Date();
  // No limit — give every future fixture with a known pairing.
  const open = nextFixtures(now.toISOString(), 200).filter(
    (f) => f.homeId && f.awayId,
  );

  // Group fixtures by date so the page stays scannable when there are 50+ of them.
  const byDay = new Map<string, Fixture[]>();
  for (const f of open) {
    const k = dayKey(f.kickoff);
    if (!byDay.has(k)) byDay.set(k, []);
    byDay.get(k)!.push(f);
  }
  const days = Array.from(byDay.entries()).sort(([a], [b]) => a.localeCompare(b));

  let existingByMatch = new Map<number, { home_score: number; away_score: number }>();
  if (user && open.length > 0) {
    const ids = open.map((f) => f.id);
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
          {t.predictions.title}
        </h1>
        <p className="text-sm text-pitch-400 mt-1">{t.predictions.subtitle}</p>
      </header>

      {!user && <GuestBanner labels={t.predictions.guestBanner} signInLabel={t.common.signIn} registerLabel={t.common.register} />}
      {user && <GuestMigrationPrompt />}

      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest font-semibold text-pitch-200">
          {t.predictions.open(open.length)}
        </h2>
        {open.length === 0 ? (
          <div className="card-panel p-6 text-center text-sm text-pitch-500">
            {t.predictions.none}
          </div>
        ) : (
          <div className="space-y-6">
            {days.map(([day, fixtures]) => (
              <DaySection
                key={day}
                day={day}
                fixtures={fixtures}
                user={user}
                existingByMatch={existingByMatch}
              />
            ))}
          </div>
        )}
      </section>

      <section className="card-panel p-4 flex items-start gap-3">
        <Lock size={14} className="text-pitch-500 shrink-0 mt-0.5" />
        <p className="text-xs text-pitch-400 leading-relaxed">
          {t.predictions.knockoutNote}
        </p>
      </section>
    </div>
  );
}

function DaySection({
  day,
  fixtures,
  user,
  existingByMatch,
}: {
  day: string;
  fixtures: Fixture[];
  user: { id: string } | null;
  existingByMatch: Map<number, { home_score: number; away_score: number }>;
}) {
  return (
    <div>
      <div className="sticky top-[57px] z-10 bg-pitch-950/85 backdrop-blur py-2 mb-3 flex items-center gap-2 border-b border-pitch-800/60">
        <Calendar size={12} className="text-accent-400" />
        <h3 className="text-xs uppercase tracking-widest font-semibold text-accent-300 font-mono">
          {formatDateLabel(day + "T12:00:00Z")}
        </h3>
        <span className="text-[10px] font-mono text-pitch-500">
          {fixtures.length} {fixtures.length === 1 ? "match" : "matches"}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {fixtures.map((f) => {
          const home = teamById(f.homeId!);
          const away = teamById(f.awayId!);
          const venue = venueById(f.venueId);
          if (!home || !away) return null;
          if (!user) {
            return (
              <GuestPredictionForm
                key={f.id}
                matchId={f.id}
                stageLabel={stageLabel(f)}
                kickoff={f.kickoff}
                venueLabel={venue?.city ?? "TBD"}
                home={home}
                away={away}
              />
            );
          }
          return (
            <PredictionForm
              key={f.id}
              matchId={f.id}
              stageLabel={stageLabel(f)}
              kickoff={f.kickoff}
              venueLabel={venue?.city ?? "TBD"}
              home={home}
              away={away}
              existing={existingByMatch.get(f.id)}
            />
          );
        })}
      </div>
    </div>
  );
}

/**
 * Guest-tipping banner. Replaces the old "Sign in first" prompt — the user
 * can now tip 3 matches before being asked to sign up, so the messaging is
 * "you can try, but to keep going you'll need an account".
 */
function GuestBanner({
  labels,
  signInLabel,
  registerLabel,
}: {
  labels: { title: string; body: string };
  signInLabel: string;
  registerLabel: string;
}) {
  return (
    <div className="card-panel p-5 ring-1 ring-accent-500/20 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-md bg-accent-500/15 flex items-center justify-center">
          <Sparkles size={18} className="text-accent-400" />
        </div>
        <div>
          <div className="text-sm font-semibold">{labels.title}</div>
          <div className="text-xs text-pitch-400 mt-0.5">{labels.body}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href="/login"
          className="rounded-md bg-accent-500 hover:bg-accent-400 text-pitch-950 text-xs font-semibold px-3 py-1.5 flex items-center gap-1.5"
        >
          <LogIn size={12} /> {signInLabel}
        </Link>
        <Link
          href="/register"
          className="rounded-md bg-pitch-800 hover:bg-pitch-700 text-pitch-100 text-xs font-semibold px-3 py-1.5"
        >
          {registerLabel}
        </Link>
      </div>
    </div>
  );
}
