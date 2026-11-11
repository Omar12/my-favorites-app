import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

// Reads the session cookie, so this page is rendered per request.
export const instant = false;

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  if (await getCurrentUser()) redirect("/dashboard");
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-sm pt-10">
      <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
      <p className="mt-2 mb-6 text-muted">We&apos;ll email you a link. No password needed.</p>
      {error && (
        <p role="alert" className="mb-4 text-sm text-red-600 dark:text-red-400">
          That link has expired or was already used. Request a new one.
        </p>
      )}
      <LoginForm />
    </div>
  );
}
