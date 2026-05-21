"use client";

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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AppLogo, ChatGeniusBadge } from "./Logo";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/matches", label: "Matches", icon: Calendar },
  { href: "/teams", label: "Teams", icon: Users },
  { href: "/players", label: "Players", icon: User },
  { href: "/predictions", label: "Predictions", icon: Target },
  { href: "/leagues", label: "Mini-leagues", icon: Trophy },
  { href: "/bracket", label: "Bracket", icon: GitBranch },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-pitch-800 bg-pitch-900/40 px-3 py-5">
      <Link href="/" className="px-2 mb-6 flex items-center gap-2.5 group">
        <AppLogo size={36} className="group-hover:scale-105 transition-transform" />
        <div className="leading-tight">
          <div className="text-sm font-bold tracking-tight bg-gradient-to-r from-[#ff5cc8] via-[#a78bfa] to-[#22d3ee] bg-clip-text text-transparent">
            WC26
          </div>
          <div className="text-[10px] uppercase tracking-widest text-pitch-400">
            Stats · Predictions
          </div>
        </div>
      </Link>

      <nav className="flex flex-col gap-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-pitch-800 text-accent-300"
                  : "text-pitch-300 hover:bg-pitch-800/60 hover:text-pitch-100",
              )}
            >
              <Icon
                size={16}
                className={cn(
                  "shrink-0",
                  active ? "text-accent-400" : "text-pitch-400 group-hover:text-pitch-200",
                )}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-pitch-800 space-y-3">
        <div className="rounded-md bg-pitch-800/60 p-3">
          <div className="text-[10px] uppercase tracking-widest text-pitch-400">
            Live model
          </div>
          <div className="mt-1 font-mono text-xs text-accent-300">
            wcf-baseline-v0.1
          </div>
        </div>
        <div className="px-2">
          <ChatGeniusBadge />
        </div>
      </div>
    </aside>
  );
}
