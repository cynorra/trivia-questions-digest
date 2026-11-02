/**
 * The facts an article may state about the site, and the grounding gates:
 * "the capital of X is Y" must match the site's country/state data, and
 * "X was the Nth president" must match the official order.
 */
import { COUNTRIES } from '../../../src/lib/geo/countries.js';
import { STATES } from '../../../src/lib/geo/us-states.js';

export const FACTS = `FACTS YOU MAY STATE (everything else must come from the DATA block):
- The site has a free daily quiz of ten questions, the same for every player, changing at midnight UTC; it draws on the everyday categories and does not repeat a question until the whole pool has been used.
- Every question has four options and a one-line explanation, and every answer is checked against a named source listed on its page.
- Category pages: general knowledge, history, science, food, sports, movies and TV, music, Christmas, Thanksgiving, Halloween, Bible, trivia for adults, trivia for seniors. There is also a fun facts page with a fact of the day and a random question generator.
The map quizzes cover 195 countries: the 193 UN member states plus the two UN observer states, Vatican City and Palestine. Countries per continent on this site: Africa 54, Asia 47, Europe 45 (Russia grouped with Europe), North America 23, South America 12, Oceania 14. US Census regions: Northeast 9 states, Midwest 12, South 16 (plus Washington, DC), West 13. Maps: US Census Bureau and Natural Earth boundaries.
Do not take sides on disputed borders or capitals.
Do NOT state statistics, dates, records or rankings that are not in the DATA block. Do not name current champions or box-office leaders. Do not give medical, legal or financial advice.`;

const norm = (s: string) => s.toLowerCase().replace(/[^a-z\u00c0-\u017f ]/g, '').replace(/\s+/g, ' ').trim();
const CAPITAL_OF = new Map<string, string>();
for (const c of COUNTRIES) { CAPITAL_OF.set(norm(c.name), c.capital); if (c.aka) CAPITAL_OF.set(norm(c.aka), c.capital); }
for (const s of STATES) CAPITAL_OF.set(norm(s.name), s.capital);
const MULTI = new Set(['bolivia', 'south africa', 'sri lanka', 'eswatini', 'israel', 'palestine', 'nauru', 'netherlands', 'malaysia', 'benin', 'cote divoire', 'côte divoire', 'ivory coast', 'tanzania', 'switzerland']);

/** Sentences that name a capital that disagrees with the site's data. */
function findCapitalIssues(plain: string): string[] {
  const out: string[] = [];
  const check = (place: string, capital: string, s: string) => {
    const key = norm(place.replace(/^the /i, ''));
    const want = CAPITAL_OF.get(key);
    if (!want || MULTI.has(key)) return;
    if (norm(capital) !== norm(want) && !norm(capital).startsWith(norm(want))) out.push(`capital claim disagrees with the site's data (${place}: ${want}): "${s.slice(0, 140)}"`);
  };
  for (const s of plain.split(/(?<=[.!?])\s+/)) {
    for (const m of s.matchAll(/(?:capital of|capital city of) ((?:the )?[A-Z][\w'\u00c0-\u017f.-]*(?: [A-Z][\w'\u00c0-\u017f.-]*){0,3}) is ([A-Z][\w'\u00c0-\u017f.-]*(?: [A-Z][\w'\u00c0-\u017f.-]*){0,2})/g)) check(m[1], m[2], s);
    for (const m of s.matchAll(/([A-Z][\w'\u00c0-\u017f.-]*(?: [A-Z][\w'\u00c0-\u017f.-]*){0,2}) is the capital of ((?:the )?[A-Z][\w'\u00c0-\u017f.-]*(?: [A-Z][\w'\u00c0-\u017f.-]*){0,3})/g)) check(m[2], m[1], s);
  }
  return [...new Set(out)];
}

const PRESIDENTS = ['Washington', 'John Adams', 'Jefferson', 'Madison', 'Monroe', 'John Quincy Adams', 'Jackson', 'Van Buren', 'William Henry Harrison', 'Tyler', 'Polk', 'Taylor', 'Fillmore', 'Pierce', 'Buchanan', 'Lincoln', 'Andrew Johnson', 'Grant', 'Hayes', 'Garfield', 'Arthur', 'Cleveland', 'Benjamin Harrison', 'Cleveland', 'McKinley', 'Theodore Roosevelt', 'Taft', 'Wilson', 'Harding', 'Coolidge', 'Hoover', 'Franklin D. Roosevelt', 'Truman', 'Eisenhower', 'Kennedy', 'Lyndon B. Johnson', 'Nixon', 'Ford', 'Carter', 'Reagan', 'George H. W. Bush', 'Clinton', 'George W. Bush', 'Obama', 'Trump', 'Biden', 'Trump'];
const ORD = (n: number) => n + (n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th');
const last = (s: string) => s.split(' ').pop()!.toLowerCase();

/** Sentences that give a president the wrong number. */
function findPresidentIssues(plain: string): string[] {
  const out: string[] = [];
  for (const s of plain.split(/(?<=[.!?])\s+/)) {
    for (const m of s.matchAll(/([A-Z][\w.]*(?: [A-Z][\w.]*){0,3}),? (?:was |is |became )?the (\d{1,2})(?:st|nd|rd|th) (?:US |U\.S\. )?president/g)) {
      const n = Number(m[2]);
      if (n < 1 || n > PRESIDENTS.length) { out.push(`no ${ORD(n)} president: "${s.slice(0, 140)}"`); continue; }
      if (last(m[1]) !== last(PRESIDENTS[n - 1])) out.push(`the ${ORD(n)} president was ${PRESIDENTS[n - 1]}: "${s.slice(0, 140)}"`);
    }
  }
  return [...new Set(out)];
}

export function findFactIssues(plain: string): string[] {
  return [...findCapitalIssues(plain), ...findPresidentIssues(plain)];
}
