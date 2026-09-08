import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchWorkouts, type WorkoutListItem } from "@/lib/api/workouts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<WorkoutListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkouts()
      .then(setWorkouts)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Workouts</h1>
        <Button asChild>
          <Link to="/workouts/new">+ New workout</Link>
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && workouts.length === 0 && !error ? (
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
              <Link key={w.id} to={`/workouts/${w.id}`}>
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
