/**
 * Topic gate. What an AI Overview cannot replace on this site is the game and
 * the site's own checked data. So every topic must (1) target a real planner
 * keyword, (2) be tied to at least one data set the article must use, and
 * (3) avoid definitional / listicle / promise shapes.
 */
import { whyTopicRefused } from './policy';

export interface SiteTopic {
  title: string;
  /** primary keyword from Google Keyword Planner */
  keyword: string;
  /** monthly searches bucket reported by the planner */
  volume: number;
  /** cluster / article tool field */
  tool: string;
  /** data sets the article must use (keys in scripts/pipeline/lib/evidence.ts) */
  data: string[];
  /** what the article delivers that an overview can't: worked problems, drills, a pacing plan from the facts */
  asset: string;
}

const DEFINITION_RE = /^(what\s+(?:is|are|does)|who\s+is)\b|\bexplained\b|\bintroduction to\b/i;
const LISTICLE_RE = /\b(best|top\s*\d+|\d+\s+(?:best|tips|tricks|hacks)|ranked|vs\.?|versus|review)\b/i;

export function findTopicIssues(t: SiteTopic): string[] {
  const issues: string[] = [];
  const refused = whyTopicRefused(t.title);
  if (refused) issues.push(`refused: ${refused}`);
  if (DEFINITION_RE.test(t.title)) issues.push('definitional title: an AI Overview answers it; reframe around the data or the game');
  if (LISTICLE_RE.test(t.title)) issues.push('listicle / ranking / review title');
  if (!t.keyword || t.volume < 500) issues.push('needs a planner keyword with at least 500 monthly searches');
  if (t.data.length === 0) issues.push('an article must draw on at least one of the site\'s data sets');
  if (t.asset.split(/\s+/).length < 6) issues.push('describe the asset the page delivers (worked problems, a drill, a pacing table)');
  return issues;
}
