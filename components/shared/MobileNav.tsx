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
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AppLogo, ChatGeniusBadge } from "./Logo";
import type { NavLabels } from "./Sidebar";

const NAV_META = [
  { href: "/", key: "dashboard" as const, icon: LayoutDashboard },
  { href: "/norge", key: "norge" as const, icon: Flag },
  { href: "/matches", key: "matches" as const, icon: Calendar },
  { href: "/teams", key: "teams" as const, icon: Users },
  { href: "/players", key: "players" as const, icon: User },
  { href: "/predictions", key: "predictions" as const, icon: Target },
  { href: "/leagues", key: "leagues" as const, icon: Trophy },
  { href: "/bracket", key: "bracket" as const, icon: GitBranch },
];

/**
 * Mobile-only hamburger + slide-in drawer. The desktop Sidebar stays
 * `hidden lg:flex`, so this component is the only navigation surface for
 * touch users. Closes on route change, backdrop tap, or Escape.
 */
export function MobileNav({ labels }: { labels: NavLabels }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close when the route changes (link click)
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape + lock body scroll when open
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
        className="lg:hidden p-1.5 rounded-md text-pitch-300 hover:bg-pitch-800 hover:text-pitch-100"
        aria-label="Open navigation"
      >
        <Menu size={18} />
      </button>

      {open && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-pitch-950/80 backdrop-blur-sm"
          />

          {/* Drawer */}
          <aside className="relative w-72 max-w-[85vw] h-full bg-pitch-900 border-r border-pitch-800 flex flex-col px-3 py-5 shadow-2xl">
            <div className="px-2 mb-6 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2.5">
                <AppLogo size={32} />
                <div className="leading-tight">
                  <div className="text-sm font-bold tracking-tight bg-gradient-to-r from-[#ff5cc8] via-[#a78bfa] to-[#22d3ee] bg-clip-text text-transparent">
                    WC26
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-pitch-400">
                    Stats · Predictions
                  </div>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-md text-pitch-300 hover:bg-pitch-800 hover:text-pitch-100"
                aria-label="Close navigation"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex flex-col gap-0.5 flex-1 overflow-y-auto">
              {NAV_META.map(({ href, key, icon: Icon }) => {
                const label = labels[key];
                const active =
                  href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                      active
                        ? "bg-pitch-800 text-accent-300"
                        : "text-pitch-300 hover:bg-pitch-800/60 hover:text-pitch-100",
                    )}
                  >
                    <Icon
                      size={16}
                      className={cn(
                        "shrink-0",
                        active
                          ? "text-accent-400"
                          : "text-pitch-400 group-hover:text-pitch-200",
                      )}
                    />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 pt-4 border-t border-pitch-800 px-2">
              <ChatGeniusBadge />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
