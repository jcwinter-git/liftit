import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  deleteWorkout,
  fetchExercises,
  fetchExerciseVolumeStats,
  fetchWorkout,
  type WorkoutDetail,
} from "@/lib/api/workouts";
import { WorkoutForm } from "@/components/workout-form";
import { WorkoutSummary } from "@/components/workout-summary";
import { Button } from "@/components/ui/button";
import { blocksFromWorkout } from "@/lib/workout-blocks";
import { type ExerciseStats } from "@/lib/volume";
import type { Exercise } from "@/lib/types";

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

      <WorkoutSummary workout={workout} />

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
