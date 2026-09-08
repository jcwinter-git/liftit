import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export function Nav() {
  const navigate = useNavigate();

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link to="/workouts" className="font-semibold">
          LiftIt
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/workouts" className="hover:underline">
            Workouts
          </Link>
          <Link to="/history" className="hover:underline">
            History
          </Link>
          <Button type="button" variant="ghost" size="sm" onClick={handleSignOut}>
            Sign out
          </Button>
        </nav>
      </div>
    </header>
  );
}
