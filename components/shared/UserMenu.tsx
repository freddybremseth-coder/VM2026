import Link from "next/link";
import { LogIn, LogOut, User } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logoutAction } from "@/app/(auth)/actions";

function SignedOutBadge() {
  return (
    <Link
      href="/login"
      className="flex items-center gap-1.5 rounded-md bg-accent-500/15 text-accent-300 ring-1 ring-accent-500/30 hover:bg-accent-500/25 px-3 py-1.5 text-xs font-semibold transition-colors"
    >
      <LogIn size={13} />
      Sign in
    </Link>
  );
}

export async function UserMenu() {
  // If Supabase isn't configured (eg. Vercel without env vars), render the
  // signed-out state without throwing.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return <SignedOutBadge />;
  }

  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <SignedOutBadge />;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name")
    .eq("id", user.id)
    .maybeSingle();

  const label = profile?.display_name || profile?.username || user.email?.split("@")[0] || "you";

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 rounded-md bg-pitch-800/70 border border-pitch-700 px-2.5 py-1.5">
        <div className="h-5 w-5 rounded-full bg-gradient-to-br from-data-400 to-data-500 flex items-center justify-center">
          <User size={11} className="text-pitch-950" />
        </div>
        <span className="text-xs font-medium">{label}</span>
      </div>
      <form action={logoutAction}>
        <button
          type="submit"
          className="p-1.5 rounded-md text-pitch-400 hover:text-loss hover:bg-pitch-800 transition-colors"
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut size={14} />
        </button>
      </form>
    </div>
  );
}
