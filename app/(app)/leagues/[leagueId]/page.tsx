import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Crown, LogOut, Users, Sparkles } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { leaveLeagueAction } from "@/app/(app)/leagues/actions";
import { LeagueAvatar } from "@/components/league/LeagueAvatar";
import { CopyLinkButton } from "@/components/shared/CopyLinkButton";
import { Kicker } from "@/components/shared/EditorialKicker";
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
    username: m.profiles?.display_name || m.profiles?.username || "(anonym)",
    points: m.points,
    isYou: m.user_id === user.id,
  }));
  const banter = await buildBanterReportLive(league.name, banterMembers);

  return (
    <div className="px-4 sm:px-6 md:px-10 py-8 max-w-[1100px] mx-auto space-y-5">
      <Link
        href="/leagues"
        className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-kicker font-mono text-cream/55 hover:text-signal transition-colors"
      >
        <ArrowLeft size={11} /> Alle ligaer
      </Link>

      <div className="surface p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <LeagueAvatar seed={league.id} name={league.name} size={56} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold tracking-editorial text-cream">
                {league.name}
              </h1>
              {isOwner && (
                <span className="text-[10px] uppercase tracking-kicker font-mono text-signal bg-signal/15 px-2 py-0.5">
                  Eier
                </span>
              )}
              {league.is_private && (
                <span className="text-[10px] uppercase tracking-kicker font-mono text-cream/55 bg-paper px-2 py-0.5">
                  Privat
                </span>
              )}
            </div>
            {league.description && (
              <p className="text-sm text-cream/55 leading-relaxed">{league.description}</p>
            )}
          </div>
          {!isOwner && (
            <form action={leaveLeagueAction}>
              <input type="hidden" name="leagueId" value={league.id} />
              <button
                type="submit"
                className="flex items-center gap-1.5 text-[11px] font-mono text-cream/55 hover:text-loss px-2 py-1.5 hover:bg-paper transition-colors"
              >
                <LogOut size={11} /> Forlat
              </button>
            </form>
          )}
        </div>

        <div className="mt-5 pt-4 border-t border-cream/8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3 text-xs flex-wrap">
            <span className="text-[10px] uppercase tracking-kicker text-cream/55 font-mono">
              Invitasjonskode
            </span>
            <code className="font-mono text-cream bg-paper px-2 py-1 text-xs select-all">
              {league.invite_code}
            </code>
            <span className="flex items-center gap-1.5 text-cream/55 font-mono">
              <Users size={11} /> {rows.length}{" "}
              {rows.length === 1 ? "deltaker" : "deltakere"}
            </span>
          </div>
          <div className="sm:ml-auto">
            <CopyLinkButton
              label="Del invitasjonslenke"
              className="bg-signal hover:bg-signalD text-cream text-xs font-semibold px-3 py-1.5 transition-colors flex items-center gap-1.5"
            />
          </div>
        </div>
      </div>

      {banter && (
        <section className="surface p-5 ring-1 ring-amber/20 relative">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 bg-amber/15 flex items-center justify-center shrink-0">
              <Sparkles size={16} className="text-amber" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="font-serif text-sm font-semibold tracking-editorial text-cream">
                  {banter.headline}
                </div>
              </div>
              <div className="text-[10px] uppercase tracking-kicker text-cream/45 font-mono mb-3">
                ChatGenius · banter-rapport
              </div>
              <div className="space-y-2 text-sm text-cream/85 leading-relaxed">
                {banter.lines.map((line, i) => (
                  <p key={i} className="flex gap-2">
                    <span className="text-signal font-mono text-xs mt-0.5 shrink-0">›</span>
                    <span>{line}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section>
        <Kicker tone="muted">Ledertavle</Kicker>
        <div className="surface overflow-hidden mt-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-kicker text-cream/45 border-b border-cream/8 font-mono">
                <th className="text-left px-4 py-2.5 w-12">#</th>
                <th className="text-left px-4 py-2.5">Spiller</th>
                <th className="text-right px-4 py-2.5 w-24">Poeng</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m, i) => {
                const label =
                  m.profiles?.display_name || m.profiles?.username || "(anonym)";
                const isMe = m.user_id === user.id;
                const isLeader = i === 0;
                return (
                  <tr
                    key={m.user_id}
                    className={`border-b border-cream/8 last:border-b-0 transition-colors ${
                      isMe ? "bg-signal/5 ring-1 ring-inset ring-signal/20" : "hover:bg-cream/5"
                    }`}
                  >
                    <td className="px-4 py-2.5 font-mono text-cream/55 stat-num">
                      {isLeader ? (
                        <Crown size={13} className="text-amber" />
                      ) : (
                        i + 1
                      )}
                    </td>
                    <td className="px-4 py-2.5 font-serif tracking-editorial text-cream">
                      {label}
                      {isMe && (
                        <span className="ml-2 text-[10px] uppercase tracking-kicker font-mono text-signal">
                          deg
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono font-semibold stat-num text-signal">
                      {m.points}
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-sm text-cream/55 py-6 italic font-serif">
                    Ingen deltakere ennå. Del invitasjonskoden for å komme i gang.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-cream/55 mt-3 leading-relaxed font-mono">
          Poeng tildeles etter hver kamp basert på treffsikkerhet (3 p eksakt
          resultat, 1 p riktig utfall). Etterregistrering kjører når kampen er
          slutt — se roadmap.
        </p>
      </section>
    </div>
  );
}
