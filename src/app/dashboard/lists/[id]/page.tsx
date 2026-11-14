import { and, asc, eq, isNull } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { ItemCard } from "@/components/item-card";
import { RowMotion } from "@/components/row-motion";
import { items, lists } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { addItem, moveItem, restoreItem, updateItem, updateList } from "../../actions";
import { DeleteListButton } from "../../delete-list-button";
import { ItemDragHandle, ItemDropTarget } from "../../item-drag";
import { ItemForm } from "../../item-form";
import { ListForm } from "../../list-form";
import { MoveButtons } from "../../move-buttons";
import { RemoveItemButton } from "../../remove-item-button";
import { ShareListButton } from "../../share-list-button";

// Reads the session cookie, so this page is rendered per request.
export const instant = false;

export default async function EditListPage({ params }: PageProps<"/dashboard/lists/[id]">) {
  const user = await requireUser();
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();

  const list = await db.query.lists.findFirst({
    where: and(eq(lists.id, id), eq(lists.userId, user.id), isNull(lists.deletedAt)),
    with: { items: { orderBy: asc(items.position) } },
  });
  if (!list) notFound();
  const live = list.items.filter((item) => !item.deletedAt);
  const removed = list.items.filter((item) => item.deletedAt);

  return (
    <>
      <Link href="/dashboard" className="tap text-sm font-medium text-muted underline-offset-4 hover:text-foreground hover:underline">
        ← Your lists
      </Link>
      <header className="mt-3 mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-balance break-words">{list.title}</h1>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
          <span className="capitalize">{list.status}</span>
          {list.status !== "draft" && (
            <>
              <span className="break-all">
                /{user.username}/{list.slug}
              </span>
              <Link href={`/${user.username}/${list.slug}`} className="tap text-accent underline-offset-4 hover:underline">
                View
              </Link>
              <ShareListButton path={`/${user.username}/${list.slug}`} title={list.title} />
            </>
          )}
          {live.length > 0 && (
            <a href="#add-item" className="tap text-accent underline-offset-4 hover:underline">
              Add an item
            </a>
          )}
        </p>
      </header>
      <section>
        <h2 className="mb-4 text-xl font-bold tracking-tight">Items</h2>
        {live.length > 0 && (
          <ul className="mb-8 space-y-6">
            {live.map((item, i) => (
              <RowMotion key={item.id} name={`item-${item.id}`}>
                <ItemDropTarget id={item.id}>
                  <ItemCard item={item} rank={list.isRanked ? i + 1 : undefined} heading="h3" />
                  <li className="relative">
                    {/* The summary leaves room on the right for the reorder buttons, so the open panel gets the full width. */}
                    <details>
                      <summary className="cursor-pointer py-2 pr-44 text-sm font-medium text-accent pointer-coarse:py-3 pointer-coarse:pr-40">
                        Edit {item.title}
                      </summary>
                      <div className="mt-3 mb-4">
                        <ItemForm action={updateItem.bind(null, item.id)} item={item} />
                        {/* Kept inside the panel, away from the reorder buttons, so it can't be hit by accident. */}
                        <div className="mt-4">
                          <RemoveItemButton id={item.id} title={item.title} />
                        </div>
                      </div>
                    </details>
                    <div className="absolute top-0 right-0 flex gap-1.5">
                      <ItemDragHandle id={item.id} />
                      <MoveButtons
                        title={item.title}
                        index={i}
                        count={live.length}
                        up={moveItem.bind(null, item.id, "up")}
                        down={moveItem.bind(null, item.id, "down")}
                        top={moveItem.bind(null, item.id, { onto: live[0].id })}
                      />
                    </div>
                  </li>
                </ItemDropTarget>
              </RowMotion>
            ))}
          </ul>
        )}
        {live.length === 0 && (
          <p className="mb-6 text-muted">Nothing on this list yet. Add the first thing you&apos;d recommend, and say why.</p>
        )}
        <RowMotion>
          <div>
            <h2 id="add-item" className="mb-4 scroll-mt-6 text-xl font-bold tracking-tight">
              Add an item
            </h2>
            <ItemForm action={addItem.bind(null, list.id)} />
          </div>
        </RowMotion>
        {removed.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-semibold">Recently removed</h2>
            <p className="mt-1 text-xs text-muted">Kept for 30 days, then gone for good.</p>
            <ul className="mt-2 divide-y divide-border">
              {removed.map((item) => (
                <RowMotion key={item.id} name={`item-${item.id}`}>
                  <li className="flex items-center justify-between gap-3 py-1.5">
                    <span className="min-w-0 text-sm break-words text-muted">{item.title}</span>
                    <form action={restoreItem.bind(null, item.id)}>
                      <button
                        className="tap text-sm font-medium text-accent underline-offset-4 hover:underline"
                        aria-label={`Restore ${item.title}`}
                      >
                        Restore
                      </button>
                    </form>
                  </li>
                </RowMotion>
              ))}
            </ul>
          </div>
        )}
      </section>
      <details className="mt-10 border-t border-border pt-4">
        <summary className="cursor-pointer py-2 pointer-coarse:py-3 text-xl font-bold tracking-tight">List settings</summary>
        <div className="mt-4">
          <ListForm action={updateList.bind(null, list.id)} list={list} username={user.username} />
          <div className="mt-8 border-t border-border pt-5">
            <DeleteListButton id={list.id} />
            <p className="mt-1 text-xs text-muted">
              Takes the list and its {live.length === 1 ? "1 item" : `${live.length} items`} offline. You can restore it
              from your lists for 30 days.
            </p>
          </div>
        </div>
      </details>
    </>
  );
}
