// Tell IndexNow engines (Bing, Yandex, Seznam, Naver, Yep...) which URLs are new
// or changed, right after a deploy. Google does not use IndexNow; it reads the
// sitemap (submit it once in Search Console).
//
//   node scripts/indexnow.mjs                 # every URL in the sitemap
//   node scripts/indexnow.mjs --since 2026-10-20   # only URLs with lastmod on/after that date
//   node scripts/indexnow.mjs --dry-run       # print, don't send
//
// Run it after the new version is live, so the engines fetch the new content.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { SITE } from "../src/site.config.js";

const args = process.argv.slice(2);
const since = args.includes("--since") ? args[args.indexOf("--since") + 1] : null;
const dry = args.includes("--dry-run");

let urls = [];

// Try fetching the live sitemap first to get all live URLs
try {
  const res = await fetch(`${SITE.url}/sitemap-0.xml`);
  if (res.ok) {
    const xml = await res.text();
    for (const m of xml.matchAll(/<url><loc>([^<]+)<\/loc>(?:<lastmod>([^<]+)<\/lastmod>)?/g)) {
      const [, loc, lastmod] = m;
      if (!since || (lastmod && lastmod.slice(0, 10) >= since)) urls.push(loc);
    }
  }
} catch {
  // fallback to local dist
}

if (!urls.length) {
  const dist = new URL("../dist/", import.meta.url);
  if (existsSync(dist)) {
    const files = readdirSync(dist).filter((f) => /^sitemap-\d+\.xml$/.test(f));
    for (const f of files) {
      const xml = readFileSync(new URL(f, dist), "utf8");
      for (const m of xml.matchAll(/<url><loc>([^<]+)<\/loc>(?:<lastmod>([^<]+)<\/lastmod>)?/g)) {
        const [, loc, lastmod] = m;
        if (!since || (lastmod && lastmod.slice(0, 10) >= since)) urls.push(loc);
      }
    }
  }
}

urls = [...new Set(urls)];

if (!urls.length) {
  console.log("Nothing to submit.");
  process.exit(0);
}

const body = {
  host: new URL(SITE.url).host,
  key: SITE.indexNowKey,
  keyLocation: `${SITE.url}/${SITE.indexNowKey}.txt`,
  urlList: urls.slice(0, 10000),
};

console.log(`Submitting ${body.urlList.length} URL(s) to IndexNow${dry ? " (dry run)" : ""}:`);
for (const u of body.urlList) console.log("  " + u);
if (dry) process.exit(0);

const endpoints = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
  "https://yandex.com/indexnow",
];

let anySuccess = false;
for (const endpoint of endpoints) {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });
    console.log(`[${endpoint}] Responded: ${res.status} ${res.statusText}`);
    if (res.status === 200 || res.status === 202) {
      anySuccess = true;
    }
  } catch (err) {
    console.warn(`[${endpoint}] Failed:`, err.message);
  }
}

if (anySuccess) {
  console.log("IndexNow submission completed successfully!");
} else {
  console.log("Submission sent to IndexNow endpoints.");
}
