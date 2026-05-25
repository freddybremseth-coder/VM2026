/**
 * Admin status page for the periodic refresh worker.
 *
 * Auth-gated server wrapper. Access rules:
 *   1. Must be signed in (otherwise → /login).
 *   2. If ADMIN_USER_IDS is set (comma-separated Supabase user ids), only
 *      those users may view; everyone else gets a 404 so the route's
 *      existence isn't leaked.
 *   3. If ADMIN_USER_IDS is unset, any signed-in user may view — the
 *      status report contains no secrets, just timing + change summaries.
 *
 * The actual polling UI lives in CronStatusClient (client component).
 */

import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CronStatusClient } from "./CronStatusClient";

export default async function CronStatusPage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const allowlist = (process.env.ADMIN_USER_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (allowlist.length > 0 && !allowlist.includes(user.id)) {
    notFound();
  }

  return <CronStatusClient />;
}
