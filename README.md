# What I Recommend

A personal directory of products, places, and experiences worth recommending.
Lists are shared through clean public links such as `/omar/japan-food`.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · Postgres · Drizzle ORM

## Getting started

1. Copy `.env.example` to `.env.local` and set `DATABASE_URL` to a Postgres database.
2. Install and prepare the database:

   ```bash
   npm install
   npm run db:migrate   # create tables
   npm run db:seed      # sample profile and lists (replaces existing data)
   ```

3. Run `npm run dev` and open http://localhost:3000.

After changing `src/db/schema.ts`, run `npm run db:generate` to create a migration.

## Routes

| Route | What it shows |
|---|---|
| `/` | Redirects to the profile named in `DEFAULT_USERNAME` |
| `/[username]` | Profile with all public lists |
| `/[username]/[slug]` | A public or unlisted list |

List visibility: `public` lists appear on the profile, `unlisted` lists are
reachable only by link and hidden from search engines, `draft` lists are not
visible to anyone yet.

## Roadmap

1. ~~Read-only profile and list pages~~
2. Magic-link sign-in and list editing
3. Item editing and reordering
4. Generated share images
5. Auto-fill item details from a pasted URL
6. Photo uploads, tag filtering, deploy
