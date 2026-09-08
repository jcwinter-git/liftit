-- Restores auth-only access, reverting the dev-only bypass from
-- 0002/0005. Run this before treating the app as a real, live site.

alter table exercises alter column user_id set default auth.uid();
alter table workouts alter column user_id set default auth.uid();

drop policy if exists "exercises are owned by user or anon (dev)" on exercises;
drop policy if exists "exercises are owned by user" on exercises;
create policy "exercises are owned by user" on exercises
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "workouts are owned by user or anon (dev)" on workouts;
drop policy if exists "workouts are owned by user" on workouts;
create policy "workouts are owned by user" on workouts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "sets are owned via workout or anon (dev)" on sets;
drop policy if exists "sets are owned via workout" on sets;
create policy "sets are owned via workout" on sets
  for all using (
    exists (
      select 1 from workouts
      where workouts.id = sets.workout_id
      and workouts.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from workouts
      where workouts.id = sets.workout_id
      and workouts.user_id = auth.uid()
    )
  );
