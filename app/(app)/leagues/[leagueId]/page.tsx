import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Copy, Crown, LogOut, Users } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { leaveLeagueAction } from "@/app/(app)/leagues/actions";

interface MemberRow {
  user_id: string;
  points: number;
  joined_at: string;
  profiles: { username: string; display_name: string | null } | null;
}

export default async function LeagueDetailPage({
  params,
}: {
  params: { leagueId: string };
}) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: league } = await supabase
    .from("mini_leagues")
    .select("id, name, description, invite_code, is_private, owner_id, created_at")
    .eq("id", params.leagueId)
    .maybeSingle();

  if (!league) notFound();

  // Confirm membership; RLS would block anyway but we want a clean redirect.
  const { data: membership } = await supabase
    .from("league_members")
    .select("user_id")
    .eq("league_id", league.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership && league.owner_id !== user.id) {
    redirect("/leagues");
  }

  const { data: members } = await supabase
    .from("league_members")
    .select("user_id, points, joined_at, profiles(username, display_name)")
    .eq("league_id", league.id)
    .order("points", { ascending: false });

  const rows = (members as MemberRow[] | null) ?? [];
  const isOwner = league.owner_id === user.id;

  return (
    <div className="px-6 py-6 max-w-[1100px] mx-auto space-y-5">
      <Link
        href="/leagues"
        className="inline-flex items-center gap-1.5 text-xs text-pitch-400 hover:text-accent-300 transition-colors"
      >
        <ArrowLeft size={12} /> All leagues
      </Link>

      <div className="card-panel p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold tracking-tight">{league.name}</h1>
              {isOwner && (
                <span className="text-[10px] uppercase tracking-widest font-mono text-accent-400 bg-accent-500/15 px-2 py-0.5 rounded">
                  Owner
                </span>
              )}
              {league.is_private && (
                <span className="text-[10px] uppercase tracking-widest font-mono text-pitch-400 bg-pitch-800 px-2 py-0.5 rounded">
                  Private
                </span>
              )}
            </div>
            {league.description && (
              <p className="text-sm text-pitch-400">{league.description}</p>
            )}
          </div>
          {!isOwner && (
            <form action={leaveLeagueAction}>
              <input type="hidden" name="leagueId" value={league.id} />
              <button
                type="submit"
                className="flex items-center gap-1.5 text-xs text-pitch-400 hover:text-loss px-2 py-1.5 rounded-md hover:bg-pitch-800 transition-colors"
              >
                <LogOut size={12} /> Leave
              </button>
            </form>
          )}
        </div>

        <div className="mt-5 pt-4 border-t border-pitch-700/60 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
          <InviteCode code={league.invite_code} />
          <span className="flex items-center gap-1.5 text-pitch-400">
            <Users size={12} /> {rows.length}{" "}
            {rows.length === 1 ? "member" : "members"}
          </span>
        </div>
      </div>

      <section>
        <h2 className="text-xs uppercase tracking-widest font-semibold text-pitch-200 mb-3">
          Leaderboard
        </h2>
        <div className="card-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-pitch-500 border-b border-pitch-700/60">
                <th className="text-left px-4 py-2 w-12">#</th>
                <th className="text-left px-4 py-2">Player</th>
                <th className="text-right px-4 py-2 w-24 font-mono">Points</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m, i) => {
                const label =
                  m.profiles?.display_name || m.profiles?.username || "(anonymous)";
                const isMe = m.user_id === user.id;
                const isLeader = i === 0;
                return (
                  <tr
                    key={m.user_id}
                    className={`border-b border-pitch-800 last:border-b-0 ${
                      isMe ? "bg-accent-500/5" : ""
                    }`}
                  >
                    <td className="px-4 py-2.5 font-mono text-pitch-400 stat-num">
                      {isLeader ? (
                        <Crown size={13} className="text-draw" />
                      ) : (
                        i + 1
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-pitch-100 font-medium">
                      {label}
                      {isMe && (
                        <span className="ml-2 text-[10px] uppercase tracking-widest font-mono text-accent-400">
                          you
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono font-semibold stat-num text-accent-300">
                      {m.points}
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-sm text-pitch-500 py-6">
                    No members yet. Share the invite code to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-pitch-500 mt-3 leading-relaxed">
          Points are awarded after each match based on prediction accuracy (3 pts
          exact score, 1 pt correct outcome). Backfill from the predictions table
          happens after a match ends — see roadmap.
        </p>
      </section>
    </div>
  );
}

function InviteCode({ code }: { code: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] uppercase tracking-widest text-pitch-500">
        Invite code
      </span>
      <code className="font-mono text-pitch-100 bg-pitch-800 px-2 py-1 rounded text-xs">
        {code}
      </code>
      <CopyButton code={code} />
    </div>
  );
}

function CopyButton({ code }: { code: string }) {
  return (
    <button
      type="button"
      aria-label="Copy invite code"
      title="Copy"
      className="p-1 rounded text-pitch-400 hover:text-accent-300 hover:bg-pitch-800"
      data-copy={code}
    >
      <Copy size={12} />
    </button>
  );
}
