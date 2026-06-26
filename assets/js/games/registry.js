// games/registry.js — the catalog of mini-games. Display metadata + a lazy
// loader per game. Adding a game = add an entry here + a module that exports
// start(host) (+ a sim under games/sim/ if it should be leaderboard-verifiable).
//
// kind:  'skill' → deterministic, replay-verified, ranks on the arcade board.
//        'idle'  → relaxed/idle play, grants XP + personal milestones (not ranked,
//                  because idle scores can't be cryptographically verified).
// Each entry's `concept` ties the game to a real piece of the puzzle.

export const GAMES = [
  {
    id: 'cryptogram', title: 'Substitution', kind: 'skill', icon: '🔡',
    verifiable: true, tournament: true, difficulty: 'scales 1–12',
    concept: 'Monoalphabetic substitution — the exact attack family run against the dbbi & faed blocks.',
    blurb: 'Drag letters to break a secret code. Each cipher letter always stands for the same real letter — find the whole mapping. Higher levels strip away the frequency aid.',
    load: () => import('./cryptogram.js'),
  },
  {
    id: 'fielddecode', title: 'Field Decoder', kind: 'skill', icon: '🔢',
    verifiable: true, tournament: true, difficulty: 'scales 1–12',
    concept: 'Base-9 field decode — the REAL method that cracked the SalPhaseIon chunks (symbols → number → hex → ASCII).',
    blurb: 'Assign each symbol a digit so the big number decodes to a real word. Standard mapping at first; scrambled higher up, so you must deduce it. This is the actual puzzle technique.',
    load: () => import('./fielddecode.js'),
  },
  {
    id: 'hashhunt', title: 'Hash Hunter', kind: 'skill', icon: '🎯',
    verifiable: true, tournament: true, difficulty: 'scales 1–9',
    concept: 'One-wayness — you cannot reverse SHA-256, only guess inputs and check. Exactly how every GSMG door works.',
    blurb: 'A secret word was hashed. Solve the riddle and guess it — the hash confirms only an exact match, no “warmer/colder”. Riddles get harder and more obscure as you climb.',
    load: () => import('./hashhunt.js'),
  },
  {
    id: 'spiralcipher', title: 'Spiral Cipher', kind: 'skill', icon: '🌀',
    verifiable: true, tournament: true, difficulty: 'scales 1–9',
    concept: 'Phase 0’s move — read a bit-grid in a counter-clockwise spiral, group into bytes, decode to letters.',
    blurb: 'A word is hidden in a grid of filled/empty cells. Read the spiral, turn the bits into bytes, and recover the word. Bigger grids as you climb.',
    load: () => import('./spiralcipher.js'),
  },
  {
    id: 'vigenere', title: 'Vigenère', kind: 'skill', icon: '🔑',
    verifiable: true, tournament: true, difficulty: 'scales 1–12',
    concept: 'Polyalphabetic key-finding — the family the Architect used (Beaufort keyed THEMATRIXHASYOU).',
    blurb: 'A repeating key shifts every letter. Recover the key so the gibberish becomes a sentence — longer keys higher up, and no frequency aid.',
    load: () => import('./vigenere.js'),
  },
  {
    id: 'binarydecode', title: 'Binary Decoder', kind: 'skill', icon: '⚌',
    verifiable: true, tournament: true, difficulty: 'scales 1–9',
    concept: 'The SalPhaseIon a/b chunks — two symbols are one bit each; 8 bits per ASCII letter.',
    blurb: 'Two symbols, two bits. Assign each one so the string decodes to a real word. Which symbol is 0 gets scrambled higher up — deduce it.',
    load: () => import('./binarydecode.js'),
  },
  {
    id: 'hashminer', title: 'Hash Miner', kind: 'idle', icon: '⛏️',
    verifiable: false, difficulty: 'endless',
    concept: 'SHA-256 proof-of-work — why "mining" means guessing trillions of inputs to hit a rare output.',
    blurb: 'Run a hash rig that searches for ever-rarer SHA-256 outputs. Spend the hashes you find on faster rigs and watch it snowball — even while you are away.',
    load: () => import('./hashminer.js'),
  },
];

export const byId = (id) => GAMES.find(g => g.id === id) || null;
