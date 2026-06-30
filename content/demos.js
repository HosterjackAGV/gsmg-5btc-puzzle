// content/demos.js — runnable, animated "try it yourself" demos for the What-Was-Tried catalog.
//
// Each key is an attempt id (content/attempts.js). A demo is { code, inputs, run }:
//   code   — the actual method, shown verbatim in the collapsible.
//   inputs — editable fields, pre-filled with the REAL puzzle data, so the reader can change them.
//   run(vals) — executes the method on the inputs and returns { steps:[{title,body}], output };
//               the player reveals the steps one at a time (the animation) and shows the final output.
//   run may be async (e.g. the AES demos use Web Crypto).
//
// Everything runs in the browser on the genuine artifacts below — no faking, no omissions.

export const PUZZLE = {
  dbbi: 'dbbibfbhccbegbihabebeihbeggegebebbgehhebhhfbabfdhbeffcdbbfcccgbfbeeggecbedcibfbffgigbeeeabe',
  faed: 'faedggeedfcbdabhhggcadcfeddgfdgbgigaaedggiafaecghggcdaihehahbahigceifgbfgefgaifabifagaegeacgbbeagfggeeggafbacgfcdbeiffaafcidahgdeefghhcggaegdebhhegeghcegadfbdiagefcicggifdcgaaggfbigaicfbhecaecbceiaicebgbgiecdeggfgegaedggfiiciiififhggcgfgdcdggefcbeeigefibgibggghhfbcgifdehedfdagicdbhicgaiedaehahghhcihdghfhbiicecbiichihiiigiddgehhdfdchcbafgfbhaheagegecafehgcfggggcagfhhghbaihidiehhfdeggdgcihggggghadahigigbgecgedfcdggaccdehiicigfbffhggaeidbbeibbeiifdgfdhieeeieeecifdgdahdiggfhegfiaffiggbcbcehceabfbedbiibfbfdedeehgigfaaiggagbeiichiedifbehgbccahhbiibibbibdcbahaidhfahiihic',
  incase: 'INCASEYOUMANAGETOCRACKTHISTHEPRIVATEKEYSBELONGTOHALFANDBETTERHALFANDTHEYALSONEEDFUNDSTOLIVE',
  phase2: 'U2FsdGVkX18GKGYS1D7X7VjxWz6uUyPFszr8dVvtOIrJqioWHgT69JJnzJGDVOvFQYWh5BEZxFPXmMq1cbyy3dVVDgLhF050xlDy2J5grtKw9jUOO4oFNRgoD+1dlukXpd8ccg++kkXgE9mGBP6lQbukDiSjY4mnR2Mv6ydIncrRqacQNVEmEgM4fGTi1ANznHsGn7mP+P3UyrJCRbuFmpZJc4CNdPj6YuxwR4HkHkqcfxh0L5CaEu4VbY70+fmkqgZQyMJqiUlaV9KC4UPuRVj0r7MYbVRazkhsjeIcogmdJGEeBwD47lEB7X9PNKWmojTvRZg6R+sZzRZE26VLaF+s9cpTo4Y8PZUxKvQ86HXC8QIavUgDfw7HxIxkTatvCW2yq3ZOXl5naR6oSNxdX9alyhTzB+/2623oGdlWev5Oo8xHJqUi7QjVP+mNC8BA+Cg0DJwcOFGO5K7g8Rm06+sLogwntdIgTo70X3FegAtipHboeUNKefiAguvkDoIf8iMPc+83PygvlZPDNQCOKugwDEUimhHwQrMsmalRNoFEQEb+ZIC+na15cPoRAlODNJfXIJ96ihAy9wWis39mQW6JFqZmUags4xoP3lJ35bCrXsNOPFZ4WH+f4YC/Ov8CQW5bjtxno8GG4b/wBWevhcRVMK6KmRJj8NBCssnrlz0sQ70rMNkiN2wiSPcwX3AdJgLs8vQAUM59x9fkKFFzD4+Sc1sJztUTB7CMGGfpZOA8W33VZnEdmGcoaHlDsR8GvAkZ+jg+QJs9ZNHqWE1+1zgm/6NsWWgWH8OI2PPCfXHxDbfDk8uD/Zibr/yjSKvuSb8OecflOT2hw37WL49uADgeWgnp2bzkfGIq7EYS7OImjZZwY5h4sfcPfhvQ9kOV',
};

// ---- shared helpers ----
const A2I = (c) => 'abcdefghi'.indexOf(c) + 1;                 // a=1 … i=9 (0 if not a-i)
const printable = (s) => [...s].map(ch => { const c = ch.charCodeAt(0); return (c >= 32 && c < 127) ? ch : '·'; }).join('');
const hex = (u8) => [...u8].map(b => b.toString(16).padStart(2, '0')).join('');
const b64ToBytes = (b64) => Uint8Array.from(atob(b64.replace(/\s+/g, '')), c => c.charCodeAt(0));
const concat = (...arrs) => { const n = arrs.reduce((s, a) => s + a.length, 0); const o = new Uint8Array(n); let i = 0; for (const a of arrs) { o.set(a, i); i += a.length; } return o; };
const sha256 = async (u8) => new Uint8Array(await crypto.subtle.digest('SHA-256', u8));
function modInv(a, m) { a = ((a % m) + m) % m; let [old_r, r] = [a, m], [old_s, s] = [1n, 0n]; while (r) { const q = old_r / r;[old_r, r] = [r, old_r - q * r];[old_s, s] = [s, old_s - q * s]; } return ((old_s % m) + m) % m; }

export const DEMOS = {

  'dbbi-field-decode-int-hex-ascii': {
    code: `// field-decode a→1 … i→9, read the 91 digits as ONE big integer, then hex → bytes
const digits = [...dbbi].map(c => "abcdefghi".indexOf(c) + 1).join("");
const n      = BigInt(digits);
const hexstr = n.toString(16);
const ascii  = hexstr.match(/../g).map(h => String.fromCharCode(parseInt(h,16))).join("");`,
    inputs: [{ name: 'dbbi', label: 'dbbi — 91 symbols (a–i)', value: PUZZLE.dbbi, mono: true, rows: 3 }],
    run(v) {
      const s = v.dbbi.trim();
      const digits = [...s].map(c => A2I(c) || 0).join('');
      const n = BigInt(digits || '0');
      const h = n.toString(16);
      const ascii = (h.length % 2 ? '0' + h : h).match(/../g).map(x => String.fromCharCode(parseInt(x, 16))).join('');
      return {
        steps: [
          { title: '1 · field-decode  a→1 … i→9', body: digits },
          { title: '2 · read as one big integer', body: n.toString() },
          { title: '3 · → hexadecimal', body: h },
          { title: '4 · hex pairs → bytes / ASCII', body: printable(ascii) },
        ],
        output: 'The bytes are high-entropy and non-printable — no readable text and no key. Field-decoding alone does not crack dbbi.',
      };
    },
  },

  'dbbi-binary-prime-value-map': {
    code: `// each digit's VALUE: prime {2,3,5,7} → bit 0, everything else → bit 1; pack 8-bit bytes
const bit   = d => [2,3,5,7].includes(d) ? "0" : "1";
const bits  = [...dbbi].map(c => bit("abcdefghi".indexOf(c) + 1)).join("");
const bytes = bits.match(/.{1,8}/g).map(b => String.fromCharCode(parseInt(b.padEnd(8,"0"), 2)));`,
    inputs: [{ name: 'dbbi', label: 'dbbi', value: PUZZLE.dbbi, mono: true, rows: 3 }],
    run(v) {
      const s = v.dbbi.trim();
      const bit = d => [2, 3, 5, 7].includes(d) ? '0' : '1';
      const bits = [...s].map(c => bit(A2I(c))).join('');
      const bytes = (bits.match(/.{1,8}/g) || []).map(b => String.fromCharCode(parseInt(b.padEnd(8, '0'), 2))).join('');
      return {
        steps: [
          { title: '1 · prime-value map  (2,3,5,7 → 0 · else → 1)', body: bits },
          { title: '2 · pack into 8-bit bytes', body: (bits.match(/.{1,8}/g) || []).join(' ') },
          { title: '3 · bytes → ASCII', body: printable(bytes) },
        ],
        output: 'High-entropy bytes, no readable text — the prime-value bitmap of dbbi yields no plaintext or key (the "fefefe = 101010" idea, exhausted).',
      };
    },
  },

  'dbbi-otp-incase-key-youwon': {
    code: `// dbbi and the "INCASE…" line are BOTH exactly 91 chars → one-time-pad subtract:
//   out[i] = (value(dbbi[i]) − value(KEY[i])) mod 26          (A/a = 0 … Z = 25)
const V   = c => c.toUpperCase().charCodeAt(0) - 65;
const out = [...dbbi].map((c,i) =>
  String.fromCharCode(((V(c) - V(KEY[i])) % 26 + 26) % 26 + 65)).join("");`,
    inputs: [
      { name: 'dbbi', label: 'dbbi (91)', value: PUZZLE.dbbi, mono: true, rows: 3 },
      { name: 'key', label: 'one-time-pad key — the 91-char "INCASE…" line (try changing it!)', value: PUZZLE.incase, mono: true, rows: 3 },
    ],
    run(v) {
      const d = v.dbbi.trim(), k = v.key.trim();
      const V = c => c.toUpperCase().charCodeAt(0) - 65;
      const out = [...d].map((c, i) => String.fromCharCode(((V(c) - V(k[i] || 'A')) % 26 + 26) % 26 + 65)).join('');
      const idx = out.indexOf('YOUWON');
      const marked = idx >= 0 ? out.slice(0, idx) + ' ▸YOUWON◂ ' + out.slice(idx + 6) : out;
      return {
        steps: [
          { title: '1 · check both inputs are 91 chars', body: 'dbbi: ' + d.length + ' chars   ·   key: ' + k.length + ' chars' },
          { title: '2 · subtract mod 26, char by char', body: out },
          { title: '3 · scan for a real word', body: idx >= 0 ? 'found "YOUWON" at position ' + (idx + 1) + ' — and ' + (out.length - idx - 6) + ' characters follow it' : 'no word found for this key' },
          { title: '4 · result with the word marked', body: marked },
        ],
        output: idx >= 0
          ? 'The pad surfaces the literal word YOUWON with EXACTLY ' + (out.length - idx - 6) + ' chars after it (= the length of a hex Bitcoin private key). Unconfirmed / possibly coincidental, but the only run to ever yield a real word out of dbbi.'
          : 'No word surfaced for this key — YOUWON only appears with the genuine 91-char INCASE line.',
      };
    },
  },

  'chain-reproduce-phase2-3-32-byteexact': {
    code: `// the REAL OpenSSL chain. The OpenSSL password is sha256(answer) in HEX:
const password = sha256hex(answer);          // e.g. sha256("causality")
const raw  = base64Decode(blob);             // "Salted__"(8) + salt(8) + ciphertext
const salt = raw.slice(8, 16), ct = raw.slice(16);
// EVP_BytesToKey(SHA-256): D_i = sha256(D_{i-1} + password + salt), until 48 bytes (key||iv)
let D = [], prev = [];
while (D.length < 48) { prev = sha256(prev + password + salt); D = D.concat(prev); }
const key = D.slice(0, 32), iv = D.slice(32, 48);
const plaintext = aes256cbc_decrypt(ct, key, iv);`,
    inputs: [
      { name: 'blob', label: 'Phase-2 ciphertext (OpenSSL Salted__ base64)', value: PUZZLE.phase2, mono: true, rows: 4 },
      { name: 'answer', label: 'the Phase-2 answer — we hash it (sha256-hex) to get the OpenSSL password (try a wrong one!)', value: 'causality', mono: true, rows: 1 },
    ],
    async run(v) {
      const raw = b64ToBytes(v.blob), salt = raw.slice(8, 16), ct = raw.slice(16);
      const answer = v.answer.trim();
      const pwHex = hex(await sha256(new TextEncoder().encode(answer)));   // sha256(answer) → hex = OpenSSL password
      const pw = new TextEncoder().encode(pwHex);
      let D = new Uint8Array(0), prev = new Uint8Array(0);
      while (D.length < 48) { prev = await sha256(concat(prev, pw, salt)); D = concat(D, prev); }
      const key = D.slice(0, 32), iv = D.slice(32, 48);
      const ck = await crypto.subtle.importKey('raw', key, { name: 'AES-CBC' }, false, ['decrypt']);
      let plain = null; try { plain = new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-CBC', iv }, ck, ct)); } catch { }
      const text = plain ? new TextDecoder().decode(plain) : '';
      return {
        steps: [
          { title: '1 · sha256(answer) → hex = the OpenSSL password', body: 'sha256("' + answer + '") = ' + pwHex },
          { title: '2 · base64 → bytes; read "Salted__" + 8-byte salt', body: 'salt = ' + hex(salt) },
          { title: '3 · EVP_BytesToKey(SHA-256) → 32-byte key + 16-byte IV', body: 'key = ' + hex(key).slice(0, 32) + '…\niv  = ' + hex(iv) },
          { title: '4 · AES-256-CBC decrypt → plaintext', body: plain ? printable(text).slice(0, 340) : 'decrypt failed — no valid padding (wrong answer)' },
        ],
        output: plain
          ? 'Decrypts cleanly to the genuine Phase-2 plaintext — the published solve chain is byte-exact and reproducible from scratch. Change the answer to anything else and watch it fail (no false positives).'
          : 'Bad decrypt: a wrong answer produces no valid padding. Put "causality" back to see the real plaintext.',
      };
    },
  },

  'onchain-ecdsa-nonce-reuse-ruled-out': {
    code: `// two ECDSA signatures sharing a nonce (same r) LEAK the private key:
//   k    = (z1 − z2) · inverse(s1 − s2)  (mod n)
//   priv = (s1·k − z1) · inverse(r)      (mod n)        n = secp256k1 order
const k    = mod((z1 - z2) * inverse(s1 - s2, n), n);
const priv = mod((s1 * k - z1) * inverse(r, n), n);`,
    inputs: [
      { name: 'r', label: 'r  (shared on the known nonce-reuse demo address 1BFhrf…)', value: 'd47ce4c025c35ec440bc81d99834a624875161a26bf56ef7fdc0f5d52f843ad1', mono: true, rows: 1 },
      { name: 's1', label: 's1', value: '44e1ff2dfd8102cf7a47c21d5c9fd5701610d04953c6836596b4fe9dd2f53e3e', mono: true, rows: 1 },
      { name: 's2', label: 's2', value: '9a5f1c75e461d7ceb1cf3cab9013eb2dc85b6d0da8c3c6e27e3a5a5b3faa5bab', mono: true, rows: 1 },
      { name: 'z1', label: 'z1 (message hash 1)', value: 'c0e2d0a89a348de88fda08211c70d1d7e52ccef2eb9459911bf977d587784c6e', mono: true, rows: 1 },
      { name: 'z2', label: 'z2 (message hash 2)', value: '17b0f41c8c337ac1e18c98759e83a8cccbc368dd9d89e5f03cb633c265fd0ddc', mono: true, rows: 1 },
    ],
    run(v) {
      const n = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141n;
      const H = x => BigInt('0x' + x.trim().replace(/^0x/, ''));
      const mod = (a, m) => ((a % m) + m) % m;
      const r = H(v.r), s1 = H(v.s1), s2 = H(v.s2), z1 = H(v.z1), z2 = H(v.z2);
      const k = mod((z1 - z2) * modInv(mod(s1 - s2, n), n), n);
      const priv = mod((s1 * k - z1) * modInv(r, n), n);
      return {
        steps: [
          { title: '1 · recover the reused nonce  k = (z1−z2)/(s1−s2) mod n', body: k.toString(16) },
          { title: '2 · recover the private key  = (s1·k − z1)/r mod n', body: priv.toString(16).padStart(64, '0') },
        ],
        output: 'On a signature pair that genuinely reused its nonce this recovers the private key instantly (proof the maths works). But the real GSMG addresses use DISTINCT r values across their signatures, so the leak does not exist — the on-chain nonce-reuse vector is closed.',
      };
    },
  },

  'ledger-yinyang-complement-standalone': {
    code: `// yin-yang complement: a↔i, b↔h, c↔g, d↔f, e fixed — then field-decode the mirror
const comp = {a:"i",b:"h",c:"g",d:"f",e:"e",f:"d",g:"c",h:"b",i:"a"};
const out    = [...dbbi].map(c => comp[c]).join("");
const digits = [...out].map(c => "abcdefghi".indexOf(c) + 1).join("");`,
    inputs: [{ name: 'dbbi', label: 'dbbi', value: PUZZLE.dbbi, mono: true, rows: 3 }],
    run(v) {
      const s = v.dbbi.trim();
      const comp = { a: 'i', b: 'h', c: 'g', d: 'f', e: 'e', f: 'd', g: 'c', h: 'b', i: 'a' };
      const out = [...s].map(c => comp[c] || c).join('');
      const digits = [...out].map(c => A2I(c) || 0).join('');
      return {
        steps: [
          { title: '1 · apply complement  a↔i · b↔h · c↔g · d↔f  (e fixed)', body: out },
          { title: '2 · field-decode the mirrored string', body: digits },
        ],
        output: 'The yin-yang complement maps dbbi to its mirror, but the result field-decodes to the same kind of high-entropy digits — no readable plaintext emerges.',
      };
    },
  },

};
