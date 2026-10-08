# ADR 0032 — A numeral carries its chord, a row leaves a big chord's root to the bass, and the tool names the walk

- **Status:** accepted · **Date:** 2026-10-09 · **Amends:** ADR 0020 (what a numeral is, how a chord grows), ADR 0022
  (a progression in the Player: its kept params)

## Context

The course's sheets write a degree as a Roman numeral and the chord's structure (`IIm7 – V7 – Imaj7`,
`Im7 IVm9 Vsus4`), let a 6th chord stand for a major 7th (C6, and Cm6 for a minor tonic), voice a 9th chord as four
notes over the bass, and walk the cadence up by semitones or tones and down by tones. A numeral held a triad and one
of five 7ths (ADR 0020), so none of that could be typed; a row put a 9th chord's five notes in one hand and kept the
hand off an inversion whose lowest key was the bass's; the page listed one walk.

## Decision

- **A numeral is a degree, a shift and a chord quality of the table** (`{ degree, shift, quality }`). A plain triad
  (major, minor, diminished, augmented) grows with the chord size as ADR 0020 says; any other chord is played as
  written.
- **It is read as a chord symbol with a degree for a root.** Upper case takes any spelling the table reads (`V7`,
  `IMaj7`, `I6`, `Vsus4`, the sheets' `IIm7` and `IVm9`); lower case is a chord with a minor 3rd, its suffix without
  the `m` (`ii7`, `i6`, `ii9`, `iMaj7`), a diminished one by its mark (`vii°`, `vii°7`, `iiø7`). A bare upper-case
  numeral stays a major chord, as the library's gospel 7–3–6 writes its III.
- **It is written one way:** lower case for the table's twelve chords with a minor 3rd, upper case with the table's
  suffix for the rest. `IIm7` typed is `ii7` under its chord. An augmented dominant is `III7#5`; `III+7` is still
  read.
- **A chord typed is its numeral whatever its quality** (`numeralOf`): `Dm7 G7 C6` is `ii7 V7 I6`.
- **A chord that grows takes the 9th the key has.** A triad that is not the key's own grows to its 7th chord (a major
  chord a dominant, a minor one a minor 7th), then to the 9th the key's scale has over it where the chord takes that
  tension (`availableTensions`): a minor key's V is `7♭9`, a major key's III and VII too, its II and VI a 9. ADR 0020
  gave every dominant a natural 9th.
- **A half-diminished chord's 9th is its natural one.** The key's own 9th over it is a ♭9 that is never played, so
  it stayed a 7th chord at 9ths; players give it the natural 9th (locrian ♮2), and so does the tensions table. In a
  progression it grows to `m9♭5`. A scale's own walk (`scaleChordAt`) still plays only the scale's notes, and a minor
  7th chord whose key has a ♭9 over it (a major key's iii) still leaves its 9th out.
- **The minor ii–V–i grows.** The owner read it at 7ths with its written `V7♭9` and asked why a 7th chord had a ♭9,
  then at 9ths why its ii was not a 9th. The line is plain triads (`ii° V i`): D° G Cm, then Dm7♭5 G7 Cm7 (the
  sheet's), then Dm9♭5 G7♭9 Cm9. A written chord is still played as written at every size, which is why the two ♭9
  resolutions keep theirs.
- **A row's hands** (`voiceLead`): a chord of five notes or more leaves its root to the bass, and the bass sits under
  the hand (the root between C3 and B3, an octave lower where the hand reaches down to it), so the hand takes the
  nearest inversion in every key.
- **The Progressions page names the walk:** a row for each of `KEY_WALKS`, and the key alone. `walk` is no longer a
  kept param of the progression Player; how it plays (pattern, figures, inversion, tempo, hands, mode) still is.

## Consequences

- Whatever the sheets write in the field is read; the library, the lessons and saved views read as before.
- A new chord in the table is a numeral at once: upper case with its suffix, or one more line in `LOWER_TAILS` if it
  has a minor 3rd (a test holds the twelve).
- A link to the progression Player that names no walk plays in its key alone, a lesson's too.
- The Player's own voicings stay the patterns' (ADR 0023): this ADR changes a row, not an arrangement.
