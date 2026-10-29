-- Error reports are kept 90 days (ADR 0116, round 12): pg_cron clears older ones each night at 03:17 UTC.
-- Scheduling again under the same name replaces the job, so the migration can run twice.
create extension if not exists pg_cron;

select cron.schedule(
  'purge-old-error-reports',
  '17 3 * * *',
  $$delete from public.error_reports where at < now() - interval '90 days'$$
);
