import Link from "next/link";
import { TeamFlag } from "./TeamFlag";
import type { WCTeam } from "@/lib/wc26-data";
import { cn } from "@/lib/utils";

interface Props {
  team: Pick<WCTeam, "id" | "name" | "shortName" | "flag">;
  /** Display mode: full = flag + name, short = flag + shortName, flag-only = just the flag. */
  variant?: "full" | "short" | "flag-only";
  /** Flag size. */
  size?: "sm" | "md" | "lg";
  /** Extra classes for the wrapping link. */
  className?: string;
  /** Show name in bold (default true). */
  bold?: boolean;
}

/**
 * Clickable team chip → /teams/[id].
 * Use this everywhere a team is rendered so navigation is consistent.
 */
export function TeamLink({
  team,
  variant = "full",
  size = "md",
  className,
  bold = true,
}: Props) {
  return (
    <Link
      href={`/teams/${team.id}`}
      className={cn(
        "inline-flex items-center gap-2 hover:text-accent-300 transition-colors group",
        className,
      )}
    >
      <TeamFlag code={team.flag} size={size} className="group-hover:ring-accent-400/40" />
      {variant === "full" && (
        <span className={cn("truncate", bold && "font-semibold")}>{team.name}</span>
      )}
      {variant === "short" && (
        <span className={cn("font-mono uppercase tracking-widest text-xs", bold && "font-semibold")}>
          {team.shortName}
        </span>
      )}
    </Link>
  );
}
