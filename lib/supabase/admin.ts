/**
 * Service-role Supabase client. Use sparingly — it bypasses RLS, so every
 * call site must do its own authorization check first.
 *
 * Only required for writes that the public/RLS policies deliberately block:
 *   - Upserting `match_results` (write-policy is `using (false)`)
 *   - The cron grading task
 *
 * Reads should always use createSupabaseServerClient(), which respects RLS
 * and inherits the requesting user's identity.
 */

import { createClient } from "@supabase/supabase-js";

let _admin: ReturnType<typeof createClient> | null = null;

export function createSupabaseAdminClient() {
  if (_admin) return _admin;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase admin client missing env (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).",
    );
  }
  _admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _admin;
}
