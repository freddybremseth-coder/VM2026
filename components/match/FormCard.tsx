import { Activity, Database, Sparkles } from "lucide-react";
import { getRecentForm, type Result, type FormEntry } from "@/lib/recent-form";
import { getTeamForm, type TeamFormData, type FormMatch } from "@/lib/team-form";
import type { WCTeam } from "@/lib/wc26-data";

interface Props {
  home: WCTeam;
  away: WCTeam;
}

/**
 * Two-team form card.
 *
 * Tries API-Football first for each team (server-side, ISR cached 6h).
 * Falls back to the static hand-curated data in lib/recent-form.ts when:
 *   - API key not set
 *   - Team ID not mapped yet
 *   - API request fails
 *
 * Shows a live/mock badge so users know the data provenance.
 */
export async function FormCard({ home, away }: Props) {
  // Fetch both teams in parallel
  const [homeForm, awayForm] = await Promise.all([
    getTeamForm(home.id),
    getTeamForm(away.id),
  ]);

  const anyLive = homeForm.source === "espn" || awayForm.source === "espn";

  return (
    <div className="card-panel p-4">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-semibold mb-3">
        <div className="flex items-center gap-2 text-pitch-300">
          <Activity size={14} className="text-data-400" />
          Siste 5 kamper
        </div>
        <span
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${
            anyLive ? "bg-data-500/10 text-data-300" : "bg-pitch-800 text-pitch-500"
          }`}
        >
          {anyLive ? <Database size={8} /> : <Sparkles size={8} />}
          {anyLive ? "live" : "mock"}
        </span>
      </div>

      <div className="space-y-2.5">
        <TeamFormRow team={home} apiForm={homeForm} />
        <TeamFormRow team={away} apiForm={awayForm} />
      </div>

      <div className="mt-3 pt-3 border-t border-pitch-700/60 text-[10px] text-pitch-500 font-mono">
        {anyLive
          ? "Kilde: API-Football · sist oppdatert " + homeForm.fetchedAt.slice(0, 10)
          : "Kilde: UEFA / CONMEBOL / AFC — mai 2026"}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function TeamFormRow({ team, apiForm }: { team: WCTeam; apiForm: TeamFormData }) {
  // Prefer API-Football data; fall back to static
  const useApi = apiForm.matches.length > 0;
  const staticForm = getRecentForm(team.id);
  const showStatic = !useApi && staticForm.length > 0;

  return (
    <div className="flex items-center gap-2">
      <div className="w-10 text-[11px] uppercase tracking-widest text-pitch-300 font-mono shrink-0">
        {team.shortName}
      </div>
      {useApi ? (
        <ApiFormPills matches={apiForm.matches} />
      ) : showStatic ? (
        <StaticFormPills entries={staticForm} />
      ) : (
        <span className="text-[11px] text-pitch-500 italic">Ingen data ennå</span>
      )}
    </div>
  );
}

function ApiFormPills({ matches }: { matches: FormMatch[] }) {
  return (
    <div className="flex gap-1 flex-1">
      {matches.map((m, i) => {
        const tone =
          m.result === "W"
            ? "bg-win/20 text-win ring-win/40"
            : m.result === "D"
            ? "bg-draw/15 text-draw ring-draw/40"
            : "bg-loss/15 text-loss ring-loss/40";
        return (
          <span
            key={i}
            title={`${m.goalsFor}–${m.goalsAgainst} vs ${m.opponent} · ${m.competition} · ${m.date}`}
            className={`h-7 w-7 inline-flex items-center justify-center rounded-md text-[11px] font-bold font-mono ring-1 ${tone}`}
          >
            {m.result}
          </span>
        );
      })}
    </div>
  );
}

function StaticFormPills({ entries }: { entries: FormEntry[] }) {
  const tone = (r: Result) =>
    r === "W"
      ? "bg-win/20 text-win ring-win/40"
      : r === "D"
      ? "bg-draw/15 text-draw ring-draw/40"
      : "bg-loss/15 text-loss ring-loss/40";

  return (
    <div className="flex gap-1 flex-1">
      {entries.slice(0, 5).reverse().map((entry, i) => (
        <span
          key={`${entry.date}-${i}`}
          title={`${entry.scoreFor}–${entry.scoreAgainst} vs ${entry.opponent} · ${entry.competition} · ${entry.date}`}
          className={`h-7 w-7 inline-flex items-center justify-center rounded-md text-[11px] font-bold font-mono ring-1 ${tone(entry.result)}`}
        >
          {entry.result}
        </span>
      ))}
    </div>
  );
}
