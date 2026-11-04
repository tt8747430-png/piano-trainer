-- Explore's ratings (R29 B3): who rated what is no guest's to read. Supabase grants new tables to
-- anon by default; RLS already showed it no row, and now the privilege itself is refused, as for
-- every learner's own table. The average and count stay public through `public_item_ratings`.
revoke all on public.public_ratings from anon;
