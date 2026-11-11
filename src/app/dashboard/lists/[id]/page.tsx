import { and, asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { ItemCard } from "@/components/item-card";
import { items, lists } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { addItem, moveItem, updateItem, updateList } from "../../actions";
import { DeleteListButton } from "../../delete-list-button";
import { ItemDragHandle, ItemDropTarget } from "../../item-drag";
import { ItemForm } from "../../item-form";
import { ListForm } from "../../list-form";
import { RemoveItemButton } from "../../remove-item-button";

const arrow =
  "inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted hover:border-accent hover:text-foreground disabled:opacity-30 disabled:hover:border-border";

// Reads the session cookie, so this page is rendered per request.
export const instant = false;

export default async function EditListPage({ params }: PageProps<"/dashboard/lists/[id]">) {
  const user = await requireUser();
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();

  const list = await db.query.lists.findFirst({
    where: and(eq(lists.id, id), eq(lists.userId, user.id)),
    with: { items: { orderBy: asc(items.position) } },
  });
  if (!list) notFound();

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Edit list</h1>
      <ListForm action={updateList.bind(null, list.id)} list={list} username={user.username} />
      <section className="mt-10 border-t border-border pt-6">
        <h2 className="mb-4 text-xl font-bold tracking-tight">Items</h2>
        {list.items.length > 0 && (
          <ul className="mb-6 space-y-3">
            {list.items.map((item, i) => (
              <ItemDropTarget key={item.id} id={item.id}>
                <ItemCard item={item} rank={list.isRanked ? i + 1 : undefined} />
                <li className="flex items-start gap-3">
                  <details className="min-w-0 flex-1">
                    <summary className="cursor-pointer py-2 text-sm font-medium text-accent">Edit {item.title}</summary>
                    <div className="mt-3 mb-4">
                      <ItemForm action={updateItem.bind(null, item.id)} item={item} />
                    </div>
                  </details>
                  <div className="flex shrink-0 items-center gap-3">
                    <RemoveItemButton id={item.id} title={item.title} />
                    <div className="flex gap-1.5">
                      <ItemDragHandle id={item.id} />
                      <form action={moveItem.bind(null, item.id, "up")}>
                        <button className={arrow} disabled={i === 0} aria-label={`Move ${item.title} up`}>
                          ↑
                        </button>
                      </form>
                      <form action={moveItem.bind(null, item.id, "down")}>
                        <button
                          className={arrow}
                          disabled={i === list.items.length - 1}
                          aria-label={`Move ${item.title} down`}
                        >
                          ↓
                        </button>
                      </form>
                    </div>
                  </div>
                </li>
              </ItemDropTarget>
            ))}
          </ul>
        )}
        <h3 className="mb-3 text-base font-semibold">Add an item</h3>
        <ItemForm action={addItem.bind(null, list.id)} />
      </section>
      <div className="mt-10 border-t border-border pt-5">
        <DeleteListButton id={list.id} title={list.title} />
      </div>
    </>
  );
}
