-- Chord sheets shared live (R39-10, owner 2026-11-13: "when I share the chords sheet it is online and automatically
-- syncs with the other links that are opened"). Share makes one of the learner's chord sheets an online sheet: a row
-- here, its id the link. The owner writes it under their own policy; anyone holding the link reads it, and writes it
-- when the owner chose Can edit, only through the two definer functions below, never by listing the table. Each change
-- pings the sheet's Realtime topic (`chord-sheet:<id>`, a public broadcast topic named by the unguessable id); a ping
-- carries only the revision, so every open copy reads the sheet back through `read_shared_chord_sheet`, and a forged
-- ping can do no more than make a copy read again.

create table if not exists public.shared_chord_sheets (
  -- The link: 122 random bits.
  id         uuid primary key default gen_random_uuid(),
  owner      uuid not null default auth.uid() references auth.users on delete cascade,
  -- The owner's own sheet it publishes (`sheet-3`, one of My chord sheets).
  sheet_key  text not null check (sheet_key ~ '^sheet-[0-9]{1,9}$'),
  name       text not null check (char_length(btrim(name)) between 1 and 60),
  -- The sheet as text (`sheetToText`), as the device keeps it.
  body       text not null check (char_length(body) between 1 and 20000),
  style      text not null check (char_length(style) between 1 and 64),
  tempo      integer not null check (tempo between 40 and 240),
  can_edit   boolean not null default false,
  revision   bigint not null default 1,
  updated_at timestamptz not null default now(),
  unique (owner, sheet_key)
);

alter table public.shared_chord_sheets enable row level security;

drop policy if exists shared_chord_sheets_owner_reads on public.shared_chord_sheets;
create policy shared_chord_sheets_owner_reads on public.shared_chord_sheets
  for select to authenticated using (owner = (select auth.uid()));
drop policy if exists shared_chord_sheets_owner_adds on public.shared_chord_sheets;
create policy shared_chord_sheets_owner_adds on public.shared_chord_sheets
  for insert to authenticated with check (owner = (select auth.uid()));
drop policy if exists shared_chord_sheets_owner_changes on public.shared_chord_sheets;
create policy shared_chord_sheets_owner_changes on public.shared_chord_sheets
  for update to authenticated using (owner = (select auth.uid())) with check (owner = (select auth.uid()));
drop policy if exists shared_chord_sheets_owner_stops on public.shared_chord_sheets;
create policy shared_chord_sheets_owner_stops on public.shared_chord_sheets
  for delete to authenticated using (owner = (select auth.uid()));

revoke all on public.shared_chord_sheets from anon, authenticated;
grant select, insert, update, delete on public.shared_chord_sheets to authenticated;

-- Each write a new revision; the owner, the link and the sheet it publishes never change.
create or replace function private.shared_chord_sheet_revised()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.id := old.id;
  new.owner := old.owner;
  new.sheet_key := old.sheet_key;
  new.revision := old.revision + 1;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists shared_chord_sheet_revised on public.shared_chord_sheets;
create trigger shared_chord_sheet_revised
  before update on public.shared_chord_sheets
  for each row execute function private.shared_chord_sheet_revised();

-- Every open copy told: the revision alone, on the sheet's topic.
create or replace function private.shared_chord_sheet_ping()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform realtime.send(
    jsonb_build_object('revision', new.revision),
    'changed',
    'chord-sheet:' || new.id::text,
    false
  );
  return null;
end;
$$;
revoke all on function private.shared_chord_sheet_ping() from public, anon, authenticated;

drop trigger if exists shared_chord_sheet_ping on public.shared_chord_sheets;
create trigger shared_chord_sheet_ping
  after insert or update on public.shared_chord_sheets
  for each row execute function private.shared_chord_sheet_ping();

-- The sheet a link names, for anyone holding the link; none for an id there is no sheet of.
create or replace function public.read_shared_chord_sheet(p_id uuid)
returns table (name text, body text, style text, tempo integer, can_edit boolean, revision bigint, mine boolean)
language sql
stable
security definer
set search_path = ''
as $$
  select s.name, s.body, s.style, s.tempo, s.can_edit, s.revision, s.owner = (select auth.uid())
  from public.shared_chord_sheets s
  where s.id = p_id;
$$;
revoke all on function public.read_shared_chord_sheet(uuid) from public;
grant execute on function public.read_shared_chord_sheet(uuid) to anon, authenticated;

-- A change through the link: its owner's, or anyone's while the owner allows editing. The last write wins; the
-- device merges bar by bar before it writes. Returns the new revision.
create or replace function public.write_shared_chord_sheet(p_id uuid, p_body text, p_style text, p_tempo integer)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare written bigint;
begin
  update public.shared_chord_sheets s
     set body = p_body, style = p_style, tempo = p_tempo
   where s.id = p_id and (s.can_edit or s.owner = (select auth.uid()))
  returning s.revision into written;
  if written is null then
    raise exception 'This sheet is view only' using errcode = '42501';
  end if;
  return written;
end;
$$;
revoke all on function public.write_shared_chord_sheet(uuid, text, text, integer) from public;
grant execute on function public.write_shared_chord_sheet(uuid, text, text, integer) to anon, authenticated;
