# Spec: one fingering service, one way to draw it (A30)

## Problem
Fingering is computed in five places from four functions (`scaleFingering`/`runFingering`,
`arpeggioFingering`, `blockFingering`/`placedFingering`, `handFingers`) called directly by the Chords and
Scales explorers, the exercises and a lesson; the Chords tab, Key tab, Progressions, Intervals,
Accompaniment, the Chord finder, the Player and lesson examples show none. It is drawn four ways
(`FingerRow` circles, degree-and-note stacks on the keys, `HandDiagram`, Verovio's numbers) with three
crossing marks.

## Decision
1. **One entry point** in the kernel, `shared/lib/music/fingering/` (folder replaces `fingering.ts` and
   `chord-fingering.ts`; same fence: imports only `music`):
   ```ts
   type Fingered = { midi: Midi; hand: Hand; finger: Finger; crossing?: 'under' | 'over' | 'change' }
   fingerChord(keys: readonly Midi[], hand: Hand | 'both'): Fingered[]       // a block, any inversion/voicing
   fingerRun(keys: readonly Midi[], hand: Hand, kind?: ScaleKind, way?: Fingering): Fingered[] // scales
   fingerArpeggio(keys: readonly Midi[], hand: Hand): Fingered[]
   fingerPassage(notes: readonly { midi; startTick; durationTicks; staff }[], hands: StaffHands): Fingered[]
   fingerProgression(chords: readonly (readonly Midi[])[], hand: Hand): Fingered[][] // least movement
   ```
   `fingerChord` is the one block rule (today's `handFingers`, which the inversion drills already use, with
   `blockFingering`'s five-note split); `fingerPassage` segments a melody into positions (a run → `fingerRun`
   rules, a leap → a new position, a chord → `fingerChord`) for "Suggest fingering". The old exports become
   internal; every caller moves to these five.
2. **Rules checked** against `piano-data/method-books` and the printed scale books for: the 12 major and
   12 harmonic-minor scales two octaves both hands, the 24 triad arpeggios, the four triad inversions in C, F♯,
   B♭ for each hand; the table lives in `fingering/books.test.ts`.
3. **One look** (DESIGN.md "Fingering"):
   - on the on-screen piano, the finger in one circle on the key, right hand above the note name, left below;
     degrees only where the page is about degrees (a page-level `labels` choice: notes · degrees · fingers);
     never two rows of numbers;
   - a crossing or change marked once: the number in the accent colour with a small arc over it, in all four
     places (piano, `FingerRow` is removed, hand card, score: Verovio's `<fing>` with a `type` class coloured
     by CSS);
   - on the score, right hand above, left below (`place="above|below"` by staff hand), no collision at bar
     lines (Verovio's `fingeringPosition` plus our offset where it collides, checked in the C major two-octave
     render).
4. **Hand card** (`shared/ui/HandCard`, replacing `HandDiagram`): a drawn right and left hand palm-down
   (SVG, one line style, knuckles, curved fingers, nails), numbers on the fingertips; where it teaches, the
   hand drawn over the keys it plays. The art is made once (impeccable asset steps) and checked against
   Called to Play and Bobrova.
5. **One switch**, `fingering` (registry home `player`, mirrored by link rows on each explorer's Settings),
   shows or hides fingering everywhere at once; Scales keeps its "From the thumb · As the scale" choice as an
   option of the run, not a second switch.
6. **Suggested fingering** on a score or lesson example that prints none: computed by `fingerPassage`,
   drawn in a lighter weight, marked "Suggested" in the Player's legend; "Keep" in the editor writes it into
   the staff's text as ordinary fingering.

## Tests
- C major in first inversion gives the same fingers on Chords, the inversion drill and Progressions.
- C major two octaves, both hands: the piano, the score and the hand card agree (one fixture, three
  renders' numbers compared).
- Books table above; `fingerProgression` moves the fewest fingers for I–IV–V–I in C.

## ADR
0046 (the kernel: fingering), 0062 (the keys: labels), 0087 (engraving: fingering placement), DESIGN.md.
