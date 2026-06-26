// games/divisions.js — skill divisions + async weekly tournaments. Pure ESM,
// shared by the browser AND the Node verifier (so brackets/seeds are identical).
//
// Model: your arcade points put you in a DIVISION (Bronze→Master). Each week,
// every player in a division is served the SAME seeded challenge at that
// division's difficulty level — so you compete only against close-level players,
// and the puzzles get harder as you climb. No backend: standings are rebuilt by
// the verifier from verified submissions, bucketed by (game, week, division).

export const DIVISIONS = [
  { key: 'bronze',  name: 'Bronze',  min: 0,    level: 2,  color: '#c2823f' },
  { key: 'silver',  name: 'Silver',  min: 700,  level: 4,  color: '#b9c2d0' },
  { key: 'gold',    name: 'Gold',    min: 1800, level: 6,  color: '#f2c14a' },
  { key: 'diamond', name: 'Diamond', min: 4000, level: 9,  color: '#5fd0e0' },
  { key: 'master',  name: 'Master',  min: 8000, level: 13, color: '#b388ff' },
];

export function divisionFor(points) {
  let d = DIVISIONS[0];
  for (const x of DIVISIONS) if ((points | 0) >= x.min) d = x;
  return d;
}
export const divisionByKey = (key) => DIVISIONS.find(d => d.key === key) || DIVISIONS[0];
export function nextDivision(key) { const i = DIVISIONS.findIndex(d => d.key === key); return DIVISIONS[i + 1] || null; }

/** ISO-8601 week string 'YYYY-Www' for a timestamp (ms). Deterministic; takes an
 *  explicit time so it can be tested and so the verifier/browser agree. */
export function weekId(ms) {
  const t = (ms == null) ? Date.now() : ms;
  const d = new Date(t);
  const u = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = (u.getUTCDay() + 6) % 7;            // Mon=0..Sun=6
  u.setUTCDate(u.getUTCDate() - day + 3);          // nearest Thursday
  const firstThu = new Date(Date.UTC(u.getUTCFullYear(), 0, 4));
  const week = 1 + Math.round(((u - firstThu) / 86400000 - 3 + ((firstThu.getUTCDay() + 6) % 7)) / 7);
  return u.getUTCFullYear() + '-W' + String(week).padStart(2, '0');
}

/** The shared challenge seed for a (game, week, division). */
export function weeklySeed(game, week, divKey) { return `tourney|${game}|${week}|${divKey}`; }

/** Parse a weekly seed back into its parts (verifier uses this to bucket). */
export function parseWeeklySeed(seed) {
  const m = /^tourney\|([^|]+)\|([^|]+)\|([^|]+)$/.exec(String(seed || ''));
  return m ? { game: m[1], week: m[2], division: m[3] } : null;
}

/** The level (difficulty) a division plays at for a given game. */
export function levelForDivision(divKey) { return divisionByKey(divKey).level; }
