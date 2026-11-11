"use client";

import { useTransition } from "react";
import { removeItem } from "./actions";

export function RemoveItemButton({ id, title }: { id: string; title: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(`Remove "${title}" from this list? This can't be undone.`)) {
          startTransition(() => removeItem(id));
        }
      }}
      className="text-sm font-medium text-red-600 underline-offset-4 hover:underline disabled:opacity-60 dark:text-red-400"
    >
      {pending ? "Removing…" : "Remove"}
    </button>
  );
}
