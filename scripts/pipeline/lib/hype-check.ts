/**
 * Hype, absolute-claim and link-integrity gates, added after the 2026-10-03 content audit found, on 38 of 59
 * LIVE articles, wording the pipeline could not stand behind: "production-grade", "enterprise-grade",
 * "gold standard", "unmatched", "state-of-the-art", "guarantees", "eliminates", "perfect for", "highly secure",
 * and unsourced "up to 80%" figures — in the body AND in the title, meta description and FAQ answers
 * (which feed search snippets, social cards and FAQ schema). It also found internal links to slugs that did
 * not exist ("...fable-5-1-..." vs "...fable-5-...").
 *
 * What these checks do NOT do: they cannot tell whether a sentence is true. They remove the vocabulary that
 * asserts quality, maturity or certainty without evidence, so the writer has to state what was actually seen
 * (a version, a setting, a measured number with its environment) or hedge. Pure functions, no network.
 *
 * Calibration: scripts/audit-claims.ts runs these over the live corpus and must report 0 flagged; the cases in
 * scripts/quality-selftest.ts pin both what must be caught and what must NOT be (plain "highly optimized",
 * "enterprise-grade GPUs", "ACID guarantees", questions, negated sentences, inline maths).
 */
import { findUnsupportedClaims } from './claims-check';

const NEGATION_RE = /\b(not|n't|no|never|cannot|can't|without|nor|neither|rarely)\b/i;

/** Matched per sentence. `allowNegated`: skip the sentence when it negates the claim ("does not guarantee ..."). */
const HYPE: { re: RegExp; what: string; allowNegated?: boolean }[] = [
  {
    // Not hardware nouns ("enterprise-grade GPUs").
    re: /\b(production|enterprise)[- ](grade|ready|tested|class)\b(?!\s+(GPUs?|hardware|servers?|clusters?|SSDs?|disks?|chips?|accelerators?))|\bbattle[- ]tested\b/i,
    what: 'unsupported maturity claim ("production-grade", "enterprise-ready", "battle-tested")',
    allowNegated: true,
  },
  {
    re: /\bthe gold standard\b|\bunmatched\b|\bunparalleled\b|\bunrivall?ed\b|\bunbeatable\b|\bbest[- ]in[- ]class\b|\bworld[- ]class\b|\bstate[- ]of[- ]the[- ]art\b|\bcutting[- ]edge\b|\bgame[- ]chang\w+|\brevolutioni[sz]\w+|\bdefinitive (guide|choice|winner|answer|solution)\b|\bthe ultimate\b|\bultimate (step|guide|solution|choice|retrieval|tool)\b|\bflawless\w*/i,
    what: 'superlative marketing wording ("gold standard", "unmatched", "state-of-the-art", "ultimate")',
  },
  {
    // Verb forms; the noun in "ACID guarantees" is fine.
    re: /(?<!ACID )(?<!delivery )(?<!ordering )\b(guarantee[sd]?|guaranteeing)\b/i,
    what: 'absolute "guarantee" claim (a model, cache or network cannot guarantee an outcome — say what it makes more likely)',
    allowNegated: true,
  },
  {
    re: /\b(completely|entirely|totally|fully|always|absolutely) (eliminat\w+|prevents?|solves?|secure|safe|reliable|accurate)\b|\beliminat(es|ing) (all|every|hallucinations?|the risk)\b|\b(highly|fully|completely|perfectly|absolutely) secure\b|\b100\s?% (secure|safe|compliant|accurate|reliable|uptime|guaranteed)\b/i,
    what: 'absolute claim ("completely secure/safe", "eliminates the risk", "100% safe")',
    allowNegated: true,
  },
  {
    re: /\bperfect(ly)? (for|balance|choice|solution|fit|tool|answer)\b|\bis perfect\b|\bmaking it perfect\b|\bbest of both worlds\b|\b(is|are|vastly|far|clearly) superior\b|\bsuperior (to|choice|index|performance|option|tool|speed|tool-use)\b/i,
    what: 'unqualified praise ("perfect for", "vastly superior", "best of both worlds")',
  },
  {
    re: /\b(incredibly|exceptionally|remarkably|vastly|dramatically|massively|unbelievably) (low|fast|cheap|efficient|powerful|stable|predictable|resilient|scalable|accurate)\b/i,
    what: 'intensifier claim ("incredibly fast", "exceptionally stable", "dramatically cheaper")',
  },
];

function sentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+/).filter(Boolean);
}

/** One message per distinct hype/absolute-claim problem in a block of plain text. `where` names the field. */
export function findHypeIssues(plainText: string, where = 'body'): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const s of sentences(plainText)) {
    if (/\?\s*$/.test(s)) continue; // a question states nothing
    if (/\$[^$]*\\[A-Za-z]+[^$]*\$/.test(s)) continue; // inline maths, e.g. "$\Delta W = 0$"
    for (const { re, what, allowNegated } of HYPE) {
      const m = s.match(re);
      if (!m) continue;
      if (allowNegated && NEGATION_RE.test(s)) continue;
      const key = `${where}:${what}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const at = m.index ?? 0;
      out.push(`${where} contains ${what}: "...${s.slice(Math.max(0, at - 30), at + 80).trim()}..." — state what was actually observed (a version, a setting, a number with its environment) or describe it neutrally`);
    }
  }
  return out;
}

export interface TextFields {
  title?: string;
  seoTitle?: string;
  metaDescription?: string;
  faqs?: { question: string; answer: string }[];
}

/** Title, seoTitle, metaDescription and FAQ text: hype words AND unsourced percentage/performance claims. */
export function findFieldClaimIssues(f: TextFields): string[] {
  const out: string[] = [];
  const named: [string, string][] = [
    ['title', f.title ?? ''],
    ['seoTitle', f.seoTitle ?? ''],
    ['metaDescription', f.metaDescription ?? ''],
    ...(f.faqs ?? []).flatMap((q, i): [string, string][] => [[`FAQ #${i + 1} question`, q.question ?? ''], [`FAQ #${i + 1} answer`, q.answer ?? '']]),
  ];
  for (const [where, text] of named) {
    if (!text.trim()) continue;
    out.push(...findHypeIssues(text, where));
    out.push(...findUnsupportedClaims(text).map((m) => `${where}: ${m}`));
  }
  return out;
}

/** Internal /guides/ links must point at a slug that exists (live, or in the candidate list given to the writer). */
export function findBrokenInternalLinks(html: string, validSlugs: Set<string>): string[] {
  if (validSlugs.size === 0) return [];
  const bad = new Set<string>();
  for (const m of html.matchAll(/(?:href=["']|\]\()(?:https?:\/\/[^/"')]+)?\/guides\/([^"'#?/)]+)/gi)) {
    if (!validSlugs.has(m[1])) bad.add(m[1]);
  }
  return [...bad].map((s) => `internal link to a slug that does not exist: /guides/${s} — link only to slugs from the candidate list, copied exactly`);
}
