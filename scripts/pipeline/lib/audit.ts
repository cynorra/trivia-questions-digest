/**
 * Independent AI auditor — stands in for the human review step.
 *
 * A second model call, with a different job and prompt from the writer, judges the finished
 * article the way an AdSense / Google helpful-content reviewer would. Two safeguards keep a
 * model judge honest:
 *  1. Every problem it reports must QUOTE the article. A quote that is not actually in the text
 *     is discarded, and a low score with no verified quote behind it is not counted — so it
 *     cannot fail an article on a vague or hallucinated impression.
 *  2. The pass/fail decision is computed here from the scores, never taken from the model's own
 *     "verdict".
 *
 * Pure helpers (buildAuditPrompt, evaluateAudit) are exported so quality-selftest.ts can test them.
 */
import type { GoogleGenAI } from '@google/genai';
import { callGemini } from './shared';

export const AUDIT_CATEGORIES = ['originalValue', 'specificity', 'accuracyRisk', 'titlePromise', 'searchIntentFit', 'scaledContentRisk'] as const;
export type AuditCategory = (typeof AUDIT_CATEGORIES)[number];

export interface AuditProblem {
  category: AuditCategory;
  severity: 'blocking' | 'minor';
  quote: string;
  why: string;
  fix: string;
}
export interface RawAudit {
  scores: Record<AuditCategory, number>;
  problems: AuditProblem[];
}
export interface AuditResult {
  pass: boolean;
  scores: Record<AuditCategory, number>;
  average: number;
  /** problems whose quote really occurs in the article */
  problems: AuditProblem[];
  /** problems dropped because the quote is not in the article */
  discarded: number;
}

export const AUDIT_SCHEMA = {
  type: 'object',
  properties: {
    scores: {
      type: 'object',
      properties: Object.fromEntries(AUDIT_CATEGORIES.map((c) => [c, { type: 'integer' }])),
      required: [...AUDIT_CATEGORIES],
    },
    problems: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          category: { type: 'string', enum: [...AUDIT_CATEGORIES] },
          severity: { type: 'string', enum: ['blocking', 'minor'] },
          quote: { type: 'string' },
          why: { type: 'string' },
          fix: { type: 'string' },
        },
        required: ['category', 'severity', 'quote', 'why', 'fix'],
      },
    },
  },
  required: ['scores', 'problems'],
};

export const AUDIT_SYSTEM =
  'You are a strict, skeptical content-quality reviewer for Google AdSense and Google Search helpful-content policies. You judge the article you are given, not the topic. You never praise; you find what would make a reviewer call it low-value, thin, templated or mass-produced. You return only the requested structured output.';

const plain = (html: string) =>
  html.replace(/<[^>]+>/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();

export function buildAuditPrompt(title: string, cluster: string, contentHtml: string, facts = '', extra = ''): string {
  const today = new Date().toISOString().slice(0, 10);
  return `Review this article as an AdSense / helpful-content reviewer deciding whether the page is "low value content". Title: "${title}" (cluster: ${cluster}).

Today's date is ${today}. Your training data is OLDER than that, so model names, versions and dates you do not recognise are NOT evidence of fabrication.${facts ? ` The following facts were read from each vendor's own documentation and are authoritative — never report a model name, tier or 2026 date that matches them as invented or "hallucinated":\n${facts}\n` : ' Do not report an unfamiliar model name or a 2026 date as invented unless the article contradicts itself.'}
Judge accuracyRisk only on claims you can see are wrong or self-contradictory from the text itself (e.g. code that cannot work, numbers that contradict each other, a feature claimed that the article later denies).

${extra ? `${extra}
` : ''}
Score each category 1-5 (5 = clearly fine, 3 = borderline, 1 = a reviewer would reject):
- originalValue: does it give a reader something a generic summary of the official docs would not (a specific cause, trade-off, failure mode, worked example)? Or is it a rewrite of common knowledge?
- specificity: concrete, checkable details (exact errors, config keys, versions, numbers, named identifiers) versus vague advice and filler.
- accuracyRisk: claims that look invented, unverifiable, outdated, or internally inconsistent; code that could not work as written. (5 = nothing suspicious.)
- titlePromise: does the body deliver everything the title promises (a ranking, N items, a comparison, a named tool)?
- searchIntentFit: would a person searching this title get their question actually answered, early and clearly?
- scaledContentRisk: does it read like one of hundreds of interchangeable AI articles (stock structure, repeated phrasing, padding to hit a word count, restating the same point)? (5 = does not.)

For EVERY score of 3 or below, and for any other defect you find, add a problem with:
- quote: an EXACT, verbatim excerpt (8-25 words) copied from the article that shows the defect. Do not paraphrase — a quote that is not in the article is thrown away.
- severity: "blocking" if a reviewer would reject the page for it, otherwise "minor".
- why: one sentence. fix: one concrete sentence on what to write instead.
Do not invent problems to look thorough: if the article is genuinely good, return high scores and an empty or short problems list.

ARTICLE (HTML tags removed):
${plain(contentHtml)}`;
}

const norm = (s: string) => plain(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

/** Turns the model's raw judgement into a verified result. Pass rule (computed here):
 *  no category effectively below 3, average >= minAverage, and no verified blocking problem. */
export function evaluateAudit(raw: RawAudit, contentHtml: string, minAverage = 3.8, strict = false): AuditResult {
  const text = norm(contentHtml);
  const verified = (raw.problems ?? []).filter((p) => {
    const q = norm(p.quote ?? '');
    return q.length >= 20 && text.includes(q);
  });
  const discarded = (raw.problems ?? []).length - verified.length;

  const scores = {} as Record<AuditCategory, number>;
  for (const c of AUDIT_CATEGORIES) {
    let s = Math.max(1, Math.min(5, Math.round(Number(raw.scores?.[c]) || 3)));
    // A low score must be backed by at least one verified quote in that category.
    if (s < 3 && !verified.some((p) => p.category === c)) s = 3;
    scores[c] = s;
  }
  const average = AUDIT_CATEGORIES.reduce((a, c) => a + scores[c], 0) / AUDIT_CATEGORIES.length;
  const blocking = verified.some((p) => p.severity === 'blocking');
  // strict (new grounded pipeline): the three categories that decide AdSense "low value" must each be >= 4.
  const strictOk = !strict || (['originalValue', 'accuracyRisk', 'scaledContentRisk'] as AuditCategory[]).every((c) => scores[c] >= 4);
  const pass = AUDIT_CATEGORIES.every((c) => scores[c] >= 3) && average >= minAverage && !blocking && strictOk;
  return { pass, scores, average, problems: verified, discarded };
}

/** Repair-loop instructions for a failed audit (verified problems only). */
export function auditIssues(r: AuditResult): string[] {
  const low = AUDIT_CATEGORIES.filter((c) => r.scores[c] <= 3).map((c) => `${c} ${r.scores[c]}/5`);
  const head = `independent quality audit failed (average ${r.average.toFixed(1)}/5${low.length ? `; weak: ${low.join(', ')}` : ''})`;
  const items = r.problems
    .sort((a, b) => Number(b.severity === 'blocking') - Number(a.severity === 'blocking'))
    .slice(0, 6)
    .map((p) => `[${p.severity}/${p.category}] "${p.quote}" — ${p.why} Fix: ${p.fix}`);
  return [head, ...items];
}

/** Runs the audit. Returns null when the model call or its JSON is unusable (caller decides). */
export async function auditArticle(clients: GoogleGenAI[], title: string, cluster: string, contentHtml: string, minAverage = 3.8, facts = '', extra = '', strict = false): Promise<AuditResult | null> {
  const text = await callGemini(clients, buildAuditPrompt(title, cluster, contentHtml, facts, extra), AUDIT_SCHEMA, 4000, false, AUDIT_SYSTEM);
  if (!text) return null;
  try {
    return evaluateAudit(JSON.parse(text) as RawAudit, contentHtml, minAverage, strict);
  } catch {
    return null;
  }
}
