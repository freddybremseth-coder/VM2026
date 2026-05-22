/**
 * Weekly mini-league "banter report" generator.
 *
 * Reads the league's members + their cumulative points (already in
 * `league_members.points`) and produces a few witty lines about who's
 * leading, who's chasing, and who needs to step up.
 *
 * Deterministic v1, same shape as `lib/ai-preview.ts` so v1.1 can swap in a
 * real Claude call.
 */

export interface BanterMember {
  username: string;
  points: number;
  isYou?: boolean;
}

import { tryClaudeText } from "./ai/claude";

export interface BanterReport {
  headline: string;
  lines: string[];
  generatedAt: string;
  model?: string;
}

export function buildBanterReport(
  leagueName: string,
  members: BanterMember[],
): BanterReport | null {
  if (members.length < 2) return null;

  const sorted = [...members].sort((a, b) => b.points - a.points);
  const leader = sorted[0]!;
  const last = sorted[sorted.length - 1]!;
  const me = sorted.find((m) => m.isYou);
  const myRank = me ? sorted.indexOf(me) + 1 : null;

  const gap = leader.points - last.points;
  const leaderName = leader.isYou ? "You're" : `${leader.username} is`;

  const lines: string[] = [];

  // Opening line about the leader
  if (leader.points === 0) {
    lines.push(
      `Nobody has scored yet — ${leagueName} is wide open. First tip lands when the group stage starts.`,
    );
  } else if (gap === 0) {
    lines.push(
      `All-square at ${leader.points} pts across ${members.length} members. One exact score and someone runs away with it.`,
    );
  } else {
    lines.push(
      `${leaderName} top of ${leagueName} with ${leader.points} pts — ${gap} ahead of ${last.username}.`,
    );
  }

  // Middle line about you
  if (me && myRank) {
    if (myRank === 1) {
      lines.push("Keep tipping safe. Or don't — the chasers love a stumble.");
    } else if (myRank === members.length) {
      lines.push(
        `You're propping up the table at ${me.points} pts. Time to roll the dice on a chaos pick.`,
      );
    } else {
      const above = sorted[myRank - 2]!;
      const diff = above.points - me.points;
      lines.push(
        `You're ${myRank}/${members.length} with ${me.points} pts — ${diff} behind ${above.username}.`,
      );
    }
  }

  // Closing line about momentum
  if (gap >= 6) {
    lines.push(
      "Leader has a real cushion now — an exact score is worth 3 pts so the chase isn't dead.",
    );
  } else if (gap > 0) {
    lines.push("Tightly packed leaderboard — knockout-round tips will decide it.");
  }

  return {
    headline:
      leader.isYou
        ? `🏆 You're leading ${leagueName}`
        : leader.points === 0
          ? `📅 ${leagueName} hasn't started`
          : `📊 ${leader.username} leads ${leagueName}`,
    lines,
    generatedAt: new Date().toISOString(),
    model: "wcf-baseline-v0.1 (template)",
  };
}

/**
 * Async variant — tries Claude, falls back to the deterministic template.
 */
export async function buildBanterReportLive(
  leagueName: string,
  members: BanterMember[],
): Promise<BanterReport | null> {
  const baseline = buildBanterReport(leagueName, members);
  if (!baseline) return null;

  const sorted = [...members].sort((a, b) => b.points - a.points);
  const list = sorted
    .map(
      (m, i) =>
        `  ${i + 1}. ${m.username}${m.isYou ? " (the viewer)" : ""} — ${m.points} pts`,
    )
    .join("\n");

  const text = await tryClaudeText({
    systemPrompt: BANTER_SYSTEM_PROMPT,
    userPrompt: `League: ${leagueName}\nStanding:\n${list}`,
    maxTokens: 200,
  });

  if (!text) return baseline;

  // Claude returns 2-3 lines, one per row, each ≤ 18 words.
  const lines = text
    .split("\n")
    .map((l) => l.replace(/^[›>\-*\d.)]\s*/, "").trim())
    .filter((l) => l.length > 0)
    .slice(0, 3);

  if (lines.length < 2) return baseline;

  return {
    ...baseline,
    lines,
    model: "claude-sonnet-4-5",
    generatedAt: new Date().toISOString(),
  };
}

const BANTER_SYSTEM_PROMPT = [
  "You are ChatGenius writing a witty 2–3 line weekly banter report for a private World Cup tipping league.",
  "Tone: cheeky, never mean. British football vocabulary. Use the viewer's perspective ('you', 'your') when they're flagged.",
  "Output exactly 2–3 lines, no numbering, no markdown, no emoji.",
  "Line 1: who leads and the gap.",
  "Line 2: the viewer's position relative to nearest rival.",
  "Line 3 (optional): one-sentence read on momentum.",
].join(" ");
