"use client";

import { useActionState } from "react";
import type { Item } from "@/db/schema";
import type { ListFormState } from "./actions";
import { field, FieldError } from "./list-form";

export function ItemForm({
  action,
  item,
}: {
  item?: Item;
  action: (prev: ListFormState, formData: FormData) => Promise<ListFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const errors = state.fieldErrors ?? {};
  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}

      <label className="block">
        <span className="text-sm font-medium">Name</span>
        <input name="title" required maxLength={200} defaultValue={item?.title} className={field} />
        <FieldError message={errors.title} />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Short description</span>
        <textarea name="note" rows={2} maxLength={500} defaultValue={item?.note ?? ""} className={field} />
        <FieldError message={errors.note} />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Link</span>
        <input name="url" type="url" inputMode="url" defaultValue={item?.url ?? ""} placeholder="https://…" className={field} />
        <FieldError message={errors.url} />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Photo URL</span>
        <input
          name="imageUrl"
          type="url"
          inputMode="url"
          defaultValue={item?.imageUrl ?? ""}
          placeholder="https://…"
          className={field}
        />
        <FieldError message={errors.imageUrl} />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-accent px-5 py-2.5 font-semibold text-white disabled:opacity-60 dark:text-black"
      >
        {pending ? "Saving…" : item ? "Save item" : "Add item"}
      </button>
    </form>
  );
}
