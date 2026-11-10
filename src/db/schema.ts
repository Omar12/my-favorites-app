import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const listStatus = pgEnum("list_status", ["draft", "unlisted", "public"]);
export const itemKind = pgEnum("item_kind", ["generic", "place", "video", "link"]);

/** Type-specific fields for an item. Which keys apply depends on `items.kind`. */
export type ItemDetails = {
  // place
  address?: string;
  city?: string;
  country?: string;
  mapsUrl?: string;
  // video
  channel?: string;
  duration?: string;
  // link
  siteName?: string;
};

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  email: text("email").unique(),
  displayName: text("display_name").notNull(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const lists = pgTable(
  "lists",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    isRanked: boolean("is_ranked").notNull().default(false),
    tags: text("tags").array().notNull().default([]),
    coverImageUrl: text("cover_image_url"),
    status: listStatus("status").notNull().default("draft"),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("lists_user_slug_idx").on(t.userId, t.slug)],
);

export const items = pgTable(
  "items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    listId: uuid("list_id")
      .notNull()
      .references(() => lists.id, { onDelete: "cascade" }),
    position: integer("position").notNull().default(0),
    kind: itemKind("kind").notNull().default("generic"),
    title: text("title").notNull(),
    note: text("note"),
    url: text("url"),
    // A plain URL for now; uploaded photos will store their hosted URL here too.
    imageUrl: text("image_url"),
    details: jsonb("details").$type<ItemDetails>().notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("items_list_position_idx").on(t.listId, t.position)],
);

export const usersRelations = relations(users, ({ many }) => ({ lists: many(lists) }));
export const listsRelations = relations(lists, ({ one, many }) => ({
  user: one(users, { fields: [lists.userId], references: [users.id] }),
  items: many(items),
}));
export const itemsRelations = relations(items, ({ one }) => ({
  list: one(lists, { fields: [items.listId], references: [lists.id] }),
}));

export type User = typeof users.$inferSelect;
export type List = typeof lists.$inferSelect;
export type Item = typeof items.$inferSelect;
