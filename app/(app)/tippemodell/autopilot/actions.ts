"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export interface SetBankrollResponse {
  ok?: true;
  error?: string;
}

function isAdmin(userId: string): boolean {
  const allow = (process.env.ADMIN_USER_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  // No allowlist → any signed-in user (same convention as /admin/results).
  if (allow.length === 0) return true;
  return allow.includes(userId);
}

/**
 * Set the starting bankroll (the "deposited sum") the auto-pilot sizes its
 * Kelly stakes against. Existing settled bets keep their realized P&L; the
 * displayed bankroll re-bases on the new starting amount.
 */
export async function setStartingBankrollAction(
  amount: number,
): Promise<SetBankrollResponse> {
  if (!Number.isFinite(amount) || amount < 1 || amount > 10_000_000) {
    return { error: "Beløp må være mellom 1 og 10 000 000 kr." };
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Du må være innlogget." };
  if (!isAdmin(user.id)) return { error: "Mangler admin-tilgang." };

  try {
    const admin = createSupabaseAdminClient();
    const { error } = await admin
      .from("tm_paper_config")
      .upsert(
        { id: 1, starting_bankroll: Math.round(amount * 100) / 100, updated_at: new Date().toISOString() },
        { onConflict: "id" },
      );
    if (error) return { error: error.message };
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) };
  }

  revalidatePath("/tippemodell/autopilot");
  return { ok: true };
}
