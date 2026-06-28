// counter.js — privacy-friendly view counts (+ optional live viewers), all client-side.
//
// • Per-section + total view counts via a free, keyless counter (Abacus → CounterAPI fallback).
//   One counted view per section per browser session (sessionStorage-deduped) so a refresh spree
//   can't inflate it; revisits just re-read and display. Stores only a number — no personal data.
// • Optional GoatCounter pageview tracking (your private dashboard) if a code is configured.
// • Optional live concurrent-viewer count via Firebase Realtime DB REST presence, if a URL is set.
//
// Designed to never block render and never throw into the page.

import { ANALYTICS, SECTION_LABELS, SECTION_ORDER, sectionKey } from '../../content/analytics.js';
import { esc, qs } from './util.js';

const NS = ANALYTICS.keylessNamespace;
const mem = new Map();                                   // key -> count (in-session cache)
const fmt = (n) => n == null ? '—' : Number(n).toLocaleString('en-US');

async function fetchJSON(url, opts, ms = 9000) {
  const ac = new AbortController(); const to = setTimeout(() => ac.abort(), ms);
  try { const r = await fetch(url, { ...opts, signal: ac.signal, cache: 'no-store', mode: 'cors' }); if (!r.ok) throw new Error(r.status); return await r.json(); }
  finally { clearTimeout(to); }
}

// ---- keyless counter providers (primary: Abacus, fallback: CounterAPI) ----
async function providerHit(key) {
  try { const d = await fetchJSON(`https://abacus.jasoncameron.dev/hit/${NS}/${key}`); if (typeof d.value === 'number') return d.value; } catch {}
  try { const d = await fetchJSON(`https://api.counterapi.dev/v1/${NS}/${key}/up`); if (typeof d.count === 'number') return d.count; } catch {}
  return null;
}
async function providerGet(key) {
  try { const d = await fetchJSON(`https://abacus.jasoncameron.dev/get/${NS}/${key}`); if (typeof d.value === 'number') return d.value; } catch {}
  try { const d = await fetchJSON(`https://api.counterapi.dev/v1/${NS}/${key}/`); if (typeof d.count === 'number') return d.count; } catch {}
  return null;
}

// count once per section per session; otherwise just read the current value
async function countOrRead(key) {
  const flag = 'vc:seen:' + key;
  let seen = false; try { seen = !!sessionStorage.getItem(flag); } catch {}
  let val;
  if (seen) { val = await providerGet(key); }
  else {
    try { sessionStorage.setItem(flag, '1'); } catch {}
    val = await providerHit(key);
    providerHit('total').catch(() => {});             // keep the site-wide total in step
  }
  if (val != null) mem.set(key, val);
  return val != null ? val : (mem.has(key) ? mem.get(key) : null);
}

// ---- badge rendering ----
function badge(n) {
  return `<span class="viewcount" title="Section views — a privacy-friendly, cookieless counter">👁 <b>${n == null ? '…' : fmt(n)}</b> views</span>`;
}
function injectSectionBadge(root, n) {
  const head = qs('.sec-head', root) || qs('.hero .wrap', root) || qs('.wrap', root);
  if (!head || qs('[data-vc]', head)) { const e = qs('[data-vc]', root); if (e) e.innerHTML = badge(n); return; }
  const el = document.createElement('div');
  el.className = 'vc-wrap'; el.setAttribute('data-vc', '');
  el.innerHTML = badge(n) + (ANALYTICS.firebaseDbUrl ? ' <span class="viewlive" data-vlive hidden></span>' : '');
  // place it at the very top of the section header
  if (head.classList.contains('sec-head')) head.insertBefore(el, head.firstChild);
  else head.appendChild(el);
}

async function renderHomeStats(root) {
  const host = qs('.hero .wrap', root) || qs('.sec-head', root); if (!host) return;
  if (!qs('[data-vc-home]', host)) {
    const el = document.createElement('div'); el.className = 'vc-home'; el.setAttribute('data-vc-home', '');
    el.innerHTML = `<span class="vc-total">👁 <b>…</b> total views</span><span class="vc-break"></span>`;
    const h1 = qs('h1', host); if (h1 && h1.nextSibling) host.insertBefore(el, h1.nextSibling); else host.appendChild(el);
  }
  const wrap = qs('[data-vc-home]', host);
  const total = await providerGet('total');
  const tEl = qs('.vc-total b', wrap); if (tEl) tEl.textContent = total == null ? '—' : fmt(total);
  // small per-section breakdown
  const counts = await Promise.all(SECTION_ORDER.map(k => providerGet(k).then(v => ({ k, v })).catch(() => ({ k, v: null }))));
  const brk = counts.filter(c => c.v != null).map(c => `<span class="vc-chip">${esc(SECTION_LABELS[c.k] || c.k)} <b>${fmt(c.v)}</b></span>`).join('');
  const bEl = qs('.vc-break', wrap); if (bEl) bEl.innerHTML = brk;
}

// ---- optional GoatCounter (private dashboard) ----
let gcReady = false;
function ensureGoatCounter() {
  if (!ANALYTICS.goatcounterCode || gcReady) return;
  gcReady = true;
  window.goatcounter = { no_onload: true };            // we count manually per hash-route
  const s = document.createElement('script');
  s.async = true; s.dataset.goatcounter = `https://${ANALYTICS.goatcounterCode}.goatcounter.com/count`;
  s.src = '//gc.zgo.at/count.js';
  document.head.appendChild(s);
}
function goatCount(path, key) {
  if (!ANALYTICS.goatcounterCode) return;
  ensureGoatCounter();
  const send = () => { try { window.goatcounter && window.goatcounter.count && window.goatcounter.count({ path, title: SECTION_LABELS[key] || key }); } catch {} };
  if (window.goatcounter && window.goatcounter.count) send(); else setTimeout(send, 1500);
}

// ---- optional live viewers (Firebase Realtime DB REST presence) ----
import * as presence from './presence.js';

// ---- public entry, called on every route change ----
export async function track(path, root) {
  if (!ANALYTICS.showCounts || !root) return;
  const key = sectionKey(path);
  goatCount('/' + (key === 'home' ? '' : key), key);
  try {
    const n = await countOrRead(key);                 // count/read this section once per session
    if (key === 'home') renderHomeStats(root).catch(() => {});   // hero: total + per-section breakdown
    else injectSectionBadge(root, n);                 // section header: "👁 N views"
    if (ANALYTICS.firebaseDbUrl) presence.start(key, root).catch(() => {});
  } catch {}
}
