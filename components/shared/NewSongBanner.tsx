"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Music4, ExternalLink, X } from "lucide-react";
import { LATEST_SONG, LATEST_SONG_URL } from "./SongPlayer";

/**
 * Top-of-page news banner announcing the latest VM anthem. Shown to logged-in
 * users until they dismiss it. Dismissal is remembered per-song in
 * localStorage, so each NEW drop re-announces itself (the key carries the
 * current youtubeId). Renders nothing until mounted to avoid a hydration flash.
 */
const STORAGE_KEY = `newsong-dismissed-${LATEST_SONG.youtubeId}`;

export function NewSongBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== "1") setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  return (
    <div className="relative bg-signal/12 border-b border-signal/25">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-2.5 flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 shrink-0">
          <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-extrabold tracking-[1.4px] uppercase bg-signal text-cream animate-pulse">
            Nytt
          </span>
          <Music4 size={14} className="text-amber" />
        </span>

        <Link
          href={LATEST_SONG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group min-w-0 flex items-center gap-2 text-sm text-cream hover:text-amber transition-colors"
        >
          <span className="truncate">
            Ny sang publisert:{" "}
            <span className="font-serif font-semibold tracking-editorial">
              «{LATEST_SONG.title}»
            </span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase tracking-kicker font-mono text-signal group-hover:text-amber shrink-0">
            Hør den <ExternalLink size={10} />
          </span>
        </Link>

        <button
          type="button"
          onClick={dismiss}
          aria-label="Lukk varsel"
          className="ml-auto shrink-0 p-1 text-cream/55 hover:text-cream hover:bg-paper transition-colors"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
