"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { Play, Pause, Music4, ExternalLink } from "lucide-react";

/**
 * Re.Master Freddy's WC anthem "La oss stråle" — a single shared audio
 * source that survives navigation (lives in the app layout, which Next's
 * App Router does not unmount between routes).
 *
 * SongPlayerProvider owns the one <audio> element + play state. The UI
 * surfaces (SongPlayerCard for the desktop sidebar, SongPlayerButton for
 * the mobile top bar) both drive the same context, so there's never more
 * than one playback.
 */

const SRC = "/audio/la-oss-straale.mp3";
const LINK = "https://remaster.freddybremseth.com";
const TITLE = "La oss stråle";
const CREDIT = "Re.Master Freddy · VM-sang 2026";

interface SongCtx {
  playing: boolean;
  toggle: () => void;
}

const Ctx = createContext<SongCtx | null>(null);

function useSong(): SongCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("SongPlayer UI must be inside <SongPlayerProvider>");
  return ctx;
}

export function SongPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      el.pause();
      setPlaying(false);
    }
  }

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onEnd = () => setPlaying(false);
    const onPause = () => setPlaying(false);
    const onPlay = () => setPlaying(true);
    el.addEventListener("ended", onEnd);
    el.addEventListener("pause", onPause);
    el.addEventListener("play", onPlay);
    return () => {
      el.removeEventListener("ended", onEnd);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("play", onPlay);
    };
  }, []);

  return (
    <Ctx.Provider value={{ playing, toggle }}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} src={SRC} preload="none" />
      {children}
    </Ctx.Provider>
  );
}

/**
 * Stylish full card — sits in the desktop sidebar footer. Equalizer bars
 * animate while playing; tappable disc toggles play/pause; the title links
 * out to the remaster site.
 */
export function SongPlayerCard() {
  const { playing, toggle } = useSong();
  return (
    <div className="surface relative overflow-hidden px-3 py-2.5">
      {/* Signal wash that intensifies while playing */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          background:
            "linear-gradient(120deg, rgba(230,57,70,.18) 0%, rgba(255,183,46,.10) 60%, transparent 100%)",
          opacity: playing ? 1 : 0.4,
        }}
      />
      <div className="relative flex items-center gap-2.5">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Stopp VM-sangen" : "Spill VM-sangen"}
          className="h-9 w-9 shrink-0 bg-signal hover:bg-signalD text-cream flex items-center justify-center transition-colors"
        >
          {playing ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {playing ? (
              <Equalizer />
            ) : (
              <Music4 size={11} className="text-amber shrink-0" />
            )}
            <span className="font-serif text-sm font-semibold tracking-editorial text-cream truncate">
              {TITLE}
            </span>
          </div>
          <Link
            href={LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-0.5 flex items-center gap-1 text-[10px] uppercase tracking-kicker font-mono text-cream/55 hover:text-amber transition-colors"
          >
            {CREDIT}
            <ExternalLink size={9} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact icon button for the top bar — gives mobile users (no sidebar) a
 * way to play/stop. Drives the same shared audio.
 */
export function SongPlayerButton() {
  const { playing, toggle } = useSong();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? "Stopp VM-sangen" : "Spill VM-sangen «La oss stråle»"}
      title={`${TITLE} — ${CREDIT}`}
      className={`relative p-1.5 transition-colors lg:hidden ${
        playing
          ? "text-signal"
          : "text-cream/55 hover:bg-paper hover:text-cream"
      }`}
    >
      {playing ? <Pause size={16} /> : <Music4 size={16} />}
      {playing && (
        <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
      )}
    </button>
  );
}

/** Three little animated bars shown while the track plays. */
function Equalizer() {
  return (
    <span className="flex items-end gap-[2px] h-3 shrink-0" aria-hidden>
      <span className="w-[2px] h-full bg-signal origin-bottom animate-eq [animation-delay:-0.2s]" />
      <span className="w-[2px] h-full bg-signal origin-bottom animate-eq" />
      <span className="w-[2px] h-full bg-signal origin-bottom animate-eq [animation-delay:-0.4s]" />
    </span>
  );
}
