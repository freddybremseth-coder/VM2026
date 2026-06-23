-- ─────────────────────────────────────────────────────────────────────────────
-- Paper-trading auto-pilot
--
-- A virtual betting ledger: the model's flagged value bets are "placed" with a
-- Kelly-sized stake against a chosen bankroll, settled against the real ESPN
-- results we already ingest, and tracked for P&L / ROI. No real money — this
-- proves whether the model actually makes money before anything is risked.
--
-- Same RLS convention as 0006: public SELECT, writes only via service-role
-- (the cron + admin action use the service key, which bypasses RLS).
-- ─────────────────────────────────────────────────────────────────────────────

-- Singleton config row holding the chosen starting bankroll (the "deposited sum").
create table if not exists tm_paper_config (
  id                int primary key default 1,
  starting_bankroll numeric not null default 1000,
  updated_at        timestamptz not null default now(),
  constraint tm_paper_config_single_row check (id = 1)
);

insert into tm_paper_config (id, starting_bankroll)
values (1, 1000)
on conflict (id) do nothing;

-- One row per virtual bet the auto-pilot places.
create table if not exists tm_paper_bets (
  id             bigserial primary key,
  match_id       bigint not null,
  market_key     text not null,            -- 'h2h' | 'totals' | 'btts'
  outcome        text not null,            -- home/draw/away | over/under | yes/no
  label          text not null,            -- display label, e.g. "1 Norge", "Over 2.5"
  placed_odds    numeric not null,         -- decimal odds locked at placement
  model_prob     numeric not null,         -- our model probability at placement
  kelly_fraction numeric not null,         -- stake as fraction of bankroll
  stake          numeric not null,         -- kr staked (kelly_fraction × bankroll)
  status         text not null default 'open',  -- open | won | lost | void
  payout         numeric,                  -- stake × odds when won, else 0
  pnl            numeric,                  -- payout − stake (null while open)
  commence_at    timestamptz not null,     -- match kickoff (for ordering/settlement)
  placed_at      timestamptz not null default now(),
  settled_at     timestamptz,
  -- Never place the same selection twice.
  unique (match_id, market_key, outcome)
);

create index if not exists tm_paper_bets_status_idx on tm_paper_bets (status);
create index if not exists tm_paper_bets_commence_idx on tm_paper_bets (commence_at);

alter table tm_paper_config enable row level security;
alter table tm_paper_bets   enable row level security;

drop policy if exists "tm_read_paper_config" on tm_paper_config;
drop policy if exists "tm_read_paper_bets"   on tm_paper_bets;
create policy "tm_read_paper_config" on tm_paper_config for select using (true);
create policy "tm_read_paper_bets"   on tm_paper_bets   for select using (true);
