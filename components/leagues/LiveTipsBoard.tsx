"use client";

/**
 * Self-updating league tips board.
 *
 * Reveal source-of-truth lives in the DB (RLS policy in migration 0004) so
 * this component never decides authorization — only paint. It keeps the
 * view fresh against four signals:
 *
 *   1. Realtime — Supabase channel subscribed to predictions + fixtures
 *      changes for the visible match IDs. Refetches on any payload.
 *   2. Exact-kickoff timers — for each fixture not yet revealed, schedules
 *      a setTimeout at its kickoff (clamped to 24h max for setTimeout
 *      safety + lazy re-evaluation).
 *   3. Polling — every 30 s while ANY fixture is within ±10 min of kickoff
 *      or already in-progress. Quiet otherwise.
 *   4. Tab focus / visibility — refetches the moment the tab becomes
 *      active again (handles "browser tab sleeps and later becomes
 *      active" from the issue).
 *
 * On every refetch we also re-sync the clock offset against the server
 * time returned in the payload, so a skewed device clock can't drift the
 * "now" used for the locked / revealed render decision.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Activity, RefreshCw, Lock } from "lucide-react";
import { HoloFlag } from "@/components/shared/HoloFlag";
import { formatKickoff } from "@/lib/utils";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  isFixtureRevealed,
  isNearReveal,
  msUntilReveal,
} from "@/lib/predictions-visibility";
import type {
  BoardFixture,
  BoardTip,
  LeagueTipsData,
  BoardMember,
} from "@/lib/leagues/league-tips";

const POLL_INTERVAL_MS = 30_000;
const TIMER_CAP_MS = 23 * 60 * 60 * 1000; // setTimeout safety cap

interface Props {
  leagueId: string;
  initialData: LeagueTipsData;
}

export function LiveTipsBoard({ leagueId, initialData }: Props) {
  const [data, setData] = useState<LeagueTipsData>(initialData);
  const [now, setNow] = useState<Date>(() => new Date(initialData.serverNow));
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // clock skew = serverTime − localNow at fetch time
  const offsetRef = useRef(
    new Date(initialData.serverNow).getTime() - Date.now(),
  );

  // Re-derived view of "now" that respects the server offset.
  const trueNow = useCallback(() => new Date(Date.now() + offsetRef.current), []);

  // Fetch fresh tips. Always replaces — RLS does the gating.
  const refetch = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await fetch(`/api/leagues/${leagueId}/tips`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const json = (await res.json()) as LeagueTipsData;
      offsetRef.current = new Date(json.serverNow).getTime() - Date.now();
      setData(json);
      setNow(trueNow());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setRefreshing(false);
    }
  }, [leagueId, trueNow]);

  // ─── Realtime subscription ──────────────────────────────────────────────
  useEffect(() => {
    const matchIds = data.fixtures.map((f) => f.matchId);
    if (matchIds.length === 0) return;

    const supabase = createSupabaseBrowserClient();
    const matchFilter = `match_id=in.(${matchIds.join(",")})`;
    const fixtureFilter = `id=in.(${matchIds.join(",")})`;

    const channel = supabase
      .channel(`league-tips-${leagueId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "predictions", filter: matchFilter },
        () => refetch(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "fixtures", filter: fixtureFilter },
        () => refetch(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "match_results", filter: matchFilter },
        () => refetch(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // We deliberately re-subscribe when the match window changes — the filter
    // list must follow the new IDs.
  }, [leagueId, data.fixtures.map((f) => f.matchId).join(","), refetch]);

  // ─── Exact-kickoff timers ──────────────────────────────────────────────
  useEffect(() => {
    const handles: ReturnType<typeof setTimeout>[] = [];
    const n = trueNow();
    for (const f of data.fixtures) {
      const dt = msUntilReveal(n, { kickoff: f.kickoff, status: f.status });
      if (dt === null || dt === 0) continue;
      handles.push(setTimeout(refetch, Math.min(dt, TIMER_CAP_MS)));
    }
    return () => handles.forEach(clearTimeout);
  }, [data.fixtures, refetch, trueNow]);

  // ─── Local 1 s tick so the locked-state countdowns stay accurate ───────
  useEffect(() => {
    const id = setInterval(() => setNow(trueNow()), 1_000);
    return () => clearInterval(id);
  }, [trueNow]);

  // ─── Bounded polling for the "near reveal" / live window ───────────────
  const anyNearReveal = data.fixtures.some((f) =>
    isNearReveal(now, { kickoff: f.kickoff, status: f.status }),
  );
  useEffect(() => {
    if (!anyNearReveal) return;
    const id = setInterval(refetch, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [anyNearReveal, refetch]);

  // ─── Refetch on focus / visibility (covers dormant tabs) ───────────────
  useEffect(() => {
    function onWake() {
      if (document.visibilityState === "visible") refetch();
    }
    document.addEventListener("visibilitychange", onWake);
    window.addEventListener("focus", refetch);
    return () => {
      document.removeEventListener("visibilitychange", onWake);
      window.removeEventListener("focus", refetch);
    };
  }, [refetch]);

  if (data.fixtures.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <Activity size={11} className="text-signal" />
        <span className="text-[10px] font-mono uppercase tracking-kicker font-semibold text-signal">
          Tippsammenligning · kommende, pågående &amp; siste kamper
        </span>
        <button
          type="button"
          onClick={refetch}
          disabled={refreshing}
          className="ml-auto p-1 text-cream/55 hover:text-signal transition-colors"
          aria-label="Oppdater"
          title="Oppdater"
        >
          <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
        </button>
      </div>
      {error && (
        <div className="surface p-3 ring-1 ring-loss/30 text-loss text-xs font-mono mb-3">
          Oppdatering feilet: {error}
        </div>
      )}
      <div className="space-y-3">
        {data.fixtures.map((f) => (
          <FixtureCard
            key={f.matchId}
            fixture={f}
            members={data.members}
            youId={data.youId}
            now={now}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Per-fixture card ──────────────────────────────────────────────────────

function FixtureCard({
  fixture,
  members,
  youId,
  now,
}: {
  fixture: BoardFixture;
  members: BoardMember[];
  youId: string;
  now: Date;
}) {
  const revealed = isFixtureRevealed(now, fixture);
  const ownTip = fixture.tips.find((t) => t.userId === youId) ?? null;

  return (
    <Link
      href={`/matches/${fixture.matchId}`}
      className="block surface p-4 hover:bg-paperHi transition-colors group"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono uppercase tracking-kicker text-cream/55">
          {fixture.stageLabel}
        </span>
        <KickoffOrStatus fixture={fixture} now={now} />
      </div>

      <div className="flex items-center gap-3 mb-4">
        {fixture.homeFlag && <HoloFlag code={fixture.homeFlag} w={22} radius={2} />}
        <span className="font-serif text-base font-semibold tracking-editorial text-cream truncate">
          {fixture.homeName}
        </span>
        {fixture.result ? (
          <span className="font-mono text-base font-bold stat-num text-amber px-2">
            {fixture.result.homeScore}–{fixture.result.awayScore}
          </span>
        ) : (
          <span className="text-cream/35 font-serif italic text-sm">vs</span>
        )}
        <span className="font-serif text-base font-semibold tracking-editorial text-cream truncate">
          {fixture.awayName}
        </span>
        {fixture.awayFlag && <HoloFlag code={fixture.awayFlag} w={22} radius={2} />}
      </div>

      {revealed ? (
        <RevealedTipsList
          tips={fixture.tips}
          members={members}
          youId={youId}
          result={fixture.result}
        />
      ) : (
        <LockedTipsList ownTip={ownTip} fixture={fixture} now={now} />
      )}
    </Link>
  );
}

function KickoffOrStatus({
  fixture,
  now,
}: {
  fixture: BoardFixture;
  now: Date;
}) {
  if (fixture.status === "postponed") {
    return (
      <span className="text-[10px] font-mono uppercase tracking-kicker text-amber bg-amber/12 px-1.5 py-0.5">
        Utsatt
      </span>
    );
  }
  if (fixture.status === "cancelled") {
    return (
      <span className="text-[10px] font-mono uppercase tracking-kicker text-loss bg-loss/12 px-1.5 py-0.5">
        Avlyst
      </span>
    );
  }
  if (
    fixture.status === "live" ||
    fixture.status === "halftime" ||
    (fixture.status === "scheduled" &&
      new Date(fixture.kickoff).getTime() <= now.getTime() &&
      !fixture.result)
  ) {
    return (
      <span className="text-[10px] font-mono uppercase tracking-kicker text-signal flex items-center gap-1.5">
        <span className="live-dot inline-block" />
        {fixture.status === "halftime"
          ? "Pause"
          : fixture.result?.minute
            ? `Live · ${fixture.result.minute}'`
            : "Live"}
      </span>
    );
  }
  if (fixture.status === "finished") {
    return (
      <span className="text-[10px] font-mono uppercase tracking-kicker text-cream/45">
        Slutt
      </span>
    );
  }
  // Future scheduled — show kickoff + countdown
  const ms = new Date(fixture.kickoff).getTime() - now.getTime();
  return (
    <span className="text-[10px] font-mono text-cream/45 stat-num">
      {formatKickoff(fixture.kickoff)} · om {formatCountdown(ms)}
    </span>
  );
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "straks";
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d >= 1) return `${d}d ${h}t`;
  if (h >= 1) return `${h}t ${m}m`;
  return `${m}m`;
}

// ─── Locked card — pre-kickoff render ──────────────────────────────────────

function LockedTipsList({
  ownTip,
  fixture,
  now,
}: {
  ownTip: BoardTip | null;
  fixture: BoardFixture;
  now: Date;
}) {
  const ms = new Date(fixture.kickoff).getTime() - now.getTime();
  return (
    <div className="surface bg-canvas border border-cream/8 p-4 flex items-start gap-3">
      <Lock size={14} className="text-cream/45 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="text-sm text-cream/85 font-serif tracking-editorial leading-snug">
          De andre deltakernes tips blir synlige når kampen starter.
        </div>
        <div className="text-[11px] font-mono text-cream/45 mt-1 stat-num">
          Låses opp om {formatCountdown(ms)} · {formatKickoff(fixture.kickoff)} (din lokale tid)
        </div>
        {ownTip ? (
          <div className="text-[11px] font-mono text-cream/70 mt-2">
            Ditt tips:{" "}
            <span className="text-amber font-semibold stat-num">
              {ownTip.homeScore}–{ownTip.awayScore}
            </span>
          </div>
        ) : (
          <div className="text-[11px] font-mono text-cream/45 mt-2 italic">
            Du har ikke tippet denne kampen.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Revealed card — kickoff has passed ────────────────────────────────────

function RevealedTipsList({
  tips,
  members,
  youId,
  result,
}: {
  tips: BoardTip[];
  members: BoardMember[];
  youId: string;
  result: BoardFixture["result"];
}) {
  const tipByUser = new Map<string, BoardTip>();
  for (const t of tips) tipByUser.set(t.userId, t);

  const resultOutcome = result
    ? result.homeScore > result.awayScore
      ? "H"
      : result.homeScore < result.awayScore
        ? "A"
        : "D"
    : null;

  function grade(tip: BoardTip): "exact" | "outcome" | "miss" | null {
    if (!result) return null;
    if (tip.homeScore === result.homeScore && tip.awayScore === result.awayScore) return "exact";
    const o = tip.homeScore > tip.awayScore ? "H" : tip.homeScore < tip.awayScore ? "A" : "D";
    return o === resultOutcome ? "outcome" : "miss";
  }

  // ×N aggregate for matching score lines.
  const counts = new Map<string, number>();
  for (const t of tips) {
    const k = `${t.homeScore}-${t.awayScore}`;
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
      {members.map((m) => {
        const tip = tipByUser.get(m.userId);
        const isYou = m.userId === youId;
        const agree = tip ? counts.get(`${tip.homeScore}-${tip.awayScore}`) ?? 1 : 0;
        const g = tip ? grade(tip) : null;
        return (
          <div
            key={m.userId}
            className={`flex items-center justify-between text-xs py-1 ${
              isYou ? "ring-1 ring-signal/30 bg-signal/5 px-2" : "px-2"
            }`}
          >
            <span className="font-serif text-cream/85 truncate">
              {m.label}
              {isYou && (
                <span className="ml-1.5 text-[9px] uppercase tracking-kicker font-mono text-signal">
                  deg
                </span>
              )}
            </span>
            {tip ? (
              <span
                className={`font-mono font-semibold stat-num shrink-0 flex items-center gap-1.5 ${
                  g === "exact"
                    ? "text-win"
                    : g === "outcome"
                      ? "text-amber"
                      : g === "miss"
                        ? "text-cream/45 line-through"
                        : "text-amber"
                }`}
                title={
                  g === "exact"
                    ? "3 poeng — eksakt"
                    : g === "outcome"
                      ? "1 poeng — riktig utfall"
                      : g === "miss"
                        ? "0 poeng"
                        : undefined
                }
              >
                {tip.homeScore}–{tip.awayScore}
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
  );
}
