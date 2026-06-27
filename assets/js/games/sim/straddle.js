// games/sim/straddle.js — "Straddling Checkerboard" (the heart of the VIC cipher
// the Architect used). A board gives 8 common letters a single digit and the rest a
// two-digit code prefixed by one of two "straddle" digits. You decode a number
// string back to a word by reading the board. Pure ESM (shared with the verifier).

import { rngFrom, shuffle } from '../../engine/rng.js';

const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

const BANKS = [
  ['seed', 'salt', 'node', 'gold', 'hash'],
  ['matrix', 'cipher', 'duality', 'beaufort'],
  ['architect', 'spectrogram', 'innersanctum'],
];
export function tierFor(level) { return clamp(Math.floor((level - 1) / 3), 0, BANKS.length - 1); }

/** Build a seeded straddling checkerboard: pick 2 straddle (prefix) digits, lay the
 *  26 letters out — 8 single-digit, then two rows of ten under the prefix digits. */
export function makeBoard(rnd) {
  const order = shuffle(rnd, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const p1 = Math.min(order[0], order[1]);
  const p2 = Math.max(order[0], order[1]);
  const singles = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(d => d !== p1 && d !== p2); // 8 columns
  const letters = shuffle(rnd, A.split(''));
  const code = {}, decode = {};
  let li = 0;
  for (const col of singles) { const L = letters[li++]; code[L] = '' + col; decode['' + col] = L; }
  for (let col = 0; col < 10 && li < 26; col++) { const L = letters[li++]; const c = '' + p1 + col; code[L] = c; decode[c] = L; }
  for (let col = 0; col < 10 && li < 26; col++) { const L = letters[li++]; const c = '' + p2 + col; code[L] = c; decode[c] = L; }
  return { p1, p2, singles, code, decode };
}

export function encode(word, board) { return word.toUpperCase().replace(/[^A-Z]/g, '').split('').map(L => board.code[L]).join(''); }

/** Decode a digit string with the straddling rule (prefix digits consume the next). */
export function decode(digits, board) {
  let out = '', i = 0;
  while (i < digits.length) {
    const d = +digits[i];
    if (d === board.p1 || d === board.p2) { const c = digits.slice(i, i + 2); out += board.decode[c] || '?'; i += 2; }
    else { out += board.decode['' + d] || '?'; i += 1; }
  }
  return out;
}

export function makePuzzle(seed, level) {
  const lvl = clamp(level | 0, 1, 30);
  const rnd = rngFrom(`straddle|${seed}|${lvl}`);
  const board = makeBoard(rnd);
  const tier = tierFor(lvl);
  const word = BANKS[tier][Math.floor(rnd() * BANKS[tier].length)];
  return { level: lvl, tier, word, ciphertext: encode(word, board), board };
}

/** moves: [{ guess }] (+ optional [{ hint:1 }]). Solved when a guess matches. */
export function simulate(seed, level, moves) {
  const p = makePuzzle(seed, level);
  let guesses = 0, hints = 0, solved = false;
  for (const mv of (Array.isArray(moves) ? moves.slice(0, 500) : [])) {
    if (mv && mv.hint) { hints++; continue; }
    if (mv && typeof mv.guess === 'string') { guesses++; if (norm(mv.guess) === norm(p.word)) { solved = true; break; } }
  }
  const score = solved ? 110 * p.level + Math.max(0, 220 - 25 * (guesses - 1) - 30 * hints) : 0;
  return { solved, score, guesses, hints };
}
