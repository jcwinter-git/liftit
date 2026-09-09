import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const LONG_PRESS_MS = 450;

// Tap adds an empty set; press and hold offers to copy the previous one, which
// is the common case when you're repeating a weight.
export function AddSetButton({
  onAdd,
  onDuplicate,
  canDuplicate,
}: {
  onAdd: () => void;
  onDuplicate: () => void;
  canDuplicate: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const timerRef = useRef<number | null>(null);
  const heldRef = useRef(false);

  function startPress() {
    if (!canDuplicate) return;
    heldRef.current = false;
    timerRef.current = window.setTimeout(() => {
      heldRef.current = true;
      setMenuOpen(true);
      navigator.vibrate?.(10);
    }, LONG_PRESS_MS);
  }

  function endPress() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  return (
    <Popover open={menuOpen} onOpenChange={setMenuOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          aria-label="Add set"
          className="h-8 w-8 shrink-0 touch-none p-0 text-muted-foreground select-none"
          onPointerDown={startPress}
          onPointerUp={endPress}
          onPointerLeave={endPress}
          onPointerCancel={endPress}
          onContextMenu={(e) => e.preventDefault()}
          onClick={() => {
            // The long press already opened the menu; don't also add a set.
            if (heldRef.current) {
              heldRef.current = false;
              return;
            }
            onAdd();
          }}
        >
          <Plus className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-44 p-1">
        <button
          type="button"
          className="w-full rounded-md px-2 py-2 text-left text-sm hover:bg-accent"
          onClick={() => {
            onDuplicate();
            setMenuOpen(false);
          }}
        >
          Duplicate last set
        </button>
      </PopoverContent>
    </Popover>
  );
}
