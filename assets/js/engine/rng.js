// engine/rng.js — deterministic seeded randomness, shared by the browser games
// AND the Node verifier. Same seed + same level => identical puzzle everywhere,
// which is what makes the arcade leaderboard replay-verifiable. Pure ESM, no DOM.

/** FNV-1a 32-bit hash of a string -> uint32. Turns any seed string into a number. */
export function xfnv1a(str) {
  let h = 2166136261 >>> 0;
  const s = String(str);
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

/** mulberry32 PRNG: fast, tiny, good enough for games. Returns a () => [0,1). */
export function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Seed a PRNG from any string. */
export function rngFrom(seedStr) { return mulberry32(xfnv1a(seedStr)); }

export function intBetween(rnd, lo, hi) { return lo + Math.floor(rnd() * (hi - lo + 1)); }
export function pick(rnd, arr) { return arr[Math.floor(rnd() * arr.length)]; }

/** Fisher–Yates using the seeded PRNG (does not mutate the input). */
export function shuffle(rnd, arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
