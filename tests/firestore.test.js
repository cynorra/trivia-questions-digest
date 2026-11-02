import { test } from "node:test";
import assert from "node:assert/strict";
import { checkArticle } from "../scripts/lib/firestore-admin.mjs";
import { TOPIC_KEYS } from "../src/lib/topics.js";

const ok = { slug: "a-valid-guide-slug", title: "A Valid Guide Title for Testing", description: "x".repeat(120), body_md: "y".repeat(400), tool: TOPIC_KEYS[0], status: "draft", published_at: null };

test("checkArticle accepts a valid draft and refuses what the old SQL table refused", () => {
  checkArticle(ok);
  for (const bad of [{ slug: "Bad Slug" }, { title: "short" }, { description: "too short" }, { body_md: "tiny" }, { tool: "vocab" }, { status: "live" }, { status: "published", published_at: null }]) {
    assert.throws(() => checkArticle({ ...ok, ...bad }));
  }
});

test("build reader decodes Firestore REST, drops future/draft rows, sorts newest first", async () => {
  process.env.FIREBASE_PROJECT_ID = "demo-project";
  const s = (v) => ({ stringValue: v });
  const doc = (slug, status, at) => ({ document: { fields: { slug: s(slug), title: s("T " + slug), description: s("d"), body_md: s("b"), tool: s(TOPIC_KEYS[0]), status: s(status), published_at: at ? s(at) : { nullValue: null }, meta: { mapValue: { fields: { skills: { arrayValue: { values: [s("a")] } } } } } } } });
  const real = globalThis.fetch;
  let body;
  globalThis.fetch = async (url, init) => { body = JSON.parse(init.body); assert.match(url, /projects\/demo-project\/databases\/\(default\)\/documents:runQuery$/); return new Response(JSON.stringify([doc("old", "published", "2026-10-01T12:00:00Z"), doc("new", "published", "2026-10-20T12:00:00Z"), doc("future", "published", "2099-01-01T12:00:00Z"), { readTime: "x" }])); };
  try {
    const { fetchLiveArticles } = await import("../src/lib/articles-source.js");
    const rows = await fetchLiveArticles(new Date("2026-11-01T00:00:00Z"));
    assert.deepEqual(rows.map((r) => r.slug), ["new", "old"]);
    assert.equal(rows[0].author_slug, "eren-simsir");
    assert.equal(body.structuredQuery.where.fieldFilter.value.stringValue, "published");
  } finally { globalThis.fetch = real; }
});
