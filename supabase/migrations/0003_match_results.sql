-- ─────────────────────────────────────────────────────────────────────────────
-- 0003_match_results.sql
--
-- Persistent match results + auto-grading pipeline.
--
-- Up to now we had `predictions.points_awarded` and `league_members.points`
-- as columns but nothing ever wrote to them. This migration plugs the gap:
--
--   1. `match_results` stores live + final scores for each fixture.
--   2. A trigger fires when a result transitions to `finished`. It grades
--      every prediction on that match (3 p exact, 1 p outcome, 0 p else)
--      and recomputes `league_members.points` for every affected user.
--
-- Live (in-progress) scores get stored too so the LiveStatusBar can display
-- them, but the grading trigger only runs when status = 'finished' — we
-- don't want a 1-1 half-time to award provisional points.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.match_results (
  match_id    int primary key,
  home_score  int not null check (home_score >= 0),
  away_score  int not null check (away_score >= 0),
  -- Mirrors the api-football status family. The grading trigger gates on this.
  status      text not null default 'scheduled'
              check (status in ('scheduled', 'live', 'halftime', 'finished')),
  minute      int,
  outcome     text generated always as (
                case
                  when home_score > away_score then 'H'
                  when home_score < away_score then 'A'
                  else 'D'
                end
              ) stored,
  recorded_at timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.match_results enable row level security;

-- Anyone signed in (or anon, since LiveStatusBar is public) can read.
drop policy if exists "match_results read all" on public.match_results;
create policy "match_results read all"
  on public.match_results
  for select
  using (true);

-- No public write access — admin server actions use the service-role client,
-- which bypasses RLS. This policy explicitly denies anon/authenticated writes.
drop policy if exists "match_results no public write" on public.match_results;
create policy "match_results no public write"
  on public.match_results
  for all
  using (false)
  with check (false);

drop trigger if exists match_results_touch_updated_at on public.match_results;
create trigger match_results_touch_updated_at
  before update on public.match_results
  for each row execute function public.touch_updated_at();

-- ─── Grading ────────────────────────────────────────────────────────────────
-- Per insert/update of home_score, away_score or status, when the row is
-- (or becomes) finished, recompute points_awarded for every prediction on
-- this match, then roll those sums into league_members.points for every
-- user who tipped any match.
create or replace function public.grade_predictions_for_match()
returns trigger language plpgsql as $$
begin
  if NEW.status is distinct from 'finished' then
    return NEW;
  end if;

  -- 1) Award points per prediction on this match.
  update public.predictions p
  set points_awarded = case
        when p.home_score = NEW.home_score and p.away_score = NEW.away_score then 3
        when p.outcome   = NEW.outcome                                       then 1
        else                                                                       0
      end
  where p.match_id = NEW.match_id;

  -- 2) Recompute league_members.points for every user who has any tip on
  --    THIS match (covers all leagues they're in via league_members.user_id).
  update public.league_members lm
  set points = coalesce((
        select sum(p.points_awarded)
        from public.predictions p
        where p.user_id = lm.user_id
          and p.points_awarded is not null
      ), 0)
  where lm.user_id in (
    select distinct user_id
    from public.predictions
    where match_id = NEW.match_id
  );

  return NEW;
end;
$$;

drop trigger if exists match_results_grade on public.match_results;
create trigger match_results_grade
  after insert or update of home_score, away_score, status
  on public.match_results
  for each row execute function public.grade_predictions_for_match();
