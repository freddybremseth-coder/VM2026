import Link from "next/link";
import { GitBranch, ArrowUpRight } from "lucide-react";
import { HoloFlag } from "@/components/shared/HoloFlag";
import { Kicker } from "@/components/shared/EditorialKicker";
import { formatKickoff, formatDateLabel } from "@/lib/utils";
import type { KnockoutMatch, TournamentPhase } from "@/lib/knockout-summary";

/**
 * Home-page knockout strip — the bracket front-and-centre once the group stage
 * is done. Shows the featured knockout matches with teams resolved from the
 * standings (or the slot label until known), and links into the full tree.
 */
export function KnockoutStrip({
  matches,
  phase,
}: {
  matches: KnockoutMatch[];
  phase: TournamentPhase;
}) {
  if (matches.length === 0) return null;
  return (
    <section className="px-5 md:px-10 mt-9">
      <div className="flex items-end justify-between gap-3 mb-3">
        <div>
          <Kicker tone="signal">
            <span className="inline-flex items-center gap-2">
              <GitBranch size={11} /> Sluttspill
            </span>
          </Kicker>
          <h2 className="font-serif text-2xl font-semibold tracking-editorial text-cream mt-1">
            {phase === "done" ? "Veien til finalen" : "Neste i sluttspillet"}
          </h2>
        </div>
        <Link
          href="/bracket"
          className="inline-flex items-center gap-1 text-[10px] uppercase tracking-kicker font-mono text-signal hover:text-amber transition-colors shrink-0"
        >
          Hele treet <ArrowUpRight size={12} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {matches.map((m) => (
          <div key={m.id} className="surface p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] uppercase tracking-kicker font-mono text-cream/55">
                {m.round}
              </span>
              <span className="font-mono text-[10px] text-cream/60 stat-num">
                {m.result
                  ? m.result.finished
                    ? "FT"
                    : "LIVE"
                  : `${formatDateLabel(m.kickoff).split(",")[0]} · ${formatKickoff(m.kickoff)}`}
              </span>
            </div>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <Side team={m.home} label={m.homeLabel} align="right" />
              <div className="font-serif text-base font-bold stat-num text-amber px-1 shrink-0">
                {m.result ? `${m.result.home}–${m.result.away}` : "vs"}
              </div>
              <Side team={m.away} label={m.awayLabel} align="left" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Side({
  team,
  label,
  align,
}: {
  team: KnockoutMatch["home"];
  label: string;
  align: "left" | "right";
}) {
  if (!team) {
    return (
      <div
        className={`text-[11px] font-mono text-cream/45 truncate ${
          align === "right" ? "text-right" : ""
        }`}
        title={label}
      >
        {label}
      </div>
    );
  }
  return (
    <div
      className={`flex items-center gap-2 min-w-0 ${
        align === "right" ? "flex-row-reverse text-right" : ""
      }`}
    >
      <HoloFlag code={team.flag} w={20} radius={2} />
      <span className="font-serif text-sm font-semibold tracking-editorial text-cream truncate leading-tight">
        {team.name}
      </span>
    </div>
  );
}
