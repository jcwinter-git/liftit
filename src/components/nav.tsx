import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export function Nav() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  async function handleSignOut() {
    setOpen(false);
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              aria-label="Open menu"
              className="h-9 w-9 shrink-0 p-0"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <SheetHeader>
              <SheetTitle className="text-xl">LiftIt</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              <Link
                to="/history"
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm hover:bg-accent"
              >
                History
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-md px-2 py-2 text-left text-sm hover:bg-accent"
              >
                Sign out
              </button>
            </nav>
          </SheetContent>
        </Sheet>

        <Link to="/workouts" className="text-2xl font-semibold tracking-tight">
          LiftIt
        </Link>
      </div>
    </header>
  );
}
