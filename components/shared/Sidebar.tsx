"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AppLogo, ChatGeniusBadge, CreditsBadge } from "./Logo";
import {
  NAV_ITEMS,
  DEFAULT_NAV_LABELS,
  type NavLabels,
} from "@/lib/nav-items";

// Re-export so existing imports from "@/components/shared/Sidebar" still work.
export type { NavLabels } from "@/lib/nav-items";

export function Sidebar({ labels }: { labels?: Partial<NavLabels> }) {
  const pathname = usePathname();
  const resolved: NavLabels = { ...DEFAULT_NAV_LABELS, ...(labels ?? {}) };

  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-pitch-800 bg-pitch-900/40 px-3 py-5">
      <Link href="/" className="px-2 mb-6 flex items-center gap-2.5 group">
        <AppLogo size={36} className="group-hover:scale-105 transition-transform" />
        <div className="leading-tight">
          <div className="text-sm font-bold tracking-tight bg-gradient-to-r from-[#ff5cc8] via-[#a78bfa] to-[#22d3ee] bg-clip-text text-transparent">
            WC26
          </div>
          <div className="text-[10px] uppercase tracking-widest text-pitch-300">
            Stats · Predictions
          </div>
        </div>
      </Link>

      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ href, key, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-pitch-800 text-accent-300 font-semibold"
                  : "text-pitch-200 hover:bg-pitch-800/60 hover:text-white",
              )}
            >
              <Icon
                size={16}
                className={cn(
                  "shrink-0",
                  active ? "text-accent-400" : "text-pitch-300 group-hover:text-pitch-100",
                )}
              />
              <span>{resolved[key]}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-pitch-800 space-y-3">
        <div className="rounded-md bg-pitch-800/60 p-3">
          <div className="text-[10px] uppercase tracking-widest text-pitch-300">
            Live model
          </div>
          <div className="mt-1 font-mono text-xs text-accent-300">
            wcf-baseline-v0.1
          </div>
        </div>
        <div className="px-2">
          <ChatGeniusBadge />
        </div>
        <div className="px-2 pt-2 border-t border-pitch-800/60">
          <CreditsBadge />
        </div>
      </div>
    </aside>
  );
}
