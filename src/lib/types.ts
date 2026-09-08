export const EXERCISE_CATEGORIES = [
  "Arms",
  "Back",
  "Chest",
  "Legs",
  "Shoulders",
  "Abs",
  "Other",
] as const;

export type ExerciseCategory = (typeof EXERCISE_CATEGORIES)[number];

export type Exercise = {
  id: string;
  name: string;
  category: ExerciseCategory;
};

export type SetInput = {
  weight: number | null;
  reps: number;
};

export type WorkoutBlockInput = {
  exerciseId: string;
  sets: SetInput[];
};

export type SaveWorkoutInput = {
  date: string;
  notes?: string;
  blocks: WorkoutBlockInput[];
};
