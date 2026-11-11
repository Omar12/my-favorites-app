"use server";

import { and, asc, eq, sql } from "drizzle-orm";
import { updateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { lists } from "@/db/schema";
import { auth } from "@/lib/auth";
import { profileTag } from "@/lib/queries";
import { requireUser } from "@/lib/session";
import { RESERVED_SLUGS, slugify } from "@/lib/slug";

export type ListFormState = { error?: string; fieldErrors?: Record<string, string> };

const optionalUrl = z
  .string()
  .trim()
  .max(2000)
  .refine((v) => v === "" || /^https?:\/\//i.test(v), "Must start with http:// or https://");

const listSchema = z.object({
  title: z.string().trim().min(1, "Give the list a title.").max(120, "Keep the title under 120 characters."),
  slug: z.string().trim().max(60),
  description: z.string().trim().max(1000, "Keep the description under 1,000 characters."),
  tags: z.string().max(300),
  coverImageUrl: optionalUrl,
  status: z.enum(["draft", "unlisted", "public"]),
  isRanked: z.boolean(),
});

/** Validates the list form. Returns either clean values or messages per field. */
function parseListForm(formData: FormData) {
  const parsed = listSchema.safeParse({
    title: formData.get("title") ?? "",
    slug: formData.get("slug") ?? "",
    description: formData.get("description") ?? "",
    tags: formData.get("tags") ?? "",
    coverImageUrl: formData.get("coverImageUrl") ?? "",
    status: formData.get("status") ?? "draft",
    isRanked: formData.get("isRanked") === "on",
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
    return { fieldErrors };
  }

  const v = parsed.data;
  const slug = slugify(v.slug || v.title);
  if (!slug) return { fieldErrors: { slug: "The link needs at least one letter or number." } };
  if (RESERVED_SLUGS.has(slug)) return { fieldErrors: { slug: `"${slug}" is reserved. Pick another link.` } };

  const tags = [...new Set(v.tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean))].slice(0, 10);

  return {
    values: {
      title: v.title,
      slug,
      description: v.description || null,
      tags,
      coverImageUrl: v.coverImageUrl || null,
      status: v.status,
      isRanked: v.isRanked,
    },
  };
}

/** Postgres unique violation: the user already has a list at this slug. */
function isDuplicate(err: unknown) {
  const code = (err as { code?: string; cause?: { code?: string } } | null);
  return code?.code === "23505" || code?.cause?.code === "23505";
}

const DUPLICATE: ListFormState = {
  fieldErrors: { slug: "You already have a list at this link. Pick another." },
};

export async function createList(_prev: ListFormState, formData: FormData): Promise<ListFormState> {
  const user = await requireUser();
  const result = parseListForm(formData);
  if (!result.values) return { fieldErrors: result.fieldErrors };

  try {
    // New lists go to the end of the profile.
    await db.insert(lists).values({
      ...result.values,
      userId: user.id,
      position: sql`(select coalesce(max(position), -1) + 1 from lists where user_id = ${user.id})`,
    });
  } catch (err) {
    if (isDuplicate(err)) return DUPLICATE;
    throw err;
  }

  updateTag(profileTag(user.username));
  redirect("/dashboard");
}

export async function updateList(id: string, _prev: ListFormState, formData: FormData): Promise<ListFormState> {
  const user = await requireUser();
  const result = parseListForm(formData);
  if (!result.values) return { fieldErrors: result.fieldErrors };

  try {
    const updated = await db
      .update(lists)
      .set({ ...result.values, updatedAt: new Date() })
      .where(and(eq(lists.id, id), eq(lists.userId, user.id)))
      .returning({ id: lists.id });
    if (updated.length === 0) return { error: "This list no longer exists." };
  } catch (err) {
    if (isDuplicate(err)) return DUPLICATE;
    throw err;
  }

  updateTag(profileTag(user.username));
  redirect("/dashboard");
}

export async function deleteList(id: string) {
  const user = await requireUser();
  await db.delete(lists).where(and(eq(lists.id, id), eq(lists.userId, user.id)));
  updateTag(profileTag(user.username));
  redirect("/dashboard");
}

/** Swaps a list with its neighbour on the profile. */
export async function moveList(id: string, direction: "up" | "down") {
  const user = await requireUser();

  await db.transaction(async (tx) => {
    const ordered = await tx
      .select({ id: lists.id })
      .from(lists)
      .where(eq(lists.userId, user.id))
      .orderBy(asc(lists.position), asc(lists.createdAt));

    const from = ordered.findIndex((l) => l.id === id);
    const to = direction === "up" ? from - 1 : from + 1;
    if (from === -1 || to < 0 || to >= ordered.length) return;
    [ordered[from], ordered[to]] = [ordered[to], ordered[from]];

    // Renumber everything so positions stay gap-free.
    for (const [position, list] of ordered.entries()) {
      await tx.update(lists).set({ position }).where(eq(lists.id, list.id));
    }
  });

  updateTag(profileTag(user.username));
}

export async function signOut() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/login");
}
