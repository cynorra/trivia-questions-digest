// Firestore write access for the pipeline and push-guides.mjs (never the site build).
// Collection "articles", one document per guide, document id = slug.
//
// Env: FIREBASE_SERVICE_ACCOUNT — the service account JSON (the whole file
// content, from Firebase console > Project settings > Service accounts >
// Generate new private key). Never commit it, never give it to the build or
// Cloudflare: it bypasses the security rules.
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { TOPIC_KEYS } from "../../src/lib/topics.js";

export const COLLECTION = "articles";
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
// Guide sections come from the site itself, so a new section never needs a second edit here.
const TOOLS = TOPIC_KEYS;

function db() {
  if (!getApps().length) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!raw) throw new Error("Missing FIREBASE_SERVICE_ACCOUNT (service account JSON)");
    let sa;
    try { sa = JSON.parse(raw); } catch { throw new Error("FIREBASE_SERVICE_ACCOUNT is not valid JSON"); }
    initializeApp({ credential: cert(sa), projectId: sa.project_id });
  }
  return getFirestore();
}

/** Every article (drafts included). */
export async function fetchAllArticles() {
  const snap = await db().collection(COLLECTION).get();
  return snap.docs.map((d) => ({ slug: d.id, ...d.data() }));
}

/**
 * The same checks the old SQL table enforced, so a bad row fails loudly
 * instead of landing in the database. Checked on the merged document.
 */
export function checkArticle(r) {
  const bad = [];
  if (!SLUG.test(r.slug) || r.slug.length > 80) bad.push(`slug "${r.slug}"`);
  if (!r.title || r.title.length < 10 || r.title.length > 80) bad.push(`title length ${r.title?.length}`);
  if (!r.description || r.description.length < 70 || r.description.length > 165) bad.push(`description length ${r.description?.length}`);
  if (!r.body_md || r.body_md.length < 300) bad.push(`body_md length ${r.body_md?.length}`);
  if (!TOOLS.includes(r.tool)) bad.push(`tool "${r.tool}"`);
  if (!["draft", "published"].includes(r.status)) bad.push(`status "${r.status}"`);
  if (r.status === "published" && !r.published_at) bad.push("published without published_at");
  if (bad.length) throw new Error(`Article ${r.slug} rejected: ${bad.join(", ")}`);
}

/**
 * Insert or merge one article by slug. Sets modified_at, and content_updated_at
 * when the words of an already-live article change (what the SQL trigger did).
 */
export async function upsertArticle(row) {
  const ref = db().collection(COLLECTION).doc(row.slug);
  await db().runTransaction(async (tx) => {
    const cur = await tx.get(ref);
    const old = cur.exists ? cur.data() : null;
    const now = new Date().toISOString();
    const { slug, ...fields } = row;
    const next = { author_slug: "eren-simsir", status: "draft", published_at: null, ...(old ?? {}), ...fields, slug, modified_at: now };
    if (!old) next.created_at = now;
    const wasLive = old && old.status === "published" && old.published_at && old.published_at <= now;
    if (wasLive && ["title", "description", "body_md", "tool"].some((k) => k in fields && fields[k] !== old[k])) next.content_updated_at = now;
    checkArticle(next);
    tx.set(ref, next);
  });
}
