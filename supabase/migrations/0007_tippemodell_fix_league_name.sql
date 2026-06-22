-- Fix: OddsPapi carries the tournament as "World Cup", not "FIFA World Cup".
-- Update the seed so the ingest filter matches actual fixtures.
update tm_leagues
set name = 'World Cup'
where external_id = 'fifa-wc-2026';
