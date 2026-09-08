import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export async function Nav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/workouts" className="font-semibold">
          LiftIt
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/workouts" className="hover:underline">
            Workouts
          </Link>
          <Link href="/history" className="hover:underline">
            History
          </Link>
          <form action="/auth/signout" method="post">
            <Button type="submit" variant="ghost" size="sm">
              Sign out
            </Button>
          </form>
        </nav>
      </div>
    </header>
  );
}
