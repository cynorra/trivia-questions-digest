/**
 * Structural-uniqueness gates for generated articles.
 *
 * The 2026-10 audit found that the TEXT of the articles was distinct (mean
 * 4-gram overlap under 1%) but their STRUCTURE was one template: 18 stock
 * headings made up 89% of all section headings, every quick-answer box used
 * "Key Takeaway 1..5" labels, every callout was "Pro-Tip" / "Prevention Tip" /
 * "Key Insight". Rather than rotate through a fixed pool of alternatives, these
 * gates compare each new article against the real corpus: a heading, label or
 * section order already used by an existing article is rejected.
 *
 * Pure functions only (no I/O) so scripts/quality-selftest.ts can test them.
 */

const decode = (s: string) =>
  s
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();

/** Stock headings shared across articles — the template signal. */
export const STOCK_HEADING_RE =
  /^(quick answer(?: ?(?:&|and) ?key takeaways)?|key takeaways(?: and (?:summary|future outlook))?|what you'll need before you start|step-by-step instructions|common mistakes that break this|advanced tips (?:&|and) variations|final recommendation|why this happens(?: \(quick diagnosis\))?|step-by-step fixes(?: \(try these in order\))?|if nothing above worked|how to prevent this from happening again|when to contact official support|common misconceptions(?: about [^\n]{0,40})?|[^\n]{0,60} in plain english|how it actually works|why it matters: real examples (?:&|and) use cases|overview (?:&|and) market context|final verdict(?: (?:&|and) recommendation)?)$/i;

/** Headings every article legitimately shares (page furniture, not structure). */
const ALLOWED_REPEATS = new Set(['sources and further reading', 'frequently asked questions']);

const STOCK_CALLOUT_LABEL_RE = /<p[^>]*>\s*[^<]{0,12}?(Pro-Tip|Prevention Tip|Key Insight|Expert Insight(?: \/ Key Pro-Tip)?|Buyer's Tip)\s*:?\s*<\/p>/i;
const TAKEAWAY_LABEL_RE = /<strong>\s*Key Takeaway \d+\s*:?\s*<\/strong>/i;

export function extractHeadings(html: string, level: 'h2' | 'h3' = 'h2'): string[] {
  const re = new RegExp(`<${level}[^>]*>([\\s\\S]*?)<\\/${level}>`, 'gi');
  return [...html.matchAll(re)].map((m) => decode(m[1]).replace(/^\d+\.\s*/, ''));
}

export function normalizeHeading(h: string): string {
  return h.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

/** The article's own section headings (page furniture excluded), normalized. */
export function structuralHeadings(html: string): string[] {
  return extractHeadings(html)
    .map(normalizeHeading)
    .filter((h) => h && !ALLOWED_REPEATS.has(h));
}

export function findStockHeadings(html: string): string[] {
  return extractHeadings(html).filter((h) => STOCK_HEADING_RE.test(h));
}

/** Headings that an existing article already uses verbatim (after normalizing). */
export function findReusedHeadings(html: string, corpus: Set<string>): string[] {
  return extractHeadings(html).filter((h) => {
    const n = normalizeHeading(h);
    return n && !ALLOWED_REPEATS.has(n) && corpus.has(n);
  });
}

export function collectHeadingSet(htmls: string[]): Set<string> {
  const set = new Set<string>();
  for (const html of htmls) for (const h of structuralHeadings(html)) set.add(h);
  return set;
}

/** Fixed per-article labels (quick-answer "Key Takeaway N:", callout "Pro-Tip:"). */
export function findStockLabels(html: string): string[] {
  const found: string[] = [];
  if (TAKEAWAY_LABEL_RE.test(html)) found.push('"Key Takeaway N:" bullet labels');
  const callout = html.match(STOCK_CALLOUT_LABEL_RE);
  if (callout) found.push(`"${callout[1]}" callout label`);
  return found;
}

/** Coarse shape of an article: how many body sections it has and which optional
 *  components (table / callout / pros-cons grid / code) it uses, in document order.
 *  Deliberately coarse — an exact block-order match is almost never repeated, but
 *  "6 sections, callout then table" was the shape of most of the corpus. */
export function shapeOf(html: string): { h2: number; components: string } {
  const h2 = structuralHeadings(html).length;
  const components = [...html.matchAll(/<table|border-l-4 border-accent|bg-good-soft|<pre/g)]
    .map((m) => ({ '<table': 'T', 'border-l-4 border-accent': 'C', 'bg-good-soft': 'P', '<pre': 'K' } as Record<string, string>)[m[0]])
    .filter((c, i, a) => c !== a[i - 1]) // collapse runs (five code blocks = one K)
    .join('');
  return { h2, components };
}

/** Flags an article whose section count, or whole section+component shape, is already
 *  the dominant one in the corpus. Below `minCorpus` articles there is no "dominant". */
export function findDominantShape(html: string, corpus: { h2: number; components: string }[], minCorpus = 8): string[] {
  if (corpus.length < minCorpus) return [];
  const s = shapeOf(html);
  const issues: string[] = [];
  const sameCount = corpus.filter((c) => c.h2 === s.h2).length;
  if (sameCount / corpus.length >= 0.3) {
    const rare = [3, 4, 5, 6, 7, 8].filter((n) => (corpus.filter((c) => c.h2 === n).length / corpus.length) < 0.15);
    issues.push(`${s.h2} body sections is already the layout of ${Math.round((100 * sameCount) / corpus.length)}% of this site's articles — design the outline around this topic's own parts; ${rare.length ? `section counts ${rare.join(', ')} are underused` : `vary the count`}`);
  }
  const sameShape = corpus.filter((c) => c.h2 === s.h2 && c.components === s.components).length;
  if (sameShape / corpus.length >= 0.2) {
    issues.push(`the section-count + component order (${s.h2} sections, components "${s.components || 'none'}") matches ${Math.round((100 * sameShape) / corpus.length)}% of existing articles — change which components (table, callout, code, pros/cons) appear and where, only where the topic calls for them`);
  }
  return issues;
}

/** Prompt block: the real outlines of the most recent articles, to be avoided. */
export function buildOutlineAvoidBlock(outlines: { title: string; h2: string[] }[], max = 8): string {
  const recent = outlines.filter((o) => o.h2.length > 0).slice(0, max);
  if (recent.length === 0) return '';
  const lines = recent.map((o) => `- "${o.title}": ${o.h2.map((h) => `"${h}"`).join(' | ')}`).join('\n');
  return `\nSTRUCTURE VARIETY (hard requirement): these are the real section outlines of the most recently published articles on this site. Design a DIFFERENT outline for this topic — different heading wording, different order, and a section count that fits this topic rather than copying theirs. Do not reuse any of these headings, and do not follow the same sequence of section roles if this topic doesn't call for it:\n${lines}\n`;
}
