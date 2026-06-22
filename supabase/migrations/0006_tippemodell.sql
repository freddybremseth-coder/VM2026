-- Tippemodell — fase 1
--
-- Bookmaker-agnostic odds storage backing /tippemodell. Schema is a slight
-- tweak of the upstream Tippemodell spec, prefixed `tm_` so it never clashes
-- with our existing predictions/fixtures tables, with an optional
-- `wc26_fixture_id` link so VM 2026 matches we already know about resolve
-- to the same internal id used everywhere else in the app.

-- ── Leagues we follow ──────────────────────────────────────────────────────
create table if not exists tm_leagues (
  id          bigint generated always as identity primary key,
  external_id text not null unique,
  name        text not null,                 -- exact OddsPapi tournamentName
  country     text,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ── Matches ────────────────────────────────────────────────────────────────
-- external_id = OddsPapi fixture id. ALWAYS use external_id when calling the
-- odds API; never the bigint primary key.
-- wc26_fixture_id links to lib/wc26-fixtures (1..110) when we recognise
-- the fixture as a WC 2026 match — lets us reuse score / team data we already
-- have without double-storing.
create table if not exists tm_matches (
  id              bigint generated always as identity primary key,
  external_id     text not null unique,
  league_id       bigint not null references tm_leagues(id) on delete cascade,
  home_team       text not null,
  away_team       text not null,
  commence_at     timestamptz not null,
  status          text not null default 'upcoming',  -- upcoming | live | finished
  home_score      int,
  away_score      int,
  wc26_fixture_id int,                        -- nullable; populated for WC 2026 matches
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists idx_tm_matches_commence on tm_matches (commence_at);
create index if not exists idx_tm_matches_status on tm_matches (status);
create index if not exists idx_tm_matches_wc26 on tm_matches (wc26_fixture_id);

-- ── Bookmakers ─────────────────────────────────────────────────────────────
create table if not exists tm_bookmakers (
  id          bigint generated always as identity primary key,
  key         text not null unique,
  title       text not null,
  is_sharp    boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ── Markets ────────────────────────────────────────────────────────────────
create table if not exists tm_markets (
  id    bigint generated always as identity primary key,
  key   text not null unique,             -- 'h2h' | 'totals' | 'btts'
  name  text not null
);

-- ── Odds snapshots ─────────────────────────────────────────────────────────
-- One row per (match, bookmaker, market, outcome, captured_at). Snapshots
-- are never deleted; the full price history is reconstructable from this
-- single table.
create table if not exists tm_odds_snapshots (
  id            bigint generated always as identity primary key,
  match_id      bigint not null references tm_matches(id) on delete cascade,
  bookmaker_id  bigint not null references tm_bookmakers(id) on delete cascade,
  market_id     bigint not null references tm_markets(id) on delete cascade,
  outcome       text not null,            -- 'home'|'draw'|'away'|'Over 2.5' ...
  price         numeric(8,3) not null,    -- decimal odds
  point         numeric(6,2),             -- line for totals/handicap
  captured_at   timestamptz not null default now()
);
create index if not exists idx_tm_odds_match on tm_odds_snapshots (match_id);
create index if not exists idx_tm_odds_lookup
  on tm_odds_snapshots (match_id, market_id, bookmaker_id, captured_at desc);

-- ── Latest odds view ───────────────────────────────────────────────────────
create or replace view tm_latest_odds as
select distinct on (o.match_id, o.market_id, o.bookmaker_id, o.outcome, o.point)
  o.match_id, o.market_id, o.bookmaker_id, o.outcome, o.point, o.price, o.captured_at
from tm_odds_snapshots o
order by o.match_id, o.market_id, o.bookmaker_id, o.outcome, o.point, o.captured_at desc;

-- ── Seed standard markets ──────────────────────────────────────────────────
insert into tm_markets (key, name) values
  ('h2h',    'Kampvinner (1X2)'),
  ('totals', 'Over/Under mål'),
  ('btts',   'Begge lag scorer')
on conflict (key) do nothing;

-- ── Seed VM 2026 league ────────────────────────────────────────────────────
-- The name MUST match OddsPapi's tournamentName exactly. We use the most
-- common rendering; verify once odds start flowing and adjust if needed.
insert into tm_leagues (external_id, name, country, active) values
  ('fifa-wc-2026', 'FIFA World Cup', 'International', true)
on conflict (external_id) do nothing;

-- ── RLS: read open, writes only via service role ──────────────────────────
alter table tm_leagues        enable row level security;
alter table tm_matches        enable row level security;
alter table tm_bookmakers     enable row level security;
alter table tm_markets        enable row level security;
alter table tm_odds_snapshots enable row level security;

drop policy if exists "tm_read_leagues"    on tm_leagues;
drop policy if exists "tm_read_matches"    on tm_matches;
drop policy if exists "tm_read_bookmakers" on tm_bookmakers;
drop policy if exists "tm_read_markets"    on tm_markets;
drop policy if exists "tm_read_odds"       on tm_odds_snapshots;

create policy "tm_read_leagues"    on tm_leagues        for select using (true);
create policy "tm_read_matches"    on tm_matches        for select using (true);
create policy "tm_read_bookmakers" on tm_bookmakers     for select using (true);
create policy "tm_read_markets"    on tm_markets        for select using (true);
create policy "tm_read_odds"       on tm_odds_snapshots for select using (true);
