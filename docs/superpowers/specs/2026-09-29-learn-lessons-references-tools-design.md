# Sub-project 5: Learn — lessons, references, tools

- **Status:** designed 2026-09-29 by the building session on the owner's standing instruction ("continue and
  implement the next thing in the next features spec … use all the best practices and skills … no legacy leftovers,
  no workarounds, no hacks, no backwards compatibility … look if the previous changes dont affect the next features
  plan"). Every choice the roadmap left to this sub-project is settled here with its reason.
- **Builds on:** the roadmap (`2026-09-25-next-features-roadmap-design.md`: §2 row 5, §3.2, §3.4, §3.8, §4.3, §4.4,
  §9.1, §9.5, §9.7–§9.9, §10.1–§10.3, §10.7, §10.9, §12), ADRs 0012–0016, and the app as built through sub-project 4,
  the chromatic walk and the recording.
- **Delivers, in four parts** (§2), each with its own plan, build and commit: **5.1** the references Intervals and
  Available tensions, and a staff that shows one clef; **5.2** lessons as worksheets (examples of every kind that play
  in place, a quiz answered on the keys, links into the references), the lesson list by module with Level and
  Category pop-ups, and the Fundamentals module; **5.3** the tools Chord finder, Reharmonise, Passing chords and
  Progressions (with the Progressions Player source); **5.4** the Accompaniment and Gospel modules' lessons.

## 1. What changed since the roadmap, and what it changes here

The roadmap's row 5 was written before sub-project 4, the chromatic walk (ADR 0015), the recording (ADR 0016) and
the Named notes switch were built. Each was read for what it changes in this sub-project:

| Since the roadmap                                                                                                   | What it changes here                                                                                                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **The Chords reference builds any chord and writes every way it is written** (ADR 0014: "Written: C7 · Cx")         | The roadmap's **Chord symbols** reference is not built: it would list what the Chords reference already chooses and writes, which is what the owner disliked in Symbols (§1 item 9). Reading symbols is the lesson *How to read chord symbols*, which stays (in Fundamentals). |
| **The builder makes 124 chords, each once, named by one rule** (`buildChord`, `chord-name.ts`)                       | The **Chord finder** names what is played by matching the builder's chords, so it names exactly the chords the app can build, and the name it gives opens the Chords reference on those parts (ADR 0014's consequence).                                                         |
| **Tension rules live in two places** (`alterationsOf` in the builder, `ninthAvailable` in `scaleChordAt`)            | A kernel module `tensions.ts` becomes the one source of available tensions (§3.2). `scaleChordAt` asks it; the builder's alterations are tested against it (every alteration but the ♭5, which alters the chord, is an available tension of it).                           |
| **The chromatic walk is a chart handed to the Player as a source** (ADR 0015: `/play/chromatic`, a hook filling `PlayerLayout`, a composed Setup) | The Progressions tool's **Practise in the Player** is one more source of the same shape (`/play/progression`), not a Piece: a learner's progression in any key, grown with the Chord size.                                                                             |
| **A progression may be written in sections** (ADR 0015)                                                              | Nothing: a typed or library progression is one line, a chord a bar, four bars a line.                                                                                                                                                                                    |
| **A piece may carry a recording** (ADR 0016)                                                                         | Nothing: a generated source has no recording, so its Setup shows no Recording switch (as the walks).                                                                                                                                                                    |
| **Named notes** on the Player's staff                                                                               | Nothing: a staff outside the Player keeps plain heads. A reading lesson asks the learner to read the note, so it must not print its name in it.                                                                                                                          |
| **The keyboard's `selected` face** (the Theory quiz's chosen keys) and **`outlined`** (Holds)                          | The Chord finder's tapped keys and a lesson quiz's answer are `selected` keys, the face the quiz already gives a chosen key; nothing new on the keyboard.                                                                                                                  |
| **`COMMON_PROGRESSIONS`** (the key's progressions, pieces with patterns and learned marks)                            | They stay pieces. The Progressions tool's library is its own content (§5.4): forty progressions by style are generators, not practice items with Path steps.                                                                                                             |

The roadmap's §12 left one item to this sub-project: **a chord chart generator** (a progression's diagrams at once).
Settled: the Progressions tool writes the progression as a row of chords, each numeral over its chord, each playing
and showing on the keys; that row is the chart. No image export (the roadmap's "not for this app").

## 2. Order

1. **5.1 References:** Intervals and Available tensions, their kernel (`interval-facts.ts`, `tensions.ts`), and a
   staff that shows one clef.
2. **5.2 Lessons:** the worksheet's blocks, the lesson list, and the Fundamentals module.
3. **5.3 Tools:** Chord finder, Reharmonise, Passing chords, Progressions.
4. **5.4 Lessons:** the Accompaniment and Gospel modules.

**Why this order.** A lesson embeds and links the references and tools: an interval example is the Intervals
reference's own card, a progression example is the Progressions tool's row, a lesson on passing chords links to the
tool with its chords. Building the references first means the lesson's blocks compose them instead of copying them.
Fundamentals needs only the references and the explorers already built, so it comes before the tools; the
Accompaniment and Gospel lessons need the tools, so they come last. Jazz's modules (roadmap §10.7) follow the owner's
learning, as the roadmap decided; the engine needs nothing more for them.

## 3. 5.1 References

### 3.1 Intervals (`/learn/intervals?root=D`)

Clefs' Intervals Reference (roadmap §9.1, §10.9), on the app's keys.

- **One card per interval, in two groups:** *Within the octave* — unison, minor and major 2nd, minor and major 3rd,
  perfect 4th, tritone, perfect 5th, minor and major 6th, minor and major 7th, octave (13); *Past the octave* — the
  compound intervals a chord symbol names: minor, major and augmented 9th (♭9, 9, #9), perfect and augmented 11th
  (11, #11), minor and major 13th (♭13, 13) (7).
- **Changed from the roadmap's list, with the reason:** the 12th goes (no chord symbol names one: it is a 5th an
  octave up, and the card would teach nothing the 5th's does not); the augmented 9th joins (chord symbols write #9,
  the altered dominant's colour). The roadmap's other compound intervals stay.
- **A card:** the name (Title 3, Literata), its short name beside it (P5, m3, TT; Russian «ч5», «м3», «тритон»), one
  line of facts — its semitones and whole tones ("3 semitones · 1½ tones") and, past the octave, the degree a chord
  writes ("♭9 in a chord") — and its consonance: **perfect consonance** (unison, 4th, 5th, octave), **imperfect
  consonance** (3rds, 6ths) or **dissonance** (2nds, the tritone, 7ths); a compound interval takes its simple one's.
  Then the interval written on one staff (§3.3): the lower note and the upper as two half notes in a bar of 4/4.
  Then three soft buttons, **Up · Down · Together** («Вверх · Вниз · Вместе»), each playing the interval that way
  and turning into Stop while it plays: Up the lower note then the upper, Down the upper then the lower (the same
  two notes), Together both at once.
- **The tritone** is spelled as the augmented 4th (F♯ over C) and named "Tritone", its short name "A4 · d5": both
  spellings are the same keys, and the 4th is the one a scale's #11 and a Lydian 4th write.
- **The root** is a pop-up of the twelve roots (C, D♭, D, E♭, E, F, F♯, G, A♭, A, B♭, B), default C; the lower
  note is that root in octave 4 (C4–B4), every upper note spelled by letter steps from it (`spellAbove`), so the
  minor 3rd over B is D, the augmented 4th over F is B, and the minor 2nd over D♭ is E𝄫: the letters are what
  number an interval, so the reference never trades them for an easier name.
- **The keyboard** (pinned, `ExplorerKeyboard`) shows the interval last played: the lower key as the tonic mark
  labelled `1`, the upper as a scale mark labelled with its degree (`♭3`, `5`, `#11`), the keys' own grammar; the
  keys go down as they sound. Before anything is played it shows the root.
- **Layout:** the cards in a grid, one column on a phone, two from 640px, three from 1024px, under a group title
  each. The keyboard pinned over them.
- **The URL holds the root only** (`root=D`, default C left out): the card played is what the keys show for a
  moment, component state, as a lesson's chord example is.

### 3.2 Available tensions (`/learn/tensions?root=C&chord=d7`)

The owner's reharmonisation table (roadmap §9.9, §10.3), computed.

- **Chord** is a pop-up of the nine 7th chords the table and jazz theory give tensions for: Maj7, m7, 7, m7♭5,
  7#5, m(maj7), 7sus4 (the owner's table), and +Maj7 and °7, the two other 7th chords a scale stacks (their table
  suffixes on the root; each item's second word its name, as the Chords reference's).
  **Root** is a pop-up of the twelve roots, default C; default chord `7`, the dominant, which has the most to show.
- **Every note above the root falls in one of four groups**, the table's four columns:
  - **Weak** — the root and a perfect 5th: they add nothing to the chord's sound.
  - **Strong** — the 3rd or the suspended 4th, and the 7th: they name the chord (the guide tones).
  - **Tensions** — an altered 5th of the chord (m7♭5's ♭5, 7#5's #5, °7's ♭5: the table puts them with the
    tensions) and the available tensions: Maj7 9, #11, 13; m7 9, 11, 13; 7 ♭9, 9, #9, #11, ♭13, 13; m7♭5 9, 11, ♭13;
    7#5 ♭9, 9, #9, #11; m(maj7) 9, 11, 13; +Maj7 9, #11; 7sus4 ♭9, 9, 13; °7 9, 11, ♭13, 7 (a whole step over
    each chord tone).
  - **Avoid** — every other note: it clashes with a chord tone (the 11 over a major 3rd, the 7 over a minor 7th).
- The groups hold all twelve notes, each once, and for Maj7, m7 and 7 they are the owner's table exactly by pitch
  class (the test's oracle, §10.3's first table). A chord tone is spelled as its quality spells it; any other note as
  the degree its semitones make over the root: ♭9, 9, #9, 3, 11, #11, 5, ♭13, 13, ♭7, 7. The table writes two of
  them otherwise, C−7's E as "♭11" and C∆7's A♯ as "#13"; the app names them as the major 3rd and the minor 7th
  they sound as, which is what makes them clash.
- **A note is a chip**: its degree and name ("9 D", "♭3 E♭"), in the group's card; a tap plays the chord with that
  note on top as a melody note, which is what the table rates, and shows both on the keys (the chord in its root
  position from the root in octave 4, the note on the nearest key above the chord's top), turning the chip pressed
  while it sounds (a grid of items, CODE_STYLE §1). Each group names itself and says in a few words what its notes
  do ("They name the chord"): the reference teaches the table's four meanings, which is music, not a button.
- **The keyboard** shows the chord's tones by role (the Chords reference's marks), and a tension played joins them
  with its degree label in its role's colour (9th, 11th, 13th are chord roles).
- **The kernel** (`shared/lib/music/tensions.ts`): `TENSION_CHORDS` (the nine qualities), `tensionGroups(quality)`
  → the twelve degrees above a root in the four groups, as labelled intervals spelled by letter steps (so the 9 is
  D, the #9 D♯, the ♭13 A♭); `availableTensions(quality)`. `scaleChordAt` asks it whether a scale's 9th is available
  over its 7th chord (replacing `ninthAvailable`, same answers: C major's iii and vii stay 7ths); the builder's
  alterations are held to it by a test.

### 3.3 One staff of the grand staff

A staff outside the Player may show one clef: `ScoreView` and `LazyScoreView` take `staff` (`'treble'` or
`'bass'`), and the engraving then draws only that staff (its clef, key and time signatures, no brace), its height
the one staff's. An interval, a note to read, a line in one hand is written on the staff it is read on. The Player
and the Chords, Scales and Keys references keep the grand staff. The roadmap's "not for this app: a single staff whose
clef follows the range" is about the Player's sheet and stands: here the clef is fixed by the example.

## 4. 5.2 Lessons as worksheets

### 4.1 A lesson

The roadmap's worksheet (§3.4, §9.8, §10.7), on the lesson entity sub-project 2 built:

- **Title, summary, level, category, module, sections.** The level stays the Path's (1 Beginner · 2 Elementary · 3
  Intermediate · 4 Advanced), as sub-project 2 decided, so a lesson and a step say "Beginner" alike; the roadmap's
  five worksheet levels map onto them and nothing needs a fifth. **Categories:** Chords, Scales, Theory,
  Accompaniment, Jazz, Gospel, and now **Reading** and **Rhythm** (the note-reading and rhythm lessons).
  **Modules:** Fundamentals, Accompaniment, Gospel (Jazz's join as they are written); a lesson is in one.
- **Blocks** (a section's parts), each rendered in place, each sounding on the lesson's pinned keyboard:
  - `text` (a paragraph, its bold lead), `steps` (a numbered list), `note` (the sand callout): as now.
  - `chords`: chord symbols that play, written as the lesson writes them: as now.
  - `grid`: one chord quality on all twelve roots (Pianote's grid), each root spelled by the kernel's one rule; a
    button each, as `chords`.
  - `scale`: a scale (root, kind): its notes as degree chips, and **Play** (up and back, the Scales reference's run),
    Stop while it plays; the keys show its marks while it plays.
  - `interval`: the Intervals reference's card for one interval over a root (§3.1), the same component.
  - `notes`: notes to read, written on one staff (treble or bass, §3.3), with **Play** (each note in turn, a beat
    each) and the keys showing each as it sounds; a reading lesson's examples.
  - `quiz`: a question answered on the keys (Pianote's pop quizzes, roadmap §9.5): "Play E minor". Its **Answer**
    button makes it the lesson's one open quiz; taps then choose keys on the pinned keyboard (`selected`, the Theory
    quiz's face); **Check** compares the pitch classes chosen with the answer's (a chord, or a set of notes in any
    octave): right, the chord plays and the block says so; wrong, the wrong keys turn crimson and **Show answer**
    plays and marks it. One quiz is open at a time; opening another closes the first.
  - `link`: a row that opens a reference or tool on a view the lesson names (a chord's parts in Chords, a scale in
    Scales, a key in Keys, the Intervals reference, a progression in the Progressions tool, a piece in the Player),
    as a `RowLink`, so the learner chooses to go (CODE_STYLE §1).
  - `progression` (5.4): numerals in a key, as the Progressions tool's row, with Play and a link into the tool.
- **The lesson's links are data, not routes:** the entity names a target (`{ to: 'chords', symbol: 'Cm7' }`,
  `{ to: 'scales', root: 'D', kind: 'dorian' }`), and `lesson-view` maps it to the route and search; entities never
  import a widget's view type.
- **Tests keep content honest:** every text in both languages; every symbol, scale, note and numeral read by the
  kernel; every link's target real; every quiz's answer one the keys can play.

### 4.2 The lesson list

- **Learn** keeps its two columns: the lessons, and beside them References then Tools (5.3). The lessons are grouped
  by module, a titled group each, in the module order; a row's detail is its level and category, as now.
- **Level** and **Category** are pop-ups over the lessons (Any, then the levels or the categories that have lessons),
  held in the URL (`/learn?level=1&category=chords`, defaults left out): what the learner looks at is the URL's. A
  module with no lesson left under the filter is not shown; none at all is one line, "No lessons match.", with a
  button back to every lesson (as Songs clears its filters).
- The lesson page adds the level and category under the summary, and nothing else: no contents list (a lesson is
  three to six sections; the page is its own contents).

### 4.3 Fundamentals

The roadmap's Fundamentals (§10.7), written for the app from standard theory (§4.4), each a Beginner or Elementary
lesson, in this order: *Finding home on the keys* · *The staff and reading notes* · *Rhythm and meter* · *Whole and
half steps* · *How major scales work* · *The chromatic scale* · *Intervals* · *Triads* · *Seventh chords* · *How to
read chord symbols* (today's) · *Inversions* · *The minor scales* · *The chord family of a key* · *Key signatures and
the circle of fifths*. *Seventh chords* joins the roadmap's list: an accompanist reads 7th chords on every chart, and
Pianote's lesson (§9.5) gives them their own part. Each lesson's content is its plan's to write, from the roadmap's
references (Clefs' chromatic scale article, Pianote's triads and 7ths, The Ultimate Piano's worksheets), and every
example plays.

## 5. 5.3 Tools

Learn's **Tools** group, beside References.

### 5.1 Chord finder (`/learn/chord-finder`)

The Ultimate Piano's chord detection (§9.8): play notes, the app names the chord.

- **Keys:** a tap on the keyboard chooses a key or unchooses it (`selected`); a MIDI keyboard's held keys are the
  chord while any is held. **Clear** empties the choice; **Play** plays it (Stop while it plays).
- **The name:** the chord in Chord Display (72px), its notes from the bass up as degree chips from the root, and
  "Also" the other names the same notes have (C6 · Am7/C). A chord whose bass is not its root is a slash chord
  (C/E). Two notes name their interval ("Major third"), one note its name. Notes no chord names say so in one line.
  **Open in Chords** opens the Chords reference on the named chord's parts and root.
- **The kernel** (`shared/lib/music/chord-finder.ts`, `nameChords(keys)`): every chord the builder makes, on every
  pitch class the notes hold, matched by its pitch classes; a chord may leave out its perfect 5th (as a hand does).
  Ranked: the bass as the root first, then all tones present, then a table quality, then fewer notes.

### 5.2 Reharmonise (`/learn/reharmonise?key=C&note=E`)

The owner's second table (§10.3), carried past the key (roadmap §3.8).

- **A melody note** (tap a key, a MIDI key, or the Note pop-up) and **a key** (pop-up, the 24 keys).
- **The chords that hold it**, in groups: **Triads** (major and minor, the note as root, 3rd or 5th); **Major 7ths**
  (the note as 3, 7, 9, #11, 13: `Maj7`, `Maj9`, `Maj7#11`, `Maj13`); **Minor 7ths** (♭3, ♭7, 9, 11, 13); **Dominant
  7ths** (3, ♭7, ♭9, 9, #9, #11, ♭13, 13). Each chord names the note's degree in it, is marked **in the key** or not
  (its tones all the key's), and plays under the note (the chord below, the note on top) when tapped, shown on the
  keys. Roots are spelled by letter steps down from the note (G as the ♭9 of F♯7), a root that needs F♭, C♭, E♯, B♯
  or a double accidental taking its plain spelling (E, not F♭: the kernel's `plainRoot`, which Passing chords
  shares).
- **The kernel** (`reharmonise.ts`, over `tensions.ts`): the table's roles per quality, so the owner's table is its
  oracle for every note.

### 5.3 Passing chords (`/learn/passing-chords?key=C&from=C&to=Eb`)

The Ultimate Piano's passing chords (§10.2).

- **From** and **To** are typed chord symbols (any spelling the kernel reads; "Am7", "G7", "Dm"), with the key a
  pop-up for context. An unread symbol says so under its field.
- **Suggestions**, grouped by category: *Dominant* (secondary dominant V7/To; tritone substitution ♭II7/To),
  *Functional* (secondary ii–V), *Chromatic* (approach from a half step below; the bass walking chromatically up or
  down when the roots are two to four semitones apart; the double chromatic approach), *Diminished* (the °7 a half
  step below), *Diatonic* (the subdominant approach, IV or iv of To), *Cadences* (backdoor ♭VII7, plagal IVMaj7,
  minor plagal ivm7). A suggestion that repeats the From or To chord, or another suggestion, is left out.
- **Each suggestion:** its name, its chords in a row (each playing and showing on the keys), **in the key** or
  **chromatic**, one line of why ("B♭7 is the V7 of E♭"), and Play, which plays the row voice-led: each chord in the
  inversion nearest the one before, over its root in the bass (`voiceLead` in the kernel).
- **Every rule is an interval from To's root**, spelled by letter steps and then `plainRoot` (the tritone
  substitution of E♭ is F♭7 by letters, written E7).

### 5.4 Progressions (`/learn/progressions?key=C&p=I-V-vi-IV&size=triads`)

The Ultimate Piano's progression generator and library (§9.7, §10.1).

- **Numerals** are a progression written in Roman numerals, read in any key: upper case a major triad, lower case a
  minor one, `°` diminished, `+` augmented, an accidental before (`♭VII`, `#iv°`), a 7th after (`V7`, `ii7`,
  `IMaj7`, `viiø7`). In a major key they count from the major scale, in a minor key from the natural minor (so `VII`
  in A minor is G). A numeral with no 7th written grows with the **Chord size** (Triads · 7ths · 9ths): the key's own
  chord on its degree grows as the scale's (`scaleChordAt`), any other major chord to a dominant, any other minor
  chord to a minor 7th.
- **Typed chords** ("Am F C G") are read as numerals in the key chosen (vi IV I V in C); the URL keeps the numerals.
- **The library:** the §10.1 table's progressions by style (Pop, Rock, Jazz, Blues, Classical, R&B / Soul, Latin /
  Bossa, Gospel, Theory), each a row that loads it (the learner's typed line replaced), and the minor-key three
  (i–iv–V–i, i–VI–III–VII, ii°–V–i). Names are `LocalText`; "Axis of Awesome", "Royal Road" stay as musicians say them.
- **The row:** each chord's symbol over its numeral, a button that plays it and shows it; **Play** plays them in turn,
  voice-led, a chord every two beats at 84 (the Player plays a chord a bar); **Practise in the Player** opens
  `/play/progression` with the same numerals, key and size.
- **The Player source** (`features/practice/progression.ts`, `progressionChart`): a chord a bar, four bars a line, in
  4/4 and the key, arranged like any chart with a song's patterns, hands, tempo, Wait mode and the loop; its Setup
  composes Key, Chord size, then the pattern and figures (ADR 0014's composition). It is written in a key, so the
  figures that play the key's triads stay open (ADR 0015's `keyed`).
- **The library is content** (`entities/progression-library`), validated by tests (every numeral read by the kernel,
  every name in both languages).

## 6. 5.4 Accompaniment and Gospel lessons

The roadmap's Accompaniment module first, for the app's first users: Боброва's seven accompaniment types (the
patterns already in `entities/pattern`, heard in place and opened in the Player); Called to Play's five ways and
right-hand techniques; bass and chords; broken chords and arpeggio patterns; accompanying a hymn; common progressions
in major and minor keys (`progression` blocks); passing chords between a hymn's chords (linking the tool); and
reharmonising a melody note (linking Reharmonise). Then Gospel: its progressions (the library's gospel row), passing
chords and reharmonisation. Each lesson's text is its plan's to write, from the sources the roadmap names.

### 6.1 What the lessons need

- **A `pattern` block** (`{ pattern, piece }`): an accompaniment pattern heard in place, **over a piece**, never
  alone: a pattern is a way of playing chords, and it is heard only on chords; the piece is the one its source
  teaches it on (the five ways on Called to Play's lesson 3, the right-hand techniques on their lessons' studies,
  the seven types on «О наш Отец на небесах», a rhythm style on a progression). The block shows the pattern's own
  name and description (the entity's text, one source), the piece it plays over, **Play** (the piece's first line
  with the pattern, both hands, at the piece's tempo, in its key; Stop while it plays; the keys go down as it
  sounds) and **Open in the Player** (`/play/<piece>?pattern=<id>`; the Player's close goes back through the
  history, to the lesson). A pattern that plays the tune names a piece with a melody (the content test says so).
- **A `progression` block** (`{ numerals, key, size? }`): the Progressions tool's row, the same component (it moves
  to `features/play-example`, the examples a reference and a lesson share), and under it a link row into the tool
  on those numerals, key and size.
- **Links to the tools and the Player:** `progressions` (numerals, key, size), `passing-chords` (key, from, to),
  `reharmonise` (key, melody note), `piece` (a piece in the Player, with a pattern or its own). The content test
  reads each: numerals parse, chords parse, a piece exists.
- **Modules:** Accompaniment and Gospel join Fundamentals, in that order; Learn's groups follow.

### 6.2 The lessons

**Accompaniment**, in order: *Bass and chords* (Beginner: the left hand's root and octave, the chord in the right
hand near the middle, moving to the nearest inversion; ways 1 and 5, the bass–chord alternation and the chord
pulse) · *Broken chords and arpeggios* (Elementary: ways 2–4, harmonic figuration, broken arpeggios, the arpeggio
up two octaves) · *The five ways* (Beginner: Called to Play's lesson 3, the five in order on its progression, and
a new way on every chord) · *Right-hand techniques* (Elementary: Called to Play's techniques on their studies) ·
*The seven types of accompaniment* (Elementary: Боброва's seven on her hymn, what each is for, and mixing them) ·
*Accompanying a hymn* (Elementary: from the chart to the service: the key, the intro, a type for the verse and
another for the chorus, the ending, breathing with the singers) · *Common progressions* (Elementary: I–IV–V–I,
I–V–vi–IV, I–vi–IV–V, ii–V–I, and in minor i–iv–V–i, i–VI–III–VII, i–VII–VI–V) · *Passing chords* (Intermediate:
a chord between a hymn's chords: the secondary dominant, the diminished 7th, the chromatic approach; the tool on
each) · *Reharmonising a melody note* (Intermediate: the chords that hold a note, in the key and past it;
Reharmonise on each).

**Gospel**, in order: *Gospel progressions* (Intermediate: the library's gospel row, in 7ths) · *Gospel passing
chords* (Intermediate: the 1 to the 4 through I7, the ♯iv° between IV and I, the walk-up ♭VI–♭VII–I, a ii–V into
any chord) · *Gospel reharmonisation* (Intermediate: a hymn's plain chords made rich: 7ths and 9ths, sus4 to
dominant, IV over V, the minor iv, the tensions).

## 7. Words (the glossary)

Settled here: **Interval** (the reference's card: a distance named, heard up, down and together), **Consonance**
(perfect, imperfect, dissonance), **Available tension** and **Avoid note** (the tensions reference's groups; Weak and
Strong for chord tones), **Module** (a group of lessons), **Chord finder**, **Reharmonise**, **Passing chord**,
**Numerals** (a progression in Roman numerals, read in any key), **Library** (the Progressions tool's named
progressions by style). "Tool" joins "Reference" in Learn's vocabulary: a reference is looked things up in, a tool
works something out from what the learner gives it.

## 8. Decided against

- **A Chord symbols reference** (§1).
- **A contents list in a lesson** (§4.2): a lesson is short.
- **A staff on each tension chip, or a staff for every chord in a progression's row:** the keys show them; the Chords
  reference writes any one.
- **Toggle mode as a keyboard setting:** only the Chord finder's and a quiz's keys are chosen by a tap; teaching
  diagrams stay planned (roadmap §5).
- **Detecting a key from typed chords:** the learner chooses the key; the chords play as typed in any key.
- **Popularity statistics, image export, ChordPro** (the roadmap's "not for this app").
