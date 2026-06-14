-- ─────────────────────────────────────────────────────────────────────────────
-- 0004_predictions_visibility_at_kickoff.sql
--
-- Hides participants' tips until the match has actually started, enforced at
-- the database layer so the frontend can't leak future tips by accident.
--
-- Root cause it fixes:
--   The 0001 init policy was `predictions read all USING (true)`. Anyone
--   could SELECT every prediction at any time. The current UI hides pre-
--   kickoff tips via app-side filtering, but a raw API call bypasses that.
--
-- New rules:
--   • You can always read your OWN predictions.
--   • You can read another participant's prediction when:
--       (a) you share at least one league with them, AND
--       (b) the fixture's kickoff has passed (server clock) OR its status
--           indicates the match has started/finished
--           — and the fixture is NOT 'postponed' / 'cancelled', so an
--             obsolete kickoff on a postponed match doesn't leak tips.
--
-- New table: public.fixtures mirrors the in-code FIXTURES so the RLS policy
-- can join on kickoff. Updated by the sync helper and by the result-fetch
-- cron when api-football reports a status change.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.fixtures (
  id         int primary key,
  kickoff    timestamptz not null,
  status     text not null default 'scheduled'
             check (status in ('scheduled','postponed','cancelled','live','halftime','finished')),
  updated_at timestamptz not null default now()
);

alter table public.fixtures enable row level security;

drop policy if exists "fixtures read all" on public.fixtures;
create policy "fixtures read all"
  on public.fixtures
  for select
  using (true);

drop policy if exists "fixtures no public write" on public.fixtures;
create policy "fixtures no public write"
  on public.fixtures
  for all
  using (false)
  with check (false);

drop trigger if exists fixtures_touch_updated_at on public.fixtures;
create trigger fixtures_touch_updated_at
  before update on public.fixtures
  for each row execute function public.touch_updated_at();

-- Seed every fixture from the code-side FIXTURES array. Status defaults to
-- 'scheduled'; the result-fetch cron will keep it current. Postponed/cancelled
-- changes are handled by an admin override or by the API-Football status
-- ('PST'/'CANC') being mapped on write.
insert into public.fixtures (id, kickoff, status) values
(1, '2026-06-11T19:00:00Z', 'scheduled'),
(2, '2026-06-12T02:00:00Z', 'scheduled'),
(3, '2026-06-12T19:00:00Z', 'scheduled'),
(4, '2026-06-13T19:00:00Z', 'scheduled'),
(5, '2026-06-13T01:00:00Z', 'scheduled'),
(6, '2026-06-13T22:00:00Z', 'scheduled'),
(7, '2026-06-14T01:00:00Z', 'scheduled'),
(8, '2026-06-14T04:00:00Z', 'scheduled'),
(9, '2026-06-14T17:00:00Z', 'scheduled'),
(10, '2026-06-14T23:00:00Z', 'scheduled'),
(11, '2026-06-14T20:00:00Z', 'scheduled'),
(12, '2026-06-15T02:00:00Z', 'scheduled'),
(13, '2026-06-15T19:00:00Z', 'scheduled'),
(14, '2026-06-16T01:00:00Z', 'scheduled'),
(15, '2026-06-15T16:00:00Z', 'scheduled'),
(16, '2026-06-15T22:00:00Z', 'scheduled'),
(17, '2026-06-16T19:00:00Z', 'scheduled'),
(18, '2026-06-16T21:00:00Z', 'scheduled'),
(19, '2026-06-17T01:00:00Z', 'scheduled'),
(20, '2026-06-17T04:00:00Z', 'scheduled'),
(21, '2026-06-17T17:00:00Z', 'scheduled'),
(22, '2026-06-18T02:00:00Z', 'scheduled'),
(23, '2026-06-17T20:00:00Z', 'scheduled'),
(24, '2026-06-17T23:00:00Z', 'scheduled'),
(25, '2026-06-18T16:00:00Z', 'scheduled'),
(26, '2026-06-19T01:00:00Z', 'scheduled'),
(27, '2026-06-18T19:00:00Z', 'scheduled'),
(28, '2026-06-18T22:00:00Z', 'scheduled'),
(29, '2026-06-19T22:00:00Z', 'scheduled'),
(30, '2026-06-20T00:30:00Z', 'scheduled'),
(31, '2026-06-19T19:00:00Z', 'scheduled'),
(32, '2026-06-20T03:00:00Z', 'scheduled'),
(33, '2026-06-20T20:00:00Z', 'scheduled'),
(34, '2026-06-21T00:00:00Z', 'scheduled'),
(35, '2026-06-20T17:00:00Z', 'scheduled'),
(36, '2026-06-21T04:00:00Z', 'scheduled'),
(37, '2026-06-21T19:00:00Z', 'scheduled'),
(38, '2026-06-22T01:00:00Z', 'scheduled'),
(39, '2026-06-21T16:00:00Z', 'scheduled'),
(40, '2026-06-21T22:00:00Z', 'scheduled'),
(41, '2026-06-22T21:00:00Z', 'scheduled'),
(42, '2026-06-23T21:00:00Z', 'scheduled'),
(43, '2026-06-22T17:00:00Z', 'scheduled'),
(44, '2026-06-23T03:00:00Z', 'scheduled'),
(45, '2026-06-23T17:00:00Z', 'scheduled'),
(46, '2026-06-24T02:00:00Z', 'scheduled'),
(47, '2026-06-23T20:00:00Z', 'scheduled'),
(48, '2026-06-23T23:00:00Z', 'scheduled'),
(49, '2026-06-25T01:00:00Z', 'scheduled'),
(50, '2026-06-25T01:00:00Z', 'scheduled'),
(51, '2026-06-24T19:00:00Z', 'scheduled'),
(52, '2026-06-24T19:00:00Z', 'scheduled'),
(53, '2026-06-24T22:00:00Z', 'scheduled'),
(54, '2026-06-24T22:00:00Z', 'scheduled'),
(55, '2026-06-26T02:00:00Z', 'scheduled'),
(56, '2026-06-26T02:00:00Z', 'scheduled'),
(57, '2026-06-25T20:00:00Z', 'scheduled'),
(58, '2026-06-25T20:00:00Z', 'scheduled'),
(59, '2026-06-25T23:00:00Z', 'scheduled'),
(60, '2026-06-25T23:00:00Z', 'scheduled'),
(61, '2026-06-27T03:00:00Z', 'scheduled'),
(62, '2026-06-27T03:00:00Z', 'scheduled'),
(63, '2026-06-27T00:00:00Z', 'scheduled'),
(64, '2026-06-27T00:00:00Z', 'scheduled'),
(65, '2026-06-26T21:00:00Z', 'scheduled'),
(66, '2026-06-26T21:00:00Z', 'scheduled'),
(67, '2026-06-28T02:00:00Z', 'scheduled'),
(68, '2026-06-28T02:00:00Z', 'scheduled'),
(69, '2026-06-27T23:30:00Z', 'scheduled'),
(70, '2026-06-27T23:30:00Z', 'scheduled'),
(71, '2026-06-27T21:00:00Z', 'scheduled'),
(72, '2026-06-27T21:00:00Z', 'scheduled'),
(73, '2026-06-28T19:00:00Z', 'scheduled'),
(74, '2026-06-29T20:30:00Z', 'scheduled'),
(75, '2026-06-29T01:00:00Z', 'scheduled'),
(76, '2026-06-29T17:00:00Z', 'scheduled'),
(77, '2026-06-30T21:00:00Z', 'scheduled'),
(78, '2026-06-30T17:00:00Z', 'scheduled'),
(79, '2026-06-30T01:00:00Z', 'scheduled'),
(80, '2026-07-01T16:00:00Z', 'scheduled'),
(81, '2026-07-01T00:00:00Z', 'scheduled'),
(82, '2026-07-01T20:00:00Z', 'scheduled'),
(83, '2026-07-02T23:00:00Z', 'scheduled'),
(84, '2026-07-02T19:00:00Z', 'scheduled'),
(85, '2026-07-03T03:00:00Z', 'scheduled'),
(86, '2026-07-03T22:00:00Z', 'scheduled'),
(87, '2026-07-04T01:30:00Z', 'scheduled'),
(88, '2026-07-03T18:00:00Z', 'scheduled'),
(89, '2026-07-04T21:00:00Z', 'scheduled'),
(90, '2026-07-04T17:00:00Z', 'scheduled'),
(91, '2026-07-05T20:00:00Z', 'scheduled'),
(92, '2026-07-06T00:00:00Z', 'scheduled'),
(93, '2026-07-06T19:00:00Z', 'scheduled'),
(94, '2026-07-07T00:00:00Z', 'scheduled'),
(95, '2026-07-07T16:00:00Z', 'scheduled'),
(96, '2026-07-07T20:00:00Z', 'scheduled'),
(97, '2026-07-09T19:00:00Z', 'scheduled'),
(98, '2026-07-10T18:00:00Z', 'scheduled'),
(99, '2026-07-11T20:00:00Z', 'scheduled'),
(100, '2026-07-12T00:00:00Z', 'scheduled'),
(101, '2026-07-14T19:00:00Z', 'scheduled'),
(102, '2026-07-15T19:00:00Z', 'scheduled'),
(103, '2026-07-18T19:00:00Z', 'scheduled'),
(104, '2026-07-19T19:00:00Z', 'scheduled');
on conflict (id) do update set
  kickoff = excluded.kickoff,
  status  = excluded.status;

-- ─── Replace the permissive predictions read policy ─────────────────────────
drop policy if exists "predictions read all"               on public.predictions;
drop policy if exists "predictions read own"               on public.predictions;
drop policy if exists "predictions read teammate at kickoff" on public.predictions;

-- Your own tips are always visible to you.
create policy "predictions read own"
  on public.predictions
  for select
  using (auth.uid() = user_id);

-- A teammate's tip is visible only after the fixture has started.
-- "Started" means: server clock has passed kickoff AND not postponed/cancelled,
-- OR the trusted status is live/halftime/finished.
create policy "predictions read teammate at kickoff"
  on public.predictions
  for select
  using (
    auth.uid() <> user_id
    and exists (
      select 1
      from public.league_members lm_self
      join public.league_members lm_other
        on lm_self.league_id = lm_other.league_id
      where lm_self.user_id = auth.uid()
        and lm_other.user_id = public.predictions.user_id
    )
    and exists (
      select 1 from public.fixtures f
      where f.id = public.predictions.match_id
        and f.status not in ('postponed','cancelled')
        and (
          f.kickoff <= now()
          or f.status in ('live','halftime','finished')
        )
    )
  );

-- ─── Mirror match_results.status into fixtures.status ───────────────────────
-- The result-fetch cron writes to match_results. This trigger keeps
-- fixtures.status in lockstep so the RLS reveal condition above stays in
-- sync without a second round-trip from the cron.
create or replace function public.sync_fixture_status_from_match()
returns trigger language plpgsql as $$
begin
  update public.fixtures
  set status = NEW.status
  where id = NEW.match_id;
  return NEW;
end;
$$;

drop trigger if exists match_results_sync_fixture_status on public.match_results;
create trigger match_results_sync_fixture_status
  after insert or update of status on public.match_results
  for each row execute function public.sync_fixture_status_from_match();

-- ─── Enable Realtime broadcast for the relevant tables ──────────────────────
-- The browser subscribes to these via @supabase/supabase-js so the league
-- page can re-render the moment a teammate's tip becomes legal to read.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'predictions'
  ) then
    alter publication supabase_realtime add table public.predictions;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'fixtures'
  ) then
    alter publication supabase_realtime add table public.fixtures;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'match_results'
  ) then
    alter publication supabase_realtime add table public.match_results;
  end if;
end$$;
