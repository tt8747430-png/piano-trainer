-- The access rules, checked on the project (ADR 0116). Run it in the SQL editor or with
-- `execute_sql`: it makes two learners inside a transaction that is undone, and reports through its
-- closing error. Expected: own_sees=1 other_sees=0 other_changed=0 anon=-1 stale_refused=1 based_refused=0.
do $$
declare a uuid := '00000000-0000-0000-0000-0000000000a1';
        b uuid := '00000000-0000-0000-0000-0000000000b2';
        own_seen int; other_seen int; other_changed int; anon_seen int; stale jsonb; based jsonb;
begin
  insert into auth.users (id, email, aud, role) values
    (a, 'a@rls.test', 'authenticated', 'authenticated'),
    (b, 'b@rls.test', 'authenticated', 'authenticated');
  execute 'set local role authenticated';
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  perform public.push_documents('settings', '[{"id":"settings","data":{"updatedAt":"2","theme":"dark"}}]');
  select count(*) into own_seen from public.settings;
  stale := public.push_documents('settings', '[{"id":"settings","base":"1","data":{"updatedAt":"3"}}]');
  based := public.push_documents('settings', '[{"id":"settings","base":"2","data":{"updatedAt":"3"}}]');
  perform set_config('request.jwt.claims', json_build_object('sub', b, 'role', 'authenticated')::text, true);
  select count(*) into other_seen from public.settings;
  update public.settings set data = '{"changed":true}' where id = 'settings';
  get diagnostics other_changed = row_count;
  execute 'set local role anon';
  begin
    select count(*) into anon_seen from public.settings;
  exception when insufficient_privilege then anon_seen := -1;
  end;
  raise exception 'RESULT own_sees=% other_sees=% other_changed=% anon=% stale_refused=% based_refused=%',
    own_seen, other_seen, other_changed, anon_seen, jsonb_array_length(stale), jsonb_array_length(based);
end $$;
