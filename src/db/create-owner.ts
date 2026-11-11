import { config } from "dotenv";
config({ path: ".env.local" });

/**
 * Creates the site owner's account, or updates its email if it already exists.
 * Reads OWNER_EMAIL, DEFAULT_USERNAME and OWNER_NAME from the environment.
 */
export async function createOwner() {
  const { db } = await import("./index");
  const { users } = await import("./schema");

  const email = process.env.OWNER_EMAIL?.toLowerCase();
  if (!email) throw new Error("Set OWNER_EMAIL to the address you will sign in with.");
  const username = (process.env.DEFAULT_USERNAME ?? "omar").toLowerCase();
  const displayName = process.env.OWNER_NAME ?? username.charAt(0).toUpperCase() + username.slice(1);

  const [owner] = await db
    .insert(users)
    .values({ username, email, displayName })
    .onConflictDoUpdate({ target: users.username, set: { email, updatedAt: new Date() } })
    .returning();
  return owner;
}

if (process.argv[1]?.endsWith("create-owner.ts")) {
  createOwner()
    .then((owner) => {
      console.log(`Owner ready: /${owner.username} signs in as ${owner.email}`);
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
