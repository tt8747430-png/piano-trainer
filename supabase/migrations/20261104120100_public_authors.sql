-- Who published a song, as Explore and its pages name them (round 29, B1, D12): a public profile's
-- name and picture; for a private one, nothing, which the app says as "Piano Trainer learner" in the
-- learner's language. Only authors of shown items are listed. The view reads as its owner, so it
-- sees every profile; it gives a private one's id alone, already public on its items.
-- No drop statements: the view is new.

create or replace view public.public_authors with (security_invoker = false) as
  select a.author_id as id,
         case when p.public and p.name <> '' then p.name end as name,
         case when p.public then p.avatar end as avatar
  from (select distinct author_id from public.public_items where not hidden) a
  left join public.learner_profiles p on p.id = a.author_id;

revoke all on public.public_authors from public;
grant select on public.public_authors to anon, authenticated;
