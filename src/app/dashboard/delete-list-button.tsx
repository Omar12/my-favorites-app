"use client";

import { useTransition } from "react";
import { deleteList } from "./actions";

export function DeleteListButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => deleteList(id))} // no confirm: it can be restored from the dashboard
      className="tap text-sm font-medium text-red-600 underline-offset-4 hover:underline disabled:opacity-60 dark:text-red-400"
    >
      {pending ? "Deleting…" : "Delete this list"}
    </button>
  );
}
