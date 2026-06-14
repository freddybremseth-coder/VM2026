/**
 * Upsert the in-code FIXTURES list into the public.fixtures table.
 *
 * The fixtures table is what the predictions RLS policy joins on to gate
 * teammate visibility by kickoff. Run this:
 *   1. Right after applying migration 0004 (initial seed lives in the SQL,
 *      but a re-run after a schedule change keeps the table current).
 *   2. From the result-fetch cron so kickoff edits / postponements
 *      propagate without a redeploy.
 *
 * Service-role only — the table's RLS denies all public writes.
 */

import { FIXTURES } from "@/lib/wc26-fixtures";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export interface SyncFixturesResult {
  ok: boolean;
  upserted: number;
  error?: string;
}

export async function syncFixturesToDb(): Promise<SyncFixturesResult> {
  let admin: ReturnType<typeof createSupabaseAdminClient>;
  try {
    admin = createSupabaseAdminClient();
  } catch (err) {
    return {
      ok: false,
      upserted: 0,
      error: err instanceof Error ? err.message : String(err),
    };
  }

  const rows = FIXTURES.map((f) => ({
    id: f.id,
    kickoff: f.kickoff,
    // Don't overwrite a status that the result-fetch cron already set
    // (live/halftime/finished/postponed). We only assert 'scheduled' for
    // brand-new rows; on conflict we leave status alone.
    status: "scheduled" as const,
  }));

  // The upsert below uses `ignoreDuplicates: false` so kickoff updates DO
  // propagate (postponed → new kickoff still gets reflected). Status is
  // intentionally left alone via the SQL ON CONFLICT clause set up
  // separately if needed; for now we accept that calling sync resets
  // status on existing rows to 'scheduled'. The caller should run sync
  // BEFORE the cron status-update task, not after.
  //
  // To preserve status: we upsert in two passes — insert only the rows
  // that don't yet exist, then update kickoff on existing rows without
  // touching status.

  const { data: existing } = await admin
    .from("fixtures")
    .select("id");
  const existingIds = new Set(((existing as { id: number }[] | null) ?? []).map((r) => r.id));

  const newRows = rows.filter((r) => !existingIds.has(r.id));
  const updateRows = rows.filter((r) => existingIds.has(r.id));

  let upserted = 0;

  if (newRows.length > 0) {
    const { error, count } = await admin
      .from("fixtures")
      .insert(newRows, { count: "exact" });
    if (error) {
      return { ok: false, upserted, error: error.message };
    }
    upserted += count ?? newRows.length;
  }

  // For existing rows, only update kickoff. Done row-by-row to avoid
  // touching status (Supabase doesn't expose a column-scoped upsert).
  for (const r of updateRows) {
    const { error } = await admin
      .from("fixtures")
      .update({ kickoff: r.kickoff })
      .eq("id", r.id);
    if (error) {
      return { ok: false, upserted, error: error.message };
    }
    upserted++;
  }

  return { ok: true, upserted };
}
