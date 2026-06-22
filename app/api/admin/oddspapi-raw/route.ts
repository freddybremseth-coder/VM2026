/**
 * Diag — dumps a raw OddsPapi /odds response for the first upcoming
 * tm_match so we can see the actual field shape (the spec warned this is
 * the one place that may differ from documented form). Bearer auth.
 */

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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

  const admin = createSupabaseAdminClient();
  const { data: matchRows } = await admin
    .from("tm_matches")
    .select("external_id, home_team, away_team")
    .eq("status", "upcoming")
    .order("commence_at", { ascending: true })
    .limit(1);
  const match = (matchRows ?? [])[0] as
    | { external_id: string; home_team: string; away_team: string }
    | undefined;
  if (!match) {
    return NextResponse.json({ error: "no upcoming matches" }, { status: 404 });
  }

  const url = new URL("https://api.oddspapi.io/v4/odds");
  url.searchParams.set("apiKey", apiKey);
  url.searchParams.set("fixtureId", match.external_id);

  const res = await fetch(url.toString(), {
    headers: { accept: "application/json" },
    cache: "no-store",
  });
  const text = await res.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = text.slice(0, 1000);
  }

  // Describe the structure without risking a mid-JSON slice. We walk the
  // top of the tree and report keys + types so we can see how bookmakers /
  // markets / outcomes are actually named.
  function describe(value: unknown, depth: number): unknown {
    if (depth > 4) return "…";
    if (Array.isArray(value)) {
      return {
        type: "array",
        length: value.length,
        first: value.length > 0 ? describe(value[0], depth + 1) : null,
      };
    }
    if (value && typeof value === "object") {
      const obj = value as Record<string, unknown>;
      const out: Record<string, unknown> = {};
      for (const k of Object.keys(obj).slice(0, 20)) {
        out[k] = describe(obj[k], depth + 1);
      }
      return out;
    }
    if (typeof value === "string") return value.length > 40 ? `string(${value.length})` : value;
    return typeof value;
  }

  return NextResponse.json({
    httpStatus: res.status,
    match,
    structure: describe(parsed, 0),
  });
}
