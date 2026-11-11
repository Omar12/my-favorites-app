import { requireUser } from "@/lib/session";
import { createList } from "../../actions";
import { ListForm } from "../../list-form";

// Reads the session cookie, so this page is rendered per request.
export const instant = false;

export default async function NewListPage() {
  const user = await requireUser();
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">New list</h1>
      <ListForm action={createList} username={user.username} />
    </>
  );
}
