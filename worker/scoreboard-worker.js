// scoreboard-worker.js — the GitHub-persisted, cheat-proof Snake scoreboard (Cloudflare Worker).
//
// • The board lives ON GITHUB, in a Gist — so it persists and is the SAME for every device & player.
// • The client submits a RECORDED GAME (seed + inputs), never a score. This Worker RE-SIMULATES the
//   game and computes the authoritative score itself, so a faked number can't get on the board.
// • Nothing is trusted on the player's device; the Worker is the only writer.
//
// SET UP (free; ~10 min — see docs/SCOREBOARD.md):
//   1. Create a GitHub Gist with one file `scoreboard.json` containing `[]`. Note its ID (in the URL).
//   2. Create a token with the **gist** scope only (classic) — it can touch nothing but gists.
//   3. Cloudflare → Workers & Pages → create a Worker, paste this file, Deploy.
//   4. Worker → Settings → Variables: add **secret** GH_TOKEN = your token; **var** GIST_ID = the id.
//   5. Put the worker URL into content/games.js → scoreboardUrl.
//   (Optional) Admin "erase scoreboard" button gated to one GitHub login: set GH_OAUTH_ID /
//   GH_OAUTH_SECRET / SITE_URL (+ optional ADMIN_LOGIN, default HosterjackAGV). See docs/SCOREBOARD.md.
//
// The simulation below is a verbatim copy of assets/js/games/snake-core.js — keep them in sync.

const N = 14, START_LEN = 3;
const SLOW_MS = 230, FAST_MS = 95, RAMP = 50;
const MAX_ENEMIES = 3, ENEMY_MOVE_SCORE = 100, AURA_MIN_MS = 1000, AURA_MAX_MS = 3000;
const POWERUP_EVERY = 60, MAX_TICKS = 250000, MAX_INPUTS = 200000;
const PU_TTL = { blue: 80, m2: 90, m4: 70, m8: 50, m16: 34, fefefe: 48, reset: 26 };
const MULTS = { m2: 2, m4: 4, m8: 8, m16: 16 };
const MULT_MS = 8000, SHIELD_MS = 6000;
const SEEDS = { plus3: { score: 3, grow: 1, persistMs: 6000 }, plus5: { score: 5, grow: 2, persistMs: 4000 }, plus10: { score: 10, grow: 3, persistMs: 3000 } };
const SEED_EVERY = 45, MAX_SEEDS = 2;
const speedMs = (s) => Math.round(Math.max(FAST_MS, SLOW_MS - (SLOW_MS - FAST_MS) * Math.min(1, s / RAMP)));
const enemyTTL = (s) => 34 + s * 4;
const enemySteps = (score, tick) => score >= 1000 ? 2 : score >= 500 ? 1 : score >= 200 ? (tick % 2 === 0 ? 1 : 0) : score >= ENEMY_MOVE_SCORE ? (tick % 3 === 0 ? 1 : 0) : 0;

const LORE = [
  ['blue', 5, 0], ['blue', 2, 1], ['blue', 10, 1], ['blue', 7, 2], ['blue', 4, 3], ['blue', 1, 4], ['blue', 3, 6],
  ['blue', 0, 7], ['blue', 5, 8], ['blue', 13, 8], ['blue', 2, 9], ['blue', 8, 11], ['blue', 1, 12], ['blue', 2, 13], ['blue', 10, 13],
  ['yellow', 13, 0], ['yellow', 9, 4], ['yellow', 6, 5], ['yellow', 10, 5], ['yellow', 11, 6], ['yellow', 12, 7], ['yellow', 6, 9], ['yellow', 7, 10], ['yellow', 9, 12],
  ['fefefe', 4, 7],
].map(([t, x, y]) => ({ t, x, y }));

function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const ri = (rng, n) => Math.floor(rng() * n);
const isShielded = (s) => s.timeMs < s.shieldExp;
function effMult(s) { let m = 1; for (const e of s.mults) if (e.exp > s.timeMs) m *= e.mult; return m; }
function occupied(s, x, y) { return s.snake.some(q => q.x === x && q.y === y) || s.enemies.some(e => e.x === x && e.y === y) || s.spawns.some(z => z.x === x && z.y === y) || (s.food && s.food.x === x && s.food.y === y) || s.powerups.some(p => p.x === x && p.y === y) || s.seeds.some(z => z.x === x && z.y === y); }
function placeFood(s) { let x, y, n = 0; do { x = ri(s.rng, N); y = ri(s.rng, N); n++; } while (occupied(s, x, y) && n < 500); s.food = { x, y }; }
function freeLore(s, type) { const pool = s.lore.filter(c => (!type || c.t === type) && !occupied(s, c.x, c.y)); return pool.length ? pool[ri(s.rng, pool.length)] : null; }
function spawnEnemy(s) { if (s.enemies.length + s.spawns.length >= MAX_ENEMIES) return; const c = freeLore(s); if (!c) return; const dir = [[1, 0], [-1, 0], [0, 1], [0, -1]][ri(s.rng, 4)]; const at = s.timeMs + AURA_MIN_MS + Math.floor(s.rng() * (AURA_MAX_MS - AURA_MIN_MS + 1)); s.spawns.push({ x: c.x, y: c.y, dir, born: s.timeMs, at }); }
function processSpawns(s) { if (!s.spawns.length) return; const ready = [], keep = []; for (const z of s.spawns) (s.timeMs >= z.at ? ready : keep).push(z); s.spawns = keep; for (const z of ready) { if (s.enemies.length >= MAX_ENEMIES) continue; if (occupied(s, z.x, z.y)) continue; s.enemies.push({ x: z.x, y: z.y, dir: z.dir, expires: s.tick + enemyTTL(s.score) }); } }
function dropPower(s, type, x, y) { s.powerups.push({ x, y, type, ttl: s.tick + (PU_TTL[type] || 70) }); }
function spawnPowerup(s) { if (s.powerups.length) return; const r = s.rng(); let type; if (s.score >= 10 && r < 0.02) type = 'reset'; else if (r < 0.10) type = 'fefefe'; else if (r < 0.30) type = 'blue'; else { const m = s.rng(); type = m < 0.7758 ? 'm2' : m < 0.9697 ? 'm4' : m < 0.99394 ? 'm8' : 'm16'; } const want = (type === 'reset' || type === 'fefefe') ? 'fefefe' : type === 'blue' ? 'blue' : 'yellow'; const c = freeLore(s, want) || freeLore(s); if (!c) return; s.powerups.push({ x: c.x, y: c.y, type, ttl: s.tick + (PU_TTL[type] || 70) }); }
function spawnSeed(s) { if (s.seeds.length >= MAX_SEEDS) return; if (s.rng() >= 0.5) return; const t = s.rng(); const type = t < 0.6 ? 'plus3' : t < 0.9 ? 'plus5' : 'plus10'; const def = SEEDS[type]; let x, y, n = 0; do { x = ri(s.rng, N); y = ri(s.rng, N); n++; } while (occupied(s, x, y) && n < 200); if (occupied(s, x, y)) return; s.seeds.push({ x, y, type, score: def.score, grow: def.grow, exp: s.timeMs + def.persistMs }); }
function applyInput(s, x, y) { if (s.status !== 'playing') return; const last = s.queue.length ? s.queue[s.queue.length - 1] : s.dir; if ((x === -last.x && y === -last.y) || (x === last.x && y === last.y)) return; if (s.queue.length >= 2) return; s.queue.push({ x, y }); }
function moveEnemies(s) {
  const shielded = isShielded(s);
  const survivors = [];
  for (const e of s.enemies) {
    if (s.rng() < 0.35) { const h = s.snake[0], sx = Math.sign(h.x - e.x) || 1, sy = Math.sign(h.y - e.y) || 1, tx = shielded ? -sx : sx, ty = shielded ? -sy : sy; e.dir = Math.abs(h.x - e.x) > Math.abs(h.y - e.y) ? [tx, 0] : [0, ty]; }
    let nx = e.x + e.dir[0], ny = e.y + e.dir[1];
    if (nx < 0 || nx >= N || ny < 0 || ny >= N) { e.dir = [-e.dir[0], -e.dir[1]]; nx = e.x + e.dir[0]; ny = e.y + e.dir[1]; }
    if (nx < 0 || nx >= N || ny < 0 || ny >= N) { survivors.push(e); continue; }
    if (s.snake[0].x === nx && s.snake[0].y === ny) { if (!shielded) { e.x = nx; e.y = ny; survivors.push(e); s.enemies = survivors; s.status = 'over'; return; } dropPower(s, 'm4', e.x, e.y); continue; }
    let hitBody = false;
    for (let i = 1; i < s.snake.length; i++) if (s.snake[i].x === nx && s.snake[i].y === ny) { hitBody = true; break; }
    if (hitBody) { dropPower(s, 'm2', nx, ny); continue; }
    e.x = nx; e.y = ny; survivors.push(e);
  }
  s.enemies = survivors;
}
function step(s) {
  if (s.status !== 'playing') return false;
  s.timeMs += speedMs(s.score); s.tick++;
  if (s.queue.length) s.dir = s.queue.shift();
  const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };
  const shielded = isShielded(s);
  if (head.x < 0 || head.x >= N || head.y < 0 || head.y >= N) { s.status = 'over'; return false; }
  if (s.snake.some(q => q.x === head.x && q.y === head.y) && !shielded) { s.status = 'over'; return false; }
  if (s.enemies.some(e => e.x === head.x && e.y === head.y)) { if (!shielded) { s.status = 'over'; return false; } s.enemies = s.enemies.filter(e => { if (e.x === head.x && e.y === head.y) { dropPower(s, 'm4', e.x, e.y); return false; } return true; }); }
  s.snake.unshift(head);
  const mult = effMult(s);
  let scoreGain = 0, growGain = 0, ateFood = false;
  if (s.food && head.x === s.food.x && head.y === s.food.y) { scoreGain += 1; growGain += 1; ateFood = true; }
  const si = s.seeds.findIndex(z => z.x === head.x && z.y === head.y);
  if (si >= 0) { const sd = s.seeds.splice(si, 1)[0]; scoreGain += sd.score; growGain += sd.grow; }
  if (scoreGain > 0) { const before = s.score; s.score += scoreGain * mult; const ne = Math.min(Math.floor(s.score / 3) - Math.floor(before / 3), MAX_ENEMIES); for (let i = 0; i < ne; i++) spawnEnemy(s); if (ateFood) placeFood(s); }
  s.grow += growGain;
  if (s.grow > 0) s.grow--; else s.snake.pop();
  const pi = s.powerups.findIndex(p => p.x === head.x && p.y === head.y);
  if (pi >= 0) { const p = s.powerups.splice(pi, 1)[0]; if (p.type === 'fefefe') { s.enemies = []; s.spawns = []; s.score += 5 * effMult(s); } else if (p.type === 'reset') { s.snake = s.snake.slice(0, START_LEN); s.grow = 0; } else if (p.type === 'blue') { s.shieldExp = s.timeMs + SHIELD_MS; } else if (MULTS[p.type]) { s.mults.push({ mult: MULTS[p.type], exp: s.timeMs + MULT_MS }); } }
  s.mults = s.mults.filter(e => e.exp > s.timeMs);
  s.powerups = s.powerups.filter(p => p.ttl > s.tick);
  s.seeds = s.seeds.filter(z => z.exp > s.timeMs);
  s.enemies = s.enemies.filter(e => e.expires > s.tick);
  const es = enemySteps(s.score, s.tick);
  for (let k = 0; k < es && s.status === 'playing'; k++) moveEnemies(s);
  if (s.status !== 'playing') return false;
  processSpawns(s);
  if (s.tick % POWERUP_EVERY === 0) spawnPowerup(s);
  if (s.tick % SEED_EVERY === 0) spawnSeed(s);
  return true;
}
function simulate(seed, inputs) {
  if (!Array.isArray(inputs) || inputs.length > MAX_INPUTS) return null;
  const s = { rng: mulberry32(seed >>> 0), lore: LORE, snake: [{ x: 7, y: 8 }, { x: 7, y: 9 }, { x: 7, y: 10 }], dir: { x: 0, y: -1 }, queue: [], food: null, enemies: [], spawns: [], powerups: [], seeds: [], score: 0, tick: 0, timeMs: 0, status: 'playing', grow: 0, mults: [], shieldExp: 0 };
  placeFood(s);
  let ip = 0;
  while (s.status === 'playing' && s.tick < MAX_TICKS) {
    while (ip < inputs.length && inputs[ip] && inputs[ip].t === s.tick) { applyInput(s, inputs[ip].dx | 0, inputs[ip].dy | 0); ip++; }
    step(s);
  }
  return { score: s.score, ticks: s.tick, timeMs: s.timeMs };
}

const cleanName = (s) => String(s || '').replace(/[<>&"']/g, '').replace(/\s+/g, ' ').trim().slice(0, 16) || 'anon';
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' };
const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'Content-Type': 'application/json', ...CORS } });

// ---- GitHub Gist persistence (the board lives on GitHub, shared by everyone) ----
const GH = (env) => ({ 'Authorization': 'Bearer ' + env.GH_TOKEN, 'User-Agent': 'gsmg-snake-scoreboard', 'Accept': 'application/vnd.github+json' });
async function readGist(env) {
  const file = env.GIST_FILE || 'scoreboard.json';
  const r = await fetch('https://api.github.com/gists/' + env.GIST_ID, { headers: GH(env) });
  if (!r.ok) throw new Error('gist read ' + r.status);
  const g = await r.json();
  const f = g.files && g.files[file];
  let board = []; try { board = JSON.parse((f && f.content) || '[]'); } catch {}
  return Array.isArray(board) ? board : [];
}
async function writeGist(env, board) {
  const file = env.GIST_FILE || 'scoreboard.json';
  const r = await fetch('https://api.github.com/gists/' + env.GIST_ID, {
    method: 'PATCH', headers: { ...GH(env), 'Content-Type': 'application/json' },
    body: JSON.stringify({ files: { [file]: { content: JSON.stringify(board) } } }),
  });
  if (!r.ok) throw new Error('gist write ' + r.status);
}

// ---- admin auth: GitHub OAuth, gated to a single login (default HosterjackAGV) ----
const ADMIN_LOGIN = (env) => env.ADMIN_LOGIN || 'HosterjackAGV';
const b64urlBytes = (bytes) => { let s = ''; for (const b of bytes) s += String.fromCharCode(b); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
const b64urlStr = (str) => b64urlBytes(new TextEncoder().encode(str));
function b64urlDecode(p) { const bin = atob(p.replace(/-/g, '+').replace(/_/g, '/')); const a = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i); return new TextDecoder().decode(a); }
async function hmac(secret, msg) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64urlBytes(new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(msg))));
}
async function mintToken(login, secret) {
  const payload = b64urlStr(JSON.stringify({ login, exp: Date.now() + 24 * 3600 * 1000 }));
  return payload + '.' + await hmac(secret, payload);
}
async function verifyToken(token, secret, adminLogin) {
  if (!token || !secret || token.indexOf('.') < 0) return null;
  const [payload, sig] = token.split('.');
  if (sig !== await hmac(secret, payload)) return null;            // tamper-proof: only the Worker can mint
  let p; try { p = JSON.parse(b64urlDecode(payload)); } catch { return null; }
  return (p && p.login === adminLogin && p.exp > Date.now()) ? p : null;
}
const htmlMsg = (msg, status = 200) => new Response('<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><body style="font-family:system-ui,sans-serif;background:#0b0e15;color:#e6ecf5;padding:48px 20px;text-align:center;line-height:1.6"><p>' + msg + '</p></body>', { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } });

function handleLogin(env, url) {
  if (!env.GH_OAUTH_ID) return htmlMsg('Admin login isn’t configured (set GH_OAUTH_ID / GH_OAUTH_SECRET / SITE_URL).', 503);
  const redirect = url.origin + '/auth/callback';
  const auth = 'https://github.com/login/oauth/authorize?client_id=' + encodeURIComponent(env.GH_OAUTH_ID) + '&scope=read:user&allow_signup=false&redirect_uri=' + encodeURIComponent(redirect);
  return Response.redirect(auth, 302);
}
async function handleCallback(env, url) {
  const code = url.searchParams.get('code');
  if (!code || !env.GH_OAUTH_ID || !env.GH_OAUTH_SECRET) return htmlMsg('Bad callback / admin login not configured.', 400);
  const tr = await fetch('https://github.com/login/oauth/access_token', { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'gsmg-snake-scoreboard' }, body: JSON.stringify({ client_id: env.GH_OAUTH_ID, client_secret: env.GH_OAUTH_SECRET, code }) });
  const at = (await tr.json().catch(() => ({}))).access_token;
  if (!at) return htmlMsg('GitHub login failed.');
  const ur = await fetch('https://api.github.com/user', { headers: { 'Authorization': 'Bearer ' + at, 'User-Agent': 'gsmg-snake-scoreboard', 'Accept': 'application/vnd.github+json' } });
  const u = await ur.json().catch(() => ({}));
  const admin = ADMIN_LOGIN(env);
  if (!u || u.login !== admin) return htmlMsg('Access denied — only <b>' + admin + '</b> can manage the scoreboard. (Signed in as ' + ((u && u.login) || 'unknown') + '.)', 403);
  const site = (env.SITE_URL || '').replace(/\/$/, '');
  if (!site) return htmlMsg('Logged in as ' + admin + ', but SITE_URL is not set on the Worker.');
  const token = await mintToken(u.login, env.GH_OAUTH_SECRET);
  return Response.redirect(site + '/?admin=' + encodeURIComponent(token) + '#/games', 302);
}
async function handleWipe(request, env) {
  if (!env.GH_TOKEN || !env.GIST_ID) return json({ error: 'scoreboard not configured' }, 503);
  const token = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
  if (!await verifyToken(token, env.GH_OAUTH_SECRET, ADMIN_LOGIN(env))) return json({ error: 'not authorized' }, 403);
  await writeGist(env, []);
  return json({ ok: true, board: [] });
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });
    const url = new URL(request.url), path = url.pathname;
    if (path === '/auth/login') return handleLogin(env, url);
    if (path === '/auth/callback') return handleCallback(env, url);
    if (path === '/wipe' && request.method === 'POST') return handleWipe(request, env);
    if (!env.GH_TOKEN || !env.GIST_ID) return json({ error: 'scoreboard not configured (set GH_TOKEN + GIST_ID)' }, 503);
    try {
      if (request.method === 'GET') return json({ board: (await readGist(env)).slice(0, 25) });
      if (request.method === 'POST') {
        let body; try { body = await request.json(); } catch { return json({ error: 'bad json' }, 400); }
        const { name, seed, inputs } = body || {};
        if (typeof seed !== 'number' || !Array.isArray(inputs) || inputs.length > 60000) return json({ error: 'bad replay' }, 400);
        const v = simulate(seed >>> 0, inputs);                    // ← the verification
        if (!v || v.score <= 0) return json({ error: 'replay did not produce a score' }, 400);
        const entry = { name: cleanName(name), score: v.score, timeMs: v.timeMs, date: Date.now() };
        const board = await readGist(env);                         // read-modify-write the Gist
        board.push(entry);
        board.sort((a, c) => c.score - a.score || a.timeMs - c.timeMs);
        const top = board.slice(0, 100);
        await writeGist(env, top);
        return json({ ok: true, board: top.slice(0, 25), rank: top.indexOf(entry) + 1, score: v.score, timeMs: v.timeMs });
      }
    } catch (e) { return json({ error: String(e && e.message || e) }, 502); }
    return json({ error: 'method' }, 405);
  },
};

// (Cloudflare only uses the default export; these are for the repo's determinism cross-check test.)
export { simulate, LORE };
