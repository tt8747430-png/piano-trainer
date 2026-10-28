-- The learner's documents, one mirror table per synced collection (ADR 0116), as memory-palaces
-- keeps them (its ADR 0005), with its later fixes in from the start.
--
-- A row is a whole local document in `data`, plus the columns the server needs: `user_id` (row-level
-- security and the replication's scope), `deleted` (the tombstone) and `updated_at` (the pull's
-- checkpoint, set by the server so a device's clock cannot skew it). `data->>'updatedAt'` is the
-- device's own clock, read only by the merge. Ids are what the device calls a document (`settings`,
-- a song's id), so the key is (user_id, id): every learner has their own `settings` row.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array[
    'profiles','settings','progress','views','diagram_inversions','patterns','pieces','takes','library'
  ]
  loop
    execute format($f$
      create table if not exists public.%1$I (
        user_id    uuid not null default auth.uid() references auth.users on delete cascade,
        id         text not null,
        data       jsonb not null,
        deleted    boolean not null default false,
        updated_at timestamptz not null default now(),
        primary key (user_id, id)
      );
      create index if not exists %2$I on public.%1$I (user_id, updated_at, id);
      drop trigger if exists set_updated_at on public.%1$I;
      create trigger set_updated_at before insert or update on public.%1$I
        for each row execute function public.set_updated_at();

      alter table public.%1$I enable row level security;
      grant select, insert, update, delete on public.%1$I to authenticated;
      revoke all on public.%1$I from anon;

      drop policy if exists own_select on public.%1$I;
      create policy own_select on public.%1$I for select to authenticated
        using (user_id = (select auth.uid()));
      drop policy if exists own_insert on public.%1$I;
      create policy own_insert on public.%1$I for insert to authenticated
        with check (user_id = (select auth.uid()));
      drop policy if exists own_update on public.%1$I;
      create policy own_update on public.%1$I for update to authenticated
        using (user_id = (select auth.uid()))
        with check (user_id = (select auth.uid()));
      drop policy if exists own_delete on public.%1$I;
      create policy own_delete on public.%1$I for delete to authenticated
        using (user_id = (select auth.uid()));
    $f$, t, t || '_user_updated_idx');

    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I;', t);
    end if;
  end loop;
end $$;
