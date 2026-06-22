/**
 * Shared navigation source-of-truth used by both desktop Sidebar and
 * mobile drawer. Single place to add/reorder/rename links — and a single
 * place to fall back to English defaults so the UI never goes blank when
 * the i18n dictionary is missing a key.
 */

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
  TrendingUp,
} from "lucide-react";

export type NavKey =
  | "dashboard"
  | "norge"
  | "matches"
  | "teams"
  | "players"
  | "scorers"
  | "predictions"
  | "leagues"
  | "bracket"
  | "tippemodell";

export type NavLabels = Record<NavKey, string>;

export const NAV_ITEMS: Array<{
  href: string;
  key: NavKey;
  icon: typeof LayoutDashboard;
}> = [
  // Most-used flows live at the top: matches → top scorers → mini-leagues.
  { href: "/",            key: "dashboard",   icon: LayoutDashboard },
  { href: "/matches",     key: "matches",     icon: Calendar },
  { href: "/scorers",     key: "scorers",     icon: Crosshair },
  { href: "/leagues",     key: "leagues",     icon: Trophy },
  { href: "/predictions", key: "predictions", icon: Target },
  { href: "/tippemodell", key: "tippemodell", icon: TrendingUp },
  { href: "/bracket",     key: "bracket",     icon: GitBranch },
  { href: "/norge",       key: "norge",       icon: Flag },
  { href: "/teams",       key: "teams",       icon: Users },
  { href: "/players",     key: "players",     icon: User },
];

/**
 * English fallback labels. Used when no i18n labels are provided
 * (defensive: ensures the menu never goes blank).
 */
export const DEFAULT_NAV_LABELS: NavLabels = {
  dashboard: "Dashboard",
  norge: "Follow Norway",
  matches: "Matches",
  teams: "Teams",
  players: "Players",
  scorers: "Top scorers",
  predictions: "Predictions",
  leagues: "Mini-leagues",
  bracket: "Bracket",
  tippemodell: "Tippemodell",
};
