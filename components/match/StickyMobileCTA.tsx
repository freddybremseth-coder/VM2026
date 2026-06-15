import Link from "next/link";
import { Target, Share2, Lock } from "lucide-react";

/**
 * Sticky bottom bar shown on mobile only across the whole match-center
 * layout. Keeps a one-tap action visible no matter how far the user has
 * scrolled. Adapts to fixture state:
 *   tippable (pre-kickoff)   → "Tipp denne kampen"
 *   locked (kickoff passed)  → "Tipping stengt" link to /predictions
 * Hidden on desktop where the inline CTA bar is always above the fold.
 */
interface Props {
  matchId: number;
  /** False when the fixture is past kickoff / cancelled. Defaults to true. */
  tippable?: boolean;
}

export function StickyMobileCTA({ matchId, tippable = true }: Props) {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-pitch-900/95 backdrop-blur border-t border-pitch-700 px-3 py-3 flex items-center gap-2 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.6)]">
      <Link
        href={`/share/match/${matchId}`}
        className="rounded-md bg-pitch-800 hover:bg-pitch-700 text-pitch-100 text-xs font-semibold px-3 py-2 transition-colors flex items-center justify-center gap-1.5 shrink-0"
        aria-label="Share this match"
      >
        <Share2 size={13} />
      </Link>
      {tippable ? (
        <Link
          href="/predictions"
          className="flex-1 rounded-md bg-accent-500 hover:bg-accent-400 text-pitch-950 text-sm font-bold px-4 py-2.5 transition-colors flex items-center justify-center gap-1.5"
        >
          <Target size={15} /> Tipp denne kampen
        </Link>
      ) : (
        <Link
          href="/predictions"
          className="flex-1 rounded-md bg-pitch-800 hover:bg-pitch-700 text-pitch-100 text-sm font-semibold px-4 py-2.5 transition-colors flex items-center justify-center gap-1.5"
        >
          <Lock size={13} /> Tipping stengt — se mine tips
        </Link>
      )}
    </div>
  );
}
