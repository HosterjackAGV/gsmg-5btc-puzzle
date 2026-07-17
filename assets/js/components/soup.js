// components/soup.js — the interactive SalPhaseIon "soup" lab.
// Two panes: (1) a PALETTE of the soup's parts (dbbi/faed/matrixsumlist/tokens/blob halves/…) — every value is
// EDITABLE (edit within the text), each can flip RAW ⇄ DECODED, and each has an "add" button. (2) a RECIPE — the
// ordered list you build by adding parts: reorder (drag or ↑/↓), edit each entry independently, REMOVE any entry,
// or add the same part MULTIPLE times. The recipe joins into a live combined string, which you can decrypt against
// the real Cosmic Duality blob right here. State persists to localStorage. No framework, no build.
// Data verbatim from docs/WALKTHROUGH.md §9.

import { qs, qsa, on, esc, copy } from '../util.js';
import { BLOBS, aesDecrypt, sha256hex, printable, printScore, isWIF } from '../labs/harness.js';

// ── the soup, IN ORDER. raw = exact soup chunk; dec = its decoded value; solved = is the decode known. ──
const PARTS = [
  { id:'dbbi',   n:'①', label:'dbbi',        type:'block',  solved:false, hue:210,
    raw:'dbbibfbhccbegbihabebeihbeggegebebbgehhebhhfbabfdhbeffcdbbfcccgbfbeeggecbedcibfbffgigbeeeabe',
    dec:'yellowblueprimes', guess:true },
  { id:'msl',    n:'②', label:'matrixsumlist', type:'binary', solved:true, hue:35,
    raw:'abbabbababbaaaababbbabaaabbbaabaabbabaababbbbaaaabbbaabbabbbabababbabbababbabbaaabbabaababbbaabbabbbabaa',
    dec:'matrixsumlist' },
  { id:'faed',   n:'③', label:'faed',        type:'block',  solved:false, hue:280,
    raw:'faedggeedfcbdabhhggcadcfeddgfdgbgigaaedggiafaecghggcdaihehahbahigceifgbfgefgaifabifagaegeacgbbeagfggeeggafbacgfcdbeiffaafcidahgdeefghhcggaegdebhhegeghcegadfbdiagefcicggifdcgaaggfbigaicfbhecaecbceiaicebgbgiecdeggfgegaedggfiiciiififhggcgfgdcdggefcbeeigefibgibggghhfbcgifdehedfdagicdbhicgaiedaehahghhcihdghfhbiicecbiichihiiigiddgehhdfdchcbafgfbhaheagegecafehgcfggggcagfhhghbaihidiehhfdeggdgcihggggghadahigigbgecgedfcdggaccdehiicigfbffhggaeidbbeibbeiifdgfdhieeeieeecifdgdahdiggfhegfiaffiggbcbcehceabfbedbiibfbfdedeehgigfaaiggagbeiichiedifbehgbccahhbiibibbibdcbahaidhfahiihic',
    dec:'yinyang', guess:true },
  { id:'z1',     n:'',  label:'z',           type:'sep',    solved:true, hue:20,  raw:'z', dec:'z' },
  { id:'lastwords', n:'④', label:'lastwordsbeforearchichoice', type:'field', solved:true, hue:150,
    raw:'agdafaoaheiecggchgicbbhcgbehcfcoabicfdhhcdbbcagbdaiobbgbeadedde', dec:'lastwordsbeforearchichoice' },
  { id:'z2',     n:'',  label:'z',           type:'sep',    solved:true, hue:20,  raw:'z', dec:'z' },
  { id:'thispassword', n:'⑤', label:'thispassword', type:'field', solved:true, hue:170,
    raw:'cfobfdhgdobdgooiigdocdaoofidh', dec:'thispassword' },
  { id:'z3',     n:'',  label:'z',           type:'sep',    solved:true, hue:20,  raw:'z', dec:'z' },
  { id:'shabef1', n:'⑥', label:'shabef',     type:'token',  solved:true, hue:330, raw:'shabef', dec:'sha256' },
  { id:'ofh',    n:'⑦', label:'our first hint is your last command', type:'text', solved:true, hue:55,
    raw:'ourfirsthintisyourlastcommand', dec:'ourfirsthintisyourlastcommand' },
  { id:'blob1',  n:'⑧', label:'salph_inner AES — 1st half', type:'blob', solved:false, hue:0,
    raw:'U2FsdGVkX186tYU0hVJBXXUnBUO7C0+X4KUWnWkCvoZSxbRD3wNsGWVHefvdrd9', dec:'⟨salph_inner AES · UNDECODED⟩' },
  { id:'z4',     n:'',  label:'z',           type:'sep',    solved:true, hue:20,  raw:'z', dec:'z' },
  { id:'enter',  n:'⑨', label:'enter',       type:'binary', solved:true, hue:90,
    raw:'abbaabababbabbbaabbbabaaabbaabababbbaaba', dec:'enter' },
  { id:'blob2',  n:'⑩', label:'salph_inner AES — 2nd half', type:'blob', solved:false, hue:0,
    raw:'QvX0t8v3jPB4okpspxebRi6sE1BMl5HI8Rku+KejUqTvdWOX6nQjSpepXwGuN/jJ', dec:'⟨salph_inner AES · UNDECODED⟩' },
  { id:'shabef2', n:'⑪', label:'shabef',     type:'token',  solved:true, hue:330, raw:'shabef', dec:'sha256' },
  { id:'anstoo', n:'⑫', label:'anstoo',      type:'token',  solved:true, hue:300, raw:'anstoo', dec:'anstoo' },
];
const TYPE_LABEL = { block:'a–i block · UNDECODED', binary:'a/b binary', field:'a–i/o field-decode', token:'token', text:'plain text', blob:'AES blob', sep:'separator' };
const P = id => PARTS.find(p => p.id === id);
const LS_KEY = 'gsmg-soup-lab-v2';

export function soupWidget() {
  const html = `
  <div class="soup">
    <div class="soup-cp">
      <div class="soup-cp-row">
        <span class="soup-cp-lab">Palette:</span>
        <button class="btn ghost sm" data-all="dec">All → decoded</button>
        <button class="btn ghost sm" data-all="raw">All → raw</button>
        <button class="btn ghost sm" data-toggle="sep">Hide separators (z)</button>
        <button class="btn ghost sm" data-reset>⟲ Reset everything</button>
      </div>
      <div class="soup-cp-row">
        <span class="soup-cp-lab">Join with:</span>
        <select class="soup-join" data-join>
          <option value="">(nothing)</option>
          <option value=" ">space</option>
          <option value="·">·</option>
          <option value="-">-</option>
          <option value="|">|</option>
          <option value="\\n">newline</option>
        </select>
        <span class="soup-hint">Edit any value in place · flip <b>raw ⇄ decoded</b> · <b>add</b> a part to your recipe (as many times as you like) · <b>dbbi→yellowblueprimes</b> and <b>faed→yinyang</b> are unconfirmed guesses</span>
      </div>
    </div>

    <div class="soup-sec">
      <div class="soup-sec-h">① Soup parts <span class="faint">— edit the text, choose raw/decoded, then <b>add ＋</b> to your recipe</span></div>
      <div class="soup-palette" data-palette></div>
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
        <label class="soup-dec-form"><span>Treat as</span>
          <select data-form>
            <option value="sha256hex">sha256(string) → OpenSSL key (puzzle convention)</option>
            <option value="raw">the raw OpenSSL password</option>
            <option value="double">sha256(sha256(string))</option>
          </select></label>
        <button class="btn primary" data-decode>▶ Decrypt Cosmic with this string</button>
      </div>
      <div class="soup-verdict" data-verdict hidden></div>
    </div>
  </div>`;

  function mount(root) {
    const wrap = qs('.soup', root) || root;
    const paletteEl = qs('[data-palette]', wrap);
    const recipeEl  = qs('[data-recipe]', wrap);
    const outEl     = qs('[data-out]', wrap);
    const countEl   = qs('[data-count]', wrap);
    const joinEl    = qs('[data-join]', wrap);
    const formEl    = qs('[data-form]', wrap);
    const verdictEl = qs('[data-verdict]', wrap);

    // ── state (persisted) ──
    let uid = 1;
    let state = load() || fresh();
    function fresh() {
      return {
        vals: Object.fromEntries(PARTS.map(p => [p.id, { raw: p.raw, dec: p.dec }])), // editable copies
        form: Object.fromEntries(PARTS.map(p => [p.id, p.solved ? 'dec' : 'raw'])),   // which form the palette shows/adds
        hideSep: false,
        recipe: [],        // [{uid,partId,label,hue,value}]  ordered, allows duplicates
        join: '',
        decForm: 'sha256hex',
      };
    }
    function save() { try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch {} }
    function load() {
      try {
        const s = JSON.parse(localStorage.getItem(LS_KEY) || 'null');
        if (!s || !s.vals || !Array.isArray(s.recipe)) return null;
        for (const e of s.recipe) uid = Math.max(uid, (e.uid || 0) + 1);
        // heal against schema drift (new/removed parts)
        for (const p of PARTS) { if (!s.vals[p.id]) s.vals[p.id] = { raw:p.raw, dec:p.dec }; if (!s.form[p.id]) s.form[p.id] = p.solved ? 'dec' : 'raw'; }
        return s;
      } catch { return null; }
    }
    const paletteValue = id => state.vals[id][state.form[id]];

    // ── PALETTE render ──
    function paletteChip(p) {
      const id = p.id, isDec = state.form[id] === 'dec', v = paletteValue(id);
      return `<div class="sp-chip type-${p.type}${p.solved ? '' : ' unsolved'}" data-id="${id}" style="--hue:${p.hue}">
        <div class="sp-head">
          <span class="sp-name" title="${esc(p.label)}">${p.n ? p.n + ' ' : ''}${esc(p.label)}</span>
          <span class="sp-type">${esc(TYPE_LABEL[p.type] || p.type)}</span>
        </div>
        <textarea class="sp-val mono" data-editpal spellcheck="false" rows="2" aria-label="${esc(p.label)} value">${esc(v)}</textarea>
        <div class="sp-ctl">
          <button class="sp-flip${isDec ? ' active' : ''}" data-flip title="flip raw ⇄ decoded${p.solved ? '' : ' — unconfirmed community guess'}">${isDec ? (p.guess ? 'guess' : 'decoded') : 'raw'} ⇄</button>
          <button class="sp-add" data-add title="append to your recipe">add ＋</button>
        </div>
      </div>`;
    }
    function renderPalette() {
      paletteEl.innerHTML = PARTS.filter(p => !(state.hideSep && p.type === 'sep')).map(paletteChip).join('');
    }
    function refreshChip(id) {                       // re-render ONE palette chip (after a flip) without touching others
      const node = qs(`.sp-chip[data-id="${id}"]`, paletteEl);
      if (node) node.outerHTML = paletteChip(P(id));
    }

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
      // size each entry textarea to its content
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
    on(paletteEl, 'click', '[data-flip]', (e, b) => {
      const id = b.closest('.sp-chip').dataset.id;
      state.form[id] = state.form[id] === 'dec' ? 'raw' : 'dec';
      refreshChip(id); save();
    });
    on(paletteEl, 'input', '[data-editpal]', (e, t) => {
      const id = t.closest('.sp-chip').dataset.id;
      state.vals[id][state.form[id]] = t.value;        // persist the edit into whichever form is showing
      save();
    });
    on(paletteEl, 'click', '[data-add]', (e, b) => {
      const p = P(b.closest('.sp-chip').dataset.id);
      state.recipe.push({ uid: uid++, partId: p.id, label: p.label, hue: p.hue, value: paletteValue(p.id) });
      renderRecipe(); save();
      const last = recipeEl.lastElementChild; if (last) { last.classList.add('sr-flash'); setTimeout(() => last.classList.remove('sr-flash'), 600); last.scrollIntoView({ block: 'nearest' }); }
    });

    // ── recipe events ──
    on(recipeEl, 'input', '[data-editrec]', (e, t) => {
      const u = +t.closest('.sr-row').dataset.uid, en = state.recipe.find(x => x.uid === u);
      if (en) { en.value = t.value; }
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

    // ── recipe drag & drop reorder ──
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
    on(wrap, 'click', '[data-all]', (e, b) => { const raw = b.dataset.all === 'raw'; for (const p of PARTS) state.form[p.id] = (!raw && p.solved) ? 'dec' : 'raw'; renderPalette(); save(); });
    on(wrap, 'click', '[data-toggle="sep"]', (e, b) => { state.hideSep = !state.hideSep; b.textContent = state.hideSep ? 'Show separators (z)' : 'Hide separators (z)'; renderPalette(); save(); });
    on(wrap, 'click', '[data-clear]', () => { state.recipe = []; renderRecipe(); save(); });
    on(wrap, 'click', '[data-reset]', () => { try { localStorage.removeItem(LS_KEY); } catch {} state = fresh(); uid = 1; syncControls(); renderPalette(); renderRecipe(); verdictEl.hidden = true; });
    on(wrap, 'change', '[data-join]', () => { state.join = joinEl.value; recompute(); save(); });
    on(wrap, 'change', '[data-form]', () => { state.decForm = formEl.value; save(); });
    on(wrap, 'click', '[data-copyout]', (e, b) => copy(outEl.textContent, b));

    // ── decrypt Cosmic ──
    on(wrap, 'click', '[data-decode]', async (e, b) => {
      const s = recompute();
      if (!s) { showVerdict({ empty: true }); return; }
      b.disabled = true; const lbl = b.textContent; b.textContent = 'decrypting…';
      try {
        const pw = state.decForm === 'raw' ? s : state.decForm === 'double' ? await sha256hex(await sha256hex(s)) : await sha256hex(s);
        const r = await aesDecrypt(BLOBS.cosmic.b64, pw);
        const score = r.ok ? printScore(r.text) : 0, wif = r.ok && isWIF(r.text), opened = r.ok && score >= 0.85;
        showVerdict({ r, score, wif, opened, pw, s });
      } catch (err) { verdictEl.hidden = false; verdictEl.className = 'soup-verdict bad'; verdictEl.innerHTML = `Error: ${esc(String(err && err.message || err))}`; }
      b.disabled = false; b.textContent = lbl;
    });
    function showVerdict(o) {
      verdictEl.hidden = false;
      if (o.empty) { verdictEl.className = 'soup-verdict bad'; verdictEl.innerHTML = 'Add at least one part to the recipe first.'; return; }
      const { r, score, wif, opened } = o, pct = Math.round(score * 100);
      const cls = !r.ok ? 'bad' : wif ? 'win' : opened ? 'good' : 'bad';
      const head = !r.ok ? '✕ invalid padding — this is not the key' : wif ? '★ WIF PRIVATE KEY — this would be the 5 BTC solve!' : opened ? '✓ readable text out' : '✕ noise (valid padding but not readable — wrong recipe)';
      verdictEl.className = 'soup-verdict ' + cls;
      verdictEl.innerHTML = `
        <div class="sv-head">${head}</div>
        <div class="sv-meter"><div class="sv-meter-f" style="width:${pct}%;background:${pct >= 85 ? 'var(--teal)' : pct >= 60 ? 'var(--warn)' : 'var(--rust)'}"></div><span>${pct}% printable</span></div>
        <div class="sv-row"><span class="sv-k">OpenSSL key</span><code class="mono">${esc(o.pw)}</code></div>
        <div class="sv-row"><span class="sv-k">Cosmic decrypt (first 200)</span></div>
        <pre class="sv-pre mono">${esc(r.ok ? printable(r.text).slice(0, 200) : '(no valid decryption — the padding check failed)')}</pre>`;
    }

    function syncControls() {
      joinEl.value = state.join; formEl.value = state.decForm;
      const st = qs('[data-toggle="sep"]', wrap); if (st) st.textContent = state.hideSep ? 'Show separators (z)' : 'Hide separators (z)';
    }

    syncControls(); renderPalette(); renderRecipe();
  }

  return { html, mount };
}
