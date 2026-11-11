"use client";

import { useTransition } from "react";
import { deleteList } from "./actions";

export function DeleteListButton({ id, title }: { id: string; title: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(`Delete "${title}" and everything on it? This can't be undone.`)) {
          startTransition(() => deleteList(id));
        }
      }}
      className="text-sm font-medium text-red-600 underline-offset-4 hover:underline disabled:opacity-60 dark:text-red-400"
    >
      {pending ? "Deleting…" : "Delete this list"}
    </button>
  );
}
