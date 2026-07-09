// views/tried.js — "What Was Tried": the full catalog of every attempt to advance
// the endgame, grouped by phase then category, each with an outcome badge and an
// id anchor. Deep-linkable: #/tried/<id> scrolls to and highlights that entry.

import { ATTEMPTS, PHASE_LABELS, PHASE_ORDER, OUTCOMES, byPhase, FAMILIES } from '../../../content/attempts.js';
import { esc, qs, qsa } from '../util.js';
import { demoHtml, mountDemos } from '../components/demo.js';
import { toItem, initSearch, fmtDate } from '../components/search.js';
import { commentsHtml, mountComments } from '../components/comments.js';

function compactHtml(a, withDemo = true) {
  const o = OUTCOMES[a.outcome] || OUTCOMES['unverified'];
  const line = a.insight || a.output || '';
  return `<article class="tried-entry tried-compact" id="t-${esc(a.id)}">
    <div class="tc-row"><span class="tbadge ${o.cls} sm" title="${esc(o.desc)}">${o.label}</span><b class="tc-title">${esc(a.title)}</b>${a.author ? ` <span class="tbadge badge-author sm" title="The author">👤 ${esc(a.author)}</span>` : ''}${(a.authors && a.authors.length) ? a.authors.map(h => ` <span class="tbadge badge-author sm" title="Contributor">👤 ${esc(h)}</span>`).join('') : ''}${a.date ? ` <span class="sum-date">📅 ${esc(fmtDate(a))}</span>` : ''}</div>
    <div class="tc-line">${esc(line.length > 240 ? line.slice(0, 240) + '…' : line)}</div>
    <details class="tc-more"><summary>full history · input · method · output · evidence</summary>
      <dl class="tried-io">${a.history ? `<dt>History</dt><dd class="history-line">${esc(a.history)}</dd>` : ''}<dt>Input</dt><dd>${esc(a.input)}</dd><dt>Method</dt><dd>${esc(a.method)}</dd><dt>Output</dt><dd>${esc(a.output)}</dd>${a.evidence ? `<dt>Evidence</dt><dd class="evidence-line">${esc(a.evidence)}</dd>` : ''}${a.insight ? `<dt>Insight</dt><dd class="insight-line">${esc(a.insight)}</dd>` : ''}</dl>
      ${withDemo ? demoHtml(a.id) + commentsHtml(a.id) : ''}
    </details>
  </article>`;
}
function entryHtml(a) {
  if (a.compact) return compactHtml(a, true);
  const o = OUTCOMES[a.outcome] || OUTCOMES['unverified'];
  return `<article class="tried-entry" id="t-${esc(a.id)}">
    <div class="tried-head">
      <h4>${esc(a.title)}</h4>
      <span class="tbadge ${o.cls}" title="${esc(o.desc)}">${o.label}</span>
      ${a.author ? `<span class="tbadge badge-author" title="The author — the contributor who uncovered this (verified Telegram @handle)">👤 The author · ${esc(a.author)}</span>` : ''}
      ${(a.authors && a.authors.length) ? a.authors.map(h => `<span class="tbadge badge-author" title="Contributor / author of this attempt">👤 ${esc(h)}</span>`).join('') : ''}
    </div>
    <div class="tried-meta"><span class="who ${a.who === 'community' ? 'who-comm' : 'who-us'}">${a.who === 'community' ? 'community' : 'this project'}</span> · <span class="src">${esc(a.source)}</span>${a.date ? ` · <span class="tdate" title="when this attempt was made / recorded">📅 ${esc(fmtDate(a))}</span>` : ''}</div>
    <dl class="tried-io">
      ${a.history ? `<dt>History</dt><dd class="history-line">${esc(a.history)}</dd>` : ''}
      <dt>Input</dt><dd>${esc(a.input)}</dd>
      <dt>Method</dt><dd>${esc(a.method)}</dd>
      <dt>Output</dt><dd>${esc(a.output)}</dd>
      ${a.evidence ? `<dt>Evidence</dt><dd class="evidence-line">${esc(a.evidence)}</dd>` : ''}
      ${a.insight ? `<dt>Insight</dt><dd class="insight-line">${esc(a.insight)}</dd>` : ''}
    </dl>
    ${demoHtml(a.id)}
    ${commentsHtml(a.id)}
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
    const catHtml = Object.entries(cats).map(([cat, list]) => {
      const fam = FAMILIES[ph + ' :: ' + cat];
      if (fam && list.length > 3) {
        const labs = (Array.isArray(fam.lab) ? fam.lab : fam.lab ? [fam.lab] : []).map(demoHtml).join('');
        return `<h3 class="tried-cat">${esc(cat)} <span class="faint">· ${list.length} trials, folded</span></h3>
          <article class="tried-family">
            <div class="fam-blurb">${fam.blurb}</div>
            ${labs}
            <details class="fam-list"><summary>show the ${list.length} individual trials — each with its own “try it yourself”</summary>${list.map(a => compactHtml(a, true)).join('')}</details>
          </article>`;
      }
      return `<h3 class="tried-cat">${esc(cat)} <span class="faint">· ${list.length}</span></h3>${list.map(entryHtml).join('')}`;
    }).join('');
    return `<section class="tried-phase phase-card phase-${ph}"><div class="phase-tag">${({ genesis: 'Phase 0', mrrobot: 'Phase 2', architect: 'Phase 3.2', salphaseion: 'Endgame' })[ph] || ph}</div><h2 id="phase-${ph}">${esc(PHASE_LABELS[ph])} <span class="faint" style="font-size:14px">· ${items.length} attempts</span></h2>${catHtml}</section>`;
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
    <div id="search-host"></div>
    ${sections}
  </div></section>`;

  function mount(root) {
    mountDemos(root);
    try { mountComments(root); } catch (e) { console.error('comments', e); }
    try { initSearch(root, 'tried', ATTEMPTS.map(a => toItem(a, PHASE_LABELS[a.phase])), { phases: PHASE_ORDER }); } catch (e) { console.error('search', e); }
    if (focus) {
      const el = qs('#t-' + (window.CSS && CSS.escape ? CSS.escape(focus) : focus), root) || document.getElementById('t-' + focus);
      if (el) {
        for (let p = el.parentElement; p; p = p.parentElement) if (p.tagName === 'DETAILS') p.open = true;  // reveal folded/compact
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
