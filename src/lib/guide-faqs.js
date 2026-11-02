// FAQ entries from a guide body, for FAQPage schema. The visible section is the
// guide's own "Frequently asked questions" heading, so markup and schema match.
// Handles both Markdown (## / ###) and the pipeline's HTML (<h2> / <h3>).

const plain = (s) =>
  s
    .replace(/<\/?(?:a|b|strong|em|i|code|span)\b[^>]*>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

export function guideFaqs(body) {
  const html = body.match(/<h2[^>]*>\s*Frequently asked questions\s*<\/h2>([\s\S]*)$/i);
  if (html) {
    return [...html[1].matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>\s*([\s\S]*?)(?=<h[23][\s>]|$)/gi)]
      .map((m) => ({ q: plain(m[1]), a: plain(m[2]) }))
      .filter((f) => f.q && f.a);
  }
  const md = body.match(/^##\s+Frequently asked questions\s*$([\s\S]*?)(?=^##\s|(?![\s\S]))/im);
  if (!md) return [];
  return md[1]
    .split(/^###\s+/m)
    .slice(1)
    .map((chunk) => {
      const [q, ...rest] = chunk.split("\n");
      return { q: plain(q), a: plain(rest.join(" ")) };
    })
    .filter((f) => f.q && f.a);
}
