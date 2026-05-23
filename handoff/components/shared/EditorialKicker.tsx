import { cn } from "@/lib/utils";

/**
 * Editorial primitives — the magazine voice of VM2026.
 *
 * `Kicker` is the small uppercase label that introduces a section.
 *  Red (signal) by default; pass `tone` to override.
 *
 * `Headline` is the serif display title that follows. Sizes are by
 *  rank — `h1` is hero scale, `h2` is page-section scale, etc.
 *
 * `EditorialPullQuote` is the italic serif quote used sparingly on
 *  flagship pages (Norge, player profiles). Render with care.
 */

export function Kicker({
  children,
  tone = "signal",
  className,
}: {
  children: React.ReactNode;
  tone?: "signal" | "amber" | "muted" | "cream";
  className?: string;
}) {
  const color = {
    signal: "text-signal",
    amber:  "text-amber",
    muted:  "text-cream/55",
    cream:  "text-cream",
  }[tone];
  return (
    <div className={cn("kicker", color, className)}>{children}</div>
  );
}

export function Headline({
  as: Tag = "h2",
  rank = "h2",
  children,
  className,
}: {
  as?: keyof JSX.IntrinsicElements;
  rank?: "h1" | "h2" | "h3" | "h4";
  children: React.ReactNode;
  className?: string;
}) {
  const size = {
    h1: "text-[42px] md:text-[80px]",
    h2: "text-[26px] md:text-[32px]",
    h3: "text-[20px] md:text-[24px]",
    h4: "text-[16px] md:text-[18px]",
  }[rank];
  return (
    // @ts-expect-error — dynamic tag
    <Tag className={cn("headline", size, className)}>{children}</Tag>
  );
}

export function PullQuote({
  children,
  cite,
  className,
}: {
  children: React.ReactNode;
  cite?: string;
  className?: string;
}) {
  return (
    <figure className={cn("py-2", className)}>
      <blockquote className="font-serif text-2xl md:text-3xl italic leading-snug text-cream/85 tracking-editorial">
        «{children}»
      </blockquote>
      {cite && (
        <figcaption className="kicker-muted mt-3">— {cite}</figcaption>
      )}
    </figure>
  );
}
