/**
 * Bracket-coach endpoint. Receives the current champion + mode and returns a
 * short narrative reaction. Claude when configured, deterministic otherwise.
 *
 * GET is cheaper than POST for read-only AI generation; we pass champion +
 * mode as query params so this can be cached at the edge later if we want.
 */

import { NextResponse } from "next/server";
import { teamByShortName } from "@/lib/wc26-data";
import { tryClaudeText } from "@/lib/ai/claude";

export const runtime = "nodejs";

type Mode = "rank" | "chaos" | "norway" | "manual";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const champion = (url.searchParams.get("champion") ?? "").toUpperCase();
  const mode = (url.searchParams.get("mode") ?? "manual") as Mode;

  const team = teamByShortName(champion);
  if (!team) {
    return NextResponse.json({ error: "Unknown champion" }, { status: 400 });
  }

  const baseline = deterministicCoach(team, mode);

  const text = await tryClaudeText({
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: `Champion: ${team.name} (FIFA #${team.fifaRank ?? "—"}, Group ${team.group})\nSimulator mode: ${mode}\nDeterministic baseline to improve on: ${baseline}`,
    maxTokens: 200,
  });

  return NextResponse.json({
    coach: text ?? baseline,
    model: text ? "claude-sonnet-4-5" : "wcf-baseline-v0.1 (template)",
    champion: team.shortName,
    mode,
  });
}

const SYSTEM_PROMPT = [
  "You are ChatGenius, a witty football pundit reacting to a user's predicted World Cup champion in our interactive bracket simulator.",
  "Output: 2 short sentences. British football vocabulary. No emoji. No markdown.",
  "Sentence 1: react to the pick (defensible / wild / fan-pleasing). Acknowledge their mode (rank/chaos/norway/manual).",
  "Sentence 2: name the realistic obstacle (the team likely to stop them).",
].join(" ");

function deterministicCoach(
  team: { name: string; shortName: string; fifaRank?: number },
  mode: Mode,
): string {
  const rank = team.fifaRank ?? 60;
  if (mode === "chaos") {
    return `Chaos delivered ${team.name} as your champion — fun, but a 1-in-32 coin flip every round. Reality check: any rank-4-or-better side will likely block their path.`;
  }
  if (mode === "norway") {
    return `Norway-dream mode means Norway wins everything, so ${team.name} is just the team Norway happened to play in the final. Beautiful fiction; the actual obstacle in Group I is France.`;
  }
  if (rank <= 5) {
    return `${team.name} is the textbook pick — rank-${rank} sides win the World Cup more often than not. The real test is the semi-final, usually against the rank-2 or rank-3 side.`;
  }
  if (rank <= 15) {
    return `${team.name} is a defensible-but-bold call at FIFA #${rank}. Their realistic obstacle: a top-5 side in the semis or final.`;
  }
  if (rank <= 30) {
    return `${team.name} winning it would be an all-time tournament story. The realistic obstacle: one of France, Spain, Argentina, or Brazil in the knockouts.`;
  }
  return `${team.name} as champion is fever-dream territory at FIFA #${rank}. You'd need three giant upsets in the knockouts — and the favourites have to slip up.`;
}
