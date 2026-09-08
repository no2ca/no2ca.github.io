import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Drop a `.md` file into src/content/blog/ and it becomes a post; the filename
 * is the slug. Only `title` and `pubDate` are required — everything else has a
 * default so a new post can be one line of frontmatter.
 */
const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
