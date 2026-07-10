// phases.js — the game's data spine.
//
// One entry per "door". Each phase carries: narrative, from-zero concepts, a
// complete step-by-step solution, a live interactive door, and its canonical
// reference values. Views render purely from this data, so adding/curating a
// phase never touches UI code.
//
// door.type:
//   'answer'  → local string match (no crypto): door.accept = [normalized strings]
//   'decrypt' → live AES: door.blob + door.prehash + door.answer (the canonical input)
//   'open'    → unsolved frontier: a recipe tester that logs verified attempts
//
// status: 'solved' | 'frontier' (partially open) | 'open' (fully unsolved)

export const PHASES = [
  {
    id: 'phase-0', num: '00', codename: 'Genesis', title: 'The Seed Is Planted',
    tagline: 'A picture that hides a web address — your way in.',
    status: 'solved', difficulty: 1, xp: 60,
    concepts: ['encoding', 'image-stego', 'matrix'],
    summary: `The puzzle begins with a single image: a 14×14 grid of black and white squares with a few cells tinted blue and yellow. Read the right way, the grid spells out a web address — the first secret door. No cryptography yet, just careful looking.`,
    story: `“The seed is planted.” The very first clue is an image posted by the GSMG team. It looks like abstract art, but every pixel is deliberate. Puzzles like this are about noticing that something *ordinary* is actually *a message in disguise* — the core mindset for everything that follows.`,
    steps: [
      { h: 'Treat each tile as a bit', body: `It is <b>not</b> a scannable QR code — it’s a hand-decoded grid. Each of the 196 tiles is one <b>bit</b>: black/blue = <span class="mono">1</span>, yellow/white = <span class="mono">0</span>. Black/white is the most basic code there is — on/off, ink/no-ink.` },
      { h: 'Read it in a counter-clockwise spiral', body: `Not left-to-right like a book. Start at the upper-left and spiral <b>anti-clockwise</b>: down the left column, right along the bottom, up the right column, left along the top, then inward ring by ring (like peeling an onion).` },
      { h: 'Turn the bits into letters', body: `Chop the 196-bit string into <b>8-bit bytes</b> and convert each to its <b>ASCII</b> character. Out comes <span class="mono">gsmg.io/theseedisplanted</span> (24 characters + a little zero-padding). Visiting it opens Phase 1.` },
      { h: 'A separate clue hides in the colours', body: `Counting the <b>1-cells per row and per column</b> gives two number strings (<span class="mono">610876654997879</span> and <span class="mono">8108108736759668</span>). These are <b>not</b> needed for the URL — they’re a separate artifact called <span class="mono">matrixsumlist</span> that you only need at the very endgame. Don’t let them distract you here.` },
    ],
    lab: 'matrix',
    play: { type: 'spiral' },
    door: { type: 'answer', answer: 'gsmg.io/theseedisplanted',
            accept: ['gsmgiotheseedisplanted', 'theseedisplanted'],
            prompt: 'What web address does the grid decode to?' },
    reference: [
      { label: 'Decoded URL', value: 'gsmg.io/theseedisplanted' },
      { label: 'Row-sums → matrixsumlist (later use)', value: '610876654997879' },
      { label: 'Col-sums → matrixsumlist (later use)', value: '8108108736759668' },
    ],
    trivia: [`The colours foreshadow “yellowblueprimes”, a word you won’t need until the very end — and the sums become the token “matrixsumlist”.`],
    verified: '✅ Independently re-implemented: the counter-clockwise spiral of bits reproduces the URL exactly.',
  },

  {
    id: 'phase-1', num: '01', codename: 'The Warning', title: 'A Flower Through Concrete',
    tagline: 'A passphrase hidden in a poetic line.',
    status: 'solved', difficulty: 1, xp: 80,
    concepts: ['passphrase', 'wordplay'],
    summary: `The landing page is a warning and a riddle. The answer is a single long passphrase — no spaces — that becomes the link to the next door. It introduces the puzzle’s signature move: turning a sentence into one continuous lowercase string.`,
    story: `The page sets the tone: this is a test of patience and free will, not luck. The imagery of a flower blossoming “through what seems to be a concrete surface” is both the theme and, literally, the answer.`,
    steps: [
      { h: 'Find the hidden form', body: `The <span class="mono">theseedisplanted</span> page has a password box you can only see in the browser’s dev tools (press F12). Submitting the right phrase posts to <span class="mono">gsmg.io/phase1verification</span>.` },
      { h: 'Identify the song', body: `Scrambled images on the page spell <b>WAR+NING</b> and <b>LO+GIC</b> → the song “<b>The Warning</b>” by Logic. The line right after the lyric “Phase two” is: “The flower blossoms through what seems to be a concrete surface…”.` },
      { h: 'Collapse it to a passphrase', body: `Strip spaces and punctuation, lowercase it: <span class="mono break">theflowerblossomsthroughwhatseemstobeaconcretesurface</span>. This continuous-string style is how every GSMG passphrase is written.` },
      { h: 'It points onward', body: `Submitting it redirects to a long URL built from two Merovingian quotes (The Matrix Reloaded) and on to Phase 2 — the Mr. Robot stage. This stage reveals no key; it’s a navigation gate.` },
    ],
    play: { type: 'assemble', mode: 'phrase', target: 'theflowerblossomsthroughwhatseemstobeaconcretesurface',
            intro: 'Re-assemble the hidden lyric, word by word. Dragged into order and collapsed to one lowercase string, the words ARE the passphrase.',
            tokens: [{ label: 'the' }, { label: 'flower' }, { label: 'blossoms' }, { label: 'through' }, { label: 'what' }, { label: 'seems' }, { label: 'to' }, { label: 'be' }, { label: 'a' }, { label: 'concrete' }, { label: 'surface' }],
            decoys: [{ label: 'garden' }, { label: 'broken' }, { label: 'wall' }] },
    door: { type: 'answer', answer: 'theflowerblossomsthroughwhatseemstobeaconcretesurface',
            accept: ['theflowerblossomsthroughwhatseemstobeaconcretesurface'],
            prompt: 'Type the Phase-1 passphrase (one lowercase string, no spaces).' },
    reference: [
      { label: 'Passphrase', value: 'theflowerblossomsthroughwhatseemstobeaconcretesurface' },
      { label: 'Redirect URL', value: 'gsmg.io/choiceisanillusioncreatedbetweenthosewithpowerandthosewithoutaveryspecialdessertiwroteitmyself' },
    ],
    trivia: [`“Choice is an illusion created between those with power and those without” is a line from the Merovingian in The Matrix Reloaded.`],
    verified: '✅ Passphrase confirmed verbatim in both community walkthroughs; the redirect quote is sourced to Wikiquote.',
  },

  {
    id: 'phase-2', num: '02', codename: 'Mr. Robot', title: 'Seven Keys, One Password',
    tagline: 'Decrypt a real page by hashing the right word.',
    status: 'solved', difficulty: 2, xp: 140,
    concepts: ['hash', 'aes', 'openssl', 'chaining'],
    summary: `Here the puzzle gets technical. Phase 2’s page is genuinely AES-encrypted. Hashing the keyword “causality” with SHA-256 produces the exact key that decrypts it — which you can watch happen live below. Inside, seven separate clues (Mr. Robot, monetary history, Bitcoin’s genesis block, a chess position) combine into one long password that unlocks Phase 3.`,
    story: `The theme turns to control of money: Safenet HSMs, Executive Order 11110, and the message Satoshi buried in Bitcoin’s very first block. The seven answers are concatenated into a single password — and its SHA-256 hash is the door to the next room.`,
    steps: [
      { h: 'The page is encrypted with a hashed word', body: `The Phase-2 blob was encrypted by OpenSSL using <span class="mono">sha256("causality")</span> as the passphrase. So you don’t guess the 64-character key — you produce it by hashing one word. Try it in the door below.` },
      { h: 'Collect the seven clue-answers', body: `① causality · ② Safenet (the HSM brand) · ③ Luna (the HSM model) · ④ HSM · ⑤ 11110 (JFK’s Executive Order 11110) · ⑥ the Bitcoin genesis coinbase message in reversed hex · ⑦ a chess position written as a FEN string.` },
      { h: 'Concatenate into the full password', body: `Glue all seven together exactly (case-sensitive, including the <span class="mono">0x…</span> hex and the FEN with its spaces). That single string is the Phase-2 password.` },
      { h: 'Hash it to open Phase 3', body: `<span class="mono">sha256(full password)</span> = <span class="mono break">1a57c572caf3cf722e41f5f9cf99ffacff06728a43032dd44c481c77d2ec30d5</span>, the key that decrypts Phase 3. Each phase’s answer, hashed, is the next phase’s key — that’s the “chain”.` },
    ],
    play: { type: 'assemble', mode: 'concat', targetField: 'fullAnswer', reveal: 'decrypt', revealBlob: 'phase3',
            intro: 'Order the seven clue-answers to build the Phase-2 password. Get it right and you watch the key open the NEXT room (Phase 3) for real.',
            tokens: [
              { label: '① causality', value: 'causality' },
              { label: '② Safenet', value: 'Safenet' },
              { label: '③ Luna', value: 'Luna' },
              { label: '④ HSM', value: 'HSM' },
              { label: '⑤ 11110', value: '11110' },
              { label: '⑥ genesis-hex', value: '0x736B6E616220726F662074756F6C69616220646E6F63657320666F206B6E697262206E6F20726F6C6C65636E61684320393030322F6E614A2F33302073656D695420656854' },
              { label: '⑦ chess-FEN', value: 'B5KR/1r5B/2R5/2b1p1p1/2P1k1P1/1p2P2p/1P2P2P/3N1N2 b - - 0 1' },
            ],
            decoys: [{ label: 'JFK', value: 'JFK' }, { label: 'satoshi', value: 'satoshi' }] },
    door: { type: 'decrypt', blob: 'phase2', salt: '06286612d43ed7ed', prehash: true,
            answer: 'causality',
            prompt: 'Type the keyword that, hashed, opens this page (hint: ①).' },
    reference: [
      { label: '① causality', value: 'causality' },
      { label: '② Safenet', value: 'Safenet' },
      { label: '③ Luna', value: 'Luna' },
      { label: '④ HSM', value: 'HSM' },
      { label: '⑤ EO 11110', value: '11110' },
      { label: '⑥ genesis coinbase (hex)', value: '0x736B6E616220726F662074756F6C69616220646E6F63657320666F206B6E697262206E6F20726F6C6C65636E61684320393030322F6E614A2F33302073656D695420656854' },
      { label: '⑦ chess FEN', value: 'B5KR/1r5B/2R5/2b1p1p1/2P1k1P1/1p2P2p/1P2P2P/3N1N2 b - - 0 1' },
      { label: 'Page key = sha256(causality)', value: 'eb3efb5151e6255994711fe8f2264427ceeebf88109e1d7fad5b0a8b6d07e5bf' },
      { label: 'Next-phase key = sha256(full pw)', value: '1a57c572caf3cf722e41f5f9cf99ffacff06728a43032dd44c481c77d2ec30d5' },
      { label: 'AES salt', value: '06286612d43ed7ed' },
    ],
    fullAnswer: 'causalitySafenetLunaHSM111100x736B6E616220726F662074756F6C69616220646E6F63657320666F206B6E697262206E6F20726F6C6C65636E61684320393030322F6E614A2F33302073656D695420656854B5KR/1r5B/2R5/2b1p1p1/2P1k1P1/1p2P2p/1P2P2P/3N1N2 b - - 0 1',
    trivia: [
      `Clue ⑥ decodes to Satoshi’s headline: “The Times 03/Jan/2009 Chancellor on brink of second bailout for banks.”`,
      `⚠️ Two load-bearing details: keep the literal <span class="mono">0x</span> prefix and the <b>full</b> FEN — only that exact string hashes to the real Phase-3 key (a popular write-up truncates it at “…B5KR” and hashes wrong).`,
      `⚠️ The <span class="mono">11110</span> value is confirmed by the hash, but its meaning (JFK’s Executive Order 11110) is a community reading the walkthroughs admit was partly brute-forced.`,
    ],
    verified: '✅ sha256("causality") and sha256(full 7-part password) both recomputed and chain-decrypt the real blobs.',
  },

  {
    id: 'phase-3', num: '03', codename: 'Free Will', title: 'Three Thinkers',
    tagline: 'Three answers about determinism and design.',
    status: 'solved', difficulty: 3, xp: 180,
    concepts: ['hash', 'aes', 'riddle'],
    summary: `Phase 3 is opened by the Phase-2 password (hashed). Inside are three riddles whose answers — a visionary, a phrase, and a physics principle — concatenate into the Phase-3 password, whose hash unlocks Phase 3.2.`,
    story: `The questions probe free will versus determinism: Jacque Fresco’s resource-based future, a plea to “give it just one second”, and Heisenberg’s uncertainty principle — the physics that says the universe itself isn’t fully predetermined.`,
    steps: [
      { h: 'Open the page with Phase 2’s password', body: `Phase 3’s blob is encrypted with <span class="mono">sha256(Phase-2 full password)</span>. In the door below, hit “Reveal answer” to drop in that password and watch Phase 3 decrypt.` },
      { h: 'Solve the three riddles', body: `① <span class="mono">jacquefresco</span> (founder of The Venus Project) · ② <span class="mono">giveitjustonesecond</span> · ③ <span class="mono">heisenbergsuncertaintyprinciple</span>.` },
      { h: 'Concatenate and hash', body: `<span class="mono break">jacquefrescogiveitjustonesecondheisenbergsuncertaintyprinciple</span> → <span class="mono">sha256</span> → <span class="mono break">250f37726d6862939f723edc4f993fde9d33c6004aab4f2203d9ee489d61ce4c</span>, the key to Phase 3.2.` },
    ],
    play: { type: 'assemble', mode: 'concat', targetField: 'fullAnswer', reveal: 'decrypt', revealBlob: 'phase32',
            intro: 'Three thinkers, three answers. Order them to build the Phase-3 password — solve it and the Architect’s room (Phase 3.2) decrypts before your eyes.',
            tokens: [{ label: 'jacquefresco', value: 'jacquefresco' }, { label: 'giveitjustonesecond', value: 'giveitjustonesecond' }, { label: 'heisenbergsuncertaintyprinciple', value: 'heisenbergsuncertaintyprinciple' }],
            decoys: [{ label: 'determinism', value: 'determinism' }, { label: 'freewill', value: 'freewill' }, { label: 'venusproject', value: 'venusproject' }] },
    door: { type: 'decrypt', blob: 'phase3', salt: '9fbc451d13d071f4', prehash: true,
            answer: 'causalitySafenetLunaHSM111100x736B6E616220726F662074756F6C69616220646E6F63657320666F206B6E697262206E6F20726F6C6C65636E61684320393030322F6E614A2F33302073656D695420656854B5KR/1r5B/2R5/2b1p1p1/2P1k1P1/1p2P2p/1P2P2P/3N1N2 b - - 0 1',
            prompt: 'Open Phase 3 with the Phase-2 password (use Reveal answer).' },
    reference: [
      { label: 'Answer 1', value: 'jacquefresco' },
      { label: 'Answer 2', value: 'giveitjustonesecond' },
      { label: 'Answer 3', value: 'heisenbergsuncertaintyprinciple' },
      { label: 'Full password', value: 'jacquefrescogiveitjustonesecondheisenbergsuncertaintyprinciple' },
      { label: 'Next-phase key = sha256(pw)', value: '250f37726d6862939f723edc4f993fde9d33c6004aab4f2203d9ee489d61ce4c' },
      { label: 'AES salt', value: '9fbc451d13d071f4' },
    ],
    fullAnswer: 'jacquefrescogiveitjustonesecondheisenbergsuncertaintyprinciple',
    trivia: [
      `⚠️ Spelling trap: it’s <span class="mono">heisenberg<b>s</b>uncertaintyprinciple</span> — <b>with</b> the internal “s”. The common spelling without it hashes to the wrong value and won’t decrypt Phase 3.2.`,
      `Riddle 2 is a Cheshire-Cat exchange (“How long is forever?”) with “giveit” prepended → giveitjustonesecond.`,
    ],
    verified: '✅ The “s” form recomputes to 250f37… and chain-decrypts Phase 3.2 (the Architect speech).',
  },

  {
    id: 'phase-3-2', num: '3.2', codename: 'The Architect', title: 'The Architect Speaks',
    tagline: 'Two classic ciphers guard a confession.',
    status: 'solved', difficulty: 4, xp: 240,
    concepts: ['beaufort', 'vic-cipher', 'aes'],
    summary: `The hardest solved stage. Phase 3.2’s page hides a message behind two historical ciphers: a Beaufort cipher keyed “THEMATRIXHASYOU”, and a VIC cipher (a Cold-War pencil-and-paper system). Decoded, the Architect admits the prize keys belong to “half and better half” — a couple — who “also need funds to live”.`,
    story: `Styled after The Matrix’s Architect, this stage is a confession wrapped in spy-grade cryptography. The VIC cipher in particular was famously used by a real Soviet agent; here it carries the puzzle’s most human line.`,
    steps: [
      { h: 'Open the page with Phase 3’s password', body: `Phase 3.2’s blob is encrypted with <span class="mono">sha256(Phase-3 password)</span>. Reveal & decrypt below.` },
      { h: 'Undo the Beaufort layer', body: `A Beaufort cipher (a cousin of Vigenère) with the key <span class="mono">THEMATRIXHASYOU</span> peels off the first layer.` },
      { h: 'Undo the VIC layer', body: `A VIC cipher using the straddling-checkerboard alphabet <span class="mono break">FUBCDORA.LETHINGKYMVPS.JQZXW</span> with digits “1 and 4” turns the number string into letters.` },
      { h: 'Read the confession', body: `Out comes: <em>“IN CASE YOU MANAGE TO CRACK THIS THE PRIVATE KEYS BELONG TO HALF AND BETTER HALF AND THEY ALSO NEED FUNDS TO LIVE.”</em> This is the clue that the endgame combines two halves — yin & yang.` },
    ],
    lab: 'cipher',
    play: { type: 'assemble', mode: 'concat', reveal: 'decrypt', keyFromAnswer: true, revealBlob: 'phase32',
            target: 'halfandbetterhalf',
            intro: 'Peel away the Beaufort + VIC layers and the Architect confesses who holds the keys. Assemble the line that defines the whole endgame — then watch the real page decrypt.',
            tokens: [{ label: 'half' }, { label: 'and' }, { label: 'better' }, { label: 'half' }],
            decoys: [{ label: 'whole' }, { label: 'worse' }, { label: 'other' }] },
    door: { type: 'decrypt', blob: 'phase32', salt: 'eefc4c5befc1656a', prehash: true,
            answer: 'jacquefrescogiveitjustonesecondheisenbergsuncertaintyprinciple',
            prompt: 'Open Phase 3.2 with the Phase-3 password (use Reveal answer).' },
    reference: [
      { label: 'Beaufort key', value: 'THEMATRIXHASYOU' },
      { label: 'VIC alphabet', value: 'FUBCDORA.LETHINGKYMVPS.JQZXW' },
      { label: 'VIC digits', value: '1 and 4' },
      { label: 'Decoded message', value: 'IN CASE YOU MANAGE TO CRACK THIS THE PRIVATE KEYS BELONG TO HALF AND BETTER HALF AND THEY ALSO NEED FUNDS TO LIVE' },
      { label: 'AES salt', value: 'eefc4c5befc1656a' },
      { label: 'Trailing blob salt (p32_trailing · UNDECODED)', value: 'b45a5e3d827593ca' },
    ],
    trivia: [
      `“Half and better half” → two complementary halves → the yin/yang motif that defines the final answer.`,
      `A first sub-step decodes raw bytes via IBM EBCDIC code page 1141 (hinted by “one for one, four for one” → the digits 1 and 4).`,
      `⚠️ Sources disagree on the exact VIC checkerboard ordering (FUBCDORA.LETHINGKYMVPS.JQZXW vs a slightly different trailing order). The decoded message is the same; the board notation isn’t universal.`,
    ],
    verified: '✅ Beaufort key and the “half and better half” VIC message confirmed across sources; salt extracted from the file.',
  },

  {
    id: 'salphaseion', num: '04', codename: 'SalPhaseIon', title: 'The Inner Sanctum',
    tagline: 'Partly cracked — two encoded blocks still resist.',
    status: 'frontier', difficulty: 5, xp: 300,
    concepts: ['base-9', 'spectrogram', 'aes', 'open-problem'],
    summary: `Reached via a Decentraland spectrogram clue (“HASHTHETEXT”) and an entry hash, SalPhaseIon is a “soup” of letters split by the letter z. Four chunks are cracked — matrixsumlist, enter, lastwordsbeforearchichoice, thispassword — but two chunks (nicknamed dbbi and faed) refuse to decode. They are hypothesized to spell yellowblueprimes and yinyang, but that is a community guess, not a result.`,
    story: `“SalPhaseIon” = Sal-Phase-Ion, a pun on the word salt. The team scattered the last ingredients here. This is the edge of the map: solid ground, then fog — and a lot of false confidence.`,
    steps: [
      { h: 'Find the entrance (Decentraland → spectrogram)', body: `A box in the GSMG plot in Decentraland (LAND −41,−17) plays <span class="mono">audio_source.wav</span>. Split the stereo, phase-invert one channel, mix to mono, then view it as a <b>spectrogram</b> — the word <span class="mono">HASHTHETEXT</span> appears in the high frequencies. Hashing the opening image’s text <span class="mono break">GSMGIO5BTCPUZZLECHALLENGE1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe</span> (59 chars, no trailing newline) gives <span class="mono break">89727c…152f6a32</span> → the SalPhaseIon URL.` },
      { h: 'Split the soup by “z”', body: `The page is a long string from a tiny alphabet. Split it wherever a <span class="mono">z</span> appears to get separate chunks.` },
      { h: 'Decode the four solved chunks', body: `Some chunks use only a/b → read as 8-bit binary ASCII → <span class="mono">matrixsumlist</span> and <span class="mono">enter</span>. Others use a–i plus o → map a=1…i=9, o=0, read as a big number → hex → ASCII → <span class="mono">lastwordsbeforearchichoice</span> and <span class="mono">thispassword</span>.` },
      { h: 'The two blocks that resist (open problem)', body: `<span class="mono">dbbi</span> is <b>91 symbols</b> long (91 = 7×13), <span class="mono">faed</span> is <b>570 symbols</b> long. ⚠️ “91 in base-9” means <b>91 symbols</b>, not the number 91. The popular guess that they spell <span class="mono">yellowblueprimes</span> and <span class="mono">yinyang</span> is <b>unconfirmed</b> — the dead-end ledger records that “yellowblueprimes” is absent from dbbi in every tested base, and faed’s statistics look near-random. <b>This is genuinely unsolved.</b>` },
      { h: 'Where you come in', body: `Use the door below as a recipe tester: every candidate runs through the real crypto and is logged. This is the live frontier — your verified tries map what’s been ruled out.` },
    ],
    play: { type: 'assemble', mode: 'explore', target: 'matrixsumlistenterlastwordsbeforearchichoicethispassword',
            intro: 'Four chunks of the SalPhaseIon “soup” are already cracked — assemble them in solving order. The decoy tiles are the two blocks that still resist (dbbi, faed): those are the live frontier in the door below.',
            tokens: [{ label: 'matrixsumlist' }, { label: 'enter' }, { label: 'lastwordsbeforearchichoice' }, { label: 'thispassword' }],
            decoys: [{ label: 'yellowblueprimes' }, { label: 'yinyang' }] },
    door: { type: 'open', blob: 'salphaseion', salt: '3ab585348552415d',
            prompt: 'Test a candidate recipe for the inner SalPhaseIon block.' },
    reference: [
      { label: 'Spectrogram answer', value: 'HASHTHETEXT' },
      { label: 'Decentraland coords', value: '-41,-17  ·  audio_source.wav' },
      { label: 'Entry text (59 chars, no newline)', value: 'GSMGIO5BTCPUZZLECHALLENGE1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe' },
      { label: 'Entry hash (= URL)', value: '89727c598b9cd1cf8873f27cb7057f050645ddb6a7a157a110239ac0152f6a32' },
      { label: '✅ Decoded · matrixsumlist', value: 'matrixsumlist' },
      { label: '✅ Decoded · enter', value: 'enter  (a/b binary → ASCII; not a cosmic ingredient)' },
      { label: '✅ Decoded · lastwords…', value: 'lastwordsbeforearchichoice' },
      { label: '✅ Decoded · thispassword', value: 'thispassword  (a–i/o field-decode; not a cosmic ingredient)' },
      { label: '⚠️ Open block · dbbi', value: 'dbbi  (91 symbols)  → guessed: yellowblueprimes (unconfirmed)' },
      { label: '⚠️ Open block · faed', value: 'faed  (570 symbols)  → guessed: yinyang (unconfirmed)' },
      { label: 'Inner blob salt', value: '3ab585348552415d' },
    ],
    trivia: [`⚠️ The dbbi→yellowblueprimes / faed→yinyang mapping is a hypothesis, not a decode — and the repo’s own dead-end ledger contradicts it. Treat it as a lead to test, not a fact.`],
    verified: '⚠️ Four tokens confirmed; the two open blocks and their guessed meanings are unverified.',
  },

  {
    id: 'cosmic', num: '05', codename: 'Cosmic Duality', title: 'The Final Lock',
    tagline: 'Unsolved. Decrypt this and 5 BTC is yours.',
    status: 'open', difficulty: 5, xp: 0,
    concepts: ['aes', 'wif', 'bitcoin', 'open-problem'],
    summary: `The last box. Cosmic Duality is a real AES blob that, when decrypted with the correct recipe, is expected to reveal a Bitcoin private key (a WIF string starting with 5, K, or L) that controls the prize wallet — originally 5 BTC, now ~1.25 BTC after two Bitcoin-style halvings, and never swept by any solver. The believed recipe is sha256(yellowblueprimes · matrixsumlist · lastwordsbeforearchichoice · yinyang) — but that combine-step is a hypothesis, and two ingredients (yellowblueprimes, yinyang) aren’t even confirmed. No one has produced a valid decryption. This is the prize.`,
    story: `A reverse-binary “master hint” from the creators lists the ingredients and ends with taunts: “we won’t give away the password”, “it’s in front of your eyes but you’re not seeing it”, “the very last step is a true giveaway”, “promised”. The duality — yin/yang, blue/yellow, half/better-half — is the whole theme converging on one key.`,
    steps: [
      { h: 'The believed operation', body: `<span class="mono break">privkey = decrypt(Cosmic, sha256(yellowblueprimes·matrixsumlist·lastwordsbeforearchichoice·yinyang))</span>. Two ingredients are confirmed; two are inferred from the dbbi/faed blocks.` },
      { h: 'What a solve looks like', body: `A correct passphrase makes the AES padding validate AND yields readable text — specifically a WIF key beginning with 5/K/L. Anything else fails with invalid padding. The page detects a real unlock automatically.` },
      { h: 'Your move', body: `Test recipes below. Every attempt is run through the real crypto, logged with an exact fingerprint, and (when you submit) re-verified by CI so no two people waste effort on the same idea. The first verified Cosmic unlock wins outright.` },
    ],
    play: { type: 'assemble', mode: 'recipe',
            intro: 'The believed final recipe hashes four ingredients together to unlock Cosmic Duality. Drag them into order and hit Run — it tests the REAL blob and logs your attempt to the shared frontier. (Two ingredients are still unconfirmed, so expect “fail” — for now. The first valid decryption wins 5 BTC.)',
            tokens: [{ label: 'yellowblueprimes' }, { label: 'matrixsumlist' }, { label: 'lastwordsbeforearchichoice' }, { label: 'yinyang' }],
            decoys: [{ label: 'enter' }, { label: 'thispassword' }, { label: 'promised' }] },
    door: { type: 'open', blob: 'cosmic', salt: '2d3f6fe06dc950e6',
            prompt: 'Test a candidate recipe for the Cosmic Duality blob.' },
    reference: [
      { label: 'Master hint (reverse-binary, 2023-02-23)', value: 'yellowblueprimes · matrixsumlist · lastwordsbeforearchichoice · yinyang · wewontgiveawaythepassword · itsinfrontofyoureyesbutyourenotseeingit · verylaststepisatruegiveaway · promised' },
      { label: '⚠️ Candidate recipe (unproven)', value: 'privkey = decrypt(Cosmic, sha256(yellowblueprimes·matrixsumlist·lastwordsbeforearchichoice·yinyang))' },
      { label: 'Cosmic Duality salt', value: '2d3f6fe06dc950e6' },
      { label: 'Prize address (unclaimed)', value: '1GSMG1JC9wtdSwfwApgj2xcmJPAwx7prBe' },
      { label: 'Prize balance now', value: '~1.25634510 BTC (5 BTC, halved twice)' },
    ],
    trivia: [
      `⚠️ A competing theory (GitHub issue #56) proposes an XOR of seven token-hashes instead — which don’t even include yellowblueprimes/yinyang. Neither recipe has ever opened the blob.`,
      `No solver has ever swept the prize wallet — that, not any forum post, is the only proof the puzzle is open.`,
    ],
    verified: '✅ Salt extracted from the file; the blob is real. ⚠️ The recipe and ingredients are unproven hypotheses.',
  },
];

export const PHASE_IDS = PHASES.map(p => p.id);
export const getPhase = (id) => PHASES.find(p => p.id === id) || null;
export const phaseIndex = (id) => PHASES.findIndex(p => p.id === id);

/** A phase is "unlocked" (recommended to play) once the previous one is cracked. */
export function isUnlocked(id, state) {
  const i = phaseIndex(id);
  if (i <= 0) return true;
  const prev = PHASES[i - 1];
  return !!(state.cracked[prev.id]) || prev.status !== 'solved';
}

export const SOLVED_COUNT = PHASES.filter(p => p.status === 'solved').length;
