/**
 * Validators for the two failure modes that got the site rejected as
 * "low value content" besides plain thinness:
 *
 *  1. Claims nothing in the pipeline can verify — revenue/ROI promises,
 *     "cut costs by up to 60%", "undisputed champion". A specific number in a
 *     sentence needs either a real source or hedged wording.
 *  2. Titles that promise something the body never delivers — e.g. a title
 *     saying "Ranked by Revenue Potential" over a single how-to tutorial.
 *
 * Both are hard failures in validateGenerated() (the article is regenerated
 * with the message as feedback), not warnings.
 */
import { isMonetaryPromiseTitle } from './policy';

// A sentence that names where a number comes from is allowed to state it.
const ATTRIBUTION_RE = /(according to|as (documented|stated|described|listed) (by|in|on)|per (the )?(official|vendor|provider)|(the )?(official )?(docs?|documentation|pricing page|paper|spec(ification)?) (states?|says?|lists?|describes?|reports?))/i;

const UNSUPPORTED_CLAIMS: { re: RegExp; what: string }[] = [
  {
    re: /\b(high[- ]revenue|recurring cash flow|passive income|path to profitab\w*|fastest path to (profit|revenue)|highest (immediate )?roi|guaranteed (roi|revenue|profit|income)|make money|earn(?:s|ing)? (?:money|\$\d)|monthly recurring revenue)\b/i,
    what: 'revenue/profit/ROI claim',
  },
  {
    re: /\b(cut|cuts|cutting|reduce|reduces|reduced|save|saves|saving|lower|lowers|slash|slashes)\b[^.!?]{0,70}\b(by|of) (up to |as much as |around |about |roughly |over |nearly )?\d{1,3}\s?%/i,
    what: 'unsourced percentage savings/reduction claim',
  },
  {
    re: /\b(undisputed|unrivaled|unrivalled|unbeatable|without (a )?doubt the (best|fastest|cheapest))\b/i,
    what: 'unsupportable superlative',
  },
  {
    re: /\b(ensures?|guarantees?)\b[^.!?]{0,80}\b(revenue|profit|income|cash flow|sales|customers)\b/i,
    what: 'guaranteed business-outcome claim',
  },
  {
    // "sub-50ms lookups", "under 100 milliseconds", "10x faster" — performance
    // figures this pipeline never measured. Reading them off a vendor page is
    // fine, but then the sentence must say so (see ATTRIBUTION_RE).
    re: /\b(sub-?\d+\s?(ms|milliseconds?)\b|(under|within|less than|below|in)\s\d+\s?(ms|milliseconds?)\b|\d+(\.\d+)?x\s(faster|cheaper|more efficient|speedup))/i,
    what: 'unmeasured performance figure',
  },
];

function sentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+/).filter((s) => s.length > 0);
}

/** Returns one message per distinct problem found in the plain-text body. */
export function findUnsupportedClaims(plainText: string): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const s of sentences(plainText)) {
    if (ATTRIBUTION_RE.test(s)) continue;
    for (const { re, what } of UNSUPPORTED_CLAIMS) {
      const m = s.match(re);
      if (m && !seen.has(what)) {
        seen.add(what);
        out.push(`contains an unverifiable ${what}: "...${s.slice(Math.max(0, (m.index ?? 0) - 30), (m.index ?? 0) + 90).trim()}..." — remove it or state it as hedged, attributed fact (e.g. "according to the provider's pricing page")`);
      }
    }
  }
  return out;
}

function countStructure(html: string): number {
  const h3 = (html.match(/<h3[\s>]/gi) ?? []).length;
  const tableRows = Math.max(0, (html.match(/<tr[\s>]/gi) ?? []).length - (html.match(/<table[\s>]/gi) ?? []).length);
  const olItems = (() => {
    let max = 0;
    for (const m of html.matchAll(/<ol[^>]*>([\s\S]*?)<\/ol>/gi)) max = Math.max(max, (m[1].match(/<li[\s>]/gi) ?? []).length);
    return max;
  })();
  return Math.max(h3, tableRows, olItems);
}

/** A title that promises N items or a ranking must be backed by a structure
 *  in the body that actually contains them. */
export function findTitlePromiseIssues(title: string, html: string): string[] {
  const issues: string[] = [];
  if (isMonetaryPromiseTitle(title)) {
    issues.push('the title promises revenue/income/ROI, which this article cannot substantiate — pick a title about what the article actually teaches');
  }
  const structure = countStructure(html);
  if (/\b(ranked|ranking|rankings)\b/i.test(title) && structure < 3) {
    issues.push('the title promises a ranking but the body has no ranked table/list with at least 3 entries');
  }
  const n = title.match(/\b(?:top|best)\s+(\d{1,2})\b/i) || title.match(/\b(\d{1,2})\s+(?:best|top|ways|tips|ideas|tools|steps|mistakes|fixes|projects|examples)\b/i);
  if (n) {
    const promised = parseInt(n[1], 10);
    if (promised >= 3 && structure < Math.min(promised, 10)) {
      issues.push(`the title promises ${promised} items but the body only has ${structure} distinct list/table/section entries`);
    }
  }
  return issues;
}
