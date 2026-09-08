import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchExercise, fetchExerciseSets } from "@/lib/api/workouts";
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
import type { Exercise } from "@/lib/types";

type WorkoutVolume = {
  date: string;
  volume: number;
  hasWeight: boolean;
  totalReps: number;
};

export default function ExerciseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [exercise, setExercise] = useState<Exercise | null | undefined>(undefined);
  const [entries, setEntries] = useState<WorkoutVolume[]>([]);

  useEffect(() => {
    if (!id) return;
    fetchExercise(id).then(setExercise);
    fetchExerciseSets(id).then((sets) => {
      const byWorkout = new Map<string, WorkoutVolume>();
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
      setEntries(
        Array.from(byWorkout.values()).sort((a, b) => a.date.localeCompare(b.date)),
      );
    });
  }, [id]);

  if (exercise === undefined) return null;
  if (exercise === null) {
    return <p className="text-sm text-muted-foreground">Exercise not found.</p>;
  }

  const anyWeighted = entries.some((e) => e.hasWeight);

  const chartData = entries.map((e) => ({
    label: new Date(e.date + "T00:00:00").toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    value: anyWeighted ? e.volume : e.totalReps,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link to="/history" className="text-sm text-muted-foreground hover:underline">
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
              {[...entries].reverse().map((e) => (
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
