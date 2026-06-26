// views/phase.js — renders any phase from data: story, lessons, step-by-step,
// the live interactive door, reference values, and personal notes.

import { getPhase, PHASES, phaseIndex, isUnlocked } from '../../../content/phases.js';
import * as store from '../store.js';
import { sha256Hex, decryptBlob, tryBlob, passFor, attemptId, looksLikeWif, hasSecureCrypto } from '../crypto.js';
import { esc, on, qs, toast, confetti, norm, refTable, copy } from '../util.js';
import { byId as gameById } from '../games/registry.js';

const STATUS_LABEL = { solved: '✓ solved', frontier: '◐ frontier', open: '◆ open' };

// which scaling Arcade games train each door's real technique (the "hard challenge")
const TRAINERS = {
  'phase-0': ['spiralcipher'],
  'phase-1': ['hashhunt'],
  'phase-2': ['hashhunt', 'cryptogram'],
  'phase-3': ['hashhunt'],
  'phase-3-2': ['vigenere', 'cryptogram'],
  'salphaseion': ['fielddecode', 'binarydecode'],
  'cosmic': ['hashhunt', 'fielddecode'],
};

export default async function phaseView({ params, navigate }) {
  const p = getPhase(params.id);
  if (!p) return { title: 'Not found', html: `<section class="section"><div class="wrap"><p class="muted">Unknown door.</p><p><a href="#/">← back to the map</a></p></div></section>` };

  store.visit(p.id);
  const i = phaseIndex(p.id);
  const prev = PHASES[i - 1], next = PHASES[i + 1];
  const cracked = store.isCracked(p.id);
  const needsCrypto = p.door.type === 'decrypt' || p.door.type === 'open';
  const trainers = (TRAINERS[p.id] || []).map(gameById).filter(Boolean);

  const html = `
  <section class="phase-hero"><div class="wrap">
    <div class="crumbs"><a href="#/">map</a> / phase ${esc(p.num)}</div>
    <div class="row" style="gap:10px">
      <span class="pill ${p.status === 'solved' ? 'teal' : 'gold'}">${STATUS_LABEL[p.status]}</span>
      <span class="pill">${'★'.repeat(p.difficulty)}${'☆'.repeat(5 - p.difficulty)} difficulty</span>
      ${p.xp ? `<span class="pill gold">+${p.xp} XP</span>` : ''}
      <span class="pill ${cracked ? 'teal' : ''}" id="crack-pill">${cracked ? '🔓 cracked' : '🔒 not yet'}</span>
    </div>
    <h1 style="margin-top:14px">${esc(p.title)}</h1>
    <p class="tag muted">${esc(p.tagline)}</p>
    <div class="concepts">${p.concepts.map(c => `<span class="pill">${esc(c)}</span>`).join('')}</div>
  </div></section>

  <section class="section"><div class="wrap stack">
    <p style="font-size:16.5px">${p.summary}</p>
    ${p.story ? `<div class="note"><p style="color:var(--paper)">${p.story}</p></div>` : ''}
    ${p.verified ? `<p class="mono" style="font-size:12px;color:var(--muted)">${esc(p.verified)} &nbsp;·&nbsp; <a href="https://github.com/HosterjackAGV/gsmg-5btc-puzzle/blob/main/docs/VERIFIED-SOLUTIONS.md" target="_blank" rel="noopener">how this was verified</a></p>` : ''}

    <h3 style="margin-top:18px">Step by step</h3>
    ${p.steps.map((s, n) => `
      <div class="step"><div class="head"><span class="n">${n + 1}</span><span class="h">${esc(s.h)}</span></div>
      <div class="body"><p>${s.body}</p></div></div>`).join('')}

    ${p.lab ? `<h3 style="margin-top:22px">${p.lab === 'matrix' ? '🧩 The genesis grid — trace it yourself' : '🔤 Cipher lab'}</h3><div id="lab-host">loading…</div>` : ''}

    ${p.play ? `<h3 style="margin-top:24px">🎮 Play this door</h3>
      <p class="muted" style="font-size:13.5px">${p.door.type === 'open' ? 'A hands-on recipe builder — every run hits the real blob and is logged to the frontier.' : 'Solve it by hand and the door opens itself.'}</p>
      <div id="game-host" class="game-host"><div class="faint" style="padding:20px">loading…</div></div>` : ''}

    ${trainers.length ? `<div class="phase-train">
      <span>🎯 <b>Want a real challenge?</b> Train this door’s technique — it scales from easy to brutal and feeds the weekly <a href="#/arcade">tournaments</a>:</span>
      <div class="phase-train-row">${trainers.map(g => `<a class="btn ghost sm" href="#/arcade/${g.id}">${g.icon} ${esc(g.title)}</a>`).join('')}</div>
    </div>` : ''}

    ${renderDoor(p, cracked)}

    <details class="eli5"><summary>Reference values for this phase <span class="chev">+</span></summary>
      <div class="body">${refTable(p.reference)}</div></details>

    ${p.trivia && p.trivia.length ? `<div class="note gold"><h4>◆ Did you notice?</h4>${p.trivia.map(t => `<p style="color:var(--muted)">${t}</p>`).join('')}</div>` : ''}

    <details class="eli5"><summary>Your notes on this door (saved in your browser) <span class="chev">+</span></summary>
      <div class="body"><textarea class="cin" id="notes" style="width:100%;min-height:90px;font-family:var(--mono)" placeholder="Scratch ideas, things you ruled out…">${esc(store.state.notes[p.id] || '')}</textarea></div></details>

    <div id="comments-host"></div>

    <div class="phasenav">
      ${prev ? `<a class="btn ghost" href="#/phase/${prev.id}">← ${esc(prev.codename)}</a>` : '<span></span>'}
      ${next ? `<a class="btn ${cracked ? 'primary' : 'ghost'}" href="#/phase/${next.id}">${esc(next.codename)} →</a>` : '<a class="btn" href="#/">back to map</a>'}
    </div>
  </div></section>`;

  function mount(root) {
    // collapsible steps
    on(root, 'click', '.step .head', (e, head) => head.parentElement.classList.toggle('open-step'));
    // copy buttons
    on(root, 'click', '.copy', (e, b) => copy(b.dataset.copy, b));
    // notes autosave
    const notes = qs('#notes', root);
    if (notes) notes.addEventListener('input', () => store.setNote(p.id, notes.value));

    wireDoor(root, p);

    // interactive per-phase game (assemble / spiral), lazy-loaded
    const gameHost = qs('#game-host', root);
    if (gameHost && p.play) {
      import('../games/phasegames.js')
        .then(m => {
          const g = m.phaseGame(p);
          if (!g) { gameHost.innerHTML = ''; return; }
          gameHost.innerHTML = g.html;
          g.mount(gameHost, { crack: () => crackPhaseUI(root, p) });
        })
        .catch(e => { console.error(e); gameHost.innerHTML = '<p class="faint">Game failed to load.</p>'; });
    }

    // interactive lab (matrix / cipher), lazy-loaded
    const labHost = qs('#lab-host', root);
    if (labHost && p.lab) {
      const loader = p.lab === 'matrix'
        ? import('../components/matrix.js').then(m => m.matrixWidget())
        : import('../components/cipherlab.js').then(m => m.cipherLab());
      loader.then(w => { labHost.innerHTML = w.html; w.mount(labHost); })
            .catch(() => { labHost.innerHTML = '<p class="faint">Lab failed to load.</p>'; });
    }

    // per-door comments (giscus / GitHub Discussions)
    const cHost = qs('#comments-host', root);
    if (cHost) import('../components/comments.js').then(m => {
      const w = m.commentsWidget(p.id, `Discuss ${p.codename}`);
      cHost.innerHTML = w.html; w.mount(cHost);
    }).catch(() => {});
  }

  return { title: p.codename, html, mount };
}

// Mark a phase cracked and celebrate (shared by the door and the per-phase game).
function crackPhaseUI(root, p) {
  if (store.crackPhase(p.id, p.xp)) {
    confetti();
    toast({ ico: '🔓', title: `Cracked: ${p.codename}`, desc: `+${p.xp} XP`, kind: 'gold' });
    const pill = qs('#crack-pill', root); if (pill) { pill.textContent = '🔓 cracked'; pill.classList.add('teal'); }
  }
}

// ---------- the door (3 flavors) ----------

function renderDoor(p, cracked) {
  const d = p.door;
  const warn = (d.type !== 'answer')
    ? `<div class="ctxwarn ${hasSecureCrypto ? '' : 'show'}">In-browser crypto needs a secure context (https or http://localhost). Open this over a local server or the published site for the live engine.</div>`
    : '';

  if (d.type === 'answer') {
    return `<div class="door-stage"><h3>🔑 The door</h3>
      <p class="muted">${esc(d.prompt)}</p>
      <div class="console"><div class="crow">
        <input class="cin" id="door-in" placeholder="your answer…" spellcheck="false" autocomplete="off">
        <button class="btn gold" id="door-go">Check</button>
        <button class="btn ghost" id="door-reveal">Reveal answer</button>
      </div><div class="cout" id="door-out"></div></div></div>`;
  }

  if (d.type === 'decrypt') {
    return `<div class="door-stage"><h3>⚡ Live decryption</h3>${warn}
      <p class="muted">${esc(d.prompt)} The real AES engine runs in your browser — watch the page decrypt.</p>
      <div class="console"><div class="crow">
        <input class="cin" id="door-in" placeholder="answer to hash → key…" spellcheck="false" autocomplete="off">
        <button class="btn gold" id="door-go">⚡ Decrypt</button>
        <button class="btn ghost" id="door-reveal">Reveal answer</button>
      </div>
      <div class="chkrow"><input type="checkbox" id="door-pre" ${d.prehash ? 'checked' : ''}><label for="door-pre">SHA-256 the input first (chain mode — the puzzle’s normal flow)</label></div>
      <div class="cout" id="door-out"></div></div></div>`;
  }

  // open frontier
  return `<div class="door-stage"><h3>🛰️ Frontier — test a recipe</h3>${warn}
    <p class="muted">${esc(d.prompt)} This blob is <b>${p.status === 'open' ? 'unsolved' : 'only partly solved'}</b>. Every try runs the real crypto and is logged with a fingerprint so the community never repeats it.</p>
    <div class="console"><div class="crow">
      <input class="cin" id="door-in" placeholder="candidate recipe / passphrase…" spellcheck="false" autocomplete="off">
      <button class="btn gold" id="door-go">Try decrypt</button>
    </div>
    <div class="chkrow"><input type="checkbox" id="door-pre" checked><label for="door-pre">SHA-256 the input first (chain mode)</label></div>
    <div class="cout" id="door-out"></div></div>
    <p class="cnote">Your logged attempts live in your <a href="#/profile">profile</a> and can be submitted to the shared <a href="#/leaderboard">leaderboard</a>.</p></div>`;
}

function wireDoor(root, p) {
  const d = p.door;
  const input = qs('#door-in', root);
  const out = qs('#door-out', root);
  const preEl = qs('#door-pre', root);
  if (!input || !out) return;

  const show = (cls, text) => { out.className = 'cout show ' + cls; out.textContent = text; };
  const celebrate = () => crackPhaseUI(root, p);

  const reveal = qs('#door-reveal', root);
  if (reveal) reveal.addEventListener('click', () => { input.value = d.answer || ''; input.focus(); });

  const go = qs('#door-go', root);
  if (!go) return;

  go.addEventListener('click', async () => {
    const val = input.value.trim();
    if (!val) { show('bad', 'Type something first.'); return; }

    if (d.type === 'answer') {
      if (d.accept.includes(norm(val))) { show('ok', `✓ Correct — “${d.answer}”.\nThe door swings open.`); celebrate(); }
      else show('bad', '✗ Not it. Re-read the steps above — the answer is in the page’s own words.');
      return;
    }

    if (!hasSecureCrypto) { show('bad', 'The live engine is disabled (insecure context). Use a local server or the published site.'); return; }
    const prehash = preEl ? preEl.checked : !!d.prehash;
    go.disabled = true; go.textContent = '…working';
    try {
      const pass = await passFor(val, prehash);

      if (d.type === 'decrypt') {
        const text = await decryptBlob(d.blob, pass);
        show('ok', `✓ UNLOCKED — the real page:\n\n${text.slice(0, 1400)}${text.length > 1400 ? '\n\n…(truncated)' : ''}`);
        celebrate();
      } else { // open frontier
        const ok = await tryBlob(d.blob, pass);
        const id = await attemptId(d.blob, val, prehash);
        store.logAttempt({ id, blob: d.blob, recipe: val, prehash, result: ok ? 'unlocked' : 'fail' });
        if (ok) {
          const text = await decryptBlob(d.blob, pass);
          const win = looksLikeWif(text);
          show('ok', `🏆 VALID DECRYPTION!${win ? ' It looks like a Bitcoin private key (WIF).' : ''}\n\n${text.slice(0, 1400)}`);
          confetti(220);
          toast({ ico: '🏆', title: 'A blob unlocked!', desc: d.blob === 'cosmic' ? 'This may be THE solve — verify the key!' : 'Logged & verified.', kind: 'gold', ttl: 9000 });
        } else {
          show('bad', `✗ fail — invalid padding (wrong recipe). Logged as a verified dead-end so no one repeats it.\n\nfingerprint ${id.slice(0, 16)}…`);
          toast({ ico: '🛰️', title: 'Attempt logged', desc: 'Frontier coverage +1' });
        }
      }
    } catch (err) {
      show('bad', '✗ fail — ' + (err && err.message === 'no-secure-context' ? 'insecure context' : 'invalid padding (wrong key).'));
    } finally { go.disabled = false; go.textContent = d.type === 'decrypt' ? '⚡ Decrypt' : 'Try decrypt'; }
  });

  input.addEventListener('keydown', e => { if (e.key === 'Enter') go.click(); });
}
