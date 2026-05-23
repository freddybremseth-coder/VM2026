"use client";

/**
 * TeamFormStrip — compact last-5 form display.
 *
 * Can be used as a server component (pass `form` directly) or
 * as a client component (pass `teamId` to fetch on mount).
 *
 * Usage (server — preferred):
 *   import { getTeamForm } from "@/lib/team-form";
 *   const form = await getTeamForm(team.id);
 *   <TeamFormStrip form={form} />
 *
 * Usage (client — for dynamic updates):
 *   <TeamFormStrip teamId={team.id} />
 */

import { useEffect, useState } from "react";
import type { TeamFormData, FormMatch, FormResult } from "@/lib/team-form";
import { Database, Sparkles } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function ResultDot({ result, match }: { result: FormResult; match: FormMatch }) {
  const colorClass =
    result === "W"
      ? "bg-win text-canvas"
      : result === "D"
      ? "bg-amber text-canvas"
      : "bg-loss text-cream";

  const label =
    result === "W" ? "S" : result === "D" ? "U" : "T";

  const tooltip = `${match.opponent} ${match.goalsFor}–${match.goalsAgainst} (${match.competition})`;

  return (
    <span
      title={tooltip}
      className={`inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold leading-none ${colorClass} cursor-default`}
    >
      {label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  /** Pass pre-fetched data (server-side). */
  form?: TeamFormData;
  /** Pass team ID to fetch client-side (fallback). */
  teamId?: number;
  /** Display orientation */
  layout?: "row" | "col";
  /** Show the last-match details below the dots */
  showLastMatch?: boolean;
}

export function TeamFormStrip({
  form: initialForm,
  teamId,
  layout = "row",
  showLastMatch = false,
}: Props) {
  const [form, setForm] = useState<TeamFormData | null>(initialForm ?? null);
  const [loading, setLoading] = useState(!initialForm && !!teamId);

  useEffect(() => {
    if (initialForm || !teamId) return;
    fetch(`/api/team-form/${teamId}`)
      .then((r) => r.json())
      .then((d: TeamFormData) => setForm(d))
      .catch(() => setLoading(false))
      .finally(() => setLoading(false));
  }, [teamId, initialForm]);

  if (loading) {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="w-5 h-5 bg-paper animate-pulse" />
        ))}
      </div>
    );
  }

  if (!form) return null;

  const isMock = form.source === "mock";

  return (
    <div className={`flex ${layout === "col" ? "flex-col gap-2" : "items-center gap-3"}`}>
      {/* Dots row */}
      <div className="flex items-center gap-1">
        {form.matches.map((m, i) => (
          <ResultDot key={i} result={m.result} match={m} />
        ))}
      </div>

      {/* Source badge */}
      <span
        title={
          isMock
            ? "Eksempeldata — sett API_FOOTBALL_KEY for ekte kampdata"
            : `API-Football · ${form.fetchedAt.slice(0, 10)}`
        }
        className={`flex items-center gap-1 text-[9px] font-mono uppercase tracking-kicker px-1.5 py-0.5 ${
          isMock
            ? "bg-paper text-cream/45 border border-cream/8"
            : "bg-amber/10 text-amber"
        }`}
      >
        {isMock ? <Sparkles size={8} /> : <Database size={8} />}
        {isMock ? "mock" : "live"}
      </span>

      {/* Last match detail (optional) */}
      {showLastMatch && form.matches[0] && (
        <div className="text-[10px] text-cream/55 font-mono">
          Sist: {form.matches[0].opponent}{" "}
          {form.matches[0].goalsFor}–{form.matches[0].goalsAgainst}{" "}
          <span className="text-cream/35">({form.matches[0].date.slice(0, 7)})</span>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Server-friendly static version (no hooks, pure render)
// ─────────────────────────────────────────────────────────────────────────────

export function TeamFormStripStatic({ form }: { form: TeamFormData }) {
  const isMock = form.source === "mock";
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1">
        {form.matches.map((m, i) => (
          <ResultDot key={i} result={m.result} match={m} />
        ))}
      </div>
      <span
        className={`text-[9px] font-mono uppercase tracking-kicker px-1.5 py-0.5 ${
          isMock
            ? "bg-paper text-cream/45 border border-cream/8"
            : "bg-amber/10 text-amber"
        }`}
      >
        {isMock ? "mock" : "live"}
      </span>
    </div>
  );
}
