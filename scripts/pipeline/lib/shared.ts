/**
 * Shared plumbing for the Trivia Questions Digest article pipeline, ported from the
 * aiandsoftwarehub pipeline: Gemini calls with multi-key / multi-model 429
 * fallback, title dedup, and Firestore helpers (as in the original).
 *
 * Env: GEMINI_API_KEY (comma-separated for several keys), GEMINI_MODEL (optional),
 *      FIREBASE_SERVICE_ACCOUNT (generate / auto-publish jobs only).
 */
import { GoogleGenAI } from '@google/genai';
import * as fsAdmin from '../../lib/firestore-admin.mjs';

export const SITE_NAME = 'Trivia Questions Digest';
export const SITE_NICHE =
  'a free trivia and geography site: a daily ten-question trivia quiz, hand-written trivia questions and answers by category, sourced fun facts, click-the-map quizzes for US states and every country, capitals, flags and guides on hosting trivia and learning the map';

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}

export function normalizeTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

const STOP_WORDS = new Set(['a', 'an', 'the', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'vs', 'versus', 'best', 'top', 'how', 'which', '2026', 'guide', 'your', 'without']);

export function getTitleKeywords(title: string): Set<string> {
  const words = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
  return new Set(words);
}

/** Checks Jaccard word-overlap similarity to detect near-duplicate topics. */
export function calculateTitleSimilarity(titleA: string, titleB: string): number {
  const setA = getTitleKeywords(titleA);
  const setB = getTitleKeywords(titleB);
  if (setA.size === 0 || setB.size === 0) return 0;

  let intersection = 0;
  setA.forEach((word) => {
    if (setB.has(word)) intersection++;
  });

  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

/** The primary subject of a title — the text before its first ":", "?" or
 *  dash, minus the leading "What is"/"How to" — e.g. both "What Is Agentic RAG?
 *  How Active Retrieval Differs..." and "What Is Agentic RAG? How Autonomous
 *  Agents Are Redefining Search" reduce to "agentic rag". Word-overlap
 *  similarity alone let those two explainers of the same concept through. */
function coreSubject(title: string): string {
  return normalizeTitle(title.split(/[:?—–]/)[0])
    .replace(/^(what is|what are|what does|how does|how do you|how to)\s+/, '')
    .replace(/^(a|an|the)\s+/, '');
}

export function isDuplicateTopic(newTitle: string, existingTitles: string[]): boolean {
  const normNew = normalizeTitle(newTitle);
  const coreNew = coreSubject(newTitle);
  for (const existing of existingTitles) {
    if (normalizeTitle(existing) === normNew) return true;
    // Same primary subject (only when the title actually has a "Subject: angle" or
    // "What is Subject?" shape, so ordinary long how-to titles are unaffected).
    if (coreNew.split(' ').length >= 2 && /[:?—–]/.test(newTitle) && /[:?—–]/.test(existing) && coreNew === coreSubject(existing)) {
      console.warn(`  [Duplicate Blocked] Proposed "${newTitle}" covers the same subject as existing "${existing}".`);
      return true;
    }
    if (calculateTitleSimilarity(newTitle, existing) >= 0.5) {
      console.warn(`  [Duplicate Blocked] Proposed "${newTitle}" is too similar to existing "${existing}".`);
      return true;
    }
  }
  return false;
}


// ---- Firestore (Admin SDK, service account) --------------------------------------
export interface ArticleRow {
  slug: string;
  title: string;
  description: string;
  body_md: string;
  tool: string;
  status: 'draft' | 'published';
  published_at: string | null;
  author_slug?: string;
  review?: unknown;
  meta?: { form?: string; keyword?: string; publishOn?: string; skills?: string[] } | null;
}


/** Every article (drafts included), for dedup and link checks. */
export async function fetchAllArticles(): Promise<ArticleRow[]> {
  return (await fsAdmin.fetchAllArticles()) as ArticleRow[];
}

/** Insert or merge one article by slug. Throws (fails loudly) on a row the old SQL checks would refuse. */
export async function upsertArticle(row: Partial<ArticleRow> & { slug: string }): Promise<void> {
  await fsAdmin.upsertArticle(row);
}

export const FALLBACK_MODELS = Array.from(
  new Set([
    process.env.GEMINI_MODEL || 'gemini-3.5-flash',
    'gemini-3.8-flash',
    'gemini-3.7-flash',
    'gemini-3.6-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.1-flash-lite',
  ]),
);

export function initGemini(enableSearch = false): GoogleGenAI[] {
  const rawKeys = process.env.GEMINI_API_KEY || '';
  const keys = rawKeys
    .split(',')
    .map((k) => k.replace(/['"\r\n\t]/g, '').trim())
    .filter(Boolean);
  if (keys.length === 0) {
    console.error('Missing GEMINI_API_KEY in .env.local — get a free key at https://aistudio.google.com/apikey');
    process.exit(1);
  }
  if (enableSearch) {
    console.warn(
      'GEMINI_ENABLE_SEARCH=true, but Google Search grounding requires billing enabled on the Google Cloud project — it is NOT available on a pure free-tier API key and calls will fail if billing is not enabled.',
    );
  }
  return keys.map((key) => new GoogleGenAI({ apiKey: key }));
}

const MIN_MS_BETWEEN_CALLS = 1500;
let lastCallAt = 0;
let currentKeyIndex = 0;
/** "model:clientIndex" pairs that returned a daily-quota (or model-retired) error in this process. */
const exhaustedToday = new Set<string>();

async function throttleGeminiCall() {
  const elapsed = Date.now() - lastCallAt;
  if (elapsed < MIN_MS_BETWEEN_CALLS) {
    await sleep(MIN_MS_BETWEEN_CALLS - elapsed);
  }
  lastCallAt = Date.now();
}

/** Calls Gemini with automatic fallback across models and API keys on 429s.
 *  `systemInstruction` is caller-supplied since it differs between article
 *  generation and topic proposal. */
export async function callGemini(
  clientsInput: GoogleGenAI | GoogleGenAI[],
  input: string,
  schema: object,
  maxOutputTokens: number,
  useSearch: boolean,
  systemInstruction: string,
): Promise<string | null> {
  const clients = Array.isArray(clientsInput) ? clientsInput : [clientsInput];

  // Try combination of API clients & fallback models with zero initial delay on 429s
  for (const modelName of FALLBACK_MODELS) {
    for (let k = 0; k < clients.length; k++) {
      const clientIndex = (currentKeyIndex + k) % clients.length;
      const client = clients[clientIndex];
      // A model/key whose DAILY quota is spent fails after a 8-30 s hang on every single call;
      // once seen, skip it for the rest of this process instead of paying that each time.
      if (exhaustedToday.has(`${modelName}:${clientIndex}`)) continue;

      try {
        await throttleGeminiCall();
        const interaction = await client.interactions.create({
          model: modelName,
          input,
          system_instruction: systemInstruction,
          ...(useSearch ? { tools: [{ type: 'google_search' as const }] } : {}),
          response_format: { type: 'text', mime_type: 'application/json', schema },
          generation_config: { thinking_level: 'low', max_output_tokens: maxOutputTokens },
        });

        if (interaction.status !== 'completed') {
          const u = interaction.usage;
          console.warn(
            `  Interaction ended with status "${interaction.status}" on model ${modelName} (thought_tokens=${u?.total_thought_tokens ?? '?'}, output_tokens=${u?.total_output_tokens ?? '?'}).`,
          );
          continue;
        }

        // Successfully generated — rotate client index for fair distribution
        currentKeyIndex = (clientIndex + 1) % clients.length;
        return interaction.output_text ?? null;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        const isRateLimit = /429|RESOURCE_EXHAUSTED|rate/i.test(message);
        if (/per day|daily/i.test(message) || /no longer available/i.test(message)) exhaustedToday.add(`${modelName}:${clientIndex}`);

        if (isRateLimit) {
          console.warn(`  [Rate Limit 429] Model "${modelName}" busy — switching model/key instantly...`);
          // Instant switch to next model/key without sleeping!
          continue;
        }
        console.warn(`  Gemini call failed on ${modelName}: ${message}`);
      }
    }
  }

  // If ALL models & keys hit rate limit simultaneously, do a short 10s cooldown
  console.warn('  All API models & keys momentarily busy. Cooldown 10s before retry...');
  await sleep(10000);
  return null;
}


