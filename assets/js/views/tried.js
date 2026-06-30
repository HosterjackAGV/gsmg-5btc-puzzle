// views/tried.js — "What Was Tried": the full catalog of every attempt to advance
// the endgame, grouped by phase then category, each with an outcome badge and an
// id anchor. Deep-linkable: #/tried/<id> scrolls to and highlights that entry.

import { ATTEMPTS, PHASE_LABELS, PHASE_ORDER, OUTCOMES, byPhase } from '../../../content/attempts.js';
import { esc, qs, qsa } from '../util.js';
import { demoHtml, mountDemos } from '../components/demo.js';

function entryHtml(a) {
  const o = OUTCOMES[a.outcome] || OUTCOMES['unverified'];
  return `<article class="tried-entry" id="t-${esc(a.id)}">
    <div class="tried-head">
      <h4>${esc(a.title)}</h4>
      <span class="tbadge ${o.cls}" title="${esc(o.desc)}">${o.label}</span>
      ${a.author ? `<span class="tbadge badge-author" title="The author — the contributor who uncovered this (verified Telegram @handle)">👤 The author · ${esc(a.author)}</span>` : ''}
    </div>
    <div class="tried-meta"><span class="who ${a.who === 'community' ? 'who-comm' : 'who-us'}">${a.who === 'community' ? 'community' : 'this project'}</span> · <span class="src">${esc(a.source)}</span></div>
    <dl class="tried-io">
      <dt>Input</dt><dd>${esc(a.input)}</dd>
      <dt>Method</dt><dd>${esc(a.method)}</dd>
      <dt>Output</dt><dd>${esc(a.output)}</dd>
      ${a.insight ? `<dt>Insight</dt><dd class="insight-line">${esc(a.insight)}</dd>` : ''}
    </dl>
    ${demoHtml(a.id)}
  </article>`;
}

export default async function triedView(ctx = {}) {
  const focus = ctx.params && ctx.params.id;
  const total = ATTEMPTS.length;
  const counts = {
    'verified-fail': ATTEMPTS.filter(a => a.outcome === 'verified-fail').length,
    'verified-insight': ATTEMPTS.filter(a => a.outcome === 'verified-insight').length,
    'unverified': ATTEMPTS.filter(a => a.outcome === 'unverified').length,
  };

  const sections = PHASE_ORDER.map(ph => {
    const items = byPhase(ph);
    if (!items.length) return '';
    const cats = {};
    for (const a of items) (cats[a.category] = cats[a.category] || []).push(a);
    const catHtml = Object.entries(cats).map(([cat, list]) =>
      `<h3 class="tried-cat">${esc(cat)} <span class="faint">· ${list.length}</span></h3>${list.map(entryHtml).join('')}`
    ).join('');
    return `<section class="tried-phase"><h2 id="phase-${ph}">${esc(PHASE_LABELS[ph])} <span class="faint" style="font-size:14px">· ${items.length} attempts</span></h2>${catHtml}</section>`;
  }).join('');

  const html = `
  <section class="section"><div class="wrap">
    <div class="sec-head"><div class="sec-num">WHAT WAS TRIED</div><h2>Every attempt to move the puzzle forward</h2>
      <p>A complete, human-readable catalog of <b>everything</b> the community and this project have tried to break the open endgame — the exact input, the method, and the output of each, so no one re-walks a dead end. Each entry is badged by outcome and grouped by the phase it belongs to. The walkthrough's per-phase <b>"What was tried to move forward"</b> panels deep-link here.</p>
      <div class="row" style="margin-top:8px;gap:8px;flex-wrap:wrap">
        <span class="tbadge badge-fail">${counts['verified-fail']} verified fail</span>
        <span class="tbadge badge-insight">${counts['verified-insight']} verified — new insight</span>
        <span class="tbadge badge-unverified">${counts['unverified']} unverified</span>
        <span class="faint" style="align-self:center">· ${total} total</span>
      </div>
      ${total === 0 ? '<div class="note warn" style="margin-top:14px"><h4>Catalog loading…</h4><p>The attempts data could not load. Serve over http.</p></div>' : ''}
    </div>
    ${sections}
  </div></section>`;

  function mount(root) {
    mountDemos(root);
    if (focus) {
      const el = qs('#t-' + (window.CSS && CSS.escape ? CSS.escape(focus) : focus), root) || document.getElementById('t-' + focus);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('tried-focus');
          setTimeout(() => el.classList.remove('tried-focus'), 2600);
        }, 60);
      }
    }
  }

  return { title: 'What was tried', html, mount };
}
