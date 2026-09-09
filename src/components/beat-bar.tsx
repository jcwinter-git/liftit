// Same green ramp as the calendar: the fill starts pale and deepens as you close
// on your last session, hitting full contrast there and holding it through to
// your best ever. No numbers, no markers.
const RAMP = [
  "bg-emerald-100 dark:bg-emerald-950",
  "bg-emerald-200 dark:bg-emerald-900",
  "bg-emerald-300 dark:bg-emerald-800",
  "bg-emerald-400 dark:bg-emerald-700",
  "bg-emerald-500 dark:bg-emerald-600",
  "bg-emerald-600 dark:bg-emerald-400",
];

export function BeatBar({
  current,
  prev,
  max,
}: {
  current: number;
  prev: number | null;
  max: number | null;
}) {
  const target = prev ?? 0;
  const ceiling = Math.max(target, max ?? 0, current, 1);

  const width = Math.min(100, (current / ceiling) * 100);
  // Depth tracks progress toward last session, then pins at full contrast.
  const progress = target > 0 ? Math.min(1, current / target) : 0;
  const shade = RAMP[Math.min(RAMP.length - 1, Math.floor(progress * (RAMP.length - 1)))];

  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full bg-muted"
      aria-label={
        target > 0 && current >= target
          ? "Past your last session"
          : "Progress toward your last session"
      }
    >
      <div
        className={`h-full rounded-full transition-all duration-300 ${shade}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
