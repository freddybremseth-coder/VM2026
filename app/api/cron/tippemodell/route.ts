/**
 * Tippemodell cron — combined fixtures + odds ingest in a single endpoint so
 * cron-job.org only needs one trigger.
 *
 * Step 1: pull active leagues from tm_leagues. For each, fetch the next
 *         7 days of OddsPapi fixtures (filtered to that tournament's name)
 *         and upsert into tm_matches keyed on external_id. Tries to link
 *         each fixture to an internal wc26-fixture id so the rest of the
 *         app can stitch in team/score data.
 *
 * Step 2: pull all upcoming tm_matches in the next 3 days, fetch their
 *         odds with cooldown-respecting batching, upsert any new
 *         bookmakers, and insert one tm_odds_snapshots row per
 *         (match, bookmaker, market, outcome) at the same captured_at
 *         timestamp.
 *
 * Auth: Bearer CRON_SECRET, same convention as /api/cron/refresh.
 * Idempotent: re-running adds new snapshot rows but never duplicates fixtures.
 */

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  fetchFixtures,
  fetchOddsBatch,
  isOddsApiConfigured,
  SHARP_BOOKMAKERS,
  type NormalisedOutcome,
} from "@/lib/tippemodell/oddspapi";
import { resolveWC26FixtureId } from "@/lib/tippemodell/wc26-matcher";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

const SPORT_ID_FOOTBALL = "10";

interface LeagueRow {
  id: number;
  external_id: string;
  name: string;
}

interface MatchRow {
  id: number;
  external_id: string;
  home_team: string;
  away_team: string;
}

interface BookmakerRow {
  id: number;
  key: string;
}

interface MarketRow {
  id: number;
  key: string;
}

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!isOddsApiConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        skipped: true,
        reason: "ODDS_API_KEY not set — tippemodell ingest skipped",
      },
      { status: 200 },
    );
  }

  const startedAt = new Date().toISOString();
  const supabase = createSupabaseAdminClient();

  // ── Step 1: ingest fixtures ──────────────────────────────────────────────
  const { data: leaguesRaw, error: leaguesErr } = await supabase
    .from("tm_leagues")
    .select("id, external_id, name")
    .eq("active", true);
  if (leaguesErr) {
    return NextResponse.json(
      { error: `tm_leagues: ${leaguesErr.message}` },
      { status: 500 },
    );
  }
  const leagues = (leaguesRaw ?? []) as LeagueRow[];
  if (leagues.length === 0) {
    return NextResponse.json({
      ok: true,
      message: "No active leagues",
      startedAt,
    });
  }

  const today = new Date();
  const toDate = new Date(today);
  toDate.setDate(toDate.getDate() + 7);
  const fromStr = ymd(today);
  const toStr = ymd(toDate);

  let fixturesUpserted = 0;
  const fixtureErrors: string[] = [];
  for (const league of leagues) {
    let fixtures: Awaited<ReturnType<typeof fetchFixtures>> = [];
    try {
      fixtures = await fetchFixtures({
        sportId: SPORT_ID_FOOTBALL,
        from: fromStr,
        to: toStr,
        tournamentName: league.name,
      });
    } catch (err) {
      // A transient OddsPapi error (429 rate-limit, 5xx) for one league must
      // not abort the whole run — we still ingest odds for matches already in
      // the DB, and the next tick retries the fixtures.
      fixtureErrors.push(
        `${league.name}: ${err instanceof Error ? err.message : String(err)}`,
      );
      continue;
    }
    for (const f of fixtures) {
      const wc26 = resolveWC26FixtureId(f.homeTeam, f.awayTeam, f.startTime);
      const { error } = await supabase.from("tm_matches").upsert(
        {
          external_id: f.externalId,
          league_id: league.id,
          home_team: f.homeTeam,
          away_team: f.awayTeam,
          commence_at: f.startTime,
          status: "upcoming",
          wc26_fixture_id: wc26,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "external_id" },
      );
      if (!error) fixturesUpserted++;
    }
  }

  // ── Step 2: ingest odds for upcoming matches ─────────────────────────────
  const { data: marketsRaw } = await supabase
    .from("tm_markets")
    .select("id, key");
  const marketIdByKey = new Map(
    ((marketsRaw ?? []) as MarketRow[]).map((m) => [m.key, m.id]),
  );

  // OddsPapi free tier = 250 requests/day. Each run costs 1 fixtures call +
  // 1 odds call per match fetched, so fetching every upcoming match within 3
  // days (~35 matches) at an 8×/day cadence blew past 250 → 429s, no odds.
  // Only fetch odds for matches kicking off in the next ODDS_WINDOW_H hours
  // (the ones that actually matter for betting + line movement), and skip
  // already-started matches. Bounds per-run cost to the soonest LIMIT matches.
  const ODDS_WINDOW_H = 48;
  const LIMIT = 24;
  const now = new Date();
  const horizon = new Date(now.getTime() + ODDS_WINDOW_H * 3_600_000);
  const { data: upcomingRaw } = await supabase
    .from("tm_matches")
    .select("id, external_id, home_team, away_team")
    .eq("status", "upcoming")
    .gte("commence_at", now.toISOString())
    .lte("commence_at", horizon.toISOString())
    .order("commence_at", { ascending: true })
    .limit(LIMIT);
  const matches = (upcomingRaw ?? []) as MatchRow[];

  let snapshotCount = 0;
  let bookmakersCreated = 0;

  if (matches.length > 0) {
    const oddsByMatch = await fetchOddsBatch(
      matches.map((m) => ({
        externalId: m.external_id,
        homeTeam: m.home_team,
        awayTeam: m.away_team,
      })),
    );

    const { data: bmRaw } = await supabase
      .from("tm_bookmakers")
      .select("id, key");
    const bmIdByKey = new Map(
      ((bmRaw ?? []) as BookmakerRow[]).map((b) => [b.key, b.id]),
    );

    const capturedAt = new Date().toISOString();

    for (const m of matches) {
      const outcomes: NormalisedOutcome[] = oddsByMatch.get(m.external_id) ?? [];
      if (outcomes.length === 0) continue;

      const rows: Array<{
        match_id: number;
        bookmaker_id: number;
        market_id: number;
        outcome: string;
        price: number;
        point: number | null;
        captured_at: string;
      }> = [];

      for (const o of outcomes) {
        let bmId = bmIdByKey.get(o.bookmakerKey);
        if (!bmId) {
          const { data: ins } = await supabase
            .from("tm_bookmakers")
            .upsert(
              {
                key: o.bookmakerKey,
                title: o.bookmakerTitle,
                is_sharp: SHARP_BOOKMAKERS.has(o.bookmakerKey),
              },
              { onConflict: "key" },
            )
            .select("id")
            .single();
          if (ins) {
            bmId = (ins as { id: number }).id;
            bmIdByKey.set(o.bookmakerKey, bmId);
            bookmakersCreated++;
          }
        }
        const marketId = marketIdByKey.get(o.marketKey);
        if (!bmId || !marketId) continue;
        rows.push({
          match_id: m.id,
          bookmaker_id: bmId,
          market_id: marketId,
          outcome: o.outcome,
          price: o.price,
          point: o.point ?? null,
          captured_at: capturedAt,
        });
      }

      if (rows.length > 0) {
        const { error } = await supabase.from("tm_odds_snapshots").insert(rows);
        if (!error) snapshotCount += rows.length;
      }
    }
  }

  return NextResponse.json({
    ok: true,
    startedAt,
    finishedAt: new Date().toISOString(),
    fixturesUpserted,
    fixtureErrors,
    matchesWithOdds: matches.length,
    snapshotCount,
    bookmakersCreated,
  });
}
