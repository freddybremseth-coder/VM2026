import { MatchCard } from "./MatchCard";
import type { MatchSummary } from "@/lib/types";

interface Props {
  title: string;
  icon?: React.ReactNode;
  matches: MatchSummary[];
  emptyLabel?: string;
}

export function MatchesSection({ title, icon, matches, emptyLabel }: Props) {
  if (matches.length === 0 && !emptyLabel) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h2 className="text-xs uppercase tracking-widest font-semibold text-pitch-200">
          {title}
        </h2>
        <span className="text-[10px] font-mono text-pitch-500">
          ({matches.length})
        </span>
      </div>
      {matches.length === 0 ? (
        <div className="card-panel p-6 text-center text-sm text-pitch-500">
          {emptyLabel}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {matches.map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      )}
    </section>
  );
}
