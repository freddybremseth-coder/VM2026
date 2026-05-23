import { cn } from "@/lib/utils";

/**
 * Cinematic stadium backdrop — VM2026 hero surface.
 *
 * CSS-only floodlit pitch atmosphere: warm radial light from the top, a
 * red key-light, green turf glow at the bottom, repeating light rays, and
 * a faint mowed-stripe pattern that fades into the vignette.
 *
 * Drop this around any hero header. When real WC26 photography becomes
 * available, accept a `bgImage` prop and layer the same overlays on top.
 */
export function StadiumBackdrop({
  children,
  className,
  height,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  height?: number | string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden stadium-bg stadium-rays stadium-grass",
        className,
      )}
      style={{ height, ...style }}
    >
      <div className="absolute inset-0 stadium-vignette pointer-events-none" />
      <div className="relative h-full">{children}</div>
    </div>
  );
}
