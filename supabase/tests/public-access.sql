-- The Public library's rules, checked on the project (ADR 0116, round 4b), in a transaction that is undone,
-- reporting through its closing error. No delete statement: the Supabase tool asks an unseen confirmation for one.
-- Expected: other_changed=0 saves=1/1 reports_seen=0 editor_reports=1 author_unhid=0 blocked_published=0
-- anon_sees_hidden=0 own_ratings=1 rated=4 other_rating_changed=0 rating=3.0/2 anon_reads_raters=0
-- private_author=<NULL> public_author=Ana.
do $$
declare a uuid := '00000000-0000-0000-0000-0000000000a1';
        b uuid := '00000000-0000-0000-0000-0000000000b2';
        item uuid; other_changed int; saves1 int; saves2 int;
        unhid int := 0; reports_seen int; editor_reports int; blocked_published int := 0; hidden_anon int;
        own_ratings int; rated int; other_rating_changed int; avg_seen float8; count_seen int;
        anon_raters int := 0; private_author text; public_author text;
begin
  insert into auth.users (id, email, aud, role) values
    (a, 'a@rls.test', 'authenticated', 'authenticated'), (b, 'b@rls.test', 'authenticated', 'authenticated');
  execute 'set local role authenticated';
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  insert into public.public_items (author_name, source_id, title, body, version)
    values ('Ana', 'own-1', 'My song', '{}', '1') returning id into item;
  perform set_config('request.jwt.claims', json_build_object('sub', b, 'role', 'authenticated')::text, true);
  update public.public_items set title = 'Stolen' where id = item;
  get diagnostics other_changed = row_count;
  saves1 := public.save_public_item(item);
  saves2 := public.save_public_item(item);
  insert into public.public_reports (item_id, reason) values (item, 'spam');
  select count(*) into reports_seen from public.public_reports;
  -- Explore's ratings (B3): a learner rates once, a second rating replaces their first.
  perform public.rate_public_item(item, 5);
  perform public.rate_public_item(item, 4);
  select count(*), max(stars) into own_ratings, rated from public.public_ratings;
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  perform public.rate_public_item(item, 2);
  update public.public_ratings set stars = 1 where user_id = b;
  get diagnostics other_rating_changed = row_count;
  -- Anyone reads the average and count, never who rated; an author is named only when public (B1).
  execute 'set local role anon';
  perform set_config('request.jwt.claims', json_build_object('role', 'anon')::text, true);
  select average, count into avg_seen, count_seen from public.public_item_ratings where item_id = item;
  begin
    select count(*) into anon_raters from public.public_ratings;
    anon_raters := 1;
  exception when insufficient_privilege then anon_raters := 0;
  end;
  select name into private_author from public.public_authors where id = a;
  execute 'set local role authenticated';
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  update public.learner_profiles set name = 'Ana', public = true where id = a;
  execute 'set local role anon';
  perform set_config('request.jwt.claims', json_build_object('role', 'anon')::text, true);
  select name into public_author from public.public_authors where id = a;
  execute 'set local role authenticated';
  perform set_config('request.jwt.claims', json_build_object('sub', b, 'role', 'authenticated',
    'app_metadata', json_build_object('role', 'admin'))::text, true);
  select count(*) into editor_reports from public.public_reports;
  perform public.hide_public_item(item, true);
  insert into public.publish_blocks (user_id) values (a);
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  begin
    update public.public_items set hidden = false where id = item;
    unhid := 1;
  exception when insufficient_privilege then unhid := 0;
  end;
  begin
    insert into public.public_items (author_name, source_id, title, body, version)
      values ('Ana', 'own-2', 'Two', '{}', '1');
    blocked_published := 1;
  exception when insufficient_privilege then blocked_published := 0;
  end;
  execute 'set local role anon';
  perform set_config('request.jwt.claims', json_build_object('role', 'anon')::text, true);
  select count(*) into hidden_anon from public.public_items where id = item;
  raise exception 'RESULT other_changed=% saves=%/% reports_seen=% editor_reports=% author_unhid=% blocked_published=% anon_sees_hidden=% own_ratings=% rated=% other_rating_changed=% rating=%/% anon_reads_raters=% private_author=% public_author=%',
    other_changed, saves1, saves2, reports_seen, editor_reports, unhid, blocked_published, hidden_anon,
    own_ratings, rated, other_rating_changed, avg_seen, count_seen, anon_raters, private_author, public_author;
end $$;
