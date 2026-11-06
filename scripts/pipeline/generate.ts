/**
 * Trivia Questions Digest article generator — the aiandsoftwarehub pipeline, adapted for an
 * quiz site and a Firestore backend.
 *
 *   npx tsx scripts/pipeline/generate.ts --dry-run        # write nothing; print the verdict
 *   npx tsx scripts/pipeline/generate.ts                  # one article -> draft (pending review)
 *   npx tsx scripts/pipeline/generate.ts --date 2026-11-10
 *
 * Flow: pick the next topic from topics.ts that passes the topic gate and is not
 * a duplicate -> build its evidence (code-verified practice questions from the
 * site's own data + the facts block) -> keyword plan (autocomplete) and an
 * editorial form chosen against the corpus -> Gemini writes structured JSON ->
 * deterministic gates -> one repair pass with the gate messages -> if it passes,
 * the exact markdown that was validated is written to src/content/guides/<slug>.md
 * with draft: true and the SAME bytes are upserted to Firestore as status 'draft'.
 * Nothing goes live here: auto-publish.ts runs the AI audit and publishes.
 *
 * Hard rules from the playbook: validated bytes = written bytes = pushed bytes;
 * links to unknown slugs are stripped before validation; truncated output fails;
 * the final Gemini error is never swallowed (exit code 1).
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { initGemini, callGemini, slugify, isDuplicateTopic, fetchAllArticles, upsertArticle, SITE_NAME, SITE_NICHE, type ArticleRow } from './lib/shared';
import { TOPICS } from './topics';
import { findTopicIssues, type SiteTopic } from './lib/topic-intent';
import { FACTS, findFactIssues } from './lib/facts';
import { evidenceBlock, findEvidenceUsageIssues, ARTICLE_KIND } from './lib/evidence';
import { buildKeywordPlan, keywordPromptBlock, findKeywordCoverageIssues, findPlannerKeywordIssues, plannerKeywordPromptBlock, type KeywordPlan } from './lib/keywords';
import { pickEditorialForm, formPromptBlock, findOpeningIssues, openingKey } from './lib/forms';
import { findLowValueSignals, findBridgeFiller, swapBannedVerbs, findGenericFaqAnswers } from './lib/value';
import { findStockHeadings, findReusedHeadings, findStockLabels, collectHeadingSet } from './lib/structure';
import { findTitlePasteIssues } from './lib/title-paste';
import { findUnsupportedClaims, findTitlePromiseIssues } from './lib/claims-check';
import { findHypeIssues, findFieldClaimIssues, findBrokenInternalLinks } from './lib/hype-check';
// The site's own question bank: the same code the practice pages run.

const ROOT = join(import.meta.dirname, '..', '..');
const GUIDES = join(ROOT, 'src', 'content', 'guides');
const DRY = process.argv.includes('--dry-run');
const dateArg = process.argv.indexOf('--date');
const PUBLISH_DATE = dateArg > -1 ? process.argv[dateArg + 1] : new Date().toISOString().slice(0, 10);
const MAX_OUTPUT_TOKENS = 8192;
const MIN_WORDS = 900;

// ---- evidence: the site's own data (lib/evidence.ts) ---------------------------------------

// ---- output contract --------------------------------------------------------------------------
const SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    metaDescription: { type: 'string' },
    quickAnswer: { type: 'string' },
    bodyHtml: { type: 'string' },
    faqs: { type: 'array', items: { type: 'object', properties: { question: { type: 'string' }, answer: { type: 'string' } }, required: ['question', 'answer'] } },
  },
  required: ['title', 'metaDescription', 'bodyHtml'],
};
interface Draft { title: string; metaDescription: string; quickAnswer?: string; bodyHtml: string; faqs?: { question: string; answer: string }[] }

// Layout varies per article so the site is not one shape: the quick-answer box and the FAQ block each appear
// on only some articles (decided by a hash of the topic slug, so a retry keeps the same layout).
export interface Layout { box: boolean; faq: boolean }
export function layoutFor(slug: string): Layout {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  const b = h % 5; // 0 both, 1 box only, 2 FAQ only, 3-4 neither
  return { box: b === 0 || b === 1, faq: b === 0 || b === 2 };
}

const SYSTEM = `You write for ${SITE_NAME} (${SITE_NICHE}). You are precise and plain-spoken. You never invent facts, statistics, studies or quotes. You only state facts that appear in the FACTS or DATA blocks, and you copy names, answers and dates exactly as given. Return only the requested JSON.`;

function buildPrompt(topic: SiteTopic, plan: KeywordPlan, formBlock: string, candidates: ArticleRow[], layout: Layout, feedback = ''): string {
  const links = candidates.filter((c) => c.status === 'published').slice(0, 25).map((c) => `- /guides/${c.slug}/ — ${c.title}`).join('\n');
  return `Write a ${ARTICLE_KIND}.
Working title: "${topic.title}"
What this page must deliver that an AI Overview cannot: ${topic.asset}.
${plannerKeywordPromptBlock({ term: topic.keyword, volume: topic.volume, plannerDate: '2026-11-01' })}
${keywordPromptBlock(plan)}
${FACTS}
${evidenceBlock(topic.data)}
${formBlock}
FORMAT
- bodyHtml: HTML using only <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <table>/<thead>/<tbody>/<tr>/<th>/<td>, <a href>. No <h1>, no inline styles, no scripts, no markdown.
- 1,100 to 1,700 words in bodyHtml. Short paragraphs. At least one table if the topic has numbers to compare.
- CONCRETE DETAILS: Include exact numbers with units throughout (e.g. "10 questions", "4 rounds", "25 players", "1 point", "15 minutes", years/dates) and quote specific example questions and answers in double quotes. Avoid vague generalities. Every FAQ answer must include at least one concrete detail (a specific number, count, date, or quoted fact from the DATA/FACTS blocks).
${layout.box
    ? '- quickAnswer: 2-3 sentences that answer the title directly with a concrete detail; it is shown in a box at the top.'
    : '- quickAnswer: leave it out (empty string). This article has no summary box; the opening paragraph of bodyHtml answers the title itself, in a way that fits the editorial form.'}
${layout.faq
    ? '- faqs: 3 or 4 questions people actually search, each answer 2-4 sentences with a concrete detail (a name, answer or fact from the DATA or FACTS blocks).'
    : '- faqs: return an empty array. This article has no FAQ block; end on the last section of the editorial form, not on a list of questions.'}
- metaDescription: 120-160 characters, includes the primary keyword, no hype.
- title: at most 70 characters, includes the primary keyword, no year, no promises.
- Internal links: only to the question pages named in the DATA blocks and, if relevant, to these guides (copy the path exactly):
${links || '- (none yet)'}
- Do not start with "In this article", "Whether you", "Are you", or any sentence about the article itself.
- Never claim to be official, never use the words guarantee/guaranteed.
${feedback ? `\nYOUR PREVIOUS DRAFT FAILED THESE CHECKS — fix every one:\n${feedback}\n` : ''}`;
}

// ---- assembly: the exact markdown that is validated, written and pushed -------------------------
const esc = (s: string) => s.replace(/"/g, "'");
function assemble(d: Draft, topic: SiteTopic, knownSlugs: Set<string>, layout: Layout): { md: string; html: string; title: string; description: string } {
  let body = swapBannedVerbs(d.bodyHtml).trim();
  // Rule 3: unwrap links to guides that don't exist (quiz pages always exist).
  body = body.replace(/<a [^>]*href=["'](?:https?:\/\/[^/"']+)?\/guides\/([^"'#?/]+)\/?["'][^>]*>([\s\S]*?)<\/a>/gi, (m, slug, text) => (knownSlugs.has(slug) ? m : text));
  const faqs = layout.faq ? d.faqs ?? [] : [];
  const faq = faqs.length ? `\n\n<h2>Frequently asked questions</h2>\n${faqs.map((f) => `<h3>${f.question.trim()}</h3>\n<p>${f.answer.trim()}</p>`).join('\n')}` : '';
  const quick = layout.box && d.quickAnswer?.trim() ? `<div class="key-takeaway"><p><strong>Quick answer:</strong> ${d.quickAnswer.trim()}</p></div>\n\n` : '';
  const html = `${quick}${body}${faq}\n`;
  const title = d.title.trim().slice(0, 80);
  const description = d.metaDescription.trim().replace(/\s+/g, ' ');
  const md = `---\ntitle: "${esc(title)}"\ndescription: "${esc(description)}"\npublished: ${PUBLISH_DATE}\ntool: ${topic.tool}\ndraft: true\n---\n\n${html}`;
  return { md, html, title, description };
}

function validate(a: { html: string; title: string; description: string }, d: Draft, topic: SiteTopic, plan: KeywordPlan, corpus: { headings: Set<string>; openings: Set<string>; slugs: Set<string> }): string[] {
  const plain = a.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = plain.split(' ').length;
  const issues: string[] = [];
  const faqs = d.faqs ?? [];
  if (a.title.length < 15 || a.title.length > 80) issues.push(`title must be 15-80 characters (is ${a.title.length})`);
  if (a.description.length < 70 || a.description.length > 165) issues.push(`metaDescription must be 70-165 characters (is ${a.description.length})`);
  if (/\b20[0-2]\d\b/.test(a.title)) issues.push('title contains a year');
  if (words < MIN_WORDS) issues.push(`too short: ${words} words (need ${MIN_WORDS}+ of substance, not padding)`);
  // Rule 9: a body that doesn't end on a finished sentence is truncated output.
  const lastText = d.bodyHtml.replace(/<[^>]+>/g, ' ').trim();
  if (!/[.!?:)"”]$/.test(lastText)) issues.push('body does not end on a finished sentence (truncated output)');
  if (/<h1[\s>]|<script|style=/i.test(a.html)) issues.push('forbidden markup (<h1>, <script> or inline style)');
  issues.push(...findLowValueSignals(a.html, topic.tool));
  issues.push(...findBridgeFiller(a.html));
  const stock = findStockHeadings(a.html);
  if (stock.length) issues.push(`stock headings: ${stock.join(', ')}`);
  issues.push(...findReusedHeadings(a.html, corpus.headings));
  issues.push(...findStockLabels(a.html));
  issues.push(...findTitlePasteIssues(a.html, a.title));
  issues.push(...findUnsupportedClaims(plain));
  issues.push(...findTitlePromiseIssues(a.title, a.html));
  issues.push(...findHypeIssues(plain, 'body'));
  issues.push(...findFieldClaimIssues({ title: a.title, metaDescription: a.description, faqs }));
  issues.push(...findBrokenInternalLinks(a.html, corpus.slugs));
  issues.push(...findFactIssues(plain));
  issues.push(...findOpeningIssues(a.html, corpus.openings));
  issues.push(...findGenericFaqAnswers(faqs));
  issues.push(...findEvidenceUsageIssues(a.html, topic.data));
  issues.push(...findPlannerKeywordIssues({ term: topic.keyword, volume: topic.volume, plannerDate: '2026-11-01' }, { title: a.title, seoTitle: a.title, metaDescription: a.description, html: a.html, faqs }).issues);
  issues.push(...findKeywordCoverageIssues(plan, a.html, faqs));
  return issues;
}

// ---- main ------------------------------------------------------------------------------------------
function localRows(): ArticleRow[] {
  if (!existsSync(GUIDES)) return [];
  return readdirSync(GUIDES).filter((f) => f.endsWith('.md')).map((f) => {
    const t = readFileSync(join(GUIDES, f), 'utf8');
    const title = /title: "(.*)"/.exec(t)?.[1] ?? f;
    return { slug: f.replace(/\.md$/, ''), title, description: '', body_md: t, tool: '', status: /draft: true/.test(t) ? 'draft' : 'published', published_at: null } as ArticleRow;
  });
}

async function main() {
  const clients = initGemini();
  let rows: ArticleRow[] = [];
  try { rows = await fetchAllArticles(); } catch (e) {
    if (!DRY) throw e;
    console.warn(`Firestore not reachable (${(e as Error).message}); dry run continues with local guides only.`);
  }
  const local = localRows();
  const all = [...new Map([...local, ...rows].map((r) => [r.slug, r])).values()];
  const titles = all.map((r) => r.title);
  const corpus = {
    headings: collectHeadingSet(all.map((r) => r.body_md)),
    openings: new Set(all.map((r) => openingKey(r.body_md)).filter(Boolean)),
    slugs: new Set(all.filter((r) => r.status === 'published').map((r) => r.slug)),
  };

  const topic = TOPICS.find((t) => findTopicIssues(t).length === 0 && !isDuplicateTopic(t.title, titles) && !all.some((r) => r.slug === slugify(t.title)));
  if (!topic) { console.log('No eligible topic left in topics.ts — add topics from the Keyword Planner export.'); return; }
  console.log(`Topic: ${topic.title}  [${topic.keyword}, ${topic.volume}/mo, ${topic.tool}]`);

  const plan = await buildKeywordPlan(topic.title);
  const usedForms = all.map((r) => (r as any).meta?.form as string | undefined);
  const form = pickEditorialForm(topic.tool, slugify(topic.title), usedForms);
  console.log(`Form: ${form.id} · data sets: ${topic.data.join(', ')} · autocomplete queries: ${plan.queries.length}${plan.available ? '' : ' (unavailable)'}`);

  const layout = layoutFor(slugify(topic.title));
  console.log(`Layout: quick-answer box ${layout.box ? 'yes' : 'no'}, FAQ block ${layout.faq ? 'yes' : 'no'}`);
  let feedback = '';
  for (let attempt = 1; attempt <= 3; attempt++) {
    const raw = await callGemini(clients, buildPrompt(topic, plan, formPromptBlock(form), all, layout, feedback), SCHEMA, MAX_OUTPUT_TOKENS, false, SYSTEM);
    if (!raw) { console.warn(`Attempt ${attempt}: no completed response from Gemini.`); continue; }
    let d: Draft;
    try { d = JSON.parse(raw); } catch { feedback = '- the response was not valid JSON matching the schema'; console.warn(`Attempt ${attempt}: invalid JSON`); continue; }
    const a = assemble(d, topic, corpus.slugs, layout);
    const issues = validate(a, d, topic, plan, corpus);
    if (issues.length) {
      console.warn(`Attempt ${attempt}: ${issues.length} quality issue(s):\n${issues.map((i) => `  - ${i}`).join('\n')}`);
      feedback = issues.map((i) => `- ${i}`).join('\n');
      continue;
    }
    const slug = slugify(a.title);
    if (DRY) {
      const out = join(ROOT, '.dry-run');
      if (!existsSync(out)) (await import('node:fs')).mkdirSync(out);
      writeFileSync(join(out, `${slug}.md`), a.md);
      console.log(`PASS (dry run): .dry-run/${slug}.md — nothing written to the site or Firestore.`);
      return;
    }
    // Rule 1: write, read back, push the bytes that were read back.
    const file = join(GUIDES, `${slug}.md`);
    writeFileSync(file, a.md);
    const written = readFileSync(file, 'utf8');
    if (written !== a.md) throw new Error('written file differs from validated text');
    const body = written.split(/^---\n[\s\S]*?\n---\n\n/m)[1];
    await upsertArticle({ slug, title: a.title, description: a.description, body_md: body, tool: topic.tool, status: 'draft', published_at: null, meta: { form: form.id, keyword: topic.keyword, publishOn: PUBLISH_DATE, data: topic.data } } as any);
    console.log(`DRAFT written: src/content/guides/${slug}.md and Firestore (status draft). auto-publish.ts decides if it goes live.`);
    return;
  }
  // Rule 4: fail loudly.
  console.error('FAILED: no draft passed the quality gates after 3 attempts.');
  process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
