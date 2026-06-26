// crypto.js — OpenSSL-compatible engine (SHA-256 + EVP_BytesToKey + AES-256-CBC)
//
// This is the SAME math the GSMG puzzle uses. It must stay byte-for-byte
// compatible with OpenSSL `enc -aes-256-cbc -md sha256` and with the CI
// verifier at .github/scripts/verify.mjs. If you change the KDF or decryption
// here, change it there too.
//
// Web Crypto requires a SECURE CONTEXT (https or http://localhost). Opened as a
// file:// URL the engine is unavailable — serve the folder over http instead.

const subtle = (typeof crypto !== 'undefined' && crypto.subtle) ? crypto.subtle : null;
export const hasSecureCrypto = !!subtle;

const enc = new TextEncoder();
const dec = new TextDecoder();
const _blobCache = Object.create(null);

function concat(...arrs) {
  let n = 0; for (const a of arrs) n += a.length;
  const out = new Uint8Array(n); let i = 0;
  for (const a of arrs) { out.set(a, i); i += a.length; }
  return out;
}

function b64ToBytes(b64) {
  const s = atob(String(b64).replace(/\s+/g, ''));
  const o = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) o[i] = s.charCodeAt(i);
  return o;
}

async function sha256(buf) { return new Uint8Array(await subtle.digest('SHA-256', buf)); }

/** SHA-256 of a string → 64-char lowercase hex. The link between every door. */
export async function sha256Hex(str) {
  const h = await sha256(enc.encode(String(str)));
  return [...h].map(b => b.toString(16).padStart(2, '0')).join('');
}

/** OpenSSL EVP_BytesToKey with SHA-256 (the modern default): iterate
 *  D = SHA256(D ‖ password ‖ salt) until we have keyLen+ivLen bytes. */
export async function evpBytesToKey(passwordBytes, salt, keyLen = 32, ivLen = 16) {
  let d = new Uint8Array(0), out = new Uint8Array(0);
  while (out.length < keyLen + ivLen) { d = await sha256(concat(d, passwordBytes, salt)); out = concat(out, d); }
  return { key: out.slice(0, keyLen), iv: out.slice(keyLen, keyLen + ivLen) };
}

/** Decrypt an OpenSSL "Salted__" base64 blob with a passphrase string.
 *  Returns the plaintext. THROWS on invalid padding (i.e. wrong passphrase). */
export async function opensslDecrypt(b64, passphrase) {
  if (!subtle) throw new Error('no-secure-context');
  const raw = b64ToBytes(b64);
  if (dec.decode(raw.slice(0, 8)) !== 'Salted__') throw new Error('bad-blob');
  const salt = raw.slice(8, 16), ct = raw.slice(16);
  const { key, iv } = await evpBytesToKey(enc.encode(String(passphrase)), salt);
  const k = await subtle.importKey('raw', key, { name: 'AES-CBC' }, false, ['decrypt']);
  const pt = await subtle.decrypt({ name: 'AES-CBC', iv }, k, ct); // throws on bad pad
  return dec.decode(new Uint8Array(pt));
}

/** Read the salt (hex) from a blob without decrypting. */
export function saltOf(b64) {
  const raw = b64ToBytes(b64);
  if (dec.decode(raw.slice(0, 8)) !== 'Salted__') return null;
  return [...raw.slice(8, 16)].map(b => b.toString(16).padStart(2, '0')).join('');
}

/** Fetch a ciphertext blob by name from /ciphertexts (cached). */
export async function loadBlob(name) {
  if (_blobCache[name]) return _blobCache[name];
  const r = await fetch(`ciphertexts/${name}.txt`);
  if (!r.ok) throw new Error('blob-fetch-failed:' + name);
  const t = (await r.text()).trim();
  _blobCache[name] = t;
  return t;
}

/** Decrypt a named blob with a passphrase. Throws on wrong passphrase. */
export async function decryptBlob(name, passphrase) {
  return opensslDecrypt(await loadBlob(name), passphrase);
}

/** True/false: does this passphrase open this blob (valid padding)? */
export async function tryBlob(name, passphrase) {
  try { await decryptBlob(name, passphrase); return true; } catch { return false; }
}

/** Derive the actual OpenSSL passphrase from a human answer.
 *  prehash=true → passphrase = sha256hex(answer) (the puzzle's normal chain). */
export async function passFor(answer, prehash) {
  return prehash ? await sha256Hex(answer) : String(answer);
}

/** Heuristic: does this text contain a Bitcoin WIF private key (5/K/L…)? */
export function looksLikeWif(s) {
  return /(?:^|[^1-9A-HJ-NP-Za-km-z])[5KL][1-9A-HJ-NP-Za-km-z]{50,51}(?:[^1-9A-HJ-NP-Za-km-z]|$)/.test(String(s));
}

/** Stable dedup fingerprint for an attempt — matches the CI verifier. */
export async function attemptId(blob, recipe, prehash) {
  return sha256Hex(`${blob}|${recipe}|${prehash ? '1' : '0'}`);
}
