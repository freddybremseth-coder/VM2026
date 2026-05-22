"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppLogo, ChatGeniusBadge, CreditsBadge } from "./Logo";
import {
  NAV_ITEMS,
  DEFAULT_NAV_LABELS,
  type NavLabels,
} from "@/lib/nav-items";

/**
 * Mobile-only hamburger + slide-in drawer. The desktop Sidebar stays
 * `hidden lg:flex`, so this component is the only navigation surface for
 * touch users. Closes on route change, backdrop tap, Escape, or X button.
 *
 * Defensive: labels are optional and fall back to English defaults, so even
 * if a stale client chunk doesn't pass them, the menu still renders fully.
 */
export function MobileNav({ labels }: { labels?: Partial<NavLabels> }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Resolve labels with fallbacks so the menu can never go blank.
  const resolved: NavLabels = { ...DEFAULT_NAV_LABELS, ...(labels ?? {}) };

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
        className="lg:hidden p-1.5 rounded-md text-pitch-200 hover:bg-pitch-800 hover:text-white"
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>

      {open && (
        <div
          className="lg:hidden fixed inset-0 z-[60] flex"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-pitch-950/85 backdrop-blur-sm"
          />

          {/* Drawer */}
          <aside className="relative w-80 max-w-[88vw] h-full bg-pitch-900 border-r border-pitch-700 flex flex-col px-3 py-5 shadow-2xl">
            <div className="px-2 mb-6 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2.5">
                <AppLogo size={36} />
                <div className="leading-tight">
                  <div className="text-sm font-bold tracking-tight bg-gradient-to-r from-[#ff5cc8] via-[#a78bfa] to-[#22d3ee] bg-clip-text text-transparent">
                    WC26
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-pitch-300">
                    Stats · Predictions
                  </div>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-md text-pitch-200 hover:bg-pitch-800 hover:text-white"
                aria-label="Close navigation"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-col gap-0.5 flex-1 overflow-y-auto">
              {NAV_ITEMS.map(({ href, key, icon: Icon }) => {
                const label = resolved[key];
                const active =
                  href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "group flex items-center gap-3 rounded-md px-3 py-3 text-base transition-colors",
                      active
                        ? "bg-pitch-800 text-accent-300 font-semibold"
                        : "text-pitch-100 hover:bg-pitch-800/60 hover:text-white",
                    )}
                  >
                    <Icon
                      size={18}
                      className={cn(
                        "shrink-0",
                        active
                          ? "text-accent-400"
                          : "text-pitch-300 group-hover:text-pitch-100",
                      )}
                    />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 pt-4 border-t border-pitch-700 px-2 space-y-3">
              <ChatGeniusBadge />
              <CreditsBadge />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
