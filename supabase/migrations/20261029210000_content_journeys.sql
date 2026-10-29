-- Content as data (ADR 0116 r15): a journey is content, kept whole (its chapters and their steps in order).
alter table public.content_items drop constraint if exists content_items_kind_check;
alter table public.content_items add constraint content_items_kind_check
  check (kind in ('piece', 'lesson', 'course', 'journey', 'pattern', 'progression', 'exercise', 'book'));
