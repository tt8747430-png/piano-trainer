-- The Public library takes learners' patterns as well as songs (ADR 0116, round 9): an own pattern's name and its
-- two figures, a small body.
alter table public.public_items drop constraint if exists public_items_kind_check;
alter table public.public_items add constraint public_items_kind_check check (kind in ('song', 'pattern'));
create index if not exists public_items_kind_idx on public.public_items (kind, published_at desc) where not hidden;
