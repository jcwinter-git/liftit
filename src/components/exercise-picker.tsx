import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Exercise, ExerciseCategory } from "@/lib/types";

const CREATE_NEW = "__create_new__";

export function ExercisePicker({
  exercises,
  category,
  value,
  onChange,
  onCreate,
}: {
  exercises: Exercise[];
  category: ExerciseCategory;
  value: string;
  onChange: (id: string) => void;
  onCreate: (name: string, category: ExerciseCategory) => Promise<Exercise>;
}) {
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = exercises.filter((ex) => ex.category === category);

  async function handleCreate() {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setSaving(true);
    setError(null);
    try {
      const exercise = await onCreate(trimmed, category);
      onChange(exercise.id);
      setCreating(false);
      setNewName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add exercise");
    } finally {
      setSaving(false);
    }
  }

  if (creating) {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex gap-2">
          <Input
            className="h-11 text-base"
            autoFocus
            placeholder={`New ${category.toLowerCase()} exercise name`}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleCreate();
              }
              if (e.key === "Escape") {
                setCreating(false);
                setNewName("");
              }
            }}
          />
          <Button
            type="button"
            size="sm"
            onClick={handleCreate}
            disabled={saving || !newName.trim()}
          >
            Add
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => {
              setCreating(false);
              setNewName("");
            }}
          >
            Cancel
          </Button>
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <Select
      value={value}
      onValueChange={(v) => {
        if (v === CREATE_NEW) {
          setCreating(true);
          return;
        }
        onChange(v);
      }}
    >
      <SelectTrigger className="h-11 w-full text-base">
        <SelectValue placeholder={`Select ${category.toLowerCase()} exercise`} />
      </SelectTrigger>
      <SelectContent>
        {filtered.map((ex) => (
          <SelectItem key={ex.id} value={ex.id}>
            {ex.name}
          </SelectItem>
        ))}
        {filtered.length > 0 && <SelectSeparator />}
        <SelectItem value={CREATE_NEW}>+ Add new {category.toLowerCase()} exercise</SelectItem>
      </SelectContent>
    </Select>
  );
}
