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
  Chords view. A seven-note scale's formula names its degrees by the key's names (`scaleDegreeNames` over
  `degreeNames`), its 7th a leading tone a half step under the tonic or a subtonic a whole step under it.
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
- **The chord table has 46 qualities**, each a Skill (ADR 0025): every type Musicca's chord finder lists (the power
  chord `C5`, Maj11, m13, Maj13 among them) and 13sus4. Any chord is built from its parts (`buildChord`): the triad,
  a suspension or the power chord's bare 5th (no larger size, no inversion), the size up to a 13th, the 7th, an added tone, and alterations. Only what the chord takes is offered, and a change that leaves a part out of reach takes the nearest in
  reach. A chord is named by the table where it has it, else by the stacks' rule (`stackSuffix`).
- **A chord's colour notes are one model** (`colour-notes.ts`, A33): `colourNotes(root, parts, key?)` groups every
  note over a chord as its **chord tones**, its **tensions** and the notes to **avoid**. Without a key a 7th chord
  takes the owner's tension table (`availableTensions`, the one source of tensions, its test's oracle), any other
  chord every note that is no minor 9th over a chord tone. In a key whose scale holds the chord's root, a non-dominant
  chord's tensions are the key's notes over it that are no minor 9th over a chord tone, those that are avoided, and
  notes outside the key are left out unless the chord has them: Dm7 as ii of C takes 9, 11 and 13, as vi of F avoids
  its ♭13, Em7 as iii of C avoids ♭9 and ♭13; a dominant keeps the table's altered tensions in any key. Added tones and
  alterations are colour notes: `withColour` adds or takes one off by finding the builder's chord (`CHORD_PARTS`)
  that holds exactly those notes, so the symbol is written by the usual rule (C9, C7♯11, Cadd9); a note no such
  chord holds is only heard. A scale stacks its own chords to 13ths (`scaleChordAt`), playing a 9th only where it is
  available, so C major's iii stays Em7.
- **Borrowed chords** (`borrowedChords`): a major key's ♭III, iv (the minor plagal), ♭VI and ♭VII from its parallel
  minor; a minor key's Picardy I and Neapolitan ♭II, the Neapolitan written by its letter (C♭ in B♭ minor). A minor
  key's IV and V are its melodic and harmonic minor's own, not borrowed (`borrowedName` names the three the books
  name).
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
  A from the 3rd, a dominant from its 7th, B the other end) in the left hand from D3; locked hands (George Shearing's: a close 4-note
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
