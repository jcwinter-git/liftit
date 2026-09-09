import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import {
  fetchDailyLoad,
  fetchWorkouts,
  type WorkoutListItem,
} from "@/lib/api/workouts";
import { ActivityGrid } from "@/components/activity-grid";

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
        className="group flex h-24 items-center justify-center rounded-2xl bg-sky-100 ring-2 ring-sky-400 transition-transform hover:scale-[1.02] active:scale-[0.99] dark:bg-sky-950 dark:ring-sky-500"
      >
        <Plus
          className="size-12 text-sky-600 transition-transform group-hover:rotate-90 dark:text-sky-300"
          strokeWidth={3}
        />
      </Link>
    </div>
  );
}
