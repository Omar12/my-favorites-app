"use client";

import { useState } from "react";

/** Shares the list's public link: the native share sheet where there is one, otherwise the clipboard. */
export function ShareListButton({
  path,
  title,
  label: idle = "Share",
  className = "tap font-medium text-accent underline-offset-4 hover:underline",
}: {
  path: string;
  title: string;
  label?: string;
  className?: string;
}) {
  const [label, setLabel] = useState(idle);
  return (
    <button
      type="button"
      aria-label={`Share ${title}`}
      onClick={async () => {
        const url = new URL(path, location.origin).href;
        try {
          if (navigator.share) return await navigator.share({ title, url });
          await navigator.clipboard.writeText(url);
          setLabel("Link copied");
        } catch (e) {
          // Closing the share sheet is not a failure.
          if (e instanceof DOMException && e.name === "AbortError") return;
          setLabel("Couldn't share");
        }
        setTimeout(() => setLabel(idle), 2000);
      }}
      className={className}
    >
      <span aria-live="polite">{label}</span>
    </button>
  );
}
