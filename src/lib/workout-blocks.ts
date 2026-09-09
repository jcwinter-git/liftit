import type { WorkoutDetail } from "@/lib/api/workouts";
import type { ExerciseCategory } from "@/lib/types";

export type SetRow = { localId: string; weight: string; reps: string };

export type Block = {
  localId: string;
  category: ExerciseCategory | null;
  exerciseId: string;
  sets: SetRow[];
};

export function uid(): string {
  return crypto.randomUUID();
}

export function emptySet(): SetRow {
  return { localId: uid(), weight: "", reps: "" };
}

export function emptyBlock(): Block {
  return { localId: uid(), category: null, exerciseId: "", sets: [emptySet()] };
}

// Turns a saved workout back into editable form blocks, one per exercise,
// preserving the order the sets were logged in.
export function blocksFromWorkout(detail: WorkoutDetail): Block[] {
  const ordered = [...detail.sets].sort((a, b) => a.set_order - b.set_order);
  const byExercise = new Map<string, Block>();

  for (const set of ordered) {
    if (!set.exercise) continue;
    let block = byExercise.get(set.exercise.id);
    if (!block) {
      block = {
        localId: uid(),
        category: set.exercise.category,
        exerciseId: set.exercise.id,
        sets: [],
      };
      byExercise.set(set.exercise.id, block);
    }
    block.sets.push({
      localId: uid(),
      weight: set.weight == null ? "" : String(set.weight),
      reps: String(set.reps),
    });
  }

  const blocks = Array.from(byExercise.values());
  return blocks.length > 0 ? blocks : [emptyBlock()];
}
