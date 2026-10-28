-- A push says which server copy it was based on, and the server refuses a write over any other
-- (memory-palaces' ADR 0005): the refused rows come back for the device to merge field by field.
--
-- `base` is the `updatedAt` of the copy the device last saw (none for a document it never pulled),
-- `base_deleted` whether that copy was a deletion. A row is applied when the server holds no copy,
-- holds exactly this one, or holds the copy the row names; with no base, the newer clock wins. Each
-- document named is held by a transaction-scoped advisory lock taken in id order, so two pushes of
-- the same new document cannot both pass the check.

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
    'profiles','settings','progress','views','diagram_inversions','patterns','pieces','takes','library'
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
