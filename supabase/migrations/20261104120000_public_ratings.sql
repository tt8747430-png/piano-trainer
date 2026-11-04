-- Explore (round 29, B3): a published song's category, chosen by its author on the Publish page, and
-- learners' ratings of what is published, one to five stars, one rating each. Anyone reads an item's
-- average and count through `public_item_ratings`; who rated what is each learner's own to read.
-- No drop statements: the objects are new, or added to.

-- What a song is: Classical, Folk, Pop or Studies; a pattern has none.
alter table public.public_items
  add column if not exists category text
  check (category in ('classical', 'folk', 'pop', 'studies'));
alter table public.public_items
  add constraint public_items_category_kind check (kind = 'song' or category is null);
grant update (category) on public.public_items to authenticated;
create index if not exists public_items_category_idx
  on public.public_items (kind, category, published_at desc) where not hidden;

create table if not exists public.public_ratings (
  item_id  uuid not null references public.public_items on delete cascade,
  user_id  uuid not null default auth.uid() references auth.users on delete cascade,
  stars    smallint not null check (stars between 1 and 5),
  rated_at timestamptz not null default now(),
  primary key (item_id, user_id)
);
create index if not exists public_ratings_user_idx on public.public_ratings (user_id);

alter table public.public_ratings enable row level security;
grant select, insert on public.public_ratings to authenticated;
grant update (stars, rated_at) on public.public_ratings to authenticated;

-- A learner reads, gives and changes their own rating alone, of an item they can see.
create policy read_own_rating on public.public_ratings for select to authenticated
  using (user_id = (select auth.uid()));
create policy rate_shown on public.public_ratings for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.public_items i where i.id = item_id and not i.hidden)
  );
create policy change_own_rating on public.public_ratings for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Every shown item's average (one decimal) and count: never who rated. The view reads as its owner,
-- so it sees every rating; it names no learner and leaves out hidden items.
create or replace view public.public_item_ratings with (security_invoker = false) as
  select r.item_id,
         round(avg(r.stars), 1)::double precision as average,
         count(*)::integer as count
  from public.public_ratings r
  join public.public_items i on i.id = r.item_id and not i.hidden
  group by r.item_id;

revoke all on public.public_item_ratings from public;
grant select on public.public_item_ratings to anon, authenticated;

-- Rating as the learner (their row's rules apply): a new rating, or theirs changed; the item's
-- rating after.
create or replace function public.rate_public_item(p_item uuid, p_stars integer)
returns table (average double precision, count integer)
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if (select auth.uid()) is null then
    raise exception 'not signed in' using errcode = '42501';
  end if;
  insert into public.public_ratings (item_id, stars) values (p_item, p_stars)
  on conflict (item_id, user_id) do update set stars = excluded.stars, rated_at = now();
  return query
    select r.average, r.count from public.public_item_ratings r where r.item_id = p_item;
end;
$$;

revoke execute on function public.rate_public_item(uuid, integer) from public, anon;
grant execute on function public.rate_public_item(uuid, integer) to authenticated;
