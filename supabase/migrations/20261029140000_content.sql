-- Content from the database (ADR 0116, round 4): every built-in piece, lesson, course and the rest, one row an
-- item. Learners read what is published to an audience they are in; admins and editors (app_metadata.role, set
-- only by the service role) read drafts and write. Every published version is kept in content_versions.

create or replace function public.is_content_editor()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'editor'), false)
$$;

create table if not exists public.content_items (
  kind       text not null check (kind in ('piece', 'lesson', 'course', 'pattern', 'progression', 'exercise', 'book')),
  id         text not null check (length(id) between 1 and 200),
  version    text not null,
  audience   text not null default 'everyone' check (audience in ('everyone', 'signed-in', 'admins')),
  status     text not null default 'draft' check (status in ('draft', 'published')),
  meta       jsonb not null default '{}'::jsonb,
  body       jsonb not null,
  size       integer generated always as (octet_length(body::text)) stored,
  updated_at timestamptz not null default now(),
  primary key (kind, id)
);

create index if not exists content_items_published_idx
  on public.content_items (kind, updated_at) where status = 'published';

create table if not exists public.content_versions (
  kind         text not null,
  id           text not null,
  version      text not null,
  meta         jsonb not null,
  body         jsonb not null,
  published_at timestamptz not null default now(),
  primary key (kind, id, version),
  foreign key (kind, id) references public.content_items (kind, id) on delete cascade
);

-- A publish keeps its version: inserting or updating a published item records it once.
create or replace function public.keep_content_version()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status = 'published' then
    insert into public.content_versions (kind, id, version, meta, body)
    values (new.kind, new.id, new.version, new.meta, new.body)
    on conflict (kind, id, version) do nothing;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

revoke execute on function public.keep_content_version() from public, anon, authenticated;

create trigger keep_content_version
  before insert or update on public.content_items
  for each row execute function public.keep_content_version();

alter table public.content_items enable row level security;
alter table public.content_versions enable row level security;

grant select on public.content_items to anon, authenticated;
grant insert, update, delete on public.content_items to authenticated;
grant select on public.content_versions to authenticated;

create policy published_read on public.content_items for select to anon, authenticated
  using (
    status = 'published' and (
      audience = 'everyone'
      or (audience = 'signed-in' and (select auth.role()) = 'authenticated')
      or (select public.is_content_editor())
    )
    or (select public.is_content_editor())
  );

create policy editor_insert on public.content_items for insert to authenticated
  with check ((select public.is_content_editor()));
create policy editor_update on public.content_items for update to authenticated
  using ((select public.is_content_editor())) with check ((select public.is_content_editor()));
create policy editor_delete on public.content_items for delete to authenticated
  using ((select public.is_content_editor()));

create policy editor_read on public.content_versions for select to authenticated
  using ((select public.is_content_editor()));
