// Upload Markdown guides from src/content/guides/ to Firestore (insert or update by slug).
// Write a guide locally, review it, then push it:
//
//   node scripts/push-guides.mjs                      # every file
//   node scripts/push-guides.mjs concrete-for-fence-posts   # one slug
//   node scripts/push-guides.mjs --dry-run
//
// Frontmatter decides publishing:
//   draft: true              -> saved as draft, not on the site
//   published: 2026-10-20    -> goes live on that date (a future date schedules it)
// Needs FIREBASE_SERVICE_ACCOUNT (the service account JSON; never commit it,
// never put it in the site build).
import { readdirSync, readFileSync } from "node:fs";
import { loadEnv } from "vite";
import { guideRow } from "../src/lib/frontmatter.js";
import { upsertArticle, checkArticle } from "./lib/firestore-admin.mjs";

const env = { ...loadEnv("production", process.cwd(), ""), ...process.env };
if (env.FIREBASE_SERVICE_ACCOUNT) process.env.FIREBASE_SERVICE_ACCOUNT = env.FIREBASE_SERVICE_ACCOUNT;
const args = process.argv.slice(2);
const dry = args.includes("--dry-run");
const only = args.filter((a) => !a.startsWith("--"));

if (!dry && !process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.error("Set FIREBASE_SERVICE_ACCOUNT in .env first.");
  process.exit(1);
}

const parse = (file) => {
  const { content_updated_at, author_slug, ...row } = guideRow(file, readFileSync(new URL(`../src/content/guides/${file}`, import.meta.url), "utf8"));
  return row; // upsertArticle sets content_updated_at and author_slug itself
};

const files = readdirSync(new URL("../src/content/guides/", import.meta.url))
  .filter((f) => f.endsWith(".md"))
  .filter((f) => !only.length || only.includes(f.replace(/\.md$/, "")));
const rows = files.map(parse);

for (const r of rows) {
  const when = r.status === "draft" ? "draft" : new Date(r.published_at) > new Date() ? `scheduled ${r.published_at.slice(0, 10)}` : `live since ${r.published_at.slice(0, 10)}`;
  console.log(`${r.slug.padEnd(48)} ${r.tool.padEnd(9)} ${when}`);
}
for (const r of rows) checkArticle({ author_slug: "eren-simsir", ...r });
if (dry || !rows.length) process.exit(0);

for (const r of rows) await upsertArticle(r);
console.log(`Pushed ${rows.length} article(s). Rebuild the site to publish.`);
process.exit(0);
