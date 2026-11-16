# Research: chord detection, chord vocabulary and progressions (r61)

The plan for naming the keys held, the chords we can name and spell, and the progression data, from the owner's
research in `piano-data/research/`. Every claim names its file and section. Every test case below was **run**, not
inferred: `/tmp/claude-0/r61/run.ts` (tsx) calls our `nameChords` and Piano Companion's `nameChord`;
`/tmp/claude-0/r61/merge.py` runs ChordLab's `chord_detector.py` and GarageBand's `gb_chord_detector.py` on the same
keys. Nothing under `src/` was changed.

**Headline.** Our detector is already the best of the four on these cases: 62 of 71 named as expected by `nameChords`
alone, 64 of 71 in the app (two power chords are the widget's), against roughly 54 (ChordLab), 51 (GarageBand) and 54
(Piano Companion) after normalising symbol style. What it lacks is one reading kind (a chord over a bass that is not
its tone: `C/D`, `F/G`, `C/F`), the full seven-tone 13th, a handful of qualities, and, worse, **124 of the 173 chords
it can name cannot be read back by our chord-symbol parser** (section 2.4), so the score editor drops them.

---

## 1. Detection

### 1.1 How each researched detector works

#### ChordLab 1.0.6 (`chordlab/DETECTION_RULES.md`, `chordlab/chord_detector.py`)

Rule-based, bass-first, with a plausibility filter. Exact ports of `analyseQuality`, `isPlausible` and
`getChordTones`; the root-search weights are exact, the naming is approximate (DETECTION_RULES.md, Fidelity).

| Step | Rule (DETECTION_RULES.md section) |
|---|---|
| Input | ≥ 2 notes and ≥ 2 pitch classes; lowest note = bass; octaves and doublings ignored (§1) |
| Quality | first match wins: M3 → 7 / maj7 / aug / major; m3 → m7 / m(maj7) / minor, or with ♭5 and no 5 → m7♭5 / dim7 / dim; no 3rd + 4th → maj7sus4 / 7sus4 / sus4; no 3rd + 2nd only in {0,2,7} → sus2; ≤ 2 pcs + 5th → power; else major (§2). Only 15 base qualities; 9/11/13 and alterations are added by the namer |
| Plausibility | 14 rejection rules (§3): e.g. ♭9 without a 7th (rule 3), b6 without a 7th unless augmented (2), 4th + major 3rd without ♭7 (9), both 3rds without ♭7 (10), no 3rd and no 7th unless {0,2,7} or {0,5,7} (14) |
| Root choice | (1) **bass as root** if plausible and it has a 3rd or is sus/power; (2) **slash rule**: notes above the bass are exactly a root-position major/minor triad → `triad/bass`; (3) every other held pc as root, lowest `score = (cand−bass) mod 12 + 12 × (5×missing tones + 3 if no 7th + 4 if 5 and ♭6 + 10 if M3+♭7+11 + 6 for an awkward bass (♭9; ♭5 unless dim; #5 unless aug; m3 under a M3) + suffix length)`; (4) a tritone dyad = rootless dominant, root a M3 below the bass (`B F` → `G7(no root)`); (5) fallback on the bass (§4) |
| Ambiguity | C6 vs Am7: bass wins (`57 60 64 67` → Am7, `60 64 67 69` → C6). Omitted 5th: tolerated through "missing tones" ×5 only in step 3; step 1 accepts any plausible reading |
| Naming | suffix vocabulary `m maj (maj…) dim aug 6 6/9 7 9 11 13 sus2 sus4 add (add…) (omit 3)`, alterations in parentheses `C7(#9,#5)` (§5). The port prints every black key with a sharp (`C#maj9`, README "Detected names") |

#### GarageBand 10.4.14 (`garageband/DETECTION_RULES.md`, `garageband/gb_chord_detector.py`)

A **vote**, used by the control-bar chord display (algo 0). Every pitch class 0–11 is a candidate, **sounding or not**.

| n distinct pcs | R | ♭9 | 9 | m3 | M3 | 4 | ♭5 | 5 | #5 | 6 | ♭7 | M7 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1–2 | 3 | 0 | 0 | 2 | 2 | 0 | 0 | 1 | 0 | 0 | 2 | 2 |
| 3 | 18 | 0 | 2 | 12 | 12 | 2 | 2 | 14 | 1 | 2 | 5 | 5 |
| 4–6 | 18 | 0 | 3 | 12 | 12 | 3 | 3 | 14 | 0 | 3 | 3 | 3 |
| 7+ | 18 | 8 | 8 | 12 | 12 | 6 | 5 | 14 | 4 | 4 | 10 | 10 |

`score(cand) = Σ TABLE[n][(p − cand) mod 12]`, the three lowest pcs ×4 when n ≥ 7; highest wins; ties go to a sounding
candidate nearer the bass. Five exact special cases checked first ("General vote" table): `{0,6,11}` → bass+2 (a rootless
D13 over C), `{0,4,9,10}` → bass (C13 shell), `{0,2,6,11}` → bass+2, `{0,3,6,10}` → bass (**m7♭5, not E♭m6/C**),
`{0,7}` with 3 notes → bass (doubled power chord). It favours the root that completes the strongest triad, so jazz
voicings come out as a triad over another bass: `G F A B E` → `Em(b9)/G` (README, "Compared with ChordLab"; our cases
E5, E6, E7, E10, E11 all fail there). Spelling: the root with the fewest accidentals (`SetRootNoteEnhWithLeastSigns`).
Algo 1 is a 24→15→15→12 network whose weights are not exported.

#### Piano Companion 1.6 (`piano-companion/CHORD_DETECTION.md`, `chord-detection.ts`, `chord-detection.test.mjs`)

Two algorithms. **A** (`findChordByFormulaPart`, the macOS "By keys" screen) matches exact voicings as a subset and
ranks by popularity (§A.2); the doc itself recommends against it for a trainer (§C, PIANO_TRAINER_TAKEAWAYS.md item 9).
**B** (`ChordNamer.Name`, §B) is the one to learn from:

- A dictionary of 89 listed chords (`data/chords.json`, `inDictionary`) × 17 root spellings, one entry per (root pc,
  mask), the spelling with the fewest key accidentals (`KeyFifths`; minor-type −3; tie: minor → flats, major → sharps)
  (§B.1).
- A difficulty per chord (§B.2: major 0, minor 1, 7 2, m7/maj7/sus4 3, sus2/dim/6 4, aug/m6/add9/m7♭5/dim7/7sus4 5,
  m(add9)/9/maj9/m9 6, m(maj7)/6/9 7, else 4 + pcs).
- Four match kinds (§B.4): **Root** = base; **Inversion** = base + 3; **Omitted** = base + 3 per missing tone (+3 if
  inverted), only an omittable tone (5th if a 3rd is played; 9th if the chord has 11/#11/13; 11th if it has a 13th), at
  most 1 missing (2 from 6 tones); **ForeignBass** = the notes above the bass are exactly a chord of ≥ 3 tones and
  difficulty ≤ 7, the bass not in it → base + 6 (Beginner 8, Advanced 4).
- Keep candidates within 7 of the best raw score, sort by score then kind, drop duplicate labels, at most 3 (§B.5).
  Labels: `(no5)` merged into parentheses; a chord-tone bass spelled as that tone, a foreign bass by the chord's key
  side; `6/9` written `6(9)` before a slash (§B.6, `withBass`).
- Worked examples (§B.7): `57 60 64 67` → Am7 · C/A · C6/A; `62 65 69 72` → Dm7 · F/D · F6/D; `60 62 67` → Csus2 ·
  Gsus4/C; `61 65 68` → D♭; `66 70 73` → F♯; `63 66 70` → E♭m.

#### Chordio (`chordio/THEORY_ENGINE.md` §1–2, `data/engine_tables.json`)

A C++ analyser returns **one candidate per sounding pitch class as root** (§1.2); `ChordNameRanker` (§2, exact) costs
each one:

- **Bass penalty** 0 (root), 0.5 (ordinary inversion), or **1.0 with the bass taken out of the mask** (read as a slash
  bass) when the bass is ♭9; a 9th over a 3rd or 4th; a m3 under a M3; a 4th over a 3rd; a ♭5 over a 5th or with no 3rd;
  a #5 unless augmented; a 6th unless dim7/m6.
- **27 templates** with base costs (major/minor triad 0, 7ths 0.1, 6th 0.25/0.35, dim7 0.35, dim 0.45, sus4 0.6, sus2
  0.7, power 1.2…) and a missing-5th allowance (0.35 on triads, 0.1 on 7ths, 0.9 on 6ths).
- **Extra-tone penalties**: ♭9 0.5 on a dominant / 1.0 other 7ths / 1.4 triads; 9 0.3 with a 7th / 0.4 without; #9
  0.6 on a dominant; 11 0.95 over a M3 / 0.45 otherwise; #11 0.85; 13 0.4 with a 7th / 0.9 without; ♭7 0.9; 7 1.0.
  No template: 3.0 + 0.1 × pcs.
- Ties and display: with ≥ 3 candidates and best cost > 1.9 the bass-rooted one moves first; **alternatives only from 4
  pcs** (1 at 4 pcs, 2 at 5+), each ≤ 3.0 and not a duplicate.

Its content shows what players actually write (CONTENT_FORMATS.md §3, 6149 chords): min9 604, min9(11) 435, Maj9
419, min7 404, Maj 322, Maj7 295, min 204, 7 188, 9sus4 180, 9(13) 174, 7(♯9,♯5) 147, 13sus4 146, Maj7(13) 105,
min7♭5 94; 573 cells are slash chords.

#### Suggester 2 (`suggester-2/THEORY_ENGINE.md` §2, §9)

A formula matcher over 64 chord types (`data/chords.json`), each `ChordFormula(intervals, omittable)`: 11ths may drop
5 and 9, 13ths 5, 9 and 11 (`ComparisonType.TolerateOmittedIntervals`). Detection runs it over all roots, prefers the
lowest note as root, then lists slash chords; "This chord could not be identified." when empty (§9; TAKEAWAYS item 13).

### 1.2 What ours does today

`src/shared/lib/music/chord-finder.ts` (`nameChords`, re-exported at `index.ts:165`). Callers:
`widgets/chord-finder/model/finding.ts:64` (the Chord finder, all readings shown as chips, `ChordName.tsx:145-168`),
`features/live-keyboard/ui/HeldChord.tsx:20` (first reading only), `features/score-editor/model/keys-played.ts:14`
(first reading the parser can read back).

| Step | Ours (file:line) |
|---|---|
| Vocabulary | every chord the Chords builder makes: `CHORD_PARTS` (`chord-parts.ts:399-421`), 173 distinct shapes from triad × size × 7th × added tones × alterations (`SIZES` 124-132, `TRIAD_ADDS` 147-155, `addedOf` 163-170, `alterationsOf` 177-183), named by the 46-quality table where it has the chord (`chord.ts:26-253`), else by rule (`ruleSuffix`, `chord-parts.ts:348-356`) |
| Omitted tones | `leavable` (`chord-finder.ts:67-82`): the 5th from a 7th chord up and from a 6/9; the 9th and 11th under the highest number; a plain 7th chord's 3rd when its 5th is played; never root, 7th, highest number or alteration; not from sus chords but 7sus4. Never both 3rd and 5th (84-88) |
| Shape index | `SHAPES` (102-111): every shape and every way of leaving tones out, keyed by its pitch classes above the root |
| Size gate | ≥ 3 pitch classes (91, 169); one and two are the widget's (`finding.ts:55-62`: a note, an interval, a 5th also as `C5`) |
| Roots tried | every sounding pc (171), never an unsounded root (no rootless readings) |
| Slash chords | only over a chord tone: 3rd, 5th, 7th or an added 6th (`standsOn` 127-128), the chord whole (or its 5th left out over its 3rd or ♭7), no tension or sus tone in the bass (`plainInversion` 137-149) |
| Rank | lexicographic (197-205): root position first; a ♭5 read as #11 from a 9th up (117-118); a stacked chord before a 7th with an added tone (124); fewest tones left out; add2/add4 vs add9/add11 as voiced (248-256); a table name before a rule name; fewer tones |
| Duplicates | by symbol, and by root + bass + triad + size + added tones an octave apart (212-223) |
| Spelling | root by `chordRootSpelling` (`chord.ts:304-314`: fewest accidentals, no double; C♯/G♯ for a minor 3rd or ♭9, E♭ F♯ B♭ otherwise); in a key, the key's spelling unless it writes a double (`spelledChord` 263-271); bass as the key spells it (`bassSpelling` 152-153) |

The checked-in test is stale: `chord-finder.test.ts:72, 87, 129` still expect `CMaj13`, `CMaj7`, `CMaj9`, while the table
now writes `maj7` (`chord.ts:78`, changed in commit `4c51f0ec`); `npx vitest run
src/shared/lib/music/chord-finder.test.ts` reports **3 failed, 23 passed**.

### 1.3 The algorithm to adopt (best of the four)

Keep ours as the base: a closed vocabulary from the builder makes ChordLab's plausibility filter unnecessary (an
implausible set has no shape), and its omission rules already equal Piano Companion's omittable rules (§B.4) and
Suggester 2's `omittable` lists, with more care (never the 3rd and 5th both). Change it in seven places:

1. **A fourth reading kind: the foreign bass** (Piano Companion §B.4 ForeignBass; Chordio §2 bass penalty 1.0 "bass
   removed from the mask"; ChordLab §4 step 2). When the bass's pitch class sounds nowhere above it and the notes
   above it are exactly a **whole chord with a 3rd** of this set: major, minor, 6, m6, 7, maj7, m7, m(maj7), add9,
   m(add9) (Piano Companion's difficulty ≤ 7, less the symmetric dim, aug and °7, which read better from their own
   roots, and less the sus chords, which make `Esus2/C`), name it `chord/bass`. At least 3 pitch classes above the
   bass.
2. **Where the foreign bass ranks.** A root-position reading is *weak* when it leaves a tone out, or has no 3rd and is
   not of the 7sus4 family (7sus4, 9sus4, 13sus4, 7sus4♭9: a minor 7th over a 4th). Order: strong root readings →
   foreign-bass readings, if the best root reading is weak → weak root readings → inversions → foreign-bass readings
   otherwise. Among foreign readings, the fewer tones above first. This reproduces every research verdict in the cases:
   `D C E G` → C/D then D9sus4 (F1); `G C F A` → F/G (F2); `F C E G` → C/F, not Fmaj7sus2 (X16); `C D G B♭` → Gm/C
   (X11); `C F B♭ D A` → B♭maj7/C (X4, Chordio's costs 1.1 vs 1.4); while `C F G B♭ D` stays C9sus4 (X3, whole, 7sus4
   family) and `A C E G` stays Am7, C6/A, C/A (C1).
3. **The full seven-tone 13th.** `buildIntervals` drops the 11th from a 13th over a major 3rd (`chord-parts.ts:292`),
   so `C E G B♭ D F A` and its maj13 have no shape (E4; `maj13` full even reads `Dm13/C`). Every researched detector
   names it C13 (Piano Companion formula 36 `[0,4,7,10,14,17,21]`, ChordLab, GarageBand). Add a shape for the 13th and
   maj13 over a major 3rd with its natural 11th played, named as the 13th (the 11th is a clash the hand chose, not a
   new chord).
4. **Missing qualities** (section 2.2): `(♭5)` triad, `°(maj7)`, `m7♭9`, `m9#11`, `maj7♭5`. The ♭5/#11 rule stays
   ours (`chord-finder.ts:113-118`) and applies to the major 7th as it does to the dominant: `C E F♯ B` is Cmaj7♭5
   (Suggester 2 `Major7Flat5`, GarageBand `Cmaj7(b5)`, Piano Companion `maj7♭5`), `C E B D F♯` Cmaj9#11.
5. **Alternatives worth showing** (Chordio §2 "Displayed alternatives"; Piano Companion §B.5 `MaxScoreGap` 7 and 3
   candidates). Today every reading is a chip (`ChordName.tsx:160`), so `C E B♭ D F♯ A` offers `F#7♭5#9♭13/C` and
   `F#7#5♭5#9/C`, `C E A♭ B♭ E♭` offers `E+maj7#11/C`, `Cm9♭5` offers `D7♭9#5/C`. Keep an alternative only if it is
   whole (no tone left out) with at most one alteration, or is a symmetric chord's other root (`C+`, `C°7`); at most 3
   readings in all.
6. **Dyads stay intervals.** Do not adopt ChordLab's `B F` → `G7(no root)` (§4 step 4) or GarageBand's unsounded
   roots (`{0,6,11}` → D): a learner holding two keys hears an interval, and `finding.ts:55-62` already names a 5th
   as the power chord `C5` (cases D1-D3, O3).
7. **Spelling of a foreign bass with no key**: by the chord's side of the circle, flats for a chord whose key has flats
   (Piano Companion §B.6, `ForeignNoteName`); with a key, `spellInKey` as today.

Not adopted, with reasons: GarageBand's vote (fails 5 of our jazz voicings and votes for roots not played); Piano
Companion's algorithm A (voicing-exact, enharmonic twins); Chordio's per-template costs as such (our lexicographic rank
already reaches the same order, and is testable rule by rule); ChordLab's suffix-length term (ties our names to string
length).

### 1.4 The cases, run

`Notes → expected`. "Ours" is `nameChords` today; `(no 5th)` is its `leftOut`. Expected names are in our symbol style
(`maj7`, `°`, `+`, `m7♭5`, `°7`). Where the research disagrees, the source column says who said what, and the
expectation follows section 1.3.

**Result: 62 pass, 9 fail in `nameChords`; 64 pass, 7 fail in the app** (D1 and D2 are the widget's power chord).
Failing: F1 `C/D`, F2 `F/G`, X16 `C/F`, X4 `B♭maj7/C`, X11 `Gm/C` (the foreign bass, rules 1-2); E4 `C13` (rule 3);
X8 `Cmaj7♭5` (rule 4).

| # | Keys (MIDI) | Notes | Expected | Research source | ChordLab port | GarageBand port | Piano Companion `nameChord` | Ours today (`nameChords`, best first) | Ours |
|---|---|---|---|---|---|---|---|---|---|
| A1 | 60 64 67 | C E G | **C** | CL,GB,PC: C | C | C | C | C | pass |
| A2 | 60 63 67 | C Eb G | **Cm** | CL: Cm | Cm | Cm | Cm | Cm | pass |
| A3 | 60 63 66 | C Eb F# | **C°** | CL: Cdim | Cdim | Cdim | Cdim | C° | pass |
| A4 | 60 64 68 | C E Ab | **C+** | CL: Caug | Caug | Caug | C+, A♭+/C, E+/B♯ | C+, E+/C, A♭+/C | pass |
| A5 | 60 64 67 70 | C E G Bb | **C7** | CL,GB,PC: C7 | C7 | C7 | C7 | C7 | pass |
| A6 | 60 64 67 71 | C E G B | **Cmaj7** | CL,GB: Cmaj7 | Cmaj7 | Cmaj7 | Cmaj7, Em/C | Cmaj7 | pass |
| A7 | 60 63 67 70 | C Eb G Bb | **Cm7** | CL: Cm7 | Cm7 | Cm7 | Cm7, E♭/C, E♭6/C | Cm7, E♭6/C | pass |
| A8 | 60 63 66 70 | C Eb F# Bb | **Cm7♭5** | CL: Cm7b5; GB special {0,3,6,10}: m7b5 not Ebm6/C | Cm7b5 | Cm7b5 | Cm7♭5, E♭m/C, E♭m6/C | Cm7♭5, E♭m6/C | pass |
| A9 | 60 63 66 69 | C Eb F# A | **C°7** | CL: Cdim7; PC: Cdim7 | Cdim7 | Cdim7 | Cdim7, Adim7/C, F♯dim7/C | C°7, D#°7/C, F#°7/C | pass |
| A10 | 60 65 67 | C F G | **Csus4** | CL,GB: Csus4 | Csus4 | Csus4 | Csus4, Fsus2/C | Csus4, Fsus2/C | pass |
| A11 | 60 62 67 | C D G | **Csus2** | CL: Csus2; PC: Csus2 · Gsus4/C | Csus2 | Csus2 | Csus2, Gsus4/C | Csus2 | pass |
| A12 | 60 65 67 70 | C F G Bb | **C7sus4** | CL q38 7sus4 | C7sus4 | Csus47 | C7sus4 | C7sus4 | pass |
| A13 | 60 63 67 71 | C Eb G B | **Cm(maj7)** | CL q9 m(maj7) | Cm(maj7) | Cm(maj7) | Cm(maj7), G+/C, E♭+/C | Cm(maj7) | pass |
| A14 | 60 63 67 69 | C Eb G A | **Cm6** | CL q5 m6 | Cm6 | Cm6 | Cm6, Am7♭5/C | Cm6, Am7♭5/C | pass |
| D1 | 60 67 | C G | **C5** | CL,PC: C5 (two pitch classes) | C5 | C5 | C5 | — | FAIL in `nameChords`; pass in the app (`finding.ts:58-62`) |
| D2 | 48 55 60 | C G C | **C5** | GB special: doubled power chord C G C | C5 | C5 | C5 | — | FAIL in `nameChords`; pass in the app (`finding.ts:58-62`) |
| D3 | 59 65 | B F | **(interval)** | CL: G7(no root) tritone shell | G7(no root) | C#7/B | — | — | pass |
| B1 | 52 60 67 72 | E C G C | **C/E** | CL,GB: C/E | C/E | C/E | C/E | C/E | pass |
| B2 | 64 67 72 | E G C | **C/E** | PC: C/E | C/E | C/E | C/E | C/E | pass |
| B3 | 55 60 64 67 | G C E G | **C/G** | CL,GB: C/G | C/G | C/G | C/G | C/G | pass |
| B4 | 62 65 67 71 | D F G B | **G7/D** | ChordLab 2-5-1 pack: G7/D | G7/D | G7/D | G7/D | G7/D | pass |
| B5 | 48 50 54 57 | C D F# A | **D7/C** | CL inversion search: D7/C | D7/C | D7/C | D7/C, D/C | D7/C | pass |
| C1 | 57 60 64 67 | A C E G | **Am7** | CL,GB,PC: Am7 (C6/A second) | Am7 | Am7 | Am7, C/A, C6/A | Am7, C6/A | pass |
| C2 | 60 64 67 69 | C E G A | **C6** | GB: C6 | C6 | C6 | C6, Am7/C | C6, Am7/C | pass |
| C3 | 62 65 69 72 | D F A C | **Dm7** | PC: Dm7 · F/D · F6/D | Dm7 | Dm7 | Dm7, F/D, F6/D | Dm7, F6/D | pass |
| C4 | 60 62 64 67 | C D E G | **Cadd2** | SG2 Add2; CL/PC call it add9 | Cadd9 | Cadd9 | Cadd9 | Cadd2 | pass |
| C5 | 60 64 67 74 | C E G D | **Cadd9** | CL/PC add9 | Cadd9 | Cadd9 | Cadd9 | Cadd9 | pass |
| C6 | 60 64 65 67 | C E F G | **Cadd4** | SG2 Add4 | Fmaj9/C | C | Cadd11, Fmaj7sus2/C | Cadd4 | pass |
| C7 | 55 60 62 | G C D | **Gsus4** | GB/CL: Gsus4 (Csus2/G alt) | Gsus4 | Gsus4 | Gsus4, Csus2/G | Gsus4, Csus2/G | pass |
| F1 | 50 60 64 67 | D C E G | **C/D** | PC ForeignBass C/D | D9sus4 | Cadd9/D | C/D, Cadd9/D | D9sus4(no 5th) | FAIL |
| F2 | 55 60 65 69 | G C F A | **F/G** | PC ForeignBass; CL slash rule 2 | G9sus4 | Fadd9/G | F/G, Fadd9/G, Am7♯5/G | G9sus4(no 5th) | FAIL |
| O1 | 60 64 70 | C E Bb | **C7** | PC: C7(no5) | C7 | C7 | C7(no5) | C7(no 5th) | pass |
| O2 | 48 52 57 58 | C E A Bb | **C13** | GB special {0,4,9,10}: C13 shell | C13 | C13 | C7(13,no5) | C13(no 5th,9th), C7(add13)(no 5th) | pass |
| O3 | 48 54 59 | C F# B | **(none)** | GB special {0,6,11}: D (rootless D13 over C) | Cmaj7(#11) | D13/C | — | — | pass |
| E1 | 50 53 57 60 64 | D F A C E | **Dm9** | CL,GB: Dm9 | Dm9 | Dm9 | Dm9, Fmaj7/D | Dm9 | pass |
| E2 | 60 64 67 71 74 | C E G B D | **Cmaj9** | PC: Cmaj9 · Em7/C · G6/C | Cmaj9 | Cmaj9 | Cmaj9, Em7/C, G6/C | Cmaj9 | pass |
| E3 | 55 59 62 65 69 | G B D F A | **G9** | PC: G9 · Dm6/G | G9 | G9 | G9, Dm6/G, Bm7♭5/G | G9 | pass |
| E4 | 60 64 67 70 74 77 81 | C E G Bb D F A | **C13** | PC: C13 (all seven tones) | C13 | C13 | C13, Fmaj13/C, Gm13/C | — | FAIL |
| E5 | 43 53 57 59 64 | G F A B E | **G13** | ChordLab pack: G13 (GB: Em(b9)/G) | G13 | Em(b9)/G | G13(no5,11) | G13(no 5th) | pass |
| E6 | 48 52 56 58 63 | C E Ab Bb Eb | **C7#5#9** | ChordLab pack: C7(#9,#5) (GB: Abadd9(b13)/C) | C7(#9,#5) | Abadd9(b13)/C | C7(♯5,♯9) | C7#5#9, C7#9♭13(no 5th), E+maj7#11/C | pass |
| E7 | 44 54 58 60 65 | Ab F# Bb C F | **A♭13** | ChordLab pack: Ab13 (GB: Fm(b9)/Ab) | Ab13 | Fm(b9)/Ab | A♭13(no5,11) | A♭13(no 5th) | pass |
| E8 | 49 53 56 60 63 | C# F Ab C Eb | **D♭maj9** | ChordLab pack: Dbmaj9 (port prints C#maj9) | C#maj9 | C#maj9 | D♭maj9, Fm7/D♭, A♭6/D♭ | D♭maj9 | pass |
| E9 | 51 54 58 61 65 | Eb F# Bb C# F | **E♭m9** | ChordLab pack: Ebm9 | Ebm9 | Ebm9 | E♭m9, F♯maj7/D♯ | E♭m9 | pass |
| E10 | 46 56 60 62 67 | Bb Ab C D G | **B♭13** | ChordLab pack: Bb13 (GB: Gm(b9)/Bb) | Bb13 | Gm(b9)/Bb | B♭13(no5,11) | B♭13(no 5th) | pass |
| E11 | 48 52 58 62 66 69 | C E Bb D F# A | **C13#11** | GB README: C13(#11) (GB: D9(b13)/C) | C13(#11) | D9(b13)/C | C13♯11(no5), C13♭5(no11) | C13#11(no 5th), D9♭13/C, F#7♭5#9♭13/C | pass |
| E12 | 60 64 67 69 74 | C E G A D | **C6/9** | CL vocab 6/9 | C6/9 | C6/9 | C6/9, A7sus4/C, A7sus4(♯9)/B♯ | C6/9 | pass |
| L1 | 60 64 67 70 73 | C E G Bb C# | **C7♭9** | CL q14 | C7(b9) | C7(b9) | C7♭9, Edim7/C, Gdim7/C | C7♭9 | pass |
| L2 | 60 64 67 70 75 | C E G Bb Eb | **C7#9** | CL q16 | C7(#9) | C7(#9) | C7♯9 | C7#9 | pass |
| L3 | 60 64 66 70 | C E F# Bb | **C7♭5** | CL q12 | C7(#11) | C7(b5) | C7♭5, F♯7♭5/C, C9♯11(no5,9) | C7♭5, F#7♭5/C | pass |
| L4 | 60 64 68 70 | C E Ab Bb | **C7#5** | CL q13 | C7(#5) | Caug7(#5) | C7♯5, E(♭5)/C | C7#5, C7♭13(no 5th) | pass |
| S1 | 61 65 68 | C# F Ab | **D♭** | PC: Db (C# costs more) | C# | C# | D♭ | D♭ | pass |
| S2 | 66 70 73 | F# Bb C# | **F#** | PC: F# (tie with Gb; major keeps sharp) | F# | F# | F♯ | F# | pass |
| S3 | 63 66 70 | Eb F# Bb | **E♭m** | PC: Ebm (minor takes flat side) | Ebm | Ebm | E♭m | E♭m | pass |
| X1 | 53 56 60 63 | F Ab C Eb | **Fm7** | Chordio stored chordResults: Fmin7 · Ab6/F · Cmin(11,#5)/F | Fm7 | Fm7 | Fm7, A♭/F, A♭6/F | Fm7, A♭6/F | pass |
| X2 | 50 53 57 60 64 67 | D F A C E G | **Dm11** | Chordio min9(11) (top quality, 435 cells) | Dm11 | Dm11 | Dm11, Fmaj9/D | Dm11 | pass |
| X3 | 48 53 55 58 62 | C F G Bb D | **C9sus4** | Chordio 9sus4 (180 cells) | C9sus4 | Bb6/9/C | Gm7/C, B♭6(9)/C, B♭6/C | C9sus4 | pass |
| X4 | 48 53 58 62 69 | C F Bb D A | **B♭maj7/C** | Chordio cost: Bb (bass C = 9th over a 3rd → slash 1.0 + maj7 0.1 = 1.1) beats C13sus4 (1.4); PC B♭maj9/C; GB Bbmaj9/C | C13sus4 | Bbmaj9/C | B♭maj9/C, B♭maj7/C | C13sus4(no 5th) | FAIL |
| X5 | 48 52 55 59 62 69 | C E G B D A | **Cmaj13** | Chordio Maj7(13) (105 cells) | Cmaj13 | Cmaj13 | Am11/C, G6(9)/C, Cmaj13(no11) | Cmaj13, Am11/C | pass |
| X6 | 48 52 55 59 62 66 | C E G B D F# | **Cmaj9#11** | SG2/GB: maj9#11 | Cmaj9(#11) | Cmaj9(#11) | Em9/C, Gmaj13(no9)/C, D13(no5)/C | Cmaj9#11 | pass |
| X7 | 60 64 66 70 73 | C E F# Bb C# | **C7♭5♭9** | SG2 SeventhFlat5Flat9 | C7(b9,#11) | F#7(#11)/C | F♯7/C, C7(♭5,♭9), C7(♭9,♯11,no5) | C7♭5♭9 | pass |
| X8 | 60 64 66 71 | C E F# B | **Cmaj7♭5** | SG2 Major7Flat5 | Cmaj7(#11) | Cmaj7(b5) | Bsus4/C, Cmaj7♭5, Esus2/C | Cmaj7#11(no 5th) | FAIL |
| X9 | 60 64 68 71 | C E Ab B | **C+maj7** | SG2 AugmentedMajor7 | Cmaj7(#5) | E(b13)/C | E/C, Cmaj7♯5 | C+maj7 | pass |
| X10 | 60 63 67 74 | C Eb G D | **Cm(add9)** | SG2 MinorAdd9; PC m(add9) | Cm(add9) | Cmadd9 | Cm(add9) | Cm(add9) | pass |
| X11 | 60 62 67 70 | C D G Bb | **Gm/C** | PC Gm/C first; GB Gm/C; SG2 lists 7sus2 | Gm(add11)/C | Gm/C | Gm/C, C7sus2, Gm(add11)/C | C7sus2 | FAIL |
| X12 | 48 52 58 61 63 68 | C E Bb C# Eb Ab | **C7#5♭9#9** | CL q17 'Altered' {0,1,3,4,8,10} (named 7alt); Chordio stores 7(♯9, ♯5) | C7(b9,#9,#5) | C#m(maj13)/C | B♭m11♭5/C | C7#5♭9#9, C7♭9#9♭13(no 5th) | pass |
| X13 | 60 63 66 70 74 | C Eb F# Bb D | **Cm9♭5** | PC/SG2 half-dim 9 | Cm9b5 | Ebm(maj13)/C | Cm9♭5, Cm9♯11(no5), E♭m(maj7)/C | Cm9♭5, D7♭9#5/C, D7♭9♭13/C(no 5th) | pass |
| X14 | 36 48 52 55 | C C E G | **C** | PC SimplifyFormula: doublings ignored | C | C | C | C | pass |
| X15 | 36 55 64 70 | C G E Bb | **C7** | open voicing C G E Bb | C7 | C7 | C7 | C7 | pass |
| X16 | 53 60 64 67 | F C E G | **C/F** | Chordio bass penalty: 4th in bass over a 3rd = slash bass | G13sus4/F | C/F | C/F, Fmaj7sus2, Cadd11/F | Fmaj7sus2 | FAIL |
| X17 | 60 64 71 | C E B | **Cmaj7** | PC Omitted 5th | Cmaj7 | Cmaj7 | Cmaj7(no5) | Cmaj7(no 5th) | pass |
| X18 | 48 64 69 | C E A | **Am/C** | PC: Am/C (Inversion 4) before C6(no5) (Omitted 7) | C6 | Am/C | Am/C, C6(no5) | Am/C | pass |

**Vocabulary probes** (section 2): 20 more, chord types in the research we may lack. **13 pass, 7 fail.**

| # | Keys | Expected | Source | Piano Companion | Ours today | Ours |
|---|---|---|---|---|---|---|
| P1 | 60 64 66 | **C(♭5)** | PC id16 ⁻5; GB basic 'b5' | C(♭5) | — | FAIL |
| P2 | 60 63 66 71 | **C°(maj7)** | SG2 MinorMajor7Flat5 | B/C, Cm(maj7,♭5) | — | FAIL |
| P3 | 60 63 67 70 73 | **Cm7♭9** | PC 28; SG2 MinorSeventhFlat9 | E♭7/C, Cm7♭9 | — | FAIL |
| P4 | 60 64 67 69 70 | **C13** | PC 24 '7/6' prints 7(13); a 13 implies the 7th, its 9th optional | C7(13), Am7♭9/C | C13(no 9th), C7(add13) | pass |
| P5 | 60 63 67 70 74 78 | **Cm9#11** | PC 35 m11+ → m9(#11) | Cm9♯11 | D11♭9♭13/C(no 5th) | FAIL |
| P6 | 60 63 66 70 74 77 | **Cm11♭5** | Chordio/CL min11b5 | Cm11♭5 | Cm11♭5, D7#5♭9#9/C, D7♭9#9♭13/C(no 5th) | pass |
| P7 | 60 64 68 74 | **C+(add9)** | builder aug add9 | E7♯5/B♯ | C+(add9), E7#5/C | pass |
| P8 | 60 64 67 61 | **(none)** | GB option 'add b9'; PC C♯dim/C — not adopted: a ♭9 over a triad is a clash no lead sheet writes (CL isPlausible rule 3 rejects ♭9 without a 7th) | C♯dim/C, C♯m(maj7,♭5)/B♯ | — | pass |
| P9 | 60 64 67 71 74 77 | **Cmaj11** | PC 102 maj11 | Cmaj11 | Cmaj11, Dm13/C(no 5th) | pass |
| P10 | 60 64 67 70 74 77 | **C11** | PC 32 | C11, Dm11♯5/C | C11 | pass |
| P11 | 60 63 67 71 74 | **Cm(maj9)** | SG2 MinorMajor9 | — | Cm(maj9) | pass |
| P12 | 60 64 67 71 73 | **Em6/C** | SG2 MajorSeventhFlat9 — not adopted (CL rule 8 family); PC Em6/C (foreign bass) | Em6/C, C♯m7♭5/C | — | FAIL |
| P13 | 60 64 67 71 75 | **Em(maj7)/C** | SG2 MajorSeventhSharp9 — not adopted; PC Em(maj7)/C (foreign bass) | Em(maj7)/C | — | FAIL |
| P14 | 60 62 67 71 | **G/C** | PC: G/C first, Cmaj7sus2 second; SG2 Major7sus2 | G/C, Cmaj7sus2 | Cmaj7sus2 | FAIL |
| P15 | 60 65 67 71 | **Cmaj7sus4** | CL q40 | Cmaj7sus4 | Cmaj7sus4 | pass |
| P16 | 60 64 68 70 75 | **C7#5#9** | SG2 Augmented7Sharp9 | C7(♯5,♯9) | C7#5#9, C7#9♭13(no 5th), E+maj7#11/C | pass |
| P17 | 60 63 67 70 74 77 81 | **Cm13** | PC 37 | Cm13, F13/C | Cm13 | pass |
| P18 | 60 64 67 70 74 78 81 | **C13#11** | PC 38 | C13♯11, Am13♭9/C | C13#11, F#7alt/C, D11♭13/C | pass |
| P19 | 60 63 67 77 | **Cm(add11)** | PC 107 | Cm(add11), F7sus2/C | Cm(add11) | pass |
| P20 | 60 64 70 74 77 | **C11** | shell over major 3rd | C11(no5), Dm9♯5/C | C11(no 5th) | pass |

**Coverage over the research dictionaries** (`/tmp/claude-0/r61/cover.ts`), each chord in root position on C:

- Piano Companion's 89 listed chords (`piano-companion/data/chords.json`): **62 named** in root position. Missed: `(♭5)`,
  `5` (the widget's), `m7♯5`, `m(maj7,♭5)`, `m(maj7,♯5)`, `m9♯5`, `m7♭9`, `m7(♭5,♭9)`, `m7(♯5,♭9)`, `m11♯5`, `m11♭9`,
  `m9♯11`, `m9(♯5,♯11)`, `m7(♭9,♯11)`, the seven-tone `13`, `13♭5`, `13♯5`, `13♭9`, `13♯9`, `maj13` (reads `Dm13/C`),
  `m13♭5`, `m13♯5`, `m13♭9`, `13(♯5,♯11)`, `m13♯11`, `m13(♭5,♯11)`, `m13(♭9,♯11)`. Most are Piano Companion's
  generated "Alts" variants (THEORY_ENGINE.md §3.3) no chart writes; the ones worth having are in 2.2.
- Suggester 2's 58 types of 3+ tones (`suggester-2/data/chords.json`): **51 named**. Missed: `MinorMajor7Flat5`,
  `MinorSeventhFlat9`, `MajorSeventhFlat9`, `MinorMajorSeventhFlat9`, `MajorSeventhSharp9`, `Thirteenth` (7 tones),
  `Major13` (7 tones).

### 1.5 Tests to add

Into `src/shared/lib/music/chord-finder.test.ts`, one `it` per rule of 1.3, taking the rows above as data (the keys and
the expected first name), plus the alternatives cap (E11 offers no `F#7♭5#9♭13/C`). Fix the three stale `Maj`
assertions first. Fixtures from the research data, kept as numbers (facts, not content): ChordLab's pack voicings
(`chordlab/content/*.json` → `progressions[].chords[].midiNotes`, 28 chords) and Piano Companion's §B.7 table.

---

## 2. Vocabulary and spelling

### 2.1 Our vocabulary today

The table: 46 qualities in 5 families (`chord.ts:26-253`): `maj min dim aug sus2 sus4 five`; `six m6 s69 m69 add9
madd9 add11`; `maj7 m7 d7 hd o7 mM7 sus7 M7s11 M7s5`; `m9 maj9 n9 sus9 mM9 M9s5 hd9 m11 n11 maj11 m13 n13 maj13
sus13`; `b9 b9n13 s9 b5 s5 s11 b13 b9s5 alt`. The builder adds 127 more shapes by rule (sus2 sevenths, `7sus4♭9`,
`add#11`, `m7(add11)`, `7(add13)`, two- and three-alteration dominants, `m11♭5`, `+maj9#11`…).

### 2.2 What the research covers and we lack

| Quality | Formula | Who has it | Adopt? |
|---|---|---|---|
| Major ♭5 triad `C(♭5)` | 0 4 6 | Piano Companion id 16 (`(♭5)`), GarageBand basic chord 4 `b5` (`_shared/piano-theory-and-libraries/theory-engine/THEORY_RULES.md` §3) | **Yes**: a triad family member; P1 fails today |
| `C°(maj7)` | 0 3 6 11 | Suggester 2 #13 `MinorMajor7Flat5`, Piano Companion `m(maj7,♭5)` | **Yes**, written `°(maj7)` as our `°` family writes; P2 |
| `Cm7♭9` | 0 3 7 10 13 | Piano Companion 28, Suggester 2 #26 | **Yes**: the Phrygian iii7 and minor ii's colour; P3 |
| `Cm9#11` | 0 3 7 10 14 18 | Piano Companion 35 (`m11+`), Chordio `min9#11 → m9+11` | **Yes**: the Dorian #11 voicing; P5 reads `D11♭9♭13/C` today |
| `Cmaj7♭5` | 0 4 6 11 | Suggester 2 #12, Piano Companion `maj7♭5`, GarageBand | **Yes** (rule 4 of 1.3); X8 |
| Full `13` / `maj13` with the 11th | 0 4 7 10/11 14 17 21 | Piano Companion 36/103, ChordLab, GarageBand | **Yes** (rule 3); E4 |
| `7alt` as a name for any altered voicing | 0 1 3 4 8 10 | ChordLab q17 `Altered` | **No** as the first name: keep the explicit `C7#5♭9#9` (Chordio stores `7(♯9, ♯5)`); our `alt` stays the 7-tone table quality |
| `maj7♭9`, `maj7#9`, `m(maj7)♭9` | | Suggester 2 #27, #30, #28 only | **No**: no chart writes them; the foreign bass names them (`Em6/C`, P12-P13) |
| `add♭9` over a triad | 0 1 4 7 | GarageBand option `add b9` | **No**: ChordLab's isPlausible rule 3 rejects a ♭9 without a 7th; P8 stays unnamed |
| Augmented sixths `It+6 Fr+6 Gr+6` | 0 4 10 / 0 4 6 10 / 0 4 7 10 | Suggester 2 #55-57, roles (§5) | **As numerals only** (section 3.2): the keys are a C7(no5), C7♭5, C7; their name is their function |
| `5`, `4` dyads | | Suggester 2 #58-59 | `5` is the widget's already; `4` (a 4th) is an interval |

### 2.3 Symbol style: ours against the research

| Point | Ours | Research | Rule to keep or adopt |
|---|---|---|---|
| Major 7th | `maj7` (`chord.ts:78`), reads `Maj7 M7 Δ7 Δ` | Piano Companion International `maj7`, Jazz `Δ7`, French `7M`, Asian `M7` (§4.3); GarageBand preference `ma7` `j7` `maj7`; Suggester 2 `M7` | Keep `maj7`; fix the stale tests |
| Diminished, half-diminished | `°`, `°7`, `m7♭5` (reads `ø`, `dim`, `dim7`) | International `dim` `dim7` `m7♭5`; Jazz `°` `°7` `ø7`; Chordio `º` | Keep |
| Augmented | `+`, `7#5`, `+maj7` | International `+`, French `5+`, Asian `aug` | Keep |
| Two or more alterations | run together: `C7♭5♭9`, `C7#5#9`, `C9#11♭13` (`chord-parts.ts:354-355`) | Piano Companion: one tension bare after a digit (`C7♭9`), two or more in parentheses, sorted by degree, ♭ before ♮ before ♯ (`C7(♭5,♭9)`, THEORY_ENGINE.md §4.2 rules 3 and 5); ChordLab `C7(#9,#5)`; Chordio `7(♯9, ♯5)` | **Adopt**: two or more alterations in parentheses, comma-separated, by degree (`C7(♭5,♭9)`, `C7(#5,#9)`, `C13(♭9,#11)`); one stays bare (`C7♭9`, `C13#11`). The parser reads both |
| 6/9 over a bass | `writtenSymbol` (`chord.ts:336-339`) would print `C6/9/E` | Piano Companion `WithBass`: `6/9` becomes `6(9)` before a slash (§4.2 rule 7) | **Adopt** |
| A flat after a root | `printedSymbol` turns `b` into `♭` after a letter or before a digit (`chord-symbol.ts:30-31`) | GarageBand inserts a separator where `Ab9` could read `A b9` (`THEORY_RULES.md` §3) | Keep: we print ♭, so `A♭9` and `A♭♭9` cannot be misread |
| Omitted tones | carried as `leftOut`, not in the symbol | Piano Companion `C7(no5)`; Suggester 2 `(no1)` | Keep: the finder shows them beside the name |
| add2 vs add9 | by voicing: `Cadd2` within the octave, `Cadd9` past it (`chord-finder.ts:248-256`) | ChordLab, GarageBand, Piano Companion: `add9` always; Suggester 2 has `Add2` | Keep (C4); add `add2` → `add9` as one chord in the parser (it is, `chord.ts:61`) |
| Root spelling | `chordRootSpelling` (`chord.ts:304-314`) | Piano Companion `KeyFifths` (§B.1); GarageBand least signs (`THEORY_RULES.md` §1: Db, F#, Ab, Bb); ChordLab port all sharps (wrong) | Keep: agrees with Piano Companion on S1-S3 and E8 (`D♭maj9`, where the ChordLab port prints `C#maj9`) |

### 2.4 The finder names chords the parser cannot read

`readChordSymbol` (`chord-symbol.ts:98-105`) looks a suffix up in the 46-quality table only (`QUALITY_BY_SUFFIX`,
65-69), and `Chord` holds a `ChordQuality` (`chord.ts:262-267`). Of the 173 builder chords the finder can name, **124
cannot be read back** (`/tmp/claude-0/r61/rt.ts`), among them `C9#11`, `C13#11`, `Cmaj9#11`, `C7sus2`, `Cmaj7sus2`,
`Cm(add11)`, `Cm7(add11)`, `C7(add13)`, `C+(add9)`, `Cm11♭5`, `C7♭5♭9`, `C7#5#9`, `C7sus4♭9`. The score editor writes
the first reading it can read (`keys-played.ts:13-19`), so C9#11 played in Chord mode is written as a lesser reading or
not at all. Chordio's 135 quality spellings (`chordio/data/chord_dictionary_tables.json`, `quality_to_components`):
**57 read**; unread include `maj7b5`, `7sus2`, `mmaj7`, `o7`, `ma7`, `9#11`, `13#11`, `7b9#9`, `7add13`, `6add9`,
`madd11`, `m9+11`.

The fix is one implementation of a chord: the parser reads a suffix by the builder's grammar (triad · `6` · size and
7th · alterations · added tones · sus), so a `Chord` can hold any `ChordParts`, not only a table quality, and every
name the finder says round-trips. Test: every `CHORD_PARTS` symbol parses back to the same parts, and Chordio's 135
spellings and Suggester 2's reader aliases (`min`, `m7b5`, `hdim7`, `min7b5`, `Maj`, `mMaj`, `mM`, `minMaj`, `aug`,
`dim`, `7b5`; THEORY_ENGINE.md §10) read as their formulas.

---

## 3. Progressions and keys

### 3.1 Key detection

| Who | Method | Source |
|---|---|---|
| Ours, chords | `keysOfChords` (`key-of-chords.ts:215-238`): +2 per chord whose notes are all the key's, +1 if the tonic chord opens, +2 if it closes, +1 per applied dominant; ties to the key nearest C, then major | used by `widgets/progression-explorer/model/typed-progression.ts:35` |
| Ours, notes | `keyOfNotes` (`features/song-files/model/song-of-midi.ts:35-79`): Krumhansl–Kessler correlation over duration-weighted pitch classes, 24 keys | MIDI import without a key signature (`:199-205`) |
| Chordio | the same Krumhansl–Kessler profiles and Pearson correlation, drums (channel 10) ignored, minor returned as its relative major + flag | THEORY_ENGINE.md §7; `data/engine_tables.json` `keyProfiles` |
| GarageBand | (1) tonic progressions weighted: V7→I 9; V→I, I→IV, vii°→I, ♭II7→I, ii→V→I, vi→ii→V→I 8; iv→V→I 6; IV→iiø7→I 10; minor ii→V→i 8, V→i 4; (2) cadence progressions 8/4/2; (3) for undecided regions a weight per key: +duration for each chord wholly in the scale (natural minor), +10% if its root is the tonic, +10% more if first or last; parallel keys: the one whose tonic triad occurs wins; then fewer accidentals; (4) merge equal neighbours, the song's key = the most frequent centre | `_shared/piano-theory-and-libraries/theory-engine/THEORY_RULES.md` §5 |
| Suggester 2 | each scale scored by the share of the song's chords it contains (`matchingRatio`), "Best matches" and "All results" | THEORY_ENGINE.md §9 |

Plan:

1. **Move `keyOfNotes` into the kernel** (`shared/lib/music/key-of-notes.ts` with a colocated test): it is pure logic
   (CLAUDE.md, "pure logic is in `shared/lib`"), and MusicXML without a key, a recorded take and the Chord finder's trail
   can use it. Keep the drums out, as Chordio does (`song-of-midi.ts:175` already leaves them).
2. **`keysOfChords` takes durations where they are known** (a chart's chords have lengths): GarageBand's
   duration-weighted membership, and its parallel-key tie (the key whose tonic triad sounds) before "nearest C".
3. **Cadence weights instead of a flat +1 per applied dominant**: GarageBand's tonic-progression table (V7→I 9, ii→V→I
   8, iv→V→I 6, minor ii°→V→i 8). Test: Amazing Grace and the library's `jazz-cadence`, `andalusian`, `picardy` lines
   in every key find their written key.
4. Regions (GarageBand step 4) wait until a song shows modulation in the Player; not now.

### 3.2 Roman numerals

Ours (`numerals.ts`): upper case for a chord without a minor 3rd, lower case with one, the tail a symbol without its
`m` (`ii7`, `imaj7`), `°`, `°7`, `ø7`, `ø9` (`LOWER_TAILS` 77-92); ♭/♯ shifts; applied `/x` (`APPLIED` 62); a bass as
`/3 /5 /7` (64); a minor key's vi° and vii° on the raised degrees (243-249); borrowed flats from the major scale
(304). This matches Piano Companion's `RomanQuality` (THEORY_ENGINE.md §4.2 rule 8: `°`, `°7`, `ø7`, `+`, minor-type
lower case) and Suggester 2's (§2.3).

| Research rule | Ours | Plan |
|---|---|---|
| Suggester 2: lower case unless a major 3rd, so a sus chord is lower case (§2.3) | `Vsus4` upper | Keep ours: a sus V is a dominant (`harmony.ts:30-53`) |
| Suggester 2 `N` (Neapolitan), `It+6`, `Fr+6`, `Gr+6` (§2.3, §5) | `♭II`; `borrowedName` has `neapolitan` (`scale-chord.ts:186-189`); no augmented sixths | Read `N` as `♭II` (alias); add `It+6`, `Fr+6`, `Gr+6` as numerals on ♭VI (C7(no5), C7♭5, C7 over A♭ in C), function: predominant. Unlocks Suggester 2's three resolutions |
| Suggester 2 `subV7` (tritone substitute) | `♭II7` (`harmony.ts:38-39` reads it as a dominant) | Keep `♭II7`; read `subV7` as an alias |
| Suggester 2 tertiary `V/V/x` | one slash only (`APPLIED`, `numerals.ts:62`) | Not now: no library line needs it |
| Suggester 2 `I7` = the diatonic 7th (Jazz 251 `ii7 – V7 – I7`, §11) | `I7` = dominant 7th, as a chart writes it | When importing, a `DiatonicSeventh` step becomes the explicit quality (`Imaj7`, `ii7`, `V7`, `viiø7`) |
| GarageBand Riemann functions T, S, D, Tp, Sp… (`THEORY_RULES.md` §4) | home · away · tension (`harmony.ts:59-65`) | Keep ours (the learner's words) |
| Piano Companion: ♭III in C spelled D♯ (THEORY_ENGINE.md §8, a bug) | E♭ | Keep ours; fix theirs on import |

### 3.3 "What comes next"

Piano Companion's `ChordSuccessors` (THEORY_ENGINE.md §9; `chord-detection.ts:909-1041`): a 7×7 degree-to-degree weight
table (from I: IV 0.9, V 0.9, vi 0.7, ii 0.7, iii 0.4, vii 0.3; from V: I 1.0, vi 0.7 …), a root-motion bonus (4th
up 0.35, 2nd/6th up 0.2, same root −0.5), +0.05 a common tone, −0.12 a 7th chord, summed over the 24 keys where the
chord is diatonic. After C: F 5.00, Am 4.10, Dm 3.90, G 2.40. Ours: `randomProgression` walks a function graph
(`progression-random.ts`, `NEXT`: tonic → subdominant/tonic, subdominant → dominant/subdominant, dominant → tonic).
Adopt the weights as `nextChords(numeral, key)` in the kernel, to rank the Progressions page's next chord and weight
Randomize; its `successorExamples` (`piano-companion/data/progressions.json`) are the test's expected values.

### 3.4 Progression data worth importing

Our library: 54 entries (`entities/progression-library/content/library.ts`): pop 10, rock 4, jazz 11, blues 6,
classical 10, soul 1, gospel 5, modal 4, theory 3 (ids in the file's `LIBRARY`).

| Data | Path | Count | Overlap with ours | Licence | Plan |
|---|---|---|---|---|---|
| Suggester 2 classic progressions | `suggester-2/data/classic_progressions.json` | 28 in 7 groups, en + fr titles, step kinds `DiatonicTriad`, `DiatonicSeventh`, `Degree`, `DegreeOfMajor`, `Semitones` | 50s, pop-punk (axis), royal road, ii–V–I, I–vi–ii–V, 12-bar, jazz 251, tritone sub, iii–vi–ii–V, Andalusian, ragtime, circle, Pachelbel, Neapolitan, authentic, plagal, minor plagal | Proprietary app (RESOURCES_AND_LICENCES.md §1, strings "Proprietary text"); the numeral sequences are theory facts, the titles generic | Import as our own entries, en + ru written by us: **V–IV–I turnaround** (`V IV I`), **retrograde Andalusian** (`V ♭VI ♭VII i`), **Super Mario cadence** (`V ♭VI ♭VII I`), **backdoor A** (`ii7 ♭VII7 I`), **root-movement hotline** (`Imaj7 IVmaj7 viiø7 iii7 vi7 ii7 V7 Imaj7`), **jazz I–ii–iii–vi** (`Imaj7 ii7 iii7 vi7`); the three **augmented-sixth resolutions** once 3.2 adds the numerals |
| Piano Companion mode patterns | `piano-companion/data/progressions.json` → `patterns` | 45: Ionian 6, Dorian 6, Phrygian 6, Lydian 6, Mixolydian 7, Aeolian 8, Locrian 6 | 4 (`I V vi IV`, `I IV V I`, `I vi ii V`, `i VI III VII`); 41 new | Proprietary app (`RESOURCES_AND_LICENCES.md` row "PianoCompanion… Proprietary"); sequences are facts | Take two a mode for the `modal` style, in our notation with `mode`: Dorian `i IV v i`, `i ii IV i`; Mixolydian `I ♭VII IV IV`, `I IV I ♭VII I`; Lydian `I II V I`, `I vi II V`; Phrygian `i ♭II ♭III i`, `i iv i ♭II i`; Aeolian `i iv ♭VII i`, `i VI VII v` (minor-key flats as our library writes them). Skip the Locrian six (a diminished tonic is no loop a learner plays) and their spelling bug (D♯ for E♭) |
| Piano Companion successor model | same file → `successorModel`, `successorExamples` | 7×7 weights, 12 root motions, worked examples | none | as above; numbers are facts | Section 3.3 |
| ChordLab packs | `chordlab/content/beginner.json`, `intermediate.json` | 4 progressions (28 chords with MIDI voicings, beats), 16 voicings, 11 melodies | 2-5-1 and the pop loop exist | README "Licensing note": the packs and the "Just the Two of Us" arrangement are the developer's; rewrite before shipping | **Test fixtures only** (detection, 1.5), never content |
| Chordio chord packs | not in the repo: `chordio/data/content_stats.json` holds statistics only | 7 packs, 556 progressions, 6149 chords | — | PROPRIETARY (RESOURCES_LICENCES.md) | Do not import; use its quality frequencies (1.1) to order vocabulary work |
| Chordio ML vocabulary | `chordio/data/chord_dictionary_tables.json` | 67 qualities, 135 spellings → formulas | — | REF (RESOURCES_LICENCES.md) | Parser test fixture (2.4) |
| ChordLab quality table | `chordlab/reference/chord_qualities.json` = `_shared/app-ready-data/chord-qualities.json` | 42 qualities with intervals | ours names all 40 of 3+ tones in root position (`/tmp/claude-0/r61/cl42.ts`) | facts (app-ready-data README "Licences") | Fixture for the vocabulary test |
| Suggester 2 roles | `suggester-2/data/chord_roles.json` | 9 roles with build rules (`V/x` = root + P5, dominant 7th; `vii°/x` = root + M7, °7; `ii/x` = root + M2, m7) | ours: applied `/x` generic | as above | Rules confirm ours; its `ii/x` over a minor target building °7 is a decoded bug (§5), do not copy |

The GarageBand material (`garageband/README.md` Notes, `THEORY_RULES.md`) is a description of Apple's software,
whose licence restricts reverse engineering: use its ideas (the cadence weights, the parallel-key tie), not its tables
verbatim in shipped code without the owner's say. That is a licence question, the owner's.

---

## 4. Order of work

1. Fix the three stale `Maj` assertions in `chord-finder.test.ts`.
2. The parser reads by the builder's grammar; `Chord` holds parts (2.4). One implementation, used by the finder, the
   editor's Chord mode and the chord-sheet reader.
3. The foreign bass and its rank (1.3 rules 1, 2, 7), the full 13th (3), the five qualities (4, 2.2), the alternatives
   cap (5), with the case table as tests; the symbol style for two or more alterations and `6(9)` over a bass (2.3).
4. `keyOfNotes` into the kernel; `keysOfChords` with durations and cadence weights (3.1).
5. Numerals `N`, `subV7`, `It+6 Fr+6 Gr+6` (3.2); `nextChords` (3.3).
6. Library entries from 3.4, en and ru, each with its note.

Every screen this reaches (the Chord finder's name and chips, the held chord over the piano, the editor's Chord mode,
Progressions) is drawn on the canvas first, per the owner's 2026-11-13 ruling (`owner-way`, Loops and refactors); this
spec is the kernel's side.
