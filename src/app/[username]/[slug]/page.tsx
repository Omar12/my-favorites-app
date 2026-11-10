import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/avatar";
import { ItemCard } from "@/components/item-card";
import { Tags } from "@/components/tags";
import { getSharedList } from "@/lib/queries";
import { SITE_NAME, safeUrl } from "@/lib/site";

// The page depends on the URL, so there is no static shell to show first;
// let navigation wait for the (cached) data instead of flashing a placeholder.
export const instant = false;

export async function generateMetadata({ params }: PageProps<"/[username]/[slug]">): Promise<Metadata> {
  const { username, slug } = await params;
  const data = await getSharedList(username, slug);
  if (!data) return {};
  const { user, list } = data;

  const path = `/${user.username}/${list.slug}`;
  const count = `${list.items.length} ${list.items.length === 1 ? "recommendation" : "recommendations"}`;
  const description = list.description ?? `${count} from ${user.displayName}.`;
  const image = safeUrl(list.coverImageUrl) ?? safeUrl(list.items.find((i) => i.imageUrl)?.imageUrl);

  return {
    title: `${list.title} · ${user.displayName}`,
    description,
    alternates: { canonical: path },
    // Unlisted lists are for people with the link, not search engines.
    robots: list.status === "unlisted" ? { index: false, follow: false } : undefined,
    openGraph: {
      siteName: SITE_NAME,
      title: list.title,
      description,
      url: path,
      type: "article",
      images: image ? [image] : undefined,
    },
    twitter: { card: image ? "summary_large_image" : "summary" },
  };
}

export default async function ListPage({ params }: PageProps<"/[username]/[slug]">) {
  const { username, slug } = await params;
  const data = await getSharedList(username, slug);
  if (!data) notFound();
  const { user, list } = data;

  return (
    <article>
      <Link
        href={`/${user.username}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground"
      >
        <Avatar user={user} size="sm" />
        {user.displayName} recommends
      </Link>

      <header className="mt-5">
        <h1 className="text-3xl leading-tight font-bold tracking-tight text-balance">{list.title}</h1>
        {list.description && <p className="mt-3 leading-relaxed text-muted">{list.description}</p>}
        <div className="mt-4">
          <Tags tags={list.tags} />
        </div>
      </header>

      {list.items.length === 0 ? (
        <p className="mt-10 text-muted">Nothing on this list yet.</p>
      ) : (
        <ol className="mt-8 space-y-3">
          {list.items.map((item, i) => (
            <ItemCard key={item.id} item={item} rank={list.isRanked ? i + 1 : undefined} />
          ))}
        </ol>
      )}
    </article>
  );
}
