import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { WorkoutVolume } from "@/lib/volume";

type Point = {
  date: string;
  value: number;
  maxWeight: number | null;
};

function shortDate(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function TrendTooltip({
  active,
  payload,
  weighted,
}: {
  active?: boolean;
  payload?: { payload: Point }[];
  weighted: boolean;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-md border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-sm">
      <div>{shortDate(point.date)}</div>
      <div className="text-muted-foreground">
        {Math.round(point.value)} {weighted ? "lbs" : "reps"}
        {point.maxWeight != null && ` (max ${point.maxWeight})`}
      </div>
    </div>
  );
}

// Deliberately spare: no gridlines, no axis furniture, no legend. The numbers
// live in the heading and the tooltip; the line just carries the shape.
function compact(value: number) {
  return value >= 1000
    ? `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`
    : String(Math.round(value));
}

export function ExerciseTrendChart({
  entries,
  weighted,
  stroke = "currentColor",
}: {
  entries: WorkoutVolume[];
  weighted: boolean;
  stroke?: string;
}) {
  const data: Point[] = entries.map((e) => ({
    date: e.date,
    value: weighted ? e.volume : e.totalReps,
    maxWeight: e.maxWeight,
  }));

  return (
    <div className="text-foreground">
      <ResponsiveContainer width="100%" height={96}>
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <XAxis dataKey="date" hide />
          <YAxis
            width={38}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "currentColor" }}
            className="text-muted-foreground"
            domain={["dataMin", "dataMax"]}
            tickFormatter={compact}
            tickCount={3}
          />
          <Tooltip
            cursor={false}
            content={<TrendTooltip weighted={weighted} />}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={stroke}
            strokeWidth={1.75}
            dot={{ r: 2.5, strokeWidth: 0, fill: stroke }}
            activeDot={{ r: 4, strokeWidth: 0 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex justify-between pl-[38px] pr-2 text-[11px] text-muted-foreground">
        <span>{data.length > 0 ? shortDate(data[0].date) : ""}</span>
        <span>{data.length > 1 ? shortDate(data[data.length - 1].date) : ""}</span>
      </div>
    </div>
  );
}
