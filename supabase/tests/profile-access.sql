-- Learner profiles' rules (round 29, B1, D12), in a transaction that is undone, reporting through its
-- closing error. No delete statement: the Supabase tool asks an unseen confirmation for one.
-- Expected: started=2 other_changed=0 private_seen_by_b=0 public_seen_by_anon=1 private_seen_by_anon=0
-- handle_taken=f handle_own=t duplicate_refused=1 upper_refused=1.
do $$
declare a uuid := '00000000-0000-0000-0000-0000000000a1';
        b uuid := '00000000-0000-0000-0000-0000000000b2';
        started int; other_changed int; private_seen int; public_anon int; private_anon int;
        taken boolean; own boolean; duplicate int := 0; upper int := 0;
begin
  insert into auth.users (id, email, aud, role, raw_user_meta_data) values
    (a, 'a@rls.test', 'authenticated', 'authenticated', '{"name":"Ana"}'),
    (b, 'b@rls.test', 'authenticated', 'authenticated', '{"name":"Ben"}');
  select count(*) into started from public.learner_profiles where id in (a, b);
  execute 'set local role authenticated';
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  update public.learner_profiles set handle = 'ana_plays' where id = a;
  perform set_config('request.jwt.claims', json_build_object('sub', b, 'role', 'authenticated')::text, true);
  update public.learner_profiles set name = 'Stolen' where id = a;
  get diagnostics other_changed = row_count;
  select count(*) into private_seen from public.learner_profiles where id = a;
  taken := public.handle_available('ana_plays');
  begin
    update public.learner_profiles set handle = 'ana_plays' where id = b;
    duplicate := 0;
  exception when unique_violation then duplicate := 1;
  end;
  begin
    update public.learner_profiles set handle = 'Ben' where id = b;
  exception when check_violation then upper := 1;
  end;
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  own := public.handle_available('ana_plays');
  update public.learner_profiles set public = true where id = a;
  execute 'set local role anon';
  perform set_config('request.jwt.claims', json_build_object('role', 'anon')::text, true);
  select count(*) into public_anon from public.learner_profiles where id = a;
  select count(*) into private_anon from public.learner_profiles where id = b;
  raise exception 'RESULT started=% other_changed=% private_seen_by_b=% public_seen_by_anon=% private_seen_by_anon=% handle_taken=% handle_own=% duplicate_refused=% upper_refused=%',
    started, other_changed, private_seen, public_anon, private_anon, taken, own, duplicate, upper;
end $$;
