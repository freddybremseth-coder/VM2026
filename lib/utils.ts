import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * All fixture times are displayed in Central European time (Madrid / Paris /
 * Oslo). FIFA publishes kickoffs in host-city local time; we store them as
 * UTC in the fixture file and convert on render so European viewers see the
 * time they'll actually need to tune in at.
 */
const DISPLAY_TZ = "Europe/Oslo"; // same offset as Madrid + Paris year-round

export function formatKickoff(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: DISPLAY_TZ,
  });
}

export function formatDateLabel(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: DISPLAY_TZ,
  });
}

export function formatKickoffWithZone(iso: string): string {
  return `${formatKickoff(iso)} CET`;
}
