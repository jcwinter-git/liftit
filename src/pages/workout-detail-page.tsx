import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  deleteWorkout,
  fetchWorkout,
  type WorkoutDetail,
  type WorkoutSetRow,
} from "@/lib/api/workouts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WorkoutDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<WorkoutDetail | null | undefined>(
    undefined,
  );
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchWorkout(id).then(setWorkout);
  }, [id]);

  async function handleDelete() {
    if (!id) return;
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

  const sets = [...workout.sets].sort((a, b) => a.set_order - b.set_order);

  const grouped = new Map<string, { name: string; sets: WorkoutSetRow[] }>();
  for (const s of sets) {
    const key = s.exercise?.id ?? "unknown";
    if (!grouped.has(key)) {
      grouped.set(key, { name: s.exercise?.name ?? "Unknown exercise", sets: [] });
    }
    grouped.get(key)!.sets.push(s);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/workouts" className="text-sm text-muted-foreground hover:underline">
            ← Workouts
          </Link>
          <h1 className="text-2xl font-semibold">
            {new Date(workout.date + "T00:00:00").toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </h1>
        </div>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      </div>

      {workout.notes && (
        <p className="text-sm text-muted-foreground">{workout.notes}</p>
      )}

      <div className="flex flex-col gap-4">
        {Array.from(grouped.values()).map((group) => (
          <Card key={group.name}>
            <CardHeader>
              <CardTitle className="text-base">{group.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-1 text-sm">
                {group.sets.map((s) => (
                  <li key={s.id} className="text-muted-foreground">
                    {s.weight != null ? `${s.weight} x ${s.reps}` : `${s.reps} reps`}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
