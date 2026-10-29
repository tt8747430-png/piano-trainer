-- Editing the built-in content in the app (ADR 0116, round 6): an editor's draft of an item, and publishing it (or
-- a kept version again) as the item's new version. No drop or delete statement: the Supabase tool asks an unseen
-- confirmation for them; the app lets the draft go itself once published (editors may delete drafts).

create table if not exists public.content_drafts (
  kind       text not null,
  id         text not null,
  meta       jsonb not null default '{}'::jsonb,
  body       jsonb not null check (octet_length(body::text) < 2000000),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users on delete set null default auth.uid(),
  primary key (kind, id),
  foreign key (kind, id) references public.content_items (kind, id) on delete cascade
);

alter table public.content_drafts enable row level security;
grant select, insert, update, delete on public.content_drafts to authenticated;
create policy editors on public.content_drafts for all to authenticated
  using ((select public.is_content_editor())) with check ((select public.is_content_editor()));

-- Publishes an item's draft (or, given one, a kept version again): its body and meta become the item's,
-- published, under the version the app names (a hash of the body).
create or replace function public.publish_content(
  p_kind text, p_id text, p_version text, p_from_version text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_body jsonb;
  v_meta jsonb;
begin
  if not (select public.is_content_editor()) then
    raise exception 'editors only' using errcode = '42501';
  end if;
  if p_from_version is null then
    select body, meta into v_body, v_meta from public.content_drafts where kind = p_kind and id = p_id;
  else
    select body, meta into v_body, v_meta from public.content_versions
      where kind = p_kind and id = p_id and version = p_from_version;
  end if;
  if v_body is null then
    raise exception 'nothing to publish' using errcode = 'P0002';
  end if;
  update public.content_items
    set body = v_body, meta = v_meta, version = p_version, status = 'published'
    where kind = p_kind and id = p_id;
  if not found then
    raise exception 'no such item' using errcode = 'P0002';
  end if;
end;
$$;

revoke execute on function public.publish_content(text, text, text, text) from public, anon;
grant execute on function public.publish_content(text, text, text, text) to authenticated;
