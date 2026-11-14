-- Shared chord sheets' rules (R39-10), checked on the project in a transaction that is undone, reporting through
-- its closing error.
-- Expected: owner_sees=1 outsider_lists=0 link_reads=1 link_mine=f viewer_wrote=refused anon_wrote=refused
-- editor_wrote=3 owner_kept=t key_kept=t anon_lists=0 outsider_deleted=0.
do $$
declare a uuid := '00000000-0000-0000-0000-0000000000a1';
        b uuid := '00000000-0000-0000-0000-0000000000b2';
        sheet uuid; owner_sees int; outsider_lists int; link_reads int; link_mine boolean;
        viewer_wrote text := 'wrote'; anon_wrote text := 'wrote'; editor_wrote bigint; owner_kept boolean;
        key_kept boolean; anon_lists int := 0; outsider_deleted int;
begin
  insert into auth.users (id, email, aud, role) values
    (a, 'a@rls.test', 'authenticated', 'authenticated'),
    (b, 'b@rls.test', 'authenticated', 'authenticated');
  execute 'set local role authenticated';

  -- A shares a sheet, view only.
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  insert into public.shared_chord_sheets (sheet_key, name, body, style, tempo)
    values ('sheet-1', 'Autumn Leaves', 'verse: Cm7 | F7', 'pop-1', 100) returning id into sheet;
  select count(*) into owner_sees from public.shared_chord_sheets where id = sheet;

  -- B cannot list it, reads it by the link, and cannot write it while it is view only.
  perform set_config('request.jwt.claims', json_build_object('sub', b, 'role', 'authenticated')::text, true);
  select count(*) into outsider_lists from public.shared_chord_sheets;
  select count(*), bool_and(mine) into link_reads, link_mine from public.read_shared_chord_sheet(sheet);
  begin
    perform public.write_shared_chord_sheet(sheet, 'verse: Am', 'pop-1', 100);
  exception when insufficient_privilege then viewer_wrote := 'refused';
  end;
  delete from public.shared_chord_sheets where id = sheet;
  get diagnostics outsider_deleted = row_count;

  -- Signed out, neither listing nor writing.
  execute 'set local role anon';
  perform set_config('request.jwt.claims', json_build_object('role', 'anon')::text, true);
  begin
    select count(*) into anon_lists from public.shared_chord_sheets;
  exception when insufficient_privilege then anon_lists := 0;
  end;
  begin
    perform public.write_shared_chord_sheet(sheet, 'verse: Am', 'pop-1', 100);
  exception when insufficient_privilege then anon_wrote := 'refused';
  end;

  -- A allows editing; B writes; the owner and the sheet it publishes stay A's.
  execute 'set local role authenticated';
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  update public.shared_chord_sheets set can_edit = true, owner = b, sheet_key = 'sheet-9' where id = sheet;
  perform set_config('request.jwt.claims', json_build_object('sub', b, 'role', 'authenticated')::text, true);
  editor_wrote := public.write_shared_chord_sheet(sheet, 'verse: Am | D7', 'pop-1', 110);
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  select owner = a, sheet_key = 'sheet-1' into owner_kept, key_kept from public.shared_chord_sheets where id = sheet;

  raise exception 'owner_sees=% outsider_lists=% link_reads=% link_mine=% viewer_wrote=% anon_wrote=% editor_wrote=% owner_kept=% key_kept=% anon_lists=% outsider_deleted=%',
    owner_sees, outsider_lists, link_reads, link_mine, viewer_wrote, anon_wrote, editor_wrote, owner_kept, key_kept,
    anon_lists, outsider_deleted;
end $$;
