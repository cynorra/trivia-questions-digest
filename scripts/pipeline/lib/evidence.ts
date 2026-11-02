/**
 * The site's own data an article must use. Two kinds of data set:
 *  - trivia question sets (src/lib/trivia/cats.js): the article must use at
 *    least four answers and link the question page;
 *  - geography lists (countries, states, capitals): the article must name at
 *    least eight places and link the quiz page.
 * Each set becomes a DATA block in the prompt and a usage check.
 */
import { CATS, questionsOf } from '../../../src/lib/trivia/cats.js';
import { COUNTRIES, CONTINENTS } from '../../../src/lib/geo/countries.js';
import { STATES, REGIONS } from '../../../src/lib/geo/us-states.js';

interface QRow { q: string; answer: string; why: string }
interface PRow { name: string; capital?: string; group?: string; note?: string }
type DataSet = { kind: 'questions'; label: string; rows: QRow[]; page: string } | { kind: 'places'; label: string; rows: PRow[]; page: string };

const byCont = (codes: string[]): PRow[] => COUNTRIES.filter((c: any) => codes.includes(c.continent)).map((c: any) => ({ name: c.name, capital: c.askCapital ? c.capital : undefined, group: CONTINENTS[c.continent].name, note: c.capitalNote }));
const byRegion = (r: string): PRow[] => STATES.filter((s: any) => s.region === r).map((s: any) => ({ name: s.name, capital: s.capital, group: REGIONS[r].name }));
const places = (label: string, rows: PRow[], page: string): DataSet => ({ kind: 'places', label, rows, page });

export const DATA: Record<string, DataSet> = {
  ...Object.fromEntries(CATS.map((c: any) => [c.key, { kind: 'questions', label: `${c.name} trivia`, page: `/${c.slug}/`, rows: questionsOf(c).map((q: any) => ({ q: q.q, answer: q.choices[0], why: q.why })) } as DataSet])),
  world: places('All 195 countries', byCont(Object.keys(CONTINENTS)), '/world-map-quiz/'),
  europe: places('Europe', byCont(['EU']), '/europe-map-quiz/'),
  africa: places('Africa', byCont(['AF']), '/africa-map-quiz/'),
  asia: places('Asia', byCont(['AS']), '/asia-map-quiz/'),
  americas: places('North and South America', byCont(['NA', 'SA']), '/americas-map-quiz/'),
  oceania: places('Oceania', byCont(['OC']), '/oceania-map-quiz/'),
  'us-northeast': places('Northeast states', byRegion('northeast'), '/northeast-states-quiz/'),
  'us-midwest': places('Midwest states', byRegion('midwest'), '/midwest-states-quiz/'),
  'us-south': places('Southern states', byRegion('south'), '/southern-states-quiz/'),
  'us-west': places('Western states', byRegion('west'), '/western-states-quiz/'),
  'us-all': places('All 50 states', STATES.map((s: any) => ({ name: s.name, capital: s.capital, group: REGIONS[s.region].name })), '/us-states-map-quiz/'),
};

export function evidenceBlock(keys: string[]): string {
  const blocks = keys.map((k) => {
    const d = DATA[k];
    if (d.kind === 'questions') return `\nDATA: ${d.label} (the site's checked questions; answers and facts must match exactly; the question page is ${d.page}):\n${d.rows.map((r) => `- Q: ${r.q} A: ${r.answer}. ${r.why}`).join('\n')}`;
    return `\nDATA: ${d.label} (from the site's checked data; names and capitals must match exactly; the quiz for it is ${d.page}):\n${d.rows.map((r) => `- ${r.name}${r.capital ? ` — capital ${r.capital}` : ' — not asked in capital quizzes'}${r.note ? ` (${r.note})` : ''}`).join('\n')}`;
  }).join('\n');
  const anyQ = keys.some((k) => DATA[k].kind === 'questions');
  const anyP = keys.some((k) => DATA[k].kind === 'places');
  return blocks + '\n' + [
    anyQ && 'Use the question data concretely: build on at least four of these questions or their explanations (quote the answer exactly). Do not reproduce the whole list.',
    anyP && 'Use the place data concretely: name at least eight of these places in the article.',
    'Link the page(s) named above.',
  ].filter(Boolean).join('\n') + '\n';
}

export function findEvidenceUsageIssues(html: string, keys: string[]): string[] {
  const out: string[] = [];
  const text = html.replace(/<[^>]+>/g, ' ');
  const lower = text.toLowerCase();
  const qKeys = keys.filter((k) => DATA[k].kind === 'questions');
  const pKeys = keys.filter((k) => DATA[k].kind === 'places');
  if (qKeys.length) {
    const rows = qKeys.flatMap((k) => DATA[k].rows as QRow[]);
    const answers = new Set(rows.map((r) => r.answer.toLowerCase()).filter((a) => a.length > 3 && !/^\d+$/.test(a)));
    const used = [...answers].filter((a) => lower.includes(a)).length;
    if (used < 4) out.push(`uses only ${used} answers from the DATA block (need 4): build the article on the supplied questions`);
    const copied = rows.filter((r) => html.includes(r.why)).length;
    if (copied > 3) out.push(`copies ${copied} explanations word for word from the question pages: write new text`);
  }
  if (pKeys.length) {
    const names = new Set(pKeys.flatMap((k) => (DATA[k].rows as PRow[]).map((r) => r.name)));
    const used = [...names].filter((n) => text.includes(n)).length;
    const need = Math.min(8, names.size);
    if (used < need) out.push(`uses only ${used} places from the DATA block (need ${need}): build the article on the supplied data`);
  }
  const pages = keys.map((k) => DATA[k].page).filter((p) => !html.includes(p));
  if (pages.length) out.push(`does not link the page(s): ${pages.join(', ')}`);
  return out;
}

export const ARTICLE_KIND = 'trivia or geography guide';
export const AUDIT_CONTEXT = "Answers, places and capitals in the article must match the site's own checked data (question sets and country/state lists). Judge whether the article is accurate, specific and genuinely useful to someone playing or hosting trivia or learning the map.";
