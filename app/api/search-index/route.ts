/**
 * Serves the global search index (teams + players). Static for the whole
 * tournament line-up, so it's heavily cacheable — the client fetches it
 * once on first focus of the search box.
 */

import { NextResponse } from "next/server";
import { getSearchIndex } from "@/lib/search-index";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json(
    { entries: getSearchIndex() },
    {
      headers: {
        // Immutable for the session; bumped naturally on redeploy.
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    },
  );
}
