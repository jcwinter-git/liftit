-- TEMPORARY dev-only migration: lets the app work with no Supabase Auth session
-- at all, so you can browse locally without hitting the magic-link email rate
-- limit. New rows still attribute to your real account (fixed user id below).
--
-- Revert before deploying anywhere public — this allows anonymous (no-session)
-- read/write access to your data. Run supabase/migrations/0003_restore_auth_only_access.sql
-- (create it when you're ready) or just re-run the relevant parts of 0001_init.sql's
-- policy definitions to lock it back down once you have real email/SMTP set up.

alter table exercises alter column user_id
  set default coalesce(auth.uid(), '934104f9-ff51-4cb9-b568-52f7aba83652'::uuid);
alter table workouts alter column user_id
  set default coalesce(auth.uid(), '934104f9-ff51-4cb9-b568-52f7aba83652'::uuid);

drop policy "exercises are owned by user" on exercises;
create policy "exercises are owned by user or anon (dev)" on exercises
  for all
  using (auth.uid() = user_id or auth.uid() is null)
  with check (auth.uid() = user_id or auth.uid() is null);

drop policy "workouts are owned by user" on workouts;
create policy "workouts are owned by user or anon (dev)" on workouts
  for all
  using (auth.uid() = user_id or auth.uid() is null)
  with check (auth.uid() = user_id or auth.uid() is null);

drop policy "sets are owned via workout" on sets;
create policy "sets are owned via workout or anon (dev)" on sets
  for all
  using (
    exists (
      select 1 from workouts
      where workouts.id = sets.workout_id
      and (workouts.user_id = auth.uid() or auth.uid() is null)
    )
  )
  with check (
    exists (
      select 1 from workouts
      where workouts.id = sets.workout_id
      and (workouts.user_id = auth.uid() or auth.uid() is null)
    )
  );
