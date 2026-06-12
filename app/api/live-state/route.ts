/**
 * Current live state — driven by the fixture calendar + wall clock for now.
 * Polled by the global LiveStatusBar. Never cached: the whole point is that
 * it reflects "now", and it's the seam where a real score feed plugs in.
 */

import { NextResponse } from "next/server";
import { computeLiveState } from "@/lib/live-state";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const state = await computeLiveState();
  return NextResponse.json(state, {
    headers: { "Cache-Control": "no-store" },
  });
}
