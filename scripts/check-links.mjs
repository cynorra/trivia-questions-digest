// Two link checks, run after `npm run build`:
// 1. Every internal link in dist/ points to a page that was built.
// 2. Scheduled guides only link to guides published on or before their own
//    date, so no live page ever links to a guide that isn't out yet.
//   node scripts/check-links.mjs
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { localRows } from "../src/lib/articles-source.js";

const DIST = fileURLToPath(new URL("../dist/", import.meta.url));
const REDIRECTS_FILE = fileURLToPath(new URL("../public/_redirects", import.meta.url));
const redirects = new Set();
if (existsSync(REDIRECTS_FILE)) {
  for (const line of readFileSync(REDIRECTS_FILE, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [from] = trimmed.split(/\s+/);
    if (from) redirects.add(from);
  }
}
const problems = [];

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".html") ? [p] : [];
  });
}

if (existsSync(DIST)) {
  for (const file of walk(DIST)) {
    const html = readFileSync(file, "utf8");
    for (const [, href] of html.matchAll(/href="(\/[^"#?]*)/g)) {
      if (href.startsWith("//")) continue;
      const target = join(DIST, href);
      const ok = href.endsWith("/")
        ? existsSync(join(target, "index.html")) || redirects.has(href)
        : existsSync(target) || redirects.has(href);
      if (!ok) problems.push(`${file.replace(DIST, "/")} -> ${href}`);
    }
  }
} else {
  console.warn("dist/ not found: run npm run build first. Checking guide dates only.");
}

const rows = localRows();
const date = Object.fromEntries(rows.map((r) => [r.slug, r.published_at]));
for (const r of rows) {
  for (const m of r.body_md.matchAll(/\]\(\/guides\/([^/)]+)\/?\)|href="\/guides\/([^/"]+)/g)) {
    const slug = m[1] ?? m[2];
    if (!(slug in date)) problems.push(`${r.slug}: links to missing guide ${slug}`);
    else if (r.published_at && date[slug] && date[slug] > r.published_at) {
      problems.push(`${r.slug} (${r.published_at.slice(0, 10)}) links to ${slug}, which publishes later (${date[slug].slice(0, 10)})`);
    }
  }
}

// 3. Internal-link floor for every live guide (needs dist/). A guide that other
// guides don't link to is found only through the sitemap; one with almost no
// links to question sets or quizzes passes nothing on.
if (existsSync(DIST)) {
  const guideDirs = existsSync(join(DIST, "guides")) ? readdirSync(join(DIST, "guides")).filter((d) => existsSync(join(DIST, "guides", d, "index.html"))) : [];
  const mainOf = (html) => (html.match(/<main[\s\S]*?<\/main>/) || [html])[0];
  const inboundFrom = Object.fromEntries(guideDirs.map((g) => [g, new Set()]));
  for (const g of guideDirs) {
    const main = mainOf(readFileSync(join(DIST, "guides", g, "index.html"), "utf8"));
    const pageLinks = new Set();
    for (const [, href] of main.matchAll(/<a [^>]*href="(\/[^"#?]*)/g)) {
      const gm = /^\/guides\/([^/]+)\/$/.exec(href);
      if (gm) { if (gm[1] !== g && inboundFrom[gm[1]]) inboundFrom[gm[1]].add(g); }
      else if (href !== "/" && href !== "/guides/" && !href.startsWith("/author/")) pageLinks.add(href);
    }
    if (pageLinks.size < 2) console.warn(`warn: /guides/${g}/ links to only ${pageLinks.size} question set/quiz page(s); aim for 2+`);
  }
  if (guideDirs.length >= 5) {
    for (const g of guideDirs) {
      if (inboundFrom[g].size < 3) problems.push(`/guides/${g}/ is linked from only ${inboundFrom[g].size} other guide(s); every guide needs 3+ (check relatedGuides in src/lib/guide-links.js)`);
    }
  }
}

if (problems.length) {
  console.error(`${problems.length} link problem(s):\n` + [...new Set(problems)].join("\n"));
  process.exit(1);
}
console.log("Links OK");
