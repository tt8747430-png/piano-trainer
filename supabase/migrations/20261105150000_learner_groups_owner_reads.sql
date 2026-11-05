-- A group's maker reads it from the moment it is made (R32-C). Making a group returns its row (`insert … returning`),
-- and the SELECT policy is checked on that row as it is inserted, before the trigger that adds its maker as its first
-- member has run: read by membership alone, every new group failed with "new row violates row-level security policy".
-- Its owner reads it as its owner; everyone else as a member.

alter policy members_read on public.learner_groups
  using (owner = (select auth.uid()) or (select private.is_group_member(id)));
