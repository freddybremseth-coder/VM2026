"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AppLogo, ChatGeniusBadge, CreditsBadge } from "./Logo";
import { SongPlayerCard, NewSongPin } from "./SongPlayer";
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
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-cream/8 bg-paper/40 px-3 py-5">
      <Link href="/" className="px-2 mb-6 flex items-center gap-2.5 group">
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

      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ href, key, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group relative flex items-center gap-3 px-3 py-2 text-sm transition-colors",
                active
                  ? "text-cream font-semibold"
                  : "text-cream/65 hover:text-cream",
              )}
            >
              {/* Signal underline on active */}
              {active && (
                <span
                  aria-hidden
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[2px] bg-signal"
                />
              )}
              <Icon
                size={16}
                className={cn(
                  "shrink-0",
                  active ? "text-signal" : "text-cream/55 group-hover:text-cream",
                )}
              />
              <span className={active ? "font-serif tracking-editorial" : ""}>
                {resolved[key]}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-cream/8 space-y-3">
        <NewSongPin />
        <SongPlayerCard />
        <div className="surface px-3 py-2.5">
          <div className="text-[10px] uppercase tracking-kicker font-mono text-cream/55">
            Live model
          </div>
          <div className="mt-1 font-mono text-xs text-signal">
            wcf-baseline-v0.1
          </div>
        </div>
        <div className="px-2">
          <ChatGeniusBadge />
        </div>
        <div className="px-2 pt-2 border-t border-cream/8">
          <CreditsBadge />
        </div>
      </div>
    </aside>
  );
}
