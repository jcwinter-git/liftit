import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import {
  fetchExerciseHistories,
  fetchWorkouts,
  type ExerciseHistory,
  type WorkoutListItem,
} from "@/lib/api/workouts";
import { ExerciseTrendChart } from "@/components/exercise-trend-chart";
import { CATEGORY_STYLE } from "@/components/body-part-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { EXERCISE_CATEGORIES, type ExerciseCategory } from "@/lib/types";

export default function HistoryPage() {
  const [histories, setHistories] = useState<ExerciseHistory[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutListItem[]>([]);
  const [category, setCategory] = useState<ExerciseCategory | null>(null);
  const [exerciseIds, setExerciseIds] = useState<string[]>([]);

  useEffect(() => {
    fetchExerciseHistories().then(setHistories);
    fetchWorkouts().then(setWorkouts);
  }, []);

  // Only offer body parts that have something logged behind them.
  const availableCategories = useMemo(() => {
    const present = new Set(histories.map((h) => h.exercise.category));
    return EXERCISE_CATEGORIES.filter((c) => present.has(c));
  }, [histories]);

  const alphabetical = useMemo(
    () =>
      [...histories].sort((a, b) =>
        a.exercise.name.localeCompare(b.exercise.name),
      ),
    [histories],
  );

  // Already sorted by frequency from the query; filters preserve that order.
  const visible = histories.filter(
    (h) =>
      (!category || h.exercise.category === category) &&
      (exerciseIds.length === 0 || exerciseIds.includes(h.exercise.id)),
  );

  function toggleExercise(id: string) {
    setExerciseIds((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id],
    );
  }

  return (
    <div className="flex flex-col gap-6 py-2">
      <div className="flex items-start justify-between gap-2">
        <h1 className="text-2xl font-semibold">History</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              aria-label="Filter by exercise"
              className="relative h-9 w-9 shrink-0 p-0"
            >
              <SlidersHorizontal className="size-4" />
              {exerciseIds.length > 0 && (
                <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-sky-500" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="max-h-80 w-56 overflow-y-auto p-1">
            {exerciseIds.length > 0 && (
              <button
                type="button"
                onClick={() => setExerciseIds([])}
                className="w-full rounded-md px-2 py-1.5 text-left text-xs text-muted-foreground hover:bg-accent"
              >
                Clear ({exerciseIds.length})
              </button>
            )}
            {alphabetical.map((h) => (
              <button
                key={h.exercise.id}
                type="button"
                onClick={() => toggleExercise(h.exercise.id)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent"
              >
                <span
                  className={`size-1.5 rounded-full ${
                    exerciseIds.includes(h.exercise.id)
                      ? "bg-sky-500"
                      : "bg-transparent"
                  }`}
                />
                {h.exercise.name}
              </button>
            ))}
          </PopoverContent>
        </Popover>
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {availableCategories.map((c) => {
          const { icon: Icon, className } = CATEGORY_STYLE[c];
          const active = category === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(active ? null : c)}
              aria-pressed={active}
              className={`flex w-[78px] shrink-0 flex-col items-center gap-1 rounded-xl border-2 py-2 text-xs font-medium transition-transform ${
                active ? "border-foreground" : "border-transparent"
              } ${className}`}
            >
              <Icon className="size-6" />
              {c}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nothing logged for this filter yet.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {visible.map((h) => {
            const weighted = h.entries.some((e) => e.weighted);
            const latest = h.entries[h.entries.length - 1];
            const maxWeight = h.entries.reduce<number | null>(
              (best, e) =>
                e.maxWeight == null ? best : Math.max(best ?? 0, e.maxWeight),
              null,
            );
            const latestValue = weighted ? latest.volume : latest.totalReps;

            return (
              <div key={h.exercise.id} className="flex flex-col gap-1">
                <div className="flex items-baseline justify-between gap-2">
                  <Link
                    to={`/exercises/${h.exercise.id}`}
                    className="text-sm font-medium hover:underline"
                  >
                    {h.exercise.name}
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(latestValue)} {weighted ? "lbs" : "reps"}
                    {maxWeight != null && ` (max ${maxWeight})`}
                  </span>
                </div>
                {h.entries.length > 1 ? (
                  <ExerciseTrendChart entries={h.entries} weighted={weighted} />
                ) : (
                  <span className="text-[11px] text-muted-foreground">
                    One session so far
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="flex flex-col gap-2 border-t pt-4">
        <span className="text-xs text-muted-foreground">All workouts</span>
        {workouts.map((w) => (
          <Link
            key={w.id}
            to={`/workouts/${w.id}`}
            className="flex items-baseline justify-between gap-2 text-sm hover:underline"
          >
            <span>
              {new Date(w.date + "T00:00:00").toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {Array.from(
                new Set(
                  w.sets.map((s) => s.exercise?.name).filter((n): n is string => !!n),
                ),
              ).join(", ")}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
