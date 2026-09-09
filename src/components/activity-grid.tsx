import { Link } from "react-router-dom";

const WEEKS = 4;

const LEVEL_CLASS = [
  "bg-muted",
  "bg-emerald-100 dark:bg-emerald-950",
  "bg-emerald-300 dark:bg-emerald-800",
  "bg-emerald-500 dark:bg-emerald-600",
  "bg-emerald-600 dark:bg-emerald-400",
];

function toLocalISO(date: Date) {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60 * 1000).toISOString().slice(0, 10);
}

// Four calendar weeks, Sunday through Saturday, ending with the week we're in —
// so the columns line up as weekdays rather than sliding with the date.
function calendarWindow(): { dates: string[]; today: string } {
  const now = new Date();
  now.setHours(12, 0, 0, 0);
  const saturday = new Date(now);
  saturday.setDate(now.getDate() + (6 - now.getDay()));

  const start = new Date(saturday);
  start.setDate(saturday.getDate() - (WEEKS * 7 - 1));

  const dates: string[] = [];
  for (let i = 0; i < WEEKS * 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(toLocalISO(d));
  }
  return { dates, today: toLocalISO(now) };
}

export function ActivityGrid({
  load,
  workoutByDate = {},
}: {
  load: Record<string, number>;
  workoutByDate?: Record<string, string>;
}) {
  const { dates, today } = calendarWindow();
  const max = Math.max(...dates.map((d) => load[d] ?? 0), 0);

  return (
    <div>
      <div className="grid grid-cols-7 gap-1.5">
        {dates.map((date) => {
          const value = load[date] ?? 0;
          const isToday = date === today;
          const isFuture = date > today;
          const level =
            value <= 0 || max <= 0
              ? 0
              : Math.min(4, Math.max(1, Math.ceil((value / max) * 4)));

          const fill = isFuture
            ? "bg-muted/40"
            : level === 0 && isToday
              ? "bg-sky-100 dark:bg-sky-950"
              : LEVEL_CLASS[level];

          const cell = `aspect-square rounded-md ${fill} ${
            isToday ? "ring-2 ring-sky-400 dark:ring-sky-500" : ""
          }`;

          const label = new Date(date + "T00:00:00").toLocaleDateString(
            undefined,
            { weekday: "short", month: "short", day: "numeric" },
          );
          const title = isFuture
            ? label
            : value > 0
              ? `${label} — ${Math.round(value)}`
              : `${label} — rest`;

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
    </div>
  );
}
