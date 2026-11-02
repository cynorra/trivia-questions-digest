import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE, AUTHOR } from "../site.config.js";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// RSS 2.0 feed of the 30 newest live guides.
export const GET: APIRoute = async () => {
  const guides = (await getCollection("guides", (g) => !g.data.draft))
    .sort((a, b) => b.data.published.valueOf() - a.data.published.valueOf())
    .slice(0, 30);
  const u = (p: string) => new URL(p, SITE.url).href;
  const items = guides
    .map((g) => `    <item>
      <title>${esc(g.data.title)}</title>
      <link>${u(`/guides/${g.id}/`)}</link>
      <guid isPermaLink="true">${u(`/guides/${g.id}/`)}</guid>
      <description>${esc(g.data.description)}</description>
      <pubDate>${g.data.published.toUTCString()}</pubDate>
      <author>${SITE.email} (${esc(AUTHOR.name)})</author>
    </item>`)
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE.name)}</title>
    <link>${SITE.url}/</link>
    <description>${esc(SITE.description)}</description>
    <language>en-us</language>
    <atom:link href="${u("/rss.xml")}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
};
