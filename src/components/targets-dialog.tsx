import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CategoryGrid } from "@/components/body-part-picker";
import type { ExerciseCategory } from "@/lib/types";

export function TargetsDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (categories: ExerciseCategory[]) => void;
}) {
  const [selected, setSelected] = useState<ExerciseCategory[]>([]);

  function toggle(category: ExerciseCategory) {
    setSelected((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Today's targets</DialogTitle>
          <DialogDescription>
            Pick what you're training and we'll set up the exercises.
          </DialogDescription>
        </DialogHeader>

        <CategoryGrid
          isSelected={(c) => selected.includes(c)}
          onSelect={toggle}
        />

        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Skip
          </Button>
          <Button
            type="button"
            disabled={selected.length === 0}
            onClick={() => onConfirm(selected)}
          >
            Start workout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
