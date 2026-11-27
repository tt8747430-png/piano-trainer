-- Every foreign key gets a covering index (Supabase's database advisor, "unindexed foreign keys", 2026-11-27):
-- without one, deleting a user (account deletion cascades through these) or joining on the key scans the
-- whole table. Each index covers exactly the key's column.

create index if not exists admin_log_admin_id_idx on public.admin_log (admin_id);
create index if not exists content_drafts_updated_by_idx on public.content_drafts (updated_by);
create index if not exists error_reports_user_id_idx on public.error_reports (user_id);
create index if not exists group_members_user_id_idx on public.group_members (user_id);
create index if not exists public_reports_reporter_id_idx on public.public_reports (reporter_id);
create index if not exists public_saves_user_id_idx on public.public_saves (user_id);
create index if not exists shared_folders_updated_by_idx on public.shared_folders (updated_by);
