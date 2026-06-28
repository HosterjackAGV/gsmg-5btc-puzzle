# GSMG.io 5 BTC Puzzle — The Complete Walkthrough

> **The authoritative, source-merged walkthrough of the unsolved GSMG.io 5 BTC cryptographic puzzle.**
> Every phase, every value, every image, and the open endgame — merged from all public sources
> (the [puzzlehunt](https://github.com/puzzlehunt/gsmgio-5btc-puzzle) and
> [Naddiseo](https://github.com/Naddiseo/gsmgio-5btc-puzzle) repositories, the creator's hint posts, and
> on-chain data), de-duplicated, cross-checked, and reproduced against the real artifacts. Where two
> sources disagree, the discrepancy is noted. Nothing is truncated.
>
> **Solve status:** solved and fully reproducible **through Phase 3.2** (plus four decoded SalPhaseIon
> tokens). The endgame — the `dbbi` & `faed` blocks and the **Cosmic Duality** decryption — is **genuinely
> OPEN**. The prize wallet `1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe` has never been swept. No "solution" posted
> anywhere has moved the coins. *No guessing — verified findings only, all negatives documented.*

---

---

## Phase 0 — Genesis Image / "The Seed Is Planted"

<div class="wt-imo">

- **Input** — The 14×14 colored genesis grid (`puzzle.png`), 196 tiles.
- **Method** — Read each tile as a bit (black/blue = 1, white/yellow = 0) in a counter-clockwise inward spiral; group the 196 bits into 8-bit bytes; decode as ASCII.
- **Output** — `gsmg.io/theseedisplanted` (the Phase 1 URL). Separately, the per-row and per-column 1-counts give the deferred `matrixsumlist` token.

</div>

<details class="wt-more"><summary>📖 Full walkthrough — the complete write-up, code, images and sources</summary>

> **Status: ✅ SOLVED and fully reproducible.** This is the entry door. It contains no private key — it is a pure decode-and-navigate gate that hands you the URL of Phase 1.

### Where it lives

The puzzle was published at **https://gsmg.io/puzzle**. The single opening picture (the "genesis image") is a hand-decoded **14×14 grid of coloured squares** — 196 tiles in four colours. It is *not* a scannable QR code; it is a bespoke spiral-decoded grid (do not call it a QR code — that wording is wrong, the actual QR appears elsewhere and decodes separately, see below).

![The genesis puzzle image](assets/walkthrough/puzzle.png)

The very first official nudge was the now-famous line, paraphrasing *The Matrix*:

> **"Follow the white rabbit."**

This points you at the white rabbit motif and, more practically, at reading the grid.

---

### The core insight: the grid is binary

Each of the 196 tiles is one **bit**. The colour-to-bit mapping is:

| Colour | Bit |
|---|---|
| **white** | `0` |
| **yellow** | `0` |
| **black** | `1` |
| **blue** | `1` |

So black/blue = `1`, white/yellow = `0`. (White and yellow are the two "0" colours; black and blue are the two "1" colours. The yellow/blue distinction is *not* needed to get the URL — it carries a separate numeric payload, described in "The blue/yellow cells" below.)

The key structural observation that unlocks the reading order: **the coloured (non-white) squares are always 8 squares apart when traced counter-clockwise starting at the top-left.** Eight squares = eight bits = one byte. That is the hint that you should read the grid as a stream of 8-bit bytes.

#### Naddiseo's color transcription (with `b`=blue, `y`=yellow placeholders kept un-resolved at first)

Before committing to "blue = 1, yellow = 0", Naddiseo transcribed the grid leaving the ambiguous colours as letters, then resolved them programmatically:

```
00110b0010110y
11b1001110b011
1101110b001001
0110b000011101
0b1000110y0110
100110y010y011
100b1100010y00
b11000000010y0
00011b0111110b
11b111y0110001
1101000y011011
11110010b01100
0b0111010y0110
01b0110110b011
```

#### The plain 0/1 grid (puzzlehunt transcription, b/y already resolved)

```
0 0 1 1 0 1 0 0 1 0 1 1 0 0
1 1 1 1 0 0 1 1 1 0 1 0 1 1
1 1 0 1 1 1 0 1 0 0 1 0 0 1
0 1 1 0 1 0 0 0 0 1 1 1 0 1
0 1 1 0 0 0 1 1 0 0 0 1 1 0
1 0 0 1 1 0 0 0 1 0 0 0 1 1
1 0 0 1 1 1 0 0 0 1 0 0 0 0
1 1 1 0 0 0 0 0 0 0 1 0 0 0
0 0 0 1 1 1 0 1 1 1 1 1 0 1
1 1 1 1 1 1 0 0 1 1 0 0 0 1
1 1 0 1 0 0 0 0 0 1 1 0 1 1
1 1 1 1 0 0 1 0 1 0 1 1 0 0
0 1 0 1 1 1 0 1 0 0 0 1 1 0
0 1 1 0 1 1 0 1 1 0 1 0 1 1
```

---

### Reading order: a counter-clockwise inward spiral

Start at the **upper-left** square and read **counter-clockwise in a spiral**, peeling the grid like an onion anti-clockwise:

1. **DOWN** the left column,
2. **RIGHT** along the bottom row,
3. **UP** the right column,
4. **LEFT** along the top row,
5. then spiral **inward** ring by ring, repeating the same DOWN → BOTTOM → RIGHT → TOP order on each shrinking ring until every tile is consumed.

#### Reproduction code (Naddiseo)

This unwraps the grid into one long bit-string, then chops it into bytes. The four helper functions peel one edge each (`left`, `bottom`, `right`, `top`), and the loop applies them in spiral order:

```python
lines='''00110b0010110y
11b1001110b011
1101110b001001
0110b000011101
0b1000110y0110
100110y010y011
100b1100010y00
b11000000010y0
00011b0111110b
11b111y0110001
1101000y011011
11110010b01100
0b0111010y0110
01b0110110b011'''.split('\n')

def top(arr):
    ''' return the top '''
    return reversed(arr[0]), arr[1:]

def left(arr):
    ''' return the first element of each line'''
    new_lines = []
    out = []
    for line in arr:
        out.append(line[0])
        new_lines.append(line[1:])
    return ''.join(out), new_lines

def bottom(arr):
    '''return the bottom line'''
    return arr[-1], arr[:-1]

def right(arr):
    '''return the last element of each line'''
    new_lines=[]
    out=[]
    for line in arr:
        out.append(line[-1])
        new_lines.append(line[:-1])
    return ''.join(reversed(out)), new_lines

ordering = [left, bottom, right, top]
out =[]
while len(lines):
    for fn in ordering:
        tout,lines = fn(lines)
        out.extend(tout)
out_string=''.join(out)
byte_strings =[out_string[i:i+8] for i in range(0, len(out_string), 8)]
print(byte_strings)
```

---

### Decoding the bytes to ASCII

A telltale sign you have it right: **none of the bytes start with `1`.** That high bit always being `0` is characteristic of 7-bit **ASCII** packed into 8-bit bytes.

Naddiseo's elegant trick for resolving the still-ambiguous blue/yellow values without guessing: assume the bytes are ASCII and check which colour assignment yields a sensible prefix.

```python
import string
# the binary representation of all the printable ascii
ascii_bytes = {c: bin(ord(c))[2:].rjust(8,'0') for c in string.printable}

# for each unknown byte, what printable ascii has a prefix match?
for unknown_byte in byte_strings:
    possible = [(c,binrep) for c,binrep in ascii_bytes.items() if unknown_byte.startswith(binrep[:7])]
    print(f"{unknown_byte}: {possible}")
```

This isn't *quite* enough to pin both colours by itself, but it shows that **if blue `b` = 1**, the first bytes spell `gsmg` (the brand), and **if yellow `y` = 0**, the next bytes continue into `gsmg.io` (the host the image was found on). That confirms the mapping. Apply it:

```python
import binascii

def translate(s):
    return s.replace('b','1').replace('y','0')

def to_ascii(binary_string):
    return int(binary_string, 2).to_bytes(1, 'little').decode()

translated = map(translate, byte_strings)
characters = map(to_ascii, translated)

print(''.join(characters))
```

#### Byte-by-byte ASCII table (puzzlehunt)

```
01100111 (103 g)
01110011 (115 s)
01101101 (109 m)
01100111 (103 g)
00101110 ( 46 .)
01101001 (105 i)
01101111 (111 o)
00101111 ( 47 /)
01110100 (116 t)
01101000 (104 h)
01100101 (101 e)
01110011 (115 s)
01100101 (101 e)
01100101 (101 e)
01100100 (100 d)
01101001 (105 i)
01110011 (115 s)
01110000 (112 p)
01101100 (108 l)
01100001 ( 97 a)
01101110 (110 n)
01110100 (116 t)
01100101 (101 e)
01100100 (100 d)
```

### Result

The 196 bits decode to **24 ASCII characters** (plus a 4-bit zero pad at the end):

> **`gsmg.io/theseedisplanted`**

Visit **http://gsmg.io/theseedisplanted** — that page begins **Phase 1 ("The Warning")**.

![Phase 1 source view](assets/walkthrough/phase1-assets/phase1-source.png)

---

### The row/column sums → `matrixsumlist`

There is a **second, independent payload** hidden in the same grid: the per-row and per-column counts of `1`-cells. These are reproduced below and verified. ✅ CONFIRMED (recomputed).

| Reading | Concatenated value | Per-line counts |
|---|---|---|
| **Row sums** | `610876654997879` | 6, 10, 8, 7, 6, 6, 5, 4, 9, 9, 7, 8, 7, 9 |
| **Column sums** | `8108108736759668` | 8, 10, 8, 10, 8, 7, 3, 6, 7, 5, 9, 6, 6, 8 |

Consistency check: both sums total **101** `1`-cells across the grid (the total number of "on" bits), which is the same regardless of whether you sum by row or by column.

> ⚠️ **Important caveat:** the row/column sums are **real and reproduce exactly, but they are NOT part of getting the Phase 1 URL.** They are a *separate, later-use* artifact called **`matrixsumlist`** — a token that resurfaces much later in the **SalPhaseIon** stage and in the final **Cosmic Duality** master hint. Presenting the sums as a Phase 0 decoding step would be misleading: they are a deferred payload you only need at the endgame. Note the value `matrixsumlist` is later confirmed independently when an `abba`-encoded binary block in SalPhaseIon decodes to exactly that word.

---

### The blue/yellow cells

The two "extra" colours (beyond plain black/white) are **blue** and **yellow**. For decoding the URL they behave identically to black and white respectively (blue = 1, yellow = 0). But their *presence as distinct colours* is itself a clue, made explicit by a later official hint (see below): **"Yellow has a number and so does Blue."** This points at the numeric row/column-sum reading — i.e., the blue and yellow tiles are flagging that the grid carries a *numeric* (`matrixsumlist`) payload in addition to the ASCII URL, and that you should "go back to the first puzzle piece" and read those numbers.

---

### The rabbit & the QR code

- **The rabbit:** the white-rabbit imagery ties the whole puzzle to *The Matrix* / *Alice in Wonderland* "follow the white rabbit / down the rabbit hole" motif that recurs throughout (the later "rabbits nest may contain a whole lot more" hint, the Cheshire-cat riddle in Phase 3, etc.).
- **The QR code:** the genesis image carries a **QR code** that, when scanned, resolves to the prize wallet on a block explorer:

  > **`https://www.blockchain.com/btc/address/1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe`**

  The prize address is **`1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe`** (a legacy P2PKH "1…" Bitcoin address). This is where the bounty sits. ✅ CONFIRMED on-chain.

  > **Note on the prize:** originally **5 BTC (2019)**. The creators halve the prize on each Bitcoin halving: **5 → 2.5 BTC (after 11 May 2020) → 1.25 BTC (after ~19 Apr 2024)**. As of this writing the prize address holds **~1.25634510 BTC**; the peeled-off 3.75 BTC sits unspent in split-off address `17ucy1K9ZUAaoY6JVtM932W9jUp5LXfyHa`. The address is **unclaimed by any solver — never swept** (the outflows are the creators' scheduled halving moves, not a solve). Do **not** describe it as "unspent": that is literally false (6 spent outputs, ~7.5 BTC sent over its life). ⚠️ Older write-ups (and the puzzlehunt README, line 18) still cite "2.5 BTC" — that figure is stale; the current value is 1.25 BTC after the second halving.

---

### The official "Roses are White" hint (retrospective, points back at this phase)

On **2020-01-14** (⚠️ the hint text is corroborated; the exact date is not independently verified) the creator posted, via the Telegram group, a poem that explicitly tells solvers to revisit the genesis image and read its *numeric* (yellow/blue) payload:

> ```
> Roses are White but often Red.
> Yellow has a number and so does Blue.
> Go back to the first puzzle piece without further ado.
>
> It might have shown you only one door, beware that the rabbits nest may contain a whole lot more.
>
> Hush hush.
> ```

This is the official confirmation that (a) the genesis grid has more than one door's worth of information in it, and (b) "Yellow / Blue have a number" = the `matrixsumlist` row/column sums above. No one publicly managed to fully exploit it at the time it was posted.

---

### Summary of canonical Phase 0 values

| Value | Status |
|---|---|
| Colour→bit mapping: white/yellow = `0`, black/blue = `1` | ✅ CONFIRMED |
| Reading order: counter-clockwise inward spiral from top-left, 8 bits/byte | ✅ CONFIRMED (independently re-implemented) |
| Decoded URL **`gsmg.io/theseedisplanted`** (24 chars + 4-bit zero pad) | ✅ CONFIRMED (reproduced) |
| Row-sums concatenated: **`610876654997879`** | ✅ CONFIRMED (reproduced) |
| Column-sums concatenated: **`8108108736759668`** | ✅ CONFIRMED (reproduced) |
| Total `1`-cells = **101** (both sums agree — consistency check) | ✅ CONFIRMED |
| These sums feed the later token **`matrixsumlist`** | ✅ CONFIRMED |
| QR code → prize address `1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe` | ✅ CONFIRMED (on-chain) |
| Grid is a bespoke spiral-decoded matrix, **not** a scannable QR (the QR is a separate element) | ✅ CONFIRMED |

### From-zero concepts introduced in this phase

**bit** (a single 0/1) · **binary** · **byte** (8 bits) · **ASCII** (the 7-bit text encoding — note the leading `0` on every byte) · **spiral reading order** · **row/column sums** · **Bitcoin address** (a public "glass piggy-bank": everyone sees the balance, only the private-key holder can spend) · **QR code** · the white-rabbit / Matrix motif that threads through the whole hunt.

</details>


---

## Phase 1 — "The Warning"

<div class="wt-imo">

- **Input** — The `theseedisplanted` page: a hidden password form plus scrambled images.
- **Method** — The scrambled images spell WARNING + LOGIC → the song "The Warning" by Logic; take the lyric right after the words "Phase two"; lowercase and strip spaces.
- **Output** — passphrase `theflowerblossomsthroughwhatseemstobeaconcretesurface`, which redirects (via two Merovingian quotes) on to Phase 2.

</div>

<details class="wt-more"><summary>📖 Full walkthrough — the complete write-up, code, images and sources</summary>

**Status: SOLVED and fully reproducible.** This phase is a pure navigation / lookup gate — it reveals **no private key**. You arrive at a web page, find a hidden password form, recognise that the on-page images and the page URL encode a song, look up one specific lyric, and submit it to be redirected to Phase 2.

> ✅ **CONFIRMED** values in this section are cross-checked against both community walkthroughs (Naddiseo and puzzlehunt) and the audited reference `docs/VERIFIED-SOLUTIONS.md`.

---

### 1.1 Where you are

Phase 0 decoded the genesis grid to the URL **`gsmg.io/theseedisplanted`**. Opening it lands you on a page full of pictures with no obvious "next" button:

![theseedisplanted page](assets/walkthrough/phase1-assets/theseedisplanted.png)

There is no visible form, link, or instruction. The next step is hidden, so you have to dig into the page itself.

---

### 1.2 The hidden POST form

Open your browser's developer tools (press **F12** in Chrome / most browsers) and look at the page source. Buried in the HTML is a **hidden form that expects a `password`**:

![Page source showing the hidden password form](assets/walkthrough/phase1-assets/phase1-source.png)

Key facts about the form (✅ CONFIRMED):

- It is a standard HTML **POST** form.
- It submits to **`https://gsmg.io/phase1verification`**.
- The single field it sends is named **`password`**.
- On a wrong answer, the server keeps you on `theseedisplanted` (you can detect this because the page still references the image `img/black_banking`). On the **correct** answer, the server responds with an HTTP **302 redirect** to a new URL.

So the whole puzzle reduces to: *what is the password?*

---

### 1.3 The scrambled images → the song "The Warning" by Logic

If you rearrange the on-page pictures, they spell out fragments. Reassembling the scrambled tiles gives **`war` + `ning` = WARNING** and **`LO` + `gic` = LOGIC**:

![The Warning by Logic — reassembled image fragments](assets/walkthrough/phase1-assets/warning-logic.png)

The full set of phrases extractable from the images is:

```
"warning"
"crypto"
"logic"
"can you"
"dig it"
"+ -"
```

If you Google those phrases as-is you don't get much. But if you **drop `crypto`** and search the rest (or if you simply already knew the song), the results point to the track **"The Warning" by the rapper _Logic_**. The `+`/`-` and the split `WAR+NING` / `LO+GIC` images are the hint that you should be *combining* the fragments into **WARNING** and **LOGIC**.

> Tip: the word **`crypto`** is a deliberate red herring in the search — it muddies the results. Remove it to find the song.

---

### 1.4 The lyrics — finding the URL and the password

Looking up the [lyrics for "The Warning"](https://www.rockol.com/uk/lyrics-61092449/logic-the-warning-inner-mix?refresh_ce) (Inner Mix), you find this passage:

> Phase one
>
> **The seed is planted** when opposites attract
>
> Can you dig it?
>
> It takes the physical to create the physical
>
> Phase two
>
> The flower blossoms through what seems to be a concrete surface
>
> I.e. greed, racism, insanity, physical and social handicaps
>
> These are the things that mob the flower
>
> Red rose or black rose; no in-between
>
> Phase 3
>
> The Judgement
>
> If it were to fall upon you today, which flower would you be?
>
> The red rose or the black?
>
> This is the warning

Two things connect this to the puzzle:

1. The current page's URL, **`theseedisplanted`**, is lifted straight from the line *"**The seed is planted** when opposites attract."* This confirms you have the right song.
2. The phrases on the images (*"Can you dig it?"*, *"warning"*) are also lyrics from this song.

Now: which line is the password? The clue is the lyric structure itself. The line that comes **immediately after the words "Phase two"** is:

> *The flower blossoms through what seems to be a concrete surface*

Following the puzzle's convention (lowercase, no spaces, no punctuation — see below), this becomes the passphrase.

**Canonical value (✅ CONFIRMED — both walkthroughs, verbatim):**

```
theflowerblossomsthroughwhatseemstobeaconcretesurface
```

---

### 1.5 Brute-checking variations (reproduction code)

Because the exact format of the password is not stated up front (case? spaces? punctuation?), Naddiseo's notebook submits many normalised variations of each candidate lyric line until the server changes its response. This is a clean, reproducible way to confirm the answer. The script POSTs to `gsmg.io/phase1verification` and watches for either a 302 redirect to a *new* location, or a changed page body:

```python
import requests
import time
import re

url = f"https://gsmg.io/phase1verification"

# here is our "check password function"
# it pretends to be the form and submits a password
# it then looks at the output to see if either we go to
# another page, or get different output
def check_password(s):
    data = {
        'password': s
    }
    # let's not hammer the site too much
    tries = 0
    while tries < 10:
        try:
            resp = requests.post(url, data, allow_redirects=False)
        except (requests.ConnectionError):
            # give the server a break, and try again
            time.sleep(5)
        else:
            if resp.status_code == 520:
                # cloudflare error
                time.sleep(5)
            else:
                break
    if tries >= 10:
        raise Exception("too many tries")

    resp.raise_for_status()
    if resp.status_code == 302:
        # we want to know if we went to a different page
        if resp.headers['Location'] != "http://gsmg.io/theseedisplanted":
            print(f"FOUND REDIRECT (password: {s})", resp.headers['Location'])
            return True
    # if the site breaks
    elif 'Oops...' in resp:
        return False
    elif 'img/black_banking' not in resp.content:
        # the page changed
        return True
    else:
        # we came back to the same page, we need to try again
        return False

# Since we don't know the format of the password, we will want to try
# variations

# not alphanumeric
an_rx = re.compile(r'[^0-9a-zA-Z]+')
# whitespace
ws_rx = re.compile(r'\s+')
# not alphanumeric nor space
ans_rx = re.compile(r'[^0-9a-zA-Z ]+')

def alphanum_only(s):
    return an_rx.sub("", s)
def remove_ws(s):
    return ws_rx.sub("", s).strip()
def alphanum_sp_only(s):
    return ans_rx.sub("", s).strip()

# lets create some variations to try
def variations(s):
    for a in [s, alphanum_only(s), alphanum_sp_only(s)]:
        for b in [a, a.lower(), a.upper()]:
            for c in [b, remove_ws(b)]:
                yield c

# this is where we keep our password ideas
IDEAS=[
    # start with one string per lyric line
    "The warning",
    "Phase one",
    "The seed is planted when opposites attract",
    "Can you dig it?",
    "It takes the physical to create the physical",
    "Phase two",
    "The flower blossoms through what seems to be a concrete surface",
    "I.e. greed, racism, insanity, physical and social handicaps",
    "These are the things that mob the flower",
    "Red rose or black rose; no in-between",
    "Phase 3",
    "The Judgement",
    "If it were to fall upon you today, which flower would you be?",
    "The red rose or the black?",
    "This is the warning",
]

def main():
    # check each variation of each idea
    for idea in IDEAS:
        for password in variations(idea):
            if check_password(password):
                return
main()
```

The variation that triggers the redirect is the lowercase, spaceless form of the "Phase two" line:
**`theflowerblossomsthroughwhatseemstobeaconcretesurface`**.

> ⚠️ Note: `gsmg.io` is now wound down, so this script can no longer be run live against the server. The answer is nonetheless ✅ CONFIRMED by both independent walkthroughs and the audited reference.

---

### 1.6 The redirect → entry to Phase 2

Submitting the correct password redirects you to a long URL. **Canonical value (✅ CONFIRMED):**

```
http://gsmg.io/choiceisanillusioncreatedbetweenthosewithpowerandthosewithoutaveryspecialdessertiwroteitmyself
```

That URL is itself a clue: it is built from **two Merovingian quotes** from *The Matrix Reloaded* (✅ CONFIRMED via Wikiquote):

- *"Choice is an illusion, created between those with power, and those without."*
- *"…a very special dessert. I wrote it myself."*

This page begins **Phase 2** ("Mr. Robot"), where the Merovingian dialogue continues with *"there is only one constant, one universal: **causality** — cause and effect,"* giving `causality` as the Phase 2 decryption password.

---

### 1.7 What this phase teaches

Two conventions established here carry through the **entire** rest of the puzzle:

- **Some hints must be Googled** to reveal their meaning (the images → a song → its lyrics).
- **Passwords and URLs are lowercase with no spaces** between words. Servers check answers by exact character match, so normalise candidates to lowercase-no-spaces-no-punctuation before submitting.

**From-zero concepts:** HTML and a *hidden* form (an `<input>`/`<form>` present in the page source but not visually rendered) · **HTTP POST** (how a browser sends form data to a server) · the **302 redirect** as the success signal · the **lowercase-no-spaces convention**.

| Item | Value | Status |
|---|---|---|
| Page entered from Phase 0 | `gsmg.io/theseedisplanted` | ✅ CONFIRMED |
| Hidden form POST target | `https://gsmg.io/phase1verification` | ✅ CONFIRMED |
| Form field name | `password` | ✅ CONFIRMED |
| Song identified | "The Warning" by **Logic** (Inner Mix) | ✅ CONFIRMED |
| Image fragments | `warning`, `crypto` (red herring), `logic`, `can you`, `dig it`, `+ -` | ✅ CONFIRMED |
| Passphrase | `theflowerblossomsthroughwhatseemstobeaconcretesurface` | ✅ CONFIRMED |
| Redirect / Phase 2 URL | `http://gsmg.io/choiceisanillusioncreatedbetweenthosewithpowerandthosewithoutaveryspecialdessertiwroteitmyself` | ✅ CONFIRMED |
| Source of the redirect URL | Two **Merovingian** quotes, *The Matrix Reloaded* | ✅ CONFIRMED |
| Private key revealed this phase | None (navigation gate only) | ✅ CONFIRMED |

</details>


---

## Phase 2 — Mr. Robot (the 7-part password)

<div class="wt-imo">

- **Input** — `phase2.txt` (OpenSSL AES blob), opened with the key `sha256("causality")`.
- **Method** — Solve the Mr-Robot riddle's seven parts — `causality` · `Safenet` · `Luna` · `HSM` · `11110` · the `0x`-genesis-coinbase hex · the full chess FEN — concatenate them, then SHA-256.
- **Output** — the Phase 3 key `1a57c572caf3cf722e41f5f9cf99ffacff06728a43032dd44c481c77d2ec30d5`.

</div>

<details class="wt-more"><summary>📖 Full walkthrough — the complete write-up, code, images and sources</summary>

**Plain English:** Phase 2 is the longest puzzle so far. Solving the Phase 1 lyric drops you onto a long Matrix-quote URL. That page (below) is split into a "PHASE 2" section and a "PHASE 3" section, and contains text clues plus a blob of base64-encoded ciphertext. You unlock the first blob with the single word **`causality`** (you actually feed OpenSSL the SHA-256 hash of that word). Inside is a **Mr. Robot–themed riddle** whose answers build a **seven-part password**. The SHA-256 of that whole concatenated string is the AES key to Phase 3.

The page you land on is reached at:

`gsmg.io/choiceisanillusioncreatedbetweenthosewithpowerandthosewithoutaveryspecialdessertiwroteitmyself`

(That URL is itself two Merovingian quotes from *The Matrix Reloaded* stitched together — see Phase 1.)

![Phase 2 page](assets/walkthrough/phase2-assets/phase2.png)

> **Concepts a beginner needs here:** *hash* (SHA-256 — a one-way fingerprint of text) · *AES-256-CBC* (symmetric encryption) · *base64* (the `U2FsdGVkX18…` "envelope" — printable letters that wrap raw bytes) · the `Salted__` header + salt · *hex* and the `0x` prefix · the Bitcoin *genesis-block coinbase message* · *chess FEN* notation · *HSM / SafeNet Luna*.

---

### 2.1 Part 1 — `causality` (decrypting the first blob)

The first section of Phase 2 reads:

> "1... are you looking for the private keymaker?" You come to me, without it. Come to me with it and you'll have the power to continue. It'll grant the first part. /(aaa, connected enf)
>
> Ciphered with aes-256-cbc /w base64 sha-256(password)

What this tells us:

- There is a **quoted string** ("are you looking for the private keymaker?") — like previous phases, this is a quote we can Google.
- The riddle refers to **"it"** — something we must "come with."
- The encrypted blob is **AES-256-CBC** then **base64**-encoded (strings starting with `U2FsdGVkX18` are openssl, because `U2FsdGVkX18` is base64 of `Salted__`).
- **`sha-256(password)`** means we hash the password with SHA-256 and use that hex digest as the OpenSSL passphrase.
- **`"1...`** is a strange marker. Three dots may mean "replace the dots with a word" — and this is the *first* part.
- **`/(aaa, connected enf)`** is a formatting clue, decoded later (see the casing/spacing legend at the end of this section).

**Googling the quote.** Searching `are you looking for the private keymaker?` (no quotation marks) first returns mostly cryptography/Bitcoin results:

![Search 1](assets/walkthrough/phase2-assets/part1-google-search-1.png)

Removing the obvious Bitcoin-related word from the query (the same trick used in the previous phase) surfaces the real theme — **The Matrix**:

![Search 2](assets/walkthrough/phase2-assets/part1-google-search-2.png)

This connects back to Phase 0 ("follow the white rabbit") and tells us the puzzle keeps referencing the Matrix films. With that lens, the long URL itself is recognizable Matrix dialogue.

![Search 3](assets/walkthrough/phase2-assets/part1-google-search-3.png)

That's two clues pointing to *The Matrix: Reloaded*.

**Reasoning out "it".** The riddle says:

> You come to me, without it. Come to me with it and you'll have the power to continue. It'll grant the first part.

The obvious guess is "choice" — but the URL literally says *"choice is an illusion."* Looking at the Merovingian's full speech:

> You see, there is only one constant, one universal, it is the only real truth: causality. Action. Reaction. Cause and effect.
> …
> Beneath our poised appearance, the truth is we are completely out of control. Causality. There is no escape from it, we are forever slaves to it. Our only hope, our only peace is to understand it, to understand the why. "Why" is what separates us from them, you from me. "Why" is the only real social power, without it you are powerless. And this is how you come to me, without "why", without power.

So choice isn't power — it's an illusion — and **causality** is "the only real power." That is "it."

**Part 1 = `causality`.** ✅ CONFIRMED.

**Decrypting.** Hash `causality` with SHA-256 and pass the hex digest to OpenSSL:

`sha256("causality")` = **`eb3efb5151e6255994711fe8f2264427ceeebf88109e1d7fad5b0a8b6d07e5bf`** (✅ recomputed)

```
openssl enc -aes-256-cbc -d -a -md sha256 -in phase2.txt \
  -pass pass:eb3efb5151e6255994711fe8f2264427ceeebf88109e1d7fad5b0a8b6d07e5bf
```

> **Note on `-md sha256`:** Modern OpenSSL (≥1.1.0) defaults the key-derivation digest to SHA-256, so the puzzlehunt README's command (which omits `-md`) works on new builds. On old OpenSSL (≤1.0.2) the default is MD5 and the decrypt fails — so always add `-md sha256` for portability. (Phase-2 AES salt, read from the file header: `06286612d43ed7ed`. ✅ extracted.)

A Python reproduction of the guess-and-decrypt loop:

```python
import hashlib, subprocess

def do_sha_hash(s):
    if isinstance(s, str): s = s.encode()
    m = hashlib.sha256(); m.update(s); return m.hexdigest()

def decrypt_file(password):
    password_hash = do_sha_hash(password)
    try:
        with open("./phase2-assets/phase2.1.txt", 'w+') as fp:
            p = subprocess.run(
                ["openssl", "aes-256-cbc", "-in", "./phase2-assets/phase2_aes.txt",
                 "-a", "-d", "-pass", f"pass:{password_hash}"],
                check=True, stdout=fp, stderr=subprocess.DEVNULL)
            p.check_returncode()
            print(f"decrypted with {password} ({password_hash})")
            return True
    except (subprocess.CalledProcessError, UnicodeDecodeError):
        pass
    return False

for guess in ["choice", "causality", "illusion"]:
    if decrypt_file(guess): break
```

---

### 2.2 The decrypted riddle (Phase 2.1)

Decryption yields the next puzzle:

```
The ironic 2name of the keymakers trying to protect the current digital powers which are still in severe danger due to the keymaker's way of security by hiding, nearly unprotected, in plain sight. {eps3.4_[in one of the valleys of Phillip]runtime-error.r00., where daughters hit magic keypads} When this fails.. Crypto finally to the latin 3Moon? Tell me, 4How so mate?
# X 2 S H 4 Y 0 Q B 15 #
Q -> extend the name of a hackers' swordless fish, the I and W are below.
B -> ((BV80605001911AP)- (sqrt(-1)))^2
H -> (Answer to only this puzzle but nothing else) * -1
S -> cha' + (vagh * jav)
Ok kid, on the highway, let put it in the worst gear.
```

Observations:

- Some words are **prefixed with numbers**: `2name`, `3Moon`, `4How`. Combined with the `1...` marker from the intro, the parts are being numbered: **1** = causality, **2** = name, **3** = Moon, **4** = How…
- The narrative could be Matrix-related — but the bracketed string `{eps3.4_[in one of the valleys of Phillip]runtime-error.r00., where daughters hit magic keypads}` is very specific.
- There's an algebraic-looking line `# X 2 S H 4 Y 0 Q B 15 #` plus four single-letter sub-clues (Q, B, H, S) to solve.

**Identifying the theme.** Googling `eps3.4_[in one of the valleys of Phillip]runtime-error.r00` points to **Mr. Robot** — `eps3.4_runtime-error.r00` is **Season 3, Episode 5** of the TV show. So this part is *Mr. Robot*, not the Matrix.

![Mr Robot search](assets/walkthrough/phase2.1-assets/mr-robot-search-1.png)

Decoding the bracket: the only Mr. Robot character named **Phillip** is **Phillip Price**, CEO of E Corp. He has a **daughter, Angela Moss** — "where daughters hit magic keypads." The episode synopsis:

> As Elliot heads to work at E Corp on September 29, he is confused when he realises he doesn't recall what happened for the past 4 days, and when he is locked out of the E Corp system. After realising that he has been fired, and that Stage 2 is happening on the same day, Elliot flees from the security and tries to head for the HSM to stop the attack, but is eventually escorted out of the building. As he stands in front of the E Corp protestors, Darlene tells him that she is working for the FBI, and reveals Angela's betrayal, much to his dismay. Shortly after this, masked men storm the E Corp building and create a riot. Irving reveals to Angela that this is the Dark Army's distraction so that Elliot can tamper with the HSM. Meanwhile, the UN allows China to annex the Congo, resulting in a victory for Whiterose. After being nearly caught twice, Angela tampers with the HSM in the secure room, but as she heads back to her office, Elliot confronts her.

Key takeaways: the episode mentions **"Stage 2"** (we're on the right track), and Angela **tampers with an HSM (Hardware Security Module)** — which explains "magic keypads" and "the keymaker's way of security by hiding, nearly unprotected, in plain sight." HSMs store digital secrets (like keys) in hardware.

---

### 2.3 Parts 2, 3, 4 — `Safenet` / `Luna` / `HSM`

> The ironic 2name of the keymakers trying to protect the current digital powers which are still in severe danger due to the keymaker's way of security by hiding, nearly unprotected, in plain sight

The "keymakers" make HSMs. Googling for the HSM in the Mr. Robot universe surfaces a real product:

![Mr Robot HSM](assets/walkthrough/phase2.1-assets/mr-robot-hsm.png)

The result is the **SafeNet Luna G5** (a real Thales/Gemalto Hardware Security Module). This solves three parts at once:

- **Part 2** ("2name", the manufacturer) = **`Safenet`**
- **Part 3** ("latin 3Moon" — *luna* is Latin for "moon") = **`Luna`**
- **Part 4** ("4How so mate?", re-read as **4H**ow **S**o **M**ate) = **`HSM`**

So parts 2–4 spell **SafeNet Luna HSM** — the device Angela tampers with. ✅ CONFIRMED.

> Reference: the Thales/SafeNet Luna HSM product page — `https://thalesdocs.com/gphsm/luna/10.1/docs/network/Content/Product_Overview/the_safenet_hsm/the_safenet_hsm.htm`.

---

### 2.4 The equation `# X 2 S H 4 Y 0 Q B 15 #`

```
# X 2 S H 4 Y 0 Q B 15 #
Q -> extend the name of a hackers' swordless fish, the I and W are below.
B -> ((BV80605001911AP)- (sqrt(-1)))^2
H -> (Answer to only this puzzle but nothing else) * -1
S -> cha' + (vagh * jav)
Ok kid, on the highway, let put it in the worst gear.
```

We see `X` and `Y` (could be variables — or **coordinates**), with four letters to solve.

#### S — Klingon numbers (Star Trek)

Googling `cha'`, `vagh`, `jav` reveals they are **Klingon numerals** (the "S" hints at *Star Trek*):

![Klingon numerals](assets/walkthrough/phase2.1-assets/klingon.png)

```
cha' = 2
vagh = 5
jav  = 6

S -> cha' + (vagh * jav)
S -> 2 + (5 * 6)
S -> 2 + 30
S -> 32
```

**S = 32.**

#### B — Intel i5 serial

`BV80605001911AP` looks like a serial number. Googling it returns an **Intel Core i5** processor:

![Intel i5](assets/walkthrough/phase2.1-assets/intel-i5.png)

```
BV80605001911AP = i5
B -> ((BV80605001911AP) - (sqrt(-1)))^2
B -> (i5 - i)^2
```

Because it's spelled "i5" (not "5i"), there are two readings:

- **B1** = `(4i)^2` = `(5i − 1i)^2` = **−16**
- **B2** = `(5)^2` = "i5 with the i removed, squared" = **25**

We resolve which one later (it's **B2 = 25**, see below).

#### Q — Elliot's fish (QWERTY)

> Q -> extend the name of a hackers' swordless fish, the I and W are below.

The Mr. Robot hacker is Elliot. Googling whether he has a fish:

![QWERTY](assets/walkthrough/phase2.1-assets/qwerty.png)

His fish is named **qwerty** (matching the variable "Q"). "Extend the name" → the full top keyboard row `qwertyuiop`. "The I and W are below" means: which **numbers** sit above those letters?

```
1234567890
qwertyuiop
```

`i` is below **8**, `w` is below **2**, so **Q = 82**.

#### H — Hitchhiker's Guide (42)

> H -> (Answer to only this puzzle but nothing else) * -1

Googling the phrase with the Mr. Robot context yields nothing useful (`H-nothing-useful.png`). Dropping the Mr. Robot context and treating **H** itself as a clue points to **"The Hitchhiker's Guide to the Galaxy"**:

![H guide](assets/walkthrough/phase2.1-assets/H-guide.png)

The famous question seeks the "Answer to the Ultimate Question of Life, The Universe, and Everything." The puzzle's phrasing — "Answer to only this puzzle but **nothing else**" — is the deliberate *opposite*. The `* -1` ("negate") flips "only this, nothing else" into "**everything**." The Answer to everything is **`42`**.

**H = 42.**

#### Putting it together — reverse to coordinates

> Ok kid, on the highway, let put it in the worst gear.

The worst gear for a highway is **reverse** — so after substituting we **reverse** the result.

Trying **B1 = −16** first:

```
# X 2 S H 4 Y 0 Q B 15 #   with S=32 H=42 Q=82 B=-16
# X 2 32 42 4 Y 0 82 -16 15 #
reversed:
# 51 61- 28 0 Y 4 24 23 2 X #
```

Four numbers, then `Y`, then five numbers, then `X` — that's a **geographic coordinate** (lat/long), with Y before X. But "61 minutes" is impossible (minutes max out at 59), so B1 is wrong. Using **B2 = 25**:

```
# X 2 S H 4 Y 0 Q B 15 #   with S=32 H=42 Q=82 B=25
# X 2 32 42 4 Y 0 82 25 15 #
reversed:
# 51 52 28 0 Y 4 24 23 2 X #
```

Coordinates: **51° 52' 28.0" N, 4° 24' 23.2" E**.

![coords](assets/walkthrough/phase2.1-assets/coords.png)

It isn't obvious what those point at on their own — but since this part is about a physical SafeNet Luna HSM, checking where SafeNet Technologies is located:

![SafeNet coords](assets/walkthrough/phase2.1-assets/safenet-coords.png)

SafeNet Technologies sits **very close** to the decoded coordinates — confirming that the parts-2/3/4 decoding (and B2) are correct.

> ⚠️ **What the equation is "for":** The equation/coordinates are a **consistency check** that confirms SafeNet/Luna/HSM — they are *not* themselves a password part. The seven password parts are listed in 2.7.

---

### 2.5 Part 5 — `11110`

The next part ("5binary code") is a long rambling paragraph. Working through it:

> There's a guy who theorised the idea that 'Any linear electrical network with voltage and current sources and only resistances can be replaced at terminals A–B by an equivalent current source Ino in parallel connection with an equivalent resistance Rno'.

This is **Norton's Theorem** (Edward Lawry Norton — and independently Hans Ferdinand Mayer).

> He might have been insecure. His competition might have been that as well. However, after enough belikins this competition tried to become a ruler of a piece of land that's technically the poorest of the entire planet.

(Not fully understood. Possibly "the USA" interpreted via foreign debt as "technically the poorest.")

> 4 rulers have shared the first name of the competition. 2 had the firstname in the surname.

The USA had **four presidents named "John"** (John Adams, John Quincy Adams, John Tyler, John F. Kennedy) and **two with the surname "Johnson"** (Andrew Johnson, Lyndon B. Johnson) — "John" appears inside "Johnson."

> One of the rulers had a number, and dirty too.

→ **JFK** = John **F**itzgerald **K**ennedy (the "number"/middle-initial ruler). (The "dirty" word is debated — one reading ties it to corruption-themed coverage of LBJ; the consensus solve treats the chain as pointing to JFK.)

> Another had a resemblance to Carrey, James Gates, also Simulacra and Simulation.

- **James (Jim) Gates** — American theoretical physicist.
- **Carrey** — actor **Jim** Carrey.
- **"Simulacra and Simulation"** — Baudrillard's philosophy book (a Matrix theme: *"The simulacrum is never that which conceals the truth—it is the truth which conceals that there is none. The simulacrum is true."*).
- (This sentence is otherwise unsolved.)

> Another ruler was at some point a floating zerg house while being under control of the dirty one.. too.

(Unsolved.)

> The one after died too soon.

→ JFK was assassinated; **Lyndon B. Johnson** took over after him.

> Moral: never execute an order that revokes the highest power or you might suddenly get killed. The 5binary code is a part of the piece of this puzzle.

"Execute an order" → JFK's **Executive Orders**. Several have five-digit numbers that look like binary:

1. `11000` — emergency preparedness, Secretary of Labor
2. `11001` — emergency preparedness, Secretary of Health, Education, and Welfare
3. `11010` — amending EO 10713 (Ryukyu Islands)
4. `11011` — emergency board, Trans World Airlines dispute
5. `11100` — President's Commission on Registration and Voting Participation
6. `11101` — emergency board, Eastern/Western/Southwestern Carriers
7. `11110` — amending EO 10289 re: Department of the Treasury
8. `11111` — assistance to remove obstructions of justice in Alabama

**Part 5 = `11110`.** ✅ CONFIRMED *(value)*.

> ⚠️ **Why `11110` (disputed/partly brute-forced).** Both community walkthroughs admit the on-page logic for landing on `11110` over the other seven candidates is a stretch — the value was effectively confirmed by **trying all eight** until the final hash matched. The *thematic* justification offered is **EO 11110** (which directed Treasury actions affecting the Federal Reserve and is sometimes — disputedly — linked to JFK's assassination, matching "never execute an order that revokes the highest power or you might suddenly get killed"). The **value** is confirmed; the **"why"** is ⚠️ UNVERIFIED. The brute-force loop simply iterates `part5 ∈ {11000…11111}` against the Phase-3 blob.

---

### 2.6 Part 6 — the genesis-block hex

> Years later the idea of this _green_ came _back_. Looking at the current state of nature not quickly enough. Afraid for random magic pieces of metal, that moved in directions that science couldn't and still can't explain, coming from places where inspiring papers used to be deposited, a chancellor awaiting banks to be bailed out decided to write an anarchist digital answer to this worlds' misery. Its' raw data after 4 on row 1616 to be one of the last pieces of this part required in order to continue this riddle.
>
> /(aBa, connected enf)

Decoding:

- "banks to be bailed out" / "a chancellor awaiting banks to be bailed out" → the **2008 financial crash**.
- "an anarchist digital answer to this worlds' misery" → **Bitcoin** (created in response to 2008).
- Bitcoin's **genesis block** embeds *The Times* headline *"Chancellor on brink of second bailout for banks."*
- "row 1616" → **line 1616** of the original Bitcoin source code (`main.cpp`), which contains the coinbase scriptSig:

```c
// line 1616 of main.cpp
// txNew.vin[0].scriptSig = 486604799 4 0x736B6E616220726F662074756F6C69616220646E6F63657320666F206B6E697262206E6F20726F6C6C65636E61684320393030322F6E614A2F33302073656D695420656854
```

Part 6 is the hex string **after the `4`**:

**Part 6 = `0x736B6E616220726F662074756F6C69616220646E6F63657320666F206B6E697262206E6F20726F6C6C65636E61684320393030322F6E614A2F33302073656D695420656854`**

This hex decodes to the **reversed** genesis message — "*…sknab rof tuoliab dnoces… ehT*" = "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks" written backwards. ✅ CONFIRMED.

> ⚠️ **Gotcha:** the literal **`0x`** prefix must be kept in the password. Dropping it breaks the final hash.

(Reference source line: `https://sourceforge.net/p/bitcoin/code/133/tree/trunk/main.cpp#l1616`.)

---

### 2.7 Part 7 — the chess FEN

> B5KR/1r5B/6R1/2b1p1p1/2P1k1P1/1p2P2p/1P2P2P/3N1N2 w - - 0 1
>
> And now a buddhist is forced to move. What will be the next situation?
>
> /(aBa, connected not enf)

This is **algebraic chess notation (FEN)**. A "buddhist" (non-violent) move = a move that doesn't take a piece **and** doesn't deliver checkmate. The question asks for the position *after* that move ("the next situation").

![Chess position](assets/walkthrough/phase2-assets/chess.png)

Using a tool like [nextchessmove.com](https://nextchessmove.com/): White is to move and must make the **only** move that does **not** cause checkmate. Methodically testing each white piece, the unique non-mating move is the **white rook to c6**. The resulting position (now Black to move) is:

**Part 7 = `B5KR/1r5B/2R5/2b1p1p1/2P1k1P1/1p2P2p/1P2P2P/3N1N2 b - - 0 1`**

✅ CONFIRMED. (This is a well-known chess problem — it also appears solved on `chess.stackexchange.com/questions/27130/uniquely-satisfying-puzzle` — but you still need to read the FEN. Note the trailing piece-placement change `6R1` → `2R5` and the side-to-move flip `w` → `b`.)

---

### 2.8 The casing/spacing legend (the `/(aaa…)` clues)

The strings sprinkled through Phase 2 are formatting instructions for how each part must be typed:

| Marker | Where it appeared | Meaning |
|---|---|---|
| `/(aaa, connected enf)` | Part 1 (causality) | **all lowercase**, **no spaces** (`connected enf` = "no spaces") |
| `/(aBa, connected enf)` | Part 6 (genesis hex) | **mixed case — keep as-is**, **no spaces** |
| `/(aBa, connected not enf)` | Part 7 (chess FEN) | **mixed case — keep as-is**, **keep the spaces** |

Decoded: `aaa` = all lowercase · `aBa` = mixed/keep original casing · `connected enf` = no spaces · `connected not enf` = leave the spaces in.

Because parts 2–4 didn't come with an explicit casing marker, their case must be tried (lowercase / UPPERCASE / Title) until the final hash matches. The casing that works in the canonical password is **`Safenet`** (capital S, lowercase rest), **`Luna`**, **`HSM`**.

A reproduction that sweeps casings and the eight EO candidates:

```python
def case_variations(s):
    yield s.lower(); yield s.upper(); yield s.title()

p1 = 'causality'                       # lowercase
part2 = list(case_variations('SafeNet'))
part3 = list(case_variations('Luna'))
part4 = list(case_variations('HSM'))
part5 = ['11000','11001','11010','11011','11100','11101','11110','11111']
p6 = '0x736B6E616220726F662074756F6C69616220646E6F63657320666F206B6E697262206E6F20726F6C6C65636E61684320393030322F6E614A2F33302073656D695420656854'
p7 = 'B5KR/1r5B/2R5/2b1p1p1/2P1k1P1/1p2P2p/1P2P2P/3N1N2 b - - 0 1'

for p2 in part2:
  for p3 in part3:
    for p4 in part4:
      for p5 in part5:
        password = f"{p1}{p2}{p3}{p4}{p5}{p6}{p7}"
        if decrypt_file(password):
          ...   # match: p2=Safenet, p3=Luna, p4=HSM, p5=11110
```

---

### 2.9 The seven parts → Phase 3 key

| # | Part | Value | Status |
|---|---|---|---|
| 1 | causality | `causality` | ✅ CONFIRMED |
| 2 | name (manufacturer) | `Safenet` | ✅ CONFIRMED |
| 3 | latin moon | `Luna` | ✅ CONFIRMED |
| 4 | how so mate | `HSM` | ✅ CONFIRMED |
| 5 | binary code (EO) | `11110` | ✅ CONFIRMED *(value; "why" ⚠️)* |
| 6 | genesis-block hex | `0x736B6E616220726F662074756F6C69616220646E6F63657320666F206B6E697262206E6F20726F6C6C65636E61684320393030322F6E614A2F33302073656D695420656854` | ✅ CONFIRMED |
| 7 | chess FEN | `B5KR/1r5B/2R5/2b1p1p1/2P1k1P1/1p2P2p/1P2P2P/3N1N2 b - - 0 1` | ✅ CONFIRMED |

Concatenate all seven **with no separators** (parts 1–6 contain no spaces; part 7 keeps its spaces):

```
causalitySafenetLunaHSM111100x736B6E616220726F662074756F6C69616220646E6F63657320666F206B6E697262206E6F20726F6C6C65636E61684320393030322F6E614A2F33302073656D695420656854B5KR/1r5B/2R5/2b1p1p1/2P1k1P1/1p2P2p/1P2P2P/3N1N2 b - - 0 1
```

SHA-256 of that full string is the **Phase 3 key**:

**`1a57c572caf3cf722e41f5f9cf99ffacff06728a43032dd44c481c77d2ec30d5`**

✅ CONFIRMED (recomputed, and it chain-decrypts Phase 3).

```
openssl enc -aes-256-cbc -d -a -md sha256 -in phase3.txt \
  -pass pass:1a57c572caf3cf722e41f5f9cf99ffacff06728a43032dd44c481c77d2ec30d5
```

> ⚠️ **Two truncation/format traps — read this:**
> 1. **Keep the `0x` prefix** on part 6.
> 2. **Use the FULL chess FEN** for part 7 (`B5KR/1r5B/2R5/…  b - - 0 1`), **not just `B5KR`**. Naddiseo's README prose renders the concatenated password truncated at `…B5KR` — that truncated string does **not** hash to `1a57c572…`. The puzzlehunt README gives the complete, hash-matching string shown above; use it.

> **What this stage reveals:** no Bitcoin private key — Phase 2 is purely a password-building gate. The reward of solving it is the AES key into Phase 3.

**Lessons from Phase 2:** the URL itself is a clue; `...` can mean "replace with a word"; hints are sometimes metaphorical, not literal; and casing/spacing markers (`/(aBa, connected enf)`) are load-bearing for the final hash.

</details>


---

## Phase 3 — "Free Will"

<div class="wt-imo">

- **Input** — `phase3.txt`, opened with the Phase-2 key.
- **Method** — Solve three riddles → `jacquefresco` · `giveitjustonesecond` · `heisenbergsuncertaintyprinciple`; concatenate; SHA-256.
- **Output** — the Phase 3.2 key `250f37726d6862939f723edc4f993fde9d33c6004aab4f2203d9ee489d61ce4c`.

</div>

<details class="wt-more"><summary>📖 Full walkthrough — the complete write-up, code, images and sources</summary>

**Plain English:** Phase 2 ended by handing us the SHA-256 key `1a57c572caf3cf722e41f5f9cf99ffacff06728a43032dd44c481c77d2ec30d5`. We use that key to decrypt the next encrypted blob, `phase3.txt`. Out come **three short riddles**. Each riddle has a one-word-ish answer; solve all three, glue the lowercase answers together with no spaces, take the SHA-256 of the whole thing — and that is the key to the *next* blob, Phase 3.2.

> **Status: ✅ SOLVED and fully reproducible.** Every value in this section was independently recomputed and decrypts cleanly.

### 3.0 — Decrypt `phase3.txt`

Decrypt the Phase 3 blob with the Phase-2 key (OpenSSL `aes-256-cbc`, base64-armored, SHA-256 KDF — the same recipe used in every phase):

```bash
openssl enc -aes-256-cbc -d -a -md sha256 -in phase3.txt \
  -pass pass:1a57c572caf3cf722e41f5f9cf99ffacff06728a43032dd44c481c77d2ec30d5
```

- `-d` decrypt · `-a` the input is base64 · `-md sha256` digest for the key-derivation (required on old OpenSSL, harmless on new) · OpenSSL reads the salt out of the file header automatically.
- **Phase 3 (`phase3.txt`) salt:** `9fbc451d13d071f4` (read directly from the file header). ✅ CONFIRMED.

> ⚠️ **Salt-labeling trap:** `9fbc451d13d071f4` is the salt of `phase3.txt` (the riddle blob). The *next* blob, `phase32.txt`, has a **different** salt, `eefc4c5befc1656a`. Don't conflate them.

The decrypted plaintext is the three riddles plus a parting instruction:

```
What if the merovingian is wrong. What instead of causality something else could be ours? Therefor, if so, the ...... is ours. The thinker's 1name behind all of that would grant you access to the next step (of humanity). Definitely look into his works might you have time. /(aa,connected enf)

I just passed a cheshire cat and I'm getting fed up with this puzzle.. It's taking forever. But, How long is forever? I don't know, but just add giveit in front of the answer and you can fall in the keyhole. /(aa,connected enf)

3.The fundamental limit to the precision with which certain pairs of physical properties are know. /(aa,connected enf)

Phase 3.2 is ciphered with aes-256-cbc base64 and a sha256 pw, yet again.
```

(The blob also bundles the next encrypted file, the [Phase 3.2 AES blob](assets/walkthrough/phase3-assets/phase3.2-aes.txt), for the following section.)

#### Reading the formatting hints

Three recurring conventions from earlier phases tell us exactly how to format each answer:

- **The ellipsis `......`** signals "replace this with a value." Here it's the missing word in *"the ...... is ours."*
- **`/(aa,connected enf)`** is the same style of comment we saw before. It means **a**ll lowercase, words **a**nd **connected** (i.e. no spaces), no punctuation — `enf` = "end" marker. In short: lowercase, run-together, alphanumeric only.
- **The digit-word `1name`** is another "digit glued to a word" artifact (like earlier phases). It just emphasises that we want the thinker's **name**.

A small helper normalises any phrase into the required form (strip everything non-alphanumeric, lowercase):

```python
import re
an_rx = re.compile(r'[^0-9a-zA-Z]+')
def lower_connected(s):
    return an_rx.sub("", s).strip().replace(' ', '').lower()
```

### 3.1 — Riddle 1: "the thinker behind free will" → `jacquefresco`

Read the opening: *"What if the merovingian is wrong. What instead of causality something else could be ours?"* In *The Matrix Reloaded*, the Merovingian preaches **causality** ("everything begins with choice — no, wrong; choice is an illusion"). If he is *wrong*, then the opposite of causality is **choice**. So the sentence completes to **"therefor, if so, the *choice* is ours."** We're hunting for a "thinker" associated with the phrase *"the choice is ours"* whose work is broadly about *"access to the next step of humanity."*

![search 3.1.1](assets/walkthrough/phase3-assets/google-3.1.1.png)

Searching turns up a film, **"The Choice is Ours,"** which "explores many aspects of our society and sets about rethinking the possibilities available to us in our world, dispelling the myth of so-called 'Human Nature,' insisting that it is our environment which shapes our behaviour" — a premise thematically close to Bitcoin's founding ethos. The film is by **The Venus Project**.

![Venus Project / Jacque Fresco](assets/walkthrough/phase3-assets/venus-project.png)

The Venus Project was founded by the futurist **Jacque Fresco** — he is "the thinker." The riddle even nudges us: *"Definitely look into his works might you have time."*

> Supporting quote (per the puzzlehunt write-up), attributed to Fresco and matching the "free will" theme: *"The future is fluid. Each act, each decision, and each development creates new possibilities and eliminates others. The future is ours to direct."*

Apply the formatting rule (`lower_connected("Jacque Fresco")`):

- **Answer 1: `jacquefresco`** ✅ CONFIRMED.

### 3.2 — Riddle 2: Cheshire Cat / "just one second" → `giveitjustonesecond`

*"I just passed a cheshire cat … How long is forever? … just add giveit in front of the answer and you can fall in the keyhole."* The Cheshire Cat points straight to *Alice in Wonderland* (another Matrix-adjacent "down the rabbit hole" motif). The exchange being quoted is:

> **Alice:** How long is forever? **White Rabbit:** Sometimes, just one second.

![Just one second (Cheshire)](assets/walkthrough/phase3-assets/just-one-second.png)

The first search result gives the answer **"Sometimes, just one second."** The riddle tells us to prepend `giveit`. Naïvely that's *"giveit sometimes just one second"* — but that doesn't read cleanly, and we know the answer must be lowercase with no spaces/punctuation. Dropping the lead-in word *"Sometimes,"* leaves the sentence that actually makes sense: **"give it just one second."** Normalised:

- **Answer 2: `giveitjustonesecond`** ✅ CONFIRMED.

### 3.3 — Riddle 3: physics definition → `heisenbergsuncertaintyprinciple`

*"The fundamental limit to the precision with which certain pairs of physical properties are know[n]."* This is the textbook definition of the **Heisenberg uncertainty principle**.

![search 3.1.3](assets/walkthrough/phase3-assets/google-3.1.3.png)

Several casings/wordings are plausible — `uncertainty principle`, `the uncertainty principle`, `Heisenberg uncertainty principle`, `Heisenberg's uncertainty principle` — so we try candidates and keep the one whose resulting concatenation actually decrypts Phase 3.2. The winner is the possessive form:

- **Answer 3: `heisenbergsuncertaintyprinciple`** (note the internal **`s`** right after *heisenberg*). ✅ CONFIRMED — this is the form that hashes correctly and decrypts the next blob.

> ⚠️ **Spelling trap (reconciled disagreement):** The puzzlehunt README's prose lists the answer as *"Heisenberg uncertainty principle"*, which normalises to `heisenberguncertaintyprinciple` **without** the internal `s`. That spelling hashes to the **wrong** value and does **not** decrypt Phase 3.2. The correct, hash-matching, decryption-proven form is **`heisenbergsuncertaintyprinciple`** — keep the `s`.

### 3.4 — Concatenate → SHA-256 → the Phase 3.2 key

Glue the three normalised answers together (no separators), then SHA-256 the result. This mirrors the brute-force-friendly approach from earlier phases: build candidate part 3 strings, and the first one that decrypts wins.

```python
import re, hashlib, subprocess

phase3_aes_file = "./phase3-assets/phase3.2-aes.txt"

def do_sha_hash(s):
    if isinstance(s, str):
        s = s.encode()
    m = hashlib.sha256()
    m.update(s)
    return m.hexdigest()

def decrypt_file(password):
    password_hash = do_sha_hash(password)
    try:
        # subprocess to openssl is easier than doing AES decryption in pure python
        with open("./phase3-assets/phase3.2.txt", "w+") as fp:
            p = subprocess.run(
                ["openssl", "aes-256-cbc", "-in", phase3_aes_file,
                 "-a",            # input is base64 ("armoured")
                 "-d",            # decrypt
                 "-pass", f"pass:{password_hash}"],
                check=True, stdout=fp, stderr=subprocess.DEVNULL,
            )
            p.check_returncode()
            print(f"decrypted with {password} ({password_hash})")
            return True
    except subprocess.CalledProcessError:
        pass
    return False

an_rx = re.compile(r'[^0-9a-zA-Z]+')
def lower_connected(s):
    return an_rx.sub("", s).strip().replace(' ', '').lower()

p1 = lower_connected("Jacque Fresco")
p2 = lower_connected("give it just one second")
part3 = [
    "uncertainty principle",
    "the uncertainty principle",
    "Heisenberg uncertainty principle",
    "Heisenberg's uncertainty principle",
]

for p3 in map(lower_connected, part3):
    password = f"{p1}{p2}{p3}"
    if decrypt_file(password):
        break
else:
    print("Did not find password")
```

**Canonical values:**

| Value | Status |
|---|---|
| Answer 1 | `jacquefresco` — ✅ CONFIRMED |
| Answer 2 | `giveitjustonesecond` — ✅ CONFIRMED |
| Answer 3 | `heisenbergsuncertaintyprinciple` (internal `s`) — ✅ CONFIRMED |
| Full concatenation | `jacquefrescogiveitjustonesecondheisenbergsuncertaintyprinciple` — ✅ CONFIRMED |
| **SHA-256 of the concatenation = the Phase 3.2 key** | **`250f37726d6862939f723edc4f993fde9d33c6004aab4f2203d9ee489d61ce4c`** — ✅ CONFIRMED (independently recomputed) |
| Phase 3.2 plaintext (what this key unlocks) | the **"Architect" speech** from *The Matrix Reloaded* — ✅ CONFIRMED (decrypts cleanly) |

So:

```
SHA256("jacquefrescogiveitjustonesecondheisenbergsuncertaintyprinciple")
  = 250f37726d6862939f723edc4f993fde9d33c6004aab4f2203d9ee489d61ce4c
```

This 64-character hash is the password to the Phase 3.2 blob, which is handled in the next section.

> Note: like Phase 1, this stage reveals **no Bitcoin private key** — it's a pure riddle-and-lookup gate that produces the next decryption key.

**From-zero concepts used here:**
- **SHA-256** — a one-way fingerprint function: any input → a fixed 64-hex-character output; you can't reverse it, but the same input always gives the same output (so the puzzle author can publish the encrypted blob and you re-derive the key by guessing the words).
- **AES-256-CBC + base64 + SHA-256 KDF** — the standard OpenSSL "encrypt with a passphrase" container used throughout this puzzle; here the passphrase *is* the 64-hex SHA-256 string.
- **Salt** — 8 random bytes stored in the file header (`Salted__…`) that season the key derivation; non-secret, read automatically by OpenSSL.
- **Concatenation** — simply joining strings end-to-end with nothing between them.
- **Heisenberg's uncertainty principle** — here it's the *answer to a riddle* (a famous physics name), not something you calculate.

</details>


---

## Phase 3.2 — The Architect (EBCDIC → Beaufort → VIC)

<div class="wt-imo">

- **Input** — `phase32.txt`, opened with the Phase-3 key.
- **Method** — Decode the bytes via IBM EBCDIC code page 1141 ("one for one, four for one"); run the Beaufort cipher (key `THEMATRIXHASYOU`) on the letter block and the VIC straddling-checkerboard (alphabet `FUBCDORA.LETHINGKYMVPS.JQZXW`, markers 1 and 4) on the digit block.
- **Output** — the Architect monologue + the VIC line "IN CASE YOU MANAGE… THE PRIVATE KEYS BELONG TO HALF AND BETTER HALF…", plus an embedded trailing AES blob (`p32_trailing`) that remains undecoded.

</div>

<details class="wt-more"><summary>📖 Full walkthrough — the complete write-up, code, images and sources</summary>

**Plain-English overview.** Decrypting the Phase 3.2 blob (`phase32.txt`) does not hand you a clean message — it hands you a *workshop* full of separate puzzles wrapped in Matrix lore. You get: (1) some prose that quotes *The Matrix Reloaded* with two `...` blanks to fill in; (2) a wall of garbled "mojibake" bytes that must first be re-decoded through a specific IBM EBCDIC code page and then deciphered with a **Beaufort** cipher; (3) a long string of digits that decode through a **VIC straddling-checkerboard** cipher; (4) a one-line riddle that *gives you the alphabet* for that VIC cipher; and (5) a final trailing AES blob (`p32_trailing`) that, to this day, nobody has decoded.

The two big payoffs of this phase are the **full "Architect" monologue** (the Beaufort output) and the **plot twist** (the VIC output): the prize private key is **split** between "HALF and BETTER HALF."

> **Crypto recap.** Like every blob in this puzzle, `phase32.txt` is OpenSSL `aes-256-cbc` (base64, `Salted__` header, `EVP_BytesToKey` with SHA-256). The passphrase is the **SHA-256 of the Phase 3 answer**, computed in the previous phase:
> ```
> sha256("jacquefrescogiveitjustonesecondheisenbergsuncertaintyprinciple")
>   = 250f37726d6862939f723edc4f993fde9d33c6004aab4f2203d9ee489d61ce4c
> ```
> Decrypt command:
> ```bash
> openssl enc -aes-256-cbc -d -a -md sha256 -in phase32.txt \
>   -pass pass:250f37726d6862939f723edc4f993fde9d33c6004aab4f2203d9ee489d61ce4c
> ```
> **Phase 3.2 salt** (read from the file header): `eefc4c5befc1656a`. ✅ CONFIRMED.

---

### 3.2.0 — The decrypted blob, as you first see it

![phase3.2 screenshot](assets/walkthrough/phase3.2-assets/phase3.2-screenshot-utf8.png)

The decryption produces (UTF-8 view, the garbled "blob" line shortened here for readability — the exact bytes are handled below):

> I've been waiting for you. You have many questions, and although the process has altered your consciousness, you remain irrevocably human. Ergo, some of my answers you will understand, and some of them you will not. Concordantly, while your first question may be the most pertinent, you may or may not realize it is also irrelevant.
>
> ... am I here? Wake up, you... I've designed you a beautiful strategic position. One for one, four for one.
>
> *(a long block of mojibake bytes — see §3.2.2)*
>
> 15165943121972409169171213758951813141543131412428154191312181219433121171617137149110916631213131281491109166131412199114371612126021664313711154112
>
> Raising the stakes without extra chances of winning. A fubcd-king & oracle-queen, thingky mvps, on a sad board but as wide as the first one seen.
>
> U2FsdGVkX1+0Wl49gnWTyiimluu7V3+vl7st0gUt9sWDzNLxDmlPMsDSiuW2a46z
> gKlIi8aaqY5gpJPPEzW1n9n3/26qs4zstWtPKF8Zs/BTNN4IiEh4qu18mdC0NAv4

**What's in front of us:**

* More prose, again quoting *The Matrix* — with two `...` blanks to fill in.
* A block of badly encoded bytes (the mojibake) to decode.
* A list of digits.
* A second riddle (the "fubcd-king..." sentence), which turns out to *define an alphabet*.
* A final AES-encrypted blob (`U2FsdGVkX1+0Wl49...`).

---

### 3.2.1 — Filling the two `...` blanks (the Matrix clues)

Googling the first sentences of the prose shows it is a quotation from **The Matrix Reloaded** — the **Architect** scene.

![google search confirming the Matrix Reloaded quote](assets/walkthrough/phase3.2-assets/google-1.png)

**First blank:** In the full quote, Neo's line that the Architect is paraphrasing is *"Why am I here?"* So `... am I here?` resolves to:

![Why am I here](assets/walkthrough/phase3.2-assets/why-am-i-here.png)

> **"why" am I here?**

**Second blank:** Now we know the theme is The Matrix, so the next `...` ("Wake up, you...") points at the famous opening-scene computer screen from the *first* movie: *"Wake up, Neo."* / *"The Matrix has you."* / *"Follow the white rabbit."* (In this puzzle "Neo" is consistently replaced with "you.")

![Wake up Neo](assets/walkthrough/phase3.2-assets/wake-up-neo.png)

So the filled-in line reads *"Wake up, you... The Matrix has you."* **This is the load-bearing clue** — it is literally the Beaufort key we will need in §3.2.2. (We arrived at it from the puzzle's own self-hint before we even reached the cipher.)

Two more phrases in the prose are *also* clues we'll use later:

* **"I've designed you a beautiful strategic position"** → *beautiful* → **Beaufort** cipher.
* **"One for one, four for one"** → `1 for 1, 4 for 1` → **1141** → IBM EBCDIC code page **1141** (the encoding for the mojibake block).

---

### 3.2.2 — The mojibake block: EBCDIC cp1141 → Beaufort

#### Step A — Find the right text encoding (the "one for one, four for one" hint)

The mojibake block looks like raw bytes viewed in the wrong character set. Depending on your editor you'll see `?` / box-drawing characters (`╬╚,╬°%_...`) — the classic sign of a bad encoding. Here is the block exactly as it appears in a CP437/box-drawing view (verbatim):

```
╬╚,╬°%_┴°°╟%═╧/╟╚:_Ў°├╤°═╠?╟/°╚═,::╚┼╤,├╧°═`/╚?╧`>%┴┬╚╔╧├├╬┼///╠Ў├%╩╠╬?,%╤┼??╠┴╤┴╠Ў`╧╧═,══[└%├╧°╧┴,?┼╦>┼┬╬╚:_>╚┴═%╟°═[╟_╩/┬╤╤┴Ў°╚╬[/╔┬╦°╔/═╟°_└Ў╔╟/╔╟═`└└╤╧┼╠╬╠┼°?├/╔╤:╦┴>╚`┴╦╔_┼[╟═/:_`╟_>╩┬:╤?`╟═[╬╔:[├_╧╠?╚?_?┬%├┴┬%[>┼°°╦┴%╦>%╧/┴╟[>╧╠:>/`>/[┴/:╟├:┴═>°┴┴╧Ў╬╟Ў`╦╔Ў°°?╦/%/┬:═/°%°°°╚┴/├╬╬>:°╩`╟╦>,Ў═╠╦_,═┬>>╤_?°═,?Ў┴>╦>%├╠├/┬┼┴═Ў_`╔┬╔╧╚>_:╤╚┬╚╔╧═,═╧├>╠_├°┴°╠═╤╧═╠╔╔╬┼╧┼°:°°╚>┼═`/%?/╬╦>,°°═╟?╟,[/:╩┼╟_╩°┬╟╤[┴┼╦Ў└>╚╚╚┴°╔└_:╩,└┬╦╚╤/┬>/╦Ў_`╚┼╟╔╟╤_[/└┼Ў╬%╟═╬╔///┬/┬`╚╠╔╟┴╚╬>°╦,>┬╤>°╠╠╧:╩,├[:Ў_╟°╟┴:Ў_`└,╔╚╔╩╤╠%`╟└?%╟═?[°?┴[╧/,/├?_%═?└/?╠_╟╠,╤┴╟┴,┼,╤╚═┴%_`>┬°═╟?╬?┬%°╤`Ў/,┬└═╠┬═%°├>>╚[├_°╔└╦├└,[/╬/:╟/,╤┴°┴%`╬/┬┬,?╤╚`[├╬═╦╟,┬[Ў╧:═/└╤╬├_┼Ў└_┬/╧:╟_>┴,┴%╟═?[°`,═╟_>╠╤>╤╩┴┼Ў╔:%┴>┬`┴╠┴_>°═[/%┴┴╤/Ў╬╩Ў_`╟└_?└%┴?°╔,╔>>:╔┬??╚>╔_[`┬_└╤/Ў╠_╩└__>╔`┬┼╚%%╔,[╤:═╤╟_Ў╔°╬╤┴╟╠╧/╚%╤°╤╚═└?╚╦├╔┼:_/,_╟>°╔:╤>`╠╚:?┼`┼╤┼╬╚_╧┬╚┼╟%°╠╚╚°┼╤├?╟╦┼┴_°,°╤`/╚═└?_/`╔╚:╧╚═╚%`_╚╧°°═┬_╚╧╧═╟_>╧Ў°╟└╟,╩%├%_:╤>═╦╟°╟╩═╤╚═>╤╤┴└╬├└╤╩┴╬└°°%_╤┬╠╩╚┴╟%╔╧`%╧╚:_/╔┴┴/╧╟`╧┬/:╦╤╦_╩>╚┴╧/├╠┼╬└┬_Ў°:°_└╤/┼//╤╟╩Ў╦_╩>╚┼╧╔,[╔°,[╤╧╔Ў╬╩╧[?╚Ў_╩:/:╟╚`/┴?╚?╚═╟╩?╧`>├_°╔└[┴┴┼[┼╚╤╚_[>°└╔>:,╬>°°╔╦Ў╩>┼Ў┴╧/`└Ў├%╧:═╚`┴%╦_┬`╠╧╔:_═╧╟Ў╬╠?╦┴%/°///,_╔>,Ў>╚┴Ў,°:╧╚?`╚/╩:╔╧,%╧╔[?╧:═/,┴╤╔╦┼═>═┬:[═/?`┴┼%╚,╧╟╧├>╤┴°╤╔┴┼└,`╔╠╔╔?╔═╧╤>┼┴[Ў┴_/:°╔%╔╧┼`,┴/Ў?═__┴//╬╤┬Ў%┴└╧├═┬╦[Ў°╚╦├┴╔╠═╠┴╟╧╔`└╩┴>/>╩┴%╦├═%├╚°_╔_[?╔┴╚╬,%%┬_└┴,╟:╩╠╤╔╦╠`╬╔Ў└┼:_/>°╔╟╟╦>╧┼╦╔,╚╧?└╩╬:>__┼?_?└╤Ў°┬?°╔╧°╚?_╤>>╤╟├°═%╦°═[┼┬_?╠┴╤┴/═╬└╤/[┼Ў╤╔/═┼╤`/,╟`╦├?╦╤Ў_/╦╩:,├?╧┼╧╠═┬/═┴°╤Ў╬╩Ў_`╟╦_╤╧°`┴°/_╔:`%╧//┴╧/Ў┴%`┬┴/╧?┬╬╔[╬╧://Ў═,╚╬═,═└╠:╚┬╟├┼/[└/├╬╦_╤╧,┬╟%├╤┴└°═╟,[:╧%┴>/,┴╚,╟,%_┬%╚╩`╬/,┴╚═╟,╟,╟°°_`╬╬└?┼°╧╟╚╧╔╤[``_╔┼?╬╠>?└,└///┬╧┬:/┼└/╟>╔>├╦/?_:/┴┴/╧┴%,╦%╟╔%╧╤┼╤Ў
```

The trick: this text was *saved* in a Latin (ISO-8859-1) encoding, but the underlying bytes were actually meant to be read as **EBCDIC cp1141** (IBM EBCDIC Germany 20273 + Euro symbol — code page 1141). The hint "**one** for **one**, **four** for **one**" → **1-1-4-1** points straight at it.

**Python approach** (brute-force every codec, keep the one that decodes to the most printable ASCII):

```python
import ebcdic  # registers the extended EBCDIC code pages, including cp1141

# `blob` is the raw mojibake bytes pulled from the file.
# We undo the latin "save" step, then re-encode through each codec.
print(blob.decode('iso-8859-1').encode('cp1141').decode())
```

`cp1141` comes out on top with **100% printable output** — confirming the "1141" hint. (Naddiseo's notebook offsets the blob with: `blob_start = file_as_bytes.find(b'four for one.\r\n\r\n') + len(...)`, `blob_end = file_as_bytes.find(b'\r\n\r\n151659')`. A frequency-count showed exactly **26 distinct byte values**, which is why a naïve substitution was tried first — and failed — before the encoding route worked.)

**CyberChef alternative.** Hex-encode the bytes, then use `From Hex` → `Text Encoding Brute Force (Encode)`. Scrolling the results, the **IBM EBCDIC** family produces mostly ASCII, and **"IBM EBCDIC Germany (20273 + Euro symbol) (1141)"** produces complete ASCII — again the "1141" hint. ([Brute-force recipe](https://gchq.github.io/CyberChef/#recipe=From_Hex%28'Auto'%29Text_Encoding_Brute_Force%28'Encode'%29) · the [final recipe](https://gchq.github.io/CyberChef/#recipe=From_Hex%28'Auto'%29Encode_text%28'IBM%20EBCDIC%20Germany%20%2820273%20%2B%20Euro%20symbol%29%20%281141%29'%29) hard-codes cp1141.)

The EBCDIC cp1141 decode yields this letter string (verbatim, lowercase):

```
vtkvplmepphluwahtzmjpfipuxohaptukzztgikfwpuyatowynlebtqwffvgaaaxjflrxvokligooxeiexjywwukuucdlfwpwekogsngbvtzmnteulhpuchmrabiiejptvcaqbspqauhpmdjqhaqhuyddiwgxvxgpofaqizsentyesqmgchuazmyhmnrbzioyhucvqzcfmwxotomoblfeblcngppselsnlwaehcnwxznaynaceazhfzeunpeewjvhjysqjpposalabzuaplpppteafvvnzpryhsnkjuxsmkubnnimopukojensnlfxfabgeujmyqbqwtnmzitbtqwukuwfnxmfpepxuiwuxqqvgwgpzpptnguyaloavsnkppuhohkcazrghmrpbhicegsjdntttepqdmzrkdbstiabnasjmytghqhimcadgjvlhuvqaaababytxqhetvnpsknbinpxxwzrkfczjmhphezjmydkqtqrixlyhdolhuocpoecwakafomluodaoxmhxkiehekgkituelmynbpuhovoblpiyjakbduxbulpfnntcfmpqdsfdkcavazhakiepelyvabbkoitycfvushkbcjwzuadivfmgjdmbawzhmnekelhuocpykuhmnxiniregjqzlenbyexemnpucaleeiajvrjmyhdmodleopqkqnnzqbootnqmcybmdiajxmrdmmnqybgtllqkcizuihmjqpviehxwatlipitudotsfqgzmakmhnpqzinyxtzogygigvtmwbtghlpxttpgifohsgempkpiyatudomayqtzwtutlymtwppubmtwwuhmnwjphdhkrlflmzinushphruituniiedvfdirevdpplmibxrtehlqwylwtzmaqeeawhywbazsismrntewafxgvdbmjpzpmdiagaaihrjsmrntgwqkcqpkciwqjvrwcotjmrzazhtyaeototuhrowynfmpqdceegcgtitmcnpdqnzkvnppqsjrngjewaydjflwzutyelsmbyxwqzmuwhjvxoselapaaakmqnkjntejkpzwtoytarzqwklwqcowzuakeiqsgunubzcuaoyegltkwhwfniepiqegdkyqxqqoquwingecjemazpqlqwgykeajoummeaavibjledwfubscjptsfeqxuxehwqydrenanrelsfulftpmqmcoqetvkllbmdekhzrxiqsxyvqjdgzmanpqhhsnwgsqktwodrvznmmgomodijpbopqwptominnihfpulspucgbmoxeieauvdiacgjiqaugiyakhysfosijmasrzkfowgwxubauepijvrjmyhsmiwpyepamqzylwaaewajelybeawobvqcvwzaajuktvukudxztbhfgacdafvsmiwkbhlfiedpuhkczwlenaketkhklmbltryvaketuhkhkhppmyvvdogpwhtwqicyymqgovxnodkdaaabwbzagdahnqnfsaomzaeeawelkslhqlwigij
```

#### Step B — Beaufort cipher, key `THEMATRIXHASYOU`

The unused hint **"I've designed you a beautiful strategic position"** → **Beaufort** cipher. (Beaufort is a Vigenère-family cipher; usefully, **Beaufort encryption and decryption are the same operation**.)

First, a brute-force/auto-solve of the Beaufort cipher (e.g. dCode or ciphertools) on the EBCDIC string suggests keys beginning **`THEMAT`** / **`THEMATRI`**:

![Beaufort brute-force setup showing keys starting THEMAT](assets/walkthrough/phase3.2-assets/beaufort1.png)

We already independently derived this in §3.2.1: the Matrix screen says *"the matrix has you."* Using **`THEMATRIXHASYOU`** as the Beaufort key succeeds:

![Beaufort success](assets/walkthrough/phase3.2-assets/beaufort-success.png)

> **Beaufort key: `THEMATRIXHASYOU`** ✅ CONFIRMED (3 sources). You can reproduce this on [ciphertools.co.uk/decode.php](https://ciphertools.co.uk/decode.php) (choose Beaufort) or dCode.

**Raw Beaufort output** (continuous, verbatim):

```
yourlifeisthesumofaremainderofanunbalancedequationinherenttotheprogrammingofthispuzzleyouaretheeventualityofananomalywhichdespitemysinceresteffortsihavebeenunabletoeliminatefromwhatisotherwiseaharmonyofmathematicalprecisionwhileitremainsaburdentosedulouslyavoidititisnotunexpectedandthusnotbeyondameasureofcontrolwhichhasledyouinexorablyhereyouyouhaventansweredmyquestionmequiterightinterestingthatwasquickerthantheotherspleaseifyoufindawaytocompletethelastpartofthepuzzletaketheprivatekeyyouveearneditbutpleasetakethistoheartthatwhatawisemanabovehintedatisworthhundredfourtyoftheinvestmentthatswhatusguysatgsmgaretryingtoaccomplishintheendpleasejusthelpusbuilditinsteadofjustwaistingyourlifetimebyhuntingforworthlesspricesandthrophieslikethisimsorrytotellyouthatyouvecomethisfarbutyoullneverfinishthelasttaskiexpectyoutosaybullshitwelldenialisthemostpredictableofallhumanresponsesbutrestassuredthiswillnotbethelasttimeihavedestroyedarestlesssoulandihavebecomeexceedinglyefficientatitthefunctionoftheyouisnowtoreturntothesourcecodesallowingatemporarydisseminationofthecodeyouhopefullycarryreinsertingtheprimebasicsafterwhichyouwillberequiredtoselectfromovertwentythreecipherssixteenencryptionsandorsevenintertwinedpasswordstofindtheactualprivatekeynotethatalsobruteforcingmightberequiredfailuretocomplywiththisprocesswillresultinacataclysmicsystemcrashkillingyourwillpowerwhichcoupledwiththeexterminationofyourwilltoliveandwillultimatelyresultintheextinctionoftheentirenessofyourselfselfgoodluckneverthelessireallyhopeyouretheoneciaobellao
```

#### The full Architect speech (word-split, readable)

This is the continuation of the Architect's monologue after *"Why am I here?"* — quoted in full (lightly word-split; the puzzle text contains some intentional/typo spellings such as "WAISTING", "THROPHIES", "FOURTY", which are preserved):

> YOUR LIFE IS THE SUM OF A REMAINDER OF AN UNBALANCED EQUATION INHERENT TO THE PROGRAMMING OF THIS PUZZLE. YOU ARE THE EVENTUALITY OF AN ANOMALY, WHICH DESPITE MY SINCEREST EFFORTS I HAVE BEEN UNABLE TO ELIMINATE FROM WHAT IS OTHERWISE A HARMONY OF MATHEMATICAL PRECISION. WHILE IT REMAINS A BURDEN TO SEDULOUSLY AVOID IT, IT IS NOT UNEXPECTED, AND THUS NOT BEYOND A MEASURE OF CONTROL, WHICH HAS LED YOU INEXORABLY HERE.
>
> YOU. — YOU HAVEN'T ANSWERED MY QUESTION. — ME, QUITE RIGHT. INTERESTING. THAT WAS QUICKER THAN THE OTHERS.
>
> PLEASE, IF YOU FIND A WAY TO COMPLETE THE LAST PART OF THE PUZZLE, TAKE THE PRIVATE KEY — YOU'VE EARNED IT. BUT PLEASE TAKE THIS TO HEART: THAT WHAT A WISE MAN ABOVE HINTED AT IS WORTH HUNDRED FOURTY OF THE INVESTMENT. THAT'S WHAT US GUYS AT GSMG ARE TRYING TO ACCOMPLISH IN THE END. PLEASE JUST HELP US BUILD IT INSTEAD OF JUST WAISTING YOUR LIFETIME BY HUNTING FOR WORTHLESS PRICES AND THROPHIES LIKE THIS.
>
> I'M SORRY TO TELL YOU THAT YOU'VE COME THIS FAR, BUT YOU'LL NEVER FINISH THE LAST TASK. I EXPECT YOU TO SAY "BULLSHIT". WELL, DENIAL IS THE MOST PREDICTABLE OF ALL HUMAN RESPONSES. BUT REST ASSURED, THIS WILL NOT BE THE LAST TIME I HAVE DESTROYED A RESTLESS SOUL, AND I HAVE BECOME EXCEEDINGLY EFFICIENT AT IT.
>
> THE FUNCTION OF THE YOU IS NOW TO RETURN TO THE SOURCE CODES, ALLOWING A TEMPORARY DISSEMINATION OF THE CODE YOU HOPEFULLY CARRY, REINSERTING THE PRIME BASICS, AFTER WHICH YOU WILL BE REQUIRED TO SELECT FROM OVER TWENTY-THREE CIPHERS, SIXTEEN ENCRYPTIONS AND/OR SEVEN INTERTWINED PASSWORDS TO FIND THE ACTUAL PRIVATE KEY. NOTE THAT ALSO BRUTE FORCING MIGHT BE REQUIRED.
>
> FAILURE TO COMPLY WITH THIS PROCESS WILL RESULT IN A CATACLYSMIC SYSTEM CRASH KILLING YOUR WILLPOWER, WHICH COUPLED WITH THE EXTERMINATION OF YOUR WILL TO LIVE, AND WILL ULTIMATELY RESULT IN THE EXTINCTION OF THE ENTIRENESS OF YOURSELF, SELF.
>
> GOOD LUCK. NEVERTHELESS, I REALLY HOPE YOU'RE THE ONE. CIAO BELLA. O

**Why this matters (it is more than flavour text).** Buried in the monologue are the puzzle's own endgame instructions, which the later phases confirm:

* **"REINSERTING THE PRIME BASICS"** → foreshadows the later **"prime part"** of SalPhaseIon.
* **"OVER TWENTY-THREE CIPHERS, SIXTEEN ENCRYPTIONS AND/OR SEVEN INTERTWINED PASSWORDS ... BRUTE FORCING MIGHT BE REQUIRED"** → the literal scale of the Cosmic Duality endgame, and the reason it has no partial-progress oracle.
* **"WORTH HUNDRED FOURTY (140) OF THE INVESTMENT"** → re-appears as a creator hint about the true value of solving it.
* **"RETURN TO THE SOURCE CODES"** → the SalPhaseIon "return to source" theme.

> ⚠️ **Sourcing note.** The opening line and overall theme are ✅ CONFIRMED across all sources; the *exact ending* (`...CIAO BELLA O`) is single-sourced (Naddiseo's notebook + puzzlehunt agree, but it has not been triple-verified). The speech contains **no embedded sub-puzzle** of its own — it is lore + future instructions, "maybe useful later."

---

### 3.2.3 — The digit string: the VIC straddling-checkerboard cipher

The remaining numeric line is:

```
15165943121972409169171213758951813141543131412428154191312181219433121171617137149110916631213131281491109166131412199114371612126021664313711154112
```

✅ CONFIRMED verbatim (2 sources).

**Observations:**

* Lots of `1`s, and the previous block used a classical cipher — so this is likely another classical cipher.
* A classical cipher that uses digits with one digit appearing very frequently, and that needs a custom alphabet, is the **VIC cipher** (a straddling-checkerboard system). It needs **two "marker"/straddle digits** and **an alphabet**.

**The marker digits** are `1` and `4` — the very same numbers the "one for one, four for one" hint gave us (which also unlocked cp1141).

**The alphabet** is hidden in the second riddle:

> Raising the stakes without extra chances of winning. A **fubcd-king & oracle-queen, thingky mvps**, on a sad board but as wide as the first one seen.

To turn that phrase into a 28-cell straddling-checkerboard alphabet (26 letters + two punctuation cells), strip punctuation, remove repeated letters, then pad with the missing letters plus `.` and `/`. This derivation involved real trial-and-error — there are two documented paths to essentially the same board:

**Path 1 (Naddiseo's derivation):**
1. `fubcd-king & oracle-queen, thingky mvps`
2. → `FUBCD ORACLE THINGKY MVPS`
3. → remove the repeated `C` in oracle: `FUBCD ORA.LE THINGKY MVPS`
4. → append the rest of the alphabet: **`FUBCDORA.LETHINGKYMVPS/JQZXW`**

**Path 2 (puzzlehunt / local, the dominant audited form):** the same letters arrive at the board **`FUBCDORA.LETHINGKYMVPS.JQZXW`** with **digit 1 = `1`** and **digit 2 = `4`**.

The grind to get there (preserved for reproduction): early attempts that removed `king`/`queen` or kept the second `c` produced near-English garbage like `IN5ASEYOUMANAGETO5RA5KTHIS...` (with `5` where letters should be), signalling that the `C`/punctuation placement in `oracle` was the lever to adjust. Moving the `C` and treating the leftover slot as punctuation finally produced clean English.

> ⚠️ **Source disagreement (note for reproducers).** The two boards differ only in the trailing tail and a `/` vs `.`:
> * **`FUBCDORA.LETHINGKYMVPS.JQZXW`** (puzzlehunt / local / VERIFIED — the dominant form)
> * **`fubcdora/lethingkymvpszjqwx.`** (Naddiseo — same letters, different trailing order, `/` instead of one `.`)
>
> Depending on which board a solver enters into a VIC solver, intermediate output can differ. Both derivations were reported to reach the same final plaintext.

Plug into a [VIC-cipher solver](https://www.dcode.fr/vic-cipher) with:

```
alphabet : FUBCDORA.LETHINGKYMVPS.JQZXW
digit 1  : 1
digit 2  : 4
```

![In case you manage — VIC decode success](assets/walkthrough/phase3.2-assets/in-case.png)

**VIC output (continuous):**

```
INCASEYOUMANAGETOCRACKTHISTHEPRIVATEKEYSBELONGTOHALFANDBETTERHALFANDTHEYALSONEEDFUNDSTOLIVE
```

**Readable:**

> **IN CASE YOU MANAGE TO CRACK THIS, THE PRIVATE KEYS BELONG TO HALF AND BETTER HALF, AND THEY ALSO NEED FUNDS TO LIVE.**

✅ CONFIRMED. **This is the phase's plot twist:** the prize private key is described as **split** between "HALF and BETTER HALF" — foreshadowing the two unsolved SalPhaseIon halves (`dbbi`/`faed`) and the later "reverse-binary" master hint. (It also explains the donation requests: "they also need funds to live.")

---

### 3.2.4 — The trailing AES blob (`p32_trailing`) — OPEN / UNSOLVED

The very last item in the decrypted Phase 3.2 text is another OpenSSL `Salted__` AES blob, in the same base64 format as every other blob in the puzzle:

```
U2FsdGVkX1+0Wl49gnWTyiimluu7V3+vl7st0gUt9sWDzNLxDmlPMsDSiuW2a46z
gKlIi8aaqY5gpJPPEzW1n9n3/26qs4zstWtPKF8Zs/BTNN4IiEh4qu18mdC0NAv4
```

**Status: ❌ NOT SOLVED — and largely *un-noticed* by the wider community.** Internal analysis (the repo's endgame ledger) nicknames it **`p32_trailing`**:

* It is an 80-byte ciphertext with **salt `b45a5e3d827593ca`**. A correct key would be instantly obvious (≤79 readable plaintext bytes).
* The chess-flavoured clue immediately preceding it — *"A fubcd-king & oracle-queen, thingky mvps, on a sad board but as wide as the first one seen"* — was investigated as a possible **board/coordinate construction** that builds this blob's key. The phrase's only *confirmed* purpose, however, is to supply the **VIC alphabet** (§3.2.3); no concrete board position is given from which to derive a key.
* **The lead is currently CLOSED as a dead end:** `p32_trailing` resisted ~288 Phase-3.2-derived candidate answer strings, the raw pre-Beaufort EBCDIC letters string, the VIC digit string (forward and reversed), the Phase-2 chess FEN, reused chain keys, and a full ~370,000-word dictionary (tested both as a literal passphrase and as `sha256hex(word)`). None produced a valid decrypt.

> ⚠️ This trailing blob is **genuinely open**. It is one of the few small, instantly-verifiable concrete leads left in the puzzle, but every documented attempt has failed. It is distinct from the SalPhaseIon `salph_inner` blob and the final Cosmic Duality blob.

---

### 3.2.5 — Summary of canonical values (Phase 3.2)

| Item | Value | Status |
|---|---|---|
| Phase 3.2 decrypt key | `sha256("jacquefresco…principle")` = `250f37726d6862939f723edc4f993fde9d33c6004aab4f2203d9ee489d61ce4c` | ✅ CONFIRMED |
| Phase 3.2 salt | `eefc4c5befc1656a` | ✅ CONFIRMED (extracted) |
| First `...` blank | `"why" am I here?` | ✅ CONFIRMED |
| Second `...` blank | `Wake up, you… The Matrix has you` | ✅ CONFIRMED |
| Mojibake encoding | IBM **EBCDIC cp1141** (hint "one for one, four for one" → 1141) | ✅ CONFIRMED |
| Letter cipher | **Beaufort** (hint "beautiful strategic position") | ✅ CONFIRMED |
| Beaufort key | **`THEMATRIXHASYOU`** | ✅ CONFIRMED (3 sources) |
| Beaufort output | the full **Architect speech** (`YOURLIFE…CIAOBELLAO`) | ✅ CONFIRMED (exact ending single-sourced) |
| Digit string | `15165943121972409169171213758951813141543131412428154191312181219433121171617137149110916631213131281491109166131412199114371612126021664313711154112` | ✅ CONFIRMED (verbatim, 2 sources) |
| Number cipher | **VIC** (straddling checkerboard) | ✅ CONFIRMED |
| VIC alphabet | `FUBCDORA.LETHINGKYMVPS.JQZXW` (Naddiseo variant: `fubcdora/lethingkymvpszjqwx.`) | ✅ CONFIRMED (dominant form; ⚠️ source variant noted) |
| VIC marker digits | `1` and `4` | ✅ CONFIRMED |
| VIC output | **"IN CASE YOU MANAGE TO CRACK THIS THE PRIVATE KEYS BELONG TO HALF AND BETTER HALF AND THEY ALSO NEED FUNDS TO LIVE"** | ✅ CONFIRMED |
| Trailing AES blob `p32_trailing` | `U2FsdGVkX1+0Wl49gnWTyiimluu7V3+vl7st0gUt9sWDzNLxDmlPMsDSiuW2a46z` `gKlIi8aaqY5gpJPPEzW1n9n3/26qs4zstWtPKF8Zs/BTNN4IiEh4qu18mdC0NAv4` (salt `b45a5e3d827593ca`) | ❌ UNSOLVED |

> **Where Phase 3.2 leaves us.** Phase 3.2 was the publicly-solved frontier by the **end of 2019** — no one had cracked past the trailing AES blob and the speech's "rest of this phase" interpretation at that point. The path *forward* did not come from this blob at all: it came from the parallel **Decentraland → SalPhaseIon** route (the "HASHTHETEXT" audio hint + the "Roses are White" poem), covered in the next section. The Architect's speech and the "HALF and BETTER HALF" twist are the conceptual keys to that endgame; `p32_trailing` itself remains an open, unexplained loose end.

**From-zero concepts introduced here:** EBCDIC / IBM code page 1141 · mojibake (wrong-encoding garble) · text-encoding brute force · the Beaufort cipher (a Vigenère-family cipher where encrypt = decrypt) · the VIC cipher and straddling-checkerboard (digits → letters using two "marker" rows) · how a riddle can *define a cipher alphabet*.

</details>


---

## Decentraland — Entry to SalPhaseIon

<div class="wt-imo">

- **Input** — The Decentraland plot at coordinates −41,−17 → the audio file `puzzlepiece.mp3`.
- **Method** — Split the stereo track, invert one channel, mix to mono, and view the spectrogram → the word HASHTHETEXT; then take SHA-256 of all the text on the opening puzzle image (including the prize address, no trailing newline).
- **Output** — `89727c598b9cd1cf8873f27cb7057f050645ddb6a7a157a110239ac0152f6a32` → the secret SalPhaseIon page URL.

</div>

<details class="wt-more"><summary>📖 Full walkthrough — the complete write-up, code, images and sources</summary>

> **Status: SOLVED and reproducible.** This side-quest is the bridge from the main Matrix puzzle chain into the **SalPhaseIon** endgame stage. It combines an official 2020 hint posted inside a virtual world (Decentraland) with the much later 2021 instruction "hash the text on the image." Together they tell you exactly how to compute the secret URL of the next phase.

**Plain English:** The puzzle creator hid a clue in the virtual world **Decentraland**. At a specific plot of virtual land there is a clickable object that plays a sound. The sound hides a word using **audio steganography**: split the stereo channels, phase-invert one of them, mix back to mono, and view the result as a **spectrogram** — the hidden word **`HASHTHETEXT`** appears. That word is an instruction. You then take **all the text printed on the very first puzzle image (including the Bitcoin prize address)**, SHA-256 it, and the resulting hash is the secret page name (`gsmg.io/<hash>`) that opens SalPhaseIon.

This phase was decoded across two official hints:
- **2020-02-20** — the Decentraland screenshot hint (where to go and that there is something to find).
- **2021-05-06** — the creator finally spelled out the instruction "hash the text on the image," confirming what the spectrogram's `HASHTHETEXT` meant.

---

### 7.1 The 2020-02-20 Decentraland hint

On **2020-02-20** the creator (Jrk) posted a second official hint to the Telegram group: a screenshot taken from inside [Decentraland](https://decentraland.org/). The screenshot is from the LAND coordinates **`-41,-17`**, where a large **question mark (`?`)** structure stands.

![Decentraland Telegram hint](assets/walkthrough/hints/decentraland-tg.png)

![2020-02-20 Decentraland hint screenshot](assets/walkthrough/hints/2020-02-20-decentraland.jpg)

> ⚠️ **Coordinate note:** The original Decentraland *hint observation* text in Naddiseo's notebook mentions "the screenshot is taken from the coordinates -41,17," but the correct LAND plot you must navigate to (and the one every later source uses) is **`-41,-17`** (note the minus sign on the second number). Use **`-41,-17`**. The parcel is the official **"GSMG.io Puzzle piece"** plot.

The puzzlehunt README also references an earlier image of this same hint shared on **2020-04-26** (filename `photo_2020-04-26_09-24-30.jpg`), describing the same task: go to the coordinates in the image to obtain an audio file.

---

### 7.2 Finding the audio in Decentraland (manual / in-world method)

Naddiseo's full step-by-step for exploring the world and reaching the object:

1. Go to [decentraland.org](https://decentraland.org/) and click the **"Start Exploring"** button.
2. Choose to explore **on the web** (no download needed).
3. Play **as a guest** (you are just exploring).
4. Wait for the game to load.
5. Set up a character (or accept the default).
6. Create a name.
7. Accept the Terms of Service and privacy policy.
8. Wait for it to load again.
9. Click through the tutorial.
10. Click **"Go to Genesis City"** to load at coordinates `0,0`.
11. Press **Enter / Return** to bring up the chat overlay.
12. Type **`/goto -41,-17`** and hit Enter.
13. Walk over to the **bottom of the question mark** structure.
14. **Interact** with the bottom of the question mark — you will hear **hissing / white noise**. That sound is what you need to analyze.

![Interacting with the question mark plays the hidden audio](assets/walkthrough/decentraland-assets/01-show-interactive.png)

---

### 7.3 Downloading the audio (Decentraland Content API method)

You do not have to record the in-world sound — Decentraland exposes the actual asset file through its JavaScript CLI and Content API.

1. Install the Decentraland CLI: `npm i decentraland`
2. Query the parcel: `dcl status -41,-17` — this returns information about the square, including the assets deployed there.

![dcl status -41,-17 reveals the deployed assets](assets/walkthrough/decentraland-assets/02-dcl-info.png)

3. Among the deployed files is **`puzzlepiece.mp3`**, with content id **`QmeRy5MjmEZ2W6J3DwhQfht5HKBKXBFpoGzSkzmjeGKiDK`**.
4. Download it via the [Content API](https://docs.decentraland.org/contributor/content/practice/cli/). The full URL is the content endpoint plus the content id:

```
https://peer.decentraland.org/content/contents/QmeRy5MjmEZ2W6J3DwhQfht5HKBKXBFpoGzSkzmjeGKiDK
```

5. Download with curl:

```bash
curl https://peer.decentraland.org/content/contents/QmeRy5MjmEZ2W6J3DwhQfht5HKBKXBFpoGzSkzmjeGKiDK > puzzlepiece.mp3
```

The audio file (preserved in this repo as `assets/walkthrough/decentraland-assets/puzzlepiece.mp3`):

<audio controls src='assets/walkthrough/decentraland-assets/puzzlepiece.mp3'></audio>

> ⚠️ **Filename note:** The Decentraland asset is `puzzlepiece.mp3` (per Naddiseo's CLI-based method). The audited reference (`VERIFIED-SOLUTIONS.md`) refers to the in-world clip as `audio_source.wav`. These are two names for the same hidden-audio clue; the technique below applies identically to whichever copy you obtain.

---

### 7.4 Decoding the audio — stereo phase-inversion + spectrogram

This is a classic [audio steganography](https://en.wikipedia.org/wiki/Steganography#Hiding_an_image_within_a_soundfile) technique: hide content in the spectrogram of one channel, phase-inverted relative to the other, so that it only becomes visible after a specific channel operation.

**The recipe (works in Audacity or any audio editor, or in code):**

1. The clip is **stereo** — it has a **Left** and a **Right** channel.
2. **Split** the stereo track into its two mono channels.
3. **Invert (phase-flip)** one of the channels.
4. **Mix the two channels back down to mono.** Everything identical between the channels cancels out; only the hidden difference survives.
5. View the resulting mono signal as a **spectrogram** (a picture of frequency vs. time).
6. In the high frequencies you will see the hidden word: **`HASHTHETEXT`**.

**Reproduction in Python** (Naddiseo's notebook). First, load the file and confirm it has two channels:

```python
import soundfile as sf

data, samplerate = sf.read('./decentraland-assets/puzzlepiece.mp3')
data
```

Separate the two channels (Left = channel 0, Right = channel 1):

```python
left = data[..., 0]
right = data[..., 1]
left, right
```

Invert one channel, mix back to mono, and plot the spectrogram:

```python
import numpy as np
import matplotlib.pyplot as plt
import warnings
warnings.filterwarnings('ignore')

def invert_data(s):
    return np.array([
        (-1**i)*x for i, x in enumerate(s)
    ])

# Invert one channel
new_right = invert_data(right)
# and sum back up to mono
new_data = left + new_right

# Plot the spectrogram
plt.figure(figsize=(15, 5))
plt.specgram(new_data, Fs=samplerate)
plt.colorbar()
plt.show()
```

> Note: the exact "invert" operation matters in code. Naddiseo's `invert_data` is one approach. In a GUI editor, simply use the **Invert** effect on one channel and then mix to mono — that is the canonical operation described by every source ("split stereo track, invert one of them, mix them back, mix stereo down to mono, create a spectrogram").

**Reading the spectrogram numerically:** In Naddiseo's spectrogram the hidden content appears as a list of numbers, all between **41 and 58**. That range is exactly the hexadecimal values of the ASCII letters `'A'` (`0x41`) through `'Z'` (`0x5A`):

```python
print(hex(ord('A')), hex(ord('Z')))   # 0x41 0x5a
```

So each number is a hex byte code for an uppercase letter. Reversing that transform:

```python
numbers = ['48','41','53','48','54','48','45','54','45','58','54']

def to_letter(n):
    return chr(int(n, 16))

print(''.join(map(to_letter, numbers)))   # HASHTHETEXT
```

| Decoded hidden word | Status |
|---|---|
| **`HASHTHETEXT`** (from the spectrogram of the phase-inverted mono mix) | ✅ CONFIRMED (multiple sources) |
| Decentraland coordinates `-41,-17` | ✅ CONFIRMED |
| Audio asset `puzzlepiece.mp3` (content id `QmeRy5MjmEZ2W6J3DwhQfht5HKBKXBFpoGzSkzmjeGKiDK`) / referred to elsewhere as `audio_source.wav` | ✅ CONFIRMED |

---

### 7.5 The 2021-05-06 instruction — "hash the text on the image"

`HASHTHETEXT` was cryptic on its own. On **2021-05-06** the creator finally revealed the explicit instructions for entering SalPhaseIon: take **all the text on the initial puzzle image — including the Bitcoin address — and take the SHA-256 hash of the result**. The resulting hash is the URL needed to enter SalPhaseIon.

This also ties back to the earlier **2020-01-14 "Roses are Red" hint**, which said *"Go back to the first puzzle piece without further ado."* The "first puzzle piece" is the original image at `https://gsmg.io/puzzle`, and "hash the text" tells you what to do with it.

**The exact text to hash** is the visible text on the opening image concatenated with the prize address, with **no spaces and no trailing newline**:

```
GSMGIO5BTCPUZZLECHALLENGE1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe
```

(That is the on-image text `GSMG.IO 5 BTC PUZZLE CHALLENGE` with separators stripped, followed by the prize address `1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe` — **59 characters** total.)

**Compute the SHA-256** (puzzlehunt README's reproduction):

```python
>>> import hashlib
>>> h = hashlib.sha256()
>>> h.update('GSMGIO5BTCPUZZLECHALLENGE1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe'.encode())
>>> h.hexdigest()
'89727c598b9cd1cf8873f27cb7057f050645ddb6a7a157a110239ac0152f6a32'
```

| Value | Status |
|---|---|
| Entry string (59 chars, no spaces, no trailing newline): `GSMGIO5BTCPUZZLECHALLENGE1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe` | ✅ CONFIRMED |
| `sha256(entry string)` = **`89727c598b9cd1cf8873f27cb7057f050645ddb6a7a157a110239ac0152f6a32`** | ✅ CONFIRMED (independently recomputed) |
| SalPhaseIon URL = `gsmg.io/89727c598b9cd1cf8873f27cb7057f050645ddb6a7a157a110239ac0152f6a32` | ✅ CONFIRMED |

So the doorway into the SalPhaseIon (and ultimately Cosmic Duality) stage is:

> **https://gsmg.io/89727c598b9cd1cf8873f27cb7057f050645ddb6a7a157a110239ac0152f6a32**

> ⚠️ **The "no trailing newline" detail is load-bearing.** Hashing the string *with* a trailing newline produces a completely different (wrong) digest (`8784851d…`). Make sure your tool does not append `\n` (e.g. avoid `echo` without `-n`).
>
> ⚠️ **Live-page caveat:** The gsmg.io site is wound down. The hash→page link is confirmed by two independent community walkthroughs, but cannot be re-fetched live today. The SalPhaseIon page content itself is preserved in the next section.

---

### 7.6 What this unlocks

Visiting that URL loads the **SalPhaseIon / Cosmic Duality** page — a long "soup" of letters and an AES blob that is the entry point to the puzzle's unsolved endgame. See the next section (**SalPhaseIon**) for decoding the four cracked tokens (`matrixsumlist`, `enter`, `lastwordsbeforearchichoice`, `thispassword`) and the two still-open blocks (`dbbi`, `faed`).

**From-zero concepts introduced here:**
- **Decentraland** — a browser-based virtual world; LAND parcels have coordinates like `-41,-17`, and their deployed assets can be fetched via the Content API.
- **Stereo channels & phase inversion** — a stereo clip has Left/Right channels; "inverting" (phase-flipping) one and mixing to mono cancels the common signal and reveals a hidden difference.
- **Spectrogram** — a picture of a sound's frequencies over time; text/images hidden in audio are typically seen here.
- **"Hash the text"** — the recovered instruction `HASHTHETEXT` means: SHA-256 the literal text printed on the first puzzle image (including the address), and use the hex digest as the next page's name.

</details>


---

## SalPhaseIon (the soup) & Cosmic Duality — the open endgame

<div class="wt-imo">

- **Input** — The SalPhaseIon "soup" (a long run of letters a–i/o split by `z`) and the final Cosmic Duality AES blob.
- **Method** — Split on `z`; the a/b chunks → 8-bit-ASCII binary (`matrixsumlist`, `enter`); the a–i/o chunks → base-9 → hex → ASCII (`lastwordsbeforearchichoice`, `thispassword`). Two chunks — `dbbi` (91 symbols) and `faed` (570) — refuse to decode. The cosmic key is meant to be built from `yellowblueprimes · matrixsumlist · lastwordsbeforearchichoice · yinyang`.
- **Output** — OPEN / UNSOLVED. `dbbi`/`faed` are undecoded; `yellowblueprimes`, `yinyang`, and the combine operation are unknown; the cosmic blob has never been decrypted. The 5 BTC is unclaimed.

</div>

<details class="wt-more"><summary>📖 Full walkthrough — the complete write-up, code, images and sources</summary>

> **Status at a glance:** SalPhaseIon is **partially solved** — four tokens are cleanly decoded and reproduce exactly. Two blocks of the soup (`dbbi` and `faed`) and the embedded `salph_inner` AES blob are **UNDECODED**. **Cosmic Duality is genuinely OPEN — unsolved.** No one has ever produced a Bitcoin private key that moves the prize coins. Everything below distinguishes ✅ SOLVED/reproduced from ⚠️ HYPOTHESIS/community-guess from ❌ UNSOLVED.

![SalPhaseIon / Cosmic Duality](assets/walkthrough/salphaseion-assets/SalPhaselonCosmicDuality.png)

After the [Decentraland step](#) revealed the command `HASHTHETEXT`, you take **all the text on the opening puzzle image including the prize address**, with no spaces — `GSMGIO5BTCPUZZLECHALLENGE1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe` (59 chars, **no trailing newline**) — and SHA-256 it:

```python
>>> import hashlib
>>> hashlib.sha256('GSMGIO5BTCPUZZLECHALLENGE1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe'.encode()).hexdigest()
'89727c598b9cd1cf8873f27cb7057f050645ddb6a7a157a110239ac0152f6a32'
```

That hash is the secret page name: **`gsmg.io/89727c598b9cd1cf8873f27cb7057f050645ddb6a7a157a110239ac0152f6a32`** — the **SalPhaseIon** page (which also hosts the **Cosmic Duality** endgame). ✅ CONFIRMED (recomputed; the no-newline detail is load-bearing — adding a newline gives a different hash). The instructions to reach this page were only publicly revealed on **2021-05-06** ("hash the text on the image").

---

### 9.1 The soup — full structure

The SalPhaseIon page is one long "soup" of single letters separated by spaces, drawn from a tiny alphabet (mostly `a`–`i`, with `o` and `z` appearing later, plus two embedded base64 blobs and some plain English). Here is the **complete raw soup verbatim**:

```
d b b i b f b h c c b e g b i h a b e b e i h b e g g e g e b e b b g e h h e b h h f b a b f d h b e f f c d b b f c c c g b f b e e g g e c b e d c i b f b f f g i g b e e e a b e a b b a b b a b a b b a a a a b a b b b a b a a a b b b a a b a a b b a b a a b a b b b b a a a a b b b a a b b a b b b a b a b a b b a b b a b a b b a b b a a a b b a b a a b a b b b a a b b a b b b a b a a f a e d g g e e d f c b d a b h h g g c a d c f e d d g f d g b g i g a a e d g g i a f a e c g h g g c d a i h e h a h b a h i g c e i f g b f g e f g a i f a b i f a g a e g e a c g b b e a g f g g e e g g a f b a c g f c d b e i f f a a f c i d a h g d e e f g h h c g g a e g d e b h h e g e g h c e g a d f b d i a g e f c i c g g i f d c g a a g g f b i g a i c f b h e c a e c b c e i a i c e b g b g i e c d e g g f g e g a e d g g f i i c i i i f i f h g g c g f g d c d g g e f c b e e i g e f i b g i b g g g h h f b c g i f d e h e d f d a g i c d b h i c g a i e d a e h a h g h h c i h d g h f h b i i c e c b i i c h i h i i i g i d d g e h h d f d c h c b a f g f b h a h e a g e g e c a f e h g c f g g g g c a g f h h g h b a i h i d i e h h f d e g g d g c i h g g g g g h a d a h i g i g b g e c g e d f c d g g a c c d e h i i c i g f b f f h g g a e i d b b e i b b e i i f d g f d h i e e e i e e e c i f d g d a h d i g g f h e g f i a f f i g g b c b c e h c e a b f b e d b i i b f b f d e d e e h g i g f a a i g g a g b e i i c h i e d i f b e h g b c c a h h b i i b i b b i b d c b a h a i d h f a h i i h i c z a g d a f a o a h e i e c g g c h g i c b b h c g b e h c f c o a b i c f d h h c d b b c a g b d a i o b b g b e a d e d d e z c f o b f d h g d o b d g o o i i g d o c d a o o f i d h z s h a b e f o u r f i r s t h i n t i s y o u r l a s t c o m m a n d U 2 F s d G V k X 1 8 6 t Y U 0 h V J B X X U n B U O 7 C 0 + X 4 K U W n W k C v o Z S x b R D 3 w N s G W V H e f v d r d 9 z a b b a a b a b a b b a b b b a a b b b a b a a a b b a a b a b a b b b a a b a Q v X 0 t 8 v 3 j P B 4 o k p s p x e b R i 6 s E 1 B M l 5 H I 8 R k u + K e j U q T v d W O X 6 n Q j S p e p X w G u N / j J s h a b e f a n s t o o
```

**First observations:**
- There are spaces between every character.
- There is plain English buried in it: `our first hint is your last command` (and the leading `four` resolves an `our`/`four` ambiguity — see §9.6).
- There are two base64 chunks that look like the `U2Fsd…` AES envelopes from earlier phases.
- There are runs of only `a` and `b` (binary).
- The letter **`z`** acts as a **separator** between sections.
- The token **`shabef`** appears **twice**, bracketing the AES region.

**The decomposition (read in soup order):**

```
[dbbi … (91 symbols)]                       ← UNDECODED block, a–i alphabet
[binary1: a/b]  → "matrixsumlist"            ← ✅ 104 bits
[faed … (570 symbols)]                       ← UNDECODED block, a–i alphabet
z
[agda …]        → "lastwordsbeforearchichoice"  ← ✅ a–i/o field-decode
z
[cfob …]        → "thispassword"                ← ✅ a–i/o field-decode
z
"shabef"  "our first hint is your last command"
[salph_inner AES blob, base64, split by z]   ← UNDECODED 80-byte blob
   …with [binary2: a/b] → "enter"  embedded inside it   ← ✅ 40 bits
"shabef"  "anstoo"
```

So the soup contains **four decoded tokens** (`matrixsumlist`, `enter`, `lastwordsbeforearchichoice`, `thispassword`), **one undecoded AES blob** (`salph_inner`), the **two undecoded a–i blocks** (`dbbi`, `faed`), and the framing text.

---

### 9.2 The a/b binary chunks → `matrixsumlist` and `enter`

Two runs use only `a` and `b`. Set **a = 0, b = 1**, concatenate, split into 8-bit bytes, and read as ASCII.

**Binary chunk 1** (104 bits → 13 chars → `matrixsumlist`):

```
a b b a b b a b a b b a a a a b a b b b a b a a a b b b a a b a a b b a b a a b a b b b b a a a a b b b a a b b a b b b a b a b a b b a b b a b a b b a b b a a a b b a b a a b a b b b a a b b a b b b a b a a
```

```python
s = 'abbabbababbaaaababaaababbabaaaabbbaababaabbabaababbbbaaaabbbaababbabbbababababbabbababbabbaaabbabaababbbaabbabbbabaa'  # a→0, b→1
s = s.replace('a','0').replace('b','1')
parts = [s[i:i+8] for i in range(0, len(s), 8)]
digits = [int(p, 2) for p in parts]
''.join(map(chr, digits))   # → 'matrixsumlist'
```

→ **`matrixsumlist`** ✅ CONFIRMED. (CyberChef: `Remove whitespace` → `Substitute('ab','01')` → `From Binary('Space',8)`.) This token is a **label** for the genesis-image row/column sums from Phase 0 — rows `[6,10,8,7,6,6,5,4,9,9,7,8,7,9]` → `610876654997879`, cols `[8,10,8,10,8,7,3,6,7,5,9,6,6,8]` → `8108108736759668`. It is **cosmic ingredient #2** (see §9.7). ⚠️ Note: the exact byte-form that feeds the final SHA-256 is ambiguous (the value `10` makes `610876…` parse two ways: naïve concat vs. zero-padded two-digit vs. base-14/15 vs. interleaved). This ambiguity alone could break an otherwise-correct cosmic recipe.

**Binary chunk 2** (40 bits → 5 chars → `enter`), embedded **inside** the `salph_inner` blob's base64:

```
a b b a a b a b a b b a b b b a a b b b a b a a a b b a a b a b a b b b a a b a
```

```python
s = 'abbaababababbabbbaabbbabaaabbaababab...'  # same method, a→0,b→1
# → 'enter'
```

→ **`enter`** ✅ CONFIRMED. This token is **not** a cosmic ingredient. It may be a literal UI command ("enter the password"), tied to `thispassword` and "our first hint is your last command"; its position **splitting** the inner blob's base64 may also be a delimiter/byte-offset marker. `[UNUSED / unexploited]`.

---

### 9.3 The a–i/o field chunks → `lastwordsbeforearchichoice` and `thispassword`

The chunks separated by `z` (named `agda` and `cfob` after their first letters) use the alphabet `a`–`i` **plus `o`**. That is 10 symbols. Since the binary chunks proved **a = 1**, and `i` is the 9th letter (i = 9), the introduced `o` must be **0**. So:

```
a→1 b→2 c→3 d→4 e→5 f→6 g→7 h→8 i→9 o→0
```

Map the letters to digits to form one large decimal number, convert that number to **hex**, then read the hex pairs as ASCII (the same int→hex→ASCII trick seen in the Decentraland step).

**Chunk `agda`:**
```
a g d a f a o a h e i e c g g c h g i c b b h c g b e h c f c o a b i c f d h h c d b b c a g b d a i o b b g b e a d e d d e
```
→ digits `174161018595377387932283725836301293648834223172419022725145445`

```python
import binascii
s = 'agdafaoaheiecggchgicbbhcgbehcfcoabicfdhhcdbbcagbdaiobbgbeadedde'
t = s.translate(str.maketrans('abcdefghio','1234567890'))
h = hex(int(t))[2:]
binascii.a2b_hex(h).decode()   # → 'lastwordsbeforearchichoice'
```

→ **`lastwordsbeforearchichoice`** ✅ CONFIRMED. This is **cosmic ingredient #3**. ⚠️ The *name* implies a *value* never substituted — the actual final speech lines before the Architect's choice ("…CIAO BELLA O" / "RETURN TO THE SOURCE CODES… PRIME BASICS"). Whether the recipe wants the literal word or that speech span is unresolved.

**Chunk `cfob`:**
```
c f o b f d h g d o b d g o o i i g d o c d a o o f i d h
```
→ digits `36026487402470099740341006948`

```python
s = 'cfobfdhgdobdgooiigdocdaoofidh'
t = s.translate(str.maketrans('abcdefghio','1234567890'))
binascii.a2b_hex(hex(int(t))[2:]).decode()   # → 'thispassword'
```

→ **`thispassword`** ✅ CONFIRMED. This is **not** a cosmic ingredient. Self-referentially, "this password" may be the key to the adjacent `salph_inner` blob (or cosmic). `[UNUSED]` — never tested in combination with `enter` / "our first hint is your last command".

---

### 9.4 The UNDECODED `dbbi` (91) and `faed` (570) blocks

Two large a–i blocks at the front of the soup have **never been decoded**. They are nicknamed by their first four symbols. **These are the doorway to the endgame** — the hoped-for sources of `yellowblueprimes` and `yinyang`.

**`dbbi` — 91 symbols** (91 = 7 × 13), the exact string:

```
dbbibfbhccbegbihabebeihbeggegebebbgehhebhhfbabfdhbeffcdbbfcccgbfbeeggecbedcibfbffgigbeeeabe
```

**`faed` — 570 symbols** (570 = 2 · 3 · 5 · 19), the exact string:

```
faedggeedfcbdabhhggcadcfeddgfdgbgigaaedggiafaecghggcdaiheha hbahigceifgbfgefgaifabifagaegeacgbbeagfggeeggafbacgfcdbeiffaafcidahgdeefghhcggaegdebhhegeghcegadfbdiagefcicggifdcgaaggfbigaicfbhecaecbceiaiceb gbgiecdeggfgegaedggfiiciiififhggcgfgdcdggefcbeeigefibgibgggh hfbcgifdehedfdagicdbhicgaiedaeh ahghhcihdghfhbiicecbiichihiiigiddgehhdfdchcbafgfbhahe agegecafehgcfggggcagfhhghbaihidiehhfdeggdgcih gggggh adahigigbgecgedfcdggaccdehiicigfbffhggaeidbbeibbeiifdgfdhi eeeieeeci fdgdahdiggfhegfiaffigg bcbceh ceabfbed biibfbfdedee hgigfaaigg agbeiichiedifbehgbccahh biibibbib dcbaha idhfahiihic
```

> ⚠️ The `faed` string above is the same as the soup; whitespace within it here is incidental — the canonical contiguous symbol stream is 570 characters long. The repo keeps these in `dbbi.txt` / `faed.txt`.

**Why they resist decode (the exhaustion map):**
- The a–i/o **field-decode** method (the one that worked for `agda`/`cfob`) produces **garbage** for `dbbi`/`faed`. Crucially, `dbbi` and `faed` **lack the `o`(=0) symbol** entirely — so a straight field-decode can never produce decimal values that contain `0` (and `yellowblueprimes`/`yinyang` as decimals *do* contain zeros). This is read as a designed signal: the solver must **insert** the missing zeros at indexed positions *before* field-decoding.
- **All 362,880 (9!) symbol→digit permutations** of the field-decode → garbage (max printable ratio 0.74 for `dbbi`, 0.52 for `faed`).
- All 9! monoalphabetic substitutions; transposition×substitution (3.27M combos); Vigenère/Beaufort periods 1–6; grids; bifid; base-81; alternate base reads — **all garbage**.
- Treating `dbbi` as **binary** via the verified `fefefe is 101010` rule (per-symbol map `f→1, e→0`, prime-valued symbols zeroed) — flat 7/8-bit reads, subset bit-maps, both polarities, grid re-index (rows/cols/diag/boustrophedon/transpose/reverse), bitmap render — **all noise**. And it is **mathematically too small**: 91 bits → max ~13 chars, cannot hold the 16-char word "yellowblueprimes". So `dbbi` must encode a **computed number**, not the literal word.
- `faed`: **index of coincidence ≈ 0.118** (essentially random) → it is **not enciphered English**; not a `Salted__` blob, not block-aligned, not compressed, not a yin/yang self-complement (halves correlate ~0.10 = chance). The creator (2020-08-02) hinted "the second half will probably be used for **another puzzle**, or not at all" — so `faed` may not feed cosmic at all; it could itself be the unfound "other door" payload, or itself be keyed/encrypted data.

❌ **UNSOLVED.** The mapping `dbbi → yellowblueprimes` and `faed → yinyang` is a **community guess, not a result.** ⚠️ The repo's own dead-end ledger records the literal string `yellowblueprimes` is **absent from `dbbi` in every tested base**. (The citation of GitHub issue #56 for these nicknames is **mismatched** — issue #56 contains none of the terms `dbbi/faed/yellowblueprimes/yinyang/91/570`; the nicknames trace only to this repo's `index.html`.)

---

### 9.5 The `salph_inner` AES blob

Between the two `shabef` markers sits a standard OpenSSL `Salted__` AES base64 envelope, split by the `z` separator and by the embedded `enter` binary. Reassembled, the two halves are:

```
U2FsdGVkX186tYU0hVJBXXUnBUO7C0+X4KUWnWkCvoZSxbRD3wNsGWVHefvdrd9z
QvX0t8v3jPB4okpspxebRi6sE1BMl5HI8Rku+KejUqTvdWOX6nQjSpepXwGuN/jJ
```

> Note the soup *appears* to give unequal-length lines and a trailing `shabefanstoo`; once the framing tokens (`shabef`, `anstoo`) and the embedded `enter` are removed, the clean blob is the two 64-char base64 lines above. ⚠️ The very first `z` in the first line is the separator that the `enter` binary was nested at.

- **salph_inner salt:** `3ab585348552415d` (✅ extracted from the artifact)
- **Size:** 80-byte ciphertext (so a correct key would yield ≤79 readable bytes — an **instant, self-verifying oracle**).

❌ **UNDECODED.** Thousands of candidate keys (all soup tokens, `enter`+`thispassword`, the 2020 "Roses" poem in many normalizations, etc.) → **0 PKCS7-valid hits**. The wrapping text literally states the recipe — `shabef` = **sha256** (see §9.6) of some value derived from "our first hint is your last command" / the 2020 poem — which **nobody has publicly decoded into a value**. The creator's hint "Breaking salphation should give the FEELING OF THE PHASE'S NAME" (SalPhaseIon ≈ *salvation*) suggests the correct plaintext reads salvation-themed.

---

### 9.6 `shabef` = SHA-256, and "four first hint is your last command"

Two soup features tell you the **combine operation** and give the master instruction:

**`shabef` = sha256.** Reading `shabef` as `sha` + `b,e,f`, and applying the a1z26 map (a=1 … z=26): **b=2, e=5, f=6** → `sha` + `256` → **`sha256`**. ✅ CONFIRMED. This is the puzzle telling you the final combine uses SHA-256 — consistent with every earlier phase (`answer → sha256 → AES key`).
- ⚠️ The **double** occurrence of `shabef` may signal `sha256(sha256(...))` (double-hash) or **two separate sha steps** (one per blob). Only single-sha has been seriously tried.
- (This `{2,5,6}` triple also appeared in Phase 2 as the Klingon clue `cha' + (vagh·jav) = 2 + 5·6 = 32`, an apparent deliberate cross-phase seed.)

**"four first hint is your last command".** The soup spells `s h a b e f o u r f i r s t h i n t…`. The two `shabef`s leave the plain English **`our first hint is your last command`**; on-chain OP_RETURN dust posted by solvers confirms the leading word is **`four`** (resolving the `our`/`four` ambiguity → it is **`fourfirsthintisyourlastcommand`**). ✅ The "first hint" is read as the **2020-01-14 "Roses are White" poem** (the genesis-image clue), and the instruction says that poem is "your last command" — i.e. the final recipe. That poem was **never publicly decoded into a value**, and is considered the unsolved heart of the endgame.

> The 2020-01-14 poem (sourced to the creator's Telegram):
> ```
> Roses are White but often Red.
> Yellow has a number and so does Blue.
> Go back to the first puzzle piece without further ado.
>
> It might have shown you only one door, beware that the rabbits nest may contain a whole lot more.
>
> Hush hush.
> ```
> "Yellow has a number and so does Blue" is read as the instruction to compute the two numbers behind **`yellowblueprimes`** from the genesis grid's yellow/blue cells; "rabbits nest may contain a whole lot more" hints the first image holds more than the URL. **Nobody publicly decoded it as a recipe.** ⚠️/❌

---

### 9.7 Cosmic Duality — the endgame (OPEN — unsolved)

**Plain English:** Cosmic Duality is the final, locked box: a large AES-256-CBC blob that, when correctly decrypted, yields the Bitcoin **private key** to the prize. The puzzle's own 2023 master hint **names** the four password ingredients but **deliberately withholds how to combine them** ("we won't give away the password"). **No one has ever decrypted it.**

The theme was first teased on **2022-12-10** with a photo of a real book titled **Cosmic Duality** (from the *Mysteries of the Unknown* series — its cover shows a yin-yang of two galaxies, one bright, one dark):

![2022 cosmic hint](assets/walkthrough/hints/2022-12-10-cosmic.png)

![Cosmic Duality book](assets/walkthrough/hints/cosmic-duality-book.png)

The two stars (bright/dark) map onto the recurring duality: genesis **blue ↔ yellow**, the Architect's **"HALF and BETTER HALF"**, **yin ↔ yang**. ⚠️ The book itself (title/subtitle/ISBN/a specific page) was floated as a possible literal `yinyang` value but never pursued to a result.

**The Cosmic AES blob:**
- **Cosmic salt:** `2d3f6fe06dc950e6` (✅ extracted)
- **Size:** 1328-byte ciphertext (1328 = 83 × 16)
- Wayback archaeology confirms the live SalPhaseIon page `89727c59…` (4592 bytes) contained exactly this soup **plus** the cosmic blob beginning `U2FsdGVkX18tP2/g…` — so the captured `cosmic.txt` is **authentic and complete**. ✅

**The 2023-02-23 official "reverse-binary" master hint.** A seemingly-binary string was posted; each byte is bit-reversed (LSB-first) and the whole string reversed. Decoded, it reads (tokens are self-labeling — the bits literally spell the *words*):

```
yellowblueprimes · matrixsumlist · lastwordsbeforearchichoice · yinyang ·
wewontgiveawaythepassword · itsinfrontofyoureyesbutyourenotseeingit ·
verylaststepisatruegiveaway · promised
```

In plain prose (as the puzzlehunt README renders it):
> yellow blue primes matrix sumlist last words before archichoice yinyang — we wont give away the password its in front of your eyes but youre not seeing it very last step is a true give away promised

✅ CONFIRMED decode (single-source Naddiseo). The **first four** tokens are the believed cosmic **ingredients**:
1. **`yellowblueprimes`** — VALUE must be **computed** from the genesis grid (yellow cells, blue cells, primes 2/3/5/7). **No verified value.** ❌ OPEN. Hoped to come from `dbbi`.
2. **`matrixsumlist`** — ✅ known label; value = genesis row-sums `610876654997879` + col-sums `8108108736759668` (exact byte-form ambiguous, §9.2).
3. **`lastwordsbeforearchichoice`** — ✅ known label (§9.3); the *value* it points to is debated.
4. **`yinyang`** — VALUE from the blue↔yellow / 0↔1 / black↔white duality (and/or the Cosmic Duality book). **No verified value.** ❌ OPEN. Hoped to come from `faed`.

The remaining four tokens are a **taunt**: *"we won't give away the password — it's in front of your eyes but you're not seeing it — the very last step is a true giveaway — promised."* ⚠️ These are **not proven to be only-taunt**; their lengths `[25,39,27,8]` (and the full `[16,13,26,7,25,39,27,8]`) have been floated as possible offsets/indices, but nothing has landed.

**The candidate endgame recipe (⚠️ UNVERIFIED HYPOTHESIS — NOT a solve):**

```
privkey = AES-256-CBC-decrypt(
            cosmic blob,            # salt 2d3f6fe06dc950e6
            key = sha256( "yellowblueprimes"
                        + "matrixsumlist"
                        + "lastwordsbeforearchichoice"
                        + "yinyang" )   # combine op + separators UNKNOWN
          )
```

This is **structurally consistent** with the puzzle's universal `answer → sha256 → AES` pattern and with `shabef` = sha256, but it has **never been shown to work** — every tested guess fails with AES **"invalid padding / bad decrypt"**. The recipe *shape* is itself disputed: GitHub issue #56 instead proposed an **XOR of SHA-256 hashes of seven tokens** (which don't even include `yellowblueprimes`/`yinyang`); issue #69's master key `818af53daa3028449f125a2e4f47259ddf9b9d86e59ce6c4993a67ffd76bb402` was tested directly against cosmic under EVP(hex), raw-key/IV=0, raw-key/IV=salt, and ECB — **all padding-fail**, and its "decrypted payload" was just the Phase 3.2 VIC text copy-pasted. **Both public "SOLVED" claims are fabricated/AI-generated.** ❌ REFUTED.

**Why the endgame is so hard (the structural wall).** There is **no partial-progress oracle**: AES only "fires" (valid PKCS7 + readable text) when the *entire* passphrase is correct. The final key needs **three unknowns simultaneously right** — the value of `yellowblueprimes`, the value of `yinyang`, AND the combine operation — and two-of-three perfect still yields pure random bytes with zero feedback. This is a feedback-free, multiplicative search, matching the Architect's own warning: *"twenty-three ciphers, sixteen encryptions… seven intertwined passwords… brute forcing might be required."*

**The vanity-address insight (rules out shortcuts).** The prize address `1GSMG1…` is a **vanity address** (the `1GSMG1` prefix was brute-forced), so its private key is **random** — NOT derived from any phrase. This definitively kills brainwallet / split-key / any address-derivation approach (86,310 brainwallet + 1,204 split-key derivations confirmed: **0 matches**). The key exists **only inside the cosmic blob**; the sole path is decrypting cosmic.

**What a real solve looks like.** A correct decryption produces a Bitcoin **WIF private key** — a ~51–52 char string starting with **`5`** (uncompressed) or **`K`/`L`** (compressed), since `1GSMG…` is a legacy P2PKH address. (The Architect text says "private key**S**" / "HALF and BETTER HALF," and a second funded address `17ucy1K9ZUAaoY6JVtM932W9jUp5LXfyHa` (3.75 BTC) exists — so the target may even be a **pair** of keys.) **The only valid proof of a solve is the prize coins moving on-chain.** As of this writing the funds are unmoved.

---

### 9.8 Open frontier — honest status & the most promising loose ends

| Item | Status |
|---|---|
| `matrixsumlist`, `enter`, `lastwordsbeforearchichoice`, `thispassword` (soup tokens) | ✅ SOLVED / reproduced |
| `shabef` = sha256 (combine hint) | ✅ SOLVED |
| `salph_inner` blob (80 B, salt `3ab585348552415d`) | ❌ UNDECODED |
| `dbbi` (91 symbols) → hoped `yellowblueprimes` | ❌ UNSOLVED (community guess) |
| `faed` (570 symbols) → hoped `yinyang` | ❌ UNSOLVED (community guess; may be a separate puzzle) |
| `yellowblueprimes` value | ❌ OPEN |
| `yinyang` value | ❌ OPEN |
| Cosmic combine operation | ❌ DISPUTED / UNPROVEN |
| Cosmic Duality blob (1328 B, salt `2d3f6fe06dc950e6`) | ❌ **OPEN — UNSOLVED** |

There is also a **third, never-noted 80-byte blob** at the **end of the Phase 3.2 plaintext** (`p32_trailing`, salt `b45a5e3d827593ca`, base64 `U2FsdGVkX1+0Wl49…mdC0NAv4`) and a **fourth orphaned** hex `Salted__` blob (salt `74c974e3f92e64b5`, 96-byte ct) — both self-verifying oracles that resist all tested keys. ❌ UNDECODED.

**The most promising untried threads** (each a self-verifying experiment, ranked):
1. **`p32_trailing` (80 B, fresh oracle):** build the chess clue *"a fubcd-king & oracle-queen, thingky mvps, on a sad board but as wide as the first one seen"* as an **actual board/coordinate construction** (14-wide), sha256 candidate FEN/coordinate forms, decrypt. No community history to repeat.
2. **Genesis spiral as the array-indexer** ("if you know how the ARRAY IS INDEXED"): re-index `dbbi` (7×13) and `faed` (19×30) with the exact `matrix.js` CCW spiral, apply the `f→1/e→0` prime-value binary rule, then field-decode.
3. **`yinyang` from the Cosmic Duality book / genesis blue↔yellow duality** (the creator's named gate — "once you hit a yin yang, you'll solve it the SAME DAY", 2023-08-06).
4. **`yellowblueprimes` from the colored-cell index sets ∩ primes** (2020 poem "Yellow has a number and so does Blue"): yellow-set `{5,9,10,15,18,19,21,22,24}`, blue-set `{1,2,3,4,6,7,8,11,12,13,14,16,17,20,23}`, intersected with prime positions, hashed and tested against the small oracle blobs first.
5. **`salph_inner` keyed by `enter`/`thispassword`/"first hint is your last command"** — recognize success via salvation-themed plaintext.
6. **Zero-INSERTION at prime-indexed positions** before field-decoding `dbbi`/`faed` (the "some characters need to be zeroed out" hint) — never combined with the array-indexing + primes-{2,3,5,7} rule.

> **Bottom line:** SalPhaseIon's four word-tokens are solid and reproducible; the `dbbi`/`faed` blocks, the `salph_inner` blob, and **Cosmic Duality** are **genuinely OPEN**. Treat any "I solved it" post that does not show the prize address `1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe` dropping to zero on-chain as **false**.

</details>


---

## Appendix — Creator Hint Timeline (2019–2026)

<details class="wt-more"><summary>📖 The full creator hint timeline (2019–2026) — every message &amp; hint, transcribed</summary>

From the puzzle's **April 2019 launch** onward, the creator — posting in the official **Telegram** group under the handle **"Jrk Bgrt"** (admin), and occasionally in the `#Crypto_Puzzles` **Discord** channel — posted a long stream of confirmations, corrections, jokes, and hints. The 2019 messages track the rapid fall of Phases 1–3 and the infamous Phase-III typo; from 2020 onward, with the endgame stalled, the hints became the hunt's main lifeline. This section reproduces every substantive one in chronological order, with a faithful transcription (and, where one exists, the original screenshot inline).

> **Reading guide.** Not everything Jrk posted is a real hint — he sometimes explicitly said he was "just fooling around," and at least one entry is an April Fools' joke. Each entry below is tagged accordingly. The hints that matter most for the still-**OPEN endgame** (Cosmic Duality / the final private key) cluster around a handful of recurring themes:
> - **Primes 2,3,5,7** — "the prime part," confirmed repeatedly as essential to proceed.
> - **"Zeroed out" characters** — some characters must be set to zero (`fefefe` / `101 010`).
> - **`fefefe`** — tied to the hex value `104` ("hundred FOUR = 104 is the fefefe square").
> - **"Theory of everything"** — confirmed as a valid path to the private key.
> - **"Another door" / "second door"** — an extra, possibly never-found stage beyond the known phases.
> - **"Ying yang" (yinyang)** — once reached, the puzzle is supposedly solvable the same day.
>
> These themes are flagged with **[ENDGAME]** below.

### Timeline at a glance

| Date | Channel | Type | One-line summary |
|------|---------|------|------------------|
| 2019-04-20 | Telegram | Event | First code cracked "way faster than expected"; confirms the puzzle has **multiple stages** |
| 2019-04-22 | Telegram | Hint | Releases the **stage-1 SHA-256 hash** (`5ac4078…746f75`) so solvers can test answers offline; the answer is "**a sticker**" |
| 2019-04-23 | Telegram | Event | **Ewout** is the first to crack the April-1st puzzle |
| 2019-05-08 | Telegram | Event | Somebody reaches **Phase 3** |
| 2019-05-14 | Telegram | Meta | The puzzle wasn't promoted and **is** solvable; unrelated "quests" may be scams |
| 2019-05-17 | Telegram | **Correction** | The famous Phase-III typo fix — add one character between the 3 answers: **`giveit = givetit`** |
| 2019-05-18 | Telegram | Meta | If unsolved in 2019, a **final "tiny hint"** comes at the start of 2020 — but the key is solvable without it; no hints after stage 2 except the "t" |
| 2019-05-26 | Telegram | Hint | Confirms a **song** must be found; voice-recognition could pass it |
| 2019-09-22 | Telegram | Hint | The puzzle has **"7 parts"**; a piece may be found **outside** the main puzzle |
| 2019-12-31 | Telegram | Meta | The final hint will land at the **start of 2020**, well before the halving |
| 2020-01-14 | Telegram | Official hint | "Roses are White but often Red" poem — points back to the first puzzle piece / a hidden second door |
| 2020-02-20 | Telegram | Official hint | Decentraland screenshot at (-41,-17) — leads toward SalPhaseIon |
| 2020-02-22 | Telegram | Clarification | Early-stage solutions are online; **typos hide no clues**; **only -41,-17 matters** |
| 2020-02-25 | Telegram | Hint | **"3.2 is a thing"** — most see 3.2 as the last part; maybe nobody found the **direction** |
| 2020-04-08 | Telegram | **Not a hint** ("just fooling around") | Matrix "Hope… human delusion" quote |
| 2020-05-11 | Telegram | Event + hint | First halving; prize halved; the **2nd door**; "the price is in half, but what does it mean"; next halving block 209999 |
| 2020-05-20 | Telegram | Hint | "The answer is there"; indexing hint **"First or zero"** (0- vs 1-based) |
| 2020-06-07 | Discord | Community | First public mention of **SalPhaseIon**; "combine the last 2 hints, understand the first door" |
| 2020-08-02 | Telegram | Hint | "Really nobody managed to find the extra door" |
| 2020-08-09 | Telegram | Answer | What you're after is "**a private key**" |
| 2020-08-12 | Telegram | Meta | The hints make the path "pretty obvious" yet it's unsolved; one club passed but is stuck |
| 2020-10-27 | Telegram | Event | Prize **still at** `1GSMG1…` (unclaimed); solver #2 reached the next stage |
| 2020-11-24 | Telegram | Event | Prize money is **halved at every Bitcoin halving** (maybe in the same block) |
| 2021-01-21 | Telegram | Hint | "A few might not require the internet anymore" |
| 2021-02-12 | Telegram | Community summary | Open questions about `#..#`, the 2nd way, mp3 blobs, "salphaselon" origin |
| 2021-03-01 (primes) | Telegram | Hint **[ENDGAME]** | "You are at the prime part already???" — primes 2,3,5,7 |
| 2021-03-01 (spelling) | Telegram | Hint **[ENDGAME]** | Spelling errors are just typos; `fefefe = 104 = 101 010`; "ancient spelling" |
| 2021-03-05 | Telegram | Hint | One-word clue: **"Infrared"** |
| 2021-03-14 | Telegram | Hint | "Breaking salphation should be giving the feeling of the phase's name"; another team reaches salph |
| 2021-03-27 | Telegram | Hint | Psychedelic aside (psilocybe / 5-MeO-DMT) — "breaking salphation" is about a **feeling** |
| 2021-03-31 | Telegram | Hint **[ENDGAME]** | "another door might be found on **{1},{4},{21}**" |
| 2021-04-01 | Telegram | **April Fools** | "R=18, A=1, B=2 … could also be 21 or 1812 bit" |
| 2021-04-16 | Telegram | Leak | Full SalPhaseIon blob posted for verification |
| 2021-05-06 | Telegram | Official instruction | "SHA-256(GSMGIO5BTCPUZZLECHALLENGE…)" — how to enter SalPhaseIon |
| 2021-08-11 | Telegram | Hint **[ENDGAME]** | The address is **found by solving**; the solver will find a way to **"decrypt"** it |
| 2021-12-02 | Telegram | Official hint | "There is Another DOOR" |
| 2021-12-25/26 | Telegram | Official hint **[ENDGAME]** | Prime numbers required; some characters must be **"zeroed out"** |
| 2021-12-31 | Telegram | Hint | Joke: "the only date I give away is the expiry date of **Neo's passport**" (Matrix) |
| 2022-12-10 | Telegram | Hint | Photo of a book, *Cosmic Duality* |
| 2023-01-09 | Telegram | Hint **[ENDGAME]** | "At least prime number is very important to get any further" |
| 2023-01-12 | Telegram | Semi-official hint **[ENDGAME]** | "Theory of everything is a valid path"; "higher than **sqrt(-1)**"; remaining 2.5 BTC "or 5" |
| 2023-01-25 | Telegram | Hint **[ENDGAME]** | Posts "**42**" (theory-of-everything theme) |
| 2023-02-23 | Telegram | Official hint | Binary string decoding to "yellow blue primes matrix sumlist…" |
| 2023-08-03 | Telegram | Official hint | "Are you really looking for just the btc…?" / "the hardest part is done" |
| 2023-08-04 | Telegram | Hint **[ENDGAME]** | Phrase: **"Globally supporting my generation"** (G S M G) |
| 2023-08-06 | Telegram | Official hint **[ENDGAME]** | "Once you hit a 'ying yang', you'll solve it the same day"; private key; internet only to **claim** |
| 2023-11-24 | Telegram | Clarification **[ENDGAME]** | Internet is **NOT required to solve** (only to claim) |
| 2023-12-26 | Telegram | Hint | "Have you tried the **purple pill**?" (red + blue) |
| 2024-01-26 | Telegram | Hint **[ENDGAME]** | Final answer format is a **"Regular Bitcoin Private key"** |
| 2024-03-26 | Telegram | Meta | Will **no longer answer** puzzle questions; future hints go to the channel only |
| 2024-04-10 | Telegram | Countdown | "1357 blocks to go" |
| 2024-04-19 | Telegram | Event + hint | Second halving; prize halved again; "the most obvious reason to hold Bitcoin" |
| 2024-11-29 | Telegram | Hint **[ENDGAME]** | One "**microstep**" from a same-day solve; he'd try **ASCII 127** (DEL); you only need the **last digit of pi** |
| 2025-04-28 | Telegram | Endgame **[ENDGAME]** | **Nobody has reached "yingyang"** yet; once reached, **≤2 hours** to solve |
| 2025-09-15 | Telegram | Hint | Trivia: carrots were **purple** until the Dutch made them orange (colour theme) |
| 2026-01-01 | Telegram | New Year's hint | Binary → "Happy new year! … here's a 'tiny hint' <3" |
| 2026-03-03 | Telegram | Hint **[ENDGAME]** | "No hints, only **free will**"; cites **Jacque** (Fresco); reaching the next phase = **instant claim** |
| 2026-05-28 | Telegram | Meta | Confirms the puzzle is **still valid** / unsolved |

---

### 2019 — Launch year: Phases 1–3 fall fast, and the infamous typo

The puzzle went live on **20 April 2019**. These early Telegram messages — absent from earlier versions of this timeline — track how quickly the first phases fell, the workaround for the site's token errors, the famous Phase-III typo, and the promise of a single "final" hint for 2020.

### 2019-04-20 — First code cracked; "the puzzle has multiple stages"

Within hours of launch the first code fell — far faster than expected — and Jrk confirmed the multi-stage structure.

> **Jrk Bgrt** (admin): Ok.. somebody has cracked the first code. … that was way faster than expected.
> **Jrk Bgrt** (admin): The first part. Maybe the puzzle has multiple stages.
> **Jrk Bgrt** (admin) *(asked whether it really does)*: It is.

### 2019-04-22 — The stage-1 SHA-256 hash ("a sticker")

Because the site threw token/CSRF errors on repeated tries (the load-balancer "is a bitch on multiple tries"), Jrk released the **SHA-256 of the stage-1 answer** so solvers could test candidates offline, and pointed them at an online generator. He also let slip that the answer is "**a sticker**."

> **Jrk Bgrt** (admin): 5ac407837447fba24ba2802e4d1e9aecb4580aa29fef1088cc387c180b746f75
> **Jrk Bgrt** (admin): just try hit your options against that hash.
> **Jrk Bgrt** (admin): https://passwordsgenerator.net/sha256-hash-generator/ … a sticker

### 2019-04-23 — Ewout cracks the April-1st puzzle first

> **Jrk Bgrt** (admin): Ewout managed to crack the april 1st puzzle. He was the first to solve it.

### 2019-05-08 — Phase 3 reached

> **Jrk Bgrt** (admin): Apparently somebody managed to get into Phase 3.

### 2019-05-14 — "We didn't promote this puzzle nor is it unsolvable"

> **Jrk Bgrt** (admin): Quests might* be scams. We didn't promote this puzzle nor is it unsolvable. Please enjoy the puzzle or continue your journey.

### 2019-05-17 — The infamous Phase-III typo: `giveit = givetit`

The single most important early correction. Jrk admitted a mistake **inside Phase III** that makes it "nearly impossible to solve unless you'd know where to add 1 extra character between the 3 answers," then gave the fix. He later clarified the issue is within Phase 3 (not the 2→3 transition) and confessed he had tested the whole puzzle three times with the typo'd string.

> **Jrk Bgrt** (admin): …there might be a mistake in phase III … it makes it nearly impossible to solve unless you'd know where to add 1 extra character between the 3 answers.
> **Jrk Bgrt** (admin): Here's the hint in order to bypass the mistake: **giveit = givetit**
> **Jrk Bgrt** (admin): Once you have to work with give(t)it you'll know.

*(This is the origin of the `givetit` correction applied in Phase 3 above.)*

### 2019-05-18 — The 2020 "final tiny hint" promise; no hints after stage 2

After the typo fix, a team made "an unbelievable amount of progress in just one day." Jrk set the hint policy that would govern the next seven years: one **final tiny hint at the start of 2020** if the key wasn't found in 2019 — but the key is retrievable **without** it — and **no hints after stage 2** beyond the "t" fix.

> **Jrk Bgrt** (admin): In case the private key hasn't been found in 2019 we'll release a tiny hint at the start of 2020, that will be the final hint. Can the private key be retrieved without that hint? Yes.
> **Jrk Bgrt** (admin): No hints after stage 2 (except the 't' to fix my stupid mistake).

### 2019-05-26 — "Ok you found a song"

Confirms a stage hinges on identifying a **song**; voice recognition might even pass it.

> **Jrk Bgrt** (admin): Ok you found a song. Do have a clue on how to proceed on the webpage? … voice recognition might even work to pass although I'd copy paste the answer as it's faster.

### 2019-09-22 — "7 parts" + a piece outside the main puzzle

Two structural confirmations: the puzzle is framed as **"7 parts,"** and a piece may be found **outside** the main puzzle line.

> **Jrk Bgrt** (admin): 7 parts right?
> **Jrk Bgrt** (admin): There may indeed a piece be found outside the main puzzle.

### 2019-12-31 — The final hint will land "start of 2020"

> **Jrk Bgrt** (admin): It's at the start of 2020 indeed, way before the halving.

### 2020-01-14 — Official Hint: "Roses are Red" poem

The creator posted this poem in the Telegram group. It points back to the very first puzzle piece (the bunny/QR image) and warns that the "rabbit's nest" hides more than one door. Despite much effort, no one publicly decoded it at the time.

![Roses are red poem hint, Telegram 2020-01-14](assets/walkthrough/hints/2020-01-14-roses-are-red.png)

> **Jrk Bgrt** (admin):
> Roses are White but often Red.
> Yellow has a number and so does Blue.
> Go back to the first puzzle piece without further ado.
>
> It might have shown you only one door, beware that the rabbits nest may contain a whole lot more.
>
> Hush hush.
>
> Good luck 👍

*(The colour/number references — "Yellow has a number and so does Blue" — foreshadow the later `yellow blue primes` material; see 2023-02-23.)*

### 2020-02-20 — Official Hint: Decentraland

A second official hint: a screenshot taken inside [Decentraland](https://decentraland.org/) at coordinates **-41,-17**. Solving it (click the box, download the sound, split the stereo tracks, invert one, mix back together) reveals the message **`HASHTHETEXT`** — the key instruction that, combined with the 2020-01-14 poem, eventually unlocked SalPhaseIon.

![Decentraland in-world hint screenshot, Telegram 2020-02-20](assets/walkthrough/hints/decentraland-tg.png)

### 2020-02-22 — "Only -41,-17 matters"; typos hide no clues

A clarification alongside the Decentraland hint: solutions for the first stages are already online, the many typos are just rushed mistakes with **no hidden clues**, and of the Decentraland material **only the coordinates -41,-17 matter**.

> **Jrk Bgrt** (admin): Typos: Horrible mistakes due to rushed work. No clues to be found in those typos might you wonder. … Only -41,-17 matters.

### 2020-02-25 — "3.2 is a thing"

First appearance of the **"3.2"** stage label, with the suggestion that nobody had yet found the right **direction**.

> **Jrk Bgrt** (admin): 3.2 is a thing btw … Or nobody found the direction … most see 3.2 as the last part.

### 2020-04-08 — "Hope is the quintessential human delusion" *(NOT a hint)*

A *Matrix* (Agent Smith) quote. The creator explicitly disclaimed it in the same breath, so it is most likely Jrk just trolling.

![Matrix Hope quote, Telegram 2020-04-08](assets/walkthrough/hints/2020-04-08.png)

> **Jrk Bgrt** (admin):
> Humph. Hope, it is the quintessential human delusion, simultaneously the source of your greatest strength, and your greatest weakness.
>
> (not a hint btw, just fooling around)

### 2020-05-11 — Bitcoin halving + the "2nd door"

The first Bitcoin halving. Per the creator's stated plan to halve the prize at each Bitcoin halving, half of the prize (2.5 BTC) was moved to [`17ucy1K9ZUAaoY6JVtM932W9jUp5LXfyHa`](https://www.blockchain.com/explorer/addresses/BTC/17ucy1K9ZUAaoY6JVtM932W9jUp5LXfyHa). Jrk used the occasion to tease the **second door**.

![Halving / 2nd door hint, Telegram 2020-05-11](assets/walkthrough/hints/2020-05-11.png)

> **Jrk Bgrt** (admin):
> Let's see what bitcoin is worth the next halving and who knows what you'll find after opening the **2nd door**. The price is in half, but what does it mean 🤔.

### 2020-05-20 — "First or zero"

An indexing / off-by-one hint — the answer is already present in the material, and the question is whether to count from **first (1) or zero (0)**.

> **Jrk Bgrt** (admin): …answer is there … First or zero.

### 2020-06-07 — First public mention of SalPhaseIon (Discord)

In the `#Crypto_Puzzles` Discord channel, user **VrsN** publicly named **SalPhaseIon** for the first time and hinted at the method.

![SalPhaseIon first mention, Discord 2020-06-07](assets/walkthrough/hints/2020-06-07-salph-discord.png)

> **VrsN** — 07/06/2020 09:53:
> SalPhaseIon. Anybody there by now? We're stuck for over 2 months now. Just combine the last 2 hints and understand what the first door is, then you know what to look for.

### 2020-08-02 — The "extra door" still unfound

A community member notes the second half of the prize might fund another puzzle; Jrk responds that nobody has found the extra door.

![Extra door discussion, Telegram 2020-08-02](assets/walkthrough/hints/2020-08-02.png)

> **senape:** I know, but they said that the second half will probably be used for another puzzle
> **Jrk Bgrt** (admin): Or the same puzzle, or just not at all 🧙‍♂️🔮
> **Jrk Bgrt** (admin): Really nobody managed to find the extra door, didn't expect that after the earlier pace of cracking things.

### 2020-08-09 — "A private key"

Asked what the puzzle ultimately yields, Jrk answers plainly.

> **Jrk Bgrt** (admin): a private key

### 2020-08-12 — "The hints state the path pretty obvious… yet"

> **Jrk Bgrt** (admin): Indeed remarkable with the hints stating the path pretty obvious… There's 1 club that passed but they are stuck in the next phase.

### 2020-10-27 — Prize still unclaimed; solver #2 advances

Jrk confirmed the prize was still sitting at the GSMG address, and that a second solver had reached the next stage.

> **Jrk Bgrt** (admin): https://www.blockchain.com/btc/address/1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe — price is indeed still there.

### 2020-11-24 — Why the prize halves

The first clear statement of the **prize-halving mechanic**: the bounty is cut in half at every Bitcoin halving (possibly in the same block) — the on-chain "spends" later mistaken for a solve.

> **Jrk Bgrt** (admin): We have our reasons halving the price money at every bitcoin halving event :-). Who knows, maybe even in the same block.

### 2021-01-21 — "A few might not require the internet anymore"

Jrk confirms that at least one team had, by this point, reached the final stage. In retrospect the Telegram/Discord logs suggest some groups had quietly reached it in late 2020 without announcing it; this was the first public confirmation.

![No-internet hint, Telegram 2021-01-21](assets/walkthrough/hints/2021-01-21.png)

> **Jrk Bgrt** (admin):
> Not to give any hint but a few might not require the internet anymore.

### 2021-02-12 — Community status summary (first SalPhaseIon mention in Telegram)

A (since-deleted) account posted an open-questions summary of where the community stood.

![SalPhaseIon summary, Telegram 2021-02-12](assets/walkthrough/hints/2021-02-12-salph-mention.png)

> **Deleted Account:**
> summary:
> #..# wasnt used.
> 2nd way from start wasnt founded (shared).
> blobs in mp3 didnt recovered.
> "salphaselon" is unknown from where was taken and didnt confirmed.
>
> more?

### 2021-03-01 — "You are at the prime part already???" **[ENDGAME]**

A user fishes for confirmation about which primes are used. Jrk's surprised reply ("You are at the prime part already???") effectively confirms that **primes 2, 3, 5, 7** are part of the endgame — then he realises he gave too much away.

![Primes hint, Telegram 2021-03-01](assets/walkthrough/hints/2021-03-01-primes.png)

> **Janusz Baran:** o thx you for answer :D
> **Janusz Baran:** this is a hint !
> **Janusz Baran:** just say which primes 2,3,5,7 we need use
> **Janusz Baran:** :D
> **Janusz Baran:** and will be fine :D
> **Jrk Bgrt** (admin): You are at the prime part already???
> **Janusz Baran:** there are too many combinations :(
> **Janusz Baran:** yes
> **Jrk Bgrt** (admin): Oh wait, shouldn't have said that. That might have been a hint 🤔.

### 2021-03-01 — Spelling/typos + `fefefe = 104 = 101 010` **[ENDGAME]**

Same day: confirmation that the puzzle's spelling errors are merely typos and not meaningful, plus a community member's claim tying **`fefefe`** to the number **104** and the bit pattern **`101 010`**.

![Spelling and fefefe hint, Telegram 2021-03-01](assets/walkthrough/hints/2021-03-01-spelling-hint.png)

> *(partially obscured banner reads "RED FO… FOUR")*
> **[user]:** someone from england or america is here? this is old talk, now is FORTY but hundred FOUR = 104 is the fefefe square fefefe is 101 010
> **[user]:** if you know how the array is indexed ofc
> **Jrk Bgrt** (admin) → *Janusz Baran ("someone from england or america is here? this is old talk, now…")*: Ancient spelling 😄. One of the many many typos.

### 2021-03-05 — "Infrared"

A one-word thematic clue, dropped without elaboration — part of the recurring colour thread (later: purple pill, purple carrots).

> **Jrk Bgrt** (admin): Infrared

### 2021-03-14 — "Breaking salphation should give the feeling of the phase's name"

Jrk gives a long, reflective message confirming SalPhaseIon is effectively the last phase and that breaking it should evoke the feeling of the phase's name ("salphation" / salvation).

![Salphation hint, Telegram 2021-03-14](assets/walkthrough/hints/2021-03-14.png)

> **Jrk Bgrt** (admin) → *Zil ("I always wonder how when you tell us that someone (or a team) has …")*:
> I don't check the website logs. There aren't any tracking scripts either. People somehow now how to reach me on telegram and PM me, that's how I know :-). Although I can't prove it, we don't monitor the puzzlers progress in any way. I just read the chat and when I notice the address is empty I'll know how they did it. After the first stage was cracked within no-time I was afraid the entire puzzle would have been solved not too long after that. When people progress in salphation it might be cracked pretty soon. Breaking salphation, should be giving the feeling of the phase's name. Won't be easy but I've noticed how clever most of you are so I assume it will be cracked at some point, probably before next halving.

### 2021-03-27 — The "feeling" of salphation (a psychedelic aside)

Reinforcing that "breaking salphation" is about reaching a particular **altered-perception feeling** matching the phase's name, Jrk joked about how one might get there.

> **Jrk Bgrt** (admin): Maybe combine it with some psilocybe azurescens and mao inhibitors or go all the way with some 5-MeO-DMT.

### 2021-03-31 — "Another door might be found on {1},{4},{21}" **[ENDGAME]**

A concrete index/coordinate clue for locating the recurring **"another door."** The `{1},{4},{21}` set foreshadows the next day's April-Fools `R=18, A=1, B=2` letter-to-number game.

> **Jrk Bgrt** (admin): another door might be found on {1},{4},{21}

### 2021-04-01 — April Fools' Day *(likely NOT a real hint)*

Posted on April 1st; treat with suspicion.

![April Fools hint, Telegram 2021-04-01](assets/walkthrough/hints/2021-04-01-april-fool.png)

> **Jrk Bgrt** (admin):
> R=18
> A=1
> B=2
>
> Could also be 21 or 1812 bit 🙄. Sometimes I'm glad I don't have to solve this puzzle myself.

### 2021-04-16 — SalPhaseIon contents leak to Telegram

A user ("Hii") who claimed to have reached SalPhaseIon posted the full blob "for anyone who wants to verify in the future." This is the canonical SalPhaseIon ciphertext text. Reproduced verbatim:

![SalPhaseIon blob leak, Telegram 2021-04-16](assets/walkthrough/hints/2021-04-16-salph.png)

> **Hii:**
> Nvm ive reched SalPhaseIon!
> This is the correct formatting if anyone wants to verify in the future for the SalPhaseIon part
> You can even try a stab at it !

```
dbbibfbhccbegbihabebeihbeggegebebbge
hhebhhfbabfdhbeffcdbbfcccgbfbeeggecbe
dcibfbffgigbeeeabeabbabbbaabbbaaaababh
bbabaaabbbaababbaababbabbbbaaaabbba
abbabbbabababbabbbabaabbbaaabbabaab
abbbaabbabbbbabaafaedggeedfcbdabhhgg
cadcfeddgfdgbgigaaedggiafaecggegdaih
ehahbahigceifgbfgefgaifabifagaegeacgbb
eagfggeeggafbacgfcdbeiffaafcidahgdeefg
hhcggaegdebhhegeghcegadfbdiagefcicggi
fdcgaaggfbigaicfbhecaecbceiaicebgbgiec
deggfgegaedggfiiciiiffhhggcgfgcdggefcb
eeigefibgibgggbhhfbcgifdehedfdagicdbhic
gaiedaehahghcihdghfhbiicecbiichihiiigi
ddgehhdfdchcbafgfbhaheagegecafehgcfg
gggcagfhhghbaihidiehhfdeggdgcihggggh
adahigigbgecgedfcdggaccdehiicigfbffhgg
aeidbbeibbeiifdgfdhieeeieeecifdgdahdigg
fhegfiaffiggbcbcehceabfbedbiibfbfdedee
hgigfaaiggagbeiichiedifbehgbccahhbiibib
bibdcbahaidhfahiihiczagdafaoaheiecggch
gicbbhcgbehcfcoabicfdhhcdbbcagbdaiobb
gbeadeddezcfobfdhgdobdgooiigdocdaoofi
dhzshabefourfirsthintisyourlastcommand
U2FsdGVkX186tYU0hVJBXXUnBUO7C0+X4
KUWnWkCvoZSxbRD3wNsGWVHefvdrd9zab
baabababbbaabbabbbaababbbaababaabbba
abaQvX0t8v3jPB4okpspxebRi6sE1BMI5HI8
Rku+KejUqTvdWOX6nQjSpepXwGuN/jJsha
befanstoo
```

*(The plaintext giveaways embedded in the blob — `…shabefourfirsthintisyourlastcommand` ("…sha be four; first hint is your last command") and the trailing Base64 — are the SalPhaseIon entry material.)*

### 2021-05-06 — Official instruction: how to enter SalPhaseIon

A (since-deleted) account posted the exact instruction. It reveals that you take **all the text on the initial puzzle image — including the Bitcoin address — and SHA-256 it** to get the URL for SalPhaseIon.

![SalPhaseIon SHA-256 instruction, Telegram 2021-05-06](assets/walkthrough/hints/2021-05-06-salph-instructions.png)

> **Deleted Account:**
> SHA-256(GSMGIO5BTCPUZZLECHALLENGE1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe)

```python
>>> import hashlib
>>> h = hashlib.sha256()
>>> h.update('GSMGIO5BTCPUZZLECHALLENGE1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe'.encode())
>>> h.hexdigest()
'89727c598b9cd1cf8873f27cb7057f050645ddb6a7a157a110239ac0152f6a32'
```

So the SalPhaseIon URL is:
[https://gsmg.io/89727c598b9cd1cf8873f27cb7057f050645ddb6a7a157a110239ac0152f6a32](https://gsmg.io/89727c598b9cd1cf8873f27cb7057f050645ddb6a7a157a110239ac0152f6a32)

### 2021-08-11 — "The solver will find a way to 'decrypt' it" **[ENDGAME]**

Confirms the final address is **reached by solving** (not a pre-known address), and that the last step involves a **"decrypt."**

> **Jrk Bgrt** (admin): The one to be found by solving the puzzle yes … And the solver will find a way to 'decrypt' it.

### 2021-12-02 — Official Hint: "There is Another DOOR"

![Another door hint, Telegram 2021-12-02](assets/walkthrough/hints/2021-12-02-another-door-hint.png)

> **Jrk Bgrt** (admin) → *Deleted Account ("give a hint, pls, with the first day of winter 2021-2022 :) omikron colla…")*:
> There is
> Another
> D
> O
> O
> R

### 2021-12-25/26 — Official Christmas Hint: primes + "zeroed out" **[ENDGAME]**

One of the most load-bearing endgame hints. Jrk reconfirms the "another door" idea, confirms **prime numbers** are definitely required to proceed, and — crucially — states that some characters need to be **"zeroed out"**.

> **Note on date:** the README's index lists this as "2021-12-26"; the asset filename is `2021-12-25-hint.png`. Same message, minor date discrepancy noted.

![Christmas zeroed-out hint, Telegram 2021-12-25/26](assets/walkthrough/hints/2021-12-25-hint.png)

> **Jrk Bgrt** (admin):
> The previous "there is another door hint" is still a thing. We're not sure if anyone has found another door so far, and we can't check that… We've seen prime numbers being mentioned; well, that is definitely an aspect which is required to proceed. Furthermore, along the way, some characters need to be 'zeroed out'.. Best of luck and happy holidays! 🙌

### 2021-12-31 — "Neo's passport"

A New Year's joke that doubles as a Matrix nod — the first of several Neo/Matrix references (see the 2023-12-26 "purple pill").

> **Jrk Bgrt** (admin): The only date I give away is the expiry date of neo's passport.

### 2022-12-10 — *Cosmic Duality* book photo

A photo of a book titled **Cosmic Duality** — the namesake of the final, still-unsolved stage.

![Cosmic Duality book photo, Telegram 2022-12-10](assets/walkthrough/hints/2022-12-10-cosmic.png)

The book cover itself:

![Cosmic Duality book cover](assets/walkthrough/hints/cosmic-duality-book.png)

### 2023-01-09 — "Prime number is very important" **[ENDGAME]**

![Prime number importance hint, Telegram 2023-01-09](assets/walkthrough/hints/2023-01-09-prime-number.png)

> **Jrk Bgrt** (admin):
> At least prime number is very important to get any further.

### 2023-01-12 — Semi-official: "Theory of everything is a valid path" **[ENDGAME]**

A pivotal hint: focusing on the **theory of everything** is a legitimate route to the private key.

![Theory of everything hint, Telegram 2023-01-12](assets/walkthrough/hints/2023-01-12-theory-of-everything.png)

> **Jrk Bgrt** (admin):
> Focussing on the theory of everything is also still a valid path to reaching the private key.

### 2023-01-12 (more) — "Higher than sqrt(-1)" / "an imaginary puzzle would" **[ENDGAME]**

The same exchange that produced "theory of everything is a valid path" also carried an explicit **imaginary-number** hint, and confirmation that solvers were close — Jrk had checked a community GitHub.

> **Jrk Bgrt** (admin): I checked a certain GitHub yesterday … You guys are really getting close.
> **Jrk Bgrt** (admin): At least higher than sqrt(-1).
> **Jrk Bgrt** (admin): An imaginary puzzle would. … the remaining 2.5 btc is well deserved… Or 5, who knows.

### 2023-01-25 — "42" **[ENDGAME]**

A single message reinforcing the **theory-of-everything / answer-to-everything** thread.

> **Jrk Bgrt** (admin): 42

### 2023-02-23 — Official Hint: binary string

A long binary string was posted. Each group is 8 bits; note that these bytes are written **LSB-first / reversed** within each byte (the trailing `…110` pattern), so a straight MSB decode does not work without reversing. The full ciphertext as posted:

![Binary string hint, Telegram 2023-02-23](assets/walkthrough/hints/2023-02-23.png)

```
00100110 10100110 11001110 10010110 10110110
11110110 01001110 00001110 10011110 10000110
11101110 10000110 10100110 01101110 10010110
11100110 10100110 10101110 01001110 00101110
10000110 11001110 10010110 00001110 10100110
01000110 11001110 00101110 11001110 10000110
00110110 10011110 01001110 10100110 01101110
00101110 10010110 11100110 01110110 10010110
10100110 10100110 11001110 00101110 11110110
01100110 10100110 01001110 10101110 11110110
10011110 00101110 10101110 01000110 11001110
10100110 10011110 10100110 01001110 10101110
11110110 10011110 01100110 11110110 00101110
01010110 11110110 10100110 01100110 01110110
10010110 10100110 00101110 10010110 00100110
01001110 11110110 11101110 11001110 11001110
10000110 00001110 10010110 00010110 00101110
10011110 10000110 11101110 10000110 10100110
01101110 10010110 11100110 00010110 01110110
11110110 11101110 10100110 11101110 11100110
01110110 10000110 10011110 01110110 10010110
10011110 10100110 11000110 10010110 11110110
00101110 11001110 10010110 00010110 11000110
01001110 10000110 10100110 01001110 11110110
01100110 10100110 01000110 11001110 00100110
00110110 11110110 11101110 00101110 11001110
10000110 00111110 10100110 11001110 00011110
10010110 01001110 00101110 10000110 10110110
11001110 10100110 10110110 10010110 01001110
00010110 10100110 00101110 01000110 11101110
11110110 00110110 00110110 10100110 10011110
```

Decoded (after reversing each byte), it reads:

```
yellow blue primes matrix sumlist last words before archichoice yinyang 
we wont give away thepassword its in front of  your eyes but youre 
not seeing it very last step is a true give away promised
```

### 2023-08-03 — Official Hint: "Are you really looking for just the btc…?"

In response to a plea to "shine us some light," Jrk gives two cryptic lines.

![Looking for just the btc hint, Telegram 2023-08-03 (1/2)](assets/walkthrough/hints/2023-08-03-1.png)

> **Jrk Bgrt** (admin) → *Zil ("@SoWut please shine us some 'light'")*:
> Ok ok ok ok. I can't hold this one any longer.
> **Jrk Bgrt** (admin): Are you really looking for just the btc…?

![Hardest part is done, Telegram 2023-08-03 (2/2)](assets/walkthrough/hints/2023-08-03-2.png)

> **Jrk Bgrt** (admin) → *Sid2408 ("But you can confirm if there is indeed a 3rd door that is yet to be foun…")*:
> I saw that you guys got really really far already.
> **Jrk Bgrt** (admin): Actually, the hardest part is done.

> **Community interpretation:** the recurring "…" in the puzzles may be a stand-in for the word **"key"**, so the sentence reads "Are you really looking for just the **btc key**…?" — i.e. *look for the key*.

### 2023-08-04 — "Globally supporting my generation" **[ENDGAME]**

A phrase hint posted the day after the "just the btc?" reveal — widely read as an acrostic for **G S M G**.

> **Jrk Bgrt** (admin): "Globally supporting my generation"

### 2023-08-06 — Official Hint: "The puzzle talks for me" + "ying yang" **[ENDGAME]**

A four-part exchange. Jrk gets uncharacteristically emotional ("it was nice knowing you all"), warns puzzlers to be careful, and — most importantly — gives what he calls "probably the last hint": once you reach a **"ying yang"** (yinyang), you'll solve it the same day.

![The puzzle talks for me, Telegram 2023-08-06 (1/4)](assets/walkthrough/hints/2023-08-06-1.png)

> **Jrk Bgrt** (admin): This may sound a little dramatic but if I suddenly can't answer you guys anymore, it was nice knowing you all ❤️.
> **Jrk Bgrt** (admin): Oh, and be careful of what you get yourselves into. 🫢
> **E:** ???
> **Jrk Bgrt** (admin): I'll not explain why.
> **Jrk Bgrt** (admin): The puzzle talks for me.
> **E:** ???
> **Jrk Bgrt** (admin): And don't worry, I'll just be here in the meanwhile 😘

![What Jrk wishes, Telegram 2023-08-06 (2/4)](assets/walkthrough/hints/2023-08-06-2.png)

> **Jrk Bgrt** (admin) → *Sid2408 ("Do you wish for puzzle to get solved or you would want it to stay as it…")*:
> I wish only for that the puzzle provided some exciting pieces of information. That others have learned something new and that for some it is simply entertaining. I hope that the person who connects the last pieces for the 'main price' will thus get its hands on the private key and hold or spend it wisely, but mostly enjoy it. And lastly, I hope to witness the day that the last scene of mr. Robot becomes a reality.

![Ying yang hint, Telegram 2023-08-06 (3/4)](assets/walkthrough/hints/2023-08-06-3.png)

> **Jrk Bgrt** (admin):
> Probably the last hint:
>
> Once you hit a "ying yang", you'll be able to solve it the same day.

![Salvation part exchange, Telegram 2023-08-06 (4/4)](assets/walkthrough/hints/2023-08-06-4.png)

> **Jrk Bgrt** (admin) → *Zil ("unless Jrk thinks we already know something, which we do not")*: Something was solved rather… remarkable.
> **RdfBbx** → *Jrk Bgrt ("Something was solved rather… remarkable.")*: Has anyone passed the salvation part?
> **Jrk Bgrt** (admin): Partly.
> **ArchOptic:** Don't give away too much. Especially if someone is close!
> **Jrk Bgrt** (admin): I won't!
> **Jrk Bgrt** (admin): Ok, although I somehow feel the need to have my eyes at this chat all of a sudden it's time for me to shut up again and see my little ones play in an obstacle parc here on France. Ciao!

### 2023-08-06 (more) — Endgame mechanics: the private key, the no-halving scenario, internet-to-claim **[ENDGAME]**

The same day as the "ying yang" hint, Jrk spelled out several endgame mechanics: whoever connects the last pieces gets the **private key**; his friends and family could together access his data (in which case "don't expect a halving"); he considered but rejected a **24-hour killswitch**; solvers already have **all the information needed**; and the **internet is required only to CLAIM** the prize, not to solve it.

> **Jrk Bgrt** (admin): the person who connects the last pieces … will thus get its hands on the private key …
> **Jrk Bgrt** (admin): my friends and family can get to all my data if they'd work together. In that scenario, don't expect a halving …
> **Jrk Bgrt** (admin): I thought of a 24h Killswitch, but nah. … you'll need the internet to claim the prize.

### 2023-11-24 — "Is internet still required to solve it?" → "Nope" **[ENDGAME]**

Resolves the long-running question: with the available knowledge, **solving needs no internet** (only claiming does).

> **[user]:** Given the available knowledge, is internet still required to solve it?
> **Jrk Bgrt** (admin): Nope

### 2023-12-26 — "The purple pill"

A Matrix red+blue → **purple** variant, tying into the recurring colour theme (infrared, yellow/blue, purple/orange).

> **Jrk Bgrt** (admin): Have you tried the purple pill already?

### 2024-01-26 — "Regular Bitcoin Private key" **[ENDGAME]**

Pins down the **output format** of the whole puzzle: a standard Bitcoin private key.

> **Jrk Bgrt** (admin): Regular Bitcoin Private key

### 2024-03-26 — "No more puzzle questions"

A policy change: Jrk stops answering puzzle questions; any future hint will only be **broadcast in the channel**.

> **Jrk Bgrt** (admin): I decided not to answer any puzzle questions anymore. If there will be a hint (ever). It will be here.

### 2024-04-10 — Halving countdown: "1357 blocks to go"

![1357 blocks to go, Telegram 2024-04-10](assets/walkthrough/hints/2024-04-10.png)

> **Jrk Bgrt** (admin):
> 1357 blocks to go 🔥

### 2024-04-19 — Second halving + "hold on to Bitcoin"

The second Bitcoin halving. The prize was halved again (now ~**1.25 BTC**). Jrk frames the puzzle's "obvious" reward as the lesson to **hold Bitcoin**, and signs off "see you in 4 years."

![Happy halving, Telegram 2024-04-19 (1/2)](assets/walkthrough/hints/2024-04-19-1.png)

> **Jrk Bgrt** (admin): Happy halving everyone! 🎉
> **Jrk Bgrt** (admin): For those that still haven't solved the puzzle. There are few prizes to win besides the banter in this chat. A private key, some 'obscure' intel, or what I hope most of you have discovered by now, the most obvious reason to make sure you hold on to Bitcoin 😉.

![See you in 4 years, Telegram 2024-04-19 (2/2)](assets/walkthrough/hints/2024-04-19-2.png)

> **gnomad:** you were right
> **Jrk Bgrt** (admin): 16$ fee. Damn.
> **Jrk Bgrt** (admin): Well, anyway, see you in 4 years! Good luck you all.
> **[user]:** Me? No. Don't know that guy. ❤️

### 2024-11-29 — "One microstep" / ASCII 127 / the last digit of pi **[ENDGAME]**

Three concrete late-stage hints: solvers are **one microstep** from a same-day solve; Jrk says he'd personally go for **ASCII 127** (the `DEL` control character — which dovetails with the "zeroed out" / character-deletion thread); and you **only need the last digit of pi** to progress.

> **Jrk Bgrt** (admin): If you guys got 1 microstep further, the puzzle will likely be solved the same day.
> **Jrk Bgrt** (admin): I think I'll be going for ASCII 127 myself. But not overly dramatic.
> **Jrk Bgrt** (admin): You only need the last number of pi and it might get you somewhere.

### 2025-04-28 — "Did anyone find yingyang? I don't think so" **[ENDGAME]**

A status update on the key milestone: as of 2025, **nobody has reached "yingyang."** Once someone does, Jrk reiterates it is **~2 hours, max** to a full solve.

> **Jrk Bgrt** (admin): Did anyone found yingyang? I don't think so … when yingyang is reached, 2 hours max. It's the next phase, but I await the day someone finally gets there.

### 2025-09-15 — Purple carrots (a colour-theme aside)

Trivia that fits the colour thread (purple → orange; the Dutch House of Orange).

> **Jrk Bgrt** (admin): Carrots were originally purple, until the Dutch turned them orange in the 1600s to kiss up to their royal family.

### 2026-01-01 — New Year's Hint ("a tiny hint")

Five messages posted exactly one minute apart (`8:15`–`8:19 PM`), the last carrying a long binary block.

![New Year binary hint, Telegram 2026-01-01](assets/walkthrough/hints/2026-01-01-new-year-hint.png)

The binary (8-bit groups, standard MSB ASCII this time), copyable:

```
01001000 01100001 01110000 01110000 01111001 00100000 01101110 01100101 01110111 00100000 01111001 01100101 01100001 01110010 00100001 00100000 01001101 01100001 01101011 01100101 00100000 01110100 01101000 01100101 00100000 01100010 01100101 01110011 01110100 00100000 01101111 01100110 00100000 01100101 01110110 01100101 01110010 01111001 01110100 01101000 01101001 01101110 01100111 00101110 00100000 01001111 01101000 00101100 00100000 01100001 01101110 01100100 00100000 01101000 01100101 01110010 01100101 00100111 01110011 00100000 01100001 00100000 00100010 01110100 01101001 01101110 01111001 00100000 01101000 01101001 01101110 01110100 00100010 00100000 00111100 00110011 00101110
```

Decoded:

> Happy new year! Make the best of everything. Oh, and here's a "tiny hint" <3.

**Observations:**
- Each of the five messages is purposely **1 minute apart** (8:15–8:19 PM).
- The hint is again delivered as binary text.
- The "tiny hint" is deliberately ambiguous — it is unclear whether the timing, the wording, the `<3`, or something else is the actual hint.

### 2026-03-03 — "No hints, only free will" + Jacque Fresco **[ENDGAME]**

A cluster of 2026 messages: a determinism musing ("no hints, only free will"), a nod to **Jacque** (Fresco — the Venus Project / resource-based economy, echoing Phase 3's "Free Will" theme), a "Bingo" confirming a community guess, the restated mechanic that **reaching the next phase means the prize is claimed instantly**, and a mention of rewatching "episode 3.5."

> **Jrk Bgrt** (admin): No hints, only free will. … Jacque was quite an inspiring lad I'd say. … Bingo … If any of you reaches the next phase, the price is taken in no-time. … I'm going to rewatch episode 3.5 with the better half.

### 2026-05-28 — "The puzzle is still valid!"

The most recent confirmation that the puzzle remains **unsolved and active**.

> **Jrk Bgrt** (admin): Ah, ofcourse. The puzzle is still valid!

---

### Endgame hint synthesis (what's still OPEN)

Pulling together the **[ENDGAME]** hints, the community's working model of the unsolved Cosmic Duality / final-key stage rests on these confirmed creator statements:

1. **Primes 2, 3, 5, 7** are required ("the prime part," 2021-03-01; "prime number is very important," 2023-01-09; "definitely required to proceed," 2021-12-25).
2. **Some characters must be "zeroed out"** (2021-12-25), associated with **`fefefe` = 104 = `101 010`** (2021-03-01).
3. The **"theory of everything"** is a valid path to the private key (2023-01-12).
4. There is **"another door"** that, as of the creator's last checks, may never have been publicly found (2020-05-11, 2020-08-02, 2021-12-02).
5. Reaching a **"ying yang" (yinyang)** is the breakthrough — solvable the same day afterward (2023-08-06). This dovetails with the 2023-02-23 decode: `…yinyang … the password is in front of your eyes … very last step is a true give away`.
6. The final output is a **regular Bitcoin private key** (2024-01-26), reached by **solving and then "decrypting"** (2021-08-11). The **internet is needed only to claim it, not to solve** (2023-08-06, 2023-11-24) — everything required to solve is already in hand.
7. The **"theory of everything"** thread is reinforced by **"42"** (2023-01-25) and an explicit **imaginary-number** nudge — "higher than `sqrt(-1)`," "an imaginary puzzle would" (2023-01-12).
8. Late, concrete nudges: you are **"one microstep"** away (2024-11-29); try **ASCII 127** (`DEL`, dovetailing with "zeroed out") and **the last digit of pi** (2024-11-29); the **"another door"** sits at **{1},{4},{21}** (2021-03-31). A recurring **colour** thread runs through it all (yellow/blue → infrared → purple pill → purple carrots).
9. As of 2025, **nobody has reached "yingyang"** — the gating breakthrough — and reaching it means **~2 hours to a full solve** (2025-04-28). The puzzle is confirmed **still unsolved and valid** as recently as **2026-05-28**.

**Status: OPEN.** No public, verified solution to the endgame exists. The puzzle is reproducibly solved through Phase 3.2 only; everything past SalPhaseIon / Cosmic Duality remains unsolved, and the prize address is **unclaimed** (the spent outputs are the creators' scheduled halving moves, not a solve).

</details>

