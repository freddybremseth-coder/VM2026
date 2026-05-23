import { cn } from "@/lib/utils";

/**
 * Cinematic stadium backdrop — VM2026 hero surface.
 *
 * CSS-only floodlit pitch atmosphere: warm radial light from the top, a
 * red key-light, green turf glow at the bottom, repeating light rays, and
 * a faint mowed-stripe pattern that fades into the vignette.
 *
 * Pass `photoSrc` to layer a real photograph (Unsplash, etc.) behind the
 * atmosphere overlays — gives the hero the "fans / stadium / celebration"
 * feel without losing the editorial cinematic treatment. The photo is
 * desaturated + darkened so the cream/serif text on top stays legible.
 *
 * `photoPosition` lets you nudge the focal point ("center 30%" is a good
 * default for crowd photos — keeps faces in the middle band).
 */
export function StadiumBackdrop({
  children,
  className,
  height,
  style,
  photoSrc,
  photoPosition = "center 35%",
  photoOpacity = 0.55,
}: {
  children: React.ReactNode;
  className?: string;
  height?: number | string;
  style?: React.CSSProperties;
  /** Optional photo URL layered underneath the atmosphere overlays. */
  photoSrc?: string;
  /** CSS background-position for the photo. Default "center 35%". */
  photoPosition?: string;
  /** 0–1 mix of the photo through the warm overlay. Default 0.55. */
  photoOpacity?: number;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden stadium-bg stadium-rays stadium-grass",
        className,
      )}
      style={{ height, ...style }}
    >
      {/* Optional real photograph underneath the CSS atmosphere */}
      {photoSrc && (
        <>
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url(${photoSrc})`,
              backgroundSize: "cover",
              backgroundPosition: photoPosition,
              opacity: photoOpacity,
              filter: "saturate(0.9) contrast(1.05)",
            }}
          />
          {/* Warm tint so the photo blends with the canvas palette */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(21,17,15,.35) 0%, rgba(21,17,15,.55) 55%, hsl(var(--canvas)) 100%)",
              mixBlendMode: "multiply",
            }}
          />
        </>
      )}

      <div className="absolute inset-0 stadium-vignette pointer-events-none" />
      <div className="relative h-full">{children}</div>
    </div>
  );
}
