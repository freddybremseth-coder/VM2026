/**
 * Diag — traces the Dixon-Coles value model for a France/Iraq test pairing
 * so we can see exactly where getMatchValue returns null. Bearer auth.
 */

import { NextRequest, NextResponse } from "next/server";
import { getTeamStrengths } from "@/lib/tournament-predictions";
import { getMatchValue } from "@/lib/tippemodell/value-model";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let strengthsInfo: unknown;
  try {
    const strengths = await getTeamStrengths();
    strengthsInfo = {
      size: strengths.size,
      france: strengths.get(14) ?? null,
      iraq: strengths.get(27) ?? null,
      norway: strengths.get(21) ?? null,
    };
  } catch (e) {
    strengthsInfo = { error: e instanceof Error ? e.message : String(e) };
  }

  let valueByName: unknown;
  try {
    valueByName = await getMatchValue(
      -1,
      { home: 2.0, draw: 3.4, away: 3.8 },
      { home: "France", away: "Iraq" },
    );
  } catch (e) {
    valueByName = { error: e instanceof Error ? e.message : String(e) };
  }

  return NextResponse.json({ strengthsInfo, valueByName });
}
