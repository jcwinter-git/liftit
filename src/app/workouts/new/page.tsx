import { createClient } from "@/lib/supabase/server";
import { WorkoutForm } from "@/components/workout-form";

export default async function NewWorkoutPage() {
  const supabase = await createClient();
  const { data: exercises } = await supabase
    .from("exercises")
    .select("id, name")
    .order("name");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">New workout</h1>
      <WorkoutForm initialExercises={exercises ?? []} />
    </div>
  );
}
