"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { SaveWorkoutInput } from "@/lib/types";

export async function createExercise(name: string) {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("Exercise name is required");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exercises")
    .upsert({ name: trimmed }, { onConflict: "user_id,name" })
    .select("id, name")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/workouts/new");
  return data;
}

export async function saveWorkout(input: SaveWorkoutInput) {
  if (!input.date) throw new Error("Date is required");
  const validBlocks = input.blocks.filter(
    (b) => b.exerciseId && b.sets.length > 0,
  );
  if (validBlocks.length === 0) {
    throw new Error("Add at least one exercise with a set");
  }

  const supabase = await createClient();

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

  revalidatePath("/workouts");
  revalidatePath("/history");
  redirect(`/workouts/${workout.id}`);
}

export async function deleteWorkout(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("workouts").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/workouts");
  revalidatePath("/history");
  redirect("/workouts");
}
