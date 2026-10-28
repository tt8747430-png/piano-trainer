-- Deleting an account (ADR 0116, memory-palaces' ADR 0004): requesting it schedules a purge 30 days
-- out, cancellable by signing in. The row is the whole record: readable and cancellable by its owner,
-- written only by the `request-account-deletion` Edge Function, which also signs every device out.

create table if not exists public.account_deletions (
  user_id      uuid primary key references auth.users on delete cascade,
  requested_at timestamptz not null default now(),
  purge_after  timestamptz not null
);

create index if not exists account_deletions_due_idx on public.account_deletions (purge_after);

alter table public.account_deletions enable row level security;
grant select, delete on public.account_deletions to authenticated;
revoke all on public.account_deletions from anon;

drop policy if exists own_select on public.account_deletions;
create policy own_select on public.account_deletions for select to authenticated
  using (user_id = (select auth.uid()));
drop policy if exists own_delete on public.account_deletions;
create policy own_delete on public.account_deletions for delete to authenticated
  using (user_id = (select auth.uid()));

-- The daily sweep: pg_cron calls the `purge-account` Edge Function through pg_net, with the
-- project's URL and secret key read from Vault (`project_url`, `secret_key`), so no secret is in
-- this file. Until both are stored the job logs a notice and does nothing.
create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;

create or replace function public.invoke_purge_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  project_url text;
  secret_key text;
begin
  select decrypted_secret into project_url from vault.decrypted_secrets where name = 'project_url';
  select decrypted_secret into secret_key from vault.decrypted_secrets where name = 'secret_key';
  if project_url is null or secret_key is null then
    raise notice 'invoke_purge_account: project_url / secret_key not in Vault; skipping';
    return;
  end if;
  perform net.http_post(
    url := project_url || '/functions/v1/purge-account',
    headers := jsonb_build_object('Content-Type', 'application/json', 'apikey', secret_key),
    body := '{}'::jsonb
  );
end;
$$;

revoke execute on function public.invoke_purge_account() from public, anon, authenticated;

do $$
begin
  perform cron.unschedule('purge-accounts');
exception when others then
  null;
end $$;

select cron.schedule('purge-accounts', '41 3 * * *', $$select public.invoke_purge_account();$$);
