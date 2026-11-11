import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { magicLink } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { sendSignInEmail } from "@/lib/email";
import { SITE_URL } from "@/lib/site";

export const auth = betterAuth({
  baseURL: SITE_URL,
  database: drizzleAdapter(db, { provider: "pg", schema, usePlural: true }),
  advanced: { database: { generateId: "uuid" } },
  user: {
    // Our users table uses its own column names for these two.
    fields: { name: "displayName", image: "avatarUrl" },
    additionalFields: { username: { type: "string", input: false } },
  },
  plugins: [
    magicLink({
      // Accounts are created by `npm run db:owner`, never by signing in.
      disableSignUp: true,
      storeToken: "hashed",
      expiresIn: 60 * 10,
      sendMagicLink: async ({ email, url }) => {
        // Only email people who already have an account, so the form can't
        // be used to send mail to arbitrary addresses.
        const user = await db.query.users.findFirst({
          where: eq(schema.users.email, email.toLowerCase()),
          columns: { id: true },
        });
        if (user) await sendSignInEmail(email, url);
      },
    }),
    nextCookies(), // must stay last: lets server actions set the session cookie
  ],
});
