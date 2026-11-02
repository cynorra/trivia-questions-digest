/**
 * Automatic publish gate (ported from aiandsoftwarehub's auto-publish.ts).
 *
 * For every Firestore article in status 'draft' it re-runs the deterministic
 * gates and an independent, stricter AI audit (lib/audit.ts: every problem must
 * quote the article; pass/fail is computed here, not taken from the model).
 * Passers become 'published' on their scheduled date (meta.publishOn, or the
 * next free day); failures stay drafts with the reasons in `review`.
 * It fails CLOSED: an audit that cannot run means "hold", never "publish".
 *
 *   npx tsx scripts/pipeline/auto-publish.ts            # dry run: report only
 *   npx tsx scripts/pipeline/auto-publish.ts --apply    # publish the passers
 *   npx tsx scripts/pipeline/auto-publish.ts --apply --min-avg 4.2
 *
 * With --apply it also flips `draft: true` to false in the matching local
 * src/content/guides/<slug>.md and sets its published date, so the repo and
 * Firestore hold the same bytes (the workflow commits the change).
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { initGemini, fetchAllArticles, upsertArticle } from './lib/shared';
import { auditArticle, auditIssues } from './lib/audit';
import { findLowValueSignals, findBridgeFiller, findGenericFaqAnswers } from './lib/value';
import { findStockHeadings, findStockLabels } from './lib/structure';
import { findTitlePasteIssues } from './lib/title-paste';
import { findUnsupportedClaims } from './lib/claims-check';
import { findHypeIssues, findFieldClaimIssues, findBrokenInternalLinks } from './lib/hype-check';
import { FACTS, findFactIssues } from './lib/facts';
import { AUDIT_CONTEXT } from './lib/evidence';

const ROOT = join(import.meta.dirname, '..', '..');
const APPLY = process.argv.includes('--apply');
const avgArg = process.argv.indexOf('--min-avg');
const MIN_AVG = avgArg > -1 ? Number(process.argv[avgArg + 1]) : 4.2;
const plain = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const today = () => new Date().toISOString().slice(0, 10);

/** Next date (YYYY-MM-DD) on or after `from` that no published article uses, skipping Sundays. */
function nextFreeDay(from: string, taken: Set<string>): string {
  const d = new Date(`${from}T12:00:00Z`);
  for (;;) {
    const s = d.toISOString().slice(0, 10);
    if (d.getUTCDay() !== 0 && !taken.has(s)) return s;
    d.setUTCDate(d.getUTCDate() + 1);
  }
}

async function main() {
  const clients = initGemini();
  const rows = await fetchAllArticles();
  const drafts = rows.filter((r) => r.status === 'draft');
  const liveSlugs = new Set(rows.filter((r) => r.status === 'published').map((r) => r.slug));
  const taken = new Set(rows.filter((r) => r.status === 'published' && r.published_at).map((r) => r.published_at!.slice(0, 10)));
  console.log(`${drafts.length} draft(s). Mode: ${APPLY ? 'APPLY' : 'dry run'}. Audit bar: average >= ${MIN_AVG}, no category < 3.\n`);

  let published = 0;
  for (const r of drafts) {
    const html = r.body_md;
    const faqs = [...html.matchAll(/<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g)].map((m) => ({ question: plain(m[1]), answer: plain(m[2]) }));
    const reasons: string[] = [];
    reasons.push(...findLowValueSignals(html, r.tool));
    reasons.push(...findBridgeFiller(html));
    const stock = findStockHeadings(html);
    if (stock.length) reasons.push(`stock headings: ${stock.join(', ')}`);
    reasons.push(...findStockLabels(html));
    reasons.push(...findTitlePasteIssues(html, r.title));
    reasons.push(...findUnsupportedClaims(plain(html)));
    reasons.push(...findHypeIssues(plain(html), 'body'));
    reasons.push(...findFieldClaimIssues({ title: r.title, metaDescription: r.description, faqs }));
    reasons.push(...findBrokenInternalLinks(html, liveSlugs));
    reasons.push(...findFactIssues(plain(html)));
    reasons.push(...findGenericFaqAnswers(faqs));

    let auditLine = 'not run (earlier gate failed)';
    let audit = null;
    if (reasons.length === 0) {
      audit = await auditArticle(clients, r.title, r.tool, html, MIN_AVG, FACTS, AUDIT_CONTEXT, true);
      if (!audit) reasons.push('AI audit could not run — holding (fails closed)');
      else {
        auditLine = `${audit.pass ? 'PASS' : 'FAIL'} avg ${audit.average.toFixed(1)} (${Object.entries(audit.scores).map(([k, v]) => `${k} ${v}`).join(', ')})`;
        if (!audit.pass) reasons.push(...auditIssues(audit));
      }
    }
    const verdict = reasons.length === 0 ? 'PUBLISH' : 'HOLD';
    console.log(`${verdict.padEnd(7)} ${r.slug}\n        audit ${auditLine}`);
    for (const x of reasons) console.log(`        - ${x.slice(0, 260)}`);
    if (!APPLY) continue;

    if (reasons.length) {
      await upsertArticle({ slug: r.slug, review: { at: new Date().toISOString(), verdict: 'hold', reasons } } as any);
      continue;
    }
    const day = nextFreeDay(r.meta?.publishOn && r.meta.publishOn >= today() ? r.meta.publishOn : today(), taken);
    taken.add(day);
    await upsertArticle({ slug: r.slug, status: 'published', published_at: `${day}T12:00:00Z`, review: { at: new Date().toISOString(), verdict: 'publish', audit: audit && { average: audit.average, scores: audit.scores } } } as any);
    const file = join(ROOT, 'src', 'content', 'guides', `${r.slug}.md`);
    if (existsSync(file)) {
      const t = readFileSync(file, 'utf8').replace(/^draft: true$/m, 'draft: false').replace(/^published: .*$/m, `published: ${day}`);
      writeFileSync(file, t);
    }
    published++;
    console.log(`        -> published for ${day}`);
  }
  console.log(`\nDone. ${APPLY ? `Published ${published}.` : 'Dry run — nothing written.'}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
