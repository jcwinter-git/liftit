-- Backfills the handwritten workout log from 2026-08-08 through 2026-09-07.
--
-- Written-down loads for Dumbbell Bench, Bicep Curls, Military press and RDL
-- are per-dumbbell, so they're doubled here to record the total lifted. Every
-- other exercise is entered as written. Judgement calls (variant names, one
-- ambiguous set) are recorded in that day's notes so they're visible in-app.
--
-- Safe to re-run: any date that already has a workout is skipped entirely.

-- 1. Make sure every exercise in the log exists, with the right category.
insert into exercises (user_id, name, category) values
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'Pull ups', 'Back'),
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'Pull Up L', 'Back'),
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'Split squats', 'Legs'),
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'RDL', 'Legs'),
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'Leg Raises', 'Abs'),
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'Military press', 'Shoulders'),
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'Bicep Curls', 'Arms'),
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'Pistols', 'Legs'),
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'Dumbbell Bench', 'Chest'),
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'Cossacks', 'Legs'),
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'High ROM', 'Shoulders'),
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'Super ROM', 'Shoulders'),
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'Triceps', 'Arms'),
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'Parallette Push Ups', 'Chest'),
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'Nordic Assisted', 'Legs'),
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'Calf Raises', 'Legs'),
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'Chest Cable', 'Chest'),
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'Goblet Squats', 'Legs')
on conflict (user_id, name) do update set category = excluded.category;

-- 2. Insert one workout per logged day, plus its sets.
with days(day, notes) as (
  values
    (date '2026-09-07', null::text),
    (date '2026-09-05', null),
    (date '2026-09-02', null),
    (date '2026-09-01', 'Second bicep set was hard. Nordic assisted logged as 8 reps (written down as 8x7.5).'),
    (date '2026-08-26', null),
    (date '2026-08-20', 'Calf raises were bent-knee.'),
    (date '2026-08-14', 'Butt RDL logged as RDL. Calf raise written down as ''20s, 20'' — read as 20 lbs x 20.'),
    (date '2026-08-12', 'Pull ups strict, with assist.'),
    (date '2026-08-08', 'Also deep lunge (for hip) and deep squat goblet — mobility, no sets recorded.')
),
entries(day, exercise_name, weight, reps, set_order) as (
  values
    (date '2026-09-07', 'Pull ups', null::numeric, 10, 0),
    (date '2026-09-07', 'Pull ups', null, 10, 1),
    (date '2026-09-07', 'Split squats', 30, 10, 1000),
    (date '2026-09-07', 'Split squats', 40, 10, 1001),
    (date '2026-09-07', 'RDL', 120, 8, 2000),
    (date '2026-09-07', 'RDL', 120, 8, 2001),
    (date '2026-09-07', 'Leg Raises', null, 20, 3000),
    (date '2026-09-07', 'Military press', 60, 10, 4000),
    (date '2026-09-05', 'Parallette Push Ups', null, 20, 0),
    (date '2026-09-05', 'Parallette Push Ups', null, 20, 1),
    (date '2026-09-05', 'Pistols', null, 16, 1000),
    (date '2026-09-05', 'Split squats', null, 20, 2000),
    (date '2026-09-05', 'Leg Raises', null, 20, 3000),
    (date '2026-09-02', 'Bicep Curls', 60, 10, 0),
    (date '2026-09-02', 'Triceps', 30, 20, 1000),
    (date '2026-09-02', 'Triceps', 40, 15, 1001),
    (date '2026-09-02', 'High ROM', 10, 13, 2000),
    (date '2026-09-02', 'High ROM', 10, 13, 2001),
    (date '2026-09-02', 'Cossacks', 10, 19, 3000),
    (date '2026-09-01', 'Pull Up L', null, 10, 0),
    (date '2026-09-01', 'Pull Up L', null, 2, 1),
    (date '2026-09-01', 'Pull Up L', null, 8, 2),
    (date '2026-09-01', 'Pull Up L', null, 2, 3),
    (date '2026-09-01', 'Dumbbell Bench', 90, 12, 1000),
    (date '2026-09-01', 'Dumbbell Bench', 90, 10, 1001),
    (date '2026-09-01', 'Leg Raises', null, 20, 2000),
    (date '2026-09-01', 'Leg Raises', null, 20, 2001),
    (date '2026-09-01', 'Bicep Curls', 60, 10, 3000),
    (date '2026-09-01', 'Bicep Curls', 60, 8, 3001),
    (date '2026-09-01', 'Military press', 60, 7, 4000),
    (date '2026-09-01', 'Military press', 50, 5, 4001),
    (date '2026-09-01', 'RDL', 60, 8, 5000),
    (date '2026-09-01', 'Nordic Assisted', null, 8, 6000),
    (date '2026-08-26', 'Pull ups', null, 12, 0),
    (date '2026-08-26', 'Pull ups', null, 10, 1),
    (date '2026-08-26', 'Dumbbell Bench', 90, 12, 1000),
    (date '2026-08-26', 'Bicep Curls', 60, 8, 2000),
    (date '2026-08-26', 'Bicep Curls', 60, 8, 2001),
    (date '2026-08-26', 'Leg Raises', null, 20, 3000),
    (date '2026-08-26', 'Leg Raises', null, 20, 3001),
    (date '2026-08-26', 'Military press', 60, 8, 4000),
    (date '2026-08-26', 'Military press', 50, 8, 4001),
    (date '2026-08-26', 'RDL', 60, 10, 5000),
    (date '2026-08-20', 'Pull ups', null, 10, 0),
    (date '2026-08-20', 'Pull ups', null, 10, 1),
    (date '2026-08-20', 'Bicep Curls', 60, 9, 1000),
    (date '2026-08-20', 'Bicep Curls', 60, 8, 1001),
    (date '2026-08-20', 'Military press', 60, 10, 2000),
    (date '2026-08-20', 'Military press', 60, 6, 2001),
    (date '2026-08-20', 'Dumbbell Bench', 90, 8, 3000),
    (date '2026-08-20', 'Dumbbell Bench', 90, 9, 3001),
    (date '2026-08-20', 'RDL', 60, 8, 4000),
    (date '2026-08-20', 'RDL', 60, 8, 4001),
    (date '2026-08-20', 'Calf Raises', null, 20, 5000),
    (date '2026-08-20', 'Calf Raises', null, 15, 5001),
    (date '2026-08-14', 'Super ROM', 10, 15, 0),
    (date '2026-08-14', 'Bicep Curls', 45, 9, 1000),
    (date '2026-08-14', 'Bicep Curls', 60, 8, 1001),
    (date '2026-08-14', 'RDL', 40, 10, 2000),
    (date '2026-08-14', 'RDL', 60, 8, 2001),
    (date '2026-08-14', 'Calf Raises', 20, 20, 3000),
    (date '2026-08-14', 'Chest Cable', 35, 9, 4000),
    (date '2026-08-14', 'Chest Cable', 35, 10, 4001),
    (date '2026-08-14', 'Leg Raises', null, 20, 5000),
    (date '2026-08-12', 'Bicep Curls', 60, 10, 0),
    (date '2026-08-12', 'RDL', 40, 10, 1000),
    (date '2026-08-12', 'Pull ups', null, 13, 2000),
    (date '2026-08-12', 'Pull ups', null, 6, 2001),
    (date '2026-08-12', 'Goblet Squats', 20, 15, 3000),
    (date '2026-08-12', 'Goblet Squats', 20, 10, 3001),
    (date '2026-08-12', 'Cossacks', 20, 10, 4000),
    (date '2026-08-12', 'Cossacks', 20, 10, 4001),
    (date '2026-08-12', 'Military press', 60, 8, 5000),
    (date '2026-08-12', 'Military press', 40, 10, 5001),
    (date '2026-08-08', 'Super ROM', 10, 15, 0),
    (date '2026-08-08', 'Bicep Curls', 60, 8, 1000),
    (date '2026-08-08', 'RDL', 60, 8, 2000),
    (date '2026-08-08', 'Cossacks', 10, 16, 3000)
),
new_workouts as (
  insert into workouts (user_id, date, notes)
  select '934104f9-ff51-4cb9-b568-52f7aba83652'::uuid, d.day, d.notes
  from days d
  where not exists (
    select 1 from workouts w
    where w.user_id = '934104f9-ff51-4cb9-b568-52f7aba83652' and w.date = d.day
  )
  returning id, date
)
insert into sets (workout_id, exercise_id, weight, reps, set_order)
select nw.id, ex.id, e.weight, e.reps, e.set_order
from entries e
join new_workouts nw on nw.date = e.day
join exercises ex on ex.user_id = '934104f9-ff51-4cb9-b568-52f7aba83652' and ex.name = e.exercise_name;
