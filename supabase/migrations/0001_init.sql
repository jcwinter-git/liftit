-- LiftIt schema: exercises, workouts, sets. All scoped per-user via RLS.

create table exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create table workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  date date not null,
  notes text,
  created_at timestamptz not null default now()
);

create table sets (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid not null references workouts(id) on delete cascade,
  exercise_id uuid not null references exercises(id) on delete restrict,
  weight numeric,
  reps integer not null,
  set_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index sets_workout_id_idx on sets(workout_id);
create index sets_exercise_id_idx on sets(exercise_id);
create index workouts_user_id_date_idx on workouts(user_id, date desc);

alter table exercises enable row level security;
alter table workouts enable row level security;
alter table sets enable row level security;

create policy "exercises are owned by user" on exercises
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "workouts are owned by user" on workouts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- sets have no user_id column directly; ownership is derived through the parent workout
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
