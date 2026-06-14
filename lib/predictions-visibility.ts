/**
 * Pure visibility logic for prediction reveal.
 *
 * Mirrors the SQL policy in migration 0004 so the UI can pre-render the
 * locked/revealed state without waiting for an RLS round-trip. The DATABASE
 * remains the authoritative gate — this is for paint and timing only.
 *
 * A teammate's tip is visible when the fixture has effectively started:
 *   • server time has reached kickoff AND the fixture is not postponed /
 *     cancelled, OR
 *   • the trusted status is live / halftime / finished.
 *
 * Postponed and cancelled fixtures are NEVER revealed via the original
 * kickoff — the issue calls this out: an obsolete kickoff on a postponed
 * match must not leak tips.
 */

export type FixtureStatus =
  | "scheduled"
  | "postponed"
  | "cancelled"
  | "live"
  | "halftime"
  | "finished";

export interface VisibilityFixture {
  /** ISO UTC. Compared against the server clock. */
  kickoff: string;
  status: FixtureStatus;
}

/**
 * True when the fixture is "started enough" for teammate predictions to
 * become public. `now` MUST be the trusted server time (e.g. supplied by
 * /api/live-state) — never `new Date()` from a possibly skewed device.
 */
export function isFixtureRevealed(
  now: Date,
  fixture: VisibilityFixture,
): boolean {
  if (fixture.status === "postponed" || fixture.status === "cancelled") {
    return false;
  }
  if (
    fixture.status === "live" ||
    fixture.status === "halftime" ||
    fixture.status === "finished"
  ) {
    return true;
  }
  // scheduled: rely on the wall clock.
  return new Date(fixture.kickoff).getTime() <= now.getTime();
}

/**
 * Milliseconds until reveal happens for a fixture. Used to schedule an
 * exact-boundary timer so the page flips at kickoff without a hard refresh.
 *
 * Returns:
 *   0     — already revealed.
 *   null  — will never reveal (postponed / cancelled).
 *   +ms   — schedule a timer for this many ms from now.
 *
 * Caller should cap the timer at ~24h to avoid setTimeout overflow on
 * far-future fixtures, and re-evaluate when the window rolls forward.
 */
export function msUntilReveal(
  now: Date,
  fixture: VisibilityFixture,
): number | null {
  if (fixture.status === "postponed" || fixture.status === "cancelled") {
    return null;
  }
  if (isFixtureRevealed(now, fixture)) return 0;
  return new Date(fixture.kickoff).getTime() - now.getTime();
}

/**
 * Authoritative server-side rule for "can this user still save / change a
 * tip on this fixture?" Used by the predictions action AND the test suite,
 * so the behaviour described in the issue ("editing remains locked after
 * kickoff") can't drift between the two.
 *
 * Postponed fixtures stay EDITABLE because the kickoff hasn't happened
 * yet — once a new kickoff is set and the status moves to scheduled/live,
 * the rule applies as normal. Cancelled fixtures lock immediately.
 */
export function canStillEdit(
  now: Date,
  fixture: VisibilityFixture,
): boolean {
  if (fixture.status === "cancelled") return false;
  if (fixture.status === "postponed") return true;
  if (
    fixture.status === "live" ||
    fixture.status === "halftime" ||
    fixture.status === "finished"
  ) {
    return false;
  }
  // scheduled: editable until the wall clock reaches kickoff.
  return new Date(fixture.kickoff).getTime() > now.getTime();
}

/**
 * Tells the polling loop whether a fixture is "close enough" to warrant
 * aggressive background refresh. We poll every 15–30 s within ±10 min of
 * kickoff for safety in case Realtime or the timer misses (eg. tab was
 * frozen, network blip during reveal moment).
 */
export function isNearReveal(
  now: Date,
  fixture: VisibilityFixture,
  windowMin = 10,
): boolean {
  if (fixture.status === "postponed" || fixture.status === "cancelled") {
    return false;
  }
  // Already live: always poll.
  if (
    fixture.status === "live" ||
    fixture.status === "halftime"
  ) {
    return true;
  }
  const dt = new Date(fixture.kickoff).getTime() - now.getTime();
  return Math.abs(dt) <= windowMin * 60_000;
}
