import { NextRequest, NextResponse } from "next/server";
import { getTeamForm } from "@/lib/team-form";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: { teamId: string } },
) {
  const id = parseInt(params.teamId, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "invalid teamId" }, { status: 400 });
  }

  try {
    const data = await getTeamForm(id);
    return NextResponse.json(data, {
      headers: {
        // Cache 6 hours on CDN; stale-while-revalidate for 1h
        "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=3600",
      },
    });
  } catch (err) {
    console.error("[api/team-form]", err);
    return NextResponse.json({ error: "fetch failed" }, { status: 500 });
  }
}
