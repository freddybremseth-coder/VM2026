"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  User,
  Target,
  Trophy,
  GitBranch,
  Flag,
  Crosshair,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatGeniusBadge, CreditsBadge } from "./Logo";
import { SongPlayerCard, NewSongPin } from "./SongPlayer";
import { DEFAULT_NAV_LABELS, type NavLabels } from "@/lib/nav-items";

// Inline NAV items so this component does not depend on a separate file
// import at runtime — eliminates the most common cause of the "drawer
// opens but middle is empty" bug (tree-shaking / chunk-split races).
const NAV = [
  { href: "/",            key: "dashboard"   as const, Icon: LayoutDashboard },
  { href: "/matches",     key: "matches"     as const, Icon: Calendar },
  { href: "/scorers",     key: "scorers"     as const, Icon: Crosshair },
  { href: "/leagues",     key: "leagues"     as const, Icon: Trophy },
  { href: "/predictions", key: "predictions" as const, Icon: Target },
  { href: "/bracket",     key: "bracket"     as const, Icon: GitBranch },
  { href: "/norge",       key: "norge"       as const, Icon: Flag },
  { href: "/teams",       key: "teams"       as const, Icon: Users },
  { href: "/players",     key: "players"     as const, Icon: User },
];

/**
 * Mobile-only hamburger + slide-in drawer. The desktop Sidebar stays
 * `hidden lg:flex`, so this component is the only navigation surface for
 * touch users. Closes on route change, backdrop tap, Escape, or X.
 *
 * Layout note: we deliberately avoid `flex-1` + nested `h-full` for the
 * inner list — that combo collapses to 0 height on iOS Safari in some
 * versions. Instead the aside is explicitly `h-dvh` and the inner list
 * just expands naturally with the content; the footer stays at the
 * bottom via `mt-auto`.
 */
export function MobileNav({ labels }: { labels?: Partial<NavLabels> }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Resolve labels with fallbacks so the menu never goes blank.
  const resolved: NavLabels = { ...DEFAULT_NAV_LABELS, ...(labels ?? {}) };

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lg:hidden p-1.5 text-cream/70 hover:bg-paper hover:text-cream"
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>

      {open && (
        <div
          className="lg:hidden fixed inset-0 z-[60]"
          role="dialog"
          aria-modal="true"
        >
          {/* Solid backdrop — full viewport. */}
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-canvas/90 backdrop-blur-sm"
          />

          {/* Drawer — fixed to the left edge with explicit viewport height. */}
          <aside
            className="absolute top-0 left-0 w-80 max-w-[88vw] bg-paper border-r border-cream/8 shadow-2xl flex flex-col px-3 py-5"
            style={{ height: "100dvh" }}
          >
            <div className="px-2 mb-6 flex items-center justify-between shrink-0">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-signal flex items-center justify-center font-serif font-bold text-cream text-base tracking-tight">
                  26
                </div>
                <div className="leading-tight">
                  <div className="font-serif text-base font-semibold tracking-editorial text-cream">
                    VM 2026
                  </div>
                  <div className="text-[10px] uppercase tracking-kicker font-mono text-cream/55">
                    Stats · Predictions
                  </div>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 text-cream/70 hover:bg-canvas hover:text-cream"
                aria-label="Close navigation"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-col gap-0.5 overflow-y-auto">
              {NAV.map(({ href, key, Icon }) => {
                const label = resolved[key];
                const active =
                  href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "group relative flex items-center gap-3 px-3 py-3 text-base transition-colors",
                      active
                        ? "text-cream font-semibold"
                        : "text-cream/65 hover:text-cream",
                    )}
                  >
                    {active && (
                      <span
                        aria-hidden
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[2px] bg-signal"
                      />
                    )}
                    <Icon
                      size={18}
                      className={cn(
                        "shrink-0",
                        active ? "text-signal" : "text-cream/55 group-hover:text-cream",
                      )}
                    />
                    <span className={active ? "font-serif tracking-editorial" : ""}>
                      {label}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto pt-4 border-t border-cream/8 space-y-3 shrink-0">
              <NewSongPin />
              <SongPlayerCard />
              <div className="px-2 space-y-3">
                <ChatGeniusBadge />
                <CreditsBadge />
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
