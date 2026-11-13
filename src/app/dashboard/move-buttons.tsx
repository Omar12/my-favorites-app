"use client";

import { useState, useTransition } from "react";

const button =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-border px-2 text-sm text-muted hover:border-accent hover:text-foreground aria-disabled:opacity-30 aria-disabled:hover:border-border aria-disabled:hover:text-muted pointer-coarse:h-11 pointer-coarse:min-w-11";

type Move = () => Promise<void>;

/** Reorder controls for one row: up, down, and "Top" where a `top` action is given. */
export function MoveButtons({
  title,
  index,
  count,
  up,
  down,
  top,
}: {
  title: string;
  index: number;
  count: number;
  up: Move;
  down: Move;
  top?: Move;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  function move(action: Move, to: number) {
    if (pending || to < 0 || to >= count) return;
    startTransition(async () => {
      await action();
      setMessage(`Moved ${title} to ${to + 1} of ${count}`);
    });
  }

  // aria-disabled, not disabled: a button that disables itself while focused drops keyboard focus.
  return (
    <div className={`flex gap-1.5 ${pending ? "opacity-60" : ""}`}>
      {top && index > 1 && (
        <button
          type="button"
          className={button}
          aria-disabled={pending}
          aria-label={`Move ${title} to the top`}
          onClick={() => move(top, 0)}
        >
          Top
        </button>
      )}
      <button
        type="button"
        className={button}
        aria-disabled={pending || index === 0}
        aria-label={`Move ${title} up`}
        onClick={() => move(up, index - 1)}
      >
        ↑
      </button>
      <button
        type="button"
        className={button}
        aria-disabled={pending || index === count - 1}
        aria-label={`Move ${title} down`}
        onClick={() => move(down, index + 1)}
      >
        ↓
      </button>
      <span role="status" className="sr-only">
        {message}
      </span>
    </div>
  );
}
