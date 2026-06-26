// store.js — game state: XP/level, phase progress, achievements, attempt log.
// Persists to localStorage; notifies subscribers (UI) and hooks (achievements).

import { xfnv1a } from './engine/rng.js';

const NS = 'gsmg.v2.';

function read(k, d) { try { const v = localStorage.getItem(NS + k); return v == null ? d : JSON.parse(v); } catch { return d; } }
function write(k, v) { try { localStorage.setItem(NS + k, JSON.stringify(v)); } catch {} }

export const state = {
  handle:       read('handle', ''),
  xp:           read('xp', 0),
  cracked:      read('cracked', {}),      // phaseId -> timestamp
  visited:      read('visited', {}),      // phaseId -> timestamp
  achievements: read('achievements', {}), // achId -> timestamp
  attempts:     read('attempts', []),     // local attempt log (frontier work)
  submitted:    read('submitted', {}),    // attemptId -> true (sent to leaderboard)
  quiz:         read('quiz', {}),         // quizId -> {correct, ts}
  lessons:      read('lessons', {}),      // lessonId -> timestamp
  notes:        read('notes', {}),        // phaseId -> free text scratch notes
  arcade:       read('arcade', { results: [], submitted: {}, best: {}, idle: {} }), // mini-game scores + idle state
};

const PERSIST = ['handle', 'xp', 'cracked', 'visited', 'achievements', 'attempts', 'submitted', 'quiz', 'lessons', 'notes', 'arcade'];
function persistAll() { for (const k of PERSIST) write(k, state[k]); }

// ---- subscribers (UI) and hooks (cross-cutting, e.g. achievement checks) ----
const subs = new Set();
const hooks = [];
let inCommit = false;

export function subscribe(fn) { subs.add(fn); try { fn(state); } catch (e) {} return () => subs.delete(fn); }
export function onChange(fn) { hooks.push(fn); }

function commit() {
  persistAll();
  for (const fn of subs) { try { fn(state); } catch (e) {} }
  if (!inCommit) { inCommit = true; for (const h of hooks) { try { h(state); } catch (e) {} } inCommit = false; }
}

// ---- level curve: each level costs ~35% more XP than the last ----
export function levelFor(xp) {
  let level = 1, need = 100, floor = 0;
  while (xp >= floor + need) { floor += need; level++; need = Math.round(need * 1.35); }
  return { level, into: xp - floor, need, floor, pct: Math.round(((xp - floor) / need) * 100) };
}

// ---- domain actions ----
export function setHandle(v) { state.handle = String(v || '').slice(0, 32); commit(); }

export function addXp(n) { if (n) { state.xp += n; commit(); } }

export function visit(id) { if (!state.visited[id]) { state.visited[id] = Date.now(); commit(); } }

export function isCracked(id) { return !!state.cracked[id]; }

export function crackPhase(id, xp = 0) {
  if (state.cracked[id]) return false;
  state.cracked[id] = Date.now();
  if (xp) state.xp += xp;
  commit();
  return true;
}

export function unlockAchievement(id, xp = 0) {
  if (state.achievements[id]) return false;
  state.achievements[id] = Date.now();
  if (xp) state.xp += xp;
  commit();
  return true;
}

export function recordQuiz(id, correct) { state.quiz[id] = { correct: !!correct, ts: Date.now() }; commit(); }
export function completeLesson(id) { if (!state.lessons[id]) { state.lessons[id] = Date.now(); commit(); } }
export function setNote(id, text) { state.notes[id] = text; commit(); }

/** Log a frontier/workbench attempt. Returns the stored record. */
export function logAttempt({ blob, recipe, prehash, result, id }) {
  const rec = { id, blob, recipe, prehash: !!prehash, result, ts: Date.now() };
  // avoid logging exact duplicates back-to-back
  if (!state.attempts.some(a => a.id === id)) {
    state.attempts.push(rec);
    if (state.attempts.length > 4000) state.attempts = state.attempts.slice(-4000);
    commit();
  }
  return rec;
}

export function markSubmitted(ids) { for (const id of ids) state.submitted[id] = true; commit(); }

// ---- arcade (mini-games) ----
// A local id good enough to dedup the same replay; the CI verifier computes its
// own canonical sha256 id independently.
function arcadeLocalId(r) {
  return `${r.game}|${r.seed}|${r.level}|${xfnv1a(JSON.stringify(r.moves || []))}`;
}

/** Record a finished skill-game round. Keeps the personal best per game,
 *  awards XP only when a new personal best is set. Returns the stored record. */
export function logArcadeResult({ game, seed, level, moves, score, solved }) {
  const a = state.arcade;
  const rec = { id: '', game, seed: String(seed), level: level | 0, moves: moves || [], score: score | 0, solved: !!solved, ts: Date.now() };
  rec.id = arcadeLocalId(rec);
  if (!a.results.some(x => x.id === rec.id)) {
    a.results.push(rec);
    if (a.results.length > 500) a.results = a.results.slice(-500);
  }
  const prevBest = a.best[game] || 0;
  if (rec.score > prevBest) {
    a.best[game] = rec.score;
    addXp(Math.max(5, Math.round((rec.score - prevBest) / 20))); // commits
  } else {
    commit();
  }
  return rec;
}

export const arcadeBest = (game) => (state.arcade.best && state.arcade.best[game]) || 0;
export const arcadeUnsubmitted = () => state.arcade.results.filter(r => r.solved && !state.arcade.submitted[r.id]);
export function markArcadeSubmitted(ids) { for (const id of ids) state.arcade.submitted[id] = true; commit(); }

/** idle-game persistence (offline progress, upgrades, currency). */
export const getIdleState = (game) => (state.arcade.idle && state.arcade.idle[game]) || null;
export function setIdleState(game, obj) { state.arcade.idle = state.arcade.idle || {}; state.arcade.idle[game] = obj; commit(); }

export function reset() {
  for (const k of PERSIST) { try { localStorage.removeItem(NS + k); } catch {} }
  location.reload();
}

// expose for debugging in the console
if (typeof window !== 'undefined') window.__GSMG_STORE = state;
