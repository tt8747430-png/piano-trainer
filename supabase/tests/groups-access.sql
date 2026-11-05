-- Learner groups' rules (R30 S6), checked on the project in a transaction that is undone, reporting through its
-- closing error. No delete statement on another's rows succeeds; deletes are counted by row_count.
-- Expected: owner_member=1 outsider_sees_group=0 outsider_sees_folder=0 joined_member=1 member_sees_folder=1
-- viewer_wrote=0 shared_other_group=0 editor_wrote=1 editor_kept_owner=1 owner_left=0 removed=1 closed_join=failed
-- anon_groups=0.
do $$
declare a uuid := '00000000-0000-0000-0000-0000000000a1';
        b uuid := '00000000-0000-0000-0000-0000000000b2';
        c uuid := '00000000-0000-0000-0000-0000000000c3';
        grp uuid; other_grp uuid; folder uuid; code text;
        owner_member int; outsider_sees_group int; outsider_sees_folder int; joined_member int;
        member_sees_folder int; viewer_wrote int; shared_other int := 0; editor_wrote int; editor_kept int;
        owner_left int; removed int; closed_join text := 'joined'; anon_groups int := 0;
begin
  insert into auth.users (id, email, aud, role) values
    (a, 'a@rls.test', 'authenticated', 'authenticated'),
    (b, 'b@rls.test', 'authenticated', 'authenticated'),
    (c, 'c@rls.test', 'authenticated', 'authenticated');
  execute 'set local role authenticated';

  -- A makes a group, is its owner member, and shares a folder with it.
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  insert into public.learner_groups (name) values ('Choir') returning id, invite_code into grp, code;
  select count(*) into owner_member from public.learner_group_members where group_id = grp and role = 'owner';
  insert into public.shared_folders (group_id, folder_key, name, picture, paint, songs)
    values (grp, 'folder-1', 'Advent', 'music', 'yellow', '[{"id":"silent"}]') returning id into folder;

  -- C, outside it, sees neither the group nor its folder, and cannot share into it.
  perform set_config('request.jwt.claims', json_build_object('sub', c, 'role', 'authenticated')::text, true);
  select count(*) into outsider_sees_group from public.learner_groups where id = grp;
  select count(*) into outsider_sees_folder from public.shared_folders where id = folder;
  insert into public.learner_groups (name) values ('Band') returning id into other_grp;
  begin
    insert into public.shared_folders (group_id, folder_key, name, picture, paint)
      values (grp, 'folder-9', 'Mine', 'music', 'sky');
    shared_other := 1;
  exception when insufficient_privilege or check_violation then shared_other := 0;
  end;

  -- B joins by the link, reads the folder, and cannot write it while it is view only.
  perform set_config('request.jwt.claims', json_build_object('sub', b, 'role', 'authenticated')::text, true);
  perform public.join_learner_group(code);
  select count(*) into joined_member from public.learner_group_members where group_id = grp and user_id = b;
  select count(*) into member_sees_folder from public.shared_folders where id = folder;
  update public.shared_folders set name = 'Mine now' where id = folder;
  get diagnostics viewer_wrote = row_count;

  -- A lets the group edit; B writes it and cannot take it over.
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  update public.shared_folders set can_edit = true where id = folder;
  perform set_config('request.jwt.claims', json_build_object('sub', b, 'role', 'authenticated')::text, true);
  update public.shared_folders set name = 'Advent songs', owner = b, can_edit = false where id = folder;
  get diagnostics editor_wrote = row_count;

  -- The owner cannot leave (it deletes the group instead); it removes B.
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  select count(*) into editor_kept from public.shared_folders
    where id = folder and owner = a and can_edit and name = 'Advent songs';
  delete from public.learner_group_members where group_id = grp and user_id = a;
  get diagnostics owner_left = row_count;
  delete from public.learner_group_members where group_id = grp and user_id = b;
  get diagnostics removed = row_count;

  -- With the link off, nobody joins.
  update public.learner_groups set invite_open = false where id = grp;
  perform set_config('request.jwt.claims', json_build_object('sub', c, 'role', 'authenticated')::text, true);
  begin
    perform public.join_learner_group(code);
  exception when others then closed_join := 'failed';
  end;

  -- Signed out, nothing.
  execute 'set local role anon';
  perform set_config('request.jwt.claims', json_build_object('role', 'anon')::text, true);
  begin
    select count(*) into anon_groups from public.learner_groups;
  exception when insufficient_privilege then anon_groups := 0;
  end;

  raise exception 'owner_member=% outsider_sees_group=% outsider_sees_folder=% joined_member=% member_sees_folder=% viewer_wrote=% shared_other_group=% editor_wrote=% editor_kept_owner=% owner_left=% removed=% closed_join=% anon_groups=%',
    owner_member, outsider_sees_group, outsider_sees_folder, joined_member, member_sees_folder, viewer_wrote,
    shared_other, editor_wrote, editor_kept, owner_left, removed, closed_join, anon_groups;
end $$;
