-- Consolidated catch-up migration. Safe to run regardless of whether
-- 0002/0003/0004 already partially applied — every step checks state first.
-- Supersedes 0002_dev_open_access.sql, 0003_exercise_categories.sql, and
-- 0004_exercise_category_refinements.sql; you only need to run this one.

-- 1. Dev-only: allow the app to work with no Supabase Auth session, so it's
--    usable locally without hitting the magic-link email rate limit.
alter table exercises alter column user_id
  set default coalesce(auth.uid(), '934104f9-ff51-4cb9-b568-52f7aba83652'::uuid);
alter table workouts alter column user_id
  set default coalesce(auth.uid(), '934104f9-ff51-4cb9-b568-52f7aba83652'::uuid);

drop policy if exists "exercises are owned by user" on exercises;
drop policy if exists "exercises are owned by user or anon (dev)" on exercises;
create policy "exercises are owned by user or anon (dev)" on exercises
  for all
  using (auth.uid() = user_id or auth.uid() is null)
  with check (auth.uid() = user_id or auth.uid() is null);

drop policy if exists "workouts are owned by user" on workouts;
drop policy if exists "workouts are owned by user or anon (dev)" on workouts;
create policy "workouts are owned by user or anon (dev)" on workouts
  for all
  using (auth.uid() = user_id or auth.uid() is null)
  with check (auth.uid() = user_id or auth.uid() is null);

drop policy if exists "sets are owned via workout" on sets;
drop policy if exists "sets are owned via workout or anon (dev)" on sets;
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

-- 2. Exercise category column + constraint (Arms/Back/Chest/Legs/Shoulders/Abs/Other)
alter table exercises add column if not exists category text not null default 'Other';

do $$
declare
  con record;
begin
  for con in
    select conname from pg_constraint
    where conrelid = 'exercises'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%category%'
  loop
    execute format('alter table exercises drop constraint %I', con.conname);
  end loop;
end $$;

alter table exercises add constraint exercises_category_check
  check (category in ('Arms', 'Back', 'Chest', 'Legs', 'Shoulders', 'Abs', 'Other'));

-- 3. Seed / refine the exercise list per your feedback
insert into exercises (user_id, name, category) values
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'Pull ups', 'Back'),
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'Split squats', 'Legs'),
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'RDL', 'Legs'),
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'Military press', 'Shoulders'),
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'Bicep Curls', 'Arms'),
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'Leg Raises', 'Abs'),
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'Pistols', 'Legs'),
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'Dumbbell Bench', 'Chest'),
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'Cossacks', 'Legs'),
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'High ROM', 'Shoulders')
on conflict (user_id, name) do update set category = excluded.category;

-- Clean up a stray "Biceps" row if an earlier partial run created it
delete from exercises
  where user_id = '934104f9-ff51-4cb9-b568-52f7aba83652' and name = 'Biceps';
