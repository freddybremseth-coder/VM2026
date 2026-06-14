/**
 * Editing must stay locked after kickoff (and after a status flip even if
 * the wall clock hasn't reached the original kickoff yet — e.g. early kick).
 *
 * Mirrors the guard already in `app/(app)/predictions/actions.ts`. Keeping
 * the rule in `lib/predictions-visibility` ensures the same logic powers
 * the UI's read-only render, the server action's reject path, and these
 * tests.
 */

import { describe, it, expect } from "vitest";
import {
  canStillEdit,
  isFixtureRevealed,
  type VisibilityFixture,
} from "@/lib/predictions-visibility";

const at = (iso: string) => new Date(iso);

describe("canStillEdit", () => {
  const kickoff = "2026-06-11T19:00:00Z";

  it("allows edits comfortably before kickoff", () => {
    expect(
      canStillEdit(at("2026-06-11T15:00:00Z"), { kickoff, status: "scheduled" }),
    ).toBe(true);
  });

  it("locks at the exact UTC kickoff second", () => {
    expect(
      canStillEdit(at("2026-06-11T19:00:00Z"), { kickoff, status: "scheduled" }),
    ).toBe(false);
  });

  it("locks once status flips to live, even before original kickoff", () => {
    expect(
      canStillEdit(at("2026-06-11T18:50:00Z"), { kickoff, status: "live" }),
    ).toBe(false);
  });

  it("locks for halftime and finished", () => {
    expect(canStillEdit(at("2026-06-11T19:50:00Z"), { kickoff, status: "halftime" })).toBe(false);
    expect(canStillEdit(at("2026-06-11T22:00:00Z"), { kickoff, status: "finished" })).toBe(false);
  });

  it("re-opens edits when a fixture is postponed (new kickoff will be set)", () => {
    expect(canStillEdit(at("2026-06-11T20:00:00Z"), { kickoff, status: "postponed" })).toBe(true);
  });

  it("locks cancelled fixtures permanently", () => {
    expect(canStillEdit(at("2026-06-11T10:00:00Z"), { kickoff, status: "cancelled" })).toBe(false);
  });
});

describe("reveal ↔ edit complement", () => {
  // Editing-locked and teammate-revealed are intentionally complementary so a
  // tip can never be edited *while* visible to the rest of the league.
  it("editing and reveal flip together at scheduled-kickoff time", () => {
    const fixture: VisibilityFixture = {
      kickoff: "2026-06-11T19:00:00Z",
      status: "scheduled",
    };
    const before = at("2026-06-11T18:59:59Z");
    expect(canStillEdit(before, fixture)).toBe(true);
    expect(isFixtureRevealed(before, fixture)).toBe(false);

    const after = at("2026-06-11T19:00:00Z");
    expect(canStillEdit(after, fixture)).toBe(false);
    expect(isFixtureRevealed(after, fixture)).toBe(true);
  });

  it("live status: locked for editing AND revealed, regardless of clock", () => {
    const fixture: VisibilityFixture = {
      kickoff: "2026-06-11T19:00:00Z",
      status: "live",
    };
    const earlyKick = at("2026-06-11T18:30:00Z");
    expect(canStillEdit(earlyKick, fixture)).toBe(false);
    expect(isFixtureRevealed(earlyKick, fixture)).toBe(true);
  });

  it("postponed: editable AND hidden — a paused state, not a started one", () => {
    const fixture: VisibilityFixture = {
      kickoff: "2026-06-11T19:00:00Z",
      status: "postponed",
    };
    const justAfterOriginal = at("2026-06-11T20:00:00Z");
    expect(canStillEdit(justAfterOriginal, fixture)).toBe(true);
    expect(isFixtureRevealed(justAfterOriginal, fixture)).toBe(false);
  });
});
