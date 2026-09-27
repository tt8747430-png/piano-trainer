# Sub-project 4: scales and chords, deeper

- **Status:** designed 2026-09-27 by the building session on the owner's standing instruction ("make the best
  decisions and continue"; "no legacy leftovers, no workarounds, no backwards compatibility"). Every choice the roadmap
  left to this sub-project is settled here with its reason.
- **Builds on:** the roadmap (`2026-09-25-next-features-roadmap-design.md`: §2 row 4, §3.3, §3.8, §3.9, §9.4, §9.6,
  §10.1, §10.4, §10.8, §12), ADRs 0012 and 0013, and the app as built through sub-project 3.
- **Delivers:** the church modes and major blues as scale kinds; **Start on** any note of a scale, fingered **From
  the thumb** or **As the scale**; the scale's run as sheet music under the keyboard; the scale's chords stacked as
  triads, 7ths, 9ths, 11ths and 13ths, in inversions, named by rule; **Walk the chords**, in place and in the Player
  with a song's patterns; the key's common progressions opened in the Player in that key; a **Keys** reference: the
  circle of fifths and a page for each of the 24 keys; the **Chords reference as a chord builder** (added 2026-09-27
  on the owner's screenshots, §2.10).

## 1. What the owner asked (from the roadmap)

- "more options for the scale specific chords like ninth or eleventh chords for this scale and not just in chords";
  "more way to practices chords in a scale like in thumb positions where the scale or chords begins on thumb like the D
  blues we can begin on D or on A and so on also on other scales and inversions of the chords and scales".
- The church modes as scale kinds (a Key stays major or minor); major and minor blues.
- The key's chords practised in the Player "with everything a song has there: its patterns, Chord size, hands, tempo,
  Wait mode and the loop" (roadmap §3.8).
- Hooktheory's key cheat sheet and The Ultimate Piano's circle of fifths as the key page and the circle (§9.6, §10.8).

## 2. Decisions

### 2.1 Scale kinds

- **Thirteen kinds, in three families** (`SCALE_FAMILIES`, the Scale pop-up's groups): *Major and minor* — major,
  natural, harmonic and melodic minor; *Modes* — Dorian, Phrygian, Lydian, Mixolydian, Locrian; *Pentatonic and
  blues* — major and minor pentatonic, major blues, minor blues. Ionian is major and Aeolian natural minor, so they are
  not kinds of their own (the glossary already says so).
- **Ids:** `dorian`, `phrygian`, `lydian`, `mixolydian`, `locrian`, `majorBlues`; the minor blues keeps the id
  `blues`, because "the blues scale" is the minor one in musicians' usage and the id is already saved in learners'
  progress (skills, learned steps, the quiz's scales). The interface names the pair **Major blues** and **Minor blues**.
- **Only these two blues scales.** The nine-note "composite" blues is the union of the two, taught as mixing them; it
  is a lesson's subject (sub-project 5), not a kind. The jazz scales (melodic minor's modes, bebop, whole tone,
  diminished, augmented) wait for the lessons that teach them (roadmap §10.4).
- **A blue note is spelled like the blues' today:** of its two spellings the one with fewer accidentals, the flat on a
  tie. The minor blues' is ♭5 or ♯4; the major blues' is ♭3 or ♯2 (C D E♭ E G A; E F♯ G G♯ B C♯). The kernel gains
  the intervals `m2` and `A2`.
- **Minor-sounding kinds** (a minor 3rd: natural, harmonic, melodic, Dorian, Phrygian, Locrian, minor pentatonic,
  minor blues) are minor for `isMinorScale`.
- **The key a scale is written in** (`scaleKey(root, kind)`): a major kind's major key, a minor kind's minor key, and a
  mode its **parent** major key (D Dorian is written in C major's signature: no sharps or flats), the convention for
  modal music. The Scale view's sheet and the walk's Performance use it.
- **A scale's root is spelled so its key has the fewest accidentals** (`scaleRootSpelling`), today's lean on a tie.
  This reproduces every major and minor root the app spells today and spells the modes well (D♯ Phrygian in B's
  signature, not E♭ Phrygian in C♭'s; G♭ Lydian, not F♯ Lydian).
- **Relatives and parents** (`relatedScale`): major ↔ natural minor, harmonic and melodic minor → the relative major,
  major ↔ minor pentatonic, major ↔ minor blues (C major blues and A minor blues share their notes) are *relative*; a
  mode's *parent* is the major scale it is a mode of (D Dorian → C major). The facts line says "Relative" or "Mode
  of", and links to that scale.
- **Every scale kind has a Path step** (the Path's invariant, `path.test.ts`): the modes and major blues join level 1
  after today's scales. Sub-project 6 levels them.
- **The quiz asks them like any scale** (Build scale, My gaps): each is a Skill (`scale:dorian`). No saved store
  changes shape; the settings' quiz scales already keep any known kind.

### 2.2 Start on, and fingering

- **Start on** (Scale view): any degree of the scale (a pop-up of its notes, "E · 3"). The run goes from that note up
  an octave and back; the keys are marked from it, each with its degree from the tonic (the tonic stays yellow).
  Chords view does not take it: a chord's own start is its inversion (§2.4).
- **Fingering** is a choice of two (a segmented control): **From the thumb** — the thumb on the starting note (the
  right hand's thumb leads going up, the left hand's coming down, roadmap §3.3) — and **As the scale** — each note
  keeps the finger the scale gives it in a longer run (PWJ's modes exercise: E Phrygian with C major's fingers).
- **Absent, the fingering is the start's own:** starting on the tonic of a kind that has a taught fingering, As the
  scale (today's fingering); from any other note, or for a kind with none of its own, From the thumb. The URL leaves
  it out when it is the own one, as the Player leaves out a piece's own tempo.
- **The choice is the seven-note scales'**: major, the three minors (fingered as natural minor, as today) and the
  modes, which take their parent major's fingering (D Dorian with C major's thumbs on C and F). The pentatonic and
  blues tables are one-octave shapes (C blues' left hand starts on a stretch, D♭ pentatonic's right hand crosses once),
  so they cannot be carried from another note: those scales take their taught fingering from their tonic and From the
  thumb from anywhere else, and the minor pentatonic and major blues, which have none, From the thumb. "No standard
  fingering" goes: every scale has fingers.
- **Continuing fingers come from where the taught run puts the thumb:** a right-hand note takes one finger more for
  each degree it lies above the thumb before it, a left-hand note for each degree below the thumb after it (B♭ major's
  thumbs are on C and F, so between octaves B♭ is 4, as a two-octave B♭ major is fingered). From the tonic the taught
  one-octave run is kept exactly, ends included; from another note each note keeps its continuing finger, ends
  included (PWJ: E to E with C major's fingers, 3 1 2 3 4 1 2 3). The major pentatonic's table gains its octave's
  finger (the next finger in the hand's direction, a left-hand thumb crossed by 3), so its run has fingers on every
  key.
- **From the thumb is computed** (`thumbFingering`): the notes from the thumb split into groups, each starting on the
  thumb and fingered 1 2 3 (4), the last one reaching 5 at most. Of the possible splits the one wins that puts no later
  thumb on a black key, then has the fewest groups, then starts 3 before 4 before 2 (C major's 1 2 3 · 1 2 3 4 5). The
  left hand runs the same rule down from the top note and reads it back up. On every tonic of the white-key major
  scales it gives the taught fingering (F major's 1 2 3 4 · 1 2 3 4, B major's left hand 4 3 2 1 · 4 3 2 1), which a
  test holds.

### 2.3 The run in ticks, and the scale on the staff

- **The run is written in ticks** (`scaleRun` in `shared/lib/schedule`): the notes from the start up and back, in the
  practice rhythm, for the chosen hands, each with its finger, as timed music (`TimedMusic`: a key, 4/4 bars, notes).
  `runSounds(run, tempo)` turns it into sounds; `notate(run)` writes it. Domain time stays ticks; seconds are worked out
  only when it sounds (CODE_STYLE §8). The practice rhythms' eighths become ticks (a triplet eighth is 4).
- **Scale view shows the run on a grand staff** under the keyboard, in `scaleKey`'s signature, the hand not playing
  muted as in the Player, finger numbers when Fingers shows a hand. It is the Player's `ScoreView`, loaded lazily
  (`LazyScoreView` in the kit), so VexFlow stays out of Learn's chunk until a staff is on screen; while it loads, a
  quiet space of the staff's height.

### 2.4 The scale's chords

- **A chord of a scale is its notes stacked in thirds** from a degree (`scaleChords(root, kind, notes)`): 3 notes a
  triad, 4 a 7th, 5 a 9th, 6 an 11th, 7 a 13th, the full stack (a 13th holds all seven notes, as the textbooks define
  it). Every seven-note kind has them: major, the three minors, the five modes.
- **Named by one rule** (`stackSuffix`): the triad (`''`, `m`, `°`, `+`) or the 7th chord (`Maj7`, `m7`, `7`,
  `m7♭5`, `°7`, `m(maj7)`, `+Maj7`) carries the highest *natural* extension (`Maj9`, `m11`, `13`, `m(maj9)`,
  `m9♭5`, `+Maj13`), and every altered one follows in order (`m7♭9`, `m11♭9♭13`, `Maj9#11`, `Maj13#11`,
  `7♭9`). For a triad or a 7th, and for any stack that is one of the table's qualities, the rule gives that quality's
  own suffix (a test holds it for every stack of every kind). Symbols keep the table's signs: `♭`, `#`, `°`, `+`.
- **A chord of a scale is not a quality:** a 13th stack is not the table's `n13` (which leaves the 11th out, as played),
  and Phrygian's `m11♭9♭13` is no chord a chart names. So the kernel's `ScaleChord` carries its tones and its symbol,
  and the table quality only where the stack is one (`quality?`).
- **Numerals:** upper case over a major 3rd, lower over a minor; `°` a diminished triad or 7th, `ø` a half-diminished
  7th, `+` augmented (today's marks), a 9th and up taking its 7th chord's mark. **Inversions take figures:** a triad
  `I`, `I⁶`, `I⁶₄`; a 7th `ii⁷`, `ii⁶₅`, `ii⁴₃`, `ii⁴₂` (so a 7th chord's numeral now carries its ⁷ in root position
  too). 9ths and up have no figures (the tradition has none); their slash symbol says the bass.
- **Inversions:** root position and at most three (the bass the 3rd, 5th or 7th), as the Chords reference already
  limits them: `lastStackInversion(notes)`. An inversion raises the lowest tones an octave (`placeChord`'s rule), and
  its symbol is a slash chord (`C/E`, `Dm7/C`).
- **Holds** keeps its meaning: a chord holds a note when its tones do (any octave). A 13th holds every note of the
  scale, which is true.
- **The new kernel module replaces `diatonic.ts`** (`diatonicChords`, `DiatonicChord` go); `placeScaleChords` places
  `ScaleChord`s on their degree keys, in an inversion, with the label and the numeral the keys show.
- **Interval labels are one rule** (`degreeLabel(steps, semitones)`: the number from the steps, the sign from the
  semitones against the major or perfect one), so any stacked tone is labelled (`♭9`, `#11`, `♭11`) and `INTERVALS`
  stops spelling its labels by hand.

### 2.5 Three 9th chords join the table, and the 9ths a chart plays

- **`mM9` (`m(maj9)`), `M9s5` (`+Maj9`) and `hd9` (`m9♭5`, also written `ø9`)** join the 9ths family: common jazz
  chords (the tonic of melodic minor, its III, its vi) the Chords reference lacked, and the walk's 9ths need them. They
  are Skills like every quality (36 qualities, 49 skills).
- **A chart of the scale's chords plays a 9th only where the 9th is an available tension** (`scaleChordAt`): a major
  9th over any 7th chord, or a ♭9 or ♯9 over a dominant 7th. Elsewhere the chord stays its 7th (C major's iii stays
  Em7, its vii stays Bm7♭5), which is how the progressions already grow (`hd` stays `hd` at ninths) and what the
  owner's tensions table says (a ♭9 over a minor 7th is unacceptable, §10.3). 11ths and 13ths stay in the reference:
  a hand cannot play six or seven notes, and a chart's Chord size stops at 9ths.

### 2.6 Chords view

- **Chord size:** Triads · 7ths · 9ths · 11ths · 13ths, a pop-up button: five sizes whose Russian names run long
  (Ундецимаккорды, Терцдецимаккорды) are, by the Choosing Rule, a pop-up's, not a segmented control's. The URL's
  `chords` counts notes, 3–7; shrinking the size keeps the inversion the smaller chords have.
- **Inversion:** Root · 1st · 2nd · 3rd, a segmented control with only the inversions the size has.
- **Keys play:** Chords · Notes, as built. The keyboard spans every key the chords play.
- **Walk the chords, in place:** a card like the scale's: Block · Arpeggio, the tempo, and Play up and down (the one
  honey action), which walks the seven chords in the chosen size and inversion from the tonic to its octave and back,
  each on the keys as it sounds. It turns into Stop.
- **Practise in the Player:** a titled group of rows under it. *Walk the chords* opens the walk in the Player (§2.7);
  in a major or minor key the key's common progressions follow (§2.8), each opening its progression in the Player in
  this key. The Chord size carries over (triads, 7ths, and 9ths for anything larger).
- The grid of the key's chords stays, now with each chord's numeral and figure, and the label with its slash.

### 2.7 The walk in the Player

- **A route of its own:** `/play/walk?root=D&kind=dorian` with the Player's params (mode, tempo, speed training, hands,
  swing, loop) and the setup's (pattern, right and left hand, chord size). A kind without chords is not found, as an
  unknown piece is.
- **The walk:** the seven chords from the tonic up, the tonic, and back down (I ii iii IV V vi vii° I vii° vi V IV iii
  ii I: fifteen bars of 4/4, one chord a bar), as a Chart (`walkChart`) in `scaleKey`'s key, arranged like any chart:
  the patterns, the hands' figures, voice leading. Chord size Triads · 7ths · 9ths (§2.5). Its own tempo is 72, its
  own pattern whole notes (`block`), its own chord size triads.
- **The Player page serves both sources:** `pages/player` keeps one screen composition (`PlayerLayout`) that a piece's
  page (`PlayerPage`) and the walk's (`WalkPlayerPage`) both fill, each with its own hook (`usePlayer`,
  `useWalkPlayer`) turning its source into a Performance (ADR 0013: "the page only turns a piece into one").
- **The Setup sheet is composed, not configured:** `PlayerSetup` owns the sheet, its pages and the pattern and figure
  lists (their choices handed in once), and the page composes its first page from parts: a piece's key, the figure
  rows, its chord size, its melody switch and how it plays; the walk's root, the figure rows, its chord size and how
  it plays. (Today's sheet takes a whole `Piece` and decides for it; composition patterns: children over props.)
- **Close** goes back where the learner came from, or to the Scales reference's Chords view of that scale.
- A walk is not a piece: it records nothing as practised (My gaps reads pieces practised).

### 2.8 The key's common progressions

- **Content, not generated:** the roadmap's four major progressions are pieces (I–vi–IV–V `flow`, ii–V–I `twofive`,
  I–V–vi–IV `pop`) plus a new **I–IV–V–I** (`cadence`); the minor ones are ii°–V–i (`minor251`) plus new **i–iv–V–i**
  (`mcadence`) and **i–VI–III–VII** (`minorpop`). Each keeps its page on Practice, its note and its pattern, and opens
  in the Player in any key (`?key=`), which the Player already does. `COMMON_PROGRESSIONS` names them for a major and
  a minor key; a catalog test holds each to its mode.
- A mode, harmonic or melodic minor offers the walk only: the common progressions are written for a key, and a Key is
  major or minor (roadmap §3.3). A natural, harmonic or melodic minor scale offers the minor key's progressions.

### 2.9 Keys: the circle of fifths and the key pages

- **One reference page, Learn → Keys** (`/learn/keys?key=Eb`), whose URL names the key: a page for each of the 24 keys
  that does its job in place (CODE_STYLE §1), with the circle as its chooser. Learn's References gain the row.
- **The circle** (`CIRCLE_OF_FIFTHS` in the kernel: twelve places, each a major key outside and its relative minor
  inside): 24 links, one per key, each with its signature's count under its name ("3♭"). The chosen key's seven
  chords sit on seven places — its own, its neighbours' — and those places carry their numerals (I IV V outside, ii
  iii vi and vii° inside for a major key; i iv v inside, III VI VII outside and ii° inside for a minor one). Its place
  wears the tonic's wash and the six the scale's (the keys' own marks: the circle is the key's scale drawn round), the
  rest are soft ink. The chosen key's name is in the middle. A random key is a round button in the header (the random
  source injected, CODE_STYLE §8). The circle's cells are 44px targets (a phone's 358px circle has room), the whole
  circle at most 24rem wide.
- **Signature counts on the circle, not twelve small staves:** at a phone's size a staff inside a 44px cell cannot be
  read; the count and its sign can. The key's own signature is engraved once, below.
- **The key page, under the circle:** the key's name; its **signature on a staff** with its scale in it (the scale up
  an octave, `LazyScoreView`); **Signature** (its sharps or flats, named), **Notes**, **Relative** (a link: the page of
  the relative key) and **Modes** (the modes that share its notes, each a link to that scale in Scales); **Chords**
  (Triads · 7ths, Inversion, the seven chords to tap, then **Borrowed** chords, and Play, which walks them); **Practise**
  (the walk and the common progressions, into the Player in this key); **Songs in this key** (the songs, listings and
  studies written in it, each a link to its page; one line when there are none); links to its scale and to its
  chords in Scales.
- **Borrowed chords** are chords of a parallel scale on a degree (`borrowedChords(key, notes)`): a major key borrows
  iv, ♭III, ♭VI and ♭VII from its parallel minor; a minor key borrows V from harmonic minor, IV from melodic minor
  (Dorian's), I from major (the Picardy third) and ♭II from Phrygian (the Neapolitan). The standard modal-mixture
  chords of the pop, gospel and classical repertoire; each carries its numeral with its accidental.
- **A key in a URL** is `keyParam` (`Eb`, `C#m`), read back by `keyFromParam`; the validator spells any key as the
  circle does (`tonicSpelling`), so `D#m` reads as E♭ minor.
- **The keyboard** is pinned while the page scrolls, marking the key's scale (the tonic yellow), and every chord that
  plays goes down on it.

### 2.10 The Chords reference builds any chord

- **The owner's ask (2026-09-27, with six screenshots of a chord builder):** "improve the chords and scales page… the
  scales chords should have more possibilities". The screenshots build a chord from a root, an accidental, a quality
  (Major · Minor · Augmented · Diminished), a structure (Triads · 7ths · 9ths · 11ths · 13ths), a suspension (None ·
  sus2 · sus4), added tones (add2 · add4 · add6 · add9 · add11 · add13) and an inversion, "invalid combinations
  filtered out automatically", over a staff, a keyboard and the chord's name.
- **The table's one pop-up gives way to the chord's parts** (`ChordParts`): **Triad** (Major · Minor · Diminished ·
  Augmented · Suspended 2nd · Suspended 4th: a suspension is a triad, as the trainers group it, so no "minor sus4" can be
  asked for); **Chord size** (Triad · 7th · 9th · 11th · 13th); **7th** (♭7 · 7, and 𝄫7 over a diminished triad as a
  7th chord: a segmented control labelled by degree, as the keys are, each named "Minor 7th" and so on for a screen
  reader); **Added tone** for a triad (6 · 6/9 · add2 · add4 · add9 · add11: add2 and add4 lie inside the octave, add9
  and add11 above it, which the keys and the staff show); **Alterations** for a 7th chord with a major 3rd (♭5 · ♭9 ·
  #9 · #11 · ♭13), a pop-up button whose list checks several: the Choosing Rule's pop-up for several of many
  (`MultiDropdown`), not a grid of chips. Inversion and Hands stay. The root pop-up already spells each root for the
  chord, so there is no accidental choice.
- **Only what the chord takes is offered** (never a disabled choice, never a message): a suspension stops where its own
  tone would stack again (sus2 at 7ths; sus4 skips the 11th, its 4th); the diminished triad stops at 11ths and takes
  its 𝄫7 only as a 7th chord; the augmented stops at 9ths; the added tones by triad (all for major and minor, 6 and add9
  for sus4, none for the rest); the alterations are the available tensions of the owner's table (roadmap §10.3): all on
  a dominant but ♭13 over a raised 5th (it is that 5th), #11 on a major 7th, none on a minor chord (its ♭9 and ♭13 are
  the table's "unacceptable"). **A ♭5 and a #11 are one key:** choosing one turns the other off. A change that leaves a
  part out of reach takes the nearest in reach: the largest size below, the default 7th, no added tone or alteration,
  the last inversion the chord has.
- **What a size stacks:** a 7th chord its 7th; a 9th the 9th too; an 11th the 11th; a 13th the 13th, **the 11th left
  out over a major 3rd** (it clashes with the 3rd a ♭9 above: C13 is C E G B♭ D A, as chord dictionaries and the
  table's `13` have it; a minor 13th keeps all seven notes). An alteration takes its natural tone's place, or adds its
  tone above the size (C7#11 and C7♭13 have no 9th).
- **Named by the table where it has the chord** (its suffix, its name under the symbol, and every way it is written),
  **else by rule:** a triad's suffix with its added tone (`6`, `m6/9`, `6sus4`, `add9`, `m(add9)`, `sus4(add9)`); a 7th
  chord's name around its highest natural number, from the tables the stacks use (§2.4; `m11`, `13sus4`, `m(maj11)`,
  `Maj13`), then each alteration in order (`9#11`, `13♭9`, `7♭5♭9`). Every table quality is built by some parts and
  named back as the table names it (a test holds all 36), so nothing the reference showed is lost; the builder makes
  124 chords, each once (where two parts build one chord, a 7th with a ♭9 and a 9th with its 9th lowered, both name it
  `7♭9`).
- **One root-spelling rule for every chord:** a root on C♯/D♭ or G♯/A♭ is named sharp when the chord has a minor 3rd
  or a minor 9th. It reproduces the table's hand-set flags on all 36 qualities, and the flags go.
- **The chord on a staff:** under the keys, a bar of the chord as a whole note on the grand staff (the left hand's
  root on the bass staff) with no key signature, so every accidental stands on its note; the Player's `ScoreView`,
  loaded lazily as in Scale view (`LazyScoreView`). The keys stay the teacher; the staff shows how the chord is written.
- **The URL names the parts:** `triad`, `size` (5, 7, 9, 11, 13: the highest number), `seventh` (`minor`, `major`,
  `diminished`), `added`, `alter` (the alterations as a symbol writes them, `b9s11`), with `root`, `inversion` and
  `hands`. A skill's, a chord family's and a piece's links open their quality's parts (`qualityParams`). The old
  `quality` param is not read (no backwards compatibility).
- **Not taken from the screenshots:** the separate accidental pop-up (the root list spells the root), the paragraph
  explaining the builder (Product Principle 3), the grid of add-tone chips (the Choosing Rule), "add6" and "add13" as
  names (a 6th chord is `6`; a 13th is a size), and a name like "C Major Triad sus4" (a chord's name is its symbol and,
  where the table has one, the table's name).

### 2.11 Decided against

- **Mark other keys** (The Ultimate Piano's learn view, roadmap §12): not for this app. The keys outside a scale are the
  unmarked ones; a second mark on them would say nothing new and spend a colour.
- **Start on in Chords view:** a chord's start is its inversion; walking from another degree is sub-project 7's
  exercise.
- **The walk on a staff in the reference:** the Player shows it as sheet music; in the reference an 11th or 13th stack
  in the treble clef is a tower of ledger lines, and the keyboard shows it better.
- **Generated common progressions for modes:** see §2.8.

## 3. Architecture

| Layer | New or changed |
| --- | --- |
| `shared/lib/music` | `scale.ts` (the kinds, families, blue notes, `scaleKey`, `relatedScale`, the new spelling, `spellInKey` moved here so `key.ts` needs no scale); `interval.ts` (`degreeLabel`, `labelled`, `m2`, `A2`); `fingering.ts` (`scaleFingering` from any start as the scale, `thumbFingering`, `fingeringsOf`, `ownFingering`); `scale-chord.ts` (new: `scaleChords`, `ScaleChord`, `stackSuffix`, `scaleChordSymbol`, `romanFigure`, `lastStackInversion`, `scaleChordAt`, `borrowedChords`); `circle.ts` (new: `CIRCLE_OF_FIFTHS`, `circleFunctions`); `key.ts` (`keyParam`, `keyFromParam`, `signatureNotes`, `parallelKey`); `place.ts` (`placeScale` from a start, `placeScaleChords` over `ScaleChord`s in an inversion); `chord.ts` (three qualities); `diatonic.ts` removed |
| `shared/lib/music` (the builder) | `chord-parts.ts` (new: `ChordParts`, `buildChord`, `fitParts`, `withAlterations`, the offers, `partsOf`, `qualityParams`, `builtRootSpelling`, the URL params), `chord-name.ts` (new: the triad and 7th-chord naming tables, shared by the stacks and the builder), `chord.ts` (one root-spelling rule over intervals, `qualityWithIntervals`), `place.ts` (`placeChord` over any tones, one `lastInversion`) |
| `shared/lib/schedule` | `scaleRun` in ticks with fingers, `runSounds`, `walkSounds`, `chordBar`; `placedChordSounds` goes |
| `shared/ui` | `ChordButton` (a chord's symbol over its numeral, pressed while it plays, ringed when it holds the note), `LazyScoreView`, `MultiDropdown`; `score/size.ts` (the staff's height, shared) |
| `widgets/chord-explorer` | the builder: `ChordBuilder`, `ChordSheet`, `viewChord`, `changedView` |
| `entities/piece` | three progression pieces; `COMMON_PROGRESSIONS`; `piecesInKey` |
| `entities/path` | the six new scale steps |
| `features/practice` | `walkChart`, `arrangeWalk` |
| `widgets/scale-explorer` | Start on, Fingering, the sheet, the sizes and inversions, the walk card, the Practise rows |
| `widgets/key-explorer` (new) | `KeyView`, the circle, the key's facts, chords, borrowed chords, progressions, songs |
| `widgets/player-setup` | composed: `PlayerSetup`, `FigureRows`, `SetupField`s |
| `pages/player` | `PlayerLayout`, `WalkPlayerPage`, `useWalkPlayer`, `walk-search.ts` |
| `pages/keys` (new) | `KeysPage` |
| `app` | `/learn/keys`, `/play/walk`, their validators and defaults |

## 4. URLs

| Route | Params (default) |
| --- | --- |
| `/learn/scales` | `root` (C), `kind` (major), `show` (scale), `start` (1), `fingering` (the start's own), `fingers` (none), `rhythm` (even), `tempo` (80), `hands` (rh), `chords` (3), `inversion` (0), `keysPlay` (chords), `arpeggio` (false), `step` |
| `/learn/keys` | `key` (C), `chords` (3), `inversion` (0) |
| `/learn/chords` | `root` (C), `triad` (maj), `size` (5), `seventh` (minor), `added` (none), `alter` (none), `inversion` (0), `hands` (rh) |
| `/play/walk` | `root` (C), `kind` (major), the Player's `mode` `tempo` `speedTraining` `hands` `swing` `loop`, and `pattern` `rh` `lh` `chordSize` (the walk's own when absent) |

An invalid value takes its default; `start` is 1 to the scale's length; `inversion` 0 to `lastStackInversion`; a
Keys `key` is spelled as the circle spells it.

## 5. Saved state

No persisted store changes shape. The new scale kinds are valid wherever a kind is saved (the quiz's scales, answers
under `scale:<kind>`, learned steps). The new qualities are valid skills.

## 6. Copy

Every new string in English and Russian (`learn`, `music`, `player`, `practice` namespaces). New words: Start on
(«Начать с»), From the thumb («От первого пальца»), As the scale («Как в гамме»), Walk the chords («Аккорды по
ступеням»), Borrowed («Заимствованные»), Keys («Тональности»), Mode of («Лад от»), the modes (дорийский, фригийский,
лидийский, миксолидийский, локрийский), Major and Minor blues (мажорный и минорный блюз). Lessons are not written
here: the reference's lines name and do not explain.

## 7. Testing

- The kernel test-first: every kind's notes and spelling (the modes on all twelve roots against their parent's
  notes), `scaleRootSpelling` equal to today's for major and minor, the fingering tables equal to today's one-octave
  runs, From the thumb against the taught white-key majors, every stack of every seven-note kind named (an oracle of
  C's and A harmonic and melodic minor's), each table quality's suffix reproduced by the rule, figures, inversions,
  borrowed chords, the circle's functions for a major and a minor key, key params.
- `scaleRun` and `walkChart` in ticks; the walk arranged at each chord size.
- The builder: every table quality built back from its parts and named as the table names it; an oracle of rule names
  (triads with added tones, suspended and extended 7th chords, alterations); what each triad and size offers; fitting
  parts; a ♭5 and a #11 never together; the root-spelling rule; the URL params; the chord on a staff.
- Screens through `renderApp`: the Scales page (Start on, Fingering, the sheet engraved, 9ths to 13ths, inversions,
  the walk sounding, the Practise rows' links), the Chords page (the parts through the URL, each choice sounding, the
  7th and alterations only where the chord takes them, a built chord named by rule, the staff), the Keys page (choosing on the circle, the facts, chords and borrowed
  chords sounding, rows' links, the empty line), the walk in the Player (plays, Setup changes the chord size and the
  pattern, Close), the Player's piece Setup after the refactor.

## 8. Records updated when it ships

ADR 0014 (a scale's chords are stacks named by rule; the walk is a Performance the Player is handed; a key is a page
with the circle as its chooser; the Chords reference builds any chord from its parts); `DESIGN.md` (the circle; the Chords view's sizes and figures; the Scale view's
sheet; the Chords reference's parts and its staff); the glossary (Start on, Fingering, Scale chord, Walk the chords,
Borrowed chord, Circle of fifths, Parent scale, Figures, the Keys reference, Chord parts, Triad, Added tone,
Alteration); `CLAUDE.md`'s architecture; `docs/CODE_STYLE.md` §8 (the scale's chords, a built chord);
`PRODUCT.md`'s screens; the roadmap's status (sub-project 4 built), after which this spec and its plan are removed.
