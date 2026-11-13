import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/session";
import { createList } from "../../actions";
import { ListForm } from "../../list-form";

export const metadata: Metadata = { title: "New list" };

// Reads the session cookie, so this page is rendered per request.
export const instant = false;

export default async function NewListPage() {
  const user = await requireUser();
  return (
    <>
      <Link href="/dashboard" className="tap text-sm font-medium text-muted underline-offset-4 hover:text-foreground hover:underline">
        ← Your lists
      </Link>
      <h1 className="mt-3 mb-6 text-2xl font-bold tracking-tight">New list</h1>
      <ListForm action={createList} username={user.username} />
    </>
  );
}
