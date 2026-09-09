import type { Exercise, ExerciseCategory } from "@/lib/types";

const DEFAULT_EXERCISE_NAME: Partial<Record<ExerciseCategory, string>> = {
  Arms: "Bicep Curls",
  Back: "Pull ups",
  Chest: "Dumbbell Bench",
  Shoulders: "Military press",
  Legs: "Cossacks",
  Abs: "Leg Raises",
};

// Matched case-insensitively so a capitalisation tweak to an exercise name
// doesn't silently drop its default.
export function defaultExerciseId(
  category: ExerciseCategory,
  exercises: Exercise[],
): string {
  const name = DEFAULT_EXERCISE_NAME[category];
  if (!name) return "";
  const match = exercises.find(
    (e) => e.category === category && e.name.toLowerCase() === name.toLowerCase(),
  );
  return match?.id ?? "";
}
