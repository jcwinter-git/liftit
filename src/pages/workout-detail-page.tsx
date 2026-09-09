import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  deleteWorkout,
  fetchExercises,
  fetchExerciseVolumeStats,
  fetchWorkout,
  type WorkoutDetail,
  type WorkoutSetRow,
} from "@/lib/api/workouts";
import { WorkoutForm } from "@/components/workout-form";
import { CATEGORY_STYLE } from "@/components/body-part-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { blocksFromWorkout } from "@/lib/workout-blocks";
import { formatVolume, type ExerciseStats } from "@/lib/volume";
import type { Exercise, ExerciseCategory } from "@/lib/types";

type ExerciseGroup = {
  name: string;
  category: ExerciseCategory;
  sets: WorkoutSetRow[];
};

function groupByExercise(workout: WorkoutDetail): ExerciseGroup[] {
  const sets = [...workout.sets].sort((a, b) => a.set_order - b.set_order);
  const groups = new Map<string, ExerciseGroup>();

  for (const s of sets) {
    const key = s.exercise?.id ?? "unknown";
    if (!groups.has(key)) {
      groups.set(key, {
        name: s.exercise?.name ?? "Unknown exercise",
        category: s.exercise?.category ?? "Other",
        sets: [],
      });
    }
    groups.get(key)!.sets.push(s);
  }
  return Array.from(groups.values());
}

export default function WorkoutDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<WorkoutDetail | null | undefined>(
    undefined,
  );
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [stats, setStats] = useState<Record<string, ExerciseStats>>({});
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const load = useCallback(() => {
    if (!id) return;
    fetchWorkout(id).then(setWorkout);
  }, [id]);

  useEffect(() => {
    load();
    Promise.all([fetchExercises(), fetchExerciseVolumeStats()]).then(
      ([exerciseList, volumeStats]) => {
        setExercises(exerciseList);
        setStats(volumeStats);
      },
    );
  }, [load]);

  useEffect(() => {
    if (!confirmDelete) return;
    const timer = setTimeout(() => setConfirmDelete(false), 4000);
    return () => clearTimeout(timer);
  }, [confirmDelete]);

  async function handleDelete() {
    if (!id) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    try {
      await deleteWorkout(id);
      navigate("/workouts");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete workout");
      setDeleting(false);
    }
  }

  if (workout === undefined) return null;
  if (workout === null) {
    return <p className="text-sm text-muted-foreground">Workout not found.</p>;
  }

  const heading = new Date(workout.date + "T00:00:00").toLocaleDateString(
    undefined,
    { weekday: "long", month: "long", day: "numeric", year: "numeric" },
  );

  if (editing) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Edit workout</h1>
        <WorkoutForm
          mode="edit"
          workoutId={workout.id}
          initialExercises={exercises}
          exerciseStats={stats}
          initialDate={workout.date}
          initialNotes={workout.notes ?? ""}
          initialBlocks={blocksFromWorkout(workout)}
          onCancel={() => setEditing(false)}
          onSaved={() => {
            setEditing(false);
            load();
            toast.success("Workout updated.");
          }}
        />
      </div>
    );
  }

  const groups = groupByExercise(workout);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-2">
        <div>
          <Link
            to="/workouts"
            className="text-sm text-muted-foreground hover:underline"
          >
            ← Workouts
          </Link>
          <h1 className="text-2xl font-semibold">{heading}</h1>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={() => setEditing(true)}
        >
          Edit
        </Button>
      </div>

      {workout.notes && (
        <p className="text-sm text-muted-foreground">{workout.notes}</p>
      )}

      <div className="flex flex-col gap-4">
        {groups.map((group) => {
          const { icon: Icon, className } = CATEGORY_STYLE[group.category];
          const weighted = group.sets.some((s) => s.weight != null);
          const total = group.sets.reduce(
            (sum, s) => sum + (weighted ? (s.weight ?? 0) * s.reps : s.reps),
            0,
          );

          return (
            <Card key={group.name}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <span className={`rounded-md p-1 ${className}`}>
                    <Icon className="size-4" />
                  </span>
                  {group.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-1">
                <ul className="flex flex-col gap-1 text-sm">
                  {group.sets.map((s) => (
                    <li key={s.id} className="text-muted-foreground">
                      {s.weight != null
                        ? `${s.weight} x ${s.reps}`
                        : `${s.reps} reps`}
                    </li>
                  ))}
                </ul>
                <p className="text-right text-xs text-foreground">
                  Total: {formatVolume(total, weighted)}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={deleting}
          onClick={handleDelete}
        >
          {deleting ? (
            "Deleting..."
          ) : confirmDelete ? (
            <span className="text-red-600 dark:text-red-400">Confirm delete?</span>
          ) : (
            <span className="text-muted-foreground">Delete</span>
          )}
        </Button>
      </div>
    </div>
  );
}
