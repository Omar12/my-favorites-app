import { and, asc, desc, eq, isNotNull, isNull, sql } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db";
import { lists } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { moveList, restoreList, signOut } from "./actions";
import { MoveButtons } from "./move-buttons";
import { ShareListButton } from "./share-list-button";

// Reads the session cookie, so this page is rendered per request.
export const instant = false;

const STATUS_STYLE = {
  draft: "border-border text-muted",
  unlisted: "border-amber-500/50 text-amber-700 dark:text-amber-400",
  public: "border-emerald-500/50 text-emerald-700 dark:text-emerald-400",
} as const;

export default async function DashboardPage() {
  const user = await requireUser();
  const myLists = await db
    .select({
      id: lists.id,
      slug: lists.slug,
      title: lists.title,
      status: lists.status,
      itemCount: sql<number>`(select count(*)::int from items where items.list_id = lists.id and items.deleted_at is null)`,
    })
    .from(lists)
    .where(and(eq(lists.userId, user.id), isNull(lists.deletedAt)))
    .orderBy(asc(lists.position), asc(lists.createdAt));
  const deletedLists = await db
    .select({ id: lists.id, title: lists.title })
    .from(lists)
    .where(and(eq(lists.userId, user.id), isNotNull(lists.deletedAt)))
    .orderBy(desc(lists.deletedAt));

  return (
    <>
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Your lists</h1>
        <Link
          href="/dashboard/lists/new"
          className="tap rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white dark:text-black"
        >
          New list
        </Link>
      </header>

      {myLists.length === 0 ? (
        <p className="mt-10 text-muted">
          You don&apos;t have any lists yet.{" "}
          <Link href="/dashboard/lists/new" className="tap text-accent underline-offset-4 hover:underline">
            Create your first one
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {myLists.map((list, i) => (
            <li key={list.id} className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
              <div className="min-w-0 flex-1">
                <Link
                  href={`/dashboard/lists/${list.id}`}
                  className="block leading-snug font-semibold break-words underline-offset-4 hover:underline pointer-coarse:py-3"
                >
                  {list.title}
                </Link>
                <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                  <span className={`rounded-full border px-2 py-0.5 font-medium capitalize ${STATUS_STYLE[list.status]}`}>
                    {list.status}
                  </span>
                  <span>
                    {list.itemCount} {list.itemCount === 1 ? "item" : "items"}
                  </span>
                  {list.status !== "draft" && (
                    <span className="flex gap-x-2">
                      <Link
                        href={`/${user.username}/${list.slug}`}
                        className="tap text-accent underline-offset-4 hover:underline"
                      >
                        View
                      </Link>
                      <ShareListButton path={`/${user.username}/${list.slug}`} title={list.title} />
                    </span>
                  )}
                </p>
              </div>
              <div className="shrink-0">
                <MoveButtons
                  title={list.title}
                  index={i}
                  count={myLists.length}
                  up={moveList.bind(null, list.id, "up")}
                  down={moveList.bind(null, list.id, "down")}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      {deletedLists.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-semibold">Recently deleted</h2>
          <p className="mt-1 text-xs text-muted">Kept for 30 days, then gone for good.</p>
          <ul className="mt-2 divide-y divide-border">
            {deletedLists.map((list) => (
              <li key={list.id} className="flex items-center justify-between gap-3 py-1.5">
                <span className="min-w-0 text-sm break-words text-muted">{list.title}</span>
                <form action={restoreList.bind(null, list.id)}>
                  <button
                    className="tap text-sm font-medium text-accent underline-offset-4 hover:underline"
                    aria-label={`Restore ${list.title}`}
                  >
                    Restore
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5 text-sm text-muted">
        <span>
          Signed in as {user.email} ·{" "}
          <Link href={`/${user.username}`} className="tap text-accent underline-offset-4 hover:underline">
            View profile
          </Link>
        </span>
        <form action={signOut}>
          <button className="tap font-medium underline-offset-4 hover:text-foreground hover:underline">Sign out</button>
        </form>
      </footer>
    </>
  );
}
