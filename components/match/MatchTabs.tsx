"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  matchId: number;
}

export function MatchTabs({ matchId }: Props) {
  const pathname = usePathname();
  const base = `/matches/${matchId}`;
  const tabs = [
    { href: base, label: "Overview" },
    { href: `${base}/stats`, label: "Stats & xG" },
    { href: `${base}/lineups`, label: "Lineups" },
    { href: `${base}/tactics`, label: "Tactics" },
    { href: `${base}/h2h`, label: "H2H" },
    { href: `${base}/injuries`, label: "Injuries" },
  ];

  return (
    <div className="border-b border-cream/8">
      <nav className="flex gap-1 -mb-px overflow-x-auto scrollbar-thin">
        {tabs.map((t) => {
          const active = t.href === base ? pathname === base : pathname === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={cn(
                "px-4 py-2.5 text-sm border-b-2 transition-colors whitespace-nowrap",
                active
                  ? "border-signal text-cream font-serif font-semibold tracking-editorial"
                  : "border-transparent text-cream/55 hover:text-cream hover:border-cream/30",
              )}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
