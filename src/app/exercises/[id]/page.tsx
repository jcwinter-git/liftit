import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { VolumeChart } from "@/components/volume-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SetRow = {
  id: string;
  weight: number | null;
  reps: number;
  workout: { id: string; date: string } | null;
};

export default async function ExerciseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: exercise } = await supabase
    .from("exercises")
    .select("id, name")
    .eq("id", id)
    .single();

  if (!exercise) notFound();

  const { data: setsData } = await supabase
    .from("sets")
    .select("id, weight, reps, workout:workouts(id, date)")
    .eq("exercise_id", id);

  const sets = (setsData as unknown as SetRow[] | null) ?? [];

  const byWorkout = new Map<
    string,
    { date: string; volume: number; hasWeight: boolean; totalReps: number }
  >();

  for (const s of sets) {
    if (!s.workout) continue;
    const entry = byWorkout.get(s.workout.id) ?? {
      date: s.workout.date,
      volume: 0,
      hasWeight: false,
      totalReps: 0,
    };
    entry.totalReps += s.reps;
    if (s.weight != null) {
      entry.hasWeight = true;
      entry.volume += s.weight * s.reps;
    }
    byWorkout.set(s.workout.id, entry);
  }

  const sortedEntries = Array.from(byWorkout.values()).sort(
    (a, b) => a.date.localeCompare(b.date),
  );

  const anyWeighted = sortedEntries.some((e) => e.hasWeight);

  const chartData = sortedEntries.map((e) => ({
    label: new Date(e.date + "T00:00:00").toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    value: anyWeighted ? e.volume : e.totalReps,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/history" className="text-sm text-muted-foreground hover:underline">
          ← History
        </Link>
        <h1 className="text-2xl font-semibold">{exercise.name}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {anyWeighted ? "Volume over time (weight × reps)" : "Total reps over time"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No sets logged for this exercise yet.
            </p>
          ) : (
            <VolumeChart data={chartData} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">
                  {anyWeighted ? "Volume" : "Total reps"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...sortedEntries].reverse().map((e) => (
                <TableRow key={e.date}>
                  <TableCell>
                    {new Date(e.date + "T00:00:00").toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    {anyWeighted ? e.volume : e.totalReps}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
