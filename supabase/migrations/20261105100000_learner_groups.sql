-- Learner groups and the folders shared with them (R30 S6, ADR 0106): a learner with an account makes a group (a
-- class, a choir, a band), invites people by a link, and shares any of their folders with it, each group able to view
-- or to edit. Nothing here is public: a group and what is shared with it are its members' alone.
--
-- A shared folder is a copy kept current by its owner's device: its name and look, and its songs (a built-in song by
-- its id, a learner's own song whole), written as the owner's folder changes. A member who may edit writes it too.

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create table if not exists public.learner_groups (
  id          uuid primary key default gen_random_uuid(),
  owner       uuid not null default auth.uid() references auth.users on delete cascade,
  name        text not null check (char_length(btrim(name)) between 1 and 60),
  picture     text not null default 'users' check (picture ~ '^[a-z-]{1,20}$'),
  paint       text not null default 'lilac' check (paint in ('sand', 'yellow', 'grass', 'sky', 'lilac')),
  -- The invite link's code: 80 random bits. Turning the link off stops new joins; members stay.
  invite_code text not null unique default substr(replace(gen_random_uuid()::text, '-', ''), 1, 20),
  invite_open boolean not null default true,
  created_at  timestamptz not null default now()
);
create index if not exists learner_groups_owner_idx on public.learner_groups (owner);

create table if not exists public.learner_group_members (
  group_id  uuid not null references public.learner_groups on delete cascade,
  user_id   uuid not null references auth.users on delete cascade,
  -- The name the member is shown by, their profile's when they joined.
  name      text not null default '' check (char_length(name) <= 80),
  role      text not null default 'member' check (role in ('owner', 'member')),
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);
create index if not exists learner_group_members_user_idx on public.learner_group_members (user_id);

create table if not exists public.shared_folders (
  id         uuid primary key default gen_random_uuid(),
  group_id   uuid not null references public.learner_groups on delete cascade,
  owner      uuid not null default auth.uid() references auth.users on delete cascade,
  -- The owner's own folder it copies (`folder-3`, a collection's id).
  folder_key text not null check (char_length(folder_key) between 1 and 64),
  name       text not null check (char_length(btrim(name)) between 1 and 80),
  picture    text not null check (picture ~ '^[a-z-]{1,20}$'),
  paint      text not null check (paint in ('sand', 'yellow', 'grass', 'sky', 'lilac')),
  can_edit   boolean not null default false,
  songs      jsonb not null default '[]'::jsonb
               check (jsonb_typeof(songs) = 'array' and pg_column_size(songs) < 2000000),
  updated_at timestamptz not null default now(),
  updated_by uuid default auth.uid() references auth.users on delete set null,
  unique (group_id, owner, folder_key)
);
create index if not exists shared_folders_group_idx on public.shared_folders (group_id);
create index if not exists shared_folders_owner_idx on public.shared_folders (owner);

-- Whether the one asking belongs to the group, or owns it. Definer functions in an unexposed schema: the policies
-- below read the members table through them, never through its own policy (which would recurse).
create or replace function private.is_group_member(p_group uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.learner_group_members m
    where m.group_id = p_group and m.user_id = (select auth.uid())
  );
$$;

create or replace function private.is_group_owner(p_group uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.learner_groups g where g.id = p_group and g.owner = (select auth.uid())
  );
$$;

revoke execute on function private.is_group_member(uuid) from public, anon;
revoke execute on function private.is_group_owner(uuid) from public, anon;
grant execute on function private.is_group_member(uuid) to authenticated;
grant execute on function private.is_group_owner(uuid) to authenticated;

-- A group's maker is its first member, its owner.
create or replace function private.add_group_owner()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.learner_group_members (group_id, user_id, name, role)
  values (
    new.id,
    new.owner,
    coalesce((select p.name from public.learner_profiles p where p.id = new.owner), ''),
    'owner'
  );
  return new;
end;
$$;
revoke execute on function private.add_group_owner() from public, anon, authenticated;

create trigger add_group_owner after insert on public.learner_groups
  for each row execute function private.add_group_owner();

-- What a member who may edit can change of a shared folder: its songs, name and look, never whose it is, which group
-- has it or whether others may edit. Each write says when and by whom.
create or replace function private.guard_shared_folder()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if old.owner <> (select auth.uid()) then
    new.owner := old.owner;
    new.group_id := old.group_id;
    new.folder_key := old.folder_key;
    new.can_edit := old.can_edit;
  end if;
  new.updated_at := now();
  new.updated_by := (select auth.uid());
  return new;
end;
$$;
revoke execute on function private.guard_shared_folder() from public, anon;

create trigger guard_shared_folder before update on public.shared_folders
  for each row execute function private.guard_shared_folder();

alter table public.learner_groups enable row level security;
alter table public.learner_group_members enable row level security;
alter table public.shared_folders enable row level security;

revoke all on public.learner_groups, public.learner_group_members, public.shared_folders from anon;
grant select, insert, update, delete on public.learner_groups to authenticated;
grant select, delete on public.learner_group_members to authenticated;
grant select, insert, update, delete on public.shared_folders to authenticated;

-- Groups: its members read it; its owner makes, renames and deletes it.
create policy members_read on public.learner_groups for select to authenticated
  using ((select private.is_group_member(id)));
create policy owner_makes on public.learner_groups for insert to authenticated
  with check (owner = (select auth.uid()));
create policy owner_changes on public.learner_groups for update to authenticated
  using (owner = (select auth.uid()))
  with check (owner = (select auth.uid()));
create policy owner_deletes on public.learner_groups for delete to authenticated
  using (owner = (select auth.uid()));

-- Members: the group's members see each other; a member leaves (never its owner: the owner deletes the group), the
-- owner removes anyone else. Joining is `join_learner_group`'s alone.
create policy members_read on public.learner_group_members for select to authenticated
  using ((select private.is_group_member(group_id)));
create policy leave_or_remove on public.learner_group_members for delete to authenticated
  using (
    (user_id = (select auth.uid()) and role = 'member')
    or (role = 'member' and (select private.is_group_owner(group_id)))
  );

-- Shared folders: the group's members read them; a member shares their own; its owner, or a member while it may be
-- edited, writes it; its owner or the group's owner takes it away.
create policy members_read on public.shared_folders for select to authenticated
  using ((select private.is_group_member(group_id)));
create policy member_shares on public.shared_folders for insert to authenticated
  with check (owner = (select auth.uid()) and (select private.is_group_member(group_id)));
create policy owner_or_editor_writes on public.shared_folders for update to authenticated
  using (
    owner = (select auth.uid())
    or (can_edit and (select private.is_group_member(group_id)))
  )
  with check ((select private.is_group_member(group_id)));
create policy owner_unshares on public.shared_folders for delete to authenticated
  using (owner = (select auth.uid()) or (select private.is_group_owner(group_id)));

-- An invite link's group, read before joining it: its name and how many it has. Nothing while the link is off.
create or replace function public.learner_group_invite(p_code text)
returns table (id uuid, name text, members integer)
language sql
stable
security definer
set search_path = ''
as $$
  select g.id, g.name, (select count(*)::integer from public.learner_group_members m where m.group_id = g.id)
  from public.learner_groups g
  where (select auth.uid()) is not null and g.invite_code = p_code and g.invite_open;
$$;
revoke execute on function public.learner_group_invite(text) from public, anon;
grant execute on function public.learner_group_invite(text) to authenticated;

-- Joins the group an open invite link names, as its profile's name; joining twice changes nothing. The group's id.
create or replace function public.join_learner_group(p_code text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  joined uuid;
  me uuid := (select auth.uid());
begin
  if me is null then
    raise exception 'not signed in' using errcode = '42501';
  end if;
  select g.id into joined from public.learner_groups g where g.invite_code = p_code and g.invite_open;
  if joined is null then
    raise exception 'no such open invite' using errcode = 'P0002';
  end if;
  insert into public.learner_group_members (group_id, user_id, name)
  values (joined, me, coalesce((select p.name from public.learner_profiles p where p.id = me), ''))
  on conflict do nothing;
  return joined;
end;
$$;
revoke execute on function public.join_learner_group(text) from public, anon;
grant execute on function public.join_learner_group(text) to authenticated;
