import Link from "next/link";
import { LogIn, LogOut } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logoutAction } from "@/app/(auth)/actions";

function SignedOutBadge() {
  return (
    <Link
      href="/login"
      className="flex items-center gap-1.5 bg-signal/15 text-signal ring-1 ring-signal/30 hover:bg-signal/25 px-3 py-1.5 text-xs font-semibold transition-colors"
    >
      <LogIn size={13} />
      Logg inn
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

  const label = profile?.display_name || profile?.username || user.email?.split("@")[0] || "Spiller";
  const initials = label.slice(0, 2).toUpperCase();

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/leagues"
        className="flex items-center gap-2 bg-paper border border-cream/8 hover:border-cream/16 hover:bg-paperHi px-2 py-1.5 transition-colors"
        title="Mine ligaer"
      >
        <div className="h-5 w-5 bg-signal flex items-center justify-center font-serif font-bold text-cream text-[10px] leading-none">
          {initials}
        </div>
        <span className="text-xs font-medium text-cream/85 max-w-[120px] truncate hidden sm:inline">
          {label}
        </span>
      </Link>
      <form action={logoutAction}>
        <button
          type="submit"
          className="p-1.5 text-cream/55 hover:text-signal hover:bg-paper transition-colors"
          aria-label="Logg ut"
          title="Logg ut"
        >
          <LogOut size={14} />
        </button>
      </form>
    </div>
  );
}
