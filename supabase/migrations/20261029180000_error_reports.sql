-- What went wrong on learners' devices (ADR 0116, round 7): a report a screen's error or an uncaught one sends,
-- written by anyone (signed in or not), read by admins alone. Each field is bounded; past a hundred reports a
-- minute, from everyone, the rest are dropped, so a loop on many devices cannot flood the table.

create table if not exists public.error_reports (
  id       uuid primary key default gen_random_uuid(),
  at       timestamptz not null default now(),
  message  text not null check (char_length(message) between 1 and 1000),
  stack    text not null default '' check (char_length(stack) <= 8000),
  path     text not null default '' check (char_length(path) <= 500),
  build    text not null default '' check (char_length(build) <= 100),
  agent    text not null default '' check (char_length(agent) <= 500),
  user_id  uuid references auth.users on delete set null default auth.uid()
);

create index if not exists error_reports_at on public.error_reports (at desc);

alter table public.error_reports enable row level security;
grant insert on public.error_reports to anon, authenticated;
grant select on public.error_reports to authenticated;

create policy report on public.error_reports for insert to anon, authenticated
  with check (user_id is null or user_id = (select auth.uid()));
create policy admins_read on public.error_reports for select to authenticated
  using ((select public.is_admin()));

-- Drops a report past the minute's cap: the reporter is never told (a report is fire and forget).
create or replace function public.cap_error_reports()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select count(*) from public.error_reports where at > now() - interval '1 minute') >= 100 then
    return null;
  end if;
  return new;
end;
$$;

revoke execute on function public.cap_error_reports() from public, anon, authenticated;

create trigger cap_error_reports
  before insert on public.error_reports
  for each row execute function public.cap_error_reports();
