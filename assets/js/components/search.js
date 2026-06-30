// components/search.js — the advanced search/filter panel for #/tried and #/insights.
//
// A real little query language over the attempt catalog, plus faceted filter chips:
//   • plain words            → AND   (every word must appear somewhere)
//   • "quoted phrase"        → exact substring
//   • -word / -field:value   → exclude
//   • field:value            → scope to one field — phase: outcome: who: author: cat: title:
//                              method: input: output: insight:   (aliases: p o w a c t m in out i)
//   • a OR b                 → either side
//   • facet chips            → Phase · Outcome · Who · Author · Category (AND across groups, OR within)
//
// Everything is client-side over content/attempts.js. The view renders all entries once; this module
// shows/hides them, highlights matches, keeps a live count, and mirrors the state into the URL hash.

import { esc, qsa } from '../util.js';

const OUTCOME_ALIAS = {
  'verified-fail': 'fail failed verified-fail dead-end deadend ruled-out',
  'verified-insight': 'insight new-insight verified-insight gained',
  'unverified': 'unverified unv untested open',
};
const OUTCOME_LABEL = { 'verified-fail': 'Verified fail', 'verified-insight': 'Insight', 'unverified': 'Unverified' };
const PHASE_SHORT = { genesis: 'Phase 0', mrrobot: 'Phase 2', architect: 'Phase 3.2', salphaseion: 'Endgame' };

// ---- normalize one attempt into a searchable item ----
export function toItem(a, phaseLabel) {
  const author = (a.author || '').replace(/^@/, '');
  const whoTxt = a.who === 'community' ? 'community' : 'project this us me ours';
  const haystack = [a.title, a.input, a.method, a.output, a.insight, a.source, author, a.category, phaseLabel, PHASE_SHORT[a.phase]]
    .filter(Boolean).join('    ').toLowerCase();
  return {
    id: a.id, phase: a.phase, phaseLabel: phaseLabel || '', outcome: a.outcome, who: a.who,
    author, category: a.category || '', title: a.title || '',
    f: { phase: (a.phase + ' ' + (phaseLabel || '') + ' ' + (PHASE_SHORT[a.phase] || '')), outcome: (a.outcome + ' ' + (OUTCOME_ALIAS[a.outcome] || '')), who: whoTxt, author, category: a.category || '', title: a.title || '', method: a.method || '', input: a.input || '', output: a.output || '', insight: a.insight || '' },
    haystack,
  };
}

const FIELD = { p: 'phase', phase: 'phase', o: 'outcome', outcome: 'outcome', status: 'outcome', w: 'who', who: 'who', a: 'author', author: 'author', c: 'category', cat: 'category', category: 'category', t: 'title', title: 'title', m: 'method', method: 'method', in: 'input', input: 'input', out: 'output', output: 'output', i: 'insight', insight: 'insight' };

// ---- parse a query string into { test(item), highlight[] } ----
export function parseQuery(q) {
  const toks = [];
  const re = /(-?)(?:([a-zA-Z]+):)?(?:"([^"]*)"|(\S+))/g;
  let m;
  while ((m = re.exec(q || ''))) {
    const neg = m[1] === '-';
    const rawField = (m[2] || '').toLowerCase();
    const val = (m[3] != null ? m[3] : (m[4] || '')).trim();
    if (!val && !m[3]) continue;
    toks.push({ neg, field: FIELD[rawField] || (rawField ? '*' : ''), rawField, val });
  }
  // split into OR-groups on a bare "OR" token
  const groups = [[]];
  for (const t of toks) {
    if (!t.neg && !t.field && /^or$/i.test(t.val)) { if (groups[groups.length - 1].length) groups.push([]); continue; }
    groups[groups.length - 1].push(t);
  }
  const real = groups.filter(g => g.length);
  const highlight = [];
  for (const g of real) for (const t of g) if (!t.neg && t.val && (!t.field || t.field === 'title')) highlight.push(t.val.toLowerCase());

  const termHit = (item, t) => {
    let hay;
    if (t.field === '*') hay = item.f[t.rawField] != null ? item.f[t.rawField] : item.haystack; // unknown field → haystack
    else if (t.field) hay = item.f[t.field] != null ? item.f[t.field] : item.haystack;
    else hay = item.haystack;
    const has = hay.toLowerCase().includes(t.val.toLowerCase());
    return t.neg ? !has : has;
  };
  const test = real.length ? (item) => real.some(g => g.every(t => termHit(item, t))) : () => true;
  return { test, highlight, empty: !real.length };
}

// ---- highlight: wrap query terms in <mark> inside an element (text-only fields) ----
function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function highlightInto(el, terms) {
  if (!el) return;
  if (el.dataset.orig == null) el.dataset.orig = el.innerHTML;
  const base = el.dataset.orig;
  if (!terms.length) { el.innerHTML = base; return; }
  const re = new RegExp('(' + terms.filter(Boolean).map(escRe).join('|') + ')', 'gi');
  el.innerHTML = base.replace(re, '<mark>$1</mark>');   // fields are escaped plain text — no tags to corrupt
}

// ---- the facet model: groups built from the items present ----
function buildFacets(items, order) {
  const phases = order.phases.filter(p => items.some(i => i.phase === p));
  const authors = [...new Set(items.map(i => i.author).filter(Boolean))].sort();
  const cats = [...new Set(items.map(i => i.category).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  return {
    phase: { label: 'Phase', opts: phases.map(p => ({ v: p, label: PHASE_SHORT[p] || p, cls: 'fphase phase-' + p })) },
    outcome: { label: 'Outcome', opts: ['verified-insight', 'verified-fail', 'unverified'].filter(o => items.some(i => i.outcome === o)).map(o => ({ v: o, label: OUTCOME_LABEL[o] })) },
    who: { label: 'Source', opts: [{ v: 'community', label: 'community' }, { v: 'us', label: 'this project' }].filter(o => items.some(i => (o.v === 'community') === (i.who === 'community'))) },
    author: { label: 'The author', opts: authors.map(a => ({ v: a, label: '@' + a })) },
    category: { label: 'Category', opts: cats.map(c => ({ v: c, label: c })) },
  };
}

const HELP = `term  →  must appear      ·      "two words"  →  exact phrase      ·      -term  →  exclude
field:value  →  phase: outcome: who: author: cat: title: method: input: output: insight:
a OR b  →  either      ·      example:   blob -faed   author:CoruNethron   outcome:insight   "yin yang"`;

// ---- the panel UI ----
function panelHtml(facets) {
  const chip = (group, o) => `<button type="button" class="facet ${o.cls || ''}" data-group="${group}" data-val="${esc(o.v)}">${esc(o.label)}</button>`;
  const groupRow = (key) => {
    const g = facets[key]; if (!g.opts.length) return '';
    return `<div class="facet-group" data-fg="${key}"><span class="facet-label">${esc(g.label)}</span><div class="facet-chips">${g.opts.map(o => chip(key, o)).join('')}</div></div>`;
  };
  const primary = ['phase', 'outcome', 'who'].map(groupRow).join('');
  const more = ['author', 'category'].map(groupRow).join('');
  return `<div class="search" role="search">
    <div class="search-bar">
      <span class="search-ico" aria-hidden="true">🔎</span>
      <input class="search-in" type="search" autocomplete="off" spellcheck="false" placeholder="Search every input, method, output, insight…   ( / to focus )" aria-label="Search attempts">
      <button type="button" class="search-clear" title="Clear" aria-label="Clear search" hidden>✕</button>
      <span class="search-count" aria-live="polite"></span>
      <button type="button" class="search-help-btn" title="Search syntax" aria-label="Search syntax">?</button>
    </div>
    <div class="search-facets">${primary}
      ${more ? `<button type="button" class="search-more" aria-expanded="false">+ more filters</button><div class="search-more-box" hidden>${more}</div>` : ''}
      <button type="button" class="facet-reset" hidden>reset filters</button>
    </div>
    <pre class="search-help" hidden>${esc(HELP)}</pre>
    <div class="no-results" hidden>No attempts match — <button type="button" class="nr-clear">clear the search</button>.</div>
  </div>`;
}

// ---- wire it up against a view's DOM ----
// mode: 'tried' | 'insights'. host: the element to render the panel into.
export function initSearch(root, mode, items, order) {
  const host = root.querySelector('#search-host');
  if (!host) return;
  const facets = buildFacets(items, order);
  host.innerHTML = panelHtml(facets);
  const byId = new Map(items.map(i => [i.id, i]));

  const input = host.querySelector('.search-in');
  const clearBtn = host.querySelector('.search-clear');
  const countEl = host.querySelector('.search-count');
  const noRes = host.querySelector('.no-results');
  const moreBtn = host.querySelector('.search-more');
  const moreBox = host.querySelector('.search-more-box');
  const resetBtn = host.querySelector('.facet-reset');
  const helpBtn = host.querySelector('.search-help-btn');
  const helpEl = host.querySelector('.search-help');

  const state = { q: '', sel: { phase: new Set(), outcome: new Set(), who: new Set(), author: new Set(), category: new Set() } };

  // collect the entry elements + their highlightable fields per mode
  const entries = mode === 'tried'
    ? qsa('.tried-entry', root).map(el => ({ el, id: el.id.replace(/^t-/, ''), hi: [el.querySelector('.tried-head h4'), ...qsa('.tried-io dd', el)] }))
    : qsa('.sum-insights > li, .sum-alist li', root).map(el => ({ el, id: el.getAttribute('data-id') || '', hi: [el.querySelector('.sum-title'), el.querySelector('.sum-ins'), el.querySelector('a')].filter(Boolean) }));

  const facetTest = (item) => {
    const s = state.sel;
    if (s.phase.size && !s.phase.has(item.phase)) return false;
    if (s.outcome.size && !s.outcome.has(item.outcome)) return false;
    if (s.who.size) { const w = item.who === 'community' ? 'community' : 'us'; if (!s.who.has(w)) return false; }
    if (s.author.size && !s.author.has(item.author)) return false;
    if (s.category.size && !s.category.has(item.category)) return false;
    return true;
  };

  function apply() {
    const { test, highlight } = parseQuery(state.q);
    let shown = 0;
    for (const e of entries) {
      const item = byId.get(e.id);
      const ok = !!item && test(item) && facetTest(item);
      e.el.hidden = !ok;
      if (ok) { shown++; for (const h of e.hi) highlightInto(h, highlight); }
    }
    // roll up container visibility
    if (mode === 'tried') {
      qsa('.tried-cat', root).forEach(cat => {
        let any = false;
        for (let n = cat.nextElementSibling; n && !n.classList.contains('tried-cat'); n = n.nextElementSibling)
          if (n.classList.contains('tried-entry') && !n.hidden) { any = true; break; }
        cat.hidden = !any;
      });
      qsa('.tried-phase', root).forEach(ph => { ph.hidden = !qsa('.tried-entry', ph).some(en => !en.hidden); });
    } else {
      qsa('.sum-insights', root).forEach(ul => { ul.hidden = !qsa(':scope > li', ul).some(li => !li.hidden); });
      qsa('.sum-noins', root).forEach(d => { const any = qsa('.sum-alist li', d).some(li => !li.hidden); d.hidden = !any; });
      qsa('.sum-phase', root).forEach(ph => {
        const any = qsa('.sum-insights > li, .sum-alist li', ph).some(li => !li.hidden);
        // hide the "Insights gained" header too if its list is hidden
        qsa('.sum-h.sum-b', ph).forEach(h => { h.hidden = !qsa('.sum-insights > li', ph).some(li => !li.hidden); });
        ph.hidden = !any;
      });
    }
    const active = !!state.q.trim() || Object.values(state.sel).some(s => s.size);
    countEl.textContent = active ? `${shown} of ${entries.length}` : `${entries.length}`;
    countEl.classList.toggle('filtered', active);
    clearBtn.hidden = !state.q;
    resetBtn.hidden = !Object.values(state.sel).some(s => s.size);
    noRes.hidden = shown > 0 || !active;
    host.querySelectorAll('.facet').forEach(b => b.classList.toggle('on', state.sel[b.dataset.group].has(b.dataset.val)));
    syncHash();
  }

  // ---- URL hash sync (replaceState — no route reload) ----
  function syncHash() {
    const parts = [];
    if (state.q.trim()) parts.push('q=' + encodeURIComponent(state.q.trim()));
    for (const k of ['phase', 'outcome', 'who', 'author', 'category']) if (state.sel[k].size) parts.push(k + '=' + encodeURIComponent([...state.sel[k]].join('|')));
    const base = (location.hash.replace(/^#/, '').split('?')[0]) || '/' + mode;
    const next = '#' + base + (parts.length ? '?' + parts.join('&') : '');
    try { history.replaceState(null, '', next); } catch {}
  }
  function readHash() {
    const qpart = (location.hash.split('?')[1] || '');
    if (!qpart) return;
    const p = new URLSearchParams(qpart);
    state.q = p.get('q') || '';
    for (const k of ['phase', 'outcome', 'who', 'author', 'category']) {
      const v = p.get(k); state.sel[k] = new Set(v ? v.split('|').filter(Boolean) : []);
    }
    input.value = state.q;
    if ([...state.sel.author, ...state.sel.category].length && moreBox) { moreBox.hidden = false; moreBtn && moreBtn.setAttribute('aria-expanded', 'true'); }
  }

  // ---- events ----
  let timer = null;
  input.addEventListener('input', () => { state.q = input.value; clearTimeout(timer); timer = setTimeout(apply, 110); });
  input.addEventListener('keydown', (e) => { if (e.key === 'Escape') { input.value = ''; state.q = ''; apply(); } });
  clearBtn.addEventListener('click', () => { input.value = ''; state.q = ''; input.focus(); apply(); });
  host.querySelector('.nr-clear').addEventListener('click', () => { input.value = ''; state.q = ''; for (const k in state.sel) state.sel[k].clear(); apply(); });
  host.addEventListener('click', (e) => {
    const f = e.target.closest('.facet'); if (!f) return;
    const g = f.dataset.group, v = f.dataset.val; const s = state.sel[g];
    s.has(v) ? s.delete(v) : s.add(v); apply();
  });
  resetBtn.addEventListener('click', () => { for (const k in state.sel) state.sel[k].clear(); apply(); });
  if (moreBtn) moreBtn.addEventListener('click', () => { const open = moreBox.hidden; moreBox.hidden = !open; moreBtn.setAttribute('aria-expanded', String(open)); });
  helpBtn.addEventListener('click', () => { helpEl.hidden = !helpEl.hidden; });
  // press "/" anywhere to focus search (unless already typing)
  const slash = (e) => { if (e.key === '/' && !/^(INPUT|TEXTAREA)$/.test(document.activeElement && document.activeElement.tagName)) { e.preventDefault(); input.focus(); } };
  document.addEventListener('keydown', slash);

  readHash();
  apply();
  return { apply, destroy() { document.removeEventListener('keydown', slash); } };
}
