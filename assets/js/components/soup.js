// components/soup.js — the interactive SalPhaseIon "soup" lab.
// Every part of the soup (the a–i blocks, the binary tokens, the separators, the blob halves, the plain-text tokens)
// is a color-coded, draggable chip. Each chip can independently flip between its RAW soup form and its DECODED form,
// be toggled in/out of the assembly, and be re-ordered (drag, or ↑/↓, or the control panel). A live "assembled string"
// shows the current arrangement — so a solver can try any ordering / decode-state combination and copy the result.
// No framework, no build — a single mount() that wires DOM events. Data is verbatim from docs/WALKTHROUGH.md §9.

import { qs, qsa, on, esc, copy } from '../util.js';

// ── the soup, IN ORDER. raw = exact soup chunk; dec = its decoded value; solved = is the decode known. ──
const PARTS = [
  { id:'dbbi',   n:'①', label:'dbbi',        type:'block',  solved:false, hue:210,
    raw:'dbbibfbhccbegbihabebeihbeggegebebbgehhebhhfbabfdhbeffcdbbfcccgbfbeeggecbedcibfbffgigbeeeabe',
    dec:'yellowblueprimes?', guess:true },
  { id:'msl',    n:'②', label:'matrixsumlist', type:'binary', solved:true, hue:35,
    raw:'abbabbababbaaaababbbabaaabbbaabaabbabaababbbbaaaabbbaabbabbbabababbabbababbabbaaabbabaababbbaabbabbbabaa',
    dec:'matrixsumlist' },
  { id:'faed',   n:'③', label:'faed',        type:'block',  solved:false, hue:280,
    raw:'faedggeedfcbdabhhggcadcfeddgfdgbgigaaedggiafaecghggcdaihehahbahigceifgbfgefgaifabifagaegeacgbbeagfggeeggafbacgfcdbeiffaafcidahgdeefghhcggaegdebhhegeghcegadfbdiagefcicggifdcgaaggfbigaicfbhecaecbceiaicebgbgiecdeggfgegaedggfiiciiififhggcgfgdcdggefcbeeigefibgibggghhfbcgifdehedfdagicdbhicgaiedaehahghhcihdghfhbiicecbiichihiiigiddgehhdfdchcbafgfbhaheagegecafehgcfggggcagfhhghbaihidiehhfdeggdgcihggggghadahigigbgecgedfcdggaccdehiicigfbffhggaeidbbeibbeiifdgfdhieeeieeecifdgdahdiggfhegfiaffiggbcbcehceabfbedbiibfbfdedeehgigfaaiggagbeiichiedifbehgbccahhbiibibbibdcbahaidhfahiihic',
    dec:'yinyang?', guess:true },
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

export function soupWidget() {
  const html = `
  <div class="soup">
    <div class="soup-cp">
      <div class="soup-cp-row">
        <span class="soup-cp-lab">Decode:</span>
        <button class="btn ghost sm" data-all="dec">All decoded</button>
        <button class="btn ghost sm" data-all="raw">All raw</button>
      </div>
      <div class="soup-cp-row">
        <span class="soup-cp-lab">Show:</span>
        <button class="btn ghost sm" data-toggle="sep">Hide separators (z)</button>
        <button class="btn ghost sm" data-toggle="blob">Hide blob halves</button>
        <button class="btn ghost sm" data-only="unsolved">Only unsolved (dbbi/faed)</button>
        <button class="btn ghost sm" data-reset>⟲ Reset</button>
      </div>
      <div class="soup-cp-row">
        <span class="soup-cp-lab">Join with:</span>
        <select class="soup-join" data-join>
          <option value="">(nothing)</option>
          <option value=" ">space</option>
          <option value="·">·</option>
          <option value="-">-</option>
          <option value="|">|</option>
          <option value="\n">newline</option>
        </select>
        <span class="soup-hint">drag chips to re-order · click <b>raw⇄decoded</b> to flip a part · click <b>◉</b> to drop it · <b>dbbi→yellowblueprimes</b> and <b>faed→yinyang</b> are unconfirmed guesses (shown with a “?”)</span>
      </div>
    </div>

    <div class="soup-chips" data-chips></div>

    <div class="soup-out">
      <div class="soup-out-head">
        <span>Assembled string <span class="soup-count" data-count>0 chars</span></span>
        <button class="btn teal sm" data-copyout>copy</button>
      </div>
      <pre class="soup-out-str mono" data-out></pre>
    </div>
  </div>`;

  function mount(root) {
    const wrap = qs('.soup', root) || root;
    const chipsEl = qs('[data-chips]', wrap);
    const outEl = qs('[data-out]', wrap);
    const countEl = qs('[data-count]', wrap);
    const joinEl = qs('[data-join]', wrap);

    // per-part live state: order + state(dec/raw) + on(included)
    let state = fresh();
    function fresh() {
      return {
        order: PARTS.map(p => p.id),
        st: Object.fromEntries(PARTS.map(p => [p.id, p.solved ? 'dec' : 'raw'])),   // start: decoded where known
        on: Object.fromEntries(PARTS.map(p => [p.id, true])),
      };
    }
    const P = id => PARTS.find(p => p.id === id);
    const valOf = id => { const p = P(id); return state.st[id] === 'dec' ? p.dec : p.raw; };

    function chipHTML(id) {
      const p = P(id), isDec = state.st[id] === 'dec', off = !state.on[id];
      const v = valOf(id);
      const short = v.length > 90 ? v.slice(0, 90) + '…' : v;
      return `<div class="soup-chip${off ? ' off' : ''}${p.solved ? '' : ' unsolved'} type-${p.type}" draggable="true"
          data-id="${id}" style="--hue:${p.hue}">
        <div class="sc-head">
          <span class="sc-grip" title="drag to re-order">⠿</span>
          <span class="sc-name">${p.n ? p.n + ' ' : ''}${esc(p.label)}</span>
          <span class="sc-type">${esc(TYPE_LABEL[p.type] || p.type)}</span>
          <span class="sc-order"><button class="sc-mini" data-up title="move left">↑</button><button class="sc-mini" data-down title="move right">↓</button></span>
        </div>
        <div class="sc-val mono" title="${esc(v)}">${esc(short)}<span class="sc-len">${v.length}</span></div>
        <div class="sc-ctl">
          <button class="sc-btn${isDec ? ' active' : ''}" data-state title="flip raw ⇄ decoded${p.solved ? '' : ' — this decode is an unconfirmed community guess'}">${isDec ? (p.guess ? 'guess' : 'decoded') : 'raw'} ⇄</button>
          <button class="sc-btn sc-on${off ? '' : ' active'}" data-on title="include / drop from the assembled string">${off ? '◌ dropped' : '◉ in'}</button>
        </div>
      </div>`;
    }
    function render() {
      chipsEl.innerHTML = state.order.map(chipHTML).join('');
      recompute();
    }
    function recompute() {
      const join = joinEl.value.replace('\\n', '\n');
      const parts = state.order.filter(id => state.on[id]).map(valOf);
      const s = parts.join(join);
      outEl.textContent = s;
      countEl.textContent = s.length + ' chars';
    }

    // ── per-chip controls ──
    on(chipsEl, 'click', '[data-state]', (e, b) => {
      const id = b.closest('.soup-chip').dataset.id;
      state.st[id] = state.st[id] === 'dec' ? 'raw' : 'dec';   // every part flips independently (unsolved → its flagged guess)
      render();
    });
    on(chipsEl, 'click', '[data-on]', (e, b) => {
      const id = b.closest('.soup-chip').dataset.id;
      state.on[id] = !state.on[id]; render();
    });
    on(chipsEl, 'click', '[data-up]', (e, b) => move(b.closest('.soup-chip').dataset.id, -1));
    on(chipsEl, 'click', '[data-down]', (e, b) => move(b.closest('.soup-chip').dataset.id, +1));
    function move(id, d) {
      const i = state.order.indexOf(id), j = i + d;
      if (j < 0 || j >= state.order.length) return;
      state.order.splice(i, 1); state.order.splice(j, 0, id); render();
    }

    // ── drag & drop re-order (HTML5 DnD) ──
    let dragId = null;
    on(chipsEl, 'dragstart', '.soup-chip', (e, el) => { dragId = el.dataset.id; el.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
    on(chipsEl, 'dragend', '.soup-chip', (e, el) => { el.classList.remove('dragging'); qsa('.soup-chip', chipsEl).forEach(c => c.classList.remove('drop-l', 'drop-r')); });
    on(chipsEl, 'dragover', '.soup-chip', (e, el) => {
      e.preventDefault();
      if (el.dataset.id === dragId) return;
      const r = el.getBoundingClientRect(); const before = (e.clientX - r.left) < r.width / 2;
      qsa('.soup-chip', chipsEl).forEach(c => c.classList.remove('drop-l', 'drop-r'));
      el.classList.add(before ? 'drop-l' : 'drop-r');
    });
    on(chipsEl, 'drop', '.soup-chip', (e, el) => {
      e.preventDefault();
      const targetId = el.dataset.id; if (!dragId || targetId === dragId) return;
      const r = el.getBoundingClientRect(); const before = (e.clientX - r.left) < r.width / 2;
      const from = state.order.indexOf(dragId); state.order.splice(from, 1);
      let to = state.order.indexOf(targetId); if (!before) to += 1;
      state.order.splice(to, 0, dragId); dragId = null; render();
    });

    // ── control panel ──
    on(wrap, 'click', '[data-all]', (e, b) => {
      const raw = b.dataset.all === 'raw';                    // 'dec' decodes every part that HAS a decode (solved); unsolved stay raw
      for (const p of PARTS) state.st[p.id] = (!raw && p.solved) ? 'dec' : 'raw';
      render();
    });
    on(wrap, 'click', '[data-toggle]', (e, b) => {
      const t = b.dataset.toggle;
      const ids = PARTS.filter(p => t === 'sep' ? p.type === 'sep' : p.type === 'blob').map(p => p.id);
      const anyOn = ids.some(id => state.on[id]);
      ids.forEach(id => state.on[id] = !anyOn);
      b.textContent = (t === 'sep' ? (anyOn ? 'Show separators (z)' : 'Hide separators (z)') : (anyOn ? 'Show blob halves' : 'Hide blob halves'));
      render();
    });
    on(wrap, 'click', '[data-only]', (e, b) => {
      const keep = new Set(['dbbi', 'faed']);
      const allOnlyOn = PARTS.every(p => keep.has(p.id) ? state.on[p.id] : !state.on[p.id]);
      for (const p of PARTS) state.on[p.id] = allOnlyOn ? true : keep.has(p.id);
      render();
    });
    on(wrap, 'click', '[data-reset]', () => { state = fresh(); qsa('[data-toggle]', wrap).forEach(b => { b.textContent = b.dataset.toggle === 'sep' ? 'Hide separators (z)' : 'Hide blob halves'; }); joinEl.value = ''; render(); });
    on(wrap, 'change', '[data-join]', recompute);
    on(wrap, 'click', '[data-copyout]', (e, b) => copy(outEl.textContent, b));

    render();
  }

  return { html, mount };
}
