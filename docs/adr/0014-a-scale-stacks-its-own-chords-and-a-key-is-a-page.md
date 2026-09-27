# ADR 0014 — A scale stacks its own chords, a chord is built from its parts, and a key is a page

- **Status:** accepted · **Date:** 2026-09-27 · **Amends:** ADR 0012's Scales reference (its Chords view) and Chords
  reference (its one pop-up of the table's qualities), ADR 0013's Player page (one screen over any source)

## Context

The roadmap's sub-project 4 (§2 row 4) gathered the owner's asks about scales: "more options for the scale specific
chords like ninth or eleventh chords for this scale and not just in chords"; the church modes and the major and minor
blues; a scale or its chords begun on any note with the thumb ("the D blues we can begin on D or on A") and in
inversions; the key's chords practised in the Player "with everything a song has there"; Hooktheory's key cheat sheet
and The Ultimate Piano's circle of fifths as a key page. On 2026-09-27 the owner added six screenshots of a chord
builder (a root, a quality, a structure to 13ths, a suspension, added tones, an inversion, "invalid combinations
filtered out automatically") and asked for the Chords reference to have "more possibilities". The app had eight scale
kinds, a scale's chords as table qualities from `diatonic.ts` (triads and 7ths only), a run fingered from its tonic, a
Player page built around a piece, and a Chords reference that could show only the table's 36 qualities.

## Decision

- **Thirteen scale kinds in three families** (`SCALE_FAMILIES`): major and minor (major, natural, harmonic, melodic),
  the modes (Dorian, Phrygian, Lydian, Mixolydian, Locrian) and pentatonic and blues (major and minor pentatonic,
  major and minor blues). The minor blues keeps the id `blues`, already saved in learners' progress; no store changes
  shape. A scale's root is spelled so its key has the fewest accidentals, and a mode is written in its parent major's
  key (`scaleKey`).
- **Start on any note, fingered two ways:** _From the thumb_ (computed: groups from the thumb, no later thumb on a black
  key, fewest groups) and _As the scale_ (each note keeps the finger the taught run gives it, continuing from where the
  taught thumbs fall). The choice is the seven-note scales'; the one-octave pentatonic and blues shapes are fingered as
  taught from their tonic and from the thumb elsewhere.
- **A run is timed music in ticks** (`scaleRun`), sounded by `runSounds` and written by `notate`: the Scales reference
  shows it on a grand staff under the keys, through `LazyScoreView`, which loads VexFlow only when a staff is first on
  screen, so Learn's chunk stays without it.
- **A scale's chords are stacks of thirds, not qualities:** `scaleChords(root, kind, notes)` stacks 3 to 7 notes from
  each degree, named by one rule (`stackSuffix`: the triad or 7th chord carrying its highest natural extension, then
  each altered one in order), with the table's quality attached only where the stack is one. Numerals take figures in
  inversions (`I⁶`, `ii⁶₅`); 9ths and up take none and show their bass as a slash. `diatonic.ts` is gone.
- **Three 9th qualities join the table** (`m(maj9)`, `+Maj9`, `m9♭5`: 36 qualities), and a chart of a scale's chords
  plays a 9th only where it is an available tension (`scaleChordAt`), so C major's iii stays Em7.
- **The walk is a Performance handed to the Player:** `walkChart` writes the seven chords up to the tonic's octave and
  back, arranged like any chart. `pages/player` keeps one screen (`PlayerLayout`) that a piece's page and the walk's
  page (`/play/walk`) fill, each with its own hook, and the Setup sheet is composed by its page from parts
  (`FigureRows`, `ChordSizeField`, `MelodySwitch`) rather than configured by a whole piece.
- **The key's common progressions are content:** I–IV–V–I, i–iv–V–i and i–VI–III–VII join the progressions
  (`COMMON_PROGRESSIONS`), opened in the Player in any key.
- **Keys is one reference page per key, the circle of fifths its chooser** (`/learn/keys?key=Eb`): 24 links on two
  rings, each with its signature's count, the key's seven chords' places marked and numbered; below, its signature
  engraved with its scale, its facts, its chords and the chords it borrows from its parallel scales (`borrowedChords`),
  the walk and progressions into the Player, and the songs written in it.
- **The Chords reference builds any chord from its parts** (`ChordParts`): Triad (with the suspensions), Chord size to
  13ths, the 7th (labelled by degree), a triad's Added tone and a 7th chord's Alterations, which are the available
  tensions of the owner's table. Only what the chord takes is offered; a change that leaves a part out of reach takes
  the nearest in reach; a ♭5 and a #11 are one key. The builder makes 124 chords, each once. A chord is named by the
  table where it has it, else by the stacks' rule (`chord-name.ts`, shared by both). Every chord's root is spelled by
  one rule over its intervals (sharp under a minor 3rd or minor 9th), which replaces the table's hand-set flags.
  Several alterations are chosen from one pop-up that checks several (`MultiDropdown`), the Choosing Rule's pop-up for
  several of many. The chord is written as a bar on a grand staff under the keys.
- **Decided against:** marking the keys outside a scale (the unmarked keys already say it); Start on in Chords view (a
  chord's start is its inversion); the walk on the reference's staff (towers of ledger lines; the Player shows it);
  generated common progressions for modes (a Key is major or minor).

## Consequences

- Sub-project 5's Reharmonise and chord detection name any stack with `stackSuffix` and any built chord with
  `buildChord`; its lessons link to a scale's Chords view, a key page or a built chord by URL.
- Sub-project 7's exercises reuse `scaleRun`, `walkChart`, the fingerings and the Player's layout; a trainer's source
  is one more hook filling `PlayerLayout`.
- A skill, a chord family's step or a piece opens the Chords reference on its quality's parts (`qualityParams`); the
  old `quality` param is not read.
- The Player's Setup sheet grows by composition: a new source composes its first page from the parts it has.
