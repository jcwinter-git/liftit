import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EXERCISE_CATEGORIES, type ExerciseCategory } from "@/lib/types";
import {
  Dumbbell,
  PersonStanding,
  Shirt,
  Footprints,
  Flame,
  Hexagon,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const CATEGORY_STYLE: Record<
  ExerciseCategory,
  { icon: LucideIcon; className: string }
> = {
  Arms: {
    icon: Dumbbell,
    className:
      "bg-amber-100 text-amber-900 hover:bg-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:hover:bg-amber-900",
  },
  Back: {
    icon: PersonStanding,
    className:
      "bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:hover:bg-blue-900",
  },
  Chest: {
    icon: Shirt,
    className:
      "bg-rose-100 text-rose-900 hover:bg-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:hover:bg-rose-900",
  },
  Legs: {
    icon: Footprints,
    className:
      "bg-green-100 text-green-900 hover:bg-green-200 dark:bg-green-950 dark:text-green-200 dark:hover:bg-green-900",
  },
  Shoulders: {
    icon: Flame,
    className:
      "bg-purple-100 text-purple-900 hover:bg-purple-200 dark:bg-purple-950 dark:text-purple-200 dark:hover:bg-purple-900",
  },
  Abs: {
    icon: Hexagon,
    className:
      "bg-orange-100 text-orange-900 hover:bg-orange-200 dark:bg-orange-950 dark:text-orange-200 dark:hover:bg-orange-900",
  },
  Other: {
    icon: Sparkles,
    className:
      "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
  },
};

export { CATEGORY_STYLE };

export function BodyPartPicker({
  value,
  onChange,
}: {
  value: ExerciseCategory | null;
  onChange: (category: ExerciseCategory) => void;
}) {
  const [open, setOpen] = useState(false);
  const ValueIcon = value ? CATEGORY_STYLE[value].icon : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start gap-2"
        >
          {ValueIcon && value ? (
            <>
              <ValueIcon className="size-4" />
              {value}
            </>
          ) : (
            "Pick a body part"
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>What are you training?</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-3 py-2">
          {EXERCISE_CATEGORIES.map((category) => {
            const { icon: Icon, className } = CATEGORY_STYLE[category];
            return (
              <button
                key={category}
                type="button"
                onClick={() => {
                  onChange(category);
                  setOpen(false);
                }}
                className={`flex flex-col items-center gap-2 rounded-xl border border-transparent p-4 text-sm font-medium transition-transform hover:scale-105 ${className}`}
              >
                <Icon className="size-7" />
                {category}
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
