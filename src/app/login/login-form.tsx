"use client";

import { useActionState } from "react";
import { type LoginState, requestSignInLink } from "./actions";

const initial: LoginState = { status: "idle" };

export function LoginForm() {
  const [state, action, pending] = useActionState(requestSignInLink, initial);

  if (state.status === "sent") {
    return (
      <p role="status" className="rounded-2xl border border-border bg-surface p-4 leading-relaxed">
        Check your inbox. If that address has an account, a sign-in link is on its way. It expires in 10
        minutes.
      </p>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium">Email</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          autoFocus
          className="mt-1 block w-full rounded-xl border border-field bg-surface px-3 py-2.5 text-base focus:border-accent"
        />
      </label>
      {state.status === "error" && (
        <p role="alert" className="text-sm text-danger">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-accent px-4 py-2.5 font-semibold text-white disabled:opacity-60 dark:text-black"
      >
        {pending ? "Sending…" : "Email me a sign-in link"}
      </button>
    </form>
  );
}
