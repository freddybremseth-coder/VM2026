import { cn } from "@/lib/utils";

interface Props {
  label?: string;
  value: string | number;
  tone?: "default" | "accent" | "data" | "win" | "loss" | "draw";
  className?: string;
}

export function StatPill({ label, value, tone = "default", className }: Props) {
  const toneClass = {
    default: "bg-pitch-700/60 text-pitch-100",
    accent: "bg-accent-500/15 text-accent-300 ring-1 ring-accent-500/30",
    data: "bg-data-500/15 text-data-300 ring-1 ring-data-500/30",
    win: "bg-win/15 text-win ring-1 ring-win/30",
    loss: "bg-loss/15 text-loss ring-1 ring-loss/30",
    draw: "bg-draw/15 text-draw ring-1 ring-draw/30",
  }[tone];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-mono stat-num",
        toneClass,
        className,
      )}
    >
      {label && <span className="opacity-70">{label}</span>}
      <span className="font-semibold">{value}</span>
    </span>
  );
}
