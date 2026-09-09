import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { GripVertical, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExercisePicker } from "@/components/exercise-picker";
import { BodyPartPicker, CATEGORY_STYLE } from "@/components/body-part-picker";
import { TargetsDialog } from "@/components/targets-dialog";
import { BeatBar } from "@/components/beat-bar";
import { AddSetButton } from "@/components/add-set-button";
import { SortableBlock } from "@/components/sortable-block";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { createExercise, saveWorkout, updateWorkout } from "@/lib/api/workouts";
import { defaultExerciseId } from "@/lib/exercise-defaults";
import { type ExerciseStats } from "@/lib/volume";
import {
  emptyBlock,
  emptySet,
  uid,
  type Block,
} from "@/lib/workout-blocks";
import type { Exercise, ExerciseCategory } from "@/lib/types";

function todayLocal() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

export function WorkoutForm({
  initialExercises,
  exerciseStats,
  mode = "create",
  workoutId,
  initialDate,
  initialNotes = "",
  initialBlocks,
  onCancel,
  onSaved,
}: {
  initialExercises: Exercise[];
  exerciseStats: Record<string, ExerciseStats>;
  mode?: "create" | "edit";
  workoutId?: string;
  initialDate?: string;
  initialNotes?: string;
  initialBlocks?: Block[];
  onCancel: () => void;
  onSaved: (workoutId: string) => void;
}) {
  const isEdit = mode === "edit";
  const [exercises, setExercises] = useState(initialExercises);
  const [date, setDate] = useState(initialDate ?? todayLocal());
  const [notes, setNotes] = useState(initialNotes);
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks ?? [emptyBlock()]);
  const [isPending, setIsPending] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [targetsOpen, setTargetsOpen] = useState(!isEdit);

  // The cancel speedbump shouldn't stay armed indefinitely.
  useEffect(() => {
    if (!confirmCancel) return;
    const timer = setTimeout(() => setConfirmCancel(false), 4000);
    return () => clearTimeout(timer);
  }, [confirmCancel]);

  // A small drag threshold so tapping the handle doesn't start a drag, and
  // typing in the inputs is never intercepted.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const todaysCategories = useMemo(
    () =>
      Array.from(
        new Set(blocks.map((b) => b.category).filter((c): c is ExerciseCategory => !!c)),
      ),
    [blocks],
  );

  function blockForCategory(category: ExerciseCategory): Block {
    return {
      localId: uid(),
      category,
      exerciseId: defaultExerciseId(category, exercises),
      sets: [emptySet()],
    };
  }

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

  function duplicateLastSet(blockId: string) {
    setBlocks((bs) =>
      bs.map((b) => {
        if (b.localId !== blockId || b.sets.length === 0) return b;
        // Copy the last set that actually has something in it — the trailing
        // row is often a blank one you just added.
        const source =
          [...b.sets].reverse().find((x) => x.weight.trim() || x.reps.trim()) ??
          b.sets[b.sets.length - 1];
        return {
          ...b,
          sets: [...b.sets, { ...source, localId: uid() }],
        };
      }),
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setBlocks((bs) => {
      const from = bs.findIndex((b) => b.localId === active.id);
      const to = bs.findIndex((b) => b.localId === over.id);
      return from === -1 || to === -1 ? bs : arrayMove(bs, from, to);
    });
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
      if (isEdit && workoutId) {
        await updateWorkout(workoutId, { date, notes, blocks: payloadBlocks });
        onSaved(workoutId);
      } else {
        const newId = await saveWorkout({ date, notes, blocks: payloadBlocks });
        onSaved(newId);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save workout");
      setIsPending(false);
    }
  }

  return (
    <>
      {!isEdit && (
        <TargetsDialog
          open={targetsOpen}
          onOpenChange={setTargetsOpen}
          onConfirm={(categories) => {
            if (categories.length > 0) setBlocks(categories.map(blockForCategory));
            setTargetsOpen(false);
          }}
        />
      )}

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

        {todaysCategories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {isEdit ? "Trained:" : "Today:"}
            </span>
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={blocks.map((b) => b.localId)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-4">
          {blocks.map((block) => {
            const stats = block.exerciseId
              ? exerciseStats[block.exerciseId]
              : undefined;
            const hasWeight = block.sets.some((s) => s.weight.trim() !== "");
            const hasReps = block.sets.some((s) => s.reps.trim() !== "");
            // Before anything is typed, match the unit this exercise is usually
            // logged in so the current and previous figures read the same way.
            const weighted = hasWeight || (!hasReps && (stats?.weighted ?? false));
            const currentValue = block.sets.reduce((sum, s) => {
              const reps = Number(s.reps) || 0;
              return sum + (weighted ? (Number(s.weight) || 0) * reps : reps);
            }, 0);

            return (
              <SortableBlock key={block.localId} id={block.localId}>
                {({ attributes, listeners }) => (
              <Card className="relative">
                <button
                  type="button"
                  aria-label="Reorder exercise"
                  className="absolute left-1 top-1/2 -translate-y-1/2 cursor-grab touch-none p-1 text-muted-foreground/50 active:cursor-grabbing"
                  {...attributes}
                  {...listeners}
                >
                  <GripVertical className="size-4" />
                </button>
                {blocks.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    aria-label="Remove exercise"
                    className="absolute right-2 top-2 h-7 w-7 p-0"
                    onClick={() => removeBlock(block.localId)}
                  >
                    <X className="size-4" />
                  </Button>
                )}

                <CardContent className="flex flex-col gap-3 pl-6">
                  <div className="flex items-start gap-2 pr-6">
                    <div className="w-32 shrink-0">
                      <BodyPartPicker
                        value={block.category}
                        onChange={(category) =>
                          updateBlock(block.localId, {
                            category,
                            exerciseId: defaultExerciseId(category, exercises),
                          })
                        }
                      />
                    </div>
                    <div className="min-w-0 flex-1">
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
                  </div>

                  <div className="flex flex-col gap-2">
                    {block.sets.map((set, i) => (
                      <div key={set.localId} className="flex items-center gap-2">
                        <span className="w-4 text-xs text-muted-foreground">
                          {i + 1}
                        </span>
                        <Input
                          type="number"
                          inputMode="decimal"
                          placeholder="Weight"
                          className="w-20"
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
                          className="w-16"
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
                            aria-label="Remove set"
                            className="h-8 w-8 shrink-0 p-0"
                            onClick={() => removeSet(block.localId, set.localId)}
                          >
                            <X className="size-3.5" />
                          </Button>
                        )}
                        {i === block.sets.length - 1 && (
                          <AddSetButton
                            onAdd={() => addSet(block.localId)}
                            onDuplicate={() => duplicateLastSet(block.localId)}
                            canDuplicate={block.sets.some(
                              (x) => x.weight.trim() !== "" || x.reps.trim() !== "",
                            )}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {block.exerciseId && stats?.prev && (
                    <BeatBar
                      current={currentValue}
                      prev={
                        stats.prev.weighted
                          ? stats.prev.volume
                          : stats.prev.totalReps
                      }
                      max={
                        stats.max
                          ? stats.max.weighted
                            ? stats.max.volume
                            : stats.max.totalReps
                          : null
                      }
                    />
                  )}
                </CardContent>
              </Card>
                )}
              </SortableBlock>
            );
          })}
              </div>
            </SortableContext>
          </DndContext>

          <Button type="button" variant="outline" onClick={addBlock}>
            + Add exercise
          </Button>
        </div>

        {isEdit && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did it feel?"
              rows={3}
            />
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              if (confirmCancel) onCancel();
              else setConfirmCancel(true);
            }}
          >
            {/* Colour sits on the label: the button's own stylesheet wins over a
                text-* utility applied to the button element. */}
            {confirmCancel ? (
              <span className="text-red-600 dark:text-red-400">Confirm?</span>
            ) : (
              "Cancel"
            )}
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-sky-500 text-white hover:bg-sky-600"
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </>
  );
}
