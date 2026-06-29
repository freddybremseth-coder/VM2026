/**
 * Diag — calls OddsPapi /fixtures with the real server key and returns the
 * response status + every rate-limit / reset header, so we can tell whether
 * the 250-request limit resets (and when) or is a hard cap. Bearer auth.
 */

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const key = process.env.ODDS_API_KEY;
  if (!key) return NextResponse.json({ error: "ODDS_API_KEY not set on server" });

  const url = new URL("https://api.oddspapi.io/v4/fixtures");
  url.searchParams.set("apiKey", key);
  url.searchParams.set("sportId", "10");
  url.searchParams.set("from", "2026-06-29");
  url.searchParams.set("to", "2026-07-01");

  const res = await fetch(url.toString(), { cache: "no-store" });
  const headers: Record<string, string> = {};
  res.headers.forEach((v, k) => {
    if (
      /rate|limit|retry|reset|remaining|quota|date|x-/i.test(k)
    ) {
      headers[k] = v;
    }
  });
  const body = await res.text();

  return NextResponse.json({
    status: res.status,
    keyLength: key.length,
    headers,
    body: body.slice(0, 400),
  });
}
