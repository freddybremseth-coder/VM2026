/**
 * GET /api/match-events/:matchId
 *
 * Returns full MatchEventData JSON for the given match.
 * During live matches the client polls this every 30 s.
 *
 * Cache strategy:
 *   - live / halftime  → 30 s revalidation (ISR)
 *   - finished         → 1 h revalidation (static)
 *   - scheduled        → 5 min revalidation
 */

import { NextResponse } from "next/server";
import { getMatchEvents } from "@/lib/match-events/provider";

export async function GET(
  _req: Request,
  { params }: { params: { matchId: string } },
) {
  const id = Number(params.matchId);
  if (!id || isNaN(id)) {
    return NextResponse.json({ error: "Invalid matchId" }, { status: 400 });
  }

  try {
    const data = await getMatchEvents(id);

    const maxAge =
      data.status === "live" || data.status === "halftime"
        ? 30
        : data.status === "finished"
        ? 3600
        : 300;

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": `public, s-maxage=${maxAge}, stale-while-revalidate=60`,
      },
    });
  } catch (err) {
    console.error("[api/match-events]", err);
    return NextResponse.json({ error: "Failed to fetch match events" }, { status: 500 });
  }
}
