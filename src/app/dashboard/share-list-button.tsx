"use client";

import { useState } from "react";

/** Copies the list's public link to the clipboard. */
export function ShareListButton({ path, title }: { path: string; title: string }) {
  const [label, setLabel] = useState("Share");
  return (
    <button
      type="button"
      aria-label={`Copy link to ${title}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(new URL(path, location.origin).href);
          setLabel("Link copied");
        } catch {
          setLabel("Couldn't copy");
        }
        setTimeout(() => setLabel("Share"), 2000);
      }}
      className="font-medium text-accent underline-offset-4 hover:underline"
    >
      <span aria-live="polite">{label}</span>
    </button>
  );
}
