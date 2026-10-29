-- The error reports' rules, checked on the project (ADR 0116, round 7), in a transaction that is undone,
-- reporting through its closing error. Expected: anon_wrote=1 learner_wrote=1 forged=0 learner_read=0 admin_read=2.
do $$
declare b uuid := '00000000-0000-0000-0000-0000000000b2';
        anon_wrote int; learner_wrote int; forged int := 0; learner_read int; admin_read int;
begin
  insert into auth.users (id, email, aud, role) values (b, 'b@rls.test', 'authenticated', 'authenticated');
  execute 'set local role anon';
  perform set_config('request.jwt.claims', json_build_object('role', 'anon')::text, true);
  insert into public.error_reports (message, path) values ('rls-test anon', '/');
  get diagnostics anon_wrote = row_count;
  execute 'set local role authenticated';
  perform set_config('request.jwt.claims', json_build_object('sub', b, 'role', 'authenticated')::text, true);
  insert into public.error_reports (message) values ('rls-test learner');
  get diagnostics learner_wrote = row_count;
  begin
    insert into public.error_reports (message, user_id)
      values ('rls-test forged', '00000000-0000-0000-0000-0000000000a1');
    forged := 1;
  exception when insufficient_privilege then forged := 0;
  end;
  select count(*) into learner_read from public.error_reports where message like 'rls-test%';
  perform set_config('request.jwt.claims', json_build_object('sub', b, 'role', 'authenticated',
    'app_metadata', json_build_object('role', 'admin'))::text, true);
  select count(*) into admin_read from public.error_reports where message like 'rls-test%';
  raise exception 'RESULT anon_wrote=% learner_wrote=% forged=% learner_read=% admin_read=%',
    anon_wrote, learner_wrote, forged, learner_read, admin_read;
end $$;
