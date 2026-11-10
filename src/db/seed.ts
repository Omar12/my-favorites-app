import { config } from "dotenv";
config({ path: ".env.local" });

async function main() {
  const { db } = await import("./index");
  const { users, lists, items } = await import("./schema");
  type NewItem = Omit<typeof items.$inferInsert, "listId" | "position">;

  await db.delete(users); // cascades to lists and items

  const [omar] = await db
    .insert(users)
    .values({
      username: "omar",
      displayName: "Omar",
      bio: "Things I'd tell a friend about: places, videos, and other good finds.",
    })
    .returning();

  const seed: { list: Omit<typeof lists.$inferInsert, "userId">; items: NewItem[] }[] = [
    {
      list: {
        slug: "japan-food",
        title: "Places to eat in Japan",
        description: "Sample list. Where I'd send a friend on their first trip.",
        tags: ["food", "japan", "travel"],
        status: "public",
      },
      items: [
        {
          kind: "place",
          title: "A standing sushi bar near the station",
          note: "No reservation, ten seats, and the best value nigiri of the trip. Go at opening.",
          details: { city: "Tokyo", country: "Japan" },
        },
        {
          kind: "place",
          title: "The late-night ramen counter",
          note: "Rich tonkotsu broth and a ticket machine at the door. Order the egg.",
          details: { city: "Fukuoka", country: "Japan" },
        },
        {
          kind: "place",
          title: "Okonomiyaki cooked at your table",
          note: "Loud, smoky, and friendly. Ask for the house special with noodles.",
          details: { city: "Osaka", country: "Japan" },
        },
      ],
    },
    {
      list: {
        slug: "top-car-videos",
        title: "My top 5 videos about cars",
        description: "Sample list. Ranked, with the best one first.",
        tags: ["cars", "video"],
        isRanked: true,
        status: "public",
      },
      items: [
        { kind: "video", title: "The engineering deep-dive", note: "Explains a hard idea without talking down to you.", details: { duration: "24 min" } },
        { kind: "video", title: "A road trip that goes wrong", note: "Funny from the first minute and somehow moving by the end.", details: { duration: "58 min" } },
        { kind: "video", title: "The restoration time-lapse", note: "Forty hours of work in fifteen calm minutes.", details: { duration: "15 min" } },
        { kind: "video", title: "A lap, narrated by the driver", note: "You finally understand what a racing line is.", details: { duration: "9 min" } },
        { kind: "video", title: "The budget build", note: "Proof that a cheap car and patience beats a big budget.", details: { duration: "31 min" } },
      ],
    },
    {
      list: {
        slug: "useful-links",
        title: "Links I keep sending people",
        description: "Sample unlisted list: reachable by link, hidden from the profile.",
        tags: ["links"],
        status: "unlisted",
      },
      items: [
        { kind: "link", title: "Example Domain", note: "Placeholder link to show how links render.", url: "https://example.com" },
      ],
    },
    {
      list: { slug: "work-in-progress", title: "A draft list", status: "draft" },
      items: [{ title: "Not visible to anyone yet" }],
    },
  ];

  for (const [position, entry] of seed.entries()) {
    const [list] = await db
      .insert(lists)
      .values({ ...entry.list, userId: omar.id, position })
      .returning();
    await db
      .insert(items)
      .values(entry.items.map((item, i) => ({ ...item, listId: list.id, position: i })));
  }

  console.log(`Seeded ${seed.length} lists for /${omar.username}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
