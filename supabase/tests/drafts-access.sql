-- The drafts' rules, checked on the project (ADR 0116, round 6), in a transaction that is undone, reporting through
-- its closing error. Expected: learner_drafted=0 learner_published=0 editor_draft=1 published=Two versions=2
-- restored=One.
do $$
declare a uuid := '00000000-0000-0000-0000-0000000000a1';
        learner_drafted int := 0; learner_published int := 0; editor_draft int; published_title text;
        versions int; restored_title text;
begin
  insert into auth.users (id, email, aud, role) values (a, 'a@rls.test', 'authenticated', 'authenticated');
  insert into public.content_items (kind, id, version, status, body)
    values ('piece', 't-song', 'v1', 'published', '{"title":"One"}');
  execute 'set local role authenticated';
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  begin
    insert into public.content_drafts (kind, id, body) values ('piece', 't-song', '{"title":"Mine"}');
    learner_drafted := 1;
  exception when insufficient_privilege then learner_drafted := 0;
  end;
  begin
    perform public.publish_content('piece', 't-song', 'v9');
    learner_published := 1;
  exception when insufficient_privilege then learner_published := 0;
  end;
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated',
    'app_metadata', json_build_object('role', 'editor'))::text, true);
  insert into public.content_drafts (kind, id, body) values ('piece', 't-song', '{"title":"Two"}');
  select count(*) into editor_draft from public.content_drafts where id = 't-song';
  perform public.publish_content('piece', 't-song', 'v2');
  select body->>'title' into published_title from public.content_items where id = 't-song';
  select count(*) into versions from public.content_versions where id = 't-song';
  perform public.publish_content('piece', 't-song', 'v1', 'v1');
  select body->>'title' into restored_title from public.content_items where id = 't-song';
  raise exception 'RESULT learner_drafted=% learner_published=% editor_draft=% published=% versions=% restored=%',
    learner_drafted, learner_published, editor_draft, published_title, versions, restored_title;
end $$;
