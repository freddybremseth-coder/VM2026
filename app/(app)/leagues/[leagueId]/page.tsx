import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Crown, LogOut, Users, Sparkles, Activity } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { leaveLeagueAction } from "@/app/(app)/leagues/actions";
import { LeagueAvatar } from "@/components/league/LeagueAvatar";
import { CopyLinkButton } from "@/components/shared/CopyLinkButton";
import { HoloFlag } from "@/components/shared/HoloFlag";
import { Kicker } from "@/components/shared/EditorialKicker";
import { buildBanterReportLive, type BanterMember } from "@/lib/banter-report";
import { FIXTURES, type Fixture } from "@/lib/wc26-fixtures";
import { teamById, teamName } from "@/lib/wc26-data";
import { formatKickoff } from "@/lib/utils";

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

  // ─── Live + recent matches with members' tips ─────────────────────────
  // Surface what everyone tipped once kickoff has passed — the privacy line
  // the user asked for. (RLS on predictions is `using (true)`, so this is a
  // straight SELECT; the kickoff filter lives in app code.)
  const RECENT_MS = 36 * 60 * 60 * 1000; // 36h: enough to cover yesterday's full slate
  const nowMs = Date.now();
  const liveOrRecent: Fixture[] = FIXTURES.filter((f) => {
    if (!f.homeId || !f.awayId) return false;
    const ko = new Date(f.kickoff).getTime();
    return ko <= nowMs && ko >= nowMs - RECENT_MS;
  }).sort((a, b) => b.kickoff.localeCompare(a.kickoff));

  const memberIds = rows.map((m) => m.user_id);
  const matchIds = liveOrRecent.map((f) => f.id);
  type TipRow = { user_id: string; match_id: number; home_score: number; away_score: number };
  let tipsByMatch = new Map<number, Map<string, { home: number; away: number }>>();
  if (memberIds.length > 0 && matchIds.length > 0) {
    const { data: tips } = await supabase
      .from("predictions")
      .select("user_id, match_id, home_score, away_score")
      .in("user_id", memberIds)
      .in("match_id", matchIds);
    for (const t of (tips as TipRow[] | null) ?? []) {
      if (!tipsByMatch.has(t.match_id)) tipsByMatch.set(t.match_id, new Map());
      tipsByMatch.get(t.match_id)!.set(t.user_id, { home: t.home_score, away: t.away_score });
    }
  }

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

      {liveOrRecent.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Activity size={11} className="text-signal" />
            <Kicker tone="signal">Tippsammenligning · pågående &amp; siste kamper</Kicker>
          </div>
          <div className="space-y-3">
            {liveOrRecent.map((f) => (
              <MatchTipsCard
                key={f.id}
                fixture={f}
                members={rows}
                tips={tipsByMatch.get(f.id) ?? new Map()}
                youId={user.id}
              />
            ))}
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

/**
 * One match card with every league member's locked tip side by side.
 * Renders only matches that have already kicked off (caller filters).
 */
function MatchTipsCard({
  fixture,
  members,
  tips,
  youId,
}: {
  fixture: Fixture;
  members: MemberRow[];
  tips: Map<string, { home: number; away: number }>;
  youId: string;
}) {
  const home = fixture.homeId ? teamById(fixture.homeId) : undefined;
  const away = fixture.awayId ? teamById(fixture.awayId) : undefined;
  const stageLabel =
    fixture.stage.kind === "group"
      ? `Gruppe ${fixture.stage.group} · MD${fixture.stage.matchday}`
      : "Sluttspill";

  // Aggregate count of distinct score-tips for a quick "how many agree" hint.
  const scoreCounts = new Map<string, number>();
  for (const t of tips.values()) {
    const k = `${t.home}-${t.away}`;
    scoreCounts.set(k, (scoreCounts.get(k) ?? 0) + 1);
  }

  return (
    <Link
      href={`/matches/${fixture.id}`}
      className="block surface p-4 hover:bg-paperHi transition-colors group"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono uppercase tracking-kicker text-cream/55">
          {stageLabel}
        </span>
        <span className="text-[10px] font-mono text-cream/45 stat-num">
          {formatKickoff(fixture.kickoff)}
        </span>
      </div>
      <div className="flex items-center gap-3 mb-4">
        {home && <HoloFlag code={home.flag} w={22} radius={2} />}
        <span className="font-serif text-base font-semibold tracking-editorial text-cream truncate">
          {teamName(home)}
        </span>
        <span className="text-cream/35 font-serif italic text-sm">vs</span>
        <span className="font-serif text-base font-semibold tracking-editorial text-cream truncate">
          {teamName(away)}
        </span>
        {away && <HoloFlag code={away.flag} w={22} radius={2} />}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
        {members.map((m) => {
          const label =
            m.profiles?.display_name || m.profiles?.username || "(anonym)";
          const isYou = m.user_id === youId;
          const tip = tips.get(m.user_id);
          const agree = tip ? scoreCounts.get(`${tip.home}-${tip.away}`) ?? 1 : 0;
          return (
            <div
              key={m.user_id}
              className={`flex items-center justify-between text-xs py-1 ${
                isYou ? "ring-1 ring-signal/30 bg-signal/5 px-2" : "px-2"
              }`}
            >
              <span className="font-serif text-cream/85 truncate">
                {label}
                {isYou && (
                  <span className="ml-1.5 text-[9px] uppercase tracking-kicker font-mono text-signal">
                    deg
                  </span>
                )}
              </span>
              {tip ? (
                <span className="font-mono font-semibold stat-num text-amber shrink-0 flex items-center gap-1.5">
                  {tip.home}–{tip.away}
                  {agree > 1 && (
                    <span className="text-[9px] font-mono text-cream/45 uppercase tracking-kicker">
                      ×{agree}
                    </span>
                  )}
                </span>
              ) : (
                <span className="font-mono text-cream/35 text-[11px] italic shrink-0">
                  tippet ikke
                </span>
              )}
            </div>
          );
        })}
      </div>
    </Link>
  );
}
