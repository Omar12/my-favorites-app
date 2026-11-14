"use client";

import { useActionState, useState } from "react";
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
  const typed = state.values; // set after an error, so nothing typed is lost
  const [editedSince, setEditedSince] = useState<ListFormState>(); // hides "Saved" once the form is touched again
  return (
    <form action={formAction} onInput={() => setEditedSince(state)} className="space-y-4">
      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}

      <label className="block">
        <span className="text-sm font-medium">Name</span>
        <input
          name="title"
          required
          maxLength={200}
          defaultValue={typed?.title ?? item?.title}
          aria-invalid={!!errors.title}
          className={field}
        />
        <FieldError message={errors.title} />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Why I recommend it</span>
        <textarea
          name="note"
          rows={4}
          maxLength={500}
          defaultValue={typed?.note ?? item?.note ?? ""}
          aria-invalid={!!errors.note}
          className={field}
        />
        <FieldError message={errors.note} />
        <span className="mt-1 block text-xs text-muted">Your own words. Readers see this under the name.</span>
      </label>

      {/* Optional extras stay folded so the default path is a name and a reason. */}
      <details open={!!(typed?.url || typed?.imageUrl || item?.url || item?.imageUrl || errors.url || errors.imageUrl)}>
        <summary className="cursor-pointer text-sm font-medium text-muted hover:text-foreground pointer-coarse:py-3">Link and photo</summary>
        <div className="mt-3 space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Link</span>
            <input
              name="url"
              type="url"
              inputMode="url"
              defaultValue={typed?.url ?? item?.url ?? ""}
              aria-invalid={!!errors.url}
              placeholder="https://…"
              className={field}
            />
            <FieldError message={errors.url} />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Photo URL</span>
            <input
              name="imageUrl"
              type="url"
              inputMode="url"
              defaultValue={typed?.imageUrl ?? item?.imageUrl ?? ""}
              aria-invalid={!!errors.imageUrl}
              placeholder="https://…"
              className={field}
            />
            <FieldError message={errors.imageUrl} />
          </label>
        </div>
      </details>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="press rounded-xl bg-accent px-5 py-2.5 font-semibold text-white disabled:opacity-60 dark:text-black"
        >
          {pending ? "Saving…" : item ? "Save item" : "Add item"}
        </button>
        <span role="status" className="text-sm text-muted">
          {state.saved && !pending && editedSince !== state && <span className="pop">{item ? "Saved" : "Added"}</span>}
        </span>
      </div>
    </form>
  );
}
