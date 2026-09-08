import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"blog">;

/**
 * Posts newest first. Drafts are hidden from production builds but stay
 * visible in `astro dev`, so a work in progress can be committed safely.
 */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection("blog", ({ data }) =>
    import.meta.env.PROD ? !data.draft : true,
  );

  return posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}

/** Every tag in use, most-used first, then alphabetically. */
export async function getTags(): Promise<{ tag: string; count: number }[]> {
  const posts = await getPosts();
  const counts = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** `2026-03-30` — matches the mono date style used across the site. */
export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
