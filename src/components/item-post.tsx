import type { Item } from "@/db/schema";
import { hostnameOf, safeUrl } from "@/lib/site";
import { metaLine } from "./item-card";
import { PostPhoto } from "./post-photo";

function Arrow() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 11 11 5M6 5h5v5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * One recommendation on the public list page, shaped like a post: photo, the owner's
 * note as the main text, then what it is and where to go. The heading comes first in
 * the markup so heading navigation still reads title-then-note; `order-*` moves it below.
 */
export function ItemPost({ item, rank, index }: { item: Item; rank?: number; index: number }) {
  const url = safeUrl(item.url);
  const mapsUrl = item.kind === "place" ? safeUrl(item.details.mapsUrl) : null;
  const imageUrl = safeUrl(item.imageUrl);
  const meta = metaLine(item);

  return (
    <li
      className="post flex gap-3 border-t border-border py-6 first:border-t-0 first:pt-0"
      // Only the first few posts settle in; the rest are below the fold anyway.
      style={index < 5 ? { animationDelay: `${80 + index * 70}ms` } : { animation: "none" }}
    >
      {rank !== undefined && (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-base font-bold text-background tabular-nums">
          {rank}
        </span>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="order-3 rounded-2xl border border-border bg-surface p-4">
          <h2 className="leading-snug font-semibold break-words">{item.title}</h2>
          {meta && <p className="mt-0.5 text-sm text-muted">{meta}</p>}
          {(url || mapsUrl) && (
            <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold">
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 max-w-full items-center gap-1.5 rounded-full bg-accent px-4 text-background transition-transform duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span className="truncate">
                    {item.kind === "video" ? "Go watch" : "Go look"}
                    <span className="font-normal opacity-90"> · {hostnameOf(url)}</span>
                  </span>
                  <Arrow />
                </a>
              )}
              {mapsUrl && (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1.5 text-accent underline-offset-4 hover:underline"
                >
                  Take me there <Arrow />
                </a>
              )}
            </p>
          )}
        </div>
        {imageUrl && <PostPhoto src={imageUrl} />}
        {item.note && (
          <p className="order-2 text-[1.0625rem] leading-relaxed break-words whitespace-pre-line">{item.note}</p>
        )}
      </div>
    </li>
  );
}
