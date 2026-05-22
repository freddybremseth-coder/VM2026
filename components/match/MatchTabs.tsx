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
    <div className="border-b border-pitch-700/60">
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
                  ? "border-accent-500 text-accent-300"
                  : "border-transparent text-pitch-400 hover:text-pitch-100 hover:border-pitch-600",
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
