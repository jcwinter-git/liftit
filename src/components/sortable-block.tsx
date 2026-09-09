import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

export type DragHandleProps = {
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap | undefined;
};

export function SortableBlock({
  id,
  children,
}: {
  id: string;
  children: (handle: DragHandleProps) => React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? "relative z-10 opacity-80" : ""}
    >
      {children({ attributes, listeners })}
    </div>
  );
}
