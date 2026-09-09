import { Star } from "lucide-react";

// Wordless progress: the fill creeps toward your last session, the star marks
// your best ever. Turns green once you've beaten last time.
export function BeatBar({
  current,
  prev,
  max,
}: {
  current: number;
  prev: number | null;
  max: number | null;
}) {
  // A little headroom so the star never sits half-off the right edge.
  const scale = Math.max(current, prev ?? 0, max ?? 0, 1) * 1.06;
  const pct = (value: number) => Math.min(100, (value / scale) * 100);
  const beaten = prev != null && prev > 0 && current >= prev;

  return (
    <div
      className="relative h-3 w-full"
      aria-label={beaten ? "Past your last session" : "Progress toward your last session"}
    >
      <div className="absolute top-1 h-1.5 w-full rounded-full bg-muted" />
      <div
        className={`absolute top-1 h-1.5 rounded-full transition-[width] duration-300 ${
          beaten ? "bg-emerald-500" : "bg-sky-400"
        }`}
        style={{ width: `${pct(current)}%` }}
      />
      {prev != null && prev > 0 && (max == null || prev < max) && (
        <div
          className="absolute top-0.5 h-2.5 w-px bg-foreground/40"
          style={{ left: `${pct(prev)}%` }}
        />
      )}
      {max != null && max > 0 && (
        <Star
          className="absolute -top-0 size-3 -translate-x-1/2 fill-amber-400 text-amber-400"
          style={{ left: `${pct(max)}%` }}
        />
      )}
    </div>
  );
}
