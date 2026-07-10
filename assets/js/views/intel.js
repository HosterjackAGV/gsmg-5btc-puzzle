// views/intel.js — "The Three Books" (Creator Intel): the creator's direct logical rules
// (Rulebook), his coded hints + verified decodes (Hintbook), and every decoded-but-unused
// piece of the walkthrough (Openbook). Renders docs/CREATOR-INTEL.md (collapsible), builds a TOC.

import { renderMarkdown } from '../md.js';
import { qs, qsa, on, copy } from '../util.js';

export default async function intelView() {
  let md = '';
  try { const r = await fetch('docs/CREATOR-INTEL.md', { cache: 'no-store' }); if (r.ok) md = await r.text(); } catch {}
  const docHtml = md ? renderMarkdown(md)
    : '<div class="note warn"><h4>Creator Intel unavailable</h4><p>Could not load <span class="mono">docs/CREATOR-INTEL.md</span>. Serve over http (not file://).</p></div>';

  const html = `
  <section class="section"><div class="wrap">
    <div class="sec-head"><div class="sec-num">CREATOR INTEL</div><h2>The Three Books</h2>
      <p>Everything the puzzle's creator (<b>@SoWut / "Jrk Bgrt"</b>) has <b>directly</b> handed solvers — sieved from all <b>445</b> of his messages (2019–2026) and cross-checked against the confirmed walkthrough — split into three books: the <b>📕 Rulebook</b> (his direct logical constraints, with irony/banter quarantined), the <b>📗 Hintbook</b> (every hint he delivered in code + its verified decode), and the <b>📘 Openbook</b> (every decoded-but-unused piece of the whole walkthrough — the unspent ammunition for the open endgame). Everything is collapsible; open a book to read.</p>
      <div class="row" style="margin-top:6px">
        <a class="btn ghost sm" href="#/walkthrough">📖 Full walkthrough</a>
        <a class="btn ghost sm" href="#/reference">📋 Reference sheet</a>
        <a class="btn ghost sm" href="#/tried">🧪 What was tried</a>
      </div></div>

    <div class="wt-grid">
      <nav class="wt-toc" id="in-toc"></nav>
      <article class="md" id="in-doc">${docHtml}</article>
    </div>
  </div></section>`;

  function mount(root) {
    const doc = qs('#in-doc', root), toc = qs('#in-toc', root);
    on(root, 'click', '.copy', (e, b) => copy(b.dataset.copy, b));

    // table-of-contents from the top-level headings (the three books are h1/h2 with ids)
    if (doc && toc) {
      const heads = qsa('h1, h2', doc).filter(h => h.id);
      toc.innerHTML = `<div class="wt-toc-h">Contents</div>` +
        heads.map(h => `<button type="button" class="wt-toc-link wt-${h.tagName.toLowerCase()}" data-t="${h.id}">${h.textContent}</button>`).join('');
      on(toc, 'click', '.wt-toc-link', (e, b) => {
        const t = qs('#' + (window.CSS && CSS.escape ? CSS.escape(b.dataset.t) : b.dataset.t), root) || document.getElementById(b.dataset.t);
        if (t) {
          // open the enclosing <details> book so the target is visible, then scroll
          for (let p = t; p; p = p.parentElement) if (p.tagName === 'DETAILS') p.open = true;
          t.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  }

  return { title: 'The Three Books', html, mount };
}
