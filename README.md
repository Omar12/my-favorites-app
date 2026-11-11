# What I Recommend

A personal directory of products, places, and experiences worth recommending.
Lists are shared through clean public links such as `/omar/japan-food`.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · Postgres · Drizzle ORM · Better Auth · Resend

## Getting started

1. Copy `.env.example` to `.env.local` and fill it in. At minimum set
   `DATABASE_URL`, `OWNER_EMAIL` (the address you sign in with) and
   `BETTER_AUTH_SECRET`.
2. Install and prepare the database:

   ```bash
   npm install
   npm run db:migrate   # create tables
   npm run db:owner     # create your account from OWNER_EMAIL
   npm run db:seed      # optional sample lists (wipes existing data first)
   ```

3. Run `npm run dev` and open http://localhost:3000.

After changing `src/db/schema.ts`, run `npm run db:generate` to create a migration.

## Signing in

Go to `/login` and enter the owner's email to get a one-time sign-in link.
Only addresses that already have an account receive one; accounts are created
with `npm run db:owner`, never by signing in. In development the link is also
printed in the terminal, so no email service is needed. In production, set
`RESEND_API_KEY`. Until `EMAIL_FROM` points at a domain verified in Resend,
emails can only be delivered to the Resend account's own address.

## Routes

| Route | What it shows |
|---|---|
| `/` | Redirects to the profile named in `DEFAULT_USERNAME` |
| `/[username]` | Profile with all public lists |
| `/[username]/[slug]` | A public or unlisted list |
| `/login` | Request a sign-in link |
| `/dashboard` | Your lists, including drafts: create, edit, reorder, delete |

List visibility: `public` lists appear on the profile, `unlisted` lists are
reachable only by link and hidden from search engines, `draft` lists are not
visible to anyone yet.

## Roadmap

1. ~~Read-only profile and list pages~~
2. ~~Magic-link sign-in and list editing~~
3. Item editing and reordering
4. Generated share images
5. Auto-fill item details from a pasted URL
6. Photo uploads, tag filtering, deploy
