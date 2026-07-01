// labs/spectral-lab.js — REAL spectral analysis of the Decentraland puzzle audio.
// Loads puzzlepiece.mp3, lets you pick the channel mix (incl. the phase-invert L−R that
// cancels the music), computes a Short-Time Fourier Transform in-browser, and renders the
// spectrogram to a canvas — the same picture that hides "HASHTHETEXT" in the high frequencies.

import { esc } from '../util.js';

const AUDIO_URL = 'assets/walkthrough/decentraland-assets/puzzlepiece.mp3';

// iterative radix-2 FFT (in place, complex)
function fft(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { const tr = re[i]; re[i] = re[j]; re[j] = tr; const ti = im[i]; im[i] = im[j]; im[j] = ti; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = -2 * Math.PI / len, wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cwr = 1, cwi = 0;
      for (let k = 0; k < len >> 1; k++) {
        const a = i + k, b = a + (len >> 1);
        const tr = re[b] * cwr - im[b] * cwi, ti = re[b] * cwi + im[b] * cwr;
        re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti;
        const ncwr = cwr * wr - cwi * wi; cwi = cwr * wi + cwi * wr; cwr = ncwr;
      }
    }
  }
}

export function spectralLab(container) {
  container.innerHTML = `
    <div class="lab">
      <div class="lab-grid">
        <label class="lab-f"><span>Channel mix</span><select data-n="mix">
          <option value="lminusr" selected>L − R (phase invert — cancels the music)</option>
          <option value="l">Left</option><option value="r">Right</option><option value="lplusr">L + R (mono)</option></select></label>
        <label class="lab-f"><span>FFT window</span><select data-n="fft"><option>512</option><option selected>1024</option><option>2048</option></select></label>
        <label class="lab-f"><span>Contrast</span><select data-n="gamma"><option>low</option><option selected>mid</option><option>high</option></select></label>
      </div>
      <div class="lab-ctrl"><button type="button" class="glab-btn primary" data-act="run">▶ Load audio &amp; render spectrogram</button>
        <span class="lab-status faint" style="font-size:12px"></span></div>
      <div class="spectro-wrap"><canvas class="spectro" width="900" height="320"></canvas>
        <div class="spectro-axis"><span>freq ↑</span><span>time →</span></div></div>
      <p class="glab-hint faint">The hidden text lives in the <b>high frequencies</b>. Use <b>L − R</b> to cancel the shared (music) content so the planted signal stands out. This is the genuine Phase-0→SalPhaseIon audio, decoded in your browser.</p>
    </div>`;

  const cv = container.querySelector('.spectro'), ctx = cv.getContext('2d');
  const status = container.querySelector('.lab-status');
  const val = (n) => container.querySelector(`[data-n="${n}"]`).value;
  let audio = null;   // {L, R, rate}

  async function load() {
    status.textContent = 'fetching audio…';
    const buf = await (await fetch(AUDIO_URL)).arrayBuffer();
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) throw new Error('Web Audio API not available in this browser');
    const ac = new AC();
    try { if (ac.state === 'suspended') await ac.resume(); } catch { }
    status.textContent = 'decoding…';
    const ab = await Promise.race([
      ac.decodeAudioData(buf.slice(0)),
      new Promise((_, rej) => setTimeout(() => rej(new Error('audio decode unavailable here — open in a normal browser tab to see the spectrogram')), 15000)),
    ]);
    const L = ab.getChannelData(0), R = ab.numberOfChannels > 1 ? ab.getChannelData(1) : L;
    audio = { L: Float32Array.from(L), R: Float32Array.from(R), rate: ab.sampleRate };
    try { ac.close(); } catch { }
  }

  function signal() {
    const { L, R } = audio, n = L.length, s = new Float32Array(n);
    const m = val('mix');
    for (let i = 0; i < n; i++) s[i] = m === 'l' ? L[i] : m === 'r' ? R[i] : m === 'lplusr' ? (L[i] + R[i]) * 0.5 : (L[i] - R[i]);
    return s;
  }

  function render() {
    const N = +val('fft'), hop = N >> 1, s = signal(), frames = Math.floor((s.length - N) / hop);
    const cols = cv.width, bins = cv.height, img = ctx.createImageData(cv.width, cv.height);
    const win = new Float32Array(N); for (let i = 0; i < N; i++) win[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / (N - 1)); // Hann
    const gamma = { low: 0.7, mid: 0.45, high: 0.28 }[val('gamma')];
    const re = new Float64Array(N), im = new Float64Array(N);
    for (let x = 0; x < cols; x++) {
      const f = Math.min(frames - 1, Math.floor(x / cols * frames)), off = f * hop;
      for (let i = 0; i < N; i++) { re[i] = (s[off + i] || 0) * win[i]; im[i] = 0; }
      fft(re, im);
      for (let y = 0; y < bins; y++) {
        const b = Math.min((N >> 1) - 1, Math.floor((1 - y / bins) * (N >> 1)));   // low freq bottom
        const mag = Math.hypot(re[b], im[b]);
        let v = Math.pow(Math.min(1, mag * 0.06), gamma);
        const p = (y * cv.width + x) * 4;
        // viridis-ish ramp
        img.data[p] = 40 + v * 215 * (v > .5 ? 1 : .3);
        img.data[p + 1] = 20 + v * 200;
        img.data[p + 2] = 80 + (1 - v) * 120;
        img.data[p + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  async function run() {
    const btn = container.querySelector('[data-act="run"]'); btn.disabled = true;
    try { if (!audio) await load(); status.textContent = 'transforming…'; await new Promise(r => setTimeout(r, 10)); render(); status.textContent = 'done — look at the top (high-freq) band'; }
    catch (e) { status.textContent = 'audio decode not available here — ' + (e && e.message || e); ctx.fillStyle = '#0c1420'; ctx.fillRect(0, 0, cv.width, cv.height); }
    btn.disabled = false;
  }
  container.querySelector('[data-act="run"]').addEventListener('click', run);
  container.querySelectorAll('select').forEach(s => s.addEventListener('change', () => { if (audio) render(); }));
}
