-- ─────────────────────────────────────────────────────────────────────────────
-- 0005_tournament_goals.sql
--
-- Per-goal log scraped from API-Football's /fixtures/events. Lets us build a
-- *real* WC 2026 top-scorer leaderboard that ticks after every match,
-- replacing the static-career-goals fallback that lives in the squad data.
--
-- One row per goal. UNIQUE constraint catches duplicate inserts when the
-- cron re-runs over the same finished fixture. Own goals are stored too —
-- the aggregator skips them so the scoring team's own-goaler isn't credited.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.tournament_goals (
  id                uuid primary key default gen_random_uuid(),
  match_id          int  not null references public.fixtures(id) on delete cascade,
  -- Team that the goal was credited to (NOT the team the scorer plays for in
  -- the case of an own goal — that's the OPPOSING team).
  team_id           int  not null,
  scorer_name       text not null,
  -- Best-effort resolution against our squad data (nullable when the API
  -- name doesn't match any roster entry).
  scorer_player_id  int,
  assist_name       text,
  assist_player_id  int,
  minute            int  not null check (minute between 1 and 130),
  is_own_goal       boolean not null default false,
  is_penalty        boolean not null default false,
  created_at        timestamptz not null default now(),
  -- De-dupe key. We treat (match, scorer, minute, ownGoal-flag) as the
  -- natural identity so a re-fetch is a no-op.
  unique (match_id, scorer_name, minute, is_own_goal)
);

create index if not exists tournament_goals_match_idx  on public.tournament_goals(match_id);
create index if not exists tournament_goals_player_idx on public.tournament_goals(scorer_player_id) where scorer_player_id is not null;
create index if not exists tournament_goals_team_idx   on public.tournament_goals(team_id);

alter table public.tournament_goals enable row level security;

drop policy if exists "tournament_goals read all" on public.tournament_goals;
create policy "tournament_goals read all"
  on public.tournament_goals
  for select
  using (true);

drop policy if exists "tournament_goals no public write" on public.tournament_goals;
create policy "tournament_goals no public write"
  on public.tournament_goals
  for all
  using (false)
  with check (false);

-- Realtime broadcast so the dashboard can re-render the leaderboard the
-- moment a goal is logged.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'tournament_goals'
  ) then
    alter publication supabase_realtime add table public.tournament_goals;
  end if;
end$$;
