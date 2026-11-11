"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";

export type LoginState = { status: "idle" | "sent" | "error"; message?: string };

export async function requestSignInLink(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = z.email().safeParse(String(formData.get("email") ?? "").trim().toLowerCase());
  if (!email.success) return { status: "error", message: "Enter a valid email address." };

  try {
    await auth.api.signInMagicLink({
      body: { email: email.data, callbackURL: "/dashboard", errorCallbackURL: "/login?error=link" },
      headers: await headers(),
    });
  } catch (err) {
    console.error("Sign-in link request failed:", err);
    return { status: "error", message: "Couldn't send the link. Try again in a minute." };
  }
  // Same answer whether or not the address has an account.
  return { status: "sent" };
}
