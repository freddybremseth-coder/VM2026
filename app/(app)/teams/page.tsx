import Link from "next/link";
import { Users } from "lucide-react";
import { TeamFlag } from "@/components/shared/TeamFlag";
import { TEAMS, GROUPS } from "@/lib/wc26-data";

export default function TeamsPage() {
  return (
    <div className="px-6 py-6 max-w-[1400px] mx-auto">
      <header className="mb-6">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-accent-400 font-semibold mb-1">
          <Users size={12} />
          Teams
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          All 48 nations
        </h1>
        <p className="text-sm text-pitch-400 mt-1">
          Grouped by their first-round group. Click any team to see squad details.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {GROUPS.map((g) => (
          <div key={g} className="card-panel p-4">
            <div className="text-[10px] uppercase tracking-widest text-accent-400 font-mono font-semibold mb-3">
              Group {g}
            </div>
            <ul className="space-y-2">
              {TEAMS.filter((t) => t.group === g).map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/teams/${t.id}`}
                    className="flex items-center gap-2 text-sm hover:text-accent-300"
                  >
                    <TeamFlag code={t.flag} size="sm" />
                    <span className="flex-1 truncate">{t.name}</span>
                    <span
                      className={`text-[9px] uppercase tracking-widest font-mono px-1.5 py-0.5 rounded ${
                        t.squadStatus === "preliminary"
                          ? "bg-draw/15 text-draw"
                          : t.squadStatus === "official"
                            ? "bg-accent-500/15 text-accent-300"
                            : "bg-pitch-800 text-pitch-500"
                      }`}
                    >
                      {t.squadStatus === "preliminary"
                        ? "Prelim"
                        : t.squadStatus === "official"
                          ? "Official"
                          : "Pending"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
