# WC26 · Stats & Predictions

Dark, data-dense webapp for the 2026 FIFA World Cup — built for football
tactics nerds. Next.js (App Router) + Tailwind + Recharts + Supabase.

## Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, shadcn-style
  components, Lucide icons
- **Charts**: Recharts for xG timelines and stat bars
- **Backend**: Supabase (PostgreSQL + Auth) via `@supabase/ssr`
- **Data**: Mock JSON for matches/events; real squad data for 6 confirmed nations,
  preliminary structure for the other 42

## What's built

- **Dashboard** — today's matches, live ticker, top stats
- **Match Center** — Overview (xG timeline, stats bars, AI prediction, goals),
  Lineups (SVG pitch with starting XI + bench), tabs for Tactics/H2H/Injuries (stubs)
- **Predictions** — sign in, tip upcoming matches, locks at kickoff
- **Mini-leagues** — create private leagues, share invite codes, leaderboard
- **Bracket** — all 12 groups + knockout tree skeleton
- **Players DB** — searchable, filterable squad list across 6 nations
- **Teams** — all 48 nations grouped by their first-round group

## Setup

```sh
npm install
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

Apply the database schema by pasting `supabase/migrations/0001_init.sql` into
the Supabase SQL Editor for your project. This creates the `profiles`,
`predictions`, `mini_leagues`, `league_members` tables with RLS policies and
the signup trigger.

## Data caveats

- The 48-team field, group composition, and squad data are illustrative. WC26
  qualifying is not fully resolved until the months before the tournament.
  Squad sources are clearly marked as `official` / `preliminary` / `pending` in
  `lib/wc26-data.ts`.
- Match events (xG, shots, possession) are mock data for NOR–ESP only.
- AI predictions use a placeholder algorithm — replace with a real model when
  data feeds are wired up.

## Roadmap

- [ ] Real-time data feed from API-Football (or similar)
- [ ] Server-side point scoring when matches finish
- [ ] Player profile heatmaps
- [ ] Shot map on the Match Center Overview
- [ ] Knockout bracket auto-population from group standings
- [ ] Tactics tab (formation comparison, pressing maps)
