// games/sim/fielddecode.js — "Field Decoder": the ACTUAL method that cracked the
// SalPhaseIon chunks. A string of symbols maps to digits (standard: o=0, a=1 … i=9),
// read as one big number → hex → ASCII letters. Here you must assign each symbol to
// a digit so the decode reads as a real word. Low levels use the standard mapping
// (you learn it); higher levels PERMUTE it, so you must deduce the mapping yourself.
//
// Pure ESM (no DOM): imported by the browser game AND the verifier for replay scoring.

import { rngFrom, shuffle } from '../../engine/rng.js';

// digit -> symbol, standard GSMG mapping (index is the digit value)
export const STD = 'oabcdefghi';

const BANKS = [
  ['enter', 'seed', 'salt', 'hash', 'key', 'gold', 'node'],                 // tier 0 (short)
  ['causality', 'duality', 'architect', 'cipher', 'matrix', 'genesis'],     // tier 1
  ['lastwords', 'spectrogram', 'straddling', 'yellowblue', 'innersanctum'], // tier 2 (long)
];
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
export function tierFor(level) { return clamp(Math.floor((level - 1) / 3), 0, BANKS.length - 1); }

function bytesToHex(s) { return [...new TextEncoder().encode(s)].map(b => b.toString(16).padStart(2, '0')).join(''); }
function hexToStr(hex) { if (hex.length % 2) hex = '0' + hex; const out = []; for (let i = 0; i < hex.length; i += 2) out.push(parseInt(hex.slice(i, i + 2), 16)); return String.fromCharCode(...out); }

/** Deterministic puzzle for (seed, level). */
export function makePuzzle(seed, level) {
  const lvl = clamp(level | 0, 1, 30);
  const rnd = rngFrom(`fielddecode|${seed}|${lvl}`);
  const tier = tierFor(lvl);
  const bank = BANKS[tier];
  const word = bank[Math.floor(rnd() * bank.length)];

  const hex = bytesToHex(word);
  const dec = BigInt('0x' + hex).toString(10);     // the big number, as decimal digits

  const permuted = lvl >= 4;
  const d2s = permuted ? shuffle(rnd, STD.split('')) : STD.split(''); // digit -> symbol
  const s2d = {}; d2s.forEach((sym, dig) => { s2d[sym] = dig; });

  const symbolString = dec.split('').map(d => d2s[+d]).join('');
  const distinct = [...new Set(symbolString.split(''))];               // symbols the player must map

  const hintBudget = clamp(3 - tier, 1, 3);
  return { level: lvl, tier, word, hex, dec, symbolString, distinct, d2s, s2d, permuted, hintBudget };
}

/** Re-simulate a move-log. moves: { s, d } assign symbol→digit (d==='' clears),
 *  or { hint: <symbol> }. Returns { solved, score, wrong, hints, filled }. */
export function simulate(seed, level, moves) {
  const p = makePuzzle(seed, level);
  const map = {};            // symbol -> digit (0..9)
  let wrong = 0, hints = 0;
  const list = Array.isArray(moves) ? moves.slice(0, 3000) : [];

  for (const mv of list) {
    if (mv && typeof mv.hint === 'string') { const s = mv.hint; if (p.s2d[s] != null) { map[s] = p.s2d[s]; hints++; } continue; }
    if (!mv || typeof mv.s !== 'string' || p.s2d[mv.s] == null) continue;
    const d = mv.d;
    if (d === '' || d == null) { delete map[mv.s]; continue; }
    const dig = +d;
    if (!(dig >= 0 && dig <= 9)) continue;
    if (dig !== p.s2d[mv.s]) wrong++;
    map[mv.s] = dig;
  }

  const filled = p.distinct.filter(s => map[s] != null).length;
  let solved = false;
  if (filled === p.distinct.length) {
    try {
      const dec = p.symbolString.split('').map(s => map[s]).join('');
      solved = hexToStr(BigInt(dec).toString(16)) === p.word;
    } catch { solved = false; }
  }

  let score;
  if (solved) {
    const base = 110 * p.level;
    score = base + Math.max(0, 200 - 12 * wrong - 30 * Math.max(0, hints - p.hintBudget) - 10 * Math.min(hints, p.hintBudget));
  } else { score = filled * 6; }
  return { solved, score, wrong, hints, filled, distinct: p.distinct.length };
}
