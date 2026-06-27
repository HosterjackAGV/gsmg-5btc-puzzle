// lessons.js — the crash course: explain everything from absolute zero.
// Each lesson has plain-English body (HTML) and an optional interactive demo
// keyed by `demo` (handled in views/learn.js).

export const LESSONS = [
  {
    id: 'l-hash', ico: '#️⃣', title: 'What is a hash?', mins: 3, demo: 'hash',
    body: `
    <p>A <b>hash</b> is a machine that turns <em>any</em> text into a fixed-length scramble of 64 characters. The puzzle uses one called <b>SHA-256</b>.</p>
    <p><b>Everyday analogy:</b> imagine a blender. Put in a strawberry, you get a very specific pink smoothie. Put in the <em>same</em> strawberry again — the exact same smoothie, every time. Change one seed and the smoothie looks completely different. And crucially: you can <b>never un-blend</b> the smoothie back into a strawberry.</p>
    <ul class="muted">
      <li><b>Same input → same output, always.</b> That’s why it can be a “password check”.</li>
      <li><b>Tiny change → totally different output.</b> No partial credit.</li>
      <li><b>One-way.</b> You can’t reverse it — you can only guess inputs and check.</li>
    </ul>
    <p>In this puzzle, the answer to each riddle is <b>hashed</b> to produce the key that unlocks the next door. Try it below — type a word and watch its fingerprint.</p>`,
  },
  {
    id: 'l-encrypt', ico: '🔒', title: 'What is encryption (AES)?', mins: 4, demo: 'aes',
    body: `
    <p><b>Encryption</b> scrambles a message so only someone with the right <b>key</b> (passphrase) can read it. The puzzle uses <b>AES-256</b>, the same standard that protects bank traffic.</p>
    <p><b>Everyday analogy:</b> a locked diary. Anyone can hold the diary (the encrypted text is public), but without the key it’s gibberish. With the exact right key, it springs open into readable words. A <em>wrong</em> key doesn’t give you a “close” reading — it gives you nothing (the lock simply refuses).</p>
    <p>That refusal is important: when you try a wrong passphrase on a real blob, AES reports <b>“invalid padding”</b> — a clean “nope”. When you get it right, real sentences appear. There’s no ambiguity. Try opening the real Phase-2 box below by hashing the word <span class="mono">causality</span>.</p>`,
  },
  {
    id: 'l-openssl', ico: '🧂', title: 'Salt & the OpenSSL envelope', mins: 3, demo: 'salt',
    body: `
    <p>Every encrypted box in this puzzle is an <b>OpenSSL “Salted__” envelope</b>. If you base64-decode it, the raw bytes literally begin with the word <span class="mono">Salted__</span>, followed by 8 random <b>salt</b> bytes, then the ciphertext.</p>
    <p><b>Why salt?</b> It’s a pinch of randomness mixed with your passphrase before making the key, so the same password produces a different key each time it’s used. It isn’t secret — it travels in the open inside the box.</p>
    <p><b>The key-stretch (EVP_BytesToKey):</b> AES needs a 32-byte key + 16-byte starter (IV), but you typed a word. OpenSSL repeatedly hashes <span class="mono">password + salt</span> until it has enough bytes. This puzzle uses <b>SHA-256</b> for that step — which is why the OpenSSL command needs <span class="mono">-md sha256</span>.</p>
    <div class="note"><p class="mono" style="font-size:12.5px">base64 of “Salted__” is <b>U2FsdGVkX18=</b> — so every blob in this puzzle starts with <b>U2FsdGVkX1…</b>. Now you can spot one anywhere.</p></div>`,
  },
  {
    id: 'l-ciphers', ico: '🔤', title: 'Classic ciphers', mins: 4, demo: 'ciphers',
    body: `
    <p>Before computers, people hid messages with <b>pencil-and-paper ciphers</b>. Phase 3.2 uses two of them.</p>
    <p><b>Beaufort cipher</b> — a cousin of the Vigenère cipher. You line your message up against a repeating <b>keyword</b> (here, <span class="mono">THEMATRIXHASYOU</span>) and look each letter up in a grid. Neat trick: with Beaufort, <em>encrypting and decrypting are the same operation</em>.</p>
    <p><b>VIC cipher</b> — a Cold-War spy system that turns letters into digits using a <b>straddling checkerboard</b> (a little table where common letters get one digit and rare letters get two). A real Soviet agent used it; here it hides the line “the private keys belong to half and better half.”</p>
    <p>You don’t need to do these by hand — tools like <a href="https://www.dcode.fr/" target="_blank" rel="noopener">dcode.fr</a> and <a href="https://gchq.github.io/CyberChef/" target="_blank" rel="noopener">CyberChef</a> do them. The skill the puzzle tests is <em>recognising which cipher</em> you’re looking at.</p>`,
  },
  {
    id: 'l-bitcoin', ico: '₿', title: 'Bitcoin keys & the prize', mins: 4, demo: 'bitcoin',
    body: `
    <p>A <b>Bitcoin address</b> (like <span class="mono break">1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe</span>) is like a transparent glass piggy-bank: anyone can see what’s inside, but only the holder of the matching <b>private key</b> can spend it.</p>
    <p>The puzzle’s prize sits in such an address. <b>Solving the puzzle means recovering that private key</b> — usually written as a <b>WIF</b> string starting with <span class="mono">5</span>, <span class="mono">K</span>, or <span class="mono">L</span>. Decrypt the final box correctly and a WIF key falls out; import it and you can move the coins.</p>
    <div class="note key"><h4>♻️ The halving twist</h4><p>The bounty began at <b>5 BTC</b> in 2019. The creators mirror Bitcoin’s own “halving” by cutting the prize in half on each halving date: 5 → 2.5 (2020) → <b>~1.25 BTC today</b>. The peeled-off 3.75 BTC waits, untouched, in a second address. The prize has <b>never been claimed</b> by a solver — that empty-handedness is the only proof the puzzle is still open.</p></div>`,
  },
  {
    id: 'l-chain', ico: '⛓️', title: 'How it all chains together', mins: 3, demo: 'chain',
    body: `
    <p>Now the whole machine in one picture. Each phase is a <b>locked box</b>. You solve its riddle to get an <b>answer</b>; you <b>hash</b> that answer to get the <b>key</b>; the key <b>unlocks the next box</b>; inside is the next riddle. Repeat.</p>
    <p class="mono" style="font-size:13px;line-height:2">riddle → <b class="gold">answer</b> → sha256 → <b class="blue">key</b> → decrypt → next riddle → …</p>
    <p>The chain is solid and fully reproducible up to <b>Phase 3.2</b>. After that, two encoded blocks (<span class="mono">dbbi</span> and <span class="mono">faed</span>) still resist everyone — they’re the missing ingredients for the final <b>Cosmic Duality</b> box. That’s where you, and the whole community, come in.</p>
    <p>You’ve got the concepts. <a href="#/phase/phase-0">Open the first door →</a></p>`,
  },
];

export const getLesson = (id) => LESSONS.find(l => l.id === id) || null;
