"use client";

import { useState, useTransition, type ReactNode } from "react";
import { moveItem } from "./actions";

// A private type, so dragged text and links are never mistaken for an item.
const DRAG_TYPE = "application/x-list-item";

/** One item's row on the edit page. Dropping another item's handle here moves that item to this spot. */
export function ItemDropTarget({ id, children }: { id: string; children: ReactNode }) {
  const [over, setOver] = useState(false);
  const [pending, startTransition] = useTransition();
  return (
    <li
      data-drag-item
      onDragOver={(e) => {
        if (!e.dataTransfer.types.includes(DRAG_TYPE)) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setOver(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOver(false);
      }}
      onDrop={(e) => {
        const from = e.dataTransfer.getData(DRAG_TYPE);
        if (!from) return;
        e.preventDefault();
        setOver(false);
        if (from !== id) startTransition(() => moveItem(from, { onto: id }));
      }}
      className={`rounded-2xl ${over ? "outline-2 outline-offset-4 outline-accent" : ""} ${pending ? "opacity-60" : ""}`}
    >
      <ul className="space-y-3">{children}</ul>
    </li>
  );
}

/** The grip to drag an item by. Only the grip is draggable, so text in the edit form can still be selected. */
export function ItemDragHandle({ id }: { id: string }) {
  return (
    <span
      draggable
      aria-hidden // the arrow buttons are the keyboard and screen-reader way to reorder
      title="Drag to reorder"
      onDragStart={(e) => {
        e.dataTransfer.setData(DRAG_TYPE, id);
        e.dataTransfer.effectAllowed = "move";
        const row = e.currentTarget.closest("[data-drag-item]");
        if (row) e.dataTransfer.setDragImage(row, 20, 20);
      }}
      className="inline-flex size-9 cursor-grab items-center justify-center rounded-lg border border-border text-muted select-none hover:border-accent hover:text-foreground active:cursor-grabbing"
    >
      ⠿
    </span>
  );
}
