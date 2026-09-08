import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExercisePicker } from "@/components/exercise-picker";
import { BodyPartPicker, CATEGORY_STYLE } from "@/components/body-part-picker";
import { createExercise, saveWorkout } from "@/lib/api/workouts";
import type { Exercise, ExerciseCategory } from "@/lib/types";

type SetRow = { localId: string; weight: string; reps: string };
type Block = {
  localId: string;
  category: ExerciseCategory | null;
  exerciseId: string;
  sets: SetRow[];
};

function uid() {
  return crypto.randomUUID();
}

function emptySet(): SetRow {
  return { localId: uid(), weight: "", reps: "" };
}

function emptyBlock(): Block {
  return { localId: uid(), category: null, exerciseId: "", sets: [emptySet()] };
}

function todayLocal() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

export function WorkoutForm({
  initialExercises,
}: {
  initialExercises: Exercise[];
}) {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState(initialExercises);
  const [date, setDate] = useState(todayLocal());
  const [notes, setNotes] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([emptyBlock()]);
  const [isPending, setIsPending] = useState(false);

  const todaysCategories = useMemo(
    () =>
      Array.from(
        new Set(blocks.map((b) => b.category).filter((c): c is ExerciseCategory => !!c)),
      ),
    [blocks],
  );

  function updateBlock(localId: string, patch: Partial<Block>) {
    setBlocks((bs) =>
      bs.map((b) => (b.localId === localId ? { ...b, ...patch } : b)),
    );
  }

  function addBlock() {
    setBlocks((bs) => [...bs, emptyBlock()]);
  }

  function removeBlock(localId: string) {
    setBlocks((bs) => bs.filter((b) => b.localId !== localId));
  }

  function addSet(blockId: string) {
    setBlocks((bs) =>
      bs.map((b) =>
        b.localId === blockId ? { ...b, sets: [...b.sets, emptySet()] } : b,
      ),
    );
  }

  function removeSet(blockId: string, setId: string) {
    setBlocks((bs) =>
      bs.map((b) =>
        b.localId === blockId
          ? { ...b, sets: b.sets.filter((s) => s.localId !== setId) }
          : b,
      ),
    );
  }

  function updateSet(
    blockId: string,
    setId: string,
    field: "weight" | "reps",
    value: string,
  ) {
    setBlocks((bs) =>
      bs.map((b) =>
        b.localId === blockId
          ? {
              ...b,
              sets: b.sets.map((s) =>
                s.localId === setId ? { ...s, [field]: value } : s,
              ),
            }
          : b,
      ),
    );
  }

  async function handleCreateExercise(
    name: string,
    category: ExerciseCategory,
  ): Promise<Exercise> {
    const exercise = await createExercise(name, category);
    setExercises((prev) =>
      prev.some((e) => e.id === exercise.id) ? prev : [...prev, exercise],
    );
    return exercise;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payloadBlocks = blocks
      .filter((b) => b.exerciseId)
      .map((b) => ({
        exerciseId: b.exerciseId,
        sets: b.sets
          .filter((s) => s.reps !== "")
          .map((s) => ({
            reps: Number(s.reps),
            weight: s.weight === "" ? null : Number(s.weight),
          })),
      }))
      .filter((b) => b.sets.length > 0);

    if (payloadBlocks.length === 0) {
      toast.error("Add at least one exercise with a set (reps required).");
      return;
    }

    setIsPending(true);
    try {
      const workoutId = await saveWorkout({ date, notes, blocks: payloadBlocks });
      navigate(`/workouts/${workoutId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save workout");
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How did it feel?"
          rows={2}
        />
      </div>

      {todaysCategories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Today:</span>
          {todaysCategories.map((category) => {
            const { icon: Icon, className } = CATEGORY_STYLE[category];
            return (
              <Badge key={category} className={`gap-1 ${className}`}>
                <Icon className="size-3" />
                {category}
              </Badge>
            );
          })}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {blocks.map((block) => (
          <Card key={block.localId}>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-start gap-2">
                <div className="w-40 shrink-0">
                  <BodyPartPicker
                    value={block.category}
                    onChange={(category) =>
                      updateBlock(block.localId, { category, exerciseId: "" })
                    }
                  />
                </div>
                <div className="flex-1">
                  {block.category ? (
                    <ExercisePicker
                      exercises={exercises}
                      category={block.category}
                      value={block.exerciseId}
                      onChange={(id) =>
                        updateBlock(block.localId, { exerciseId: id })
                      }
                      onCreate={handleCreateExercise}
                    />
                  ) : (
                    <div className="flex h-8 items-center text-sm text-muted-foreground">
                      Pick a body part first
                    </div>
                  )}
                </div>
                {blocks.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBlock(block.localId)}
                  >
                    Remove
                  </Button>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {block.sets.map((set, i) => (
                  <div key={set.localId} className="flex items-center gap-2">
                    <span className="w-5 text-xs text-muted-foreground">
                      {i + 1}
                    </span>
                    <Input
                      type="number"
                      inputMode="decimal"
                      placeholder="Weight"
                      className="w-24"
                      value={set.weight}
                      onChange={(e) =>
                        updateSet(
                          block.localId,
                          set.localId,
                          "weight",
                          e.target.value,
                        )
                      }
                    />
                    <span className="text-muted-foreground">x</span>
                    <Input
                      type="number"
                      inputMode="numeric"
                      placeholder="Reps"
                      className="w-20"
                      value={set.reps}
                      onChange={(e) =>
                        updateSet(
                          block.localId,
                          set.localId,
                          "reps",
                          e.target.value,
                        )
                      }
                    />
                    {block.sets.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSet(block.localId, set.localId)}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="self-start"
                  onClick={() => addSet(block.localId)}
                >
                  + Add set
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button type="button" variant="outline" onClick={addBlock}>
          + Add exercise
        </Button>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save workout"}
      </Button>
    </form>
  );
}
