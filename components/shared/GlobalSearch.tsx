"use client";

/**
 * Global search box for the top bar. Searches teams + players.
 *
 * The index (~1000 entries) is fetched lazily from /api/search-index on the
 * first focus, then filtered entirely client-side so subsequent keystrokes
 * are instant. Keyboard: ↑/↓ to move, Enter to open, Esc to close.
 */

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, Users, User } from "lucide-react";
import { HoloFlag } from "@/components/shared/HoloFlag";
import type { SearchEntry } from "@/lib/search-index";

const MAX_RESULTS = 8;

/** Lower-case + strip diacritics so "ødegaard" matches "Ødegaard". */
function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function rank(entry: SearchEntry, q: string): number {
  const name = norm(entry.name);
  if (name === q) return 0;
  if (name.startsWith(q)) return 1;
  // Word-boundary prefix (eg. surname).
  if (name.split(/[\s.-]+/).some((w) => w.startsWith(q))) return 2;
  if (name.includes(q)) return 3;
  if (norm(entry.sub).includes(q)) return 4;
  return Infinity;
}

export function GlobalSearch({ placeholder }: { placeholder: string }) {
  const router = useRouter();
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  // Lazy-load the index on first focus.
  async function ensureIndex() {
    if (index || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/search-index");
      const json = (await res.json()) as { entries: SearchEntry[] };
      setIndex(json.entries);
    } catch {
      setIndex([]);
    } finally {
      setLoading(false);
    }
  }

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const q = norm(query.trim());
  const results: SearchEntry[] =
    q.length < 1 || !index
      ? []
      : index
          .map((e) => ({ e, r: rank(e, q) }))
          .filter((x) => x.r !== Infinity)
          .sort((a, b) => a.r - b.r || a.e.name.length - b.e.name.length)
          .slice(0, MAX_RESULTS)
          .map((x) => x.e);

  function go(entry: SearchEntry) {
    setOpen(false);
    setQuery("");
    router.push(entry.href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const hit = results[active] ?? results[0];
      if (hit) go(hit);
    }
  }

  const showDropdown = open && query.trim().length > 0;

  return (
    <div ref={rootRef} className="relative w-full">
      <label className="relative block">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/60 pointer-events-none"
        />
        <input
          type="text"
          value={query}
          placeholder={placeholder}
          onFocus={() => {
            ensureIndex();
            setOpen(true);
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          className="w-full bg-paper border border-cream/8 pl-9 pr-3 py-1.5 text-sm text-cream placeholder:text-cream/60 focus:outline-none focus:border-signal/50"
          aria-label={placeholder}
          autoComplete="off"
        />
        {loading && (
          <Loader2
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/60 animate-spin"
          />
        )}
      </label>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-paperHi border border-cream/12 shadow-2xl max-h-[60vh] overflow-y-auto">
          {results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-cream/55 italic font-serif">
              {loading ? "Laster søkeindeks…" : `Ingen treff for «${query.trim()}»`}
            </div>
          ) : (
            results.map((entry, i) => (
              <button
                key={`${entry.type}-${entry.href}`}
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => go(entry)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                  i === active ? "bg-signal/12" : "hover:bg-paper"
                }`}
              >
                {entry.flag ? (
                  <HoloFlag code={entry.flag} w={22} radius={2} />
                ) : (
                  <div className="w-[22px] h-[15px] bg-paper" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-cream font-serif tracking-editorial truncate">
                    {entry.name}
                  </div>
                  <div className="text-[11px] text-cream/60 font-mono truncate">
                    {entry.sub}
                  </div>
                </div>
                <span className="shrink-0 text-cream/50">
                  {entry.type === "team" ? <Users size={13} /> : <User size={13} />}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
