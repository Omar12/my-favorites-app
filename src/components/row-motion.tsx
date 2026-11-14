import { ViewTransition, type ReactNode } from "react";

/**
 * Animates a dashboard row when a save changes the list: it grows in when added, fades out
 * when removed, and slides when its neighbours change. Two rows with the same `name` (an
 * item and its "recently removed" entry) morph into each other. Styles are in globals.css.
 */
export function RowMotion({ name, children }: { name?: string; children: ReactNode }) {
  return (
    <ViewTransition name={name} enter="row-in" exit="row-out" update="row-move" share="row-move" default="none">
      {children}
    </ViewTransition>
  );
}
