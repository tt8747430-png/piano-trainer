-- The content rules, checked on the project (ADR 0116, round 4), in a transaction that is undone, reporting
-- through its closing error. Expected: anon_pub=1 anon_signed=0 anon_draft=0 learner_signed=1 learner_draft=0
-- learner_wrote=0 editor_wrote=1 editor_draft=1 versions=2.
do $$
declare a uuid := '00000000-0000-0000-0000-0000000000a1';
        anon_pub int; anon_signed int; anon_draft int; learner_signed int; learner_draft int;
        learner_wrote int := 0; editor_wrote int; editor_draft int; versions int;
begin
  insert into auth.users (id, email, aud, role) values (a, 'a@rls.test', 'authenticated', 'authenticated');
  insert into public.content_items (kind, id, version, status, audience, body) values
    ('piece', 't-pub', '1', 'published', 'everyone', '{}'),
    ('piece', 't-signed', '1', 'published', 'signed-in', '{}'),
    ('piece', 't-draft', '1', 'draft', 'everyone', '{}');
  execute 'set local role anon';
  perform set_config('request.jwt.claims', json_build_object('role', 'anon')::text, true);
  select count(*) filter (where id = 't-pub'), count(*) filter (where id = 't-signed'),
         count(*) filter (where id = 't-draft')
    into anon_pub, anon_signed, anon_draft from public.content_items where id like 't-%';
  execute 'set local role authenticated';
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  select count(*) filter (where id = 't-signed'), count(*) filter (where id = 't-draft')
    into learner_signed, learner_draft from public.content_items where id like 't-%';
  begin
    insert into public.content_items (kind, id, version, body) values ('piece', 't-mine', '1', '{}');
    learner_wrote := 1;
  exception when insufficient_privilege then learner_wrote := 0;
  end;
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated',
    'app_metadata', json_build_object('role', 'admin'))::text, true);
  update public.content_items set version = '2', body = '{"v":2}' where id = 't-pub';
  get diagnostics editor_wrote = row_count;
  select count(*) into editor_draft from public.content_items where id = 't-draft';
  select count(*) into versions from public.content_versions where id = 't-pub';
  raise exception 'RESULT anon_pub=% anon_signed=% anon_draft=% learner_signed=% learner_draft=% learner_wrote=% editor_wrote=% editor_draft=% versions=%',
    anon_pub, anon_signed, anon_draft, learner_signed, learner_draft, learner_wrote, editor_wrote, editor_draft, versions;
end $$;
