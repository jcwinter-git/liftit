import { useEffect, useState } from "react";
import { fetchExercises } from "@/lib/api/workouts";
import { WorkoutForm } from "@/components/workout-form";
import type { Exercise } from "@/lib/types";

export default function NewWorkoutPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExercises()
      .then(setExercises)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">New workout</h1>
      <WorkoutForm initialExercises={exercises} />
    </div>
  );
}
