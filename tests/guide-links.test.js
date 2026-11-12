import { test } from "node:test";
import assert from "node:assert/strict";
import { relatedGuides, guideCategory } from "../src/lib/guide-links.js";

const g = (id, tool, day) => ({ id, data: { tool, published: new Date(`2026-11-${String(day).padStart(2, "0")}`) } });
const all = [g("a", "x", 1), g("b", "x", 2), g("c", "x", 3), g("d", "x", 4), g("e", "x", 5), g("f", "x", 6), g("z", "y", 7)];

test("every guide in a big section gets exactly 4 links in, so none is an orphan", () => {
  const inbound = Object.fromEntries(all.map((x) => [x.id, 0]));
  for (const x of all) for (const r of relatedGuides(x, all, 4)) inbound[r.id]++;
  for (const id of ["a", "b", "c", "d", "e", "f"]) assert.ok(inbound[id] >= 4, `${id} has ${inbound[id]}`);
});

test("a new guide is linked from the guides before it, and never from itself", () => {
  const withNew = [...all, g("n", "x", 9)];
  assert.ok(relatedGuides(g("f", "x", 6), withNew, 4).some((r) => r.id === "n"));
  for (const x of withNew) assert.ok(!relatedGuides(x, withNew, 4).some((r) => r.id === x.id));
});

test("a one-guide section still gets 3+ links in (the flags guide case)", () => {
  const sizes = [["x", 8], ["h", 3], ["f", 1], ["u", 5]];
  const list = [];
  let d = 1;
  for (const [t, c] of sizes) for (let i = 0; i < c; i++) list.push(g(`${t}${i}`, t, d++));
  const inbound = Object.fromEntries(list.map((x) => [x.id, 0]));
  for (const x of list) for (const r of relatedGuides(x, list, 4)) inbound[r.id]++;
  for (const [id, n] of Object.entries(inbound)) assert.ok(n >= 3, `${id} has ${n}`);
});

test("small sections are padded from other sections", () => {
  assert.equal(relatedGuides(all[6], all, 4).length, 4);
});

test("guideCategory reads the first known /trivia/ link", () => {
  const cats = new Set(["halloween-trivia", "music-trivia"]);
  assert.equal(guideCategory('<a href="/trivia/nope/">x</a> <a href="/trivia/music-trivia/">y</a>', cats), "music-trivia");
  assert.equal(guideCategory("no links", cats), null);
});
