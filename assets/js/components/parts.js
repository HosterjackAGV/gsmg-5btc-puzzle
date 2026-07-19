// components/parts.js — the "Unused Parts" endgame workbench.
// The companion to the SalPhaseIon soup lab, one level up: instead of the soup tokens, its PALETTE is EVERY
// still-usable puzzle part — the four believed ingredients (each with its real candidate byte-forms), the four
// master-hint taunts, the two undecoded blocks, the creator-confirmed clue strings, the solved-phase chain keys,
// and the soup operators. Every part: (1) EDITABLE in place; (2) cycles through its candidate VALUES (◂ i/N ▸);
// (3) "add ＋" to your recipe as many times as you like. The RECIPE is an ordered list you reorder (drag or ↑↓),
// edit per-entry, and remove from. It joins into a live combined string you can run through the REAL crypto against
// ANY of the three open blobs (cosmic + the two self-verifying oracles). State persists to localStorage. No build.
// Values verbatim from docs/WALKTHROUGH.md, content/phases.js, and the verified research ledger.

import { qs, qsa, on, esc, copy } from '../util.js';
import { BLOBS, PUZZLE, aesDecrypt, sha256hex, printable, printScore, isWIF } from '../labs/harness.js';

// the full Architect speech (phase-3.2 AES → CP1141/EBCDIC → Beaufort 'thematrixhasyou'), the alt value of lastwords
const SPEECH = 'yourlifeisthesumofaremainderofanunbalancedequationinherenttotheprogrammingofthispuzzleyouaretheeventualityofananomalywhichdespitemysinceresteffortsihavebeenunabletoeliminatefromwhatisotherwiseaharmonyofmathematicalprecisionwhileitremainsaburdentosedulouslyavoidititisnotunexpectedandthusnotbeyondameasureofcontrolwhichhasledyouinexorablyhereyouyouhaventansweredmyquestionmequiterightinterestingthatwasquickerthantheotherspleaseifyoufindawaytocompletethelastpartofthepuzzletaketheprivatekeyyouveearneditbutpleasetakethistoheartthatwhatawisemanabovehintedatisworthhundredfourtyoftheinvestmentthatswhatusguysatgsmgaretryingtoaccomplishintheendpleasejusthelpusbuilditinsteadofjustwaistingyourlifetimebyhuntingforworthlesspricesandthrophieslikethisimsorrytotellyouthatyouvecomethisfarbutyoullneverfinishthelasttaskiexpectyoutosaybullshitwelldenialisthemostpredictableofallhumanresponsesbutrestassuredthiswillnotbethelasttimeihavedestroyedarestlesssoulandihavebecomeexceedinglyefficientatitthefunctionoftheyouisnowtoreturntothesourcecodesallowingatemporarydisseminationofthecodeyouhopefullycarryreinsertingtheprimebasicsafterwhichyouwillberequiredtoselectfromovertwentythreecipherssixteenencryptionsandorsevenintertwinedpasswordstofindtheactualprivatekeynotethatalsobruteforcingmightberequiredfailuretocomplywiththisprocesswillresultinacataclysmicsystemcrashkillingyourwillpowerwhichcoupledwiththeexterminationofyourwilltoliveandwillultimatelyresultintheextinctionoftheentirenessofyourselfselfgoodluckneverthelessireallyhopeyouretheoneciaobellao';

// ── the still-usable parts, grouped. each has candidate VALUES {v, t?} (t = a short tag). the FIRST is primary. ──
const GROUPS = [
  { g: 'Core ingredients — the believed four', note: 'the master-hint recipe: sha256(ybp · matrixsumlist · lastwords · yinyang). Two are confirmed; two (ybp, yinyang) are still guesses — each shown with its real candidate byte-forms.', parts: [
    { id:'ybp', label:'yellowblueprimes', hue:45, solved:false, vals:[
      { v:'2347', t:'9th·15th prime (23·47)' }, { v:'151263', t:'9th·15th A007522 (151·263)' },
      { v:'72331477179103127151167191', t:'the 11 A007522 primes' }, { v:'yellowblueprimes', t:'literal word' }, { v:'997', t:'sum of the 11' } ] },
    { id:'msl', label:'matrixsumlist', hue:200, solved:true, vals:[
      { v:'610876654997879', t:'row sums' }, { v:'8108108736759668', t:'col sums' },
      { v:PUZZLE.matrixsumlist, t:'rows+cols' }, { v:'matrixsumlist', t:'literal word' } ] },
    { id:'lastwords', label:'lastwordsbeforearchichoice', hue:150, solved:true, vals:[
      { v:'lastwordsbeforearchichoice', t:'the label' },
      { v:'returntothesourcecodesreinsertingtheprimebasics', t:'the master instruction' },
      { v:SPEECH, t:'full Architect speech (1539)' } ] },
    { id:'yinyang', label:'yinyang', hue:280, solved:false, vals:[
      { v:'95101', t:'black·white counts' }, { v:'10195', t:'reversed' }, { v:'yinyang', t:'literal' }, { v:'yingyang', t:'alt spelling' } ] },
  ]},
  { g: 'Master-hint taunts', note: 'the reverse-binary master hint (2023-02-23) ends with four taunts — never yet used as key material.', parts: [
    { id:'t1', label:'we won’t give away the password', hue:15, solved:true, vals:[{ v:'wewontgiveawaythepassword' }] },
    { id:'t2', label:'it’s in front of your eyes…', hue:15, solved:true, vals:[{ v:'itsinfrontofyoureyesbutyourenotseeingit' }] },
    { id:'t3', label:'the very last step is a true giveaway', hue:15, solved:true, vals:[{ v:'verylaststepisatruegiveaway' }] },
    { id:'t4', label:'promised', hue:15, solved:true, vals:[{ v:'promised' }] },
  ]},
  { g: 'The undecoded blocks (open)', note: 'the two SalPhaseIon blocks that never decoded — hypothesized (unconfirmed) to spell the two unknown ingredients.', parts: [
    { id:'dbbi', label:'dbbi', hue:210, solved:false, vals:[{ v:PUZZLE.dbbi, t:'raw a–i block (91)' }, { v:'yellowblueprimes', t:'community guess' }] },
    { id:'faed', label:'faed', hue:320, solved:false, vals:[{ v:PUZZLE.faed, t:'raw a–i block (570)' }, { v:'yinyang', t:'community guess' }] },
  ]},
  { g: 'Creator-confirmed clues', note: 'strings the creator confirmed as real, each still testable as key material.', parts: [
    { id:'door', label:'another door {1},{4},{21}', hue:90, solved:true, vals:[{ v:'adu', t:'a1z26 → A,D,U' }, { v:'1421' }, { v:'anotherdoor' }] },
    { id:'half', label:'half & better half', hue:340, solved:true, vals:[{ v:'halfandbetterhalf' }, { v:'privatekeysbelongtohalfandbetterhalf' }, { v:'betterhalf' }] },
    { id:'primes', label:'the prime basics', hue:120, solved:true, vals:[{ v:'2357', t:'the primes 2,3,5,7' }, { v:'primebasics' }] },
    { id:'tmhy', label:'thematrixhasyou', hue:265, solved:true, vals:[{ v:'thematrixhasyou', t:'the confirmed VIC/Beaufort key' }] },
    { id:'vic', label:'the VIC / chess alphabet', hue:25, solved:true, vals:[{ v:'FUBCDORA.LETHINGKYMVPS.JQZXW', t:'straddling-checkerboard board' }] },
    { id:'incase', label:'the INCASE line', hue:5, solved:true, vals:[{ v:PUZZLE.incase, t:'VIC-decoded phase-3.2 tail' }] },
  ]},
  { g: 'Chain keys (solved-phase answers)', note: 'the passwords that opened earlier phases — reusable as ingredients or separators.', parts: [
    { id:'causality', label:'causality', hue:190, solved:true, vals:[{ v:'causality', t:'Phase 2 answer' }] },
    { id:'seed', label:'theseedisplanted', hue:160, solved:true, vals:[{ v:'theseedisplanted', t:'Phase 0 answer' }] },
  ]},
  { g: 'Soup operators / tokens', note: 'the small tokens the SalPhaseIon soup separates out — operators, not ingredients (shabef = sha256).', parts: [
    { id:'shabef', label:'shabef', hue:335, solved:true, vals:[{ v:'shabef', t:'= sha256' }, { v:'sha256' }] },
    { id:'anstoo', label:'anstoo', hue:300, solved:true, vals:[{ v:'anstoo' }] },
    { id:'thispassword', label:'thispassword', hue:175, solved:true, vals:[{ v:'thispassword' }] },
    { id:'enter', label:'enter', hue:100, solved:true, vals:[{ v:'enter' }] },
    { id:'ofh', label:'ourfirsthintisyourlastcommand', hue:55, solved:true, vals:[{ v:'ourfirsthintisyourlastcommand' }] },
  ]},
];
const PARTS = GROUPS.flatMap(g => g.parts.map(p => ({ ...p, group: g.g })));
const P = id => PARTS.find(p => p.id === id);
const LS_KEY = 'gsmg-parts-lab-v1';
const TARGETS = [
  { id:'cosmic',       label:'Cosmic Duality (the prize · 1328 B)' },
  { id:'salph_inner',  label:'salph_inner oracle (80 B · self-verifying)' },
  { id:'p32_trailing', label:'p32_trailing oracle (80 B · self-verifying)' },
];

export function partsWidget() {
  const html = `
  <div class="soup parts">
    <div class="soup-cp">
      <div class="soup-cp-row">
        <span class="soup-cp-lab">Palette:</span>
        <button class="btn ghost sm" data-collapse="all">Collapse all groups</button>
        <button class="btn ghost sm" data-collapse="none">Expand all</button>
        <button class="btn ghost sm" data-reset>⟲ Reset everything</button>
      </div>
      <div class="soup-cp-row">
        <span class="soup-cp-lab">Join with:</span>
        <select class="soup-join" data-join>
          <option value="">(nothing)</option>
          <option value=" ">space</option>
          <option value="·">·</option>
          <option value="z">z (soup separator)</option>
          <option value="-">-</option>
          <option value="|">|</option>
          <option value="\\n">newline</option>
        </select>
        <span class="soup-hint">Every part is <b>editable</b> · cycle its candidate values with <b>◂ i/N ▸</b> · <b>add ＋</b> to your recipe (as many times as you like) · then build a passphrase and run it through the <b>real crypto</b> against any of the three open blobs. <b>ybp / yinyang</b> are unconfirmed guesses.</span>
      </div>
    </div>

    <div class="soup-sec">
      <div class="soup-sec-h">① Unused parts <span class="faint">— edit the text, cycle the candidate value, then <b>add ＋</b> to your recipe</span></div>
      <div class="pl-groups" data-palette></div>
    </div>

    <div class="soup-sec">
      <div class="soup-sec-h">② Your recipe <span class="faint">— drag or ↑↓ to reorder · edit any entry · <b>remove ✕</b></span>
        <span class="soup-sec-actions"><button class="btn ghost sm" data-clear>clear recipe</button></span></div>
      <div class="soup-recipe" data-recipe></div>
    </div>

    <div class="soup-out">
      <div class="soup-out-head">
        <span>Combined string <span class="soup-count" data-count>0 chars</span></span>
        <button class="btn teal sm" data-copyout>copy</button>
      </div>
      <pre class="soup-out-str mono" data-out></pre>
      <div class="soup-decode">
        <label class="soup-dec-form"><span>Target blob</span>
          <select data-target>${TARGETS.map(t => `<option value="${t.id}">${esc(t.label)}</option>`).join('')}</select></label>
        <label class="soup-dec-form"><span>Treat as</span>
          <select data-form>
            <option value="sha256hex">sha256(string) → OpenSSL key (puzzle convention)</option>
            <option value="raw">the raw OpenSSL password</option>
            <option value="double">sha256(sha256(string))</option>
          </select></label>
        <button class="btn primary" data-decode>▶ Decrypt with this string</button>
      </div>
      <div class="soup-verdict" data-verdict hidden></div>
    </div>
  </div>`;

  function mount(root) {
    const wrap = qs('.parts', root) || root;
    const paletteEl = qs('[data-palette]', wrap);
    const recipeEl  = qs('[data-recipe]', wrap);
    const outEl     = qs('[data-out]', wrap);
    const countEl   = qs('[data-count]', wrap);
    const joinEl    = qs('[data-join]', wrap);
    const formEl    = qs('[data-form]', wrap);
    const targetEl  = qs('[data-target]', wrap);
    const verdictEl = qs('[data-verdict]', wrap);

    let uid = 1;
    let state = load() || fresh();
    function fresh() {
      return {
        vals: Object.fromEntries(PARTS.map(p => [p.id, p.vals.map(x => x.v)])),  // editable copies of each candidate
        sel:  Object.fromEntries(PARTS.map(p => [p.id, 0])),                     // which candidate is selected
        collapsed: {},                                                          // group -> bool
        recipe: [],                                                             // [{uid,partId,label,hue,value}]
        join: '', decForm: 'sha256hex', target: 'cosmic',
      };
    }
    function save() { try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch {} }
    function load() {
      try {
        const s = JSON.parse(localStorage.getItem(LS_KEY) || 'null');
        if (!s || !s.vals || !Array.isArray(s.recipe)) return null;
        for (const e of s.recipe) uid = Math.max(uid, (e.uid || 0) + 1);
        for (const p of PARTS) {                                               // heal against schema drift
          if (!Array.isArray(s.vals[p.id]) || s.vals[p.id].length !== p.vals.length) s.vals[p.id] = p.vals.map(x => x.v);
          if (s.sel[p.id] == null || s.sel[p.id] >= p.vals.length) s.sel[p.id] = 0;
        }
        s.collapsed = s.collapsed || {}; s.target = s.target || 'cosmic';
        return s;
      } catch { return null; }
    }
    const curVal = id => state.vals[id][state.sel[id]];
    const tagOf  = id => P(id).vals[state.sel[id]].t || `${state.sel[id] + 1}/${P(id).vals.length}`;

    // ── PALETTE render (grouped) ──
    function chip(p) {
      const id = p.id, n = p.vals.length, v = curVal(id);
      return `<div class="sp-chip${p.solved ? '' : ' unsolved'}" data-id="${id}" style="--hue:${p.hue}">
        <div class="sp-head"><span class="sp-name" title="${esc(p.label)}">${esc(p.label)}</span></div>
        <textarea class="sp-val mono" data-editpal spellcheck="false" rows="2" aria-label="${esc(p.label)} value">${esc(v)}</textarea>
        <div class="sp-ctl">
          ${n > 1 ? `<span class="pl-cyc"><button class="pl-cyc-b" data-cyc="-1" title="previous candidate">◂</button><span class="pl-cyc-t" title="candidate ${state.sel[id] + 1} of ${n}">${esc(tagOf(id))}</span><button class="pl-cyc-b" data-cyc="1" title="next candidate">▸</button></span>`
                  : `<span class="pl-cyc solo">${esc(tagOf(id))}</span>`}
          <button class="sp-add" data-add title="append to your recipe">add ＋</button>
        </div>
      </div>`;
    }
    function renderPalette() {
      paletteEl.innerHTML = GROUPS.map((g, gi) => {
        const col = state.collapsed[g.g];
        return `<div class="pl-group${col ? ' col' : ''}" data-group="${gi}">
          <div class="pl-group-h" data-ghead="${gi}">
            <span class="pl-tw">${col ? '▸' : '▾'}</span>
            <span class="pl-group-t">${esc(g.g)}</span>
            <span class="pl-group-n">${g.parts.length}</span>
            <span class="pl-group-note faint">${esc(g.note)}</span>
          </div>
          <div class="soup-palette pl-grid">${g.parts.map(chip).join('')}</div>
        </div>`;
      }).join('');
    }
    function refreshChip(id) { const node = qs(`.sp-chip[data-id="${id}"]`, paletteEl); if (node) node.outerHTML = chip(P(id)); }

    // ── RECIPE render ──
    function recipeRow(e, i) {
      return `<div class="sr-row" data-uid="${e.uid}" draggable="true" style="--hue:${e.hue}">
        <span class="sr-grip" title="drag to reorder">⠿</span>
        <span class="sr-idx">${i + 1}</span>
        <span class="sr-tag" title="${esc(e.label)}">${esc(e.label)}</span>
        <textarea class="sr-val mono" data-editrec spellcheck="false" rows="1" aria-label="recipe entry ${i + 1}">${esc(e.value)}</textarea>
        <span class="sr-len">${e.value.length}</span>
        <span class="sr-move"><button class="sr-mini" data-up title="move up">↑</button><button class="sr-mini" data-down title="move down">↓</button></span>
        <button class="sr-rm" data-rm title="remove this entry">✕</button>
      </div>`;
    }
    function renderRecipe() {
      recipeEl.innerHTML = state.recipe.length
        ? state.recipe.map(recipeRow).join('')
        : `<div class="sr-empty">Your recipe is empty — <b>add ＋</b> parts above to build the combined string.</div>`;
      qsa('.sr-val', recipeEl).forEach(autosize);
      recompute();
    }
    function autosize(t) { t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 140) + 'px'; }

    function recompute() {
      const join = state.join.replace(/\\n/g, '\n');
      const s = state.recipe.map(e => e.value).join(join);
      outEl.textContent = s;
      countEl.textContent = s.length.toLocaleString() + ' chars · ' + state.recipe.length + ' part' + (state.recipe.length === 1 ? '' : 's');
      return s;
    }

    // ── palette events ──
    on(paletteEl, 'click', '[data-ghead]', (e, b) => { const gi = +b.dataset.ghead, g = GROUPS[gi].g; state.collapsed[g] = !state.collapsed[g]; renderPalette(); save(); });
    on(paletteEl, 'click', '[data-cyc]', (e, b) => {
      const id = b.closest('.sp-chip').dataset.id, n = P(id).vals.length, d = +b.dataset.cyc;
      state.sel[id] = (state.sel[id] + d + n) % n; refreshChip(id); save();
    });
    on(paletteEl, 'input', '[data-editpal]', (e, t) => { const id = t.closest('.sp-chip').dataset.id; state.vals[id][state.sel[id]] = t.value; save(); });
    on(paletteEl, 'click', '[data-add]', (e, b) => {
      const p = P(b.closest('.sp-chip').dataset.id);
      state.recipe.push({ uid: uid++, partId: p.id, label: p.label, hue: p.hue, value: curVal(p.id) });
      renderRecipe(); save();
      const last = recipeEl.lastElementChild; if (last) { last.classList.add('sr-flash'); setTimeout(() => last.classList.remove('sr-flash'), 600); last.scrollIntoView({ block: 'nearest' }); }
    });

    // ── recipe events ──
    on(recipeEl, 'input', '[data-editrec]', (e, t) => {
      const u = +t.closest('.sr-row').dataset.uid, en = state.recipe.find(x => x.uid === u);
      if (en) en.value = t.value;
      const lenEl = t.closest('.sr-row').querySelector('.sr-len'); if (lenEl) lenEl.textContent = t.value.length;
      autosize(t); recompute(); save();
    });
    on(recipeEl, 'click', '[data-rm]', (e, b) => { const u = +b.closest('.sr-row').dataset.uid; state.recipe = state.recipe.filter(x => x.uid !== u); renderRecipe(); save(); });
    on(recipeEl, 'click', '[data-up]',   (e, b) => moveRow(+b.closest('.sr-row').dataset.uid, -1));
    on(recipeEl, 'click', '[data-down]', (e, b) => moveRow(+b.closest('.sr-row').dataset.uid, +1));
    function moveRow(u, d) {
      const i = state.recipe.findIndex(x => x.uid === u), j = i + d;
      if (i < 0 || j < 0 || j >= state.recipe.length) return;
      const [it] = state.recipe.splice(i, 1); state.recipe.splice(j, 0, it); renderRecipe(); save();
    }

    // ── recipe drag & drop ──
    let dragU = null;
    on(recipeEl, 'dragstart', '.sr-row', (e, el) => { dragU = +el.dataset.uid; el.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
    on(recipeEl, 'dragend', '.sr-row', (e, el) => { el.classList.remove('dragging'); qsa('.sr-row', recipeEl).forEach(r => r.classList.remove('drop-t', 'drop-b')); });
    on(recipeEl, 'dragover', '.sr-row', (e, el) => {
      e.preventDefault(); if (+el.dataset.uid === dragU) return;
      const r = el.getBoundingClientRect(); const before = (e.clientY - r.top) < r.height / 2;
      qsa('.sr-row', recipeEl).forEach(x => x.classList.remove('drop-t', 'drop-b'));
      el.classList.add(before ? 'drop-t' : 'drop-b');
    });
    on(recipeEl, 'drop', '.sr-row', (e, el) => {
      e.preventDefault(); const targetU = +el.dataset.uid; if (dragU == null || targetU === dragU) return;
      const r = el.getBoundingClientRect(); const before = (e.clientY - r.top) < r.height / 2;
      const from = state.recipe.findIndex(x => x.uid === dragU); const [it] = state.recipe.splice(from, 1);
      let to = state.recipe.findIndex(x => x.uid === targetU); if (!before) to += 1;
      state.recipe.splice(to, 0, it); dragU = null; renderRecipe(); save();
    });

    // ── control panel ──
    on(wrap, 'click', '[data-collapse]', (e, b) => { const all = b.dataset.collapse === 'all'; for (const g of GROUPS) state.collapsed[g.g] = all; renderPalette(); save(); });
    on(wrap, 'click', '[data-clear]', () => { state.recipe = []; renderRecipe(); save(); });
    on(wrap, 'click', '[data-reset]', () => { try { localStorage.removeItem(LS_KEY); } catch {} state = fresh(); uid = 1; syncControls(); renderPalette(); renderRecipe(); verdictEl.hidden = true; });
    on(wrap, 'change', '[data-join]', () => { state.join = joinEl.value; recompute(); save(); });
    on(wrap, 'change', '[data-form]', () => { state.decForm = formEl.value; save(); });
    on(wrap, 'change', '[data-target]', () => { state.target = targetEl.value; save(); });
    on(wrap, 'click', '[data-copyout]', (e, b) => copy(outEl.textContent, b));

    // ── decrypt against the chosen blob ──
    on(wrap, 'click', '[data-decode]', async (e, b) => {
      const s = recompute();
      if (!s) { showVerdict({ empty: true }); return; }
      b.disabled = true; const lbl = b.textContent; b.textContent = 'decrypting…';
      try {
        const pw = state.decForm === 'raw' ? s : state.decForm === 'double' ? await sha256hex(await sha256hex(s)) : await sha256hex(s);
        const blob = BLOBS[state.target] || BLOBS.cosmic;
        const r = await aesDecrypt(blob.b64, pw);
        const score = r.ok ? printScore(r.text) : 0, wif = r.ok && isWIF(r.text), opened = r.ok && score >= 0.85;
        showVerdict({ r, score, wif, opened, pw, target: blob.label });
      } catch (err) { verdictEl.hidden = false; verdictEl.className = 'soup-verdict bad'; verdictEl.innerHTML = `Error: ${esc(String(err && err.message || err))}`; }
      b.disabled = false; b.textContent = lbl;
    });
    function showVerdict(o) {
      verdictEl.hidden = false;
      if (o.empty) { verdictEl.className = 'soup-verdict bad'; verdictEl.innerHTML = 'Add at least one part to the recipe first.'; return; }
      const { r, score, wif, opened } = o, pct = Math.round(score * 100), oracle = state.target !== 'cosmic';
      // for the 80-byte oracles, valid PKCS7 padding is itself the self-verifying signal
      const cls = !r.ok ? 'bad' : wif ? 'win' : (opened || (oracle && r.ok)) ? 'good' : 'bad';
      const head = !r.ok ? '✕ invalid padding — this is not the key'
        : wif ? '★ WIF PRIVATE KEY — this would be the solve!'
        : oracle ? '✓ VALID PADDING on a self-verifying oracle — worth a close look'
        : opened ? '✓ readable text out' : '✕ noise (valid padding but not readable — wrong recipe)';
      verdictEl.className = 'soup-verdict ' + cls;
      verdictEl.innerHTML = `
        <div class="sv-head">${head}</div>
        <div class="sv-row"><span class="sv-k">Target</span><code class="mono">${esc(o.target)}</code></div>
        <div class="sv-meter"><div class="sv-meter-f" style="width:${pct}%;background:${pct >= 85 ? 'var(--teal)' : pct >= 60 ? 'var(--warn)' : 'var(--rust)'}"></div><span>${pct}% printable</span></div>
        <div class="sv-row"><span class="sv-k">OpenSSL key</span><code class="mono">${esc(o.pw)}</code></div>
        <div class="sv-row"><span class="sv-k">Decrypt (first 200)</span></div>
        <pre class="sv-pre mono">${esc(r.ok ? printable(r.text).slice(0, 200) : '(no valid decryption — the padding check failed)')}</pre>`;
    }

    function syncControls() { joinEl.value = state.join; formEl.value = state.decForm; targetEl.value = state.target; }

    syncControls(); renderPalette(); renderRecipe();
  }

  return { html, mount };
}
