import type { User } from "@/db/schema";

export function Avatar({ user, size }: { user: Pick<User, "displayName" | "avatarUrl">; size: "sm" | "lg" }) {
  const box = size === "lg" ? "size-16 text-2xl" : "size-7 text-xs";
  if (user.avatarUrl) {
    // eslint-disable-next-line @next/next/no-img-element -- avatar hosts are arbitrary
    return <img src={user.avatarUrl} alt="" className={`${box} rounded-full object-cover`} />;
  }
  return (
    <span
      aria-hidden
      className={`${box} inline-flex shrink-0 items-center justify-center rounded-full bg-accent font-semibold text-white`}
    >
      {user.displayName.charAt(0).toUpperCase()}
    </span>
  );
}
