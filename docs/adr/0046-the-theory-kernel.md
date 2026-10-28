# ADR 0046 — The theory kernel: spelled notes, chords from their parts, two hands, numerals in any key

- **Status:** accepted · **Date:** 2026-09-24 · consolidated 2026-10-27

## Context

Every screen that names, spells or places a note rests on `shared/lib/music`. The owner's sources set what it must
know: the owner's chord table and reharmonisation table, a chord builder's screenshots ("invalid combinations
filtered out automatically"), Vasily Gorshkov's course sheets (9th chords, 3-5-7-9 and 7-9-3-5, degrees written as
`IIm7 – V7 – Imaj7`), the stein_way 2-5-1 course and the Chord Matrix. A research round on how two hands hold a big
chord read Open Music Theory, Berklee, Levine, Dubovsky et al. and the course: a stack of thirds is a spelling, not
something to play, and the root goes to the left hand.

## Decision

- **Spelling comes from letter steps and semitones**, never a name table: so E♭ harmonic minor has C♭ and C°7 has
  B𝄫. A scale's root is spelled so its key has the fewest accidentals, a mode in its parent major's key. A key's tonic
  is spelled by its simplest signature (`tonicSpelling`): B not C♭, D♭ not C♯; at six, F♯ major and E♭ minor. A chord's
  root is spelled by one rule over its intervals (sharp under a minor 3rd or a minor 9th). A tool's roots are spelled
  by letters, then named plainly (F♭ is written E). A printed chord symbol shows ♯ and ♭ (`printedSymbol`); what is
  stored, typed, parsed or in a URL stays ASCII.
- **Thirteen scale kinds in three families**: major and the three minors; the five church modes; the pentatonics and
  blues. A scale runs from any start, fingered from the thumb or as the scale is taught, over any number of octaves;
  an arpeggio's fingering is one rule (the thumb on the first white tone each octave).
- **The chord table has 46 qualities**, each a Skill (ADR 0025): every type Musicca's chord finder lists (the power
  chord `C5`, Maj11, m13, Maj13 among them) and 13sus4. Any chord is built from its parts (`buildChord`): the triad,
  a suspension or the power chord's bare 5th (no larger size, no inversion), the size up to a 13th, the 7th, an added tone, and alterations, which are the available
  tensions. Only what the chord takes is offered, and a change that leaves a part out of reach takes the nearest in
  reach. A chord is named by the table where it has it, else by the stacks' rule (`stackSuffix`).
- **Available tensions have one source** (`tensions.ts`), the owner's table its test's oracle. A scale stacks its own
  chords to 13ths (`scaleChordAt`), playing a 9th only where it is available, so C major's iii stays Em7.
- **From five notes a chord takes two hands** (`placeChord` with both hands): the root, and from six notes the 5th
  over it, in the left; the rest close inside an octave in the right; the left takes the 7th as well where the right
  would hold more than five keys. Every tone stays on the keys. The root stays in the bass, so a big chord is not
  inverted: its right hand starts from the 3rd or from the 7th (`chordInversions`). One hand still spells a chord
  whole, for the trainers and the lessons. A row of chords (`voiceLead`) holds a big chord close the same way, its
  root to a one-note bass under the hand.
- **A chord held as a block is fingered by one rule** (`handFingers`, `blockFingering`): 1 and 5 on the outer keys,
  the middle finger 2 where a 4th opens towards the 5th finger, else 3 (the books' major triad RH 135 · 125 · 135,
  LH 531 · 531 · 521; sus4 RH 135, sus2 RH 125); four keys 1235 and 5321, the 4th finger on a 2nd at the 5th
  finger's end, 345 on two 2nds there. A lone left-hand key is the 5th finger's as a bass, the thumb's within an
  octave of the right hand (`placedFingering`). The inversions exercise plays each inversion in both hands so.
- **Voicings** (`voiceChord`, `voicingBar`): close; drop 2 and drop 3 of a close 4-note chord in any inversion, the
  dropped voice in the left hand; a shell (root, 3rd, 7th) and the rootless types A and B (3rd and 7th, the chord's
  9th or the natural one, its altered 5th or 13th or, on a dominant with a natural 9th, the 13th added, else the 5th;
  A from the 3rd, a dominant from its 7th, B the other end) in the left hand from D3; locked hands (a close 4-note
  chord from middle C, its top doubled an octave down); So What (three 4ths and a major 3rd from the 9th, only over
  Dorian tones with a perfect 5th and no major 3rd). A voicing a chord cannot take says why (`fourNotes`, `noThird`,
  `noSeventh`, `notDorian`).
- **A numeral is a degree, a shift and a quality of the table**, read as a chord symbol with a degree for its root:
  upper case takes any spelling (`V7`, `IMaj7`, `IIm7`), lower case is a chord with a minor 3rd (`ii7`, `iiø7`,
  `vii°7`). It is written back one way. A flat counts from the major scale in either mode (A minor's ♭VI is F). A plain
  triad grows with the chord size to the key's own chord; a triad not the key's grows to its 7th chord, then to the
  9th the key has over it; a half-diminished chord's 9th is its natural one (`m9♭5`). A numeral may be applied
  (`V/ii`, `ii°/vi`), read in the key on that degree. A chord typed is its numeral, whatever its quality.
- **Naming what is played** (`nameChords`): every chord the builder makes, on each pitch class played as its root,
  in any inversion over its bass; a 7th chord or larger may leave out its perfect 5th, as hands do. Two notes are an
  interval, a perfect 5th also a power chord (`C5`). A reading says its voicing (close, open, drop 2, a shell, 4ths)
  and a dominant with two altered tensions is written `C7alt`.
- **The tools' rules:** the chords that hold a melody note are the owner's table as roles (`chordsHolding`); passing
  chords are rules from the target's root in The Ultimate Piano's six categories (`passingChords`); the keys a line of
  chords is in are scored from the chords alone (`keysOfChords`), and each chord read there (`readInKey`), an
  applied dominant by the chord it leads to.
- **Transposition** moves a key the short way, −5 to +6 semitones (`transposition`), into the key's simplest spelling
  (`transposedKey`). **Simplify** makes a chord its plain triad on its root (`simplifyChord`): minor where it has a
  minor 3rd and no major 3rd, major otherwise.

## Consequences

A new chord in the table is a numeral, a Skill and a trainer's chord at once. Left for the owner: whether a dominant
11th keeps its major 3rd under the 11th as the builder stacks it (players leave it out: C9sus4), and whether Scales'
Chords view should hold its big chords in two hands too.

## History

- 0014 — A scale stacks its own chords, a chord is built from its parts (2026-09-27). Its Key page is ADR 0052's.
- 0017, 0019 — One source of tensions; the tools' naming, reharmonising and passing chords (2026-09-29).
- 0020, 0032, 0040 — Numerals in any key; a numeral carries its chord; applied numerals (2026-09-29 to 10-13).
- 0035 — A chord of five notes takes two hands (2026-10-09), from the research note on chord hands, deleted.
- 0046 — The table writes m(add9) and 13♭9 (2026-10-14).
- r14 — The power chord, Maj11, m13, Maj13, 13sus4; block fingering by rule; eight voicings (2026-10-28), from
  Musicca's chord finder, Vita Piano's chord lessons and piano.org's voicing pages.
