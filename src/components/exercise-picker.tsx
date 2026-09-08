"use client";

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
import type { Exercise } from "@/lib/types";

const CREATE_NEW = "__create_new__";

export function ExercisePicker({
  exercises,
  value,
  onChange,
  onCreate,
}: {
  exercises: Exercise[];
  value: string;
  onChange: (id: string) => void;
  onCreate: (name: string) => Promise<Exercise>;
}) {
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setSaving(true);
    setError(null);
    try {
      const exercise = await onCreate(trimmed);
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
            autoFocus
            placeholder="New exercise name"
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
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select exercise" />
      </SelectTrigger>
      <SelectContent>
        {exercises.map((ex) => (
          <SelectItem key={ex.id} value={ex.id}>
            {ex.name}
          </SelectItem>
        ))}
        <SelectSeparator />
        <SelectItem value={CREATE_NEW}>+ Add new exercise</SelectItem>
      </SelectContent>
    </Select>
  );
}
