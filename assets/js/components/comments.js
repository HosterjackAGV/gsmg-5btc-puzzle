// components/comments.js — anonymous, GitHub-persisted comments under each attempt.
//
// No login: people post under any name they like. The text is sent to the Cloudflare Worker
// (content/site.js → commentsUrl), which stores it in a Gist on GitHub — so every visitor sees the
// same threads. The page never holds a token. All user content is escaped on render (esc()).

import { SITE } from '../../../content/site.js';
import { esc, ago } from '../util.js';

const NAME_KEY = 'gsmg:cmt:name';
let cache = null;          // { [attemptId]: [ {u,t,ts} ] }
let loadState = 'idle';    // idle | loading | done | error
let loadPromise = null;

export const commentsEnabled = () => !!SITE.commentsUrl;

// The collapsible shell rendered under each attempt (counts + thread fill in on mount).
export function commentsHtml(id) {
  return `<details class="cmts" data-cmts="${esc(id)}">
    <summary class="cmts-sum">💬 Comments <span class="cmts-n"></span></summary>
    <div class="cmts-body">
      <ol class="cmts-list"><li class="cmts-empty faint">…</li></ol>
      <form class="cmts-form" autocomplete="off">
        <div class="cmts-row">
          <input class="cmts-name" type="text" maxlength="16" placeholder="name (optional)" aria-label="Your name (optional)">
          <input class="cmts-hp" type="text" tabindex="-1" autocomplete="off" aria-hidden="true">
        </div>
        <textarea class="cmts-text" rows="2" maxlength="1500" placeholder="Add a comment — no login, use any name…" aria-label="Your comment"></textarea>
        <div class="cmts-act"><span class="cmts-msg" aria-live="polite"></span><button type="submit" class="btn teal sm cmts-post">Post comment</button></div>
      </form>
    </div>
  </details>`;
}

function timeLabel(ts) {
  if (!ts) return '';
  try { return new Date(ts).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); }
  catch { return ago(ts); }
}
function renderList(listEl, arr) {
  if (!listEl) return;
  if (!arr || !arr.length) { listEl.innerHTML = '<li class="cmts-empty faint">No comments yet — be the first.</li>'; return; }
  listEl.innerHTML = arr.map(c => `<li class="cmt">
    <div class="cmt-head"><span class="cmt-u">${esc(c.u || 'anon')}</span><span class="cmt-t">${esc(timeLabel(c.ts))}</span></div>
    <div class="cmt-b">${esc(c.t || '').replace(/\n/g, '<br>')}</div></li>`).join('');
}

async function loadAll() {
  if (loadState === 'done') return cache;
  if (loadPromise) return loadPromise;
  loadState = 'loading';
  loadPromise = (async () => {
    try {
      const r = await fetch(SITE.commentsUrl, { cache: 'no-store' });
      const d = await r.json().catch(() => ({}));
      cache = (d && d.comments && typeof d.comments === 'object' && !Array.isArray(d.comments)) ? d.comments : {};
      loadState = r.ok ? 'done' : 'error';
    } catch { cache = {}; loadState = 'error'; }
    return cache;
  })();
  return loadPromise;
}

export function mountComments(root) {
  if (!root) return;
  const nodes = [...root.querySelectorAll('.cmts[data-cmts]')];
  if (!nodes.length) return;

  if (!commentsEnabled()) {
    nodes.forEach(d => {
      const list = d.querySelector('.cmts-list'); if (list) list.innerHTML = '';
      const form = d.querySelector('.cmts-form'); if (form) form.innerHTML = '<p class="faint" style="margin:0;font-size:13px">Comments aren’t connected yet.</p>';
    });
    return;
  }

  let savedName = ''; try { savedName = localStorage.getItem(NAME_KEY) || ''; } catch {}

  // fill counts + threads once data is in
  loadAll().then(all => {
    nodes.forEach(d => {
      const id = d.getAttribute('data-cmts');
      const arr = (all && all[id]) || [];
      const n = d.querySelector('.cmts-n'); if (n) n.textContent = arr.length ? '· ' + arr.length : '';
      renderList(d.querySelector('.cmts-list'), arr);
      if (loadState === 'error') { const m = d.querySelector('.cmts-msg'); if (m) { m.textContent = 'Couldn’t load existing comments — you can still post.'; m.className = 'cmts-msg err'; } }
    });
  });

  nodes.forEach(d => {
    if (d._cwired) return; d._cwired = true;
    const id = d.getAttribute('data-cmts');
    const form = d.querySelector('.cmts-form');
    const nameEl = d.querySelector('.cmts-name');
    const textEl = d.querySelector('.cmts-text');
    const hpEl = d.querySelector('.cmts-hp');
    const msg = d.querySelector('.cmts-msg');
    const btn = d.querySelector('.cmts-post');
    const list = d.querySelector('.cmts-list');
    const nBadge = d.querySelector('.cmts-n');
    if (nameEl && savedName) nameEl.value = savedName;
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = (textEl.value || '').trim();
      if (!text) { textEl.focus(); return; }
      const name = (nameEl.value || '').trim();
      try { if (name) localStorage.setItem(NAME_KEY, name); } catch {}
      btn.disabled = true; const ob = btn.textContent; btn.textContent = 'posting…';
      msg.textContent = ''; msg.className = 'cmts-msg';
      try {
        const r = await fetch(SITE.commentsUrl, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, name, text, hp: (hpEl && hpEl.value) || '' }),
        });
        const data = await r.json().catch(() => ({}));
        if (r.ok && data.comment) {
          cache = cache || {}; (cache[id] = cache[id] || []).push(data.comment);
          renderList(list, cache[id]);
          if (nBadge) nBadge.textContent = '· ' + cache[id].length;
          textEl.value = ''; msg.textContent = 'Posted ✓'; msg.className = 'cmts-msg ok';
          setTimeout(() => { if (msg.textContent === 'Posted ✓') msg.textContent = ''; }, 2600);
        } else {
          msg.textContent = data.error || ('Could not post (server ' + r.status + ').'); msg.className = 'cmts-msg err';
        }
      } catch { msg.textContent = 'Could not reach the comments server.'; msg.className = 'cmts-msg err'; }
      btn.disabled = false; btn.textContent = ob;
    });
  });
}
