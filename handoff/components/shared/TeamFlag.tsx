import { HoloFlag } from "./HoloFlag";

/**
 * Backwards-compatible wrapper around <HoloFlag>.
 * The codebase already uses <TeamFlag code="..." size="sm|md|lg" /> in many
 * places — keep that surface and route to HoloFlag underneath so the redesign
 * propagates without touching every call site.
 */

const SIZE_TO_PX: Record<"sm" | "md" | "lg" | "xl", number> = {
  sm: 18,
  md: 28,
  lg: 42,
  xl: 64,
};

interface Props {
  code: string;
  size?: "sm" | "md" | "lg" | "xl";
  /** Live? Adds animated shimmer. */
  live?: boolean;
  className?: string;
}

export function TeamFlag({ code, size = "md", live, className }: Props) {
  return (
    <HoloFlag
      code={code}
      w={SIZE_TO_PX[size]}
      shimmer={live ? "animated" : "medium"}
      className={className}
    />
  );
}
