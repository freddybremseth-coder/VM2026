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

export interface BanterReport {
  headline: string;
  lines: string[];
  generatedAt: string;
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
  };
}
