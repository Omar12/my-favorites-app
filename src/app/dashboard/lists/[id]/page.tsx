import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { lists } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { updateList } from "../../actions";
import { DeleteListButton } from "../../delete-list-button";
import { ListForm } from "../../list-form";

// Reads the session cookie, so this page is rendered per request.
export const instant = false;

export default async function EditListPage({ params }: PageProps<"/dashboard/lists/[id]">) {
  const user = await requireUser();
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();

  const list = await db.query.lists.findFirst({
    where: and(eq(lists.id, id), eq(lists.userId, user.id)),
  });
  if (!list) notFound();

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Edit list</h1>
      <ListForm action={updateList.bind(null, list.id)} list={list} username={user.username} />
      <div className="mt-10 border-t border-border pt-5">
        <DeleteListButton id={list.id} title={list.title} />
      </div>
    </>
  );
}
