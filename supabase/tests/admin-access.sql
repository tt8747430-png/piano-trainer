-- The admin rules, checked on the project (ADR 0116, round 5), in a transaction that is undone, reporting through
-- its closing error. Expected: boot_role=admin learner_groups=0 learner_log=0 admin_groups=1 anon_features=1
-- member_features=2 other_features=1.
do $$
declare a uuid := '00000000-0000-0000-0000-0000000000a1';
        b uuid := '00000000-0000-0000-0000-0000000000b2';
        boot_role text; learner_groups int := 0; admin_groups int; g uuid;
        anon_features int; member_features int; other_features int; learner_log int := 0;
begin
  insert into public.admin_bootstrap (email) values ('boot@rls.test');
  insert into auth.users (id, email, aud, role) values (a, 'boot@rls.test', 'authenticated', 'authenticated');
  select raw_app_meta_data ->> 'role' into boot_role from auth.users where id = a;
  insert into auth.users (id, email, aud, role) values (b, 'b@rls.test', 'authenticated', 'authenticated');
  execute 'set local role authenticated';
  perform set_config('request.jwt.claims', json_build_object('sub', b, 'role', 'authenticated')::text, true);
  begin
    insert into public.groups (name) values ('Learner made');
    learner_groups := 1;
  exception when insufficient_privilege then learner_groups := 0;
  end;
  begin
    insert into public.admin_log (admin_id, action) values (b, 'x');
    learner_log := 1;
  exception when insufficient_privilege then learner_log := 0;
  end;
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated',
    'app_metadata', json_build_object('role', 'admin'))::text, true);
  insert into public.groups (name) values ('Testers') returning id into g;
  get diagnostics admin_groups = row_count;
  insert into public.group_members (group_id, user_id) values (g, b);
  insert into public.feature_switches (key, label, state, groups) values
    ('t-all', 'All', 'everyone', '{}'), ('t-group', 'Group', 'groups', array[g]), ('t-off', 'Off', 'nobody', '{}');
  execute 'set local role anon';
  perform set_config('request.jwt.claims', json_build_object('role', 'anon')::text, true);
  select count(*) into anon_features from public.my_features() f where f like 't-%';
  execute 'set local role authenticated';
  perform set_config('request.jwt.claims', json_build_object('sub', b, 'role', 'authenticated')::text, true);
  select count(*) into member_features from public.my_features() f where f like 't-%';
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  select count(*) into other_features from public.my_features() f where f like 't-%';
  raise exception 'RESULT boot_role=% learner_groups=% learner_log=% admin_groups=% anon_features=% member_features=% other_features=%',
    boot_role, learner_groups, learner_log, admin_groups, anon_features, member_features, other_features;
end $$;
