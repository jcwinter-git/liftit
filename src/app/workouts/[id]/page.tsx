import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteWorkout } from "@/app/workouts/actions";

type SetRow = {
  id: string;
  weight: number | null;
  reps: number;
  set_order: number;
  exercise: { id: string; name: string } | null;
};

export default async function WorkoutDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: workout } = await supabase
    .from("workouts")
    .select(
      "id, date, notes, sets(id, weight, reps, set_order, exercise:exercises(id, name))",
    )
    .eq("id", id)
    .single();

  if (!workout) notFound();

  const sets = (workout.sets as unknown as SetRow[]).sort(
    (a, b) => a.set_order - b.set_order,
  );

  const grouped = new Map<string, { name: string; sets: SetRow[] }>();
  for (const s of sets) {
    const key = s.exercise?.id ?? "unknown";
    if (!grouped.has(key)) {
      grouped.set(key, { name: s.exercise?.name ?? "Unknown exercise", sets: [] });
    }
    grouped.get(key)!.sets.push(s);
  }

  const deleteWorkoutWithId = deleteWorkout.bind(null, workout.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/workouts" className="text-sm text-muted-foreground hover:underline">
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
        <form action={deleteWorkoutWithId}>
          <Button type="submit" variant="destructive" size="sm">
            Delete
          </Button>
        </form>
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
