/**
 * Deterministic "is this a generic summary?" measurements — the part of AdSense's
 * "low value content" judgement that can be computed without a model.
 *
 * Two signals, both per 1,000 words of prose + code:
 *  - specifics: concrete, checkable details (versions, error strings, units,
 *    identifiers in <code>, code blocks). A generic AI summary has few.
 *  - filler: sentences that carry no information ("plays a crucial role",
 *    "it's worth noting", "in today's fast-paced world", ...).
 * Thresholds were calibrated against the live corpus (scripts/audit-value.ts),
 * not guessed. Pure functions, no I/O, so quality-selftest.ts can test them.
 */

const stripTags = (s: string) => s.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;|&#\d+;/gi, ' ').replace(/\s+/g, ' ').trim();

export const FILLER_RES: RegExp[] = [
  /\b(plays?|playing) a (crucial|vital|key|pivotal|significant|important) role\b/i,
  /\bit(?:'s| is) (?:worth|important to) (?:noting|note|mention)\b/i,
  /\bin today'?s (?:fast-paced|digital|modern|ever-changing|rapidly)\b/i,
  /\b(?:ever-evolving|ever-changing|rapidly evolving) (?:landscape|world|field)\b/i,
  /\bwhen it comes to\b/i,
  /\b(?:a|the) (?:wide|vast|rich) (?:range|array|variety) of\b/i,
  /\bunlock(?:s|ing)? the (?:full )?(?:potential|power)\b/i,
  /\bgame[- ]chang(?:er|ing)\b/i,
  /\btake(?:s)? (?:your|it|things) to the next level\b/i,
  /\bseamless(?:ly)? (?:integrat|experience|workflow)/i,
  /\b(?:robust|powerful|comprehensive|cutting-edge|state-of-the-art) (?:solution|tool|platform|framework|approach)\b/i,
  /\bat the end of the day\b/i,
  /\bhelps? (?:you |users |teams )?(?:to )?(?:streamline|optimize|enhance|leverage)\b/i,
  /\bensur(?:e|es|ing) (?:that )?(?:your|you|a|the) .{0,40}(?:smooth|seamless|efficient|optimal)\b/i,
];

export interface ValueMetrics {
  words: number;
  /** concrete details per 1,000 words */
  specificsPer1k: number;
  /** filler sentences as a share of all sentences (0-1) */
  fillerShare: number;
  detail: { versions: number; units: number; inlineCode: number; codeBlocks: number; quotedStrings: number };
}

export function measureValue(html: string): ValueMetrics {
  const codeBlocks = (html.match(/<pre[\s>]/g) ?? []).length;
  const inlineCode = (html.replace(/<pre[\s\S]*?<\/pre>/g, ' ').match(/<code[\s>]/g) ?? []).length;
  const prose = stripTags(html.replace(/<pre[\s\S]*?<\/pre>/g, ' '));
  const words = prose.split(/\s+/).filter(Boolean).length;

  const versions = (prose.match(/\bv?\d+\.\d+(?:\.\d+)*\b/g) ?? []).length;
  // Specifics: counts, measurements and percentages.
  const units = (prose.match(/\b\d[\d,.]*\s?(?:questions?|rounds?|teams?|players?|points?|minutes?|seconds?|hours?|days?|years?|books?|presidents?|moons?|people|countries|states|capitals|islands|km|kilometers?|miles?|meters?|feet|square|%|percent|degrees?|°)\b|\$\s?\d[\d,.]*/gi) ?? []).length;
  // Quoted example sentences count: grammar guides are made of them.
  const quotedStrings = (prose.match(/["“][^"”]{12,160}["”]/g) ?? []).filter((q) => /[A-Za-z]/.test(q)).length;

  const specifics = versions + units + inlineCode + quotedStrings + codeBlocks * 4;
  const sentences = prose.split(/(?<=[.!?])\s+/).filter((s) => s.split(' ').length >= 5);
  const filler = sentences.filter((s) => FILLER_RES.some((re) => re.test(s))).length;

  return {
    words,
    specificsPer1k: words ? (specifics / words) * 1000 : 0,
    fillerShare: sentences.length ? filler / sentences.length : 0,
    detail: { versions, units, inlineCode, codeBlocks, quotedStrings },
  };
}

/** Minimums, calibrated on the live corpus (scripts/audit-value.ts, 58 articles:
 *  How-To/Troubleshooting never below 19.0, median ~35; Concepts explainers
 *  legitimately carry fewer versions/units — median 7.6 — so they get a lower bar).
 *  Filler peaked at 1.8% live, so 3% only trips on genuinely padded prose. */
export const MIN_SPECIFICS_PER_1K = 16;
export const MIN_SPECIFICS_PER_1K_CONCEPTS = 8;
export const MAX_FILLER_SHARE = 0.03;

/** Sentences that talk ABOUT the article instead of saying something ("it helps to look closely at...",
 *  "Diving deeper into X reveals..."). They appear when a repair pass pads to reach a word count; each one is
 *  a robotic-writing tell. Seen in the 2026-10-20 dry run. */
export const BRIDGE_RES: RegExp[] = [
  /\b(?:it|this) helps to (?:look|examine|understand|consider|explore)\b/i,
  /\bdiving (?:deeper|deep) into\b/i,
  /\b(?:to|let(?:'s| us)) (?:ground|illustrate|understand) (?:these|this|the) (?:concepts?|ideas?|mechanics)\b/i,
  /\breveals? how (?:robust|critical|important|complex)\b/i,
  /\bunderstanding how these (?:layers|components|pieces) interact requires\b/i,
  /\brequires looking at the mechanics\b/i,
  /\bmoving (?:on )?from .{3,60} to .{3,60} requires addressing\b/i,
  /\bconsider also the edge case\b/i,
  /\bwhen dealing with .{3,50}, it helps\b/i,
  /\b(?:let'?s|let us) (?:now )?(?:take a|have a) (?:closer )?look\b/i,
  /\bin this (?:section|article|guide),? we(?:'ll| will)\b/i,
];

export function findBridgeFiller(html: string): string[] {
  const prose = stripTags(html.replace(/<pre[\s\S]*?<\/pre>/g, ' '));
  const hits = prose.split(/(?<=[.!?])\s+/).filter((sent) => BRIDGE_RES.some((re) => re.test(sent)));
  if (!hits.length) return [];
  return [`${hits.length} sentence(s) talk about the article instead of saying something, e.g. "${hits[0].slice(0, 110)}…" — delete each one or replace it with a concrete fact from the source material. If the article is too short, add substance from the source pages (a real error, a limit, a step), never connective filler`];
}

/** Models keep writing "dive into"/"delve into" even when told not to; rewrite them mechanically (keeps the first letter's case). */
export function swapBannedVerbs(html: string): string {
  const map: Record<string, string> = { dive: 'look at', dives: 'looks at', diving: 'looking at', dived: 'looked at', delve: 'look at', delves: 'looks at', delving: 'looking at', delved: 'looked at' };
  return html.replace(/\b(dive|dives|diving|dived|delve|delves|delving|delved) into\b/gi, (_m, w: string) => {
    const r = map[w.toLowerCase()];
    return w[0] === w[0].toUpperCase() ? r[0].toUpperCase() + r.slice(1) : r;
  });
}

export function findLowValueSignals(html: string, cluster = ''): string[] {
  const m = measureValue(html);
  const min = cluster === 'strategy' ? MIN_SPECIFICS_PER_1K_CONCEPTS : MIN_SPECIFICS_PER_1K;
  const issues: string[] = [];
  if (m.specificsPer1k < min) {
    issues.push(
      `reads as a generic summary: only ${m.specificsPer1k.toFixed(1)} concrete details per 1,000 words (need ${min}+) — add what a generic summary lacks: quoted example sentences with the rule applied, worked problems with the numbers shown, exact counts and times of the test from the facts block, a table`,
    );
  }
  if (m.fillerShare > MAX_FILLER_SHARE) {
    issues.push(
      `${Math.round(m.fillerShare * 100)}% of sentences are filler ("plays a crucial role", "when it comes to", "robust solution"...) — rewrite them to state the specific fact or delete them`,
    );
  }
  return issues;
}

/**
 * FAQ answers that are generic (added 2026-10-25). The 2026-10-25 review found live FAQ answers that were
 * textbook definitions ("A system prompt is a permanent set of structural rules ...") or advice with no
 * number, flag, identifier or output in it — the part of a page that looks most like everyone else's.
 * An answer is flagged when it is long enough to carry a detail but contains none, or when it opens like a
 * dictionary entry and carries fewer than two. Number words and first-person test statements count as
 * details ("in my test", "I did not test"): an honest "not tested" is evidence, a generic claim is not.
 * Calibrated on the live corpus after the review (scripts/quality-selftest.ts).
 */
// code-like tokens: case-sensitive on purpose
const FAQ_CODE_RE = /\d|`|\b[a-z][a-z0-9]*_[a-z0-9_]+\b|\b[a-z]+[A-Z]\w+|\b[A-Z][a-z0-9]+[A-Z]\w+|\b[A-Z]{2,}(?:_[A-Z0-9]+)+\b|\b[a-z][a-z0-9]*\.[a-z][a-z0-9_]*\b|(?:^|\s)--?[a-z][\w-]+|\b[A-Za-z_]+\([^)]*\)/g;
const FAQ_WORD_RE = /\b(?:one|two|three|four|five|six|seven|eight|nine|ten|twice|half|dozen)\b|\b(?:in my (?:test|tests|run|runs|measurements?)|my (?:test|run|measurement)s?|I (?:ran|measured|tested|did not test|didn't test|could not))\b/gi;
const FAQ_DICTIONARY_OPENER_RE = /^(?:an?|the)\s[\w\s'-]{3,45}?\s(?:is|are)\s(?:an?|the)\s/i;

export function countFaqSpecifics(answer: string): number {
  return (answer.match(FAQ_CODE_RE) ?? []).length + (answer.match(FAQ_WORD_RE) ?? []).length;
}

export function findGenericFaqAnswers(faqs: { question: string; answer: string }[]): string[] {
  const out: string[] = [];
  for (const f of faqs) {
    const answer = f.answer.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = answer.split(' ').length;
    const specifics = countFaqSpecifics(answer);
    if (words >= 20 && specifics === 0) out.push(`FAQ answer has no concrete detail (no number, flag, identifier or test statement): "${f.question.slice(0, 70)}"`);
    else if (words >= 25 && specifics < 2 && FAQ_DICTIONARY_OPENER_RE.test(answer)) out.push(`FAQ answer opens like a dictionary entry and carries little detail: "${f.question.slice(0, 70)}"`);
  }
  return out;
}
