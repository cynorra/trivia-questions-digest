/**
 * Real search-demand data for the SEO / AEO / GEO side of the generator.
 *
 * Google's public autocomplete endpoint (no API key) returns the queries people actually type today.
 * It is used twice:
 *   1. TOPIC GATE — a topic whose subject yields almost no autocomplete suggestions has no demonstrable
 *      demand and is skipped before any generation quota is spent.
 *   2. KEYWORD PLAN — the real queries (especially the question-shaped ones) are handed to the writer,
 *      and a gate checks that the finished article answers several of them in its headings / FAQ, so the
 *      page matches what searchers and answer engines ask instead of the model's guess.
 *
 * The network call fails OPEN: if Google cannot be reached the plan is marked `available: false` and the
 * demand/coverage gates are skipped, never turned into a false rejection.
 */
import { getTitleKeywords, sleep } from './shared';

export interface KeywordPlan {
  seed: string;
  /** every distinct suggestion that is about the seed */
  queries: string[];
  /** the question-shaped subset (how/what/why/can/does/is/should/when/which) */
  questions: string[];
  /** false when the endpoint could not be reached */
  available: boolean;
}

const QUESTION_START_RE = /^(how|what|why|can|does|do|is|are|should|when|which|where|will)\b/i;
const MIN_DEMAND_QUERIES = 3;
const MIN_COVERED_QUERIES = 3;

const decode = (s: string) => s.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();

/** The subject people would type, from a title: drop the leading "How to"/"What is", everything after the
 *  first ":" / "?" / dash, version-ish numbers and the year. */
export function searchSeed(title: string): string {
  const head = title.split(/[:?—–]| - /)[0];
  const s = head
    .replace(/^(what is|what are|what does|how does|how do you|how do i|how to|why does|why do)\s+/i, '')
    .replace(/\b(20\d\d)\b/g, '')
    .replace(/[^A-Za-z0-9.+#\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return s.split(' ').slice(0, 7).join(' ');
}

export async function fetchSuggest(q: string): Promise<string[] | null> {
  try {
    const res = await fetch(`https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=us&q=${encodeURIComponent(q)}`, {
      headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0 Safari/537.36' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as [string, string[]];
    return Array.isArray(data?.[1]) ? data[1].map((x) => String(x).trim()).filter(Boolean) : [];
  } catch {
    return null;
  }
}

const FILLER = new Set(['build', 'building', 'implement', 'create', 'using', 'use', 'with', 'guide', 'step-by-step', 'developer', 'developers', 'high-performance', 'complete', 'your', 'a', 'an', 'the', 'and', 'for', 'in', 'to', 'of', 'on', 'from', 'into', 'how', 'set', 'up', 'fix', 'fixing', 'deploy', 'migrate']);

/** Short search-shaped seeds from a title (long phrases return no autocomplete at all). The first one is
 *  the full searchSeed; the rest are 2-3 word windows of its content words. */
export function seedCandidates(title: string): string[] {
  const full = searchSeed(title);
  const toks = full.split(' ').filter((w) => w && !FILLER.has(w.toLowerCase()));
  const out = [full, toks.slice(0, 3).join(' '), toks.slice(0, 2).join(' '), toks.slice(-2).join(' '), toks.slice(1, 4).join(' ')];
  return [...new Set(out.map((x) => x.trim()).filter((x) => x.split(' ').length >= 1 && x.length >= 3))].slice(0, 4);
}

export async function buildKeywordPlan(title: string): Promise<KeywordPlan> {
  const seeds = seedCandidates(title);
  const found = new Map<string, string>(); // query -> seed that produced it
  let reached = 0;
  for (const seed of seeds) {
    const seedTokens = [...getTitleKeywords(seed)];
    const need = Math.max(1, Math.ceil(seedTokens.length / 2));
    for (const p of [seed, `how to ${seed}`, `what is ${seed}`, `${seed} error`]) {
      const r = await fetchSuggest(p);
      if (r) {
        reached++;
        for (const q of r.map((x) => x.toLowerCase())) if (q !== seed.toLowerCase() && seedTokens.filter((t) => q.includes(t)).length >= need && !found.has(q)) found.set(q, seed);
      }
      await sleep(200);
    }
    if (found.size >= 12) break;
  }
  const queries = [...found.keys()];
  // The seed used for coverage / subject checks is the one that produced the most suggestions.
  const perSeed = new Map<string, number>();
  for (const sd of found.values()) perSeed.set(sd, (perSeed.get(sd) ?? 0) + 1);
  const best = [...perSeed.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? seeds[0] ?? searchSeed(title);
  return { seed: best, queries, questions: queries.filter((q) => QUESTION_START_RE.test(q)), available: reached > 0 };
}

/** True when the topic shows demonstrable search demand (or demand data is unavailable → fail open). */
export function hasSearchDemand(plan: KeywordPlan): boolean {
  return !plan.available || plan.queries.length >= MIN_DEMAND_QUERIES;
}

/** Queries handed to the writer: questions first, then the rest, capped. */
export function pickTargetQueries(plan: KeywordPlan, max = 10): string[] {
  return [...new Set([...plan.questions, ...plan.queries])].slice(0, max);
}

/** Content words of a query that are not part of the seed itself. */
function distinctiveTokens(query: string, seed: string): string[] {
  const seedSet = getTitleKeywords(seed);
  return [...getTitleKeywords(query)].filter((t) => !seedSet.has(t));
}

/** Which target queries the article answers in a heading or FAQ question (>=60% of the query's
 *  distinctive words present in a single heading/question). */
export function coveredQueries(plan: KeywordPlan, html: string, faqs: { question: string }[]): string[] {
  const spots = [...html.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi)].map((m) => decode(m[1]).toLowerCase()).concat(faqs.map((f) => f.question.toLowerCase()));
  const covered: string[] = [];
  for (const q of pickTargetQueries(plan, 12)) {
    const toks = distinctiveTokens(q, plan.seed);
    if (toks.length === 0) continue;
    const need = Math.max(1, Math.ceil(toks.length * 0.6));
    if (spots.some((s) => toks.filter((t) => s.includes(t)).length >= need)) covered.push(q);
  }
  return covered;
}

export function findKeywordCoverageIssues(plan: KeywordPlan, html: string, faqs: { question: string }[]): string[] {
  if (!plan.available || plan.queries.length < 4) return [];
  const covered = coveredQueries(plan, html, faqs);
  if (covered.length >= MIN_COVERED_QUERIES) return [];
  return [`only ${covered.length} of the real search queries are answered in a heading or FAQ question (need ${MIN_COVERED_QUERIES}) — rewrite headings / FAQ questions so they carry the wording searchers actually use, e.g. ${pickTargetQueries(plan, 6).map((q) => `"${q}"`).join(', ')}`];
}

/**
 * Planner-keyword gate (2026-10-27, owner: "the keyword is very important"). For a topic chosen from real Keyword Planner
 * demand (Topic.keyword) the page must actually carry that wording, where search engines and readers look first:
 *   - the primary term in the title or seoTitle, AND in the meta description,
 *   - the primary term in the first ~120 words of the body (the opening block),
 *   - the primary term in at least one H2/H3 or FAQ question,
 *   - the primary term at least MIN_PRIMARY_MENTIONS times in the prose (not in code) - a floor, not a target.
 * Matching is by WORDS, not by exact phrase: all words of the term inside one short window, in any order, so "list tables in
 * Postgres" counts for "postgres list tables" and "Python try/except" for "try except python" (search engines match that way too, and an
 * exact-order rule had pushed every title into the same awkward keyword-first shape, which reads as a template farm).
 * `also` (related Planner keywords the page absorbs) and `related` (SERP "people also search for" wording) are ADVISORY: returned in
 * `missingRelated` so they can be reported; forcing them in made sentences exist only to hold a keyword.
 * Case, punctuation and a leading backslash are ignored, so "\dt" style terms and "pg_stat_statements" still match.
 */
export const MIN_PRIMARY_MENTIONS = 3;
export interface PlannerKeyword { term: string; volume: number; also?: string[]; related?: string[]; plannerDate: string }
// "postgres" and "postgresql" are the same word to searchers; try/except -> "try except"; backslashes and punctuation are dropped.
const norm = (s: string) => ' ' + decode(s).toLowerCase().replace(/postgresql/g, 'postgres').replace(/[^a-z0-9_]+/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
const wordsOf = (s: string) => norm(s).trim().split(' ').filter(Boolean);
/** Places where every word of `term` occurs inside one window of (term length + 3) words, any order. */
function fuzzyCount(hay: string, term: string): number {
  const t = [...new Set(wordsOf(term))];
  const w = wordsOf(hay);
  let c = 0;
  for (let i = 0; i < w.length;) {
    if (!t.includes(w[i])) { i++; continue; }
    const win = w.slice(i, i + t.length + 3);
    if (t.every((x) => win.includes(x))) { c++; i += t.length + 3; } else i++;
  }
  return c;
}

export function findPlannerKeywordIssues(kw: PlannerKeyword | undefined, doc: { title: string; seoTitle: string; metaDescription: string; html: string; faqs: { question: string }[] }): { issues: string[]; missingRelated: string[] } {
  if (!kw) return { issues: [], missingRelated: [] };
  const has = (hay: string, term: string) => fuzzyCount(hay, term) > 0;
  const issues: string[] = [];
  const proseText = decode(doc.html.replace(/<pre[\s\S]*?<\/pre>/gi, ' '));
  const opening = proseText.split(' ').slice(0, 120).join(' ');
  const headings = [...doc.html.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi)].map((m) => m[1]).concat(doc.faqs.map((f) => f.question));
  if (!has(doc.title, kw.term) && !has(doc.seoTitle, kw.term)) issues.push(`Planner keyword "${kw.term}" is not in the title or seoTitle`);
  if (!has(doc.metaDescription, kw.term)) issues.push(`Planner keyword "${kw.term}" is not in the meta description`);
  if (!has(opening, kw.term)) issues.push(`Planner keyword "${kw.term}" is not in the first 120 words (the opening block)`);
  if (!headings.some((h) => has(h, kw.term))) issues.push(`Planner keyword "${kw.term}" is in no H2/H3 heading or FAQ question`);
  const n = fuzzyCount(proseText, kw.term);
  if (n < MIN_PRIMARY_MENTIONS) issues.push(`Planner keyword "${kw.term}" appears ${n}x in the prose (need at least ${MIN_PRIMARY_MENTIONS}, naturally)`);
  const all = proseText + ' ' + doc.faqs.map((f) => f.question).join(' ');
  return { issues, missingRelated: [...(kw.also ?? []), ...(kw.related ?? [])].filter((r) => !has(all, r)) };
}

/** Prompt block that tells the writer the Planner keyword rules the gate above enforces. Empty for topics without one. */
export function plannerKeywordPromptBlock(kw: PlannerKeyword | undefined): string {
  if (!kw) return '';
  const also = (kw.also ?? []).length ? `\n- Related Planner keywords this page absorbs (use them where a sentence genuinely needs them; never add a sentence just to hold one): ${kw.also!.map((a) => `"${a}"`).join(', ')}.` : '';
  const related = (kw.related ?? []).length ? `\n- Wording people also search for (same rule): ${kw.related!.map((r) => `"${r}"`).join(', ')}.` : '';
  return `\nPLANNER KEYWORD (real Google Keyword Planner demand, ${kw.plannerDate}; the owner treats this as very important):\n- Primary keyword: "${kw.term}" (about ${kw.volume} searches a month).\n- Its words must appear together (any order, in the same short stretch of text: "list tables in Postgres" counts for "postgres list tables") in: the title or seoTitle, the metaDescription, the first 120 words of the body, at least one H2/H3 or FAQ question, and at least ${MIN_PRIMARY_MENTIONS} times in the prose overall, in natural sentences.${also}${related}\n- Vary the title shape and the wording from article to article: the same keyword-first title pattern on many pages reads as a template.\n`;
}

/** Prompt block listing the real queries. Empty when none are known. */
export function keywordPromptBlock(plan: KeywordPlan): string {
  const qs = pickTargetQueries(plan, 10);
  if (!plan.available || qs.length === 0) return '';
  return `\nREAL SEARCH QUERIES (Google autocomplete, today — what people actually type about "${plan.seed}"):\n${qs.map((q) => `- ${q}`).join('\n')}\nRules for using them: answer at least ${MIN_COVERED_QUERIES + 1} of them for real — as an H2/H3 whose wording carries the query's distinctive words, or as an FAQ question phrased the way searchers phrase it — and answer each one in the first one or two sentences under it (that is the sentence answer engines lift). Never list the queries, never stuff them; a query that does not fit this article is simply skipped.\n`;
}

export const KEYWORD_LIMITS = { MIN_DEMAND_QUERIES, MIN_COVERED_QUERIES };
