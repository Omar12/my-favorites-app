"use client";

import { useState } from "react";

/** A post's photo. Photos come from arbitrary hosts, so a broken one removes itself and the post becomes text-only. */
export function PostPhoto({ src }: { src: string }) {
  const [broken, setBroken] = useState(false);
  if (broken) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- item images come from arbitrary hosts
    <img
      src={src}
      alt=""
      loading="lazy"
      // An image that failed before hydration never fires onError, so check it when the node mounts.
      ref={(img) => {
        if (img?.complete && img.naturalWidth === 0) setBroken(true);
      }}
      onError={() => setBroken(true)}
      className="order-1 aspect-[4/3] w-full rounded-2xl bg-border object-cover"
    />
  );
}
