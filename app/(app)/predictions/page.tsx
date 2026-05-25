import Link from "next/link";
import { Target, LogIn, Lock, Calendar, Sparkles } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { GuestPredictionForm } from "@/components/prediction/GuestPredictionForm";
import { GuestMigrationPrompt } from "@/components/prediction/GuestMigrationPrompt";
import {
  AuthPredictionsBoard,
  type BoardDay,
} from "@/components/prediction/AuthPredictionsBoard";
import { Kicker, Headline } from "@/components/shared/EditorialKicker";
import { formatDateLabel } from "@/lib/utils";
import { nextFixtures, type Fixture } from "@/lib/wc26-fixtures";
import { teamById, teamName, venueById } from "@/lib/wc26-data";
import { getDictionary } from "@/lib/i18n";

const STAGE_LABEL_KO: Record<string, string> = {
  R32: "Runde av 32",
  R16: "Runde av 16",
  QF: "Kvartfinale",
  SF: "Semifinale",
  "3RD": "Bronsefinale",
  FINAL: "Finale",
};

function stageLabel(f: Fixture): string {
  return f.stage.kind === "group"
    ? `Gruppe ${f.stage.group} · MD${f.stage.matchday}`
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
  const open = nextFixtures(now.toISOString(), 200).filter(
    (f) => f.homeId && f.awayId,
  );

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
    <div className="px-5 md:px-10 py-8 max-w-[1100px] mx-auto space-y-8">
      <header>
        <Kicker tone="signal">
          <span className="inline-flex items-center gap-2">
            <Target size={11} /> Tippe
          </span>
        </Kicker>
        <Headline rank="h1" className="mt-2">
          {t.predictions.title}
        </Headline>
        <p className="text-sm text-cream/55 mt-3 max-w-2xl leading-relaxed">
          {t.predictions.subtitle}
        </p>
      </header>

      {!user && (
        <GuestBanner
          labels={t.predictions.guestBanner}
          signInLabel={t.common.signIn}
          registerLabel={t.common.register}
        />
      )}
      {user && <GuestMigrationPrompt />}

      <section className="space-y-3">
        <div className="text-[10px] uppercase tracking-kicker font-mono font-semibold text-cream/70">
          {t.predictions.open(open.length)}
        </div>
        {open.length === 0 ? (
          <div className="surface p-6 text-center text-sm text-cream/55 italic font-serif">
            {t.predictions.none}
          </div>
        ) : user ? (
          <AuthPredictionsBoard days={buildBoardDays(days, existingByMatch)} />
        ) : (
          <div className="space-y-8">
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

      <section className="surface p-4 flex items-start gap-3">
        <Lock size={14} className="text-cream/45 shrink-0 mt-0.5" />
        <p className="text-xs text-cream/55 leading-relaxed">
          {t.predictions.knockoutNote}
        </p>
      </section>
    </div>
  );
}

/**
 * Maps the server-side day groups + existing predictions into the
 * serializable shape the client board needs.
 */
function buildBoardDays(
  days: Array<[string, Fixture[]]>,
  existingByMatch: Map<number, { home_score: number; away_score: number }>,
): BoardDay[] {
  return days
    .map(([day, fixtures]) => ({
      day,
      fixtures: fixtures
        .map((f) => {
          const home = teamById(f.homeId!);
          const away = teamById(f.awayId!);
          if (!home || !away) return null;
          const venue = venueById(f.venueId);
          const existing = existingByMatch.get(f.id);
          return {
            matchId: f.id,
            stageLabel: stageLabel(f),
            kickoff: f.kickoff,
            venueLabel: venue?.city ?? "TBD",
            home: { id: home.id, name: teamName(home), shortName: home.shortName, flag: home.flag },
            away: { id: away.id, name: teamName(away), shortName: away.shortName, flag: away.flag },
            existing: existing
              ? { home: existing.home_score, away: existing.away_score }
              : undefined,
          };
        })
        .filter((x): x is NonNullable<typeof x> => x !== null),
    }))
    .filter((d) => d.fixtures.length > 0);
}

/** Guest-only day section (guests cap at 3 tips, so no batch save needed). */
function DaySection({
  day,
  fixtures,
}: {
  day: string;
  fixtures: Fixture[];
  user: { id: string } | null;
  existingByMatch: Map<number, { home_score: number; away_score: number }>;
}) {
  return (
    <div>
      <div className="sticky top-[57px] z-10 bg-canvas/85 backdrop-blur py-2 mb-3 flex items-center gap-3 border-b border-cream/8">
        <Calendar size={11} className="text-signal" />
        <span className="text-[10px] uppercase tracking-kicker font-semibold text-cream font-mono">
          {formatDateLabel(day + "T12:00:00Z")}
        </span>
        <span className="text-[10px] font-mono text-cream/45 stat-num">
          {fixtures.length} {fixtures.length === 1 ? "kamp" : "kamper"}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {fixtures.map((f) => {
          const home = teamById(f.homeId!);
          const away = teamById(f.awayId!);
          const venue = venueById(f.venueId);
          if (!home || !away) return null;
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
        })}
      </div>
    </div>
  );
}

/**
 * Guest-tipping banner. Tip 3 matches before being asked to sign up — the
 * messaging is "you can try, but to keep going you'll need an account".
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
    <div className="surface p-5 ring-1 ring-signal/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-signal/10 via-transparent to-transparent">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-10 w-10 bg-signal/15 flex items-center justify-center shrink-0">
          <Sparkles size={18} className="text-amber" />
        </div>
        <div className="min-w-0">
          <Kicker tone="signal">Gjeste-tipping</Kicker>
          <div className="font-serif text-base font-semibold tracking-editorial text-cream mt-0.5">
            {labels.title}
          </div>
          <div className="text-xs text-cream/55 mt-1 leading-relaxed">{labels.body}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href="/login"
          className="bg-signal hover:bg-signalD text-cream text-xs font-semibold px-3 py-1.5 flex items-center gap-1.5 transition-colors"
        >
          <LogIn size={12} /> {signInLabel}
        </Link>
        <Link
          href="/register"
          className="bg-paper hover:bg-paperHi border border-cream/8 text-cream/85 text-xs font-semibold px-3 py-1.5 transition-colors"
        >
          {registerLabel}
        </Link>
      </div>
    </div>
  );
}
