-- The lessons and courses the learner makes (R30-5, `pt-own-lessons`), their own and synced: a mirror
-- table as every synced store has (20261029120000_user_documents.sql), its rows reached by their owner
-- alone, and `push_documents` taking it. Written without `drop` statements: the table and its policies
-- are new.

create table if not exists public.own_lessons (
  user_id    uuid not null default auth.uid() references auth.users on delete cascade,
  id         text not null,
  data       jsonb not null,
  deleted    boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);
create index if not exists own_lessons_user_updated_idx
  on public.own_lessons (user_id, updated_at, id);
create trigger set_updated_at before insert or update on public.own_lessons
  for each row execute function public.set_updated_at();

alter table public.own_lessons enable row level security;
grant select, insert, update, delete on public.own_lessons to authenticated;
revoke all on public.own_lessons from anon;

create policy own_select on public.own_lessons for select to authenticated
  using (user_id = (select auth.uid()));
create policy own_insert on public.own_lessons for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy own_update on public.own_lessons for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
create policy own_delete on public.own_lessons for delete to authenticated
  using (user_id = (select auth.uid()));

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'own_lessons'
  ) then
    alter publication supabase_realtime add table public.own_lessons;
  end if;
end $$;

-- The push takes the new table: the same function, its list of tables one longer.
create or replace function public.push_documents(p_table text, p_rows jsonb)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  caller uuid := (select auth.uid());
  document text;
  refused jsonb;
begin
  if p_table not in (
    'profiles','settings','progress','views','diagram_inversions','patterns','pieces','takes','library',
    'chord_sheets','notifications','practice_library','own_lessons'
  ) then
    raise exception 'push_documents: unknown table %', p_table;
  end if;

  for document in
    select distinct element->>'id' from jsonb_array_elements(p_rows) as element order by 1
  loop
    perform pg_advisory_xact_lock(
      hashtextextended(format('push_documents/%s/%s/%s', p_table, caller, document), 0)
    );
  end loop;

  execute format($q$
    with incoming as (
      select
        $2                                              as user_id,
        element->>'id'                                  as id,
        element->'data'                                 as data,
        coalesce((element->>'deleted')::boolean, false) as deleted,
        element ? 'base'                                as based,
        element->>'base'                                as base,
        coalesce((element->>'base_deleted')::boolean, false) as base_deleted
      from jsonb_array_elements($1) as element
    ),
    held as (
      select server.id, server.data, server.deleted
      from public.%1$I as server
      join incoming on incoming.id = server.id and incoming.user_id = server.user_id
      for update of server
    ),
    accepted as (
      select incoming.user_id, incoming.id, incoming.data, incoming.deleted
      from incoming
      left join held on held.id = incoming.id
      where held.id is null
         or (held.data = incoming.data and held.deleted = incoming.deleted)
         or (incoming.based
             and held.data->>'updatedAt' is not distinct from incoming.base
             and held.deleted = incoming.base_deleted)
         or (not incoming.based
             and coalesce(held.data->>'updatedAt', '') <= coalesce(incoming.data->>'updatedAt', ''))
    ),
    applied as (
      insert into public.%1$I as target (user_id, id, data, deleted)
      select user_id, id, data, deleted from accepted
      on conflict (user_id, id) do update
        set data = excluded.data, deleted = excluded.deleted
      returning target.id
    )
    select coalesce(jsonb_agg(jsonb_build_object(
             'id', server.id, 'data', server.data,
             'deleted', server.deleted, 'updated_at', server.updated_at)), '[]'::jsonb)
    from public.%1$I as server
    join incoming on incoming.id = server.id and incoming.user_id = server.user_id
    where server.id not in (select id from applied)
  $q$, p_table)
  into refused
  using p_rows, caller;

  return refused;
end;
$$;

revoke execute on function public.push_documents(text, jsonb) from public, anon;
grant execute on function public.push_documents(text, jsonb) to authenticated;
