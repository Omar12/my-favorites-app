import { asc, eq, sql } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db";
import { lists } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { moveList, signOut } from "./actions";
import { ShareListButton } from "./share-list-button";

// Reads the session cookie, so this page is rendered per request.
export const instant = false;

const STATUS_STYLE = {
  draft: "border-border text-muted",
  unlisted: "border-amber-500/50 text-amber-700 dark:text-amber-400",
  public: "border-emerald-500/50 text-emerald-700 dark:text-emerald-400",
} as const;

const arrow =
  "inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted hover:border-accent hover:text-foreground disabled:opacity-30 disabled:hover:border-border";

export default async function DashboardPage() {
  const user = await requireUser();
  const myLists = await db
    .select({
      id: lists.id,
      slug: lists.slug,
      title: lists.title,
      status: lists.status,
      itemCount: sql<number>`(select count(*)::int from items where items.list_id = lists.id)`,
    })
    .from(lists)
    .where(eq(lists.userId, user.id))
    .orderBy(asc(lists.position), asc(lists.createdAt));

  return (
    <>
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Your lists</h1>
        <Link
          href="/dashboard/lists/new"
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white dark:text-black"
        >
          New list
        </Link>
      </header>

      {myLists.length === 0 ? (
        <p className="mt-10 text-muted">You don&apos;t have any lists yet. Create your first one.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {myLists.map((list, i) => (
            <li key={list.id} className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
              <div className="min-w-0 flex-1">
                <Link
                  href={`/dashboard/lists/${list.id}`}
                  className="block leading-snug font-semibold break-words underline-offset-4 hover:underline"
                >
                  {list.title}
                </Link>
                <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                  <span className={`rounded-full border px-2 py-0.5 font-medium ${STATUS_STYLE[list.status]}`}>
                    {list.status}
                  </span>
                  <span>
                    {list.itemCount} {list.itemCount === 1 ? "item" : "items"}
                  </span>
                  {list.status !== "draft" && (
                    <>
                      <Link
                        href={`/${user.username}/${list.slug}`}
                        className="text-accent underline-offset-4 hover:underline"
                      >
                        View
                      </Link>
                      <ShareListButton path={`/${user.username}/${list.slug}`} title={list.title} />
                    </>
                  )}
                </p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <form action={moveList.bind(null, list.id, "up")}>
                  <button className={arrow} disabled={i === 0} aria-label={`Move ${list.title} up`}>
                    ↑
                  </button>
                </form>
                <form action={moveList.bind(null, list.id, "down")}>
                  <button className={arrow} disabled={i === myLists.length - 1} aria-label={`Move ${list.title} down`}>
                    ↓
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}

      <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5 text-sm text-muted">
        <span>
          Signed in as {user.email} ·{" "}
          <Link href={`/${user.username}`} className="text-accent underline-offset-4 hover:underline">
            View profile
          </Link>
        </span>
        <form action={signOut}>
          <button className="font-medium underline-offset-4 hover:text-foreground hover:underline">Sign out</button>
        </form>
      </footer>
    </>
  );
}
