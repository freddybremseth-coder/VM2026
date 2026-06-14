/**
 * Unit tests for the prediction-visibility rule that backs both the SQL
 * RLS policy (migration 0004) and the client-side render decision.
 *
 * Each test pins both `now` and `kickoff` to explicit UTC ISO strings so
 * the result is independent of the host's locale and DST offset — the same
 * concern called out in the issue ("verify no mix of local time and UTC
 * causes a one- or two-hour delay").
 */

import { describe, it, expect } from "vitest";
import {
  isFixtureRevealed,
  msUntilReveal,
  isNearReveal,
  type VisibilityFixture,
} from "@/lib/predictions-visibility";

const at = (iso: string) => new Date(iso);

describe("isFixtureRevealed", () => {
  it("hides a future scheduled fixture", () => {
    const now = at("2026-06-11T18:59:59Z");
    const fixture: VisibilityFixture = {
      kickoff: "2026-06-11T19:00:00Z",
      status: "scheduled",
    };
    expect(isFixtureRevealed(now, fixture)).toBe(false);
  });

  it("reveals at the exact UTC kickoff second", () => {
    const now = at("2026-06-11T19:00:00.000Z");
    const fixture: VisibilityFixture = {
      kickoff: "2026-06-11T19:00:00Z",
      status: "scheduled",
    };
    expect(isFixtureRevealed(now, fixture)).toBe(true);
  });

  it("reveals when the trusted status is live, regardless of clock", () => {
    const now = at("2026-06-11T18:30:00Z"); // 30 min before kickoff
    const fixture: VisibilityFixture = {
      kickoff: "2026-06-11T19:00:00Z",
      status: "live",
    };
    expect(isFixtureRevealed(now, fixture)).toBe(true);
  });

  it("reveals halftime and finished too", () => {
    const now = at("2026-06-11T22:00:00Z");
    const k = "2026-06-11T19:00:00Z";
    expect(isFixtureRevealed(now, { kickoff: k, status: "halftime" })).toBe(true);
    expect(isFixtureRevealed(now, { kickoff: k, status: "finished" })).toBe(true);
  });

  it("NEVER reveals a postponed fixture, even past the original kickoff", () => {
    const now = at("2026-06-12T03:00:00Z"); // 8h after original kickoff
    const fixture: VisibilityFixture = {
      kickoff: "2026-06-11T19:00:00Z",
      status: "postponed",
    };
    expect(isFixtureRevealed(now, fixture)).toBe(false);
  });

  it("NEVER reveals a cancelled fixture", () => {
    const now = at("2026-06-15T00:00:00Z");
    const fixture: VisibilityFixture = {
      kickoff: "2026-06-11T19:00:00Z",
      status: "cancelled",
    };
    expect(isFixtureRevealed(now, fixture)).toBe(false);
  });

  it("ignores host timezone — uses the UTC instant", () => {
    // Norway summer = UTC+2 (DST). 19:00 UTC = 21:00 Europe/Oslo.
    // If the rule mistakenly compared local times we'd see drift.
    const now = at("2026-06-11T19:00:00Z");
    const kickoffLocalWritten = "2026-06-11T19:00:00+00:00";
    const f: VisibilityFixture = {
      kickoff: kickoffLocalWritten,
      status: "scheduled",
    };
    expect(isFixtureRevealed(now, f)).toBe(true);
  });

  it("handles the spring-forward DST gap correctly", () => {
    // Europe/Oslo skips 02:00→03:00 CET on 2026-03-29. The reveal rule
    // operates purely in UTC so this should be a non-event.
    const now = at("2026-03-29T01:30:00Z"); // 02:30 local before clocks jump
    const fixture: VisibilityFixture = {
      kickoff: "2026-03-29T02:00:00Z",
      status: "scheduled",
    };
    expect(isFixtureRevealed(now, fixture)).toBe(false);
    const justAfter = at("2026-03-29T02:00:00Z"); // would be 04:00 local
    expect(isFixtureRevealed(justAfter, fixture)).toBe(true);
  });
});

describe("msUntilReveal", () => {
  it("returns 0 when already revealed", () => {
    const f: VisibilityFixture = { kickoff: "2026-06-11T19:00:00Z", status: "live" };
    expect(msUntilReveal(at("2026-06-11T18:00:00Z"), f)).toBe(0);
  });

  it("returns null for postponed (never reveal)", () => {
    const f: VisibilityFixture = { kickoff: "2026-06-11T19:00:00Z", status: "postponed" };
    expect(msUntilReveal(at("2026-06-11T19:00:00Z"), f)).toBeNull();
  });

  it("returns exact ms-delta for a future scheduled fixture", () => {
    const f: VisibilityFixture = { kickoff: "2026-06-11T19:00:00Z", status: "scheduled" };
    const now = at("2026-06-11T18:59:30Z"); // 30s before
    expect(msUntilReveal(now, f)).toBe(30_000);
  });

  it("handles a tab dormant for hours — time delta stays UTC-correct", () => {
    // Simulates the issue's edge case "browser tab sleeps and later becomes
    // active". When the page wakes up, the helper still returns a sensible
    // delta based on the freshly-supplied `now` from /api/live-state.
    const f: VisibilityFixture = { kickoff: "2026-06-11T19:00:00Z", status: "scheduled" };
    const sixHoursLater = at("2026-06-12T01:00:00Z");
    // Caller will see 0 → flips to revealed immediately on focus.
    expect(msUntilReveal(sixHoursLater, f)).toBe(0);
  });
});

describe("isNearReveal", () => {
  it("flags fixtures within ±10 minutes of kickoff", () => {
    const f: VisibilityFixture = { kickoff: "2026-06-11T19:00:00Z", status: "scheduled" };
    expect(isNearReveal(at("2026-06-11T18:51:00Z"), f)).toBe(true);
    expect(isNearReveal(at("2026-06-11T19:09:00Z"), f)).toBe(true);
  });

  it("does NOT flag fixtures far from kickoff", () => {
    const f: VisibilityFixture = { kickoff: "2026-06-11T19:00:00Z", status: "scheduled" };
    expect(isNearReveal(at("2026-06-11T17:00:00Z"), f)).toBe(false);
    expect(isNearReveal(at("2026-06-11T21:00:00Z"), f)).toBe(false);
  });

  it("always flags live and halftime fixtures", () => {
    const f: VisibilityFixture = { kickoff: "2026-06-11T19:00:00Z", status: "live" };
    expect(isNearReveal(at("2026-06-12T00:00:00Z"), f)).toBe(true);
  });

  it("never flags postponed / cancelled", () => {
    const f: VisibilityFixture = { kickoff: "2026-06-11T19:00:00Z", status: "postponed" };
    expect(isNearReveal(at("2026-06-11T19:00:00Z"), f)).toBe(false);
  });
});

describe("integration scenarios from the issue's edge-case list", () => {
  it("page opened 5 min before kickoff — flips revealed when server time crosses", () => {
    const f: VisibilityFixture = { kickoff: "2026-06-11T19:00:00Z", status: "scheduled" };
    const opened = at("2026-06-11T18:55:00Z");
    expect(isFixtureRevealed(opened, f)).toBe(false);
    expect(msUntilReveal(opened, f)).toBe(5 * 60_000);
    const fired = at("2026-06-11T19:00:00.001Z");
    expect(isFixtureRevealed(fired, f)).toBe(true);
  });

  it("delayed kickoff — clock-based reveal still fires; status flip later confirms", () => {
    // Real kickoff slipped 15 min but the fixtures row hasn't been updated
    // yet. The clock rule will pre-reveal; that's acceptable because the
    // alternative (waiting for the operator) leaves the page stale for the
    // whole league.
    const f: VisibilityFixture = { kickoff: "2026-06-11T19:00:00Z", status: "scheduled" };
    const realStart = at("2026-06-11T19:15:00Z");
    expect(isFixtureRevealed(realStart, f)).toBe(true);
  });

  it("postponed mid-page-load — locked state survives a status flip from scheduled", () => {
    const f: VisibilityFixture = { kickoff: "2026-06-11T19:00:00Z", status: "postponed" };
    expect(isFixtureRevealed(at("2026-06-11T19:30:00Z"), f)).toBe(false);
  });

  it("match already finished when the page first opens", () => {
    const f: VisibilityFixture = { kickoff: "2026-06-11T19:00:00Z", status: "finished" };
    expect(isFixtureRevealed(at("2026-06-12T08:00:00Z"), f)).toBe(true);
  });
});
