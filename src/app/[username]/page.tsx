import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/avatar";
import { Tags } from "@/components/tags";
import { getProfile } from "@/lib/queries";
import { SITE_NAME } from "@/lib/site";

// The page depends on the URL, so there is no static shell to show first;
// let navigation wait for the (cached) data instead of flashing a placeholder.
export const instant = false;

export async function generateMetadata({ params }: PageProps<"/[username]">): Promise<Metadata> {
  const { username } = await params;
  const profile = await getProfile(username);
  if (!profile) return {};

  const title = `${profile.user.displayName} recommends`;
  const description = profile.user.bio ?? `Lists of things ${profile.user.displayName} recommends.`;
  return {
    title,
    description,
    alternates: { canonical: `/${profile.user.username}` },
    openGraph: { siteName: SITE_NAME, title, description, url: `/${profile.user.username}`, type: "profile" },
  };
}

export default async function ProfilePage({ params }: PageProps<"/[username]">) {
  const { username } = await params;
  const profile = await getProfile(username);
  if (!profile) notFound();
  const { user, lists } = profile;

  return (
    <>
      <header className="flex items-center gap-4">
        <Avatar user={user} size="lg" />
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight">{user.displayName}</h1>
          <p className="text-sm text-muted">@{user.username}</p>
        </div>
      </header>
      {user.bio && <p className="mt-4 leading-relaxed">{user.bio}</p>}

      {lists.length === 0 ? (
        <p className="mt-10 text-muted">No lists shared yet.</p>
      ) : (
        <ul className="mt-8 space-y-3">
          {lists.map((list) => (
            <li key={list.id}>
              <Link
                href={`/${user.username}/${list.slug}`}
                className="block rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-accent"
              >
                <h2 className="text-lg leading-snug font-semibold">{list.title}</h2>
                {list.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-muted">{list.description}</p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="text-xs font-medium text-muted">
                    {list.itemCount} {list.itemCount === 1 ? "item" : "items"}
                    {list.isRanked && " · ranked"}
                  </span>
                  <Tags tags={list.tags} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
