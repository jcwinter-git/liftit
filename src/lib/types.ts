export type Exercise = {
  id: string;
  name: string;
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
