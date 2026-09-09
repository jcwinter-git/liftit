import { Link } from "react-router-dom";

const DAYS = 28;

const LEVEL_CLASS = [
  "bg-muted",
  "bg-emerald-100 dark:bg-emerald-950",
  "bg-emerald-300 dark:bg-emerald-800",
  "bg-emerald-500 dark:bg-emerald-600",
  "bg-emerald-600 dark:bg-emerald-400",
];

function lastDays(count: number): string[] {
  const out: string[] = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const offset = d.getTimezoneOffset();
    out.push(new Date(d.getTime() - offset * 60 * 1000).toISOString().slice(0, 10));
  }
  return out;
}

// Load is weighted volume plus raw reps for bodyweight work, shaded relative to
// the hardest day in the window so the scale always means something.
export function ActivityGrid({
  load,
  workoutByDate = {},
}: {
  load: Record<string, number>;
  workoutByDate?: Record<string, string>;
}) {
  const days = lastDays(DAYS);
  const max = Math.max(...days.map((d) => load[d] ?? 0), 0);

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((date) => {
          const value = load[date] ?? 0;
          const level =
            value <= 0 || max <= 0
              ? 0
              : Math.min(4, Math.max(1, Math.ceil((value / max) * 4)));
          const label = new Date(date + "T00:00:00").toLocaleDateString(
            undefined,
            { weekday: "short", month: "short", day: "numeric" },
          );
          const title = value > 0 ? `${label} — ${Math.round(value)}` : `${label} — rest`;
          const cell = `aspect-square rounded-md ${LEVEL_CLASS[level]}`;
          const workoutId = workoutByDate[date];

          return workoutId ? (
            <Link
              key={date}
              to={`/workouts/${workoutId}`}
              title={title}
              aria-label={title}
              className={`${cell} transition-transform hover:scale-110`}
            />
          ) : (
            <div key={date} title={title} className={cell} />
          );
        })}
      </div>
      <span className="text-xs text-muted-foreground">Last 28 days</span>
    </div>
  );
}
