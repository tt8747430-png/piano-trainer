-- The API roles are granted functions apart from `public`: the profile trigger's function is no
-- one's to call, and the handle check is a signed-in learner's alone.
revoke execute on function public.start_learner_profile() from anon, authenticated;
revoke execute on function public.handle_available(text) from anon;
