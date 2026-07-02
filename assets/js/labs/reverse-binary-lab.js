// labs/reverse-binary-lab.js — the 2023-02-23 "reverse binary" master hint, made fully interactive.
// Reproduces, live and graphically: (1) the involution decode of jrk's verbatim 161-byte post,
// (2) the token/prime-length anatomy, (3) the wordplay multiset identities, and (4) a real-crypto
// combine tester against the self-verifying oracle blob. Everything runs on the genuine artifacts.

import { BLOBS, aesDecrypt, sha256hex, dig, hex, enc, printable, printScore, isWIF } from './harness.js';
import { esc } from '../util.js';

// The verified master-hint message (jrk's 2023-02-23 post decodes byte-exact to this; see docs/WALKTHROUGH.md).
const TOKENS = [
  { t: 'yellowblueprimes', role: 'ingredient' }, { t: 'matrixsumlist', role: 'ingredient' },
  { t: 'lastwordsbeforearchichoice', role: 'ingredient' }, { t: 'yinyang', role: 'ingredient' },
  { t: 'wewontgiveawaythepassword', role: 'taunt' }, { t: 'itsinfrontofyoureyesbutyourenotseeingit', role: 'taunt' },
  { t: 'verylaststepisatruegiveaway', role: 'taunt' }, { t: 'promised', role: 'taunt' },
];
const MESSAGE = TOKENS.map(x => x.t).join('');   // 161 chars, ZERO separators

// the puzzle's core operator: reverse the 8 bits of each byte, then reverse the byte order.
const revBitsOfByte = (c) => String.fromCharCode(parseInt(c.charCodeAt(0).toString(2).padStart(8, '0').split('').reverse().join(''), 2));
function transform(s, doBits, doOrder) {
  let arr = [...s];
  if (doBits) arr = arr.map(revBitsOfByte);
  if (doOrder) arr = arr.reverse();
  return arr.join('');
}
// jrk's posted binary IS transform(MESSAGE, bits, order) — because the transform is its own inverse.
const POSTED = transform(MESSAGE, true, true);
const bitsOf = (s) => [...s].map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
const primePow = (n) => { for (const p of [2, 3, 5, 7, 11, 13]) { let x = n, e = 0; while (x % p === 0) { x /= p; e++; } if (x === 1) return { p, e }; } return null; };
const multiset = (s) => { const m = {}; for (const c of s) m[c] = (m[c] || 0) + 1; return m; };
const msDiff = (a, b) => { const A = multiset(a), B = multiset(b), o = []; for (const k in A) { const d = A[k] - (B[k] || 0); for (let i = 0; i < d; i++) o.push(k); } return o.sort().join(''); };
const isAnagram = (a, b) => [...a].sort().join('') === [...b].sort().join('');

export function reverseBinaryLab(container) {
  container.innerHTML = `
  <div class="lab" style="display:flex;flex-direction:column;gap:18px">

    <!-- 1. THE INVOLUTION DECODE -->
    <section>
      <h4 style="margin:0 0 6px">① The decode is an <em>involution</em> — its own inverse</h4>
      <p class="faint" style="margin:0 0 8px;font-size:13px">jrk's verbatim 2023-02-23 post (161 bytes). Toggle the two reversals and watch it turn into the recipe. Both ON = the master hint. The whole thing is one end-to-end mirror: applying it twice returns the input.</p>
      <div class="lab-grid" style="gap:14px">
        <label class="lab-f" style="flex-direction:row;align-items:center;gap:8px"><input type="checkbox" data-n="bits"><span>① reverse bits in each byte</span></label>
        <label class="lab-f" style="flex-direction:row;align-items:center;gap:8px"><input type="checkbox" data-n="order"><span>② reverse byte order</span></label>
        <button type="button" class="glab-btn" data-act="prove">↔ prove involution (apply twice)</button>
      </div>
      <div class="lab-out-h">binary (first 30 of 161 bytes)</div>
      <div class="mono" data-el="bin" style="font-size:11px;line-height:1.5;word-break:break-all;background:#0c1420;padding:8px;border-radius:6px;max-height:78px;overflow:auto"></div>
      <div class="lab-out-h">ASCII decode under the current toggles</div>
      <div class="mono" data-el="dec" style="font-size:12.5px;word-break:break-all;background:#0c1420;padding:10px;border-radius:6px;min-height:38px"></div>
      <div data-el="proof" class="faint" style="font-size:12px;margin-top:6px"></div>
    </section>

    <!-- 2. TOKEN / PRIME-LENGTH ANATOMY -->
    <section>
      <h4 style="margin:0 0 6px">② Anatomy — the token lengths encode "the prime part"</h4>
      <p class="faint" style="margin:0 0 8px;font-size:13px">8 tokens = 4 ingredients + 4 taunts, concatenated with <b>zero separators</b> = 161 = 7×23. The three ×13 lengths flag the <b>known / pointer</b> tokens; every other length is a <b>prime power</b> — bases exactly {2,3,5,7}, the creator's "prime part".</p>
      <div data-el="tokens" style="display:flex;flex-wrap:wrap;gap:7px"></div>
      <div class="faint" data-el="tokmath" style="font-size:12px;margin-top:8px"></div>
    </section>

    <!-- 3. WORDPLAY -->
    <section>
      <h4 style="margin:0 0 6px">③ Wordplay — the names describe themselves</h4>
      <div class="mono" data-el="wordplay" style="font-size:12.5px;line-height:1.9;background:#0c1420;padding:10px;border-radius:6px"></div>
      <div class="lab-grid" style="gap:10px;margin-top:8px">
        <label class="lab-f"><span>subtract letters: A</span><input class="lab-in mono" data-n="wa" value="promised"></label>
        <label class="lab-f"><span>− B</span><input class="lab-in mono" data-n="wb" value="primes"></label>
      </div>
      <div class="mono faint" data-el="wpres" style="font-size:12.5px;margin-top:4px"></div>
    </section>

    <!-- 4. REPRODUCIBLE COMBINE TESTER -->
    <section>
      <h4 style="margin:0 0 6px">④ Reproduce the combine sweep (real crypto, self-verifying)</h4>
      <p class="faint" style="margin:0 0 8px;font-size:13px">Assemble the key and test it against the 80-byte <b>oracle</b> blob (a correct key yields ≤79 readable bytes — instant feedback). These are the exact self-inverse / genesis families the deep-dive swept to noise. Beat 0.6 printable and you've cracked it.</p>
      <div class="lab-ings">
        <label class="lab-f"><span>yellowblueprimes</span><input class="lab-in mono" data-n="ybp" value="7233147103127"></label>
        <label class="lab-f"><span>yinyang</span><input class="lab-in mono" data-n="yin" value="yinyang"></label>
      </div>
      <div class="lab-grid">
        <label class="lab-f"><span>Blob (oracle)</span><select data-n="blob"><option value="salph_inner" selected>salph_inner (80 B — instant)</option><option value="p32_trailing">p32_trailing (80 B — instant)</option><option value="cosmic">cosmic (1328 B — the prize)</option></select></label>
        <label class="lab-f"><span>Combine</span><select data-n="op">
          <option value="concat">concat → sha256</option>
          <option value="concatrev">concat → reverse → sha256 (involution)</option>
          <option value="xor">XOR of the 4 sha256 hashes</option>
          <option value="beaufort">Beaufort(ybp keyed by yinyang) → sha256</option></select></label>
      </div>
      <div class="lab-ctrl"><button type="button" class="glab-btn primary" data-act="run">▶ Build key &amp; test</button></div>
      <div class="lab-res"></div>
    </section>
  </div>`;

  const q = (s) => container.querySelector(s);
  const val = (n) => q(`[data-n="${n}"]`).value;
  const chk = (n) => q(`[data-n="${n}"]`).checked;

  // ---- section 1: decode ----
  function renderDecode() {
    const b = chk('bits'), o = chk('order');
    const out = transform(POSTED, b, o);
    q('[data-el="bin"]').textContent = bitsOf(POSTED).split(' ').slice(0, 30).join(' ') + ' …';
    const readable = out === MESSAGE;
    const el = q('[data-el="dec"]');
    el.textContent = printable(out).slice(0, 200) + (out.length > 200 ? '…' : '');
    el.style.color = readable ? '#3ad29f' : '#c9d3e0';
    el.style.fontWeight = readable ? '700' : '400';
    q('[data-el="proof"]').innerHTML = readable
      ? '✓ both reversals on → the master hint decodes cleanly (161 bytes → 161 chars).'
      : (!b && !o ? 'raw posted bytes — unreadable until you mirror them.' : b && !o ? 'bits reversed only → the message appears <b>backwards</b> (byte order still flipped).' : 'byte order only → still scrambled; you also need the per-byte bit reversal.');
  }
  function prove() {
    const once = transform(MESSAGE, true, true), twice = transform(once, true, true);
    q('[data-el="proof"]').innerHTML = `transform(message) = the posted binary; transform(transform(message)) = <span style="color:#3ad29f">"${esc(printable(twice).slice(0, 40))}…"</span> — <b>identical to the message</b>. Self-inverse, exactly like Beaufort (encrypt = decrypt) and the yin-yang's 180° symmetry.`;
    q('[data-n="bits"]').checked = true; q('[data-n="order"]').checked = true; renderDecode();
  }

  // ---- section 2: token anatomy ----
  (function renderTokens() {
    const wrap = q('[data-el="tokens"]');
    wrap.innerHTML = TOKENS.map(({ t, role }) => {
      const L = t.length, isKnown = L % 13 === 0, pp = primePow(L);
      const bg = isKnown ? '#2a3550' : '#3a2c1a', bd = isKnown ? '#5b6f9e' : '#c9a24a';
      const tag = isKnown ? `×13 (${L / 13})` : (pp ? `${pp.p}^${pp.e}` : L);
      return `<span title="${esc(role)} · length ${L}" style="display:inline-flex;flex-direction:column;gap:2px;padding:5px 9px;border:1px solid ${bd};background:${bg};border-radius:7px;font-size:11.5px">
        <b class="mono" style="font-size:11px">${esc(t)}</b>
        <span class="faint" style="font-size:10.5px">len ${L} = <b style="color:${isKnown ? '#8fa8de' : '#e0b64a'}">${tag}</b> · ${esc(role)}</span></span>`;
    }).join('');
    q('[data-el="tokmath"]').innerHTML = `ingredients ${TOKENS.slice(0, 4).reduce((s, x) => s + x.t.length, 0)} + taunts ${TOKENS.slice(4).reduce((s, x) => s + x.t.length, 0)} = <b>161 = 7×23</b>. ×13 lengths {13,26,39} = the known/pointer tokens. Prime-power lengths {16,7,25,27,8} = {2⁴,7,5²,3³,2³} → bases <b>{2,3,5,7}</b>.`;
  })();

  // ---- section 3: wordplay ----
  (function renderWordplay() {
    const rows = [
      `<b>promised</b> − <b>primes</b> = {${esc(msDiff('promised', 'primes'))}} → anagram of <b style="color:#3ad29f">"PRIMES" + "DO"</b> = the creator's "do the primes"`,
      `<b>yellowblueprimes</b> − <b>primes</b> = "<b style="color:#3ad29f">${esc(msDiff('yellowblueprimes', 'primes'))}</b>" = anagram of <b>yellowblue</b> — the name embeds its own operands`,
      `<b>matrixsumlist</b> = MATRIX + SUM + LIST — embeds its own verb (sum a list)`,
      `<b>SalPhaseIon</b> ⇄ <b style="color:#3ad29f">ALPHANOISES</b> : anagram = ${isAnagram('salphaseion', 'alphanoises') ? '✓ true' : '✗'} · ~"salvation"`,
    ];
    q('[data-el="wordplay"]').innerHTML = rows.join('<br>');
  })();
  function wordSub() {
    const a = val('wa').toLowerCase().replace(/[^a-z]/g, ''), b = val('wb').toLowerCase().replace(/[^a-z]/g, '');
    const d = msDiff(a, b), poss = [...b].every(c => (multiset(a)[c] || 0) >= (multiset(b)[c] || 0));
    q('[data-el="wpres"]').innerHTML = !poss ? `"${esc(b)}" is not a sub-multiset of "${esc(a)}"` : `"${esc(a)}" − "${esc(b)}" = <b>{${esc(d) || '∅'}}</b>${d ? ` → "${esc(a)}" = anagram of "${esc(b)}" + "${esc(d)}"` : ` → "${esc(a)}" is an anagram of "${esc(b)}"`}`;
  }

  // ---- section 4: combine tester ----
  const beaufort = (txt, key) => { const A = s => s.toUpperCase().replace(/[^A-Z]/g, ''); const T = A(txt), K = A(key); if (!T || !K) return ''; let o = ''; for (let i = 0; i < T.length; i++) o += String.fromCharCode(((K.charCodeAt(i % K.length) - 65 - (T.charCodeAt(i) - 65) + 26) % 26) + 65); return o; };
  async function run() {
    const btn = q('[data-act="run"]'); btn.disabled = true; btn.textContent = 'testing…';
    try {
      const ybp = val('ybp'), yin = val('yin'), op = val('op');
      const msl = '6108766549978798108108736759668', lw = 'lastwordsbeforearchichoice';
      const parts = [ybp, msl, lw, yin];
      let key, assembled;
      if (op === 'concat') { assembled = parts.join(''); key = await sha256hex(assembled); }
      else if (op === 'concatrev') { assembled = [...parts.join('')].reverse().join(''); key = await sha256hex(assembled); }
      else if (op === 'xor') { const hs = await Promise.all(parts.map(p => dig('SHA-256', enc(p)))); const x = new Uint8Array(32); for (const h of hs) for (let i = 0; i < 32; i++) x[i] ^= h[i]; key = hex(x); assembled = '(XOR of the four sha256 digests)'; }
      else { assembled = beaufort(ybp, yin); key = await sha256hex(assembled); }
      const r = await aesDecrypt(BLOBS[val('blob')].b64, key);
      const score = r.ok ? printScore(r.text) : 0, pct = Math.round(score * 100), wif = r.ok && isWIF(r.text), opened = r.ok && score >= 0.85;
      q('.lab-res').innerHTML = `
        <div class="lab-verdict ${opened ? (wif ? 'win' : 'good') : 'bad'}">${!r.ok ? '✕ invalid padding — wrong key' : wif ? '★ WIF PRIVATE KEY — the solve!' : opened ? '✓ readable text!' : '✕ noise (this family was swept to noise)'}</div>
        <div class="lab-meter"><div class="lab-meter-f" style="width:${pct}%;background:${pct >= 85 ? '#3ad29f' : pct >= 60 ? '#e0b64a' : '#e05a6a'}"></div><span>${pct}% printable (noise ≈ 37%, random max ≈ 60%)</span></div>
        <div class="lab-out-h">assembled preimage</div><div class="lab-out-v mono">${esc(assembled.slice(0, 120))}${assembled.length > 120 ? '…' : ''}</div>
        <div class="lab-out-h">→ sha256 → OpenSSL key</div><div class="lab-out-v mono">${esc(key)}</div>
        <div class="lab-out-h">decrypt (first 96 bytes)</div><pre class="lab-out-pre mono">${esc(r.ok ? printable(r.text).slice(0, 96) : '(no valid decryption)')}</pre>`;
    } catch (e) { q('.lab-res').innerHTML = `<div class="lab-verdict bad">Error: ${esc(String(e && e.message || e))}</div>`; }
    btn.disabled = false; btn.textContent = '▶ Build key & test';
  }

  // wire
  q('[data-n="bits"]').addEventListener('change', renderDecode);
  q('[data-n="order"]').addEventListener('change', renderDecode);
  q('[data-act="prove"]').addEventListener('click', prove);
  q('[data-n="wa"]').addEventListener('input', wordSub);
  q('[data-n="wb"]').addEventListener('input', wordSub);
  q('[data-act="run"]').addEventListener('click', run);
  renderDecode(); wordSub(); run();
}
