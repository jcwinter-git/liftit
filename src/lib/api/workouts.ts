import { supabase } from "@/lib/supabase";
import type { Exercise, ExerciseCategory, SaveWorkoutInput } from "@/lib/types";

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
  exercise: { id: string; name: string } | null;
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
      "id, date, notes, sets(id, weight, reps, set_order, exercise:exercises(id, name))",
    )
    .eq("id", id)
    .single();
  if (error) return null;
  return data as unknown as WorkoutDetail;
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
