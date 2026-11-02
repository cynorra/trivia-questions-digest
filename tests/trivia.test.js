// Content checks for the question bank. A failure stops the build in CI.
import { test } from "node:test";
import assert from "node:assert/strict";
import { CATS, ALL_QUESTIONS, DAILY_POOL, shuffled } from "../src/lib/trivia/cats.js";
import { FACTS } from "../src/lib/trivia/facts.js";
import { dailyIndices, factIndex } from "../src/components/trivia/daily-core.ts";

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

test("every question has four distinct options and an explanation", () => {
  for (const q of ALL_QUESTIONS) {
    assert.equal(q.choices.length, 4, q.id);
    assert.equal(new Set(q.choices.map(norm)).size, 4, `${q.id}: duplicate options`);
    assert.ok(q.q.trim().endsWith("?") || q.q.startsWith("Guess the movie: ") || /"$/.test(q.q.trim()), `${q.id}: question should end with ?`);
    assert.ok(q.why.split(/\s+/).length >= 8, `${q.id}: explanation too short`);
    assert.ok(!q.why.toLowerCase().startsWith(norm(q.choices[0]) + " is the answer"), q.id);
  }
});

test("no question is repeated anywhere on the site", () => {
  const seen = new Map();
  for (const q of ALL_QUESTIONS) {
    const k = norm(q.q);
    assert.ok(!seen.has(k), `${q.id} repeats ${seen.get(k)}`);
    seen.set(k, q.id);
  }
});

test("category pages have unique FAQs, headings and copy", () => {
  const faqs = new Set(), heads = new Set(), titles = new Set(), descs = new Set();
  for (const c of CATS) {
    assert.ok(c.description.length >= 70 && c.description.length <= 165, `${c.key}: description length ${c.description.length}`);
    assert.ok(c.title.length <= 70, `${c.key}: title too long`);
    assert.ok(!titles.has(c.title) && !descs.has(c.description), c.key);
    titles.add(c.title); descs.add(c.description);
    assert.equal(c.faq.length, 3, c.key);
    for (const f of c.faq) { const k = norm(f.q); assert.ok(!faqs.has(k), `FAQ repeats: ${f.q}`); faqs.add(k); }
    for (const [, h] of c.body.matchAll(/<h2>(.*?)<\/h2>/g)) { const k = norm(h); assert.ok(!heads.has(k), `heading repeats: ${h}`); heads.add(k); }
    const words = c.body.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    assert.ok(words >= 190, `${c.key}: body has only ${words} words`);
    assert.ok(c.sources.length >= 2, `${c.key}: needs at least two sources`);
  }
});

test("the shuffle moves answers around and keeps the right one", () => {
  const spots = [0, 0, 0, 0];
  for (const q of ALL_QUESTIONS) { const s = shuffled(q); assert.equal(s.choices[s.answer], q.choices[0]); spots[s.answer]++; }
  for (const n of spots) assert.ok(n > ALL_QUESTIONS.length / 8, `answer position too uneven: ${spots}`);
});

test("the daily quiz uses every pooled question once before repeating", () => {
  const len = DAILY_POOL.length;
  const days = Math.floor(len / 10);
  const used = [];
  for (let n = 1; n <= days; n++) used.push(...dailyIndices(n, len));
  assert.equal(new Set(used).size, used.length, "a question repeated within the first pass");
  for (let n = 1; n <= 400; n++) assert.equal(new Set(dailyIndices(n, len)).size, 10, `day ${n} repeats a question`);
  assert.ok(!DAILY_POOL.some((q) => ["christmas", "thanksgiving", "halloween", "bible"].includes(q.cat)), "holiday and Bible questions stay out of the daily pool");
});

test("fun facts are unique, sourced and rotate fully", () => {
  assert.equal(new Set(FACTS.map((f) => norm(f[1]))).size, FACTS.length);
  for (const f of FACTS) { assert.equal(f.length, 4); assert.ok(f[3].length > 2, f[1]); }
  const shown = new Set(); for (let n = 1; n <= FACTS.length; n++) shown.add(factIndex(n, FACTS.length));
  assert.equal(shown.size, FACTS.length);
});

test("trivia categories and map quizzes never share a FAQ question or a slug", async () => {
  const { PAGES } = await import("../src/lib/geo/pages.js");
  const seen = new Map();
  for (const [where, items] of [...CATS.map((c) => [c.slug, c.faq]), ...PAGES.map((p) => [p.slug, p.faq])]) {
    for (const f of items) { const k = norm(f.q); assert.ok(!seen.has(k), `FAQ "${f.q}" on ${where} repeats ${seen.get(k)}`); seen.set(k, where); }
  }
  const slugs = [...CATS.map((c) => c.slug), ...PAGES.map((p) => p.slug)];
  assert.equal(new Set(slugs).size, slugs.length);
});

test("country fact pages: unique facts and FAQs across the site, enough own text", async () => {
  const { COUNTRY_PAGES } = await import("../src/lib/trivia/country-facts.js");
  const { PAGES } = await import("../src/lib/geo/pages.js");
  const facts = new Set(FACTS.map((f) => norm(f[1])));
  const faqs = new Set([...CATS.flatMap((c) => c.faq), ...PAGES.flatMap((p) => p.faq)].map((f) => norm(f.q)));
  for (const c of COUNTRY_PAGES) {
    assert.ok(c.facts.length >= 15, c.key);
    for (const [fact, why, src] of c.facts) {
      assert.ok(!facts.has(norm(fact)), `fact repeats: ${fact}`); facts.add(norm(fact));
      assert.ok(why.split(/\s+/).length >= 8 && src.length > 2, fact);
    }
    for (const f of c.faq) { assert.ok(!faqs.has(norm(f.q)), `FAQ repeats: ${f.q}`); faqs.add(norm(f.q)); }
    assert.ok(c.description.length >= 70 && c.description.length <= 165, `${c.key} description ${c.description.length}`);
    assert.ok(c.body.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length >= 150, `${c.key} body too short`);
  }
});

test("spirit animal quiz: balanced, every animal reachable, facts sourced", async () => {
  const { QUESTIONS, ANIMALS, ANIMAL_ORDER, result } = await import("../src/lib/trivia/spirit-animal.js");
  const count = Object.fromEntries(ANIMAL_ORDER.map((a) => [a, 0]));
  for (const [, opts] of QUESTIONS) { assert.equal(opts.length, 4); for (const [, an] of opts) { assert.equal(an.length, 2); for (const a of an) count[a]++; } }
  assert.equal(new Set(Object.values(count)).size, 1, `animals appear unevenly: ${JSON.stringify(count)}`);
  const seen = new Set();
  for (let n = 0; n < 20000; n++) { let x = n * 52; seen.add(result(QUESTIONS.map(() => { const c = x % 4; x = Math.floor(x / 4) + n; return c; })).top); }
  assert.equal(seen.size, ANIMAL_ORDER.length, "every animal can be a result");
  for (const k of ANIMAL_ORDER) { assert.ok(ANIMALS[k].facts.length >= 2); for (const f of ANIMALS[k].facts) assert.ok(f[2].length > 2); }
});
