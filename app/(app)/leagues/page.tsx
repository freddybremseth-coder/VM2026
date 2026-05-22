import Link from "next/link";
import { Trophy, Users, ChevronRight, LogIn } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CreateLeagueForm, JoinLeagueForm } from "@/components/league/LeagueForms";
import { LeagueAvatar } from "@/components/league/LeagueAvatar";

export default async function LeaguesPage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="px-4 sm:px-6 py-6 max-w-[1100px] mx-auto">
        <Header />
        <div className="card-panel p-6 ring-1 ring-accent-500/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-accent-500/15 flex items-center justify-center">
              <LogIn size={18} className="text-accent-400" />
            </div>
            <div>
              <div className="text-sm font-semibold">Sign in to create or join a league</div>
              <div className="text-xs text-pitch-400 mt-0.5">
                Mini-leagues let you compete against friends with a private leaderboard.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
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

  return (
    <div className="px-4 sm:px-6 py-6 max-w-[1100px] mx-auto space-y-8">
      <Header />

      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest font-semibold text-pitch-200">
          Your leagues
        </h2>
        {myLeagues.length === 0 ? (
          <div className="card-panel p-6 text-center text-sm text-pitch-500">
            You're not in any mini-leagues yet. Create one below or join with an invite code.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {myLeagues.map((m) => (
              <Link
                key={m.league_id}
                href={`/leagues/${m.league_id}`}
                className="card-panel p-4 group hover:border-accent-500/40 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <LeagueAvatar
                    seed={m.mini_leagues.id}
                    name={m.mini_leagues.name}
                    size={44}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate flex items-center gap-2">
                      {m.mini_leagues.name}
                      {m.mini_leagues.owner_id === user.id && (
                        <span className="text-[9px] uppercase tracking-widest font-mono text-accent-400 bg-accent-500/15 px-1.5 py-0.5 rounded">
                          Owner
                        </span>
                      )}
                    </div>
                    {m.mini_leagues.description && (
                      <div className="text-xs text-pitch-400 mt-1 truncate">
                        {m.mini_leagues.description}
                      </div>
                    )}
                    <div className="mt-2 flex items-center gap-3 text-[11px] font-mono text-pitch-500">
                      <span className="flex items-center gap-1">
                        <Users size={11} /> Members
                      </span>
                      <span>·</span>
                      <span>
                        Your points:{" "}
                        <span className="text-accent-300 font-semibold">{m.points}</span>
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-pitch-500 group-hover:text-accent-300 mt-1 shrink-0"
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <CreateLeagueForm />
        <JoinLeagueForm />
      </section>
    </div>
  );
}

function Header() {
  return (
    <header className="mb-6">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-accent-400 font-semibold mb-1">
        <Trophy size={12} />
        Mini-leagues
      </div>
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
        Tip against your friends
      </h1>
      <p className="text-sm text-pitch-400 mt-1">
        Create a private league, share the invite code, and compare points throughout the tournament.
      </p>
    </header>
  );
}
