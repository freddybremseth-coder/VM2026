/**
 * Diag endpoint — lists every tournament name OddsPapi is currently
 * carrying for football, so we can confirm the exact string to seed in
 * tm_leagues. Bearer CRON_SECRET auth so the key never leaves the server.
 */

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function ymd(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.ODDS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ODDS_API_KEY not set" }, { status: 500 });
  }

  const today = new Date();
  const to = new Date(today);
  to.setDate(to.getDate() + 10);

  const url = new URL("https://api.oddspapi.io/v4/fixtures");
  url.searchParams.set("apiKey", apiKey);
  url.searchParams.set("sportId", "10");
  url.searchParams.set("from", ymd(today));
  url.searchParams.set("to", ymd(to));

  const res = await fetch(url.toString(), {
    headers: { accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    return NextResponse.json(
      { error: `OddsPapi ${res.status}`, body: body.slice(0, 500) },
      { status: 500 },
    );
  }

  const data = (await res.json()) as Array<{
    tournamentName?: string;
    participant1Name: string;
    participant2Name: string;
    startTime: string;
    hasOdds: boolean;
  }>;

  // Tally tournament names + show WC-like matches.
  const tally = new Map<string, number>();
  const wcLike: Array<{
    tournament: string;
    home: string;
    away: string;
    date: string;
    hasOdds: boolean;
  }> = [];
  for (const f of data) {
    const t = f.tournamentName ?? "(no name)";
    tally.set(t, (tally.get(t) ?? 0) + 1);
    const lo = t.toLowerCase();
    if (lo.includes("world") || lo.includes("fifa") || lo.includes("wc")) {
      wcLike.push({
        tournament: t,
        home: f.participant1Name,
        away: f.participant2Name,
        date: f.startTime.slice(0, 10),
        hasOdds: f.hasOdds,
      });
    }
  }

  const tournaments = [...tally.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  return NextResponse.json({
    totalFixtures: data.length,
    uniqueTournaments: tournaments.length,
    wcMatches: wcLike.slice(0, 20),
    tournaments: tournaments.slice(0, 50),
  });
}
