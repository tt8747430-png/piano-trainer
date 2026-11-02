-- Content as data (ADR 0116 r25): the catalog's own order is content, kept whole. `catalog` `courses`
-- holds the courses' ids in the order Manage courses dragged them, read within each course's shelf.
alter table public.content_items drop constraint if exists content_items_kind_check;
alter table public.content_items add constraint content_items_kind_check
  check (kind in ('piece', 'lesson', 'course', 'journey', 'catalog', 'pattern', 'progression', 'exercise', 'book'));
