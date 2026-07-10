// components/demo.js — the "try it yourself" workbench per attempt. Standardized to show, for every card:
//   • the exact code (verbatim, shown)              • editable inputs (pre-filled with the SOURCE's values)
//   • an AUTHOR'S PASS that auto-runs on open        • a graphical viz per step + an overall result viz
//   • a reset-to-author's-inputs button
// A step may carry { title, body, graphic } where `graphic` is trusted inline SVG/HTML from run() (in-repo
// code, not user input). run() may also return { viz } for an overall graphic. Backward-compatible: demos
// without graphics still work. Graphical LABS (d.lab) remain the rich interactive tool.

import { DEMOS } from '../../../content/demos.js';
import { esc } from '../util.js';

// auto per-step graphic: a character-map of a step's result — letters green, digits teal, other printable
// grey, non-printable dark-red. Gives every step a graphical read without each demo hand-drawing one.
// Skips multi-line ASCII-art bodies (already visual) and very short/long ones.
function autoStrip(text) {
  const s = String(text == null ? '' : text);
  if (!s || s.indexOf('\n') >= 0 || s.length < 4 || s.length > 320) return '';
  const max = Math.min(s.length, 110), w = 5, h = 12; let cells = '';
  for (let i = 0; i < max; i++) {
    const c = s.charCodeAt(i);
    const fill = /[a-zA-Z]/.test(s[i]) ? '#2ea043' : /[0-9]/.test(s[i]) ? '#3fb0c9' : (c >= 32 && c <= 126) ? '#8b949e' : '#b3202c';
    cells += `<rect x="${i * w}" y="0" width="${w - 1}" height="${h}" fill="${fill}"/>`;
  }
  return `<svg viewBox="0 0 ${max * w} ${h}" width="100%" height="12" preserveAspectRatio="none" role="img" aria-label="character map: green=letter, teal=digit, grey=symbol, red=non-printable"><title>green=letter · teal=digit · grey=symbol · red=non-printable</title>${cells}</svg>`;
}

export function demoHtml(id) {
  const d = DEMOS[id];
  if (!d) return '';
  if (d.lab) {
    return `<details class="demo demo-lab-wrap"${d.open ? ' open' : ''}>
    <summary>🔬 ${esc(d.summary || 'Interactive lab — try it yourself')}</summary>
    <div class="demo-body" data-demo="${esc(id)}">
      ${d.intro ? `<div class="demo-intro">${d.intro}</div>` : ''}
      <div class="demo-lab" data-lab="${esc(id)}"></div>
    </div>
  </details>`;
  }
  const fields = (d.inputs || []).map(inp => `
      <div class="demo-field">
        <label>${esc(inp.label || inp.name)}</label>
        <textarea class="demo-in${inp.mono ? ' mono' : ''}" data-name="${esc(inp.name)}" rows="${inp.rows || 1}" spellcheck="false" autocomplete="off">${esc(inp.value)}</textarea>
      </div>`).join('');
  return `<details class="demo">
    <summary>🔬 ${esc(d.summary || 'The method in code — try it yourself')}</summary>
    <div class="demo-body" data-demo="${esc(id)}">
      ${d.intro ? `<div class="demo-intro">${d.intro}</div>` : ''}
      <div class="demo-pass-note faint">▶ opens with the <b>author's pass</b> — the original attempt run on the source's own inputs. Then edit any input and re-run.</div>
      <pre class="demo-code">${esc(d.code || '')}</pre>
      <div class="demo-inputs">${fields}</div>
      <div class="demo-controls"><button type="button" class="btn teal sm demo-run">▶ Run it</button><button type="button" class="btn sm demo-reset" title="restore the source author's original inputs">↺ author's inputs</button><span class="demo-hint faint">edit any input and re-run</span></div>
      <ol class="demo-steps" aria-live="polite"></ol>
      <div class="demo-viz" aria-hidden="true"></div>
      <div class="demo-out" hidden></div>
    </div>
  </details>`;
}

export function mountDemos(root) {
  if (!root) return;
  const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sleep = (ms) => new Promise(r => setTimeout(r, reduce ? 0 : ms));
  root.querySelectorAll('.demo-body[data-demo]').forEach(body => {
    const id = body.getAttribute('data-demo');
    const d = DEMOS[id];
    if (!d || body._wired) return;
    body._wired = true;
    if (d.lab) {
      const labEl = body.querySelector('.demo-lab');
      if (labEl) { try { d.lab(labEl); } catch (e) { labEl.innerHTML = '<div class="demo-out err">Lab error: ' + esc(String((e && e.message) || e)) + '</div>'; } }
      return;
    }
    const btn = body.querySelector('.demo-run');
    const resetBtn = body.querySelector('.demo-reset');
    const stepsEl = body.querySelector('.demo-steps');
    const vizEl = body.querySelector('.demo-viz');
    const outEl = body.querySelector('.demo-out');
    const inputEls = [...body.querySelectorAll('.demo-in')];
    const authorVals = {};                                        // the author's pass = the source's original inputs
    inputEls.forEach(t => { authorVals[t.getAttribute('data-name')] = t.value; });
    let running = false, ranOnce = false;

    async function runIt(isAuthorPass) {
      if (running) return;
      running = true; btn.disabled = true; btn.textContent = 'running…';
      stepsEl.innerHTML = ''; vizEl.innerHTML = ''; outEl.hidden = true; outEl.innerHTML = ''; outEl.className = 'demo-out';
      try {
        const vals = {}; inputEls.forEach(t => { vals[t.getAttribute('data-name')] = t.value; });
        const res = await d.run(vals);
        for (const s of (res.steps || [])) {
          const li = document.createElement('li');
          li.className = 'demo-step';
          const g = s.graphic || autoStrip(s.body);                                 // demo-supplied graphic, else auto char-map
          li.innerHTML = `<div class="demo-step-t">${esc(s.title)}</div>`
            + (s.body != null ? `<pre class="demo-step-b">${esc(String(s.body))}</pre>` : '')
            + (g ? `<div class="demo-step-viz">${g}</div>` : '');                    // trusted inline SVG/HTML
          stepsEl.appendChild(li);
          requestAnimationFrame(() => li.classList.add('in'));
          await sleep(360);
        }
        if (res.viz) vizEl.innerHTML = res.viz;                    // trusted overall graphic
        outEl.hidden = false;
        outEl.innerHTML = (isAuthorPass ? '<span class="demo-pass-badge" title="the attempt exactly as the source author ran it">author’s pass</span> ' : '') + esc(res.output || '');
        requestAnimationFrame(() => outEl.classList.add('in'));
      } catch (e) {
        outEl.hidden = false; outEl.className = 'demo-out err'; outEl.textContent = 'Error: ' + (e && e.message || e);
        requestAnimationFrame(() => outEl.classList.add('in'));
      }
      running = false; btn.disabled = false; btn.textContent = '▶ Run it';
    }

    btn.addEventListener('click', () => runIt(false));
    if (resetBtn) resetBtn.addEventListener('click', () => { inputEls.forEach(t => { t.value = authorVals[t.getAttribute('data-name')]; }); runIt(true); });
    // auto-run the author's pass the first time the card's workbench is opened (lazy — not on page load)
    const det = body.closest('details');
    const kick = () => { if (det.open && !ranOnce) { ranOnce = true; runIt(true); } };
    if (det) { det.addEventListener('toggle', kick); kick(); }
  });
}
