-- Fix: infinite recursion in policy for relation "league_members"
--
-- Run this in the Supabase SQL Editor on project iugsxrotjbslldceqmxq.
--
-- Root cause: the original policy "members read same league" subqueries
-- public.league_members from inside its own USING clause. Every SELECT against
-- league_members re-triggers the same policy, which loops. Similarly the
-- mini_leagues "leagues read" policy subqueries league_members, and that
-- subquery in turn triggers league_members' policy → cross-recursion.
--
-- Pattern: wrap the membership check in a SECURITY DEFINER function so the
-- internal query bypasses RLS. Also add a simpler "read own row" policy so
-- the common "/leagues" page (which only ever queries the caller's own
-- memberships) doesn't need the heavier check at all.

create or replace function public.is_member_of_league(p_league_id uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1
    from public.league_members
    where league_id = p_league_id and user_id = auth.uid()
  );
$$;

-- Replace the recursive policies
drop policy if exists "members read same league" on public.league_members;
drop policy if exists "members read own"        on public.league_members;
drop policy if exists "leagues read"            on public.mini_leagues;

-- league_members: see your own membership rows (no recursion possible).
create policy "members read own" on public.league_members for select using (
  user_id = auth.uid()
);

-- league_members: see all members of a league you belong to (or you own).
-- Uses SECURITY DEFINER helper to break the recursive chain.
create policy "members read same league" on public.league_members for select using (
  public.is_member_of_league(league_id)
  or exists (
    select 1 from public.mini_leagues ml
    where ml.id = league_members.league_id and ml.owner_id = auth.uid()
  )
);

-- mini_leagues: readable when public, owned by you, or you are a member.
-- The helper avoids triggering league_members RLS during the membership check.
create policy "leagues read" on public.mini_leagues for select using (
  not is_private
  or owner_id = auth.uid()
  or public.is_member_of_league(id)
);
