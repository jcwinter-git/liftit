import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchDailyLoad,
  fetchWorkouts,
  type WorkoutListItem,
} from "@/lib/api/workouts";
import { ActivityGrid } from "@/components/activity-grid";
import { SketchPlus } from "@/components/sketch-plus";

export default function WorkoutsPage() {
  const [load, setLoad] = useState<Record<string, number>>({});
  const [workoutByDate, setWorkoutByDate] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchWorkouts(), fetchDailyLoad()])
      .then(([list, dailyLoad]: [WorkoutListItem[], Record<string, number>]) => {
        const byDate: Record<string, string> = {};
        // Newest first, so the last write per date wins the earliest workout;
        // reversing keeps the most recent one for a day with two sessions.
        for (const w of [...list].reverse()) byDate[w.date] = w.id;
        setWorkoutByDate(byDate);
        setLoad(dailyLoad);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"));
  }, []);

  return (
    <div className="flex flex-col gap-8 py-4">
      {error && <p className="text-sm text-destructive">{error}</p>}

      <ActivityGrid load={load} workoutByDate={workoutByDate} />

      <Link
        to="/workouts/new"
        aria-label="New workout"
        className="mx-auto flex size-28 items-center justify-center text-sky-500 transition-transform hover:scale-105 active:scale-95 dark:text-sky-400"
      >
        <SketchPlus variant="single" className="size-28" />
      </Link>
    </div>
  );
}
