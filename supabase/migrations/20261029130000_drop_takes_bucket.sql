-- Takes are MIDI notes in the learner's `takes` document, never audio (ADR 0116): their bucket's
-- policies go, so nothing can reach it. The empty bucket itself can only be removed through the
-- Storage API (Dashboard → Storage), which the owner does once. `avatars` stays.
do $$
declare verb text;
begin
  foreach verb in array array['read','insert','update','delete']
  loop
    execute format('drop policy if exists "takes_%s" on storage.objects;', verb);
  end loop;
end $$;
