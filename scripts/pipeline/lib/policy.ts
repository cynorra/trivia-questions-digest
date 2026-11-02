/**
 * Content policy for the generator: what an article may promise.
 * Guarantees and "official" framing are refused (AdSense misleading-claims risk).
 */
const PROMISE_TITLE_RE =
  /\b(guarantee[sd]?|guaranteed|official (?:map|list|answers?)|answer key to|cheat(?:s|ing)?)\b/i;

export function isMonetaryPromiseTitle(title: string): boolean {
  // Name kept for compatibility with claims-check.ts; here it means "promise the page cannot keep".
  return PROMISE_TITLE_RE.test(title);
}

export const REFUSED_TITLE_RE = PROMISE_TITLE_RE;

/** Why a proposed topic is refused, or null. */
export function whyTopicRefused(title: string): string | null {
  if (PROMISE_TITLE_RE.test(title)) return 'promises something the page cannot deliver, or claims to be official';
  if (/\b(20[0-2]\d)\b/.test(title) && !/\b2026|2027\b/.test(title)) return 'names an old year';
  return null;
}
