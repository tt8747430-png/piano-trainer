-- The Public library (ADR 0116, round 4b): a learner's own song published as a snapshot others can play and
-- save a copy of. Anyone reads what is not hidden; an author publishes, updates and unpublishes their own unless
-- blocked; reports go to editors, who hide items and block publishers. Publishing is capped at 20 an hour.
-- No drop statements: the objects are new.

create table if not exists public.public_items (
  id           uuid primary key default gen_random_uuid(),
  author_id    uuid not null default auth.uid() references auth.users on delete cascade,
  author_name  text not null check (length(author_name) between 1 and 80),
  kind         text not null default 'song' check (kind in ('song')),
  source_id    text not null check (length(source_id) between 1 and 200),
  title        text not null check (length(title) between 1 and 200),
  meta         jsonb not null default '{}'::jsonb,
  body         jsonb not null check (octet_length(body::text) < 200000),
  size         integer generated always as (octet_length(body::text)) stored,
  version      text not null,
  saves        integer not null default 0,
  hidden       boolean not null default false,
  published_at timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (author_id, source_id)
);

create index if not exists public_items_new_idx on public.public_items (published_at desc) where not hidden;
create index if not exists public_items_saved_idx on public.public_items (saves desc) where not hidden;

create table if not exists public.public_reports (
  item_id     uuid not null references public.public_items on delete cascade,
  reporter_id uuid not null default auth.uid() references auth.users on delete cascade,
  reason      text not null check (reason in ('not-theirs', 'offensive', 'spam', 'broken')),
  note        text not null default '' check (length(note) <= 1000),
  reported_at timestamptz not null default now(),
  primary key (item_id, reporter_id)
);

create table if not exists public.public_saves (
  item_id  uuid not null references public.public_items on delete cascade,
  user_id  uuid not null references auth.users on delete cascade,
  saved_at timestamptz not null default now(),
  primary key (item_id, user_id)
);

create table if not exists public.publish_blocks (
  user_id    uuid primary key references auth.users on delete cascade,
  blocked_at timestamptz not null default now()
);

create or replace function public.is_publish_blocked()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.publish_blocks where user_id = (select auth.uid()))
$$;

revoke execute on function public.is_publish_blocked() from public, anon;

-- At most 20 publishes an hour per author, counting new items and updates of their body.
create or replace function public.cap_publishing()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select public.is_content_editor()) then
    return new;
  end if;
  if (
    select count(*) from public.public_items
    where author_id = new.author_id and updated_at > now() - interval '1 hour'
  ) >= 20 then
    raise exception 'publishing limit reached' using errcode = 'P0429';
  end if;
  new.updated_at := now();
  return new;
end;
$$;

revoke execute on function public.cap_publishing() from public, anon, authenticated;

create trigger cap_publishing
  before insert or update of body, title, meta, version on public.public_items
  for each row execute function public.cap_publishing();

-- A save, counted once per learner.
create or replace function public.save_public_item(p_item uuid)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare saved integer;
begin
  if (select auth.uid()) is null then
    raise exception 'not signed in' using errcode = '42501';
  end if;
  insert into public.public_saves (item_id, user_id) values (p_item, (select auth.uid()))
  on conflict do nothing;
  if found then
    update public.public_items set saves = saves + 1 where id = p_item and not hidden;
  end if;
  select saves into saved from public.public_items where id = p_item;
  return coalesce(saved, 0);
end;
$$;

revoke execute on function public.save_public_item(uuid) from public, anon;
grant execute on function public.save_public_item(uuid) to authenticated;

-- An editor hides or shows an item: never its author, who could show what was hidden.
create or replace function public.hide_public_item(p_item uuid, p_hidden boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not (select public.is_content_editor()) then
    raise exception 'editors only' using errcode = '42501';
  end if;
  update public.public_items set hidden = p_hidden where id = p_item;
end;
$$;

revoke execute on function public.hide_public_item(uuid, boolean) from public, anon;
grant execute on function public.hide_public_item(uuid, boolean) to authenticated;

alter table public.public_items enable row level security;
alter table public.public_reports enable row level security;
alter table public.public_saves enable row level security;
alter table public.publish_blocks enable row level security;

grant select on public.public_items to anon, authenticated;
grant insert, delete on public.public_items to authenticated;
grant update (title, meta, body, version, author_name) on public.public_items to authenticated;
grant insert on public.public_reports to authenticated;
grant select on public.public_reports to authenticated;
grant select, insert, delete on public.publish_blocks to authenticated;

create policy read_shown on public.public_items for select to anon, authenticated
  using (not hidden or author_id = (select auth.uid()) or (select public.is_content_editor()));
create policy author_publish on public.public_items for insert to authenticated
  with check (author_id = (select auth.uid()) and not hidden and not (select public.is_publish_blocked()));
create policy author_update on public.public_items for update to authenticated
  using (author_id = (select auth.uid()) or (select public.is_content_editor()))
  with check (
    (author_id = (select auth.uid()) and not (select public.is_publish_blocked()))
    or (select public.is_content_editor())
  );
create policy author_unpublish on public.public_items for delete to authenticated
  using (author_id = (select auth.uid()) or (select public.is_content_editor()));

create policy report on public.public_reports for insert to authenticated
  with check (reporter_id = (select auth.uid()));
create policy editors_read_reports on public.public_reports for select to authenticated
  using ((select public.is_content_editor()));

create policy editors_block on public.publish_blocks for all to authenticated
  using ((select public.is_content_editor())) with check ((select public.is_content_editor()));
