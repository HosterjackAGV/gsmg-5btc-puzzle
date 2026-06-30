// components/demo.js — the "try it yourself" player: a collapsible per attempt showing the actual
// code, editable real-data inputs, and a Run button that REVEALS each step of the method one at a
// time (the animation) and ends with the full output. Driven entirely by content/demos.js.

import { DEMOS } from '../../../content/demos.js';
import { esc } from '../util.js';

// The collapsible HTML for an attempt id (empty string if the attempt has no demo yet).
export function demoHtml(id) {
  const d = DEMOS[id];
  if (!d) return '';
  const fields = d.inputs.map(inp => `
      <div class="demo-field">
        <label>${esc(inp.label || inp.name)}</label>
        <textarea class="demo-in${inp.mono ? ' mono' : ''}" data-name="${esc(inp.name)}" rows="${inp.rows || 1}" spellcheck="false" autocomplete="off">${esc(inp.value)}</textarea>
      </div>`).join('');
  return `<details class="demo">
    <summary>🔬 The method in code — <b>try it yourself</b></summary>
    <div class="demo-body" data-demo="${esc(id)}">
      <pre class="demo-code">${esc(d.code)}</pre>
      <div class="demo-inputs">${fields}</div>
      <div class="demo-controls"><button type="button" class="btn teal sm demo-run">▶ Run it</button><span class="demo-hint faint">edit any input and re-run</span></div>
      <ol class="demo-steps" aria-live="polite"></ol>
      <div class="demo-out" hidden></div>
    </div>
  </details>`;
}

// Wire every demo player found under root.
export function mountDemos(root) {
  if (!root) return;
  const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sleep = (ms) => new Promise(r => setTimeout(r, reduce ? 0 : ms));
  root.querySelectorAll('.demo-body[data-demo]').forEach(body => {
    const id = body.getAttribute('data-demo');
    const d = DEMOS[id];
    if (!d || body._wired) return;
    body._wired = true;
    const btn = body.querySelector('.demo-run');
    const stepsEl = body.querySelector('.demo-steps');
    const outEl = body.querySelector('.demo-out');
    let running = false;
    btn.addEventListener('click', async () => {
      if (running) return;
      running = true; btn.disabled = true; btn.textContent = 'running…';
      stepsEl.innerHTML = ''; outEl.hidden = true; outEl.textContent = ''; outEl.className = 'demo-out';
      try {
        const vals = {};
        body.querySelectorAll('.demo-in').forEach(t => { vals[t.getAttribute('data-name')] = t.value; });
        const res = await d.run(vals);
        for (const s of (res.steps || [])) {
          const li = document.createElement('li');
          li.className = 'demo-step';
          li.innerHTML = `<div class="demo-step-t">${esc(s.title)}</div><pre class="demo-step-b">${esc(String(s.body))}</pre>`;
          stepsEl.appendChild(li);
          requestAnimationFrame(() => li.classList.add('in'));
          await sleep(420);
        }
        outEl.hidden = false; outEl.textContent = res.output || '';
        requestAnimationFrame(() => outEl.classList.add('in'));
      } catch (e) {
        outEl.hidden = false; outEl.className = 'demo-out err'; outEl.textContent = 'Error: ' + (e && e.message || e);
        requestAnimationFrame(() => outEl.classList.add('in'));
      }
      running = false; btn.disabled = false; btn.textContent = '▶ Run it';
    });
  });
}
