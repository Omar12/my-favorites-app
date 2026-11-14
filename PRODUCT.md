# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **The owner (today: Omar).** Publishes lists of things they personally recommend and sends the links to people who ask. Signs in with a one-time email link and manages lists in the dashboard.
- **Friends and family.** Asked for a recommendation and got a link in a chat. They know the owner and trust their taste.
- **Strangers.** Arrive on a single list from a search engine or a shared post, with no idea who the owner is.

Readers are mostly on phones, often while out: at a restaurant, in a shop, on a trip.

Other people publishing their own lists is a planned later stage, not something that exists today.

## Product Purpose

What I Recommend is a personal directory of products, places and experiences worth recommending. It exists so that "what do you recommend for X?" can be answered with one link instead of a retyped message.

Success is a reader opening a list on their phone, understanding why each item is there, and acting on it.

## Positioning

- Every item carries the owner's own reason for recommending it, not a rating or a scraped description.
- Lists live at short, readable addresses such as `/omar/japan-food` that are easy to send and look good when shared.
- Places, videos, links and products can sit side by side in one list.
- Recommendations are never paid for, sponsored or monetised. No ads, no affiliate links.

## Operating Context

- The owner writes and reorders lists in `/dashboard`, then shares a list link by copying it into a chat or a post.
- A reader opens that link directly on a list page; the profile page (`/[username]`) is the secondary entry, showing all public lists.
- `/` redirects to the single profile named in `DEFAULT_USERNAME`.

## Capabilities and Constraints

- **Lists** have a title, description, tags, an optional cover image, and can be ranked or unranked.
- **Visibility:** `public` lists appear on the profile; `unlisted` lists are reachable only by link and hidden from search engines; `draft` lists are visible to no one else.
- **Items** are one of four kinds: generic, place, video, link. Each has a title, the owner's note and an optional URL, plus kind-specific details (address and map link, channel and duration, site name).
- **Sign-in** is by one-time email link only. Accounts are created from the command line, never by signing in; there is no public sign-up.
- **Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Postgres with Drizzle, Better Auth, Resend.
- **Planned, not built:** choosing an item's kind and entering its place or video details in the dashboard (the item form only has name, note, link and photo), touch-friendly reordering, generated share images, auto-filling item details from a pasted URL, photo uploads, tag filtering, tests, a security plan (see `roadmap.md` and `README.md`).
- **Undecided:** how and when other people get accounts, and what a multi-user home page looks like.

## Brand Commitments

- The name is **What I Recommend**.
- First person and personal: the recommendations are one person's opinion, said plainly.
- No sponsored content, ads or affiliate links, ever.

## Evidence on Hand

- Sample lists from `npm run db:seed` (`src/db/seed.ts`); these are seed data, not necessarily the owner's real lists.
- No logo, testimonials, usage numbers or press. Future work must not invent any.

## Product Principles

1. **The note is the product.** An item without the owner's reason is just a link.
2. **The list page is the front door.** Most readers land there first, on a phone, with no context; it has to stand on its own.
3. **One link answers the question.** Sharing should be as easy as pasting an address.
4. **Trust over reach.** Nothing that makes a recommendation look paid for.
5. **Built for one, ready for many.** Decisions should not block other people publishing later, but should not build for them yet.
