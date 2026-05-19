-- WC26 · initial schema
-- Run this in the Supabase SQL Editor for project iugsxrotjbslldceqmxq.

create extension if not exists pgcrypto;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1) Profiles (extends auth.users)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null check (char_length(username) between 3 and 24),
  display_name text,
  avatar_url text,
  favorite_team_id int,
  total_points int not null default 0,
  created_at timestamptz not null default now()
);

-- Auto-create a profile row on signup. Username is taken from raw_user_meta_data
-- when provided, otherwise derived from the user uuid.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  fallback_username text := 'user_' || substr(replace(new.id::text, '-', ''), 1, 10);
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'username', ''), fallback_username),
    nullif(new.raw_user_meta_data->>'display_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────────
-- 2) Predictions
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.predictions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  match_id int not null,
  home_score int not null check (home_score >= 0),
  away_score int not null check (away_score >= 0),
  outcome text generated always as (
    case
      when home_score > away_score then 'H'
      when home_score < away_score then 'A'
      else 'D'
    end
  ) stored,
  points_awarded int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, match_id)
);

create index if not exists predictions_match_idx on public.predictions(match_id);
create index if not exists predictions_user_idx  on public.predictions(user_id);

-- Keep updated_at fresh on every update.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists predictions_touch_updated_at on public.predictions;
create trigger predictions_touch_updated_at
  before update on public.predictions
  for each row execute function public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- 3) Mini-leagues + members
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.mini_leagues (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 3 and 40),
  description text,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  invite_code text unique not null default encode(gen_random_bytes(4), 'hex'),
  is_private boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.league_members (
  league_id uuid not null references public.mini_leagues(id) on delete cascade,
  user_id   uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  points int not null default 0,
  primary key (league_id, user_id)
);

create index if not exists league_members_user_idx on public.league_members(user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4) Row-level security
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.profiles       enable row level security;
alter table public.predictions    enable row level security;
alter table public.mini_leagues   enable row level security;
alter table public.league_members enable row level security;

-- Profiles: everyone can read; you can only update your own.
drop policy if exists "profiles read all"    on public.profiles;
drop policy if exists "profiles update self" on public.profiles;
create policy "profiles read all"    on public.profiles for select using (true);
create policy "profiles update self" on public.profiles for update using (auth.uid() = id);

-- Predictions: everyone can read (for leaderboards & community); only owner writes.
-- Note: kickoff-time enforcement happens server-side in the Next.js action since
-- we don't have a matches table.
drop policy if exists "predictions read all"   on public.predictions;
drop policy if exists "predictions insert self" on public.predictions;
drop policy if exists "predictions update self" on public.predictions;
drop policy if exists "predictions delete self" on public.predictions;
create policy "predictions read all"    on public.predictions for select using (true);
create policy "predictions insert self" on public.predictions for insert with check (auth.uid() = user_id);
create policy "predictions update self" on public.predictions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "predictions delete self" on public.predictions for delete using (auth.uid() = user_id);

-- Mini-leagues: public ones readable by anyone; private only by members.
drop policy if exists "leagues read"          on public.mini_leagues;
drop policy if exists "leagues owner write"   on public.mini_leagues;
create policy "leagues read" on public.mini_leagues for select using (
  not is_private or owner_id = auth.uid() or exists (
    select 1 from public.league_members
    where league_id = mini_leagues.id and user_id = auth.uid()
  )
);
create policy "leagues owner write" on public.mini_leagues
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- League members: only members of the same league can read its roster.
drop policy if exists "members read same league" on public.league_members;
drop policy if exists "members join self"        on public.league_members;
drop policy if exists "members leave self"       on public.league_members;
create policy "members read same league" on public.league_members for select using (
  exists (
    select 1 from public.league_members lm
    where lm.league_id = league_members.league_id and lm.user_id = auth.uid()
  )
  or exists (
    select 1 from public.mini_leagues ml
    where ml.id = league_members.league_id and ml.owner_id = auth.uid()
  )
);
create policy "members join self"  on public.league_members for insert with check (auth.uid() = user_id);
create policy "members leave self" on public.league_members for delete using (auth.uid() = user_id);
