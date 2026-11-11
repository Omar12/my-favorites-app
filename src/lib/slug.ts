/** "Places to eat in Japan!" -> "places-to-eat-in-japan" */
export function slugify(input: string) {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/, "");
}

/** List addresses that would collide with files served under a profile. */
export const RESERVED_SLUGS = new Set(["opengraph-image", "twitter-image", "icon", "feed"]);
