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
- **Twenty-one scale kinds in five families**: major and the three minors; the five church modes; the pentatonics and
  blues; the symmetric scales (whole-tone, half-whole and whole-half diminished, chromatic); and the others (harmonic
  major, Hungarian minor, bebop major and dominant). The whole-tone scale writes its 6th note as the 7th it sounds as
  (C D E F♯ G♯ B♭), the chromatic scale is the harmonic one (each letter twice but the tonic's and the dominant's),
  and bebop major's added note is the ♯5 (G♯ in C). A symmetric scale is written with no signature, a bebop dominant
  in its Mixolydian's; Hungarian minor's stacked 3rds are no chords, so only harmonic major of the new kinds has a
  Chords view. A seven-note scale names its degrees (`degreeNames`): tonic, supertonic, mediant, subdominant,
  dominant, submediant, and a leading note a half step under the tonic or a subtonic a whole step under it. A key's
  parallel is the other mode on its tonic, spelled by `tonicSpelling` where that mode would need more than seven
  sharps or flats (D♭ major's parallel is C♯ minor).
- **Fingering follows the printed books** (ABRSM's scale books, Vita Piano's tables): a right hand that starts on a
  black key starts on the finger a longer run gives it, A♭ major 3 4, B♭ major 4, C♯, F♯ and G♯ minor 3 4, E♭ minor
  3, B♭ minor 4. G♯ minor's left hand keeps its thumbs on B and E (3 2 1 3 2 1 4 3), where one printed table puts it
  on F♯. Harmonic major takes major's table, the chromatic scale one rule (3 on a black key, the thumb on a white,
  2 on a white key beside a white: the right hand's F and C, the left hand's E and B). Whole-tone, diminished, bebop,
  Hungarian minor, minor pentatonic and major blues have no standard fingering: they are fingered from the thumb and
  say so (`hasStandardFingering`). A scale runs from any start, fingered from the thumb or as the scale is taught,
  over any number of octaves. Where a finger crosses (`fingerCrossings`: the thumb passing under, a finger over it)
  the run marks the note, on the keys, in the fingering table and on the staff. An arpeggio's fingering is one rule, checked
  against Vita Piano's arpeggio lessons: the right hand's thumb on the first white tone up from the bottom, the left
  hand's on the bottom note where it is white, else on the octave's last white tone (C minor from E♭: on C); the
  right hand's 3rd note takes the 4th finger over a 4th from the note below or a major 6th from the thumb, so a major
  2nd inversion is 1 2 4 5 and C minor's 1 2 3 5; a note before the first thumb takes the finger its tone takes an
  octave up (A♭ major 4 1 2 4, C minor's 1st inversion 3 1 2 3).
- **The chord table has 38 qualities**, each a Skill (ADR 0025). Any chord is built from its parts (`buildChord`):
  the triad or a suspension, the size up to a 13th, the 7th, an added tone, and alterations, which are the available
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
- 0046 — Fingering as the printed books, eight new scale kinds, degree names, the parallel key, crossings marked
  (2026-10-28).
