"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { List } from "@/db/schema";
import type { ListFormState } from "./actions";

export const field =
  "mt-1 block w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-base outline-none focus:border-accent";

const STATUS_HELP = [
  ["draft", "Draft", "only you can see it"],
  ["unlisted", "Unlisted", "anyone with the link, hidden from your profile"],
  ["public", "Public", "shown on your profile"],
] as const;

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400">
      {message}
    </p>
  );
}

export function ListForm({
  action,
  list,
  username,
}: {
  action: (prev: ListFormState, formData: FormData) => Promise<ListFormState>;
  list?: List;
  username: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const errors = state.fieldErrors ?? {};
  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}

      <label className="block">
        <span className="text-sm font-medium">Title</span>
        <input name="title" required maxLength={120} defaultValue={list?.title} className={field} />
        <FieldError message={errors.title} />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Link</span>
        <span className="mt-1 flex items-center gap-1">
          <span className="shrink-0 text-sm text-muted">/{username}/</span>
          <input
            name="slug"
            maxLength={60}
            defaultValue={list?.slug}
            placeholder="made from the title if left blank"
            autoCapitalize="none"
            className={`${field} mt-0`}
          />
        </span>
        <FieldError message={errors.slug} />
        {list && list.status !== "draft" && (
          <span className="mt-1 block text-xs text-muted">Changing this breaks links you&apos;ve already shared.</span>
        )}
      </label>

      <label className="block">
        <span className="text-sm font-medium">Description</span>
        <textarea
          name="description"
          rows={3}
          maxLength={1000}
          defaultValue={list?.description ?? ""}
          className={field}
        />
        <FieldError message={errors.description} />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Tags</span>
        <input
          name="tags"
          defaultValue={list?.tags.join(", ")}
          placeholder="food, japan, travel"
          autoCapitalize="none"
          className={field}
        />
        <span className="mt-1 block text-xs text-muted">Separate with commas.</span>
      </label>

      <label className="block">
        <span className="text-sm font-medium">Cover image URL</span>
        <input
          name="coverImageUrl"
          type="url"
          inputMode="url"
          defaultValue={list?.coverImageUrl ?? ""}
          placeholder="https://…"
          className={field}
        />
        <FieldError message={errors.coverImageUrl} />
        <span className="mt-1 block text-xs text-muted">Optional. Used when the list is shared.</span>
      </label>

      <label className="flex items-start gap-3">
        <input type="checkbox" name="isRanked" defaultChecked={list?.isRanked} className="mt-1 size-4 accent-accent" />
        <span>
          <span className="text-sm font-medium">Ranked list</span>
          <span className="block text-xs text-muted">Number the items, best first (a &quot;top 5&quot;).</span>
        </span>
      </label>

      <fieldset>
        <legend className="text-sm font-medium">Who can see it</legend>
        <div className="mt-2 space-y-2">
          {STATUS_HELP.map(([value, label, help]) => (
            <label key={value} className="flex items-start gap-3">
              <input
                type="radio"
                name="status"
                value={value}
                defaultChecked={(list?.status ?? "draft") === value}
                className="mt-1 size-4 accent-accent"
              />
              <span className="text-sm">
                <span className="font-medium">{label}</span>
                <span className="text-muted">: {help}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-accent px-5 py-2.5 font-semibold text-white disabled:opacity-60 dark:text-black"
        >
          {pending ? "Saving…" : list ? "Save changes" : "Create list"}
        </button>
        <Link href="/dashboard" className="text-sm font-medium text-muted hover:text-foreground">
          Cancel
        </Link>
      </div>
    </form>
  );
}
