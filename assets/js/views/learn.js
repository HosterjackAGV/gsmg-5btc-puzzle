// views/learn.js — the crash course: lessons + inline interactive demos.

import { LESSONS } from '../../../content/lessons.js';
import * as store from '../store.js';
import { sha256Hex, decryptBlob, passFor, hasSecureCrypto } from '../crypto.js';
import { esc, on, qs, qsa, toast } from '../util.js';

export default async function learnView() {
  const done = store.state.lessons;
  const total = LESSONS.length;
  const doneN = LESSONS.filter(l => done[l.id]).length;

  const cards = LESSONS.map((l, i) => `
    <div class="step" data-lesson="${l.id}">
      <div class="head"><span class="n">${esc(l.ico)}</span>
        <span class="h">${esc(l.title)}</span>
        <span class="pill ${done[l.id] ? 'teal' : ''}" style="margin-left:auto">${done[l.id] ? '✓ done' : `${l.mins} min`}</span>
      </div>
      <div class="body">
        ${l.body}
        ${l.demo ? renderDemo(l.demo) : ''}
        <div class="row" style="margin-top:14px">
          <button class="btn sm ${done[l.id] ? 'ghost' : 'teal'}" data-done="${l.id}">${done[l.id] ? '✓ completed' : 'Mark complete'}</button>
          ${i < total - 1 ? `<button class="btn sm ghost" data-next="${i + 1}">Next lesson →</button>` : `<a class="btn sm gold" href="#/phase/phase-0">Open the first door →</a>`}
        </div>
      </div>
    </div>`).join('');

  const html = `
  <section class="section"><div class="wrap">
    <div class="sec-head"><div class="sec-num">CRASH COURSE</div><h2>Everything you need, from zero</h2>
      <p>No prior knowledge assumed — not of computers, cryptography, or Bitcoin. Six short lessons with everyday analogies and hands-on demos. Finish them and the whole puzzle will make sense.</p></div>
    <div class="row" style="margin-bottom:18px">
      <div class="ring" style="--p:${Math.round(doneN / total * 100)};width:64px;height:64px"><b style="font-size:15px">${doneN}/${total}</b></div>
      <p class="muted" style="margin:0">${doneN === total ? 'Course complete — you’re ready for anything in this puzzle.' : 'Tap a lesson to expand it. Your progress is saved in your browser.'}</p>
    </div>
    ${cards}
  </div></section>`;

  function mount(root) {
    on(root, 'click', '.step .head', (e, head) => head.parentElement.classList.toggle('open-step'));

    // lesson completion
    on(root, 'click', '[data-done]', (e, b) => {
      const id = b.dataset.done;
      store.completeLesson(id);
      b.classList.remove('teal'); b.classList.add('ghost'); b.textContent = '✓ completed';
      const pill = qs(`.step[data-lesson="${id}"] .head .pill`, root);
      if (pill) { pill.textContent = '✓ done'; pill.classList.add('teal'); }
      toast({ ico: '📚', title: 'Lesson complete', desc: '+ progress', ttl: 2200 });
    });

    // next lesson opener
    on(root, 'click', '[data-next]', (e, b) => {
      const steps = qsa('.step', root);
      const n = +b.dataset.next;
      steps.forEach(s => s.classList.remove('open-step'));
      if (steps[n]) { steps[n].classList.add('open-step'); steps[n].scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });

    // demo: hash
    const hgo = qs('#demo-h-go', root);
    if (hgo) {
      const run = async () => {
        const v = qs('#demo-h-in', root).value;
        const o = qs('#demo-h-out', root);
        if (!v) { o.className = 'cout show bad'; o.textContent = 'Type something.'; return; }
        o.className = 'cout show info'; o.textContent = await sha256Hex(v);
        store.state._hashed = (store.state._hashed | 0) + 1;
      };
      hgo.addEventListener('click', run);
      qs('#demo-h-in', root).addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
    }

    // demo: aes (open phase2 with causality)
    const ago = qs('#demo-a-go', root);
    if (ago) {
      ago.addEventListener('click', async () => {
        const v = qs('#demo-a-in', root).value.trim() || 'causality';
        const o = qs('#demo-a-out', root);
        if (!hasSecureCrypto) { o.className = 'cout show bad'; o.textContent = 'Live engine needs https/localhost.'; return; }
        ago.disabled = true; ago.textContent = '…';
        try {
          const text = await decryptBlob('phase2', await passFor(v, true));
          o.className = 'cout show ok'; o.textContent = `✓ Opened with sha256("${v}"):\n\n${text.slice(0, 500)}…`;
        } catch {
          o.className = 'cout show bad'; o.textContent = `✗ sha256("${v}") is not the key — invalid padding. (Hint: the word is “causality”.)`;
        } finally { ago.disabled = false; ago.textContent = 'Open the real box'; }
      });
    }
  }

  return { title: 'Crash course', html, mount };
}

function renderDemo(kind) {
  if (kind === 'hash') {
    return `<div class="console" style="margin-top:12px"><div class="crow">
      <input class="cin" id="demo-h-in" placeholder="type any word…" spellcheck="false" value="causality">
      <button class="btn teal" id="demo-h-go">Hash it</button></div>
      <div class="cout" id="demo-h-out"></div></div>`;
  }
  if (kind === 'aes') {
    return `<div class="console" style="margin-top:12px"><div class="crow">
      <input class="cin" id="demo-a-in" placeholder="causality" spellcheck="false" value="causality">
      <button class="btn gold" id="demo-a-go">Open the real box</button></div>
      <div class="cout" id="demo-a-out"></div></div>`;
  }
  return '';
}
