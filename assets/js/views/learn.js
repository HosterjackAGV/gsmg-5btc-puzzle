// views/learn.js — the crash course: lessons + inline INTERACTIVE demos.
// Every lesson is hands-on: hash avalanche, live OpenSSL key-derivation, a Beaufort
// tool, a WIF recognizer, and a chain stepper — all running the real crypto engine.

import { LESSONS } from '../../../content/lessons.js';
import { PHASES } from '../../../content/phases.js';
import * as store from '../store.js';
import { sha256Hex, decryptBlob, passFor, evpBytesToKey, saltOf, loadBlob, looksLikeWif, hasSecureCrypto } from '../crypto.js';
import { esc, on, qs, qsa, toast } from '../util.js';

const u8hex = (u8) => [...u8].map(b => b.toString(16).padStart(2, '0')).join('');

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
      <p>No prior knowledge assumed — not of computers, cryptography, or Bitcoin. Six short lessons, each with a <b>hands-on demo you can play with right here</b> (running the puzzle's real crypto). Finish them and the whole puzzle will make sense.</p></div>
    <div class="row" style="margin-bottom:18px">
      <div class="ring" style="--p:${Math.round(doneN / total * 100)};width:64px;height:64px"><b style="font-size:15px">${doneN}/${total}</b></div>
      <p class="muted" style="margin:0">${doneN === total ? 'Course complete — you’re ready for anything in this puzzle.' : 'Tap a lesson to expand it. Your progress is saved in your browser.'}</p>
    </div>
    ${cards}
  </div></section>`;

  function mount(root) {
    on(root, 'click', '.step .head', (e, head) => head.parentElement.classList.toggle('open-step'));

    on(root, 'click', '[data-done]', (e, b) => {
      const id = b.dataset.done;
      store.completeLesson(id);
      b.classList.remove('teal'); b.classList.add('ghost'); b.textContent = '✓ completed';
      const pill = qs(`.step[data-lesson="${id}"] .head .pill`, root);
      if (pill) { pill.textContent = '✓ done'; pill.classList.add('teal'); }
      toast({ ico: '📚', title: 'Lesson complete', desc: '+ progress', ttl: 2200 });
    });

    on(root, 'click', '[data-next]', (e, b) => {
      const steps = qsa('.step', root);
      const n = +b.dataset.next;
      steps.forEach(s => s.classList.remove('open-step'));
      if (steps[n]) { steps[n].classList.add('open-step'); steps[n].scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });

    wireHash(root); wireAes(root); wireSalt(root); wireCiphers(root); wireBitcoin(root); wireChain(root);
  }

  return { title: 'Crash course', html, mount };
}

// ===================== demo markup =====================
function renderDemo(kind) {
  if (kind === 'hash') {
    return `<div class="demo"><div class="console"><div class="crow">
      <input class="cin" id="demo-h-in" placeholder="type any word…" spellcheck="false" value="causality">
      <button class="btn teal" id="demo-h-go">Hash it</button></div>
      <div class="cout" id="demo-h-out"></div>
      <div id="demo-h-aval" class="demo-aval"></div></div>
      <p class="cnote">Type and watch the 64-character fingerprint. Change one letter and see how much of it changes.</p></div>`;
  }
  if (kind === 'aes') {
    return `<div class="demo"><div class="console"><div class="crow">
      <input class="cin" id="demo-a-in" placeholder="causality" spellcheck="false" value="causality">
      <button class="btn gold" id="demo-a-go">Open the real box</button>
      <button class="btn ghost" id="demo-a-wrong">Try a wrong key</button></div>
      <div class="cout" id="demo-a-out"></div></div>
      <p class="cnote">This decrypts the genuine Phase-2 blob in your browser. The right key opens it; any other gives a clean “invalid padding”.</p></div>`;
  }
  if (kind === 'salt') {
    return `<div class="demo"><div class="console"><div class="crow">
      <input class="cin" id="demo-s-pw" placeholder="passphrase" spellcheck="false" value="causality">
      <input class="cin" id="demo-s-salt" placeholder="salt (hex)" spellcheck="false" value="06286612d43ed7ed">
      <button class="btn teal" id="demo-s-go">Derive the key</button></div>
      <div class="cout" id="demo-s-out"></div>
      <div class="row" style="margin-top:8px"><button class="btn ghost sm" id="demo-s-real">Pull a real blob’s salt</button></div></div>
      <p class="cnote">This is OpenSSL’s <span class="mono">EVP_BytesToKey</span> with SHA-256 — turning a word + salt into the 32-byte AES key and 16-byte IV. Change the salt and the key changes completely.</p></div>`;
  }
  if (kind === 'ciphers') {
    return `<div class="demo"><div class="console"><div class="crow">
      <input class="cin" id="demo-c-txt" placeholder="text (A–Z)" spellcheck="false" value="HALFANDBETTERHALF">
      <input class="cin" id="demo-c-key" placeholder="key" spellcheck="false" value="THEMATRIXHASYOU">
      <button class="btn teal" id="demo-c-go">Beaufort it</button></div>
      <div class="cout" id="demo-c-out"></div></div>
      <p class="cnote">Beaufort is <b>reciprocal</b> — encrypting twice returns the original. Now play the real ciphers as scaling games:
      <a class="btn ghost sm" href="#/arcade/vigenere">🔑 Vigenère</a> <a class="btn ghost sm" href="#/arcade/straddle">🏁 Checkerboard</a></p></div>`;
  }
  if (kind === 'bitcoin') {
    return `<div class="demo"><div class="console"><div class="crow">
      <input class="cin" id="demo-b-in" placeholder="paste a string…" spellcheck="false" value="5HpHagT65TZzG1PH3CSu63k8DbpvD8s5ip4nEB3kEsreAnchuDf">
      <button class="btn teal" id="demo-b-go">Is it a key?</button></div>
      <div class="cout" id="demo-b-out"></div></div>
      <p class="cnote">A solve produces a <b>WIF</b> private key (starts with 5/K/L). The pre-filled string is a famous example key — try pasting other text and see it rejected. (The real prize key is unknown — that’s the whole point.)</p></div>`;
  }
  if (kind === 'chain') {
    const rail = PHASES.map((p, i) => `${i ? '<span class="chain-arrow">→</span>' : ''}<a class="chain-chip ${p.status}" href="#/phase/${p.id}">${esc(p.codename)}</a>`).join('');
    return `<div class="demo"><div class="console"><div class="crow">
      <input class="cin" id="demo-ch-in" placeholder="an answer…" spellcheck="false" value="theflowerblossomsthroughwhatseemstobeaconcretesurface">
      <button class="btn teal" id="demo-ch-go">answer → key</button></div>
      <div class="cout" id="demo-ch-out"></div></div>
      <div class="chain-rail">${rail}</div>
      <p class="cnote">Each answer is hashed into the key for the next box. The chain is solid through Phase 3.2; the green doors are solved, gold is the live frontier.</p></div>`;
  }
  return '';
}

// ===================== demo wiring =====================
function wireHash(root) {
  const go = qs('#demo-h-go', root); if (!go) return;
  const inp = qs('#demo-h-in', root), out = qs('#demo-h-out', root), av = qs('#demo-h-aval', root);
  const run = async () => {
    const v = inp.value;
    if (!v) { out.className = 'cout show bad'; out.textContent = 'Type something.'; av.innerHTML = ''; return; }
    const h = await sha256Hex(v);
    out.className = 'cout show info'; out.textContent = h;
    store.state._hashed = (store.state._hashed | 0) + 1;
    const last = v[v.length - 1];
    const v2 = /[a-zA-Z]/.test(last) ? v.slice(0, -1) + String.fromCharCode(v.charCodeAt(v.length - 1) ^ 32) : v + '!';
    const h2 = await sha256Hex(v2);
    let diff = 0, spans = '';
    for (let i = 0; i < 64; i++) { const d = h[i] !== h2[i]; if (d) diff++; spans += `<span class="hx${d ? ' diff' : ''}">${h2[i]}</span>`; }
    av.innerHTML = `<div class="faint" style="font-size:12px;margin:8px 0 4px">one character changed — <span class="mono">${esc(v)}</span> → <span class="mono">${esc(v2)}</span>:</div><div class="hash-hex">${spans}</div><div style="font-size:12.5px;margin-top:6px"><b class="gold">${diff}/64</b> digits flipped from a single-character change — the avalanche effect.</div>`;
  };
  go.addEventListener('click', run);
  inp.addEventListener('input', run);
  run();
}

function wireAes(root) {
  const go = qs('#demo-a-go', root); if (!go) return;
  const inp = qs('#demo-a-in', root), out = qs('#demo-a-out', root), wrong = qs('#demo-a-wrong', root);
  const open = async (val) => {
    if (!hasSecureCrypto) { out.className = 'cout show bad'; out.textContent = 'Live engine needs https/localhost.'; return; }
    go.disabled = true;
    try {
      const text = await decryptBlob('phase2', await passFor(val, true));
      out.className = 'cout show ok'; out.textContent = `✓ Opened with sha256("${val}"):\n\n${text.slice(0, 500)}…`;
    } catch {
      out.className = 'cout show bad'; out.textContent = `✗ sha256("${val}") is not the key — invalid padding, a clean “nope”. (The word is “causality”.)`;
    } finally { go.disabled = false; }
  };
  go.addEventListener('click', () => open(inp.value.trim() || 'causality'));
  if (wrong) wrong.addEventListener('click', () => open('wrongkey'));
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') open(inp.value.trim() || 'causality'); });
}

function wireSalt(root) {
  const go = qs('#demo-s-go', root); if (!go) return;
  const out = qs('#demo-s-out', root);
  const derive = async () => {
    const pw = qs('#demo-s-pw', root).value;
    const saltHex = (qs('#demo-s-salt', root).value.match(/[0-9a-fA-F]/g) || []).join('');
    if (!hasSecureCrypto) { out.className = 'cout show bad'; out.textContent = 'Live engine needs https/localhost.'; return; }
    const salt = new Uint8Array((saltHex.match(/../g) || []).map(h => parseInt(h, 16)));
    const { key, iv } = await evpBytesToKey(new TextEncoder().encode(pw), salt);
    out.className = 'cout show ok';
    out.innerHTML = `<div class="kv2"><span>passphrase</span><b>${esc(pw) || '(empty)'}</b></div>
      <div class="kv2"><span>salt</span><b class="mono">${esc(saltHex) || '(none)'}</b></div>
      <div class="kv2"><span>→ AES-256 key</span><b class="mono gold break">${u8hex(key)}</b></div>
      <div class="kv2"><span>→ IV</span><b class="mono blue break">${u8hex(iv)}</b></div>`;
  };
  go.addEventListener('click', derive);
  const real = qs('#demo-s-real', root);
  if (real) real.addEventListener('click', async () => {
    try { const s = saltOf(await loadBlob('phase2')); qs('#demo-s-salt', root).value = s; out.className = 'cout show info'; out.textContent = `The real Phase-2 blob decodes to bytes starting "Salted__", with salt = ${s}. Now hit “Derive the key”.`; }
    catch { out.className = 'cout show bad'; out.textContent = 'Could not fetch the blob (needs the live site or a local server).'; }
  });
  derive();
}

function beaufort(text, key) {
  const T = text.toUpperCase().replace(/[^A-Z]/g, ''); const K = key.toUpperCase().replace(/[^A-Z]/g, '');
  if (!K) return T;
  let out = '';
  for (let i = 0; i < T.length; i++) out += String.fromCharCode(((K.charCodeAt(i % K.length) - 65) - (T.charCodeAt(i) - 65) + 26) % 26 + 65);
  return out;
}
function wireCiphers(root) {
  const go = qs('#demo-c-go', root); if (!go) return;
  const out = qs('#demo-c-out', root);
  const run = () => {
    const txt = qs('#demo-c-txt', root).value, key = qs('#demo-c-key', root).value;
    const ct = beaufort(txt, key), back = beaufort(ct, key);
    out.className = 'cout show ok';
    out.innerHTML = `<div class="kv2"><span>plaintext</span><b class="mono">${esc(txt.toUpperCase().replace(/[^A-Z]/g, ''))}</b></div>
      <div class="kv2"><span>key</span><b class="mono">${esc(key.toUpperCase().replace(/[^A-Z]/g, ''))}</b></div>
      <div class="kv2"><span>Beaufort →</span><b class="mono gold">${esc(ct)}</b></div>
      <div class="kv2"><span>again →</span><b class="mono teal">${esc(back)}</b></div>`;
  };
  go.addEventListener('click', run);
  qs('#demo-c-txt', root).addEventListener('input', run);
  qs('#demo-c-key', root).addEventListener('input', run);
  run();
}

function wireBitcoin(root) {
  const go = qs('#demo-b-go', root); if (!go) return;
  const inp = qs('#demo-b-in', root), out = qs('#demo-b-out', root);
  const run = () => {
    const v = inp.value.trim();
    if (!v) { out.className = 'cout show bad'; out.textContent = 'Paste a string.'; return; }
    if (looksLikeWif(v)) { out.className = 'cout show ok'; out.textContent = `✓ This looks like a Bitcoin WIF private key — it starts with “${v[0]}” and is base58. Decrypt the final box and a string like this should fall out.`; }
    else { out.className = 'cout show bad'; out.textContent = '✗ Not a WIF. A WIF private key starts with 5, K, or L and is ~51–52 base58 characters (no 0, O, I, or l).'; }
  };
  go.addEventListener('click', run);
  inp.addEventListener('input', run);
  run();
}

function wireChain(root) {
  const go = qs('#demo-ch-go', root); if (!go) return;
  const inp = qs('#demo-ch-in', root), out = qs('#demo-ch-out', root);
  const run = async () => {
    const v = inp.value.trim(); if (!v) { out.className = 'cout show bad'; out.textContent = 'Type an answer.'; return; }
    const k = await sha256Hex(v);
    out.className = 'cout show info';
    out.innerHTML = `<span class="gold">${esc(v.slice(0, 40))}${v.length > 40 ? '…' : ''}</span>  <span class="faint">— sha256 →</span>  <span class="blue break">${k}</span>\n<span class="faint">…and that key is what unlocks the next box.</span>`;
  };
  go.addEventListener('click', run);
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
  run();
}
