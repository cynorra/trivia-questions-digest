// Which questions and fact belong to which day. Shared by the daily quiz,
// the fact of the day and tests, so every player sees the same set.
export const EPOCH = Date.UTC(2026, 10, 2); // Quiz #1 = 2 November 2026 (UTC)
export const dayNumber = (t: number) => Math.max(1, Math.floor((t - EPOCH) / 864e5) + 1);
export const dayKey = (n: number) => new Date(EPOCH + (n - 1) * 864e5).toISOString().slice(0, 10);

/** Small deterministic PRNG (mulberry32). */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function permutation(len: number, seed: number) {
  const r = rng(seed);
  const p = [...Array(len).keys()];
  for (let i = len - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
  return p;
}

/**
 * Indices into the pool for day n. The pool is shuffled once per pass and
 * dealt out ten a day; a new shuffle starts only after a full pass, so no
 * question repeats within a pass (or within a day).
 */
export function dailyIndices(n: number, len: number, per = 10) {
  const days = Math.max(1, Math.floor(len / per));
  const cycle = Math.floor((n - 1) / days);
  const d = (n - 1) % days;
  return permutation(len, 9973 + cycle).slice(d * per, d * per + per);
}

export const factIndex = (n: number, len: number) => permutation(len, 31337 + Math.floor((n - 1) / len))[(n - 1) % len];
