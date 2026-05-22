import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Crown, LogOut, Users, Share2, Sparkles } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { leaveLeagueAction } from "@/app/(app)/leagues/actions";
import { LeagueAvatar } from "@/components/league/LeagueAvatar";
import { CopyLinkButton } from "@/components/shared/CopyLinkButton";
import { buildBanterReportLive, type BanterMember } from "@/lib/banter-report";

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

  const banterMembers: BanterMember[] = rows.map((m) => ({
    username: m.profiles?.display_name || m.profiles?.username || "(anonymous)",
    points: m.points,
    isYou: m.user_id === user.id,
  }));
  const banter = await buildBanterReportLive(league.name, banterMembers);

  return (
    <div className="px-4 sm:px-6 py-6 max-w-[1100px] mx-auto space-y-5">
      <Link
        href="/leagues"
        className="inline-flex items-center gap-1.5 text-xs text-pitch-400 hover:text-accent-300 transition-colors"
      >
        <ArrowLeft size={12} /> All leagues
      </Link>

      <div className="card-panel p-4 sm:p-6">
        <div className="flex items-start gap-4">
          <LeagueAvatar seed={league.id} name={league.name} size={56} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{league.name}</h1>
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

        <div className="mt-5 pt-4 border-t border-pitch-700/60 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3 text-xs flex-wrap">
            <span className="text-[10px] uppercase tracking-widest text-pitch-500">
              Invite code
            </span>
            <code className="font-mono text-pitch-100 bg-pitch-800 px-2 py-1 rounded text-xs select-all">
              {league.invite_code}
            </code>
            <span className="flex items-center gap-1.5 text-pitch-400">
              <Users size={12} /> {rows.length}{" "}
              {rows.length === 1 ? "member" : "members"}
            </span>
          </div>
          <div className="sm:ml-auto">
            <CopyLinkButton
              label="Share invite link"
              className="rounded-md bg-accent-500 hover:bg-accent-400 text-pitch-950 text-xs font-semibold px-3 py-1.5 transition-colors flex items-center gap-1.5"
            />
          </div>
        </div>
      </div>

      {banter && (
        <section className="card-panel p-5 ring-1 ring-accent-500/20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04] grid-lines pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-md bg-accent-500/15 flex items-center justify-center">
                <Sparkles size={14} className="text-accent-400" />
              </div>
              <div>
                <div className="text-xs font-semibold">{banter.headline}</div>
                <div className="text-[10px] uppercase tracking-widest text-pitch-500 font-mono">
                  ChatGenius · banter report
                </div>
              </div>
            </div>
            <div className="space-y-2 text-sm text-pitch-200 leading-relaxed">
              {banter.lines.map((line, i) => (
                <p key={i} className="flex gap-2">
                  <span className="text-accent-400 font-mono text-xs mt-0.5">›</span>
                  <span>{line}</span>
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

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

