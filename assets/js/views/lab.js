// views/lab.js — the "Unused Parts" endgame workbench (a dedicated section).
// The companion to the SalPhaseIon soup lab inside the walkthrough: this one collects EVERY still-usable
// puzzle part — the four believed ingredients (with their real candidate byte-forms), the master-hint taunts,
// the two undecoded blocks, the confirmed clue strings, the chain keys, and the soup operators — into one
// draggable recipe builder you can run through the REAL crypto against any of the three open blobs.

import { qs } from '../util.js';

export default async function labView() {
  const html = `
  <section class="section"><div class="wrap">
    <div class="sec-head"><div class="sec-num">LAB</div><h2>The Unused Parts workbench</h2>
      <p>Everything the puzzle still leaves on the table — in one draggable recipe builder. The believed endgame recipe is
        <span class="mono break">sha256(yellowblueprimes · matrixsumlist · lastwordsbeforearchichoice · yinyang)</span>, but two of those four ingredients
        are still <b>guesses</b>, the master hint carries four unused <b>taunts</b>, and two SalPhaseIon blocks (<span class="mono">dbbi</span>, <span class="mono">faed</span>)
        never decoded. This lab hands you all of them as editable, cyclable parts. Assemble a passphrase, choose a target blob, and
        it runs through the <b>same in-browser crypto</b> the walkthrough uses (EVP_BytesToKey + AES-CBC) — nothing leaves your device.</p>
    </div>

    <div class="note" style="margin-bottom:16px">
      <h4 style="margin:0 0 6px">How it differs from the soup lab</h4>
      <p style="margin:0">The <a href="#/walkthrough">SalPhaseIon soup lab</a> in the walkthrough plays with the soup's <i>own</i> tokens. This one goes one level up:
      every <b>candidate value</b> for each ingredient (e.g. <span class="mono">yellowblueprimes</span> → <span class="mono">2347</span> / <span class="mono">151263</span> /
      the eleven A007522 primes / the literal word), every confirmed clue, and every chain key — and you can decrypt against the
      <b>two self-verifying 80-byte oracles</b> as well as the prize blob, where <b>valid padding alone</b> is a real signal.</p>
    </div>

    <div class="note warn" style="margin-bottom:20px">
      <p style="margin:0"><b>Honest framing.</b> No combination here is expected to open the blob — the whole recorded research effort says the final
      passphrase depends on a <b>non-public datum</b>, not an untried arrangement of public parts. This is a workbench for exploring the space and
      building intuition, not a promise. If a decrypt ever validates <i>and</i> reads as a WIF key (starting 5/K/L), that is the real solve — verify it,
      and never trust an "I solved it" claim until the prize address <span class="mono break">1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe</span> goes to zero on-chain.</p>
    </div>

    <div id="lab-parts-host"><p class="faint">loading the workbench…</p></div>
  </div></section>`;

  function mount(root) {
    const host = qs('#lab-parts-host', root);
    if (host) import('../components/parts.js')
      .then(m => { const w = m.partsWidget(); host.innerHTML = w.html; w.mount(host); })
      .catch(err => { host.innerHTML = `<div class="note warn"><p>Could not load the workbench: ${String(err && err.message || err)}</p></div>`; });
  }

  return { title: 'Lab — Unused Parts', html, mount };
}
