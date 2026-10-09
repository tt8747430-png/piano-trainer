# How two hands hold a chord of five notes or more

Research for the Chords explorer's **Hands** and **Inversion** fields. No source code was changed.
Keys are named with C4 = middle C (MIDI 60, the kernel's `MIDDLE_C`). Dated 2026-10-09.

## 1. Answer first

| Size                   | Both hands                                                                         | Right hand alone                       | Inversion                                                                              |
| ---------------------- | ---------------------------------------------------------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------- |
| Triad, 7th (3–4 notes) | as today: the chord over its root an octave below                                  | as today: the whole chord              | the tone at the bottom: Root · 1st · 2nd · 3rd                                         |
| 9th (5)                | LH root · RH 3-5-7-9. C9 = C3 · E4 G4 B♭4 D5                                       | not offered: two hands from five notes | the root stays in the bass; the right hand starts **from the 3rd** or **from the 7th** |
| 11th (6)               | LH root + perfect 5th · RH the rest inside an octave. Cm11 = C3 G3 · E♭4 F4 B♭4 D5 | not offered                            | the same two; from the 7th = C3 G3 · B♭3 D4 E♭4 F4                                     |
| 13th (6–7)             | the same. C13 = C3 G3 · E4 A4 B♭4 D5                                               | not offered                            | the same two; from the 7th = C3 G3 · B♭3 D4 E4 A4                                      |

- Every tone stays on the keys; only the 11th of a 13th over a major 3rd is left out, as the builder does today.
- Players go further (the 5th dropped first, the root left to a bassist); a page that shows what a chord is made of
  should not.
- From a 9th up, sources either keep the chord in root position (classical) or turn over only the hand above the
  bass (jazz's A and B). No source read here names an inversion of an 11th or a 13th.

## 2. Findings

Verified = read in the source this session. Each row has at most one quote. Probe = a throwaway script run against
`src/shared/lib/music`; nothing was written to the repo but this file.

### 2.1 What the app does today (verified in the repo, numbers from a read-only probe of the kernel)

| #   | Fact                                                                                                                                                                                                                                                | Where                                                                                                                                                                                                                                                                        |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | The explorers stack every tone in the right hand from the root at or above middle C; Both hands adds only the root an octave below.                                                                                                                 | `src/shared/lib/music/place.ts:66-80`                                                                                                                                                                                                                                        |
| R2  | An inversion moves the lowest tones up an octave; at most three, whatever the chord's size: "at most three (the 3rd, 5th or 7th in the bass)".                                                                                                      | `place.ts:39-43`, `:53-63`                                                                                                                                                                                                                                                   |
| R3  | **The builder's C13 has six notes, not seven**: C E G B♭ D A. Today, Both hands: LH C3 · RH C4 E4 G4 B♭4 D5 A5 (21 semitones). Seven-note stacks include Cm13 (C4 E♭4 G4 B♭4 D5 F5 A5) and C13#11.                                                  | `src/shared/lib/music/chord-parts.ts:276-289`                                                                                                                                                                                                                                |
| R4  | The builder makes 172 chords; 138 have five notes or more (53 of five, 57 of six, 24 of seven, 4 of eight). ADR 0014 still says 124.                                                                                                                | `chord-parts.test.ts:129-132`, probe                                                                                                                                                                                                                                         |
| R5  | A 9th chord's 1st inversion today is E4 G4 B♭4 C5 D5: the 9th a second above the root, which W4 forbids.                                                                                                                                            | `place.ts:60-62`, probe                                                                                                                                                                                                                                                      |
| R6  | A **row** already sends the root of a chord of five notes to the bass: "A chord of this many notes leaves its root to the bass." It keeps the 5th, so a row's C13 is C3 · E4 G4 B♭4 D5 A5: five keys an 11th wide.                                  | `src/shared/lib/music/voice-lead.ts:13-14`, `:31-34`; probe                                                                                                                                                                                                                  |
| R7  | The **Player** drops the root and the 5th, down to four notes, and calls the right hand's start an inversion: Dm9 1st = F A C E, 3rd = C E F A.                                                                                                     | `src/shared/lib/arrangement/voice-leading.ts:45-70`; `arrange.test.ts:220-221`; `docs/adr/0023-an-inversion-and-a-walk-of-keys-are-ways-to-play-any-chart.md:15-21`                                                                                                          |
| R8  | ADR 0032 records the sheets: "voice a 9th chord as four notes over the bass".                                                                                                                                                                       | `docs/adr/0032-a-numeral-carries-its-chord.md:9-12`, `:39-41`                                                                                                                                                                                                                |
| R9  | The owner's course (Gorshkov, «Нонаккорды») puts the bass in the left hand and four notes in the right, in two layouts, 3-5-7-9 and 7-9-3-5. The spec corrects its name for the second: "The root stays in the bass, so the chord is not inverted". | `docs/superpowers/specs/2026-09-29-chromatic-walk-and-daisy-fields-design.md:38-40`, `:47-48`                                                                                                                                                                                |
| R10 | The lesson teaches the same in the app's words: "Now with 9th chords, the root left to the bass." Its two links are named for where the hand starts: from the 3rd, from the 7th (ru: от терции, от септимы).                                        | `src/entities/lesson/content/two-five-one.ts:130-147`                                                                                                                                                                                                                        |
| R11 | A lesson already teaches the one omission the builder makes: "13 chords usually leave out the 11,"                                                                                                                                                  | `src/entities/lesson/content/reading-chord-symbols.ts:122-127`                                                                                                                                                                                                               |
| R12 | The Chord finder already knows what a hand may leave out (5th, then the 9th and 11th under the highest number): "Never the root, the 7th, the highest number or an alteration".                                                                     | `src/shared/lib/music/chord-finder.ts:48-65`                                                                                                                                                                                                                                 |
| R13 | The owner's tension table ranks the same two tones lowest: "the root and a perfect 5th weak".                                                                                                                                                       | `src/shared/lib/music/tensions.ts:71-76`                                                                                                                                                                                                                                     |
| R14 | The glossary separates the words: Inversion is "Which chord tone is lowest"; a Voicing is the layout (shell, rootless, drop 2, quartal, upper structure); a Shell is the left hand's root and 7th.                                                  | `docs/UBIQUITOUS_LANGUAGE.md:48-49`, `:95-96`                                                                                                                                                                                                                                |
| R15 | Figures stop at 7th chords: "9ths and up take none and show their bass as a slash".                                                                                                                                                                 | `docs/adr/0014-a-scale-stacks-its-own-chords-and-a-key-is-a-page.md:35`; `UBIQUITOUS_LANGUAGE.md:56`                                                                                                                                                                         |
| R16 | Exercises carry two more layouts: the shell (root F2–E3 and its 7th) and drop 2 (second voice from the top an octave down, in the left hand).                                                                                                       | `src/shared/lib/exercise/line.ts:120-131`; `barry-harris.ts:108-112`, `:234`                                                                                                                                                                                                 |
| R17 | Only the Chords explorer asks for two hands: every other caller of `placeChord` passes `bothHands: false` and wants the chord spelled (trainer, lesson examples, piece chords, Reharmonise, the tensions panel).                                    | `src/features/trainer/round-keys.ts:31`, `draw.ts:215,276`; `src/widgets/lesson-view/model/chord-example.ts:29`; `src/widgets/reharmonise/model/holding-keys.ts:26`; `src/widgets/piece-chords/ui/PieceChords.tsx:46`; `src/widgets/chord-explorer/model/tension-keys.ts:13` |

So the repo holds three rules for one question: the explorers' stack (R1), the row's root to the bass (R6), the
Player's four notes (R7). The explorer is the only one that shows an unplayable hand.

### 2.2 How pianists split a big chord (verified on the web)

| #   | Claim                                                                                                                                                                                                                                                                                                                                                     | Source                                                                                                                                                                                                                                                           | Quote                                                                         |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| W1  | A stack of thirds is a spelling, not something to play. The root goes in the left hand so the harmony is clear; the 5th is the first tone to go; extensions go in the upper voices; the 13th above the 7th or it sounds like a 6th.                                                                                                                       | Megan Lavengood, "Jazz Voicings", _Open Music Theory_ v2 — https://viva.pressbooks.pub/openmusictheory/chapter/jazz-voicings/                                                                                                                                    | "you would not want to perform these tall stacks of thirds"                   |
| W2  | A number implies the extensions under it, but not that they sound.                                                                                                                                                                                                                                                                                        | Megan Lavengood, "Chord Symbols", _OMT_ — https://viva.pressbooks.pub/openmusictheory/chapter/chord-symbols/ (note 1)                                                                                                                                            | "they are not necessarily played"                                             |
| W3  | Classical four parts: always the root and the 7th; **the 9th replaces a doubled root, the 11th replaces the 3rd, the 13th replaces the 5th**; the 9th must sound in the octave above the root.                                                                                                                                                            | Bryn Hughes, "Altered and Extended Dominant Chords", _OMT_ — https://viva.pressbooks.pub/openmusictheory/chapter/altered-and-extended-dominant-chords/                                                                                                           | "we tend to only use extended chords in root position"                        |
| W4  | The Soviet conservatory textbook: D9 almost only in root position; in four parts without its 5th; the 9th and the root in different octaves, never a second apart; its three lower tones are the dominant and its two upper ones the subdominant (a chord of two functions).                                                                              | Дубовский, Евсеев, Способин, Соколов, _Учебник гармонии_ (М.: Музыка, 1965), тема 23, с. 140–144 — scan at https://sheba.spb.ru/za/uchebnik-garmonii-1965.pdf (read by OCR)                                                                                      | «применяется неполным, то есть с пропуском квинты»                            |
| W5  | Rimsky-Korsakov: the 9th chord stands alone only on V, drops its 5th in four parts, the 9th mostly on top.                                                                                                                                                                                                                                                | Н. Римський-Корсаков, _Практичний підручник гармонії_ (Київ: Мистецтво, 1948, from the 16th Russian ed.), §42, с. 52 — https://musicinukrainian.files.wordpress.com/2021/10/d09fd180d0b0d0ba_d0bfd196d0b4d180_d0b3d0b0d180d0bcd0bed0bdd196d197.pdf (read by OCR) | «У чотириголосному складі в ньому проминається квінта»                        |
| W6  | Common practice, as Wikipedia reports Benward & Saker (2009, II, pp. 179, 183–84): V9 = root, 3rd, 7th, 9th; V11 = root, 7th, 9th, 11th (3rd and 5th out); V13 = root, 3rd, 7th, 13th (5th, 9th, 11th out). Not checked in the book.                                                                                                                      | https://en.wikipedia.org/wiki/Ninth_chord · https://en.wikipedia.org/wiki/Eleventh_chord · https://en.wikipedia.org/wiki/Thirteenth_chord                                                                                                                        | "typically omitted"                                                           |
| W7  | The 11th leaves a dominant or major 13th because it is a semitone over the 3rd. Same rule as `chord-parts.ts:287`.                                                                                                                                                                                                                                        | Hal Leonard, _Picture Chord Encyclopedia_ (2003), p. 10, as quoted at https://en.wikipedia.org/wiki/Thirteenth_chord                                                                                                                                             | "It is customary to omit the eleventh on dominant or major thirteenth chords" |
| W8  | The dominant 11th is played without its 3rd: C–G–B♭–D–F is C9sus4, written Gm7/C (Stephenson 2002, p. 87, via Wikipedia) or B♭/C.                                                                                                                                                                                                                         | https://en.wikipedia.org/wiki/Eleventh_chord                                                                                                                                                                                                                     | —                                                                             |
| W9  | Berklee, solo piano: include the root; the basic sound is 1, 3, 7 (1, 3, 6 for a 6th chord); an altered 5th counts, a perfect one does not; tensions go over, between or just under the 3rd and 7th, never low in the bass clef.                                                                                                                          | Randy Felts, _Reharmonization Techniques_ (Berklee Press), excerpt — https://online.berklee.edu/takenote/?p=11192                                                                                                                                                | "Chord tone 5 is not considered part of the basic chord sound"                |
| W10 | Berklee's rule of tension substitution; the 11th usually replaces the 5th, sometimes the 3rd (sus4). The left hand plays the guide tones 3 and ♭7 under an upper-structure triad.                                                                                                                                                                         | Suzanna Sifter (author of _Berklee Jazz Keyboard Harmony_), interview, Berklee Online — https://online.berklee.edu/takenote/?p=3041                                                                                                                              | "9 for 1, and 13 for 5."                                                      |
| W11 | Left-hand voicings come in an A and a B position, all rootless; two-handed voicings rank beside them. Upper structures = a dominant's 3rd and 7th under a triad, from Bill Evans and Wynton Kelly; Stacked 3rds = a minor 7th chord's root in the left hand and thirds above it, the 4th on top; the Kenny Barron chord = root, 5th, 9th · 3rd, 7th, 4th. | Mark Levine, _How to Voice Standards at the Piano: The Menu_ (Sher Music, 2014), ch. 1, sample pages at a retailer — https://www.ejazzlines.com/wp-files/2/shhtvs.pdf                                                                                            | "You will notice that all six voicings are rootless."                         |
| W12 | _The Jazz Piano Book_ orders the subject: Three-Note Voicings (p. 17), Adding Notes to Three-Note Voicings (27), Left-Hand Voicings (41), So What Chords (97), Fourth Chords (105), Upper Structures (109), Block Chords (179).                                                                                                                           | Sher Music, table of contents — https://www.shermusic.com/0961470151.php                                                                                                                                                                                         | —                                                                             |
| W13 | Rootless voicings: A has the 3rd at the bottom, B the 7th. Major and minor: 3-5-7-9 / 7-9-3-5. Dominant: 3-13-♭7-9 / ♭7-9-3-13. C7♭9 without its root is E°7. Four notes inside an octave, C3–C5; shown in the right hand over the left hand's root.                                                                                                      | Piano With Jonny (Jonny May, Michael LaDisa), "Rootless Voicings for Piano: The Complete Guide" — https://pianowithjonny.com/piano-lessons/rootless-voicings/                                                                                                    | "replace the root with the 9th and the 5th with the 13th"                     |
| W14 | Solo piano: a bass shell = bass note + 3rd and 7th (the essential tones, kept between C3 and G4); a bass note may carry a 5th above it; the 13th takes the 5th's place in major and dominant chords, the 11th in minor; a bigger chord = a shell or rootless voicing in the left hand and more in the right.                                              | Jeremy Siskind, _Playing Solo Jazz Piano_, ch. B "Three Positions of the Left Hand" (author's PDF) — https://jeremysiskind.com/wp-content/uploads/2022/12/Chapter-B-1.pdf                                                                                        | "as many different notes as possible between the right hand and left hand"    |

### 2.3 What "inversion" means from a 9th up

| #   | Claim                                                                                                                                                                                                                                                                                                                                          | Source                                                                                                                                                                       | Quote                                                                        |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| I1  | Extended chords are defined from their root, so textbooks keep them in root position (W3, W4). 13th chords blur when inverted and are found in root position (Benward & Saker p. 179, via Wikipedia); a whole seven-note 13th inverted is another 13th on another root (Cooper 1981, p. 372, via Wikipedia).                                   | W3, W4, https://en.wikipedia.org/wiki/Thirteenth_chord                                                                                                                       | —                                                                            |
| I2  | The oldest Russian source names a 9th chord's inversions and figures three of them (6/7, 4/5, 2/3); the fourth is not used.                                                                                                                                                                                                                    | Н. Соловьёв, «Нонаккорд», _ЭСБЕ_ т. XXI (1897) — https://ru.wikisource.org/wiki/ЭСБЕ/Нонаккорд                                                                               | «нона всегда должна находиться выше основного тона»                          |
| I3  | Rimsky-Korsakov allows one: of the 9th chord's inversions only the third is sometimes used (W5, note to §42). Wikipedia's summary, that he allowed none, overstates him.                                                                                                                                                                       | W5                                                                                                                                                                           | —                                                                            |
| I4  | The 1965 textbook: D9's inversions are rarer still and have no accepted names (W4, с. 141). The repo agrees (R15).                                                                                                                                                                                                                             | W4                                                                                                                                                                           | —                                                                            |
| I5  | Schoenberg, as Wikipedia quotes _Theory of Harmony_ pp. 346–47 (not checked in the book):                                                                                                                                                                                                                                                      | https://en.wikipedia.org/wiki/Ninth_chord                                                                                                                                    | "The ninth chord and its inversions exist today"                             |
| I6  | Why it breaks down: with tones left out and any tone allowed in the bass, any set of notes can be read on any root.                                                                                                                                                                                                                            | Damian Blättler, "A Voicing-Based Model for Additive Harmony", _Music Theory Online_ 23.3 (2017), [3], [5] — https://mtosmt.org/issues/mto.17.23.3/mto.17.23.3.blattler.html | "chord inversion has a more disruptive effect in additive-harmonic contexts" |
| I7  | Jazz and pop teaching does not invert these chords. Another bass is a slash chord; what turns over is the hand above the bass: A or B (W11, W13, W14), a shell's 3rd-below-7th or 7th-below-3rd (W14), an upper structure's triad in its three positions with the 3rd and 7th swapped under it (W11), drop 2 of a four-note close chord (R16). | W11, W13, W14                                                                                                                                                                | —                                                                            |

### 2.4 Where the sources disagree

- **Does a 9th chord have inversions?** Yes, three used (Solovyov 1897); one, sometimes (Rimsky-Korsakov); rare and
  unnamed (Dubovsky et al. 1965); root position only (OMT, Hughes); yes (Schoenberg). None names any for an 11th or
  a 13th; Ulehla (1966, in I6's article) gives rules chord by chord instead.
- **What the 11th replaces.** The 3rd (classical V11: OMT Hughes; Benward & Saker). Usually the 5th, the 3rd only in a
  sus4 (Berklee, Sifter); in minor chords the 5th (Siskind). The builder's C11 keeps E under F (probe: C E G B♭ D F),
  which neither camp plays (W8).
- **Where the 13th sits.** Above the 7th (OMT, Lavengood); Ulehla (1966, quoted in I6's article, [4]) forbids the 7th
  next to the 13th. The standard A voicing 3-13-♭7-9 puts them a semitone apart (W13). B (♭7-9-3-13) satisfies both.
- **The root.** Always in the left hand in a textbook and in solo piano (W1, W9); left out when a bassist plays it
  (W1, W11, W13). Levine adds that a rootless hand is heard as two chords at once (D-7 or B♭). My inference: a
  learning tool should sound the bass.

### 2.5 Not verified

- **Levine, _The Jazz Piano Book_, the chapters themselves.** Only the table of contents (W12) and his 2014 book's
  sample (W11) were read. From memory of the book, unchecked: ch. 7 voices ii–V–I as Dm7 F A C E → G7 F A B E → C E G
  A D (A, B, A); ch. 19 teaches drop 2 over Barry Harris's 6th-diminished scale.
- **Piston, Kostka & Payne, Aldwell & Schachter.** The archive.org copies are lending-only and were not read. From
  memory they agree with W3–W6 (5th out in four parts, root position); cite W3–W6 instead.
- **Barry Harris.** No primary statement on extended chords was found. From memory: he builds harmony from 6th chords
  and their diminished, not from 9ths and 13ths. The repo takes his 6th-diminished scale, drop 2 and shells (R16).
- **Gorshkov's PDFs** are not in the repo; R9 is the spec's record of them.
- W4 and W5 were read by OCR from scans: check the page before quoting either in the app.

## 3. Options for the app

The same four chords in each. "From the 3rd / from the 7th" names the right hand's lowest tone.

### Option A — the root (and the 5th) to the left hand, the rest close in the right

Left hand: the root; from six notes the perfect 5th too. Right hand: everything else inside one octave.

| Chord | Both hands, from the 3rd    | Both hands, from the 7th    |
| ----- | --------------------------- | --------------------------- |
| C9    | LH C3 · RH E4 G4 B♭4 D5     | LH C3 · RH B♭3 D4 E4 G4     |
| Cm11  | LH C3 G3 · RH E♭4 F4 B♭4 D5 | LH C3 G3 · RH B♭3 D4 E♭4 F4 |
| C13   | LH C3 G3 · RH E4 A4 B♭4 D5  | LH C3 G3 · RH B♭3 D4 E4 A4  |
| C7♭9  | LH C3 · RH E4 G4 B♭4 D♭5    | LH C3 · RH B♭3 D♭4 E4 G4    |

- **Inversion offers:** triads and 7ths as today. From five notes, two choices, **From the 3rd · From the 7th**, in
  the same `inversion` param. The hand from the 7th sits under the hand from the 3rd, so the 3rd and 7th stay near
  middle C (W14).
- **Probe over all 172 chords** (my design, checked by a read-only script): the right hand holds four keys in 91 of
  the 138 big chords and five in 35, never more than a major 7th wide; the left hand a 5th at most. Twelve altered
  dominants of seven or eight notes (C7alt, C7♭9#9#11♭13…) would leave six or seven: there the left hand takes the 7th
  too (its shell, R16) and, in one, the altered 5th, which brings every one of them to five.
- **Code:**
  - `src/shared/lib/music/place.ts`: `placeChord` for `bothHands` from five notes; a close placement beside
    `inverted`, which stacks by each tone's distance from the root; what `lastInversion` answers for the explorer.
    `place.test.ts`: the four chords, and over `CHORD_PARTS` every tone once, hands not crossed, five keys and an
    octave at most.
  - `src/widgets/chord-explorer/model/chord-view.ts:23-57`: `viewChord` (two hands from five notes), `changedView`
    (the layout kept when the size crosses five); `chord-view.test.ts:49-51`.
  - `src/app/routes/explorer-search.ts:97` (`readChordsSearch`) and `route-search.test.ts:55-71`, which today keeps
    a 9th with `inversion=2&hands=both`.
  - `src/widgets/chord-explorer/ui/ChordBuilder.tsx:155-172`; `src/shared/ui/InversionChoice.tsx:25-29` and
    `InversionGlyph.tsx:26` (it draws three or four notes) or a sibling choice; `kit.test.tsx`;
    `src/pages/chords/ui/ChordsPage.test.tsx:204`.
  - `src/shared/lib/music/chord-finder.ts:27,138`: a found chord's `inversion` opens Chords.
  - Strings in `en` and `ru` (`music.inversion`, the Hands reason); CODE_STYLE §8 (`:259-261`), the glossary's
    Inversion row, CLAUDE.md, a new ADR amending 0014.
  - Nothing: `chordBar`, `ChordSheet`, `chordShown` and `keysOf` take a `PlacedChord`.
  - Optional, same ADR: `src/shared/lib/music/voice-lead.ts:31-34` takes the same split, which fixes R6.
- **For a learner:** every tone on the keys, each hand playable, and the right hand's two shapes are the ones the
  course, the lesson and the Player already teach (R7, R9, R10) and that jazz names A and B (W11, W13). Costs: the
  Hands field has nothing to choose from five notes; in C13 from the 3rd the 13th sits under the ♭7 (§2.4); the keys
  do not say which hand, only the staff does.

### Option B — the shell in the left hand, the 3rd and the colours in the right

Left hand: root and 7th (6th in a 6/9), with the perfect 5th between them from six notes. Right hand: the rest, close.

| Chord | Both hands                  |
| ----- | --------------------------- |
| C9    | LH C3 B♭3 · RH E4 G4 D5     |
| Cm11  | LH C3 G3 B♭3 · RH E♭4 F4 D5 |
| C13   | LH C3 G3 B♭3 · RH E4 A4 D5  |
| C7♭9  | LH C3 B♭3 · RH E4 G4 D♭5    |

- **Inversion offers:** nothing from five notes (one layout; the field is hidden or disabled with its reason).
- **Code:** as A without the two layouts; the shell lives in `src/shared/lib/exercise/line.ts:120`, which the kernel
  cannot import (CODE_STYLE `:198`), so its rule moves into `src/shared/lib/music`.
- **For a learner:** the picture of a 7th chord below and its colours above: every extension over the 7th (W1), the
  right hand three or four keys in 126 of the 138 big chords (probe), C13's right hand the fourths E A D. Costs: it
  is not the course's four notes over the bass (R9), it differs from rows and the Player (R6, R7), there is no second
  layout to practise, and the left hand holds three keys in every 11th and 13th.

### Option C — a Voicing field beside Inversion

`voicing`: **Stacked** (today's picture, kept as the chord's spelling) · **In the hands** (Option A).

| Chord | Stacked (Both hands, as today) | In the hands |
| ----- | ------------------------------ | ------------ |
| C9    | LH C3 · RH C4 E4 G4 B♭4 D5     | as A         |
| Cm11  | LH C3 · RH C4 E♭4 G4 B♭4 D5 F5 | as A         |
| C13   | LH C3 · RH C4 E4 G4 B♭4 D5 A5  | as A         |
| C7♭9  | LH C3 · RH C4 E4 G4 B♭4 D♭5    | as A         |

- **Inversion offers:** Stacked: root position only from five notes (R5). In the hands: A's two.
- **Code:** A's, plus a `voicing` param in `ChordView`, `CHORDS_DEFAULTS` and `readChordsSearch`
  (`src/app/routes/explorer-search.ts:67-101`), its strings in both languages, and a tenth field in `ChordBuilder`. More layouts
  (Shell, Drop 2) could join later under the glossary's own word (R14).
- **For a learner:** both the textbook stack and the hands, each under its name. Costs: one more field on a page that
  has nine; the unplayable picture stays one tap away; the default still has to be A's.

### Option D — leave tones out as players do (the Player's rule)

Left hand: the root. Right hand: four notes; the 5th goes first, then the 11th or 9th under the highest number (R12).

| Chord | Both hands, from the 3rd | Left out |
| ----- | ------------------------ | -------- |
| C9    | LH C3 · RH E4 G4 B♭4 D5  | —        |
| Cm11  | LH C3 · RH E♭4 F4 B♭4 D5 | 5th (G)  |
| C13   | LH C3 · RH E4 A4 B♭4 D5  | 5th (G)  |
| C7♭9  | LH C3 · RH E4 G4 B♭4 D♭5 | —        |

- **Inversion offers:** A's two.
- **Code:** A's, plus the tones left out said under the chord (the Chord finder's `no5th`, `no9th`, `no11th` strings
  exist, `src/shared/i18n/locales/en/learn.ts:116-119`). The Player's rule sits in
  `src/shared/lib/arrangement/voice-leading.ts:50-54`, above the kernel, so it moves into `src/shared/lib/music` and
  the arrangement imports it. One rule would then serve the explorer,
  rows and the Player.
- **For a learner:** exactly what a pianist plays (W1, W9, W13). Cost: it fails the first requirement. Cm13 would show
  five of its seven notes, and a learner counting keys against the symbol finds one missing.

## 4. Recommendation

**Option A**, with two hands from five notes.

- A and B both meet the two requirements with no new field: every tone on the keys, no hand over five keys or an
  octave. A wins on the next three points.
- It is already the house rule in rows and in the Player (R6, R7) and the owner's course and lesson (R9, R10); the
  explorer is the outlier. The threshold is the one `voice-lead.ts` has: five notes.
- Each move is one a source owns: the root in the bass (W1, W4, W9); the 9th in the root's place (W3, W10, W13); the
  5th is the tone that can leave the hand (W1, W4, W5, W9), and a 5th over the bass note is the bass's own
  reinforcement (W14); the right hand's two starts are A and B (W11, W13).
- The Inversion field then says something true at every size: the tone at the bottom of the hand that plays the chord.
  For a 7th chord and a 9th the numbers even line up: 1st inversion ↔ from the 3rd, 3rd ↔ from the 7th (the course's
  shortcut that splits the root into the 7th and the 9th, R9), which is ADR 0023's numbering (R7).
- B is the better sound for a 13th but breaks with the course at the 9th. C is A plus a field, worth it only if the
  stack must stay on the keys. D is right for the Player and wrong for a page whose job is to show the chord.

**Unchanged:** the builder, its 172 chords and their names; the 11th left out of a 13th over a major 3rd; the tone
chips, the tensions panel and Practise rows; triads and 7th chords in both Hands; `placeChord` with one hand for the
trainer, lesson examples, piece chords and Reharmonise (R17); Scales' Chords view; the Player's four notes (ADR 0023);
the URL's param names and every saved store. Inference, not checked: a remembered view is read back through
`readChordsSearch`, so an inversion a big chord no longer has is fitted, with no store version.

## 5. Open questions for the owner

1. **Right hand alone on a chord of five notes or more:** not offered (recommended), the right hand's four keys by
   themselves (the course's split-root hand, which sounds like another chord without its bass), or today's stack
   kept and named as the chord's spelling?
2. **How far the rule goes:** only the Chords explorer, or also rows (`voiceLead`, whose 13th hand is an 11th wide,
   R6), Scales' Chords view (seven-note stacks with inversions) and the lessons' chord examples?
3. **C11 over a major 3rd:** keep E under F as the builder stacks it, or build the dominant 11th as both camps play it,
   without its 3rd (then it is C9sus4, W8)? That changes a chord's notes and name, not only its hands.
