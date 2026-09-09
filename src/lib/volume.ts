export type SetLike = {
  weight: number | null;
  reps: number;
  workout: { id: string; date: string } | null;
};

export type WorkoutVolume = {
  date: string;
  volume: number;
  totalReps: number;
  weighted: boolean;
  maxWeight: number | null;
};

// Groups an exercise's sets into one entry per workout, oldest first.
export function groupSetsByWorkout(sets: SetLike[]): WorkoutVolume[] {
  const byWorkout = new Map<string, WorkoutVolume>();

  for (const s of sets) {
    if (!s.workout) continue;
    const entry = byWorkout.get(s.workout.id) ?? {
      date: s.workout.date,
      volume: 0,
      totalReps: 0,
      weighted: false,
      maxWeight: null,
    };
    entry.totalReps += s.reps;
    if (s.weight != null) {
      entry.weighted = true;
      entry.volume += s.weight * s.reps;
      entry.maxWeight = Math.max(entry.maxWeight ?? 0, s.weight);
    }
    byWorkout.set(s.workout.id, entry);
  }

  return Array.from(byWorkout.values()).sort((a, b) =>
    a.date.localeCompare(b.date),
  );
}

export type ExerciseStats = {
  prev: WorkoutVolume | null;
  max: WorkoutVolume | null;
  weighted: boolean;
};

export function statsFromWorkouts(entries: WorkoutVolume[]): ExerciseStats {
  if (entries.length === 0) return { prev: null, max: null, weighted: false };

  const weighted = entries.some((e) => e.weighted);
  const score = (e: WorkoutVolume) => (weighted ? e.volume : e.totalReps);

  return {
    prev: entries[entries.length - 1],
    max: entries.reduce((best, e) => (score(e) > score(best) ? e : best)),
    weighted,
  };
}

export function formatVolume(value: number, weighted: boolean): string {
  const rounded = Math.round(value);
  return weighted ? `${rounded} lbs` : `${rounded} reps`;
}
