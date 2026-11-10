import { and, asc, eq, inArray, sql } from "drizzle-orm";
import { cacheTag } from "next/cache";
import { db } from "@/db";
import { items, lists, users } from "@/db/schema";

/** Cache tag for everything shown on a user's public pages. */
export const profileTag = (username: string) => `profile:${username.toLowerCase()}`;

/** A user and their public lists, in profile order. */
export async function getProfile(username: string) {
  "use cache";
  cacheTag(profileTag(username));

  const user = await db.query.users.findFirst({
    where: eq(users.username, username.toLowerCase()),
  });
  if (!user) return null;

  const publicLists = await db
    .select({
      id: lists.id,
      slug: lists.slug,
      title: lists.title,
      description: lists.description,
      isRanked: lists.isRanked,
      tags: lists.tags,
      coverImageUrl: lists.coverImageUrl,
      // Table names are spelled out: Drizzle drops the table prefix from
      // interpolated columns in single-table selects, which would make this
      // compare items.list_id with items.id.
      itemCount: sql<number>`(select count(*)::int from items where items.list_id = lists.id)`,
    })
    .from(lists)
    .where(and(eq(lists.userId, user.id), eq(lists.status, "public")))
    .orderBy(asc(lists.position));

  return { user, lists: publicLists };
}

/** A list anyone with the link may see (public or unlisted), with its items. */
export async function getSharedList(username: string, slug: string) {
  "use cache";
  cacheTag(profileTag(username));

  const user = await db.query.users.findFirst({
    where: eq(users.username, username.toLowerCase()),
  });
  if (!user) return null;

  const list = await db.query.lists.findFirst({
    where: and(
      eq(lists.userId, user.id),
      eq(lists.slug, slug.toLowerCase()),
      inArray(lists.status, ["public", "unlisted"]),
    ),
    with: { items: { orderBy: asc(items.position) } },
  });
  if (!list) return null;

  return { user, list };
}
