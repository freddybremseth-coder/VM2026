import Link from "next/link";
import { Trophy, Users, ChevronRight, Globe, LogIn } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CreateLeagueForm, JoinLeagueForm } from "@/components/league/LeagueForms";
import { LeagueAvatar } from "@/components/league/LeagueAvatar";
import { DemoLeague } from "@/components/league/DemoLeague";
import { joinPublicLeagueAction } from "@/app/(app)/leagues/actions";
import { Kicker, Headline } from "@/components/shared/EditorialKicker";
import { getDictionary } from "@/lib/i18n";

export default async function LeaguesPage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const t = getDictionary();

  if (!user) {
    return (
      <div className="px-5 md:px-10 py-8 max-w-[1100px] mx-auto space-y-8">
        <Header title={t.leagues.title} subtitle={t.leagues.subtitle} />
        <DemoLeague />
      </div>
    );
  }

  // Fetch leagues the user is a member of.
  const { data: memberships } = await supabase
    .from("league_members")
    .select("league_id, points, mini_leagues!inner(id, name, description, invite_code, is_private, owner_id)")
    .eq("user_id", user.id);

  type Membership = {
    league_id: string;
    points: number;
    mini_leagues: {
      id: string;
      name: string;
      description: string | null;
      invite_code: string;
      is_private: boolean;
      owner_id: string;
    };
  };
  const myLeagues = (memberships as Membership[] | null) ?? [];
  const myLeagueIds = new Set(myLeagues.map((m) => m.league_id));

  // Open (non-private) leagues anyone can join without a code. RLS exposes
  // these via the "not is_private" read policy. Hide ones the user is
  // already in or owns.
  const { data: openRaw } = await supabase
    .from("mini_leagues")
    .select("id, name, description, owner_id")
    .eq("is_private", false)
    .order("created_at", { ascending: false })
    .limit(24);

  type OpenLeague = {
    id: string;
    name: string;
    description: string | null;
    owner_id: string;
  };
  const openLeagues = ((openRaw as OpenLeague[] | null) ?? []).filter(
    (l) => !myLeagueIds.has(l.id) && l.owner_id !== user.id,
  );

  return (
    <div className="px-5 md:px-10 py-8 max-w-[1100px] mx-auto space-y-8">
      <Header title={t.leagues.title} subtitle={t.leagues.subtitle} />

      <section className="space-y-3">
        <div className="text-[10px] uppercase tracking-kicker font-mono font-semibold text-cream/70">
          {t.leagues.yours}
        </div>
        {myLeagues.length === 0 ? (
          <div className="surface p-6 text-center text-sm text-cream/55 italic font-serif">
            {t.leagues.none}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {myLeagues.map((m) => (
              <Link
                key={m.league_id}
                href={`/leagues/${m.league_id}`}
                className="surface p-4 group hover:bg-paperHi transition-colors"
              >
                <div className="flex items-start gap-3">
                  <LeagueAvatar
                    seed={m.mini_leagues.id}
                    name={m.mini_leagues.name}
                    size={44}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-serif text-base font-semibold tracking-editorial text-cream truncate flex items-center gap-2">
                      {m.mini_leagues.name}
                      {m.mini_leagues.owner_id === user.id && (
                        <span className="text-[9px] uppercase tracking-kicker font-mono text-signal bg-signal/15 px-1.5 py-0.5">
                          Eier
                        </span>
                      )}
                    </div>
                    {m.mini_leagues.description && (
                      <div className="text-xs text-cream/55 mt-1 truncate font-mono">
                        {m.mini_leagues.description}
                      </div>
                    )}
                    <div className="mt-2 flex items-center gap-3 text-[11px] font-mono text-cream/60">
                      <span className="flex items-center gap-1">
                        <Users size={11} /> Deltakere
                      </span>
                      <span>·</span>
                      <span>
                        Dine poeng:{" "}
                        <span className="text-signal font-semibold stat-num">{m.points}</span>
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-cream/60 group-hover:text-signal mt-1 shrink-0 transition-colors"
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Open leagues — anyone can join, no code needed */}
      {openLeagues.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Globe size={12} className="text-amber" />
            <div className="text-[10px] uppercase tracking-kicker font-mono font-semibold text-cream/70">
              Åpne ligaer · bli med uten kode
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {openLeagues.map((l) => (
              <div key={l.id} className="surface p-4 flex items-start gap-3">
                <LeagueAvatar seed={l.id} name={l.name} size={44} />
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/leagues/${l.id}`}
                    className="font-serif text-base font-semibold tracking-editorial text-cream truncate hover:text-amber transition-colors block"
                  >
                    {l.name}
                  </Link>
                  {l.description && (
                    <div className="text-xs text-cream/55 mt-1 truncate font-mono">
                      {l.description}
                    </div>
                  )}
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] uppercase tracking-kicker font-mono text-cream/60">
                    <Globe size={10} /> Åpen liga
                  </div>
                </div>
                <form action={joinPublicLeagueAction} className="shrink-0">
                  <input type="hidden" name="leagueId" value={l.id} />
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 bg-signal hover:bg-signalD text-cream text-xs font-semibold px-3 py-1.5 transition-colors"
                  >
                    <LogIn size={12} /> Bli med
                  </button>
                </form>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <CreateLeagueForm />
        <JoinLeagueForm />
      </section>
    </div>
  );
}

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header>
      <Kicker tone="signal">
        <span className="inline-flex items-center gap-2">
          <Trophy size={11} /> Mini-ligaer
        </span>
      </Kicker>
      <Headline rank="h1" className="mt-2">
        {title}
      </Headline>
      <p className="text-sm text-cream/55 mt-3 max-w-2xl leading-relaxed">{subtitle}</p>
    </header>
  );
}
