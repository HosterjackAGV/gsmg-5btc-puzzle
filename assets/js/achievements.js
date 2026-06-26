// achievements.js — badge catalog + checker.
// Each achievement has check(state) -> boolean. main.js subscribes to the store
// and unlocks any newly-true achievements, awarding XP and a toast.

const count = (o) => Object.keys(o || {}).length;

export const ACHIEVEMENTS = [
  { id: 'first-steps',   ico: '🌱', xp: 25,  title: 'The Seed Is Planted', desc: 'Open the game for the first time.',               check: s => true },
  { id: 'curious',       ico: '🧭', xp: 25,  title: 'Curious Mind',        desc: 'Visit your first door.',                          check: s => count(s.visited) >= 1 },
  { id: 'scholar',       ico: '📚', xp: 50,  title: 'Scholar',             desc: 'Finish a crash-course lesson.',                   check: s => count(s.lessons) >= 1 },
  { id: 'first-crack',   ico: '🔓', xp: 100, title: 'First Crack',         desc: 'Open your first locked door.',                    check: s => count(s.cracked) >= 1 },
  { id: 'hasher',        ico: '#️⃣', xp: 30,  title: 'Hash Slinger',        desc: 'Compute a SHA-256 fingerprint.',                  check: s => (s._hashed | 0) >= 1 },
  { id: 'half-way',      ico: '⚖️', xp: 150, title: 'Half & Better Half',  desc: 'Crack three doors.',                              check: s => count(s.cracked) >= 3 },
  { id: 'architect',     ico: '🏛️', xp: 250, title: 'Met the Architect',   desc: 'Reach Phase 3.2 and crack it.',                   check: s => !!s.cracked['phase-3-2'] },
  { id: 'cartographer',  ico: '🗺️', xp: 120, title: 'Cartographer',        desc: 'Crack everything that is currently solvable.',    check: s => ['phase-0','phase-1','phase-2','phase-3','phase-3-2'].every(id => s.cracked[id]) },
  { id: 'frontiersman',  ico: '🛰️', xp: 80,  title: 'On the Frontier',     desc: 'Log a verified attempt against an open blob.',    check: s => s.attempts.some(a => a.blob === 'cosmic' || a.blob === 'salphaseion') },
  { id: 'sweeper',       ico: '🧹', xp: 200, title: 'Space Sweeper',       desc: 'Log 25 unique frontier attempts.',                check: s => new Set(s.attempts.filter(a => a.blob === 'cosmic' || a.blob === 'salphaseion').map(a => a.id)).size >= 25 },
  { id: 'contributor',   ico: '🤝', xp: 100, title: 'Hive Contributor',    desc: 'Submit attempts to the shared leaderboard.',      check: s => count(s.submitted) >= 1 },
  { id: 'named',         ico: '🪪', xp: 20,  title: 'Identity',            desc: 'Set your handle.',                                check: s => !!(s.handle && s.handle.length) },
  { id: 'quizzer',       ico: '🎯', xp: 60,  title: 'Sharp',               desc: 'Answer 5 quiz questions correctly.',              check: s => Object.values(s.quiz).filter(q => q.correct).length >= 5 },
  // the big one
  { id: 'solved',        ico: '🏆', xp: 5000, title: 'Cosmic Duality',     desc: 'Produce a VALID decryption of the Cosmic blob.',  check: s => s.attempts.some(a => a.blob === 'cosmic' && a.result === 'unlocked') },
];

const BY_ID = Object.fromEntries(ACHIEVEMENTS.map(a => [a.id, a]));
export const getAchievement = (id) => BY_ID[id];

export function newlyUnlocked(state) {
  return ACHIEVEMENTS.filter(a => !state.achievements[a.id] && safe(a.check, state));
}
function safe(fn, s) { try { return !!fn(s); } catch { return false; } }
