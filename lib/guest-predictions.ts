/**
 * Client-side helper for "guest tipping" — lets a non-authenticated visitor
 * place up to 3 predictions before being asked to sign up. The tips live in
 * localStorage so they survive page refresh but not other devices.
 *
 * When the user later signs in we offer to migrate these into Supabase.
 */

const STORAGE_KEY = "wc26.guest_predictions.v1";
export const GUEST_LIMIT = 3;

export interface GuestPrediction {
  matchId: number;
  homeScore: number;
  awayScore: number;
  /** ISO timestamp when the tip was placed. */
  placedAt: string;
}

type Store = Record<string, GuestPrediction>; // keyed by matchId

function readRaw(): Store {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Store;
  } catch {
    return {};
  }
}

function writeRaw(store: Store): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function getGuestPrediction(matchId: number): GuestPrediction | undefined {
  return readRaw()[String(matchId)];
}

export function getAllGuestPredictions(): GuestPrediction[] {
  return Object.values(readRaw()).sort((a, b) =>
    a.placedAt.localeCompare(b.placedAt),
  );
}

export function getGuestCount(): number {
  return Object.keys(readRaw()).length;
}

export function saveGuestPrediction(
  matchId: number,
  homeScore: number,
  awayScore: number,
): { ok: true } | { ok: false; reason: "limit_reached" | "invalid" } {
  if (!Number.isInteger(homeScore) || !Number.isInteger(awayScore)) {
    return { ok: false, reason: "invalid" };
  }
  if (homeScore < 0 || awayScore < 0 || homeScore > 20 || awayScore > 20) {
    return { ok: false, reason: "invalid" };
  }
  const store = readRaw();
  const isUpdate = String(matchId) in store;
  if (!isUpdate && Object.keys(store).length >= GUEST_LIMIT) {
    return { ok: false, reason: "limit_reached" };
  }
  store[String(matchId)] = {
    matchId,
    homeScore,
    awayScore,
    placedAt: new Date().toISOString(),
  };
  writeRaw(store);
  return { ok: true };
}

export function clearGuestPredictions(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
