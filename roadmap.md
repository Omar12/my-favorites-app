# Roadmap

Things that came up while building but were left for later.

## Touch-friendly drag and drop

Items on the list edit page are reordered with the browser's built-in drag and drop, which is unreliable on touch screens; phones have to use the ↑ / ↓ buttons. A touch-friendly version needs pointer events or a drag library, ideally with the order updating immediately rather than after the save.

Where: `src/app/dashboard/item-drag.tsx`

## Extensive tests

The app has no tests and no test runner yet. It needs broad coverage: unit tests for the pure helpers (slugs and reserved names, hostnames, profile tags), tests for the data and auth paths (sign-in links, who can see or edit a list, shared-list links, item ordering), and end-to-end tests for the main flows (sign in, create and edit a list, add and reorder items, share a list, view a public profile).

Where: `src/lib/`, `src/db/`, `src/app/`

## Security plan documentation

There is no written security plan. Write one that covers how sign-in works (magic links, sessions, expiry), who can read or change what (private lists, shared-list links, public profiles), how user input and item URLs are validated, where secrets live, and what to do if something goes wrong (a leaked key, a reported vulnerability).

Where: a new `SECURITY.md`, drawing on `src/lib/auth.ts`, `src/lib/` and `src/db/`

## Item kinds in the dashboard

Items can be a place, a video or a link, and the public list page shows the extra details (address and map link, channel and duration, site name). The dashboard's item form can't set any of that yet: every item is created as a generic one. Add a kind picker that reveals the fields for that kind.

Where: `src/app/dashboard/item-form.tsx`, `src/app/dashboard/actions.ts`
