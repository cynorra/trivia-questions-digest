import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { STATES, THIRTEEN_COLONIES } from "../src/lib/geo/us-states.js";
import { COUNTRIES, CAPITAL_NOTES } from "../src/lib/geo/countries.js";
import { usMap, worldMap } from "../src/lib/geo/maps.js";
import { PAGES } from "../src/lib/geo/pages.js";
import { TRIVIA } from "../src/lib/geo/trivia.js";

const require = createRequire(import.meta.url);

test("50 states, unique names and capitals, Census region counts", () => {
  assert.equal(STATES.length, 50);
  assert.equal(new Set(STATES.map((s) => s.name)).size, 50);
  assert.equal(new Set(STATES.map((s) => s.capital)).size, 50);
  const count = (r) => STATES.filter((s) => s.region === r).length;
  assert.deepEqual([count("northeast"), count("midwest"), count("south"), count("west")], [9, 12, 16, 13]);
  assert.equal(THIRTEEN_COLONIES.length, 13);
  for (const c of THIRTEEN_COLONIES) assert.ok(STATES.some((s) => s.name === c), c);
});

test("every state has exactly one shape on the Census map", () => {
  const m = usMap();
  assert.equal(m.shapes.length, 50);
  for (const s of STATES) assert.ok(m.shapes.find((x) => x.name === s.name && x.d.length > 100), s.name);
});

test("195 countries; every capital agrees with a second dataset unless deliberately overridden", () => {
  assert.equal(COUNTRIES.length, 195);
  const wc = require("world-countries");
  const overridden = new Set(["LK", "SZ"]);
  for (const c of COUNTRIES) {
    const other = wc.find((x) => x.cca2 === c.a2);
    assert.ok(other, `${c.a2} missing from world-countries`);
    if (overridden.has(c.a2)) { assert.ok(CAPITAL_NOTES[c.a2], `override without a note: ${c.a2}`); continue; }
    assert.ok(other.capital.includes(c.capital), `${c.name}: ${c.capital} vs ${other.capital.join("|")}`);
  }
});

test("every country has a flag file, and every asked country is clickable on its maps", () => {
  for (const c of COUNTRIES) assert.ok(existsSync(new URL(`../node_modules/flag-icons/flags/4x3/${c.id}.svg`, import.meta.url)), `flag ${c.id}`);
  const views = { world: null, europe: ["EU"], africa: ["AF"], asia: ["AS"], americas: ["NA", "SA"], oceania: ["OC"] };
  for (const [view, conts] of Object.entries(views)) {
    const ask = COUNTRIES.filter((c) => !conts || conts.includes(c.continent)).map((c) => c.a2);
    const m = worldMap(view, ask);
    const asked = new Set(m.shapes.filter((s) => s.ask).map((s) => s.id));
    for (const a2 of ask) assert.ok(asked.has(a2.toLowerCase()), `${view}: ${a2} not on the map`);
  }
});

test("pages: unique titles, descriptions and FAQ questions; text on every page", () => {
  const seen = { title: new Set(), description: new Set(), slug: new Set(), q: new Set() };
  for (const p of PAGES) {
    for (const k of ["title", "description", "slug"]) { assert.ok(!seen[k].has(p[k]), `duplicate ${k}: ${p[k]}`); seen[k].add(p[k]); }
    assert.ok(p.title.length <= 80, `title too long: ${p.title}`);
    assert.ok(p.description.length >= 70 && p.description.length <= 165, `description length ${p.description.length}: ${p.slug}`);
    assert.ok(p.body.split(/\s+/).length >= 80, `body too short: ${p.slug}`);
    assert.ok(p.tips.length >= 3 && p.faq.length >= 2, `tips/faq: ${p.slug}`);
    for (const f of p.faq) { assert.ok(!seen.q.has(f.q), `repeated FAQ: ${f.q}`); seen.q.add(f.q); }
  }
});

test("trivia: four distinct choices and an explanation for every question", () => {
  for (const t of TRIVIA) {
    assert.equal(new Set(t.choices).size, 4, t.q);
    assert.ok(t.why.length > 30, t.q);
  }
  assert.equal(new Set(TRIVIA.map((t) => t.q)).size, TRIVIA.length);
});
