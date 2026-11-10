import type { Item } from "@/db/schema";
import { hostnameOf, safeUrl } from "@/lib/site";

const KIND_LABEL: Record<Item["kind"], string | null> = {
  generic: null,
  place: "Place",
  video: "Video",
  link: "Link",
};

/** The one-line "where / what" under the title, built from type-specific details. */
function metaLine(item: Item) {
  const d = item.details;
  const parts =
    item.kind === "place"
      ? [d.address, [d.city, d.country].filter(Boolean).join(", ")]
      : item.kind === "video"
        ? [d.channel, d.duration]
        : [d.siteName];
  return [KIND_LABEL[item.kind], ...parts].filter(Boolean).join(" · ");
}

export function ItemCard({ item, rank }: { item: Item; rank?: number }) {
  const url = safeUrl(item.url);
  const mapsUrl = item.kind === "place" ? safeUrl(item.details.mapsUrl) : null;
  const imageUrl = safeUrl(item.imageUrl);
  const meta = metaLine(item);

  return (
    <li className="flex gap-3 rounded-2xl border border-border bg-surface p-4">
      {rank !== undefined && (
        <span className="w-7 shrink-0 text-2xl leading-7 font-bold text-accent tabular-nums">{rank}</span>
      )}
      <div className="min-w-0 flex-1">
        <h2 className="text-base leading-snug font-semibold break-words">{item.title}</h2>
        {meta && <p className="mt-0.5 text-xs text-muted">{meta}</p>}
        {item.note && <p className="mt-2 text-sm leading-relaxed whitespace-pre-line">{item.note}</p>}
        {(url || mapsUrl) && (
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium text-accent">
            {url && (
              <a href={url} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                {item.kind === "video" ? "Watch" : "Visit"} {hostnameOf(url)} ↗
              </a>
            )}
            {mapsUrl && (
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                Open in maps ↗
              </a>
            )}
          </p>
        )}
      </div>
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element -- item images come from arbitrary hosts
        <img
          src={imageUrl}
          alt=""
          loading="lazy"
          className="size-20 shrink-0 rounded-xl object-cover sm:size-24"
        />
      )}
    </li>
  );
}
