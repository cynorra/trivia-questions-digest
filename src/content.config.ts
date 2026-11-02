import { defineCollection, z } from "astro:content";
import type { Loader } from "astro/loaders";
import { sourceName, liveArticles, day, updatedDay } from "./lib/articles-source.js";
import { TOPIC_KEYS } from "./lib/topics.js";

const schema = z.object({
  title: z.string().max(80),
  description: z.string().min(70).max(165),
  published: z.coerce.date(),
  updated: z.coerce.date().optional(),
  // Which section this guide belongs to (src/lib/topics.js).
  tool: z.enum(TOPIC_KEYS as [string, ...string[]]),
  draft: z.boolean().default(false),
});

/**
 * Live articles (Firestore, or local Markdown before the database exists),
 * rendered to HTML at build time. Drafts and future-dated guides are left out.
 */
const articles: Loader = {
  name: "articles",
  async load({ store, parseData, renderMarkdown, generateDigest, logger }) {
    const rows = await liveArticles();
    logger.info(`Loaded ${rows.length} live article(s) from ${sourceName}`);
    store.clear();
    for (const row of rows) {
      const data = await parseData({
        id: row.slug,
        data: {
          title: row.title,
          description: row.description,
          published: day(row.published_at),
          updated: updatedDay(row),
          tool: row.tool,
          draft: false,
        },
      });
      store.set({
        id: row.slug,
        data,
        body: row.body_md,
        rendered: await renderMarkdown(row.body_md),
        digest: generateDigest(row),
      });
    }
  },
};

const guides = defineCollection({
  loader: articles,
  schema,
});

export const collections = { guides };
