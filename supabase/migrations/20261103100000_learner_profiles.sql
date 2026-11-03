-- A learner's public face (round 29, B1, D12, D17): their name, a handle, a short bio and a picture,
-- private until they make it public. The synced `profiles` mirror stays the device's document; this
-- table is what other people may see: a public profile's name on published songs and in Explore.
-- Avatars stay in the private `avatars` bucket at `${userId}/…`; a public profile's are readable.

create table if not exists public.learner_profiles (
  id         uuid primary key default auth.uid() references auth.users on delete cascade,
  name       text not null default '' check (char_length(name) <= 60),
  -- Lower case only, so uniqueness is case-blind without an extension.
  handle     text unique check (handle ~ '^[a-z0-9_]{3,24}$'),
  bio        text not null default '' check (char_length(bio) <= 160),
  -- A built-in avatar's id, or the storage path of an uploaded one.
  avatar     text check (avatar is null or char_length(avatar) <= 200),
  public     boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before insert or update on public.learner_profiles
  for each row execute function public.set_updated_at();

alter table public.learner_profiles enable row level security;
grant select, insert, update on public.learner_profiles to authenticated;
grant select on public.learner_profiles to anon;

create policy own_or_public_read on public.learner_profiles for select to anon, authenticated
  using (public or id = (select auth.uid()));
create policy own_insert on public.learner_profiles for insert to authenticated
  with check (id = (select auth.uid()));
create policy own_update on public.learner_profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Whether a handle is free (Edit profile checks as the learner types): a yes or no, never whose.
create or replace function public.handle_available(wanted text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select wanted ~ '^[a-z0-9_]{3,24}$'
    and not exists (
      select 1 from public.learner_profiles p
      where p.handle = wanted and p.id <> (select auth.uid())
    );
$$;
revoke all on function public.handle_available(text) from public;
grant execute on function public.handle_available(text) to authenticated;

-- A new account starts its profile, private, with the name it signed up with.
create or replace function public.start_learner_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.learner_profiles (id, name)
  values (new.id, left(coalesce(new.raw_user_meta_data->>'name', ''), 60))
  on conflict (id) do nothing;
  return new;
end;
$$;
revoke all on function public.start_learner_profile() from public;

create trigger start_learner_profile after insert on auth.users
  for each row execute function public.start_learner_profile();

-- Accounts made before this: their profiles, private, from the names they gave.
insert into public.learner_profiles (id, name)
select u.id, left(coalesce(u.raw_user_meta_data->>'name', ''), 60) from auth.users u
on conflict (id) do nothing;

-- A public profile's avatar may be read by anyone; the owner's rules for their own stay as they are.
create policy avatars_public_read on storage.objects for select to anon, authenticated
  using (
    bucket_id = 'avatars'
    and exists (
      select 1 from public.learner_profiles p
      where p.public and p.id::text = (storage.foldername(name))[1]
    )
  );
