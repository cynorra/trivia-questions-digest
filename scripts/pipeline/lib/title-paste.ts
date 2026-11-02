/**
 * Detects the article's own title pasted into running prose (or into the closing note) —
 * "Since the landscape for <full title> shifts quickly, ..." — which reads as a template with a
 * variable filled in and is exactly what a reviewer spots across pages. The older
 * title-repeat gate only counts the EXACT full title; a model that drops a word or two slips past.
 */
const norm = (s: string) => s.toLowerCase().replace(/&[a-z]+;/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim();
const STOP = new Set(['a', 'an', 'the', 'of', 'to', 'in', 'on', 'for', 'and', 'or', 'with', 'how', 'what', 'is', 'it', 'your', 'you', 'using']);

/** Windows of `n` consecutive title words, skipping windows made mostly of stopwords. */
function windows(title: string, n: number): string[] {
  const w = norm(title).split(' ').filter(Boolean);
  const out: string[] = [];
  for (let i = 0; i + n <= w.length; i++) {
    const win = w.slice(i, i + n);
    if (win.filter((x) => !STOP.has(x)).length >= n - 1) out.push(win.join(' '));
  }
  return out;
}

export interface TitlePasteResult {
  /** longest title fragment found in the closing note, if any */
  inClosing: string | null;
  /** title fragments found in body prose (headings/intro excluded) more than once */
  repeated: string[];
}

export function findTitlePastes(html: string, title: string, n = 5): TitlePasteResult {
  const wins = windows(title, n);
  if (wins.length === 0) return { inClosing: null, repeated: [] };

  // Tempered so a match can never run across a </p> (it used to swallow body text between two paragraphs).
  const closing = html.match(/<p(?:\s[^>]*)?>\s*<em>(?:(?!<\/p>)[\s\S])*?<\/em>\s*<\/p>/gi) ?? [];
  const closingText = norm(closing.join(' '));
  const inClosing = wins.find((w) => closingText.includes(w)) ?? null;

  const body = norm(
    html
      .replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi, ' ')
      .replace(/<pre[\s\S]*?<\/pre>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  );
  const first = body.slice(0, 700); // the intro may legitimately name the topic once
  const rest = body.slice(700);
  const repeated = wins.filter((w) => rest.split(w).length - 1 >= 2 || (first.includes(w) && rest.includes(w)));
  return { inClosing, repeated: [...new Set(repeated)].slice(0, 3) };
}

export function findTitlePasteIssues(html: string, title: string): string[] {
  const r = findTitlePastes(html, title);
  const issues: string[] = [];
  if (r.inClosing) issues.push(`the closing note pastes part of the article title ("${r.inClosing}") into a stock sentence — name the specific tool or concept in your own words instead of copying the title`);
  // r.repeated (title wording repeated in prose) is informational only: it flagged 51 of 58
  // live articles, including natural repetition, so it is not calibrated enough to gate on.
  return issues;
}

const words = (s: string) => (s.toLowerCase().match(/[a-z][a-z0-9]{3,}/g) ?? []);
function editDistance(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...new Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

/**
 * The writer once returned "Connection Refed" for the topic "Connection Refused" and no gate noticed.
 * Flags a word in the generated title that is a near-miss (edit distance 1-2) of a word in the topic
 * title and appears in neither the topic title nor the body.
 */
export function findTitleTypos(title: string, topicTitle: string, bodyHtml: string): string[] {
  const topic = new Set(words(topicTitle));
  const body = new Set(words(bodyHtml.replace(/<[^>]+>/g, ' ')));
  const out: string[] = [];
  for (const w of new Set(words(title))) {
    if (topic.has(w) || body.has(w)) continue;
    const near = [...topic].find((t) => Math.abs(t.length - w.length) <= 2 && editDistance(w, t) <= 2);
    if (near) out.push(`the title contains "${w}", which looks like a misspelling of "${near}" — fix the spelling`);
  }
  return out;
}
