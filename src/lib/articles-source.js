// Where guides come from.
// - FIREBASE_PROJECT_ID set: live articles are read from Firestore at build
//   time and rendered to static HTML. No key is needed: firestore.rules let
//   anyone read published articles and nothing else.
// - Not set: the Markdown files in src/content/guides/ are used (local work,
//   first launch before the database exists).
// Either way, only "live" guides are built: not drafts, and not guides whose
// publish date is still in the future. Set PREVIEW_FUTURE=1 to see
// scheduled local guides while writing them (never in a deploy).
// Used by both the content collection and the sitemap, so they always agree.
import { loadEnv } from "vite";
import { readdirSync, readFileSync } from "node:fs";
import { guideRow } from "./frontmatter.js";

const env = { ...loadEnv(process.env.NODE_ENV ?? "production", process.cwd(), ""), ...process.env };

export const FIREBASE_PROJECT_ID = env.FIREBASE_PROJECT_ID ?? "";
export const useFirestore = Boolean(FIREBASE_PROJECT_ID);
export const sourceName = useFirestore ? "Firestore" : "src/content/guides";
export const previewFuture = env.PREVIEW_FUTURE === "1";

/** Firestore REST value -> plain JS value. */
function plain(v) {
  if (!v || "nullValue" in v) return null;
  if ("stringValue" in v) return v.stringValue;
  if ("integerValue" in v) return Number(v.integerValue);
  if ("doubleValue" in v) return v.doubleValue;
  if ("booleanValue" in v) return v.booleanValue;
  if ("timestampValue" in v) return v.timestampValue;
  if ("arrayValue" in v) return (v.arrayValue.values ?? []).map(plain);
  if ("mapValue" in v) return Object.fromEntries(Object.entries(v.mapValue.fields ?? {}).map(([k, x]) => [k, plain(x)]));
  return null;
}

/**
 * Published articles whose publish time has passed, newest first.
 * The query asks only for status == "published" (what the rules allow, and
 * no composite index needed); the date filter and order are applied here.
 * Throws on any error so a failed fetch fails the build instead of
 * deploying a site with its guides missing.
 */
export async function fetchLiveArticles(now = new Date()) {
  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents:runQuery`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: "articles" }],
        where: { fieldFilter: { field: { fieldPath: "status" }, op: "EQUAL", value: { stringValue: "published" } } },
      },
    }),
  });
  if (!res.ok) throw new Error(`Firestore returned ${res.status} ${res.statusText}: ${await res.text()}`);
  const out = await res.json();
  const iso = now.toISOString();
  return out
    .filter((x) => x.document)
    .map((x) => Object.fromEntries(Object.entries(x.document.fields ?? {}).map(([k, v]) => [k, plain(v)])))
    .filter((r) => r.status === "published" && r.published_at && r.published_at <= iso)
    .map(({ slug, title, description, body_md, tool, published_at, content_updated_at, author_slug }) => ({ slug, title, description, body_md, tool, published_at, content_updated_at: content_updated_at ?? null, author_slug: author_slug ?? "eren-simsir" }))
    .sort((a, b) => b.published_at.localeCompare(a.published_at));
}

/** "2026-10-20" from an ISO timestamp. */
export const day = (iso) => (iso ? iso.slice(0, 10) : undefined);

/** Updated date only when the words changed on a later day than publication. */
export function updatedDay(row) {
  const pub = day(row.published_at);
  const upd = day(row.content_updated_at);
  return upd && upd > pub ? upd : undefined;
}

/** Every local guide file as an articles row (drafts and scheduled included). */
export function localRows() {
  const dir = new URL("../content/guides/", import.meta.url);
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => guideRow(f, readFileSync(new URL(f, dir), "utf8")));
}

/** Local guides that would be live right now, newest first. */
export function localLiveArticles(now = new Date()) {
  return localRows()
    .filter((r) => r.status === "published" && (previewFuture || new Date(r.published_at) <= now))
    .sort((a, b) => b.published_at.localeCompare(a.published_at));
}

/** Live articles from whichever source is active. */
export async function liveArticles() {
  return useFirestore ? fetchLiveArticles() : localLiveArticles();
}

/** { slug: lastmodDay } for the sitemap. */
export async function guideLastmods() {
  const rows = await liveArticles();
  return Object.fromEntries(rows.map((r) => [r.slug, updatedDay(r) ?? day(r.published_at)]));
}
