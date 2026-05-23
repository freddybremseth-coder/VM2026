# VM2026 · Design Handoff

**Status:** Visual redesign — drop-in package for Claude Code.
**Goal:** Lift the current dark-SaaS-baseline into a cinematic, editorial,
data-confident product. Mobile-first. Norway-flagship.

---

## Design philosophy (1 page)

Three idioms blended into one cohesive language:

1. **Stadium (foundation)** — editorial typography, cinematic backdrops with
   floodlight glow, generous negative space, warm dark palette. This is the
   **default look** of every page. Headlines use a serif display face. Pages
   read like a sports magazine, not a dashboard.

2. **Tactician (data blocks)** — wherever data is dense (group standings,
   fixture lists, stats tables, the qualification matrix, the bracket grid),
   switch to JetBrains Mono, tabular nums, tight 1px-rule borders, no
   rounded corners. These modules look like an analyst terminal sitting
   inside the magazine.

3. **Broadcast (signature motion)** — live ticker scrolling across the top of
   the dashboard, animated holographic flag shimmer on live matches,
   subtle gradient pulse on score numerals when a match is live. Energy
   reserved for things that are actually live.

**The signature element is the Holographic Flag.** Real flag SVG underneath,
oil-slick conic-gradient overlay (color-dodge blend), diagonal pearl
shimmer, inset rim. Live matches get an animated shimmer band. This
single component carries most of the visual identity — see
`components/shared/HoloFlag.tsx`.

**Norway is treated as flagship.** Larger flag presence on the dashboard,
dedicated cinematic hero on `/norge`, qualification matrix module that no
other team gets (yet).

---

## Token map (old → new)

| Concept | Current | New |
|---|---|---|
| Background | `bg-pitch-950` (#0a0a0c, cold) | `bg-canvas` (#0E0C0B, warm) |
| Surface card | `card-panel` (pitch-800/60 + rounded-xl) | `surface` (paper #15110F, 1px border, no radius) |
| Text primary | `text-pitch-50` (#fafafa) | `text-cream` (#F4EFE3, warm) |
| Text muted | `text-pitch-400` | `text-cream/55` |
| Accent (links, CTAs) | `text-accent-300/400` (green) | `text-signal` (#E63946, Norway red) |
| Data highlight | `text-data-400` (cyan) | `text-amber` (#FFB72E) |
| Live state | `text-loss` (red) | `text-signal` (kept red, same semantic) |
| Win/loss tokens | `win/draw/loss` | `win` (#4ADE80) / `draw` (#FFB72E) / `loss` (#F87171) |

Drop in the new `tailwind.config.ts` and `app/globals.css` from this folder
to get all tokens. Existing `pitch-*` / `accent-*` / `data-*` classes are
**kept** so the migration can be incremental — but new work should use the
new tokens.

---

## Type system

Three font families, each with a job:

- **Serif display** (`font-serif`) → `"Fraunces"` (Google Fonts) — headlines,
  scores, team names in editorial contexts, big numerals on Norge page.
  Variable-weight, optical-sized; ships as `wght@400;500;600;700` with `opsz`.
- **Sans body** (`font-sans`) → Inter (already in use). Kept everywhere body
  copy lives.
- **Mono** (`font-mono`) → JetBrains Mono (already in use). All numbers in
  data contexts (stats tables, kickoff times, xG, percentages, scores in
  Tactician modules). Always with `tabular-nums`.

Import Fraunces in `app/layout.tsx`:

```ts
import { Fraunces } from "next/font/google";
const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  axes: ["opsz"],
});
// add ${serif.variable} to the body className
```

---

## File map — what to update

Files marked **drop-in** are in this folder and can be copied directly.
Files marked **rewrite** are shown as full new versions you should diff
into the existing file. Files marked **pattern** are exemplars — apply the
same recipe to siblings (e.g. `players/page.tsx` follows `bracket/page.tsx`).

```
app/
├── globals.css                              [drop-in]
├── layout.tsx                               [edit: add Fraunces]
└── (app)/
    ├── page.tsx                             [rewrite — Dashboard]
    ├── norge/page.tsx                       [rewrite — flagship hero]
    ├── matches/[matchId]/layout.tsx         [pattern — cinematic header]
    └── bracket/page.tsx                     [pattern — editorial list]

components/
├── shared/
│   ├── HoloFlag.tsx                         [drop-in NEW]
│   ├── TeamFlag.tsx                         [rewrite — wraps HoloFlag]
│   ├── LiveTicker.tsx                       [drop-in NEW]
│   ├── StadiumBackdrop.tsx                  [drop-in NEW]
│   ├── EditorialKicker.tsx                  [drop-in NEW]
│   └── Sidebar.tsx                          [edit — serif active state, signal underline]
├── dashboard/
│   ├── MatchCard.tsx                        [rewrite]
│   └── FeaturedLiveMatch.tsx                [drop-in NEW]
├── match/
│   ├── MatchHeader.tsx                      [rewrite — cinematic + serif score]
│   ├── XGTimelineChart.tsx                  [pattern — recharts → step chart with serif end-labels]
│   └── HeatmapGrid.tsx                      [pattern — switch to iso pitch (see below)]
└── norge/
    └── NorwayHero.tsx                       [drop-in NEW]

tailwind.config.ts                           [drop-in]
```

The minimum to make the redesign feel real:
`tailwind.config.ts` + `globals.css` + `layout.tsx` (Fraunces) +
`HoloFlag.tsx` + `LiveTicker.tsx` + `StadiumBackdrop.tsx` + `(app)/page.tsx`
+ `(app)/norge/page.tsx`. The rest can be rolled out per-page.

---

## Component recipes (for files not included)

### Cinematic Match Header
Replace the current header with a `<StadiumBackdrop height={290}>` containing:
- top-left: LIVE pill (or kickoff time pill) + group/stage label top-right
- two-column layout: `<HoloFlag w={38} shimmer="animated">` + serif team
  name + huge serif score (100px, weight 600, letter-spacing -4)
- bottom-center: `font-mono text-[10px] tracking-[1.5px] text-cream/55`
  with `VENUE · CITY · CAPACITY`

### Editorial event log
Each event row is a 2-column grid: a 42px column with the minute as a
serif numeral (22px, weight 600), then content with a kicker
("Mål"/"Gult"/"Innbytte" in mono, signal/amber color) above a serif
player name and sans note.

### Iso pitch heatmap
Drop the current `HeatmapGrid` grid-cell rendering in favour of an SVG
pitch in axonometric projection (skewX(-12) on the entire pitch group).
Heatmap regions are radial gradients with `signal` (home) and `amber`
(away) at low opacity. Shot markers are 3px circles in the same colors.
Reference SVG in this folder: `components/match/IsoPitch.tsx`.

### Tactician fixture row
Two flag thumbnails stacked diagonally in a 24px column → editorial
fixture title (`<serif text-lg>` Norway <span text-dim>vs</span> Spania) →
right-aligned mono kickoff. Live rows get `bg-signal/5`. See
`components/dashboard/MatchCard.tsx`.

---

## Content guidelines

- **Don't add filler.** Empty space is part of the look. Resist the urge to
  fill every grid cell with a stat pill.
- **Pull-quotes are intentional.** The Norge page uses an italic serif
  pull-quote («Endelig tilbake.»). Use sparingly elsewhere — only on
  flagship moments (a player profile reveal, a tournament-winning moment).
- **Numbers belong in mono with tnum.** Never set a stat number in the
  body sans-serif. Even when serif fits visually (Norge stat blocks, top
  scorer goal counts), the serif numeral is the editorial display; the
  underlying stat label stays sans.
- **Holographic flag intensity is a signal.** `shimmer="animated"` only on
  live matches and the user's own team. Default is `shimmer="medium"`. Use
  `shimmer="strong"` for hero-scale flag backgrounds (Norge page).

---

## Animation

Two keyframes, in `globals.css`:

- `live-pulse` — opacity 1 → 0.3 → 1 over 1.4s. Used on the red dot next
  to LIVE pills.
- `marquee` — 0% → -50% translateX over 32s linear infinite. Used on
  `<LiveTicker>` — content must be duplicated inline so the loop seams.

The holographic flag's shimmer band is also CSS animation (in
`HoloFlag.tsx`'s own style block — runs only when `shimmer="animated"`).

---

## What's intentionally not here

- Real photography. The Stadium backdrop is CSS-only (radial gradients +
  diagonal light rays). When real WC26 imagery becomes available, swap
  it into a `<StadiumBackdrop bgImage="...">` prop and keep the dust /
  vignette overlays.
- A light theme. The whole language is dark-first. A light variant is
  doable but isn't in this pass.
- Animated xG timelines (the user wanted this; see "future" below).

## Future / nice-to-have

- Animate `<XGStep>` so the step path draws itself from 0' → 90' over ~3
  seconds on first paint, then pause until match minute updates.
- Build `<BracketTreeZoom>` — replace the current 4-column knockout
  schedule with a zoom/pan tree where each round can be focused.
- Make the Predict card a real swipeable stack (Framer Motion drag with
  velocity-based commit).

---

Built by the design pass — questions or scope changes, point Claude Code at
`mockup/index.html` in the project root for the source of truth.
