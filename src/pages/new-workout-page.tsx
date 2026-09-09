import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchExercises, fetchExerciseVolumeStats } from "@/lib/api/workouts";
import { WorkoutForm } from "@/components/workout-form";
import type { ExerciseStats } from "@/lib/volume";
import type { Exercise } from "@/lib/types";

export default function NewWorkoutPage() {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [stats, setStats] = useState<Record<string, ExerciseStats>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchExercises(), fetchExerciseVolumeStats()])
      .then(([exerciseList, volumeStats]) => {
        setExercises(exerciseList);
        setStats(volumeStats);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">New workout</h1>
      <WorkoutForm
        initialExercises={exercises}
        exerciseStats={stats}
        onCancel={() => navigate("/workouts")}
        onSaved={(id) => navigate(`/workouts/${id}`)}
      />
    </div>
  );
}
