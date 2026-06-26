// util.js — tiny DOM + helper toolkit (no dependencies)

export const qs  = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

export const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g,
  c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));

// delegated event binding: on(root,'click','.btn',(e,el)=>{})
export const on = (root, ev, sel, fn) => root.addEventListener(ev, (e) => {
  const t = e.target.closest ? e.target.closest(sel) : null;
  if (t && root.contains(t)) fn(e, t);
});

export const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// normalize a free-text answer for comparison (lowercase, strip non-alphanumerics)
export const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
export const slug = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export function copy(text, btn) {
  const done = () => { if (btn) { btn.classList.add('done'); const o = btn.textContent; btn.textContent = 'copied'; setTimeout(() => { btn.classList.remove('done'); btn.textContent = o; }, 1100); } };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
  else fallbackCopy(text, done);
}
function fallbackCopy(text, done) {
  const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done && done(); } catch (e) {} ta.remove();
}

// short relative-time formatter
export function ago(ts) {
  if (!ts) return '—';
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return s + 's ago';
  const m = Math.floor(s / 60); if (m < 60) return m + 'm ago';
  const h = Math.floor(m / 60); if (h < 24) return h + 'h ago';
  const d = Math.floor(h / 24); if (d < 30) return d + 'd ago';
  return new Date(ts).toISOString().slice(0, 10);
}

// ---- toast notifications ----
export function toast({ ico = '✨', title = '', desc = '', kind = '', ttl = 4200 }) {
  let host = qs('#toasts');
  if (!host) { host = document.createElement('div'); host.id = 'toasts'; document.body.appendChild(host); }
  const el = document.createElement('div');
  el.className = 'toast ' + kind;
  el.innerHTML = `<div class="ico">${esc(ico)}</div><div><div class="t">${esc(title)}</div>${desc ? `<div class="d">${esc(desc)}</div>` : ''}</div>`;
  host.appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 320); }, ttl);
}

// ---- confetti burst ----
export function confetti(count = 90) {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const layer = document.createElement('div'); layer.className = 'confetti';
  const colors = ['#f2c14a', '#5f8cff', '#37d6a8', '#e76a4f', '#b388ff', '#ff7ab0'];
  for (let i = 0; i < count; i++) {
    const c = document.createElement('i');
    c.style.left = Math.random() * 100 + 'vw';
    c.style.background = colors[(Math.random() * colors.length) | 0];
    c.style.animationDuration = (1.6 + Math.random() * 1.8) + 's';
    c.style.animationDelay = (Math.random() * .5) + 's';
    c.style.transform = `rotate(${Math.random() * 360}deg)`;
    layer.appendChild(c);
  }
  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), 4200);
}

// render an array of {label,value} into a copyable ref table
export function refTable(rows) {
  return `<table class="ref"><tbody>${rows.map(r => `
    <tr><td class="lab">${esc(r.label)}</td>
    <td class="val break">${esc(r.value)}<button class="copy" data-copy="${esc(r.value)}">copy</button></td></tr>`).join('')}</tbody></table>`;
}
