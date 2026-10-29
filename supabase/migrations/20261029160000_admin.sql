-- Admin (ADR 0116, round 5): roles in app_metadata, written only by the service role; the first admin from
-- admin_bootstrap (filled by SQL, never in a migration, so no address is in the repo); groups, feature switches
-- and the admins' activity log, all read and written by admins only. No drop statements: the objects are new.

create or replace function public.is_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)
$$;

create table if not exists public.admin_bootstrap (
  email text primary key check (email = lower(email))
);
alter table public.admin_bootstrap enable row level security;

-- A new account whose address is listed becomes an admin.
create or replace function public.bootstrap_admin()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if exists (select 1 from public.admin_bootstrap where email = lower(new.email)) then
    new.raw_app_meta_data := coalesce(new.raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb;
  end if;
  return new;
end;
$$;

create trigger bootstrap_admin
  before insert on auth.users
  for each row execute function public.bootstrap_admin();

create table if not exists public.groups (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique check (length(name) between 1 and 80),
  created_at timestamptz not null default now()
);

create table if not exists public.group_members (
  group_id uuid not null references public.groups on delete cascade,
  user_id  uuid not null references auth.users on delete cascade,
  added_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

create table if not exists public.feature_switches (
  key        text primary key check (key ~ '^[a-z][a-z0-9-]{1,40}$'),
  label      text not null check (length(label) between 1 and 120),
  state      text not null default 'nobody' check (state in ('everyone', 'nobody', 'groups')),
  groups     uuid[] not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_log (
  id       bigint generated always as identity primary key,
  at       timestamptz not null default now(),
  admin_id uuid references auth.users on delete set null,
  action   text not null,
  target   text not null default '',
  detail   jsonb not null default '{}'::jsonb
);
create index if not exists admin_log_at_idx on public.admin_log (at desc);

alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.feature_switches enable row level security;
alter table public.admin_log enable row level security;

grant select, insert, update, delete on public.groups to authenticated;
grant select, insert, delete on public.group_members to authenticated;
grant select, insert, update, delete on public.feature_switches to authenticated;
grant select, insert on public.admin_log to authenticated;

create policy admins on public.groups for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy admins on public.group_members for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy admins on public.feature_switches for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy admins_read on public.admin_log for select to authenticated
  using ((select public.is_admin()));
create policy admins_write on public.admin_log for insert to authenticated
  with check ((select public.is_admin()) and admin_id = (select auth.uid()));

-- The switches on for the caller: on for everyone, or for a group they are in.
create or replace function public.my_features()
returns setof text
language sql
stable
security definer
set search_path = ''
as $$
  select key from public.feature_switches
  where state = 'everyone'
     or (state = 'groups' and exists (
       select 1 from public.group_members
       where user_id = (select auth.uid()) and group_id = any (feature_switches.groups)
     ))
$$;

revoke execute on function public.bootstrap_admin() from public, anon, authenticated;
grant execute on function public.my_features() to anon, authenticated;

-- Applied in two steps (admin_roles_and_bootstrap, admin_groups_switches_log). admin_bootstrap has no policy on
-- purpose: no client reads it. my_features is open to all: it returns switch keys only.
