import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
            Pick what you're training, or close this to start from scratch.
          </DialogDescription>
        </DialogHeader>

        <CategoryGrid
          isSelected={(c) => selected.includes(c)}
          onSelect={toggle}
        />

        {/* Always enabled: with nothing picked this just starts an empty
            workout, so the button can never look tappable but do nothing. */}
        <Button
          type="button"
          className="h-14 w-full text-base font-semibold"
          onClick={() => onConfirm(selected)}
        >
          Start workout
        </Button>
      </DialogContent>
    </Dialog>
  );
}
