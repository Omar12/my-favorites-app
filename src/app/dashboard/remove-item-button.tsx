"use client";

import { useTransition } from "react";
import { removeItem } from "./actions";

export function RemoveItemButton({ id, title }: { id: string; title: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      aria-label={`Remove ${title}`}
      onClick={() => startTransition(() => removeItem(id))} // no confirm: it can be restored below the list
      className="tap text-sm font-medium text-red-600 underline-offset-4 hover:underline disabled:opacity-60 dark:text-red-400"
    >
      {pending ? "Removing…" : "Remove"}
    </button>
  );
}
