-- Private buckets (ADR 0116): a take's recording and a profile's avatar. Objects live at
-- `${userId}/${name}`, so the first path segment is the owner and every verb checks it. A document
-- keeps the object's path; the device fetches it through a short-lived signed URL and keeps the bytes.
-- Upsert needs select, insert and update together.

insert into storage.buckets (id, name, public)
values ('takes', 'takes', false), ('avatars', 'avatars', false)
on conflict (id) do update set public = false;

do $$
declare b text;
begin
  foreach b in array array['takes','avatars']
  loop
    execute format('drop policy if exists "%1$s_read" on storage.objects;', b);
    execute format(
      $p$create policy "%1$s_read" on storage.objects for select to authenticated
         using (bucket_id = %1$L and (storage.foldername(name))[1] = (select auth.uid())::text);$p$, b);
    execute format('drop policy if exists "%1$s_insert" on storage.objects;', b);
    execute format(
      $p$create policy "%1$s_insert" on storage.objects for insert to authenticated
         with check (bucket_id = %1$L and (storage.foldername(name))[1] = (select auth.uid())::text);$p$, b);
    execute format('drop policy if exists "%1$s_update" on storage.objects;', b);
    execute format(
      $p$create policy "%1$s_update" on storage.objects for update to authenticated
         using (bucket_id = %1$L and (storage.foldername(name))[1] = (select auth.uid())::text)
         with check (bucket_id = %1$L and (storage.foldername(name))[1] = (select auth.uid())::text);$p$, b);
    execute format('drop policy if exists "%1$s_delete" on storage.objects;', b);
    execute format(
      $p$create policy "%1$s_delete" on storage.objects for delete to authenticated
         using (bucket_id = %1$L and (storage.foldername(name))[1] = (select auth.uid())::text);$p$, b);
  end loop;
end $$;
