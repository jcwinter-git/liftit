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
  AbsIcon,
  ArmsIcon,
  BackIcon,
  ChestIcon,
  LegsIcon,
  OtherIcon,
  ShouldersIcon,
} from "@/components/body-part-icons";

type CategoryIcon = React.ComponentType<{ className?: string }>;

const CATEGORY_STYLE: Record<
  ExerciseCategory,
  { icon: CategoryIcon; className: string }
> = {
  Arms: {
    icon: ArmsIcon,
    className:
      "bg-amber-100 text-amber-900 hover:bg-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:hover:bg-amber-900",
  },
  Back: {
    icon: BackIcon,
    className:
      "bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:hover:bg-blue-900",
  },
  Chest: {
    icon: ChestIcon,
    className:
      "bg-rose-100 text-rose-900 hover:bg-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:hover:bg-rose-900",
  },
  Legs: {
    icon: LegsIcon,
    className:
      "bg-green-100 text-green-900 hover:bg-green-200 dark:bg-green-950 dark:text-green-200 dark:hover:bg-green-900",
  },
  Shoulders: {
    icon: ShouldersIcon,
    className:
      "bg-purple-100 text-purple-900 hover:bg-purple-200 dark:bg-purple-950 dark:text-purple-200 dark:hover:bg-purple-900",
  },
  Abs: {
    icon: AbsIcon,
    className:
      "bg-teal-100 text-teal-900 hover:bg-teal-200 dark:bg-teal-950 dark:text-teal-200 dark:hover:bg-teal-900",
  },
  Other: {
    icon: OtherIcon,
    className:
      "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
  },
};

export { CATEGORY_STYLE };

export function CategoryTile({
  category,
  selected = false,
  onClick,
}: {
  category: ExerciseCategory;
  selected?: boolean;
  onClick: () => void;
}) {
  const { icon: Icon, className } = CATEGORY_STYLE[category];
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-medium transition-transform hover:scale-105 ${
        selected ? "border-foreground" : "border-transparent"
      } ${className}`}
    >
      <Icon className="size-7" />
      {category}
    </button>
  );
}

export function CategoryGrid({
  isSelected,
  onSelect,
}: {
  isSelected?: (category: ExerciseCategory) => boolean;
  onSelect: (category: ExerciseCategory) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-3 py-2">
      {EXERCISE_CATEGORIES.map((category) => (
        <CategoryTile
          key={category}
          category={category}
          selected={isSelected?.(category)}
          onClick={() => onSelect(category)}
        />
      ))}
    </div>
  );
}

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
          className="h-11 w-full justify-start gap-2 px-2 text-base"
        >
          {ValueIcon && value ? (
            <>
              <ValueIcon className="size-5 shrink-0" />
              <span className="truncate">{value}</span>
            </>
          ) : (
            "Body part"
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>What are you training?</DialogTitle>
        </DialogHeader>
        <CategoryGrid
          isSelected={(c) => c === value}
          onSelect={(category) => {
            onChange(category);
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
