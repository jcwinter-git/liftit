import { CATEGORY_STYLE } from "@/components/body-part-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatVolume } from "@/lib/volume";
import type { WorkoutDetail, WorkoutSetRow } from "@/lib/api/workouts";
import type { ExerciseCategory } from "@/lib/types";

type ExerciseGroup = {
  name: string;
  category: ExerciseCategory;
  sets: WorkoutSetRow[];
};

// One group per exercise, in the order the sets were logged.
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

function setLabel(set: WorkoutSetRow): string {
  return set.weight != null ? `${set.weight} x ${set.reps}` : `${set.reps} reps`;
}

function groupTotal(group: ExerciseGroup) {
  const weighted = group.sets.some((s) => s.weight != null);
  const total = group.sets.reduce(
    (sum, s) => sum + (weighted ? (s.weight ?? 0) * s.reps : s.reps),
    0,
  );
  return { weighted, total };
}

// Two ways to read the same workout: full cards on the detail page, and a
// tighter one-line-per-exercise list for the peek dialog off the home grid.
export function WorkoutSummary({
  workout,
  variant = "cards",
}: {
  workout: WorkoutDetail;
  variant?: "cards" | "compact";
}) {
  const groups = groupByExercise(workout);

  if (variant === "compact") {
    return (
      <div className="flex flex-col gap-3">
        {groups.map((group) => {
          const { icon: Icon, className } = CATEGORY_STYLE[group.category];
          const { weighted, total } = groupTotal(group);
          return (
            <div key={group.name} className="flex items-start gap-2">
              <span className={`mt-0.5 shrink-0 rounded-md p-1 ${className}`}>
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{group.name}</p>
                <p className="text-xs text-muted-foreground">
                  {group.sets.map(setLabel).join(" · ")}
                </p>
              </div>
              <p className="shrink-0 text-xs text-muted-foreground">
                {formatVolume(total, weighted)}
              </p>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {groups.map((group) => {
        const { icon: Icon, className } = CATEGORY_STYLE[group.category];
        const { weighted, total } = groupTotal(group);

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
                    {setLabel(s)}
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
  );
}
