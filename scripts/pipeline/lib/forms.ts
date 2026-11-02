/**
 * Editorial forms — the answer to "scaled content / template farm".
 *
 * Varying headings is not enough: two articles can have different words and still be the same shape
 * (quick answer, definition, 6 numbered sections, FAQ). So every article is assigned ONE editorial form
 * that changes how it is organised, how it opens and what its spine is — a diagnostic tree, a decision
 * memo, an annotated source excerpt, a build log, a misconception-led piece, a worked-numbers piece...
 *
 * The form is chosen from the real corpus: the least-used form that suits the cluster, never one of the
 * last few used, ties broken by a hash of the slug (not a rotating pool — usage counts decide). The
 * chosen id is stored on the article (`editorialForm`) so the next run sees it.
 *
 * The opening of every article is also compared with the corpus (first three words of the first
 * paragraph after the quick-answer box) so no two articles start the same way.
 */
export interface EditorialForm {
  id: string;
  clusters: string[];
  directive: string;
}

const ALL = ['trivia-night', 'knowledge', 'holidays', 'us', 'world', 'flags-capitals'];

export const EDITORIAL_FORMS: EditorialForm[] = [
  { id: 'run-of-show', clusters: ['trivia-night', 'holidays'], directive: 'Write the article as the run of show for one event: what happens minute by minute, which questions from the DATA block are read in which round, and what the host says after each answer. Open with the room and the people in it.' },
  { id: 'misconception-led', clusters: ['trivia-night', 'knowledge', 'holidays'], directive: 'Organise around three or four things people commonly get wrong about this subject. Each H2 states the belief; the section says what is actually true, using the DATA block.' },
  { id: 'question-ladder', clusters: ['trivia-night', 'knowledge', 'holidays'], directive: 'Make the H2s the questions a reader asks next, in the order they ask them, worded as real search queries (see the query list). Each section answers its question in the first sentence, then gives the evidence from the DATA block.' },
  { id: 'story-behind-answers', clusters: ['knowledge', 'holidays'], directive: 'Pick four to six questions from the DATA block and tell the story behind each answer in more depth than the one-line explanation, in a sequence that builds (by date, or from easy to surprising). Each H2 names the story, not the question.' },
  { id: 'difficulty-ladder', clusters: ['trivia-night', 'knowledge'], directive: 'Organise by difficulty: what makes a question in this subject easy, medium or hard, with examples from the DATA block at each level and how to pitch a round for a given crowd.' },
  { id: 'host-notes', clusters: ['trivia-night', 'holidays'], directive: 'Write as a host\'s notebook: for a handful of questions from the DATA block, what people usually answer, why, how to rule on close answers, and a follow-up line. Wrap with how to assemble those into a round.' },
  { id: 'format-twist', clusters: ['trivia-night', 'holidays'], directive: 'Build the article around one round format (true or false, closest number, picture, put in order, connections) applied to this subject, showing how questions from the DATA block are rewritten for that format.' },
  { id: 'geo-map-walk', clusters: ['us', 'world'], directive: 'Walk across the map in one direction (north to south, coast to interior, west to east), naming each place from the DATA block in the order you meet it, with one detail that helps place it. Open with where the walk starts and why.' },
  { id: 'geo-anchor-and-neighbors', clusters: ['us', 'world'], directive: 'Pick two or three anchor places the reader already knows, then place every other place from the DATA block relative to an anchor ("directly north of", "between X and Y"). Each H2 is one anchor and its neighbors.' },
  { id: 'geo-mix-up-pairs', clusters: ['us', 'world', 'flags-capitals'], directive: 'Organise the article around pairs or trios from the DATA block that people confuse. Each H2 names the pair; the section says exactly how to tell them apart and gives one memory hook.' },
  { id: 'geo-memory-hooks', clusters: ['us', 'world', 'flags-capitals'], directive: 'Give every capital or place in the DATA block a short memory hook (a sound-alike, a person, a picture, a pairing), grouped by type of hook rather than by region. Be honest where no good hook exists.' },
  { id: 'geo-misconception-led', clusters: ['us', 'world', 'flags-capitals'], directive: 'Organise around three or four things people commonly get wrong about this part of the map. Each H2 states the belief; the section says what is actually true, using the DATA block.' },
  { id: 'geo-question-ladder', clusters: ['us', 'world', 'flags-capitals'], directive: 'Make the H2s the questions a learner asks next, in the order they ask them, worded as real search queries (see the query list). Each section answers its question in the first sentence, then gives the evidence from the DATA block.' },
  { id: 'geo-practice-plan', clusters: ['us', 'world'], directive: 'Write the article as a short practice plan: what to learn on each of several short sessions, which places from the DATA block belong to each session and how to test yourself with the quiz page after each one.' },
];


function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** Least-used suitable form, excluding the last `recentWindow` used; ties by slug hash. */
export function pickEditorialForm(cluster: string, slug: string, usedNewestFirst: (string | undefined)[], recentWindow = 3): EditorialForm {
  const suitable = EDITORIAL_FORMS.filter((f) => f.clusters.includes(cluster));
  const pool = suitable.length ? suitable : EDITORIAL_FORMS.filter((f) => f.clusters.some((c) => ALL.includes(c)));
  const recent = new Set(usedNewestFirst.filter(Boolean).slice(0, recentWindow) as string[]);
  const counts = new Map<string, number>();
  for (const id of usedNewestFirst) if (id) counts.set(id, (counts.get(id) ?? 0) + 1);
  let candidates = pool.filter((f) => !recent.has(f.id));
  if (candidates.length === 0) candidates = pool;
  const min = Math.min(...candidates.map((f) => counts.get(f.id) ?? 0));
  const least = candidates.filter((f) => (counts.get(f.id) ?? 0) === min);
  return least[hash(`${slug}:form`) % least.length];
}

export function formPromptBlock(form: EditorialForm): string {
  return `\nEDITORIAL FORM FOR THIS ARTICLE (assigned so that this article is not shaped like the others on the site — follow it):\n${form.directive}\nThe form governs the organisation, the opening and the spine of the article. It does not relax any accuracy rule below.\n`;
}

const OPENER_BANNED_RE = /^(in this (article|guide|post|tutorial)|this (article|guide|post) (will|explains|covers)|whether you|if you(?:'|’)?re (a|an|looking|new)|are you (looking|struggling)|welcome to|today(?:,|\s)|as (ai|llms?|developers))/i;

/** First three words of the first paragraph after the quick-answer box. */
export function openingKey(html: string): string {
  const afterBox = html.replace(/^\s*<div[\s\S]*?<\/div>\s*/i, '');
  const m = /<p[^>]*>([\s\S]*?)<\/p>/i.exec(afterBox);
  if (!m) return '';
  return m[1].replace(/<[^>]+>/g, ' ').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean).slice(0, 3).join(' ');
}

export function findOpeningIssues(html: string, corpusOpenings: Set<string>): string[] {
  const issues: string[] = [];
  const afterBox = html.replace(/^\s*<div[\s\S]*?<\/div>\s*/i, '');
  const first = (/<p[^>]*>([\s\S]*?)<\/p>/i.exec(afterBox)?.[1] ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (OPENER_BANNED_RE.test(first)) issues.push(`the opening paragraph starts with a stock opener ("${first.slice(0, 40)}…") — open on the specific symptom, fact, number or scenario this article is about`);
  const key = openingKey(html);
  if (key && corpusOpenings.has(key)) issues.push(`the opening paragraph starts with "${key}…", exactly like another article on this site — start differently`);
  return issues;
}
