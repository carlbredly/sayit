"use client";

import { useMemo, useState, useTransition } from "react";
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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, MessageCircle } from "lucide-react";
import type { SerializedDedication } from "@/lib/serialize";
import { reorderLiveQueue } from "@/app/actions/admin";
import { StatusBadge } from "@/components/admin/status-badge";
import { toWhatsAppLink, fillWhatsAppTemplate } from "@/lib/whatsapp";
import type { DedicationStatus } from "@/lib/constants";

function SortableRow({
  item,
  wa,
}: {
  item: SerializedDedication;
  wa: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id,
  });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4"
    >
      <button
        type="button"
        className="mt-1 cursor-grab text-muted-foreground"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-display text-lg font-semibold">{item.recipientName} ❤️</p>
          <StatusBadge status={item.status as DedicationStatus} />
        </div>
        <p className="text-sm text-muted-foreground">
          From {item.isAnonymous ? "Anonymous" : item.senderName}
        </p>
        <p className="mt-2 line-clamp-2 text-sm">{item.dedicationMessage}</p>
        {item.adminNotes ? (
          <p className="mt-2 text-xs text-amber-300">Note: {item.adminNotes}</p>
        ) : null}
      </div>
      <a
        href={wa}
        target="_blank"
        rel="noreferrer"
        className="rounded-lg border border-border p-2 text-success"
        aria-label="Open WhatsApp"
      >
        <MessageCircle className="size-4" />
      </a>
    </li>
  );
}

export function LiveQueueList({
  items,
  showName,
  whatsappTemplate,
}: {
  items: SerializedDedication[];
  showName: string;
  whatsappTemplate: string;
}) {
  const [queue, setQueue] = useState(items);
  const [, start] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const ids = useMemo(() => queue.map((item) => item.id), [queue]);

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = queue.findIndex((item) => item.id === active.id);
    const newIndex = queue.findIndex((item) => item.id === over.id);
    const next = arrayMove(queue, oldIndex, newIndex);
    setQueue(next);
    start(() => reorderLiveQueue(next.map((item) => item.id)));
  }

  if (queue.length === 0) {
    return (
      <p className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
        Approve dedications to build tonight&apos;s queue.
      </p>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <ol className="space-y-3">
          {queue.map((item, index) => (
            <div key={item.id} className="flex items-start gap-3">
              <span className="mt-5 w-6 text-sm text-muted-foreground">{index + 1}</span>
              <div className="flex-1">
                <SortableRow
                  item={item}
                  wa={toWhatsAppLink(
                    item.recipientWhatsapp,
                    fillWhatsAppTemplate(whatsappTemplate, showName)
                  )}
                />
              </div>
            </div>
          ))}
        </ol>
      </SortableContext>
    </DndContext>
  );
}
