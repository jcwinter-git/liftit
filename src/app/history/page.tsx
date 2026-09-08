import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { WorkoutCalendar } from "@/components/workout-calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function HistoryPage() {
  const supabase = await createClient();

  const { data: workouts } = await supabase
    .from("workouts")
    .select("date")
    .order("date", { ascending: false });

  const dates = (workouts ?? []).map((w) => w.date as string);

  const now = new Date();
  const last7 = new Date(now);
  last7.setDate(now.getDate() - 7);
  const last30 = new Date(now);
  last30.setDate(now.getDate() - 30);

  const count7 = dates.filter((d) => new Date(d + "T00:00:00") >= last7).length;
  const count30 = dates.filter((d) => new Date(d + "T00:00:00") >= last30).length;

  const { data: exercises } = await supabase
    .from("exercises")
    .select("id, name")
    .order("name");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">History</h1>

      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="flex flex-col gap-1 pt-4">
            <span className="text-2xl font-semibold">{dates.length}</span>
            <span className="text-xs text-muted-foreground">Total workouts</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-1 pt-4">
            <span className="text-2xl font-semibold">{count7}</span>
            <span className="text-xs text-muted-foreground">Last 7 days</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-1 pt-4">
            <span className="text-2xl font-semibold">{count30}</span>
            <span className="text-xs text-muted-foreground">Last 30 days</span>
          </CardContent>
        </Card>
      </div>

      <WorkoutCalendar dates={dates} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Exercise trends</CardTitle>
        </CardHeader>
        <CardContent>
          {!exercises || exercises.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Log a workout to start tracking exercise trends.
            </p>
          ) : (
            <ul className="flex flex-col gap-1">
              {exercises.map((ex) => (
                <li key={ex.id}>
                  <Link
                    href={`/exercises/${ex.id}`}
                    className="text-sm hover:underline"
                  >
                    {ex.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
