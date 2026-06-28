// presence.js — OPTIONAL live concurrent-viewer count via Firebase Realtime Database REST.
//
// Dormant unless ANALYTICS.firebaseDbUrl is set. No SDK, no key needed (RTDB REST is open to the
// rules you set). Each viewer writes a server-timestamp heartbeat under presence/<section>/<id>
// every 20s; "live now" = heartbeats newer than 45s. Best-effort delete on leave; stale entries
// simply age out of the window. Everything is wrapped so a misconfig can never break the page.
//
// Firebase setup (see docs/ANALYTICS.md): create a free project → Realtime Database → set rules:
//   { "rules": { "presence": { ".read": true, "$s": { "$id": { ".write": true } } } } }

import { ANALYTICS } from '../../content/analytics.js';

const DB = (ANALYTICS.firebaseDbUrl || '').replace(/\/$/, '');
const WINDOW = 45000, BEAT = 20000;

function clientId() {
  try { let id = sessionStorage.getItem('vc:cid'); if (!id) { id = (crypto.randomUUID ? crypto.randomUUID() : 'c' + Math.random().toString(36).slice(2) + Date.now()); sessionStorage.setItem('vc:cid', id); } return id; }
  catch { return 'c' + Math.random().toString(36).slice(2); }
}

let current = null;   // { key, timer, anchor, stopped }

async function put(path, body) { try { await fetch(`${DB}/${path}.json`, { method: 'PUT', body: JSON.stringify(body), keepalive: true }); } catch {} }
async function del(path) { try { await fetch(`${DB}/${path}.json`, { method: 'DELETE', keepalive: true }); } catch {} }

function render(anchor, n) {
  const el = anchor && anchor.querySelector('[data-vlive]');
  if (!el) return;
  if (n > 0) { el.hidden = false; el.innerHTML = `<span class="live-dot"></span> <b>${n}</b> viewing now`; }
  else { el.hidden = true; }
}

async function beat() {
  if (!current || current.stopped || !DB) return;
  const id = clientId(), key = current.key;
  await put(`presence/${key}/${id}`, { '.sv': 'timestamp' });
  try {
    const r = await fetch(`${DB}/presence/${key}.json`, { cache: 'no-store' });
    const data = (await r.json()) || {};
    const ts = Object.values(data).map(v => (typeof v === 'number' ? v : (v && v['.sv'] ? null : v))).filter(x => typeof x === 'number');
    const nowRef = ts.length ? Math.max(...ts) : 0;
    const live = ts.filter(t => t >= nowRef - WINDOW).length;
    render(current.anchor, live);
  } catch {}
}

export async function start(key, root) {
  if (!DB) return;
  // stop any previous section's presence
  if (current && current.key !== key) await stop();
  if (current && current.key === key) { current.anchor = root; return; }
  current = { key, anchor: root, timer: null, stopped: false };
  await beat();
  current.timer = setInterval(() => {
    if (!current || (current.anchor && !document.body.contains(current.anchor))) { stop(); return; }
    if (document.visibilityState === 'visible') beat();
  }, BEAT);
}

export async function stop() {
  if (!current) return;
  const { key, timer } = current; current.stopped = true; clearInterval(timer);
  const c = current; current = null;
  await del(`presence/${key}/${clientId()}`);
  return c;
}

// best-effort cleanup when the tab is closed/hidden
if (DB && typeof window !== 'undefined') {
  window.addEventListener('pagehide', () => { if (current) del(`presence/${current.key}/${clientId()}`); });
}
