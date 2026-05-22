import { leagueGradient, leagueInitials } from "@/lib/league-avatar";

interface Props {
  /** League id or any stable string — same input always gives the same colour. */
  seed: string;
  name: string;
  size?: number;
  className?: string;
}

export function LeagueAvatar({ seed, name, size = 40, className }: Props) {
  const [from, to] = leagueGradient(seed);
  const initials = leagueInitials(name);

  return (
    <div
      className={"rounded-md flex items-center justify-center font-mono font-bold tracking-tight text-pitch-950 shrink-0 " + (className ?? "")}
      style={{
        width: size,
        height: size,
        backgroundImage: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
        fontSize: Math.max(11, Math.floor(size * 0.4)),
      }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}
