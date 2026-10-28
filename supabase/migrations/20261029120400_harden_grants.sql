-- Grants the security advisor flags on a new project, closed (memory-palaces' 2026-10-28 migration).
-- The dashboard's `rls_auto_enable` helper, where the project has it, runs from its event trigger and
-- is no RPC endpoint.
do $$
begin
  if exists (
    select 1 from pg_proc join pg_namespace on pg_namespace.oid = pg_proc.pronamespace
    where nspname = 'public' and proname = 'rls_auto_enable'
  ) then
    revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
  end if;
end $$;

revoke execute on function public.set_updated_at() from public, anon, authenticated;
