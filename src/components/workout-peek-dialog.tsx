import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WorkoutSummary } from "@/components/workout-summary";
import { fetchWorkout, type WorkoutDetail } from "@/lib/api/workouts";

function formatDate(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

// Tapping a filled square on the home calendar peeks at that day's workout
// without leaving the home screen. The dialog's own × closes it.
export function WorkoutPeekDialog({
  workoutId,
  onClose,
}: {
  workoutId: string | null;
  onClose: () => void;
}) {
  const [workout, setWorkout] = useState<WorkoutDetail | null>(null);

  useEffect(() => {
    if (!workoutId) return;
    let cancelled = false;
    // Keep whatever's on screen until the new one lands, so reopening a day
    // you've already looked at doesn't flash empty.
    fetchWorkout(workoutId).then((data) => {
      if (!cancelled) setWorkout(data);
    });
    return () => {
      cancelled = true;
    };
  }, [workoutId]);

  const showing = workoutId && workout?.id === workoutId ? workout : null;

  return (
    <Dialog open={workoutId !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="pr-10 text-base">
            {showing ? formatDate(showing.date) : " "}
          </DialogTitle>
        </DialogHeader>

        {showing ? (
          <>
            {showing.notes && (
              <p className="text-xs text-muted-foreground">{showing.notes}</p>
            )}
            <WorkoutSummary workout={showing} variant="compact" />
            <Link
              to={`/workouts/${showing.id}`}
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Open workout
            </Link>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Loading…</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
