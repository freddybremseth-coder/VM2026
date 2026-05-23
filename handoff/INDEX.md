# Handoff index

Files in this package, in the order Claude Code should apply them:

| # | File | Action |
|--:|---|---|
| 1 | `tailwind.config.ts`                            | **Replace** project's existing config |
| 2 | `app/globals.css`                               | **Replace** project's existing globals |
| 3 | `app/layout.tsx`                                | **Edit** existing — add Fraunces import & body bg/text |
| 4 | `components/shared/HoloFlag.tsx`                | **Create** new file |
| 5 | `components/shared/TeamFlag.tsx`                | **Replace** existing — now a thin wrapper around HoloFlag |
| 6 | `components/shared/StadiumBackdrop.tsx`         | **Create** new file |
| 7 | `components/shared/LiveTicker.tsx`              | **Create** new file (replaces old `dashboard/LiveTicker.tsx`) |
| 8 | `components/shared/EditorialKicker.tsx`         | **Create** new file (Kicker / Headline / PullQuote) |
| 9 | `app/(app)/page.tsx`                            | **Replace** existing — new Dashboard |
| 10 | `app/(app)/norge/page.tsx`                     | **Replace** existing — cinematic flagship |

After these 10 files, the redesign is **operational** — homepage, Norge,
and the underlying design system are live. The remaining pages (`matches`,
`bracket`, `predictions`, `teams`, `leagues`) keep working visually
because the legacy `pitch-*` / `accent-*` Tailwind tokens are still
defined; they just look unfinished next to the new pages.

To bring them up to the new language, follow the patterns in:
- `(app)/page.tsx` for any dashboard-style listing
- `(app)/norge/page.tsx` for any single-entity profile (team, player)
- Use `<StadiumBackdrop>` for any hero header
- Use `<HoloFlag>` everywhere flags appear — replace the old gradient
  `<TeamFlag>` (the new wrapper does this automatically for old call sites)

## Read this first

**`HANDOFF.md`** — full design philosophy, token map, type system, file
map, component recipes, content guidelines, animations, what's
intentionally not here, future work. Read this before changing anything.

## Mockup

The source of truth for visual decisions is the design canvas at the
project root: open `index.html` in a browser. The **first section**
("✶ Endelig design") is what we're building. The three sections below
it (Broadcast / Stadium / Tactician) are reference material showing
where each idea came from.

The full canvas lives in:
- `index.html` + `shared.jsx` + `synthesis.jsx` (the final design)
- `broadcast.jsx`, `stadium.jsx`, `tactician.jsx` (reference)
- `design-canvas.jsx` (no-touch — pan/zoom shell)

## Open questions for Claude Code

1. **Live data wiring.** `<LiveTicker>` is a presentational component;
   it doesn't know how to find current live matches. Add an API
   route (`/api/live-ticker` or similar) that aggregates: current
   live match score+minute, xG deltas in the last 5 min, next
   kickoff in 1h, total tips count, breaking injury news. Feed
   the result into the Dashboard server component.

2. **Tournament-state-aware copy.** The Dashboard headline is
   currently a stub. When pre-tournament, show countdown + opener.
   When live, show the standout match (most-watched? user's
   followed team?). When between matchdays, show "Yesterday's
   results" + "Tomorrow's lineup".

3. **Norway scenario calculator** already exists at
   `components/norge/NorwayScenarioCalculator.tsx`. The new
   qualification-matrix module on the redesigned `/norge` page is
   simpler — keep the existing calculator below the matrix as a
   "Try other scenarios" section.

4. **Squad-status badges** (Official / Preliminary / Pending) on
   `/teams` need restyling — currently use `accent-500/15`. New
   colours: Official → `bg-win/15 text-win`, Preliminary →
   `bg-amber/15 text-amber`, Pending → `bg-paper text-cream/55`.
