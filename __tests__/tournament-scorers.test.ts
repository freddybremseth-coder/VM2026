/**
 * Tests for the WC 2026 top-scorer aggregator.
 *
 * The aggregator runs against rows from `public.tournament_goals`. We
 * stub a minimal SupabaseClient — only the `.from(...).select(...)`
 * chain that `getTournamentTopScorersLive` actually uses needs to be
 * implemented — and assert the totals / ordering / own-goal handling.
 */

import { describe, it, expect } from "vitest";
import { getTournamentTopScorersLive } from "@/lib/tournament-scorers";

interface Row {
  team_id: number;
  scorer_name: string;
  scorer_player_id: number | null;
  is_own_goal: boolean;
  is_penalty: boolean;
}

function stubClient(rows: Row[]): any {
  return {
    from(table: string) {
      if (table !== "tournament_goals") {
        throw new Error(`unexpected table ${table}`);
      }
      return {
        select() {
          return Promise.resolve({ data: rows, error: null });
        },
      };
    },
  };
}

describe("getTournamentTopScorersLive", () => {
  it("returns empty list when no goals logged yet", async () => {
    const res = await getTournamentTopScorersLive(stubClient([]), 10);
    expect(res).toEqual([]);
  });

  it("sums goals per player and sorts descending", async () => {
    const rows: Row[] = [
      // Haaland (NOR=21) — 3 open-play goals
      { team_id: 21, scorer_name: "Erling Haaland", scorer_player_id: 2121, is_own_goal: false, is_penalty: false },
      { team_id: 21, scorer_name: "Erling Haaland", scorer_player_id: 2121, is_own_goal: false, is_penalty: false },
      { team_id: 21, scorer_name: "Erling Haaland", scorer_player_id: 2121, is_own_goal: false, is_penalty: false },
      // Mbappé (FRA=14) — 2 goals, one penalty
      { team_id: 14, scorer_name: "K. Mbappé", scorer_player_id: 1401, is_own_goal: false, is_penalty: true },
      { team_id: 14, scorer_name: "K. Mbappé", scorer_player_id: 1401, is_own_goal: false, is_penalty: false },
    ];
    const res = await getTournamentTopScorersLive(stubClient(rows), 10);
    expect(res).toHaveLength(2);
    expect(res[0].scorerName).toBe("Erling Haaland");
    expect(res[0].goals).toBe(3);
    expect(res[0].penalties).toBe(0);
    expect(res[1].scorerName).toBe("K. Mbappé");
    expect(res[1].goals).toBe(2);
    expect(res[1].penalties).toBe(1);
  });

  it("NEVER credits own goals to the scorer", async () => {
    const rows: Row[] = [
      // Own goal credited to team 21 but scorer plays elsewhere
      { team_id: 21, scorer_name: "X. Defender", scorer_player_id: null, is_own_goal: true, is_penalty: false },
      // A real goal by the same name should still count
      { team_id: 21, scorer_name: "X. Defender", scorer_player_id: null, is_own_goal: false, is_penalty: false },
    ];
    const res = await getTournamentTopScorersLive(stubClient(rows), 10);
    expect(res).toHaveLength(1);
    expect(res[0].goals).toBe(1); // own goal stripped
  });

  it("groups by player_id when present, falls back to (team_id|name) otherwise", async () => {
    // Two rows with identical name but no player_id, same team → one entry.
    const rows: Row[] = [
      { team_id: 9, scorer_name: "Pulisic", scorer_player_id: null, is_own_goal: false, is_penalty: false },
      { team_id: 9, scorer_name: "Pulisic", scorer_player_id: null, is_own_goal: false, is_penalty: false },
      // Same name on a different team — should be a SEPARATE entry.
      { team_id: 1, scorer_name: "Pulisic", scorer_player_id: null, is_own_goal: false, is_penalty: false },
    ];
    const res = await getTournamentTopScorersLive(stubClient(rows), 10);
    expect(res).toHaveLength(2);
    const usa = res.find((r) => r.teamId === 9);
    const mex = res.find((r) => r.teamId === 1);
    expect(usa?.goals).toBe(2);
    expect(mex?.goals).toBe(1);
  });

  it("tiebreak: equal goals — fewer penalties ranks higher", async () => {
    const rows: Row[] = [
      // Penalty-king: 2 goals, both penalties
      { team_id: 14, scorer_name: "Mbappé", scorer_player_id: 1401, is_own_goal: false, is_penalty: true },
      { team_id: 14, scorer_name: "Mbappé", scorer_player_id: 1401, is_own_goal: false, is_penalty: true },
      // Open-play: 2 goals, both open play
      { team_id: 21, scorer_name: "Haaland", scorer_player_id: 2121, is_own_goal: false, is_penalty: false },
      { team_id: 21, scorer_name: "Haaland", scorer_player_id: 2121, is_own_goal: false, is_penalty: false },
    ];
    const res = await getTournamentTopScorersLive(stubClient(rows), 10);
    expect(res[0].scorerName).toBe("Haaland");
    expect(res[1].scorerName).toBe("Mbappé");
  });

  it("honours the limit N", async () => {
    const rows: Row[] = Array.from({ length: 15 }, (_, i) => ({
      team_id: 21,
      scorer_name: `Player${i}`,
      scorer_player_id: 2100 + i,
      is_own_goal: false,
      is_penalty: false,
    }));
    const res = await getTournamentTopScorersLive(stubClient(rows), 5);
    expect(res).toHaveLength(5);
  });

  it("attaches Norwegian team name + flag from in-code data", async () => {
    const rows: Row[] = [
      { team_id: 21, scorer_name: "Haaland", scorer_player_id: 2121, is_own_goal: false, is_penalty: false },
    ];
    const res = await getTournamentTopScorersLive(stubClient(rows), 10);
    expect(res[0].teamName).toBe("Norge");
    expect(res[0].teamFlag).toBe("no");
  });
});
