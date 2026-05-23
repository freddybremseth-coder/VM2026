import Link from "next/link";
import { Users } from "lucide-react";
import { HoloFlag } from "@/components/shared/HoloFlag";
import { Kicker, Headline } from "@/components/shared/EditorialKicker";
import { DataSourceBanner } from "@/components/shared/DataSourceBanner";
import { TEAMS, GROUPS } from "@/lib/wc26-data";

export default function TeamsPage() {
  return (
    <div className="px-5 md:px-10 py-8 max-w-[1400px] mx-auto">
      <header className="mb-6">
        <Kicker tone="signal">
          <span className="inline-flex items-center gap-2">
            <Users size={11} /> Lag
          </span>
        </Kicker>
        <Headline rank="h1" className="mt-2">
          Alle 48 nasjoner.
        </Headline>
        <p className="text-sm text-cream/55 mt-3 max-w-xl">
          Sortert etter første-rundes gruppe. Trykk på et lag for å se troppen.
        </p>
      </header>

      <div className="mb-6">
        <DataSourceBanner caveat="Trop-status (Official / Preliminær / Pending) gjenspeiler det forbundet har publisert ved siste verifikasjon." />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-cream/8">
        {GROUPS.map((g) => (
          <div key={g} className="bg-paper p-5">
            <Kicker tone="signal">Gruppe {g}</Kicker>
            <ul className="mt-3 space-y-2">
              {TEAMS.filter((t) => t.group === g).map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/teams/${t.id}`}
                    className="flex items-center gap-3 py-1 -mx-2 px-2 hover:bg-cream/5 group transition-colors"
                  >
                    <HoloFlag code={t.flag} w={20} radius={2} />
                    <span className="font-serif text-base tracking-editorial flex-1 truncate group-hover:text-amber transition-colors">
                      {t.name}
                    </span>
                    <SquadBadge status={t.squadStatus} />
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

function SquadBadge({ status }: { status: "official" | "preliminary" | "pending" }) {
  const styles = {
    official: "bg-win/15 text-win",
    preliminary: "bg-amber/15 text-amber",
    pending: "bg-paper text-cream/55 border border-cream/8",
  }[status];
  const label = status === "preliminary" ? "Prelim" : status === "official" ? "Official" : "Pending";
  return (
    <span
      className={`text-[9px] uppercase tracking-kicker font-mono px-1.5 py-0.5 ${styles}`}
    >
      {label}
    </span>
  );
}
