"use client";

import { Calendar } from "@/components/ui/calendar";

export function WorkoutCalendar({ dates }: { dates: string[] }) {
  const worked = dates.map((d) => new Date(d + "T00:00:00"));

  return (
    <Calendar
      modifiers={{ worked }}
      modifiersClassNames={{
        worked: "bg-primary text-primary-foreground rounded-md font-medium",
      }}
      className="w-fit"
    />
  );
}
