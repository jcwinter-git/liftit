import type { ExerciseCategory } from "@/lib/types";

// Tile colours are pale fills with dark text on top. Plain text on the page
// background needs its own darker stop, or it washes out — amber especially.
export const CATEGORY_TEXT: Record<ExerciseCategory, string> = {
  Arms: "text-amber-700 dark:text-amber-300",
  Back: "text-blue-700 dark:text-blue-300",
  Chest: "text-rose-700 dark:text-rose-300",
  Legs: "text-green-700 dark:text-green-300",
  Shoulders: "text-purple-700 dark:text-purple-300",
  Abs: "text-teal-700 dark:text-teal-300",
  Other: "text-slate-600 dark:text-slate-300",
};

// Matching hex for chart strokes, which can't take a Tailwind class.
export const CATEGORY_STROKE: Record<ExerciseCategory, string> = {
  Arms: "#b45309",
  Back: "#1d4ed8",
  Chest: "#be123c",
  Legs: "#15803d",
  Shoulders: "#7e22ce",
  Abs: "#0f766e",
  Other: "#475569",
};
