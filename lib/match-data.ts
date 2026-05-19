import norwaySpain from "@/mock/matches/norway-spain.json";
import type { MatchDetail } from "./types";

export function getMatchDetail(id: string): MatchDetail | null {
  if (id === "1001") return norwaySpain as MatchDetail;
  return null;
}
