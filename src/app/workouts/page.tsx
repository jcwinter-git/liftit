import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type WorkoutRow = {
  id: string;
  date: string;
  notes: string | null;
  sets: { exercise: { name: string } | null }[];
};

export default async function WorkoutsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("workouts")
    .select("id, date, notes, sets(exercise:exercises(name))")
    .order("date", { ascending: false });

  const workouts = (data as WorkoutRow[] | null) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Workouts</h1>
        <Button asChild>
          <Link href="/workouts/new">+ New workout</Link>
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error.message}</p>}

      {workouts.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No workouts logged yet. Create your first one.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {workouts.map((w) => {
            const exerciseNames = Array.from(
              new Set(
                w.sets
                  .map((s) => s.exercise?.name)
                  .filter((n): n is string => !!n),
              ),
            );
            return (
              <Link key={w.id} href={`/workouts/${w.id}`}>
                <Card className="transition-colors hover:bg-accent/50">
                  <CardContent className="flex flex-col gap-1">
                    <div className="flex items-baseline justify-between">
                      <span className="font-medium">
                        {new Date(w.date + "T00:00:00").toLocaleDateString(
                          undefined,
                          { weekday: "short", month: "short", day: "numeric" },
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {w.sets.length} set{w.sets.length === 1 ? "" : "s"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {exerciseNames.length > 0
                        ? exerciseNames.join(", ")
                        : "No sets recorded"}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
