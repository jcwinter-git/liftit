import { supabase } from "@/lib/supabase";
import type { Exercise, ExerciseCategory, SaveWorkoutInput } from "@/lib/types";
import {
  groupSetsByWorkout,
  statsFromWorkouts,
  type ExerciseStats,
  type SetLike,
  type WorkoutVolume,
} from "@/lib/volume";

export async function fetchExercises(): Promise<Exercise[]> {
  const { data, error } = await supabase
    .from("exercises")
    .select("id, name, category")
    .order("name");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createExercise(
  name: string,
  category: ExerciseCategory,
): Promise<Exercise> {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Exercise name is required");

  const { data, error } = await supabase
    .from("exercises")
    .upsert({ name: trimmed, category }, { onConflict: "user_id,name" })
    .select("id, name, category")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function saveWorkout(input: SaveWorkoutInput): Promise<string> {
  if (!input.date) throw new Error("Date is required");
  const validBlocks = input.blocks.filter(
    (b) => b.exerciseId && b.sets.length > 0,
  );
  if (validBlocks.length === 0) {
    throw new Error("Add at least one exercise with a set");
  }

  const { data: workout, error: workoutError } = await supabase
    .from("workouts")
    .insert({ date: input.date, notes: input.notes?.trim() || null })
    .select("id")
    .single();

  if (workoutError) throw new Error(workoutError.message);

  const setRows = validBlocks.flatMap((block, blockIdx) =>
    block.sets.map((set, setIdx) => ({
      workout_id: workout.id,
      exercise_id: block.exerciseId,
      weight: set.weight,
      reps: set.reps,
      set_order: blockIdx * 1000 + setIdx,
    })),
  );

  const { error: setsError } = await supabase.from("sets").insert(setRows);
  if (setsError) throw new Error(setsError.message);

  return workout.id;
}

export async function deleteWorkout(id: string): Promise<void> {
  const { error } = await supabase.from("workouts").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export type WorkoutListItem = {
  id: string;
  date: string;
  notes: string | null;
  sets: { exercise: { name: string } | null }[];
};

export async function fetchWorkouts(): Promise<WorkoutListItem[]> {
  const { data, error } = await supabase
    .from("workouts")
    .select("id, date, notes, sets(exercise:exercises(name))")
    .order("date", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as unknown as WorkoutListItem[]) ?? [];
}

export type WorkoutSetRow = {
  id: string;
  weight: number | null;
  reps: number;
  set_order: number;
  exercise: { id: string; name: string; category: ExerciseCategory } | null;
};

export type WorkoutDetail = {
  id: string;
  date: string;
  notes: string | null;
  sets: WorkoutSetRow[];
};

export async function fetchWorkout(id: string): Promise<WorkoutDetail | null> {
  const { data, error } = await supabase
    .from("workouts")
    .select(
      "id, date, notes, sets(id, weight, reps, set_order, exercise:exercises(id, name, category))",
    )
    .eq("id", id)
    .single();
  if (error) return null;
  return data as unknown as WorkoutDetail;
}

// Replaces a workout's sets. New rows go in before the old ones come out, so a
// failure part-way leaves duplicates (recoverable) rather than losing sets.
export async function updateWorkout(
  id: string,
  input: SaveWorkoutInput,
): Promise<void> {
  if (!input.date) throw new Error("Date is required");
  const validBlocks = input.blocks.filter(
    (b) => b.exerciseId && b.sets.length > 0,
  );
  if (validBlocks.length === 0) {
    throw new Error("Add at least one exercise with a set");
  }

  const { data: existing, error: existingError } = await supabase
    .from("sets")
    .select("id")
    .eq("workout_id", id);
  if (existingError) throw new Error(existingError.message);

  const { error: workoutError } = await supabase
    .from("workouts")
    .update({ date: input.date, notes: input.notes?.trim() || null })
    .eq("id", id);
  if (workoutError) throw new Error(workoutError.message);

  const setRows = validBlocks.flatMap((block, blockIdx) =>
    block.sets.map((set, setIdx) => ({
      workout_id: id,
      exercise_id: block.exerciseId,
      weight: set.weight,
      reps: set.reps,
      set_order: blockIdx * 1000 + setIdx,
    })),
  );

  const { error: insertError } = await supabase.from("sets").insert(setRows);
  if (insertError) throw new Error(insertError.message);

  const oldIds = (existing ?? []).map((s) => s.id as string);
  if (oldIds.length > 0) {
    const { error: deleteError } = await supabase
      .from("sets")
      .delete()
      .in("id", oldIds);
    if (deleteError) throw new Error(deleteError.message);
  }
}

// Per-day training load for the activity grid: weighted volume plus raw reps
// for bodyweight sets, keyed by workout date.
export async function fetchDailyLoad(): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from("sets")
    .select("weight, reps, workout:workouts(date)");
  if (error) throw new Error(error.message);

  const rows =
    (data as unknown as {
      weight: number | null;
      reps: number;
      workout: { date: string } | null;
    }[]) ?? [];

  const byDate: Record<string, number> = {};
  for (const row of rows) {
    if (!row.workout) continue;
    const load = row.weight != null ? row.weight * row.reps : row.reps;
    byDate[row.workout.date] = (byDate[row.workout.date] ?? 0) + load;
  }
  return byDate;
}

export async function fetchWorkoutDates(): Promise<string[]> {
  const { data, error } = await supabase
    .from("workouts")
    .select("date")
    .order("date", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((w) => w.date as string);
}

export async function fetchExercise(id: string): Promise<Exercise | null> {
  const { data, error } = await supabase
    .from("exercises")
    .select("id, name, category")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

export type ExerciseSetRow = {
  id: string;
  weight: number | null;
  reps: number;
  workout: { id: string; date: string } | null;
};

export async function fetchExerciseSets(id: string): Promise<ExerciseSetRow[]> {
  const { data, error } = await supabase
    .from("sets")
    .select("id, weight, reps, workout:workouts(id, date)")
    .eq("exercise_id", id);
  if (error) throw new Error(error.message);
  return (data as unknown as ExerciseSetRow[]) ?? [];
}

// Previous and best-ever single-workout volume for every exercise, in one
// query, so the new-workout form can show history without a request per block.
export async function fetchExerciseVolumeStats(): Promise<
  Record<string, ExerciseStats>
> {
  const { data, error } = await supabase
    .from("sets")
    .select("exercise_id, weight, reps, workout:workouts(id, date)");
  if (error) throw new Error(error.message);

  const rows = (data as unknown as (SetLike & { exercise_id: string })[]) ?? [];

  const byExercise = new Map<string, SetLike[]>();
  for (const row of rows) {
    const list = byExercise.get(row.exercise_id);
    if (list) list.push(row);
    else byExercise.set(row.exercise_id, [row]);
  }

  const stats: Record<string, ExerciseStats> = {};
  for (const [exerciseId, sets] of byExercise) {
    stats[exerciseId] = statsFromWorkouts(groupSetsByWorkout(sets));
  }
  return stats;
}

export type ExerciseHistory = {
  exercise: Exercise;
  entries: WorkoutVolume[];
  workoutCount: number;
};

// Every exercise's per-workout history in one query, ordered by how often the
// exercise shows up so the charts can lead with what's actually trained most.
export async function fetchExerciseHistories(): Promise<ExerciseHistory[]> {
  const { data, error } = await supabase
    .from("sets")
    .select(
      "weight, reps, exercise:exercises(id, name, category), workout:workouts(id, date)",
    );
  if (error) throw new Error(error.message);

  const rows =
    (data as unknown as (SetLike & { exercise: Exercise | null })[]) ?? [];

  const byExercise = new Map<string, { exercise: Exercise; sets: SetLike[] }>();
  for (const row of rows) {
    if (!row.exercise) continue;
    const found = byExercise.get(row.exercise.id);
    if (found) found.sets.push(row);
    else byExercise.set(row.exercise.id, { exercise: row.exercise, sets: [row] });
  }

  return Array.from(byExercise.values())
    .map(({ exercise, sets }) => {
      const entries = groupSetsByWorkout(sets);
      return { exercise, entries, workoutCount: entries.length };
    })
    .sort(
      (a, b) =>
        b.workoutCount - a.workoutCount ||
        a.exercise.name.localeCompare(b.exercise.name),
    );
}
