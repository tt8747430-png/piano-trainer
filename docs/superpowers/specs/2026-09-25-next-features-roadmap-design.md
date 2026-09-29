# Next features: the roadmap

- **Status:** agreed with the owner 2026-09-26, after a grilling session (twenty questions, answered one at a time)
  over the owner's requests and reference material. It splits the work into nine sub-projects, orders them, records
  every decision the session took and the ones the owner left to Claude, and lists what is planned but not built.
  Each sub-project gets its own spec, plan and build. Revised 2026-09-26 after the owner tried the keyboard and asked
  for the key's chords (§1, items 8 and 9): the keyboard's fixes (§3.1), and the key's chords placed in
  sub-projects 2 and 4 (§3.8). Then two owner decisions: studies and progressions leave Songs (§3.9), and a lighter
  palette after The Ultimate Piano's learn view (§3.10). Revised 2026-09-27: that palette printed quietly, with a
  typeset serif, and a new app icon (§3.10), after Apple's and Material's guidelines (§9.11). Revised 2026-09-29:
  «Ромашковые поля» written as the course writes it and the chromatic walk (ADR 0015), from three pages of Vasily
  Gorshkov's accompaniment course; then a piece may carry a recording that plays along (ADR 0016), its vocal first.
- **Built:** sub-projects 1, 2, 3, 4 and 5. Their specs and plans were removed once built, on 2026-09-27 (`git log
  --diff-filter=D -- docs/superpowers` finds them). Sub-project 1: `DESIGN.md`'s keyboard and ADRs 0009 and 0010.
  Sub-project 2 (navigation and options): ADR 0012, `DESIGN.md` (the Choosing Rule, pop-up buttons, rows, the four
  places) and the glossary (Learn, Practice, Lesson, Reference, Shelf, Chords view, Keys play, Holds). Sub-project 3
  (notation and the sheet-music Player): ADR 0013, `DESIGN.md` (the Player's layout, the sheet), `docs/CODE_STYLE.md`
  §8 and the glossary (Score, Sheet music, Cursor, Loop, Speed training, Swing, Roll, Listen / Wait mode).
  Sub-project 4 (scales and chords, deeper, with the owner's chord builder of 2026-09-27): ADR 0014, `DESIGN.md` (the
  circle of fifths, the Chords view's sizes and figures, a staff outside the Player, the pop-up that checks several),
  `docs/CODE_STYLE.md` §8 (a run, a scale's chords, a built chord) and the glossary (Start on, Fingering, Scale chord,
  Figures, Walk the chords, Borrowed chord, Parent scale, Circle of fifths, Keys, Chord parts, Triad, Added tone,
  Alteration). Sub-project 5 was built in four parts (its spec, `2026-09-29-learn-lessons-references-tools-design.md`);
  part 5.1, the Intervals and Available tensions references: ADR 0017; part 5.2, lessons as worksheets and the
  Fundamentals module: ADR 0018; part 5.3's first three tools (Chord finder, Reharmonise, Passing chords): ADR 0019; the Progressions tool and its Player
  source: ADR 0020; part 5.4, the Accompaniment and Gospel lessons: ADR 0021.
- **Builds on:** the master spec (`2026-09-24-piano-trainer-rewrite-design.md`) and the app as built through Phase 3
  and the live keyboard (`DESIGN.md`, `CLAUDE.md`, ADRs 0007 and 0008).
- **Read first:** Mindscape's (`~/projectsGIT/memory-palaces`) `CLAUDE.md`, `docs/CODE_STYLE.md`,
  `docs/MOBILE_DESIGN.md` and `PRODUCT.md`, as the owner asked; §4.5 says what the sub-projects take from them.
- **The full record** (added 2026-09-26 at the owner's request, "all the information, not summarised"): the owner's
  own words (§7), the grilling session question by question (§8), every reference in detail (§9), the catalogues a
  sub-project builds from (§10: progressions, passing chords, tensions and reharmonisation, chord and scale types,
  exercises, trainers and their ladders, lessons, keys, intervals), best practices (§11), what the references showed
  that no one has decided yet (§12) and today's app's faults with their causes (§13). §1–§6 are the decisions; §7–§13
  are what they were made from, and what each sub-project's spec starts from.

## 1. What the owner asked, and the references

1. A more adaptable keyboard (the whole piano or not; GarageBand's Glissando or Scroll), a better look, better touch
   and click responsiveness.
2. More modes, "like" the owner's reference trainer (steinway.web.app: Play chord, Guess chord, Intervals, Keys,
   Songs) and Clefs (Ear training, Drills).
3. A Path whose options do not redirect to other tabs; Theory and levels with real pages; "all pages and options
   must be actually useful, not middle men or redirects".
4. Real sheet music of our songs in practice (Flowkey), and editing scores and notes, on a computer for now.
5. Patterns that are not cluttered, that can be edited and managed, and that are explained.
6. Keyboard faults seen on the screens: a scale's keys "half coloured, cut in two"; an arpeggio showing every chord
   key coloured with only the sounding one dimmed; no Stop after Play; the Symbols page no longer making sense; the
   Player's grid of notes (`Bm · Next · RH/LH · F♯4⁵ …`) not wanted, sheet music instead; too many options visible
   at once.
7. More scale practice: 9th, 11th and 13th chords of a scale; a scale or its chords begun on any note with the thumb
   (D blues from D or from A); inversions of the chords and the scales; Barry Harris and other exercises.
8. After trying the playable keyboard (2026-09-26, second look): a light click or a trackpad tap sounds but never
   shows the key down; a scale's marks vanish while any key sounds, where The Ultimate Piano keeps them pale and
   deepens the key played; the focused key rises over the black keys and its ring looks wrong; are the degree numbers
   needed when colour already marks the scale?
9. Theory's tabs and modes: why a Symbols tab when Chords already chooses any chord; the scale's chords as The
   Ultimate Piano's **Diatonic** mode (each degree's key carries its numeral and chord name, and a tap on it plays the
   whole chord, in Glissando too); play a note and see the key's chords that hold it; practise the key's chords
   with a song's patterns.

**References the owner sent:** Clefs (home, theory articles, the intervals reference, a practice result), Flowkey's
player (tempo, hands, loop), steinway.web.app (the trainer's five modes and settings), Piano With Jonny's "5 Major
Scale Exercises", Pianote's "How to Play ALL Piano Chords", Hooktheory's key cheat sheet, The Ultimate Piano (its
app: settings, learn mode, circle of fifths, passing chords, progression generator, practice with levels, ear
training, the sheet music player; and its guides, worksheets and docs), a reharmonisation table (available tensions
per chord; the chords that carry a melody note) and The Jazz Piano Site's lesson modules.

## 2. Sub-projects, in order

| #   | Sub-project                          | Delivers |
| --- | ------------------------------------ | -------- |
| 1   | **The playable keyboard**            | Piano-like keys in real proportions; note names C · All · None; a key sounds the instant it is touched; **Scroll** and **Glissando**; key sizes Fit · Large · Whole piano; the keyboard map (off by default); a small settings button in the keys' rail; the computer keyboard as a piano; finger numbers in circles under the keys; a scale's notes colour whole keys; the key sounding now stands out alone; Stop on every Play; a Keyboard group in Settings |
| 2   | **Navigation and options**           | The tabs **Path · Songs · Learn · Practice** (in the docked bar and the laptop sidebar that §3.10's change built); Theory becomes Learn (the Chords and Scales explorers, the chord dictionary as a reference, the reading notes as the first lesson); the quiz and My gaps move to Practice; every screen's choices become dropdowns and segmented controls with a sheet for the rest, after researching Apple's Human Interface Guidelines; the Scales explorer's modes **Scale** and **Chords** (the key's chords on its keys, a tap playing one) and the chords that hold a note (§3.8) |
| 3   | **Notation and the sheet-music Player** | `shared/lib/notation` and a VexFlow staff (§4.1); the Player in Flowkey's shape (§3.5); the Player can play a fixed score as well as an arrangement; swing; speed training in the loop |
| 4   | **Scales and chords, deeper**        | The church modes and major and minor blues as scale kinds; **Start on** any note of a scale with fingering *From the thumb* (default) or *As the scale*; the scale's chords as triads, 7ths, 9ths, 11ths and 13ths, in inversions, and *Walk the chords*; the key's chords practised in the Player with a song's patterns (§3.8); the scale as sheet music with the keyboard; a key page for each of the 24 keys and the circle of fifths |
| 5   | **Learn: lessons, references, tools** | Lessons like The Ultimate Piano's worksheets (a level, a category, live diagrams that play in place), in modules from fundamentals to accompaniment to jazz and gospel (TJPS's shape); references (intervals, available tensions, chord symbols); tools: Progressions, Passing chords, Reharmonise, and chord detection (the app names what you play). The Chords and Scales explorers are already Learn's, moved there by 2 |
| 6   | **The Path as a course**             | A page per level and per step, built like a worksheet that teaches and practises in place, never a redirect; every step levelled 1–4 (master spec §11, Phase 4's first task, moved here) |
| 7   | **Practice: exercises and trainers** | Every exercise group, researched from primary sources (§3.3); trainers with a ladder of levels plus a custom choice, *run until stopped* or *N exercises*, and progress (streak, average, runs); ear training (intervals, chords, scales), note reading, keys, degrees |
| 8   | **Patterns**                         | A page per pattern (its idea in a line, each hand in notation over a C chord, heard, on the keys, the songs that use it); a calmer picker; favourites and hiding; an editor for the learner's own patterns. The owner left the design to Claude |
| 9   | **The score editor**                 | On a computer: your version of any piece (notes, melody, chord symbols), and new scores written from scratch (a listed song with no chart yet); undo and redo; input by mouse, computer keyboard or MIDI; the Player plays your version; reset to the original |

**Why this order.** The keyboard is on every screen and needs nothing. Navigation comes second so every later screen
is built in its final place, and it moves only screens that already have content, so no tab starts empty. Notation
is the foundation of 4, 5, 7, 8 and 9, and the Player is its most asked-for use. Scales come before lessons because
lessons and exercises are built on them. Learn's lessons come before the Path's pages, which are made of the same
blocks. Practice needs the staff (reading notes) and the deeper scales (exercises). The editor is the largest and
the most computer-bound, and goes last.

**Phase 4** (master spec §11) keeps its switch-over (the Russian review, the parity check, production on Vercel,
deleting `legacy/`). Its levelling moves into sub-project 6.

## 3. Decisions

### 3.1 The keyboard (sub-project 1)

- **Touch:** a key sounds and goes down the instant it is touched. **Scroll** (default): a swipe moves the keyboard,
  and only the key it started on sounds. **Glissando:** every key a finger crosses sounds; the keyboard stays where
  it is and moves an octave at a time by ‹ ›, which both swipes show wherever the keys scroll (a mouse cannot
  swipe).
- **"Full mode"** is the key size **Whole piano**. A full-screen keyboard is not built now: it waits for recording
  from a MIDI keyboard (§5), where it makes sense.
- **Key sizes** Fit · Large · Whole piano, not a start octave and an octave count (the owner left it to Claude: Fit
  asks nothing of the learner; a chosen stretch suits teaching diagrams, not playing).
- **The keyboard map** (a strip of all 88 keys framing the part in view) is off by default, with a setting.
- **Controls** live in Settings, plus a small settings button in the keys' rail, with no extra row: the screen
  is small and every control must earn its space, what matters while playing first.
- **The computer keyboard plays**, on by default on computers, off on phones.
- **Finger numbers** sit in circles under the keys; a key carries its degree or note name.
- **A scale's notes colour the whole key**, never half of it.
- **The key sounding now stands out alone:** while a chord is arpeggiated or a run plays, the other marked keys go
  quiet.
- **Every Play becomes Stop** while its sound plays.

Revised after the owner's second look (§1, item 8), fixed at once since sub-project 1 has shipped and nothing later
depends on the old behaviour:

- **A tap always shows.** A key a hand plays (a finger, a typed key, a MIDI key) is down while it is held, and for
  at least the **shortest press** (150 ms): a trackpad's tap lifts in the same frame it lands, so it never showed.
- **Spotlight keeps every mark.** Under spotlight the keys down are still the ones struck last, but the other marks
  stay as they are (The Ultimate Piano's learn view): the key played stands out by going down, not by hiding the rest.
- **A key down never looks like a key at rest.** Every mark is its colour's pale wash while its key is quiet and its
  full colour while the key sounds (The Ultimate Piano's learn view), keeping its label; a plain key sounding turns
  sky. Before, a plain key down by day was the scale's own colour, and by night the tonic's. (The colours themselves
  are §3.10's.)
- **The focused key keeps its place.** It no longer rises over the black keys; a ring in two tones (dark outside,
  light inside, so it shows on any key's colour) outlines the part of the key a finger touches.
- **The degree numbers stay** on a scale's keys: colour says a key is in the scale or down, the number says which
  degree (the ♭3 that makes it minor), which is what the page teaches, and colour is never the only cue. The Chords
  mode (§3.8) swaps them for its numerals and chord names.

### 3.2 Navigation and options (sub-project 2)

- Four tabs: **Path · Songs · Learn · Practice**. Settings stays behind the gear on Path.
  - **Learn:** lessons, references (Chords, Scales with the modes, Keys with the circle of fifths and key pages,
    Intervals, Chord symbols, Available tensions), tools (Progressions, Passing chords, Reharmonise, chord
    detection). The Chords explorer is the reference, not a tool beside it.
  - **Practice:** the Theory quiz with My gaps (moved by sub-project 2), then exercises and trainers (sub-project 7),
    which grow the quiz's modes into ladders of levels.
  - **Songs** holds your own scores (the editor, and later recording), The Ultimate Piano's "Create".
- **Symbols** goes: its reading notes become a lesson and its dictionary a reference. (The owner asked again on
  2026-09-26: its chord list only repeats what Chords already chooses.)
- **Choices are dropdowns**, not rows of chips; segmented controls for two to five options; a sheet (a panel rising
  from the bottom) for settings changed less often. The pattern is Apple's; sub-project 2 researches the Human
  Interface Guidelines before its spec.
- **Every page earns its place** (the owner's rule): a screen does its job in place, or is a link the learner chose
  knowing where it goes. Recorded in CODE_STYLE §1 by sub-project 2.

### 3.3 Scales, exercises and trainers (sub-projects 4 and 7)

- **The church modes are Scale kinds**; a **Key** stays major or minor (a song is written in one). A key in code is
  `{ tonic, minor }` (`shared/lib/music/key.ts`), so the name `Mode` is free for the church modes.
- **All the blues scales:** major and minor blues (sub-project 4 checks for any other standard one).
- **Start on:** any note of the scale; the fingering is a choice, **From the thumb** (default: the thumb on the
  starting note) or **As the scale** (the parent scale's shape, PWJ's modal exercise). The right hand's thumb leads
  going up, the left hand's coming down.
- **Exercises:** all of them, each sourced (Barry Harris, PWJ, Hanon and others), generated in any key, played in the
  Player with sheet music, Wait mode, tempo, hands and loop: scales from any note, in 3rds and 6ths, in groups,
  contrary motion; the chords of a scale walked in every inversion; arpeggios; Barry Harris's 6th-diminished scales,
  the dominant scale-down with the half-step rule, arpeggios from the 3rd, drop-2 7ths; PWJ's 2-5-1 scale, inner
  voice, modes, rapid switch and pattern shifting; progressions in every key; Hanon; five-finger positions. We write
  our own generators for these ideas; no printed exercise is copied.
- **Trainers** take The Ultimate Piano's shape: a ladder of levels (chords: the three main chords of C → all chords of
  C → inversions → 7ths → A minor → G and F → all 12 roots → diminished and augmented; notes: three anchors →
  anchors everywhere → five-finger positions → lines → spaces → ledger lines → the full range) plus a custom choice,
  a fixed number of rounds per level so results compare, and progress per trainer.

### 3.4 Learn and the Path (sub-projects 5 and 6)

- **Tutorials are music lessons**, like The Ultimate Piano's guides and worksheets: a title, a summary, a level
  (Beginner … Advanced) and a category (Chords, Scales, Theory, Accompaniment, Jazz, Gospel), filterable; inside, text
  and live diagrams (a chord, a scale, a staff, a progression) that play and show on the keys in place.
- **Modules** follow TJPS's shape (basics, chords, scales, voicings, progressions, reharmonisation, improvisation,
  genres), with church accompaniment (Боброва's accompaniment types, Called to Play's methods) first, for the app's
  first users. Which lessons come first is Claude's to decide (the owner left it).
- **The Path's pages are worksheets:** a level's page lists its steps as lesson cards; a step's page teaches and
  practises in place.

### 3.5 The Player (sub-project 3)

Flowkey's shape, agreed:

```
✕   Still, my soul, be still           [tempo ▾] [hands ▾] [⚙]
┌────────────────────────── keyboard ──────────────────────────┐
└──────────────────────────────────────────────────────────────┘
  G           C          Em   G/B      C  C/E  Dsus4  D/F#     ← chord symbols over numbered bars
 𝄞 ──●──────●──────●────|───●───●───|──●──●──●──●──|──         ← grand staff, cursor, loop handles
 𝄢 ──●──────────────────|───●───────|──●──────────|──
                    ‹    ( ▶ )    ›
```

- **Tempo popover:** **Wait mode**, 50%, 75%, 100% or any tempo; speed training.
- **Hands popover:** right, left, both.
- **⚙ sheet:** key, pattern, **Chord size**, swing, finger numbers, melody, metronome, count-in.
- **Step** is ‹ › beside Play; a **loop** is dragged over bars on the sheet.
- **Gone:** the mode switch, the chord strip, the big current and next chord, the grid of notes.
- **Phones first**, upright and on their side, judged first on a phone on its side; tablets and laptops get the
  same layout with more bars.

### 3.6 Scores (sub-project 9)

Your version of a piece, and new scores, edited on a computer. **MusicXML** is the exchange format, planned (§5).
PDFs are not shown: a picture of notes cannot be played along to.

### 3.7 Words (the glossary, `docs/UBIQUITOUS_LANGUAGE.md`)

Settled in the session: **Scroll**, **Glissando**, **Key** (a tonic, major or minor), **Mode** (a church mode, a
Scale kind), **Study** (a method book's lesson piece: the Piece kind `study`), **Exercise** (a line
generated from a rule in any key, in Practice), **Wait mode** (was Your turn), **Chord size** (triads, 7ths, 9ths:
was the Player's "voicing"), **Voicing** (how a chord's notes are laid out: shell, rootless, drop 2, quartal).
The code took the words on 2026-09-26: the kind `study` and the collection `studies`, the mode `wait`, `ChordSize`
and the URL's `chordSize`, and a Key's `minor` in place of its `Mode`.

### 3.8 The key's chords (sub-projects 2 and 4)

The owner's reference is The Ultimate Piano's learn view: a Mode · Root · Type bar over the keys, and in its
**Diatonic** mode each degree's key labelled with its numeral over its chord (`ii` over `Dm`).

- **The Scales explorer gets two modes**, a segmented control: **Scale** (as now: degrees on the keys, the fingers,
  the run) and **Chords**. In Chords each degree's key carries its numeral over its chord's name; a tap, a typed
  key or a Glissando onto it sounds the whole chord and puts its keys down; a key outside the marked octave plays
  its own note. "Chords in this scale" (Triads · 7ths and the seven chords to tap) moves into this mode, where it
  belongs, instead of sitting under the practice card.
- **The chords that hold a note:** Chords mode has *Keys play: Chords · Notes*. With Notes a key sounds alone, and
  the key's chords that contain it light up, on the keys and in the list: the chords that can go under that melody
  note. A note from a MIDI keyboard does the same. The kernel computes it (the key's chords whose tones include the
  note's pitch class); sub-project 5's Reharmonise carries it past the key (tensions, borrowed and passing chords).
- **Built in sub-project 2, not before it.** It needs nothing but the keyboard and the kernel, so it could be built
  now, but 2 rebuilds the same page's controls (chips become the reference's dropdowns and segments, Theory becomes
  Learn); building the modes first would build the page twice. They are 2's first screen. The keyboard gains a way for
  a screen to say what a key sounds (a chord for a degree's key), where today every key sounds its own note.
- **Practise the key's chords** (sub-project 4, after 3): from Chords mode, the key's chords as a progression (the
  seven walked up and down, or a common one: I–IV–V–I, I–vi–IV–V, ii–V–I, I–V–vi–IV), opened in the Player with
  everything a song has there: its patterns, Chord size, hands, tempo, Wait mode and the loop. It waits for 3, because
  today's Player plays only a listed piece, and 3 rebuilds the Player around a score it can be handed. Sub-project 7's
  progressions in every key grow from it.

### 3.9 Studies and progressions leave Songs (owner, 2026-09-26)

Decided by the owner with the building session, recorded here at its request.

- **Songs holds songs** (and listings, and your own scores, §3.2). **Studies** (the method books' lesson pieces) and
  **progressions** are ways to practise the chords of a key, like the key's chords practised in the Player (§3.8), so
  they belong with the key's chords and with **Practice**, not in the song list.
- That includes progressions in one key (today's pieces of kind `progression`, and the Progressions tool's library,
  §10.1) and the Called to Play studies. They keep opening in the Player with its patterns, Chord size, hands, tempo,
  Wait mode and loop.
- Where each lands (the Scales page's Chords mode, Practice's exercises, the key pages) and when is for sub-projects
  2, 4 and 7's specs; the Path keeps its steps that name them, pointing to their new place. **Sub-project 2 put them
  on Practice** (lists under the Theory quiz; their pages at `/practice/studies/…` and `/practice/progressions/…`);
  links from the Chords view and the key pages are sub-project 4's.

### 3.10 A new world: the labelled picture book (owner, 2026-09-26 and 27; built, ADRs 0010 and 0011)

Decided by the owner with the building session. **It replaces ADR 0007's colours** (the sage world with deep-teal
actions): the owner found the green look and the keys "very strident and heavy".

- The first reference was **The Ultimate Piano's learn view** (lavender and coral marks on light keys); two readings of
  it in violet were turned down ("better colours and more colour harmony").
- Through the design skill's direction rounds (stained glass, piano felt, periwinkle and coral, engraved sheet music,
  songbook cloth, a cloud's pastel edge and others), the owner chose the **Busytown cross-section**: Richard Scarry's
  labelled picture books. Paper, a warm brown line round every shape, seven gouache paints at one lightness (so they
  harmonise), bold hand-lettered titles (Balsamiq Sans, with Cyrillic), rounded rectangles instead of pills. Its colour, line and
  labelling only: no characters or mascots.
- The Ultimate Piano's key grammar stays: a mark pale at rest, full colour when played.
- The same change made the app use a laptop's width (a sidebar, screens up to 72rem, two columns) and docked the
  phone's tab bar. Recorded in ADR 0010, DESIGN.md and PRODUCT.md.
- Built, it read loud; the owner asked for calmer colours and better typography and sent Apple's colour and
  typography guidelines and Material's colour system. The book was **printed quietly** (ADR 0011): faded paints, a
  soft 1px line, honey on the one action only, a neutral "chosen", a monochrome nav, a `prefers-contrast: more`
  layer, and Literata in place of Balsamiq Sans for titles and chords (§9.11 has what was taken from each guide).
- **The app icon** (owner, 2026-09-27): after rounds of flat keyboards, the owner chose **Piano Pro & Drum's** icon
  from a page of piano app icons: three chunky keys seen from above, each outlined, black keys raised between them,
  one key played in honey, on a warm charcoal ground with a glow, a shadow under the keys and three small diamonds.
  Apple's app-icon guidance shaped the files: a rounded tile where nothing else shapes it (a tab, a desktop install),
  square and edge to edge for the home screens, which cut their own shape (`public/favicon.svg`,
  `pwa-assets.config.ts`).
- Every colour rule the app already keeps still holds: colour is never the only cue, role colours stay on chord tones
  only, WCAG AA contrast in both themes, dark as a first-class palette.

## 4. Shared technical decisions

### 4.1 Notation is VexFlow, over a score model of our own

- **Rendering:** VexFlow 5 (MIT, TypeScript, SVG; latest stable). It engraves what it is given and does not decide
  what to engrave, which is what an editor and a cursor need to own anyway.
- **Not chosen:** OpenSheetMusicDisplay (MusicXML in only, its own cursor), abcjs (ABC text; a WYSIWYG editor fights
  it), Verovio (LGPL, a multi-megabyte WebAssembly build, too heavy to precache).
- **The score model** is pure TypeScript in `shared/lib/notation`, fenced like the kernel (it imports only `music`):
  measures, staves, voices, durations, ties, beams, accidentals, spelled by the kernel. The editor edits it, the
  cursor walks it, the Player plays it, exercises generate it.
- **The renderer** is one component in `shared/ui`, lazy-loaded with its screens; its music font is self-hosted and
  precached. Sub-project 3 verifies how VexFlow 5 loads a local font before its plan.

### 4.2 Content stays code; your own work is saved state

- Lessons, exercises' rules and patterns are content as code (ADR 0002), `LocalText` in both languages, validated by
  catalog tests.
- Your scores, your patterns, favourites and hidden patterns, the keyboard's choices and the trainers' progress are
  saved state: persisted stores over `safeLocalStorage()`, each with a `version`, a `migrate` and a sanitising
  `merge`. Nothing leaves the device.

### 4.3 Copy

PRODUCT.md's "never explain the obvious" keeps ruling the interface. Lessons and pattern explanations teach music, so
they are the exception the reading notes already are (CODE_STYLE §10). A lesson explains music, never a button.

### 4.4 Sources

Lessons and exercises are written for this app from primary sources (the method books, Barry Harris's own teaching
as documented, standard theory). A reference site's text, a printed exercise or a table is never copied; the rules
behind them (available tensions, the chords that carry a melody note, passing-chord techniques) are computed by the
kernel.

### 4.5 From Mindscape's guides

- One header chrome: new pages use `ScreenHeader`; none hand-rolls a bar.
- A control's footprint includes its states: a pressed key's drop and a focus ring are never clipped; siblings gap by
  at least the ring.
- Two names for a panel on the page: a card a learner acts on, a note they read. Lessons' callouts are notes.
- Every gesture has a visible alternative: the keyboard's swipe has ‹ › and the map; the editor's shortcuts have
  buttons.
- One surface owns the finger at a time: Glissando's keys take it from the page.
- Loading, empty, error and offline states on every surface; one primary action per screen; 44px targets with 8px
  between them; primary actions in the thumb zone; `prefers-reduced-motion` honoured.

## 5. Planned, not built now

| Item                                   | What it is                                                                                 | Waits for |
| -------------------------------------- | ------------------------------------------------------------------------------------------ | --------- |
| MusicXML load and save                 | Bring a score from MuseScore, Sibelius, Finale or Dorico, and take one out                  | 9         |
| Record from a MIDI keyboard            | Play on a connected keyboard, in a full-screen keyboard, and the notes are written into a score | 9     |
| Live score                             | What you play written onto a grand staff as you play, the chord named above it              | 3, 5      |
| Toggle mode                            | Keys stay lit when tapped, finger numbers typed onto them, two colours: teaching diagrams   | 1, 5      |
| Lyrics under the staff                 | A song's words under its tune on the sheet music, the syllables carried by the melody's notes | a piece that carries its words |

**Not for this app:** YouTube and streamed audio players (a recording shipped with a piece plays along: ADR 0016), streaming overlays, image export, cloud storage, branding, kids'
icons (they need a network, an account or another audience), PDF scores (see §3.6), MuseScore's own `.mscz` files
(MuseScore exports MusicXML); a single staff whose clef follows the range (piano music is read on a grand staff, and
the sheet mutes the staff not played instead); the metronome's drum grooves and tap tempo (an accompanist practises to
a click; the tempo popover sets a tempo); a sustain pedal from a MIDI keyboard (the keyboard sounds itself, and the
app reads only which keys go down).

## 6. What this changes in the product record

When the sub-project that makes each change true ships: PRODUCT.md (sheet music and lessons leave "No …"; the
screens list; the reference products), the master spec's "Not in scope", DESIGN.md, CODE_STYLE, the glossary (terms
already settled above), ADRs and CLAUDE.md's architecture.

## 7. The owner's words

As written in the session (2026-09-25 and 2026-09-26), so a later spec reads the ask, not a paraphrase of it.

**The first message:**

> look at these images and examples and we need to add more features to our app.
> 1. read the memory palaces guides to ui and code and padding and selected styles paddings and other best practices
>    for responsive and mobile and computer ui. read its docs its claude.md and other (`~/projectsGIT/memory-palaces`)
> 1. more adaptable keyboard to be able to switch the full mode or not the full mode keyboard. or to switch between
>    the apple garage glissando or scroll mode. and the keyboard look should be improved.
> 2. more modes of the piano. and the path tab is kinda misleading because tapping on some of the options there just
>    redirect to the chords or songs tab. it is very misleading.
> 3. the theory and levels should have real pages not just redirect to some other page. all pages and options must
>    be actually useful and not just some middle mans or redirects. also look at these theory and things (Clefs'
>    Intervals Reference).
> 4. also look at these practice mode, we should be able to have real sheet music that is our songs play and not
>    just the keyboard. and we should be able to edit the scores and the notes, at least on computer for now (Flowkey).
> 5. the patterns are too cluttered and i cant edit or manage them and nowhere is explained what does this really
>    mean (the Setup sheet's Pattern page).

**On the keyboard's look (question 3's answer):**

> your recommendations and also the interactions and the touch or click responsiveness and styles are not so good,
> also in the scales mode the keyboard looks very weird with these half coloured cut in two notes. and while playing
> in arpeggio the notes are shown all with just the current note colour dimmed and not separately which is not
> correct. also the fingers are not very correct. there is no stop button when clicked play. the symbols page will
> not make much sense now. and add appropriate tutorials. and i dont like very much such overviews of the chords like
> this (the Player's `Bm · Next Bm · RH LH · 1 F#4⁵ D4³ B3¹ B2¹ B1⁵ · 3 …` grid) rather sheet music than this. and
> also improve the options. and navigations across the app. there are too many options visibles and available at
> once which is too much for the user to understand what is what

**On scale practice (question 8's answer):**

> no wrong fingers. but i want more options for the scale specific chords like ninth or eleventh chords for this scale
> and not just in chords. and also more way to practices chords in a scale like in thumb positions where the scale or
> chords begins on thumb like the D blues we can begin on D or on A and so on also on other scales and inversions of
> the chords and scales. — also other exercises like barry harris exercises and other

**On space (question 5's answer):** "remove the strip by default but make a settings to enable it. but we must also
be careful with the size because the display size is limited and we must prioritize things."

**On the full-screen keyboard (question 3's first answer):** "the full screen makes sense if the user connects a midi
keyboard and records its piano notes to a sheet, but put this only in plan, for now it is not important".

**On design (the open-questions round):** "we should design the best ui not cluttered but like the apple design
guidelines"; "dropdowns better than chips"; tutorials "are music lessons like docs pages in ultimate piano";
"yes need be differentiated practices song and practices scale or chords"; exercises: "all exercises and research
the internet for needed exact exercises or docs or information"; planned things: "in docs"; scores: "yes i can upload
scores and edit them"; MusicXML: "music xml but for now it is only planned as coming soon not yet to add"; devices:
"phone upright or on its side. and use your recommendations".

**On the second look** (§1, items 8 and 9, recorded by the building session): taps that never show, spotlight hiding
marks, the focused key's ring, the degree numbers, Symbols repeating Chords, the key's chords as a Diatonic mode, the
chords that hold a note, practising the key's chords with a song's patterns.

**On colour, type and the icon (2026-09-27, §3.10):** "i need more calm colors and better typography"; "look also at
these guides" (Apple's Color and Typography, Material's colour system); "improve the icon"; "i like the more keys
icon"; "the e key is looking weird"; "look at these icons and you can completely refactor our icon" (a page of piano
app icons) with Apple's App icons guide; "why is it square"; "not good, i like the piano pro and drum music icon";
"good but improve the outlines the shapes and the contrast, the individual keys are not distincted very good"; "the
lover part of the keys a little little bit closer".

**On 9th chords and the course's song (2026-09-29):** "look at this and update the informations if they are wrong and
update this song with the needed cords … also i want to be able to walk different types or selected types of chords
chromaticaly not just in the specific key or scale." Then: "can you also sink the audio with this playback of chords"
(the course's vocal recording of «Ромашковые поля»), shipped inside the app by the owner's choice.

## 8. The grilling session, question by question

Each question was put with a recommendation; the answer is the owner's.

| #   | Question                                                        | Answer                                                                                                                  |
| --- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 1   | What first?                                                     | The order is good (keyboard first, then sheet music; later reordered into §2's nine)                                     |
| 2   | What does "full mode" mean: the whole piano in view, or a full-screen keyboard? | Both, then: a full-screen keyboard only makes sense for recording from MIDI → planned (§5); Whole piano is a key size |
| 3   | What is wrong with the keyboard's look?                          | Flat and toy-like, unclear which key is which, wrong proportions (all three), plus responsiveness, the half-coloured scale keys, the arpeggio display, no Stop, Symbols, tutorials, the note grid, options and navigation (§7) |
| 4   | Should a key play the instant it is touched?                    | Yes, and a swipe still scrolls (only the first key sounds); in Glissando the keyboard holds still and moves by ‹ ›      |
| 5   | Keep the strip over the whole piano?                            | Off by default, a setting to show it; the screen is small, prioritise                                                    |
| 6   | Where do the keyboard's controls go?                            | Settings plus a small button in the rail, no extra row                                                                  |
| 7   | Should the computer keyboard play?                              | Yes: on by default on computers, off on phones, a switch in Settings                                                    |
| 8   | Where were the fingers wrong?                                   | Nowhere; instead: 9th/11th/13th chords of a scale, starting on any note on the thumb, inversions of chords and scales   |
| 9   | Is that (extended chords, start on, walk the chords) what you mean? | Yes, plus Barry Harris and other exercises                                                                          |
| 10  | Which exercises?                                                | All of them, researched from primary sources (with PWJ's five added from the pasted lesson)                             |
| 11  | Whose fingering does a scale started on another note use?        | Both as a choice, **From the thumb** by default, **As the scale** the other                                            |
| 12  | Church modes: scales, or keys too?                              | Scales only (from The Ultimate Piano's screenshots; confirmed); a Key stays major or minor                             |
| 13  | How is the app organised at the top?                            | Path · Songs · Learn · Practice, Create inside Songs; and document what is planned                                     |
| 14  | Where do planned things live?                                   | In the docs only (§5); the app never shows "coming soon"                                                                |
| 15  | What stays on the Player once sheet music arrives?              | Flowkey's shape (§3.5): the mode switch, chord strip, big chord and note grid go                                        |
| 16  | What are the two kinds of practising called?                    | **Exercises** (Practice's generated lines) and **Studies** (the method books' lesson pieces)                            |
| 17  | Which meaning keeps "Voicing"?                                  | Jazz's (the notes' layout); the progression's Triads · 7ths · 9ths becomes **Chord size**                              |
| 18  | Where do your scores come from?                                 | MusicXML, but planned only, not now                                                                                     |
| 19  | Does the score editor stay in this round?                       | Yes, last (sub-project 9)                                                                                               |
| 20  | What do you practise on?                                        | A phone, upright or on its side; the rest as recommended                                                                |

**Answered in the open-questions round:** major blues and all the blues scales, yes; the scale as sheet music above or
below the keyboard, yes; key size model, Claude's call (Fit · Large · Whole piano); a design like Apple's guidelines,
not cluttered; dropdowns over chips; confirmed: modes are scale kinds, the left hand's thumb leads coming down, the
fix list (whole-key scale colours, the struck key standing out, Stop on every Play, Symbols folded into Learn, the note
grid replaced by sheet music), The Ultimate Piano's take / later / not-for-us list (§9.10); tutorials are music
lessons; fingers under the keys and the scale as sheet music, yes; the Path's pages are worksheets (The Ultimate
Piano's worksheets page); which lessons first and how patterns work: Claude's call.

## 9. References in full

What each reference shows, what the app takes, what it refuses, and which sub-project uses it. Nothing here is copied
into the app: layouts and ideas are taken, text and printed exercises are not (§4.4).

### 9.1 Clefs (iPhone)

- **Home:** three rings (Points, Exercises, Seconds) with the settings and a profile button; a **Guided Courses** row;
  **Exercises:** Ear Training, Rhythm Training, Drills; **Other Apps:** Clefs; a floating **Continue** pill at the
  bottom right; a floating tab bar (Home, Library, Favourites, Profile). Taken: the Continue pill, rows with a tinted
  icon tile, the floating tab bar (already the app's world, ADR 0007). Refused: rings standing in for content.
- **An article, "Chromatic Scale":** a back button and title; a large heading; paragraphs of prose with italics for
  terms; an example line in the accent colour as a quote block ("E F F# G G# A A# B C C# D D#"); a bulleted list
  ("a chromatic scale in the key of E" is incorrect; "starting on E" is correct). Taken: the lesson page's shape
  (sub-project 5): prose, an example block that plays and shows on the keys, lists.
- **Intervals Reference:** one card per interval (Unison, Minor Second, Major Second, Minor Third …): the name, the
  short name (P1, m2, M2, m3), "Whole tones: 1.5 (3 semitones)", the consonance (Perfect Consonance, Dissonance,
  Imperfect Consonance), the interval on a treble staff, and three text actions **Ascending · Descending · Harmonic**.
  Taken as Learn's Intervals reference (sub-project 5), every card also on the keys.
- **A result:** "84%", a streak line, points "810 · New high score!", "1.17s Avg. time", a "Protect your streak"
  reminder, **Done**. Taken: a trainer's session summary (accuracy, average answer time) and one **Done** (sub-project
  7). Refused (PRODUCT.md): daily streaks as pressure, reminders, points.
- **A chord trainer (dark):** a toolbar (Clefs, Key Signature, Types, History, Melody); XP, Streak, Accuracy; a staff
  with a chord's notes approaching a target, its note names stacked (F D B♭ G E); Melody, Infinite and Hint buttons;
  an answer grid of the key's chords coloured by degree (D Minor 9, E Half-diminished 9, F Major 9, G Minor 9, A Minor
  9, B♭ Major 9, C Dominant 9, D Minor 9: F major's diatonic 9ths); a tab bar (Notes, Chords, Learn, Home, More).
  Taken: **reading a chord on the staff** as a trainer (§10.6) and the diatonic 9ths as answers (sub-project 4's
  extended chords feed it).

### 9.2 Flowkey's player (iPad, landscape)

- A dark toolbar: an exit arrow, a big orange **Play** over the keyboard's centre, a **tempo** gauge, a **hands**
  button (two hands), a settings gear.
- The **tempo** popover: "Learn at your own pace" → **Wait Mode**; "Listen and play along" → **50% Speed**, **75%
  Speed**, **Original Tempo** (the chosen one in orange).
- The **hands** popover: "Which hand would you like to learn?" → Right Hand, Left Hand, Both Hands, each with a
  two-hands icon greying the hand left out.
- Above: a video of real hands on a keyboard, keys lit orange. Below: a **grand staff** (3/4) with chord symbols over
  the bars (F, B♭/F), bar numbers, lyrics under the melody ("A-maz-ing grace, how sweet the sound"), a grey cursor
  column; a **loop**: a shaded selection with ‹ › handles at its ends and a round loop button; ✕ removes it.
- Taken (sub-project 3, §3.5): the toolbar, both popovers, the sheet under the keyboard, chord symbols and bar
  numbers, the cursor, the loop with handles. Not taken: the video (no recordings; the keyboard is the hero).
  Lyrics under the staff: planned, once a piece carries its words (§5).

### 9.3 The owner's reference trainer (steinway.web.app, «Тренажёр»)

Five tabs: **Сыграйте аккорд · Угадайте аккорд · Интервалы · Тональности · Песни**, a bottom bar of three.

- **Play a chord and check yourself:** a chord symbol to play (G♭m), **Next**; a keyboard G2–E6 with every key named
  and "keys can be scrolled"; after an answer: "Correct answer G♭ · A · D♭" beside "Your answer"; a **Results** panel
  (Errors – 1: G♭m; Correct – 0). Settings popover: MIDI keyboard, chord sound, key sound, **play from the computer
  keyboard** (the keys then show letters, "octave 4"), results, correct and your answer, **auto-reveal the answer**
  (by timer / by number of notes), timer seconds (5), **auto-advance to the next chord**. **Chord types** to test,
  grouped (Triads: major, m, dim, aug, sus2, sus4; Sevenths: 7, m7, Maj7, mMaj7, m7♭5), each a tile with its symbol
  and full name, chosen ones dark, groups reorderable.
- **Listen and guess the chord:** **Listen**, arpeggio up, arpeggio down, octave −1 +1; answer choices ("diminished
  chord", "major chord", "minor chord") from the chosen types; settings: chord sound, **guess only the chord type**.
- **Listen and guess the interval:** Listen, down, up; twelve answers with Russian short names and semitones
  (м.2·1 малая секунда … ч.8·12 чистая октава); intervals to test: **within an octave** and **extended**.
- **Keys:** *Identify the key signature* ("How many sharps or flats in A major?" 5♯ · 7♯ · 3♯ · 6♯, Next); *Build the
  key's degrees* ("Press the degrees in order for D♭ major": seven slots I–VII filled as keys are pressed, a keyboard
  C4–B5); *Feel the chord's role* (key: random or chosen; "Key: C♯ minor. What emotional role does the chord you heard
  play?"; Listen to the tonic, Listen to the chord, Next).
- **Songs:** *Guess the degrees in a song*: choose a song; play Intro, Verse, Chorus; an **eighth-note count grid**
  ("1 & 2 & 3 & 4 &", beats and "and"s marked) where each chord's degree is written as it is found; degree buttons
  (I ii iii IV ♯iv V vi vii°); the chord named ("Chord: G♭") and shown on the keyboard; toggles song sound, degree
  sound, hint; clear the beat, reset all, show the answer; the song's card (YouTube video, key D♭ major, BPM 59, 4/4).
- Taken (sub-project 7): every mode, on the app's own pieces (never a YouTube video), with every setting above; the
  computer keyboard as a piano (sub-project 1, built). The chord-type tiles become the choices sheet's dropdown and
  switches (sub-project 2's options rule), not a wall of tiles.

### 9.4 Piano With Jonny, "5 Major Scale Exercises to Practice Daily"

The principle: scales in parallel octaves, played faster and faster, stop paying back after a point; **contextual**
exercises use the scale as music uses it (the right hand's line, the left hand comping), each practised at a
moderately fast and a slow tempo, then moved to other keys (C, then G with one sharp and F with one flat).

1. **2-5-1 scale** (early beginner): the right hand runs the major scale up and down in **swung 8ths** while the left
   hand plays **shells** of ii–V–I (Dm7 → G7 → Cmaj7 in C).
2. **Inner voice** (late beginner): the key's diatonic 7th chords up and down; the left hand the root; the right hand
   the **guide tones**, the 3rd on top with the little finger and the 7th under it with the index; then the 7th
   moves down to the 6th with the thumb: inner-voice movement, as in a ballad's countermelody.
3. **Modes** (early intermediate): the scale from each of its degrees, Ionian to Locrian, up and down, the
   fingering keeping the right thumb on C and F as in C major itself (the parent scale's shape).
4. **Rapid switch** (late intermediate): one continuous line of 8ths through all 12 major keys, connecting each scale
   to the next without a break (tunes change key within a chorus).
5. **Pattern shifting** (advanced): a short melodic figure restarted on each step of the scale, its rhythm and shape
   kept: a **melodic sequence**.

Taken: all five as Practice's exercises (sub-project 7), generated in any key, in the Player with swing, Wait mode and
the loop; the "As the scale" fingering (§3.3) is exercise 3's.

### 9.5 Pianote, "How to Play ALL Piano Chords (Major, Minor, 7ths)"

A long lesson with a table of contents: chord basics (root; broken vs solid; inversion), triads (major: "happy",
1-3-5, a minor third over a major third; minor: 1-♭3-5; diminished: 1-♭3-♭5; augmented: 1-3-♯5), each with a grid of
all 12 roots in root position; 7th chords (major 7th: dreamy; dominant 7th: the key a fifth down; minor 7th;
diminished 7th: stacked minor thirds, the 𝄫7; half-diminished: m7 with a ♭5), each with its 12-root grid; chord
extensions (numbers above 7 are major intervals from the root by default: Cm13 has A; split them across two hands;
omit notes); diatonic chords with Roman numerals (upper case major, lower case minor); slash chords (the bass after
the slash; C/E is a first inversion); sus2 and sus4 (the 3rd replaced); add chords (Cadd9 vs Cmaj9); **pop quizzes**
inside the lesson ("What notes are in E, Bdim, Faug?") with answers at the end; "back to top" links.

Taken (sub-project 5): the lesson's shape (contents, one section per idea, a 12-root grid that plays and shows each
chord, quizzes inside the lesson answered **on the keyboard**, not by scrolling to answers). The app's spellings follow
its kernel (Pianote's "D♭maj7" row under dominant 7ths is a typo the kernel would never make).

### 9.6 Hooktheory, the key cheat sheet (G minor)

The **relative keys** (B♭ major, F Mixolydian, C Dorian, E♭ Lydian, D Phrygian, A Locrian); the key signature (two
flats); the scale's notes; a paragraph (its rank among keys; its three primary chords all minor); **the 21 most
popular chords in the key** by use, each with its Roman numeral and figures: i, VI, VII, III, iv, v, V (major, the
harmonic minor's), VI△7, i7, iv7, v7, i⁶₄ (Gm/D), V7, i⁶ (Gm/B♭), VII⁶ (F/A), III⁶₄ (B♭/F), III⁶ (B♭/D), V⁶ (D/F♯), I
(major, borrowed), iv⁶ (Cm/E♭), IV (Dorian); tap to hear and see on the piano; popular progressions in the key, each
playable; songs in the key; an index of cheat sheets for 12 tonics × major, minor and the five modes.

Taken (sub-project 4): a **key page** for each of the 24 major and minor keys: signature on a staff, notes, relative
key and the modes that share its notes (each a link to that scale), the key's chords with numerals, inversions and
the common borrowed ones, playable; common progressions in the key; **the app's songs in that key**. Not taken: pages
for modes as keys (§3.3), popularity statistics (the app has no corpus).

### 9.7 The Ultimate Piano (app.the-ultimate-piano.com): the app

- **Top bar:** logo, MIDI indicator, record and stop, metronome, **Key: A**, then four menus **Song Player · Learn ·
  Practice · Create**, then sound, capture, save, settings, account.
- **Settings:** tabs General, Display, MIDI, Foot Pedal, Capture, Branding, License; Language; **Toggle mode (mouse)**
  (shortcut T); **Start octave (C)** 2 and **Octaves (1–8)** 4, with a mini keyboard framing C2–B5; Practice Coach.
- **Learn (Scale):** a bar MODE (Scale) · ROOT (C) · TYPE (Minor Blues) · HAND (RH) · RANGE (1 octave) · OCTAVE (−3+)
  · Mark other keys · Play; the scale's keys coloured whole (the root one colour, the others another) labelled "♭3 E♭",
  "4 F", "♭5 G♭"; note names over the keys on the rail; **finger numbers in circles under the keys** (white keys'
  circles white, black keys' light blue); the scale on a grand staff below. Its **Diatonic** mode (second look, §3.8):
  each degree's key carries its numeral over its chord (`ii` over `Dm`), a tap plays the chord.
- **Chord Relationship Explorer:** two chords chosen from a column of roots (C → E♭): whether they are diatonic in the
  key ("diatonic in C major"), their interval (Minor Third, 3 steps), their distance on the circle ("1 (G) ·
  Moderate"), an analysis, **Find Passing Chords**.
- **Passing Chords:** see §10.2 for every suggestion shown.
- **Circle of Fifths:** major keys outside, relative minors inside, each key's signature on a small staff around the
  circle; the selected key's functions around the rim (I tonic, V dominant, ii supertonic, vi submediant, iii mediant,
  vii° leading tone, IV subdominant; for G minor: i tonic, ii° supertonic, III mediant, iv subdominant, v dominant, VI
  submediant, VII subtonic), those keys lit and the rest dimmed; **Diatonic Chords:** a row of chips (C Dm Em F G Am
  B° / Gm A° B♭ Cm Dm E♭ F); a play button and a dice for a random key; **Select: C**.
- **Progression Generator:** **Select Key**, a progression from a grouped list (§10.1) **or typed** ("I IV V I" or
  "Am F C G"), **Generate**: diagrams of each chord.
- **Practice:** tabs **Notes · Chords · Progressions · Scales · Arpeggios**; each: "Which key?" (with a metronome),
  "What to practise?" as **Levels** (§10.6), **General** or a **Custom** list; toggles Show chord name, Show chord in
  score; **Start Exercise**, Stop, Reset; Your progress; Statistics.
- **Ear Training:** tabs **Intervals · Chords · Scales** (§10.6).
- **Sheet Music Player:** tabs **MusicXML** (File, Play, Stop, back to start, −1 +1, a BPM slider (120), Loop,
  Metronome (Click), score settings; an empty **Untitled Score** on a grand staff in 4/4, "Piano") and **PDF** (File,
  page ‹ › "1 / 2", fit width, fit page, zoom 274%, 1 page · 2 pages · Half · Scroll, auto-scroll at 30 s/page,
  colours, visibility; shown: "Funiculì, Funiculà", Denza/Turco, chord symbols and lyrics); **Load:** from device
  (`.musicxml`, `.xml`, `.mxl`, `.mscz`, `.mscx`), My Cloud and Public Cloud (premium).

### 9.8 The Ultimate Piano: guides and docs

- **The guides' index:** getting started; how-to (just playing, learning chords, learning scales, ear training,
  practising songs, teaching materials, streaming overlay); learning (learning mode, circle of fifths, chord explorer,
  passing chords); practice tools (chord training, scale training, note reading, chord progressions, arpeggio
  training); ear training (intervals, chords, scales); song player (MIDI player with falling notes, audio player with
  waveform and loop and speed, YouTube player with markers, sheet music player); features (play piano with toggle
  mode, metronome with drum rhythms, tap tempo and **speed training**, MIDI recorder, score display, image export,
  chord chart generator, leadsheet editor with ChordPro and PDF export, cloud library, audio with velocity, kids icons,
  white labelling); settings (MIDI, display, foot pedal, capture, branding); account; help. Its FAQ: chords from triads
  to extended jazz chords, scales (major, minor, modes, pentatonic, blues), note reading, ear training (intervals,
  chord qualities, scale recognition), progressions in 9 categories, songs; phones not supported (tablets in
  landscape, computers best), Safari without Web MIDI.
- **Practising songs:** slow a recording without changing its pitch; an **A–B loop** over the bar that falls apart;
  **step mode** one note at a time; tempo down to 30 BPM; key detection and transposing; the **practice workflow**:
  warm up 5 minutes (scales, chords or ear training), learn the piece at 50%, step through hard passages, raise the
  tempo step by step, play along at full speed, loop the rough spots.
- **Visual tutorials:** **toggle mode** (T): a tapped key stays lit; build a chord or scale key by key; shortcuts
  C capture, 1–5 a finger on the hovered key, 0 or Backspace remove it, # sharp ↔ flat spelling, S a second colour,
  F clear fingers, P clear all; on touch a long press opens a 1–5 finger picker; fingers in the **info bar** under the
  keys (a white circle under a white key, a light-blue one under a black key); two colours for root vs tones, tonic vs
  dominant, thumb-under positions, right vs left hand; export PNG, JPG or WebP at 1–4×.
- **Sheet music display:** every note played written live on a grand staff (or a single staff whose clef follows the
  range); a key signature (15, from 7 flats to 7 sharps) that sets how notes are spelled (the key above C is C♯ in C,
  D♭ in F); **chord detection** (3+ notes: the chord's name with its intervals listed from the bass up, so a close
  voicing reads "Cmaj (3, 5)" and an open one "Cmaj (5, 3)"; extended chords "Cmaj9 (3, 5, 7, 9)"); **interval
  detection** (2 notes: "♭3", "5", "♯4/♭5", compound "9", "♭9", "11", "13"); the score below, above, left or right of
  the keyboard.
- **Passing chords:** §10.2.
- **Worksheets:** filters by **level** (Beginner, Late Beginner, Intermediate) and **category** (Chords, Scales,
  Theory); sort newest, oldest, A–Z; six worksheets: *One Scale, Seven Chords: the chord family of a key* (late
  beginner; a chord on every note of C major, I ii iii IV V vi vii°, numerals for degree and quality, the same pattern
  in every key); *Chord Fundamentals* (beginner; triads from the scale's 1-3-5 and by stacking thirds; major, minor,
  augmented, diminished on the keys, by ear and on the staff); *How Major Scales Work* (beginner; the whole- and
  half-step formula, C major with its fingering); *Introduction to Chord Inversions* (intermediate; root, 1st, 2nd
  inversion, smooth voice leading, a practice progression); *Common Chord Progressions: Major Keys* (intermediate;
  the six most used, I–IV–V to the 12-bar blues, numerals, song examples, voice leading with inversions); *Finding
  Home* (beginner; the black keys' pattern, every C, a relaxed five-finger position, first notes). Every diagram in a
  worksheet opens live in the app. Coming next there: minor-key progressions, jazz voicings, modes, rhythm patterns.
  Its FAQ: it trains principles (inversions, voice leading, common progressions, ear) that carry to hundreds of songs,
  where Flowkey and Simply Piano teach one song at a time.

### 9.9 A reharmonisation table and The Jazz Piano Site

- **The table:** which notes over a chord are weak, strong, jazz or unacceptable harmony, and for every melody note
  the major 7th, minor 7th and dominant 7th chords that hold it and as what. In full in §10.3.
- **The Jazz Piano Site (TJPS), Jazz Piano Lessons:** modules, beginner to advanced (in full in §10.7): the basics,
  jazz chords, jazz scales, improvisation, voicings, progressions, reharmonisation, modern jazz theory, genres.

### 9.10 What was taken from The Ultimate Piano, and what not (confirmed)

| Take                                                                                              | Later                                           | Not for this app                                                                 |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------- |
| Chord detection; speed training; passing chords; the chord explorer's relationships; scales by ear; note reading with a range; practice with levels | Live score; toggle mode (teaching diagrams); MusicXML import; recording from MIDI | Audio and YouTube players; streaming overlay; image export; cloud library; branding; kids' icons; the AI practice coach (needs a network); PDF scores; `.mscz` |

### 9.11 Apple's and Material's guidelines, and the icon references (owner, 2026-09-27)

Sent for the calmer palette, the type and the icon; applied in ADR 0011 and recorded in DESIGN.md.

- **Apple, Color:** never one colour for two meanings; colour the background of one control, not many; a monochrome
  tab bar over colourful content; light, dark and increased-contrast variants of every custom colour; colours look
  brighter in the dark. **Taken:** brick means only the root and the right hand, "chosen" is neutral (an umber chip, a
  card thumb on a segmented track), honey fills the one action alone, the nav is monochrome, a
  `prefers-contrast: more` layer, the white keys and the action a step softer by night.
- **Apple, Typography:** few typefaces, a sans and a serif made to go together (SF and New York); a fixed set of text
  styles (large title 34, titles 28, 22 and 20, headline and body 17); optical sizes; no light weights; text that
  follows the reader's size. **Taken:** Onest for reading and every control, Literata (optical sizes, Cyrillic) at 600
  for titles and chords, the scale 17 · 20 · 22 · 28 · 34 · 44 · 72 in rem.
- **Material, the colour system:** "on" colours for what sits on a fill; tonal steps of each hue; section colours
  used sparingly. **Taken:** each chrome paint as its wash with its deep shade on it (`--on-paint-*`); a step's kind
  tints its tile and the Continue card's band.
- **Apple, App icons:** one simple idea centred, few shapes, no drawn effects, no copied interface; square artwork
  the system masks; a background that stands out and is never black. **Taken:** the icon's files (§3.10); not taken:
  a flat, effect-free drawing, since the owner chose a reference with depth.
- **The icon references** (a page of piano app icons): Go! Piano, Simply Piano, The Piano Pro, MWM's Piano, Piano
  Pro & Drum and others. The owner chose **Piano Pro & Drum's**: three chunky keys in perspective, one coloured, on a
  dark ground with small floating diamonds.

## 10. Catalogues

What the sub-projects build from, in full. Spellings follow the kernel; a sub-project's spec may add to a catalogue
but never drops an entry without saying why.

### 10.1 Progressions (sub-projects 4, 5 and 7)

**In the app now** (content, `entities/piece`): I–vi–IV–V, I–V–vi–IV, ii–V–I, ii°–V7♭9–i, V9 → IMaj9, V7♭9 → IMaj9,
V7♭9 → im9, 12-bar blues, the Called to Play lesson progressions (now Studies), and «Stack Your Chords» and «Daisy
fields» (the whole song, verse and both endings, only its 7th chords growing) among the progressions. They leave Songs for the key's chords and Practice (§3.9).

**The Progressions tool's library** (The Ultimate Piano's list, by style; each generated in any key, played in the
Player with a song's patterns and Chord size, §3.8):

| Style        | Progressions                                                                                                                                                          |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pop          | I–V–vi–IV (Axis of Awesome) · vi–IV–I–V (Sensitive) · I–vi–IV–V (50s doo-wop) · I–IV–vi–V (alternative pop) · IV–V–iii–vi (Royal Road) · I–V–vi–iii–IV–I–IV–V (Pachelbel's Canon) |
| Rock         | I–IV–V (basic rock) · I–V–IV (rock shuffle) · I–IV–V–IV (Louie Louie) · I–V–vi–IV (pop rock) · I–IV–V–V (rock anthem)                                                 |
| Jazz         | ii–V–I (jazz cadence) · I–vi–ii–V (rhythm changes) · iii–vi–ii–V (full turnaround) · ii–V–I–IV (jazz standard) · I–IV–ii–V (sweet jazz) · ii–V–I–vi (Autumn Leaves)   |
| Blues        | I–IV–I–V (blues turnaround) · I–IV–V (basic blues) · I–I–I–I–IV–IV–I–I–V–IV–I–V (12-bar blues)                                                                         |
| Classical    | I–IV–V–I (authentic cadence) · I–V–I (perfect cadence) · I–ii–V–I (classical standard) · I–IV–V–vi (deceptive cadence) · I–IV–I (plagal cadence)                        |
| R&B / Soul   | vi–V–IV–V (neo-soul) · I–IV–vi–V (modern R&B) · I–vi–ii–V (soul turnaround) · vi–IV–V–I (emotional R&B)                                                                  |
| Latin/Bossa  | I–vi–ii–V (bossa nova) · I–IV–V–IV (Latin groove) · ii–V–I–I (samba cadence)                                                                                          |
| Gospel       | IV–V–iii–vi (gospel lift) · I–iii–IV–V (gospel standard) · I–IV–I–V (gospel hymn) · VII–III–VI (gospel climb) · V–IV–I (gospel resolution) · VI–VII–I (gospel walk-up) |
| Theory       | I–ii–iii–IV–V–vi–vii° (the diatonic chords)                                                                                                                            |

Also: **typed** progressions, as numerals ("I IV V I") or as chords ("Am F C G"), parsed by the kernel; minor-key
versions (i–iv–V–i, i–VI–III–VII, ii°–V–i) and jazz's (the minor ii–V–i, Coltrane changes, bird changes, contiguous
ii–Vs; §10.7) as the lessons reach them. Names are LocalText; "Axis of Awesome" and "Royal Road" are the names
musicians use and stay as they are.

### 10.2 Passing chords (sub-project 5)

**Input:** a key for context (C/Am, G/Em …), a **start** chord and a **target** chord, typed ("Am7", "Cmaj7", "G7",
"Dm") or picked; Enter generates. **Output:** suggestions, each a sequence (usually one chord inserted: a 3-chord
sequence), a **category**, whether it stays **in the key ✓** or is **chromatic ⚠**, a name, a one-line reason, and
▶ played with smooth voice leading (octaves chosen to keep the voices' moves small).

**Categories:** Functional (tonal function: ii–V–I), Dominant (dominant relationships), Chromatic (chromatic voice
leading), Diatonic (inside the key), Cadences (cadential patterns), Diminished (diminished connections).

**Every suggestion The Ultimate Piano showed for C → E♭:**

| Category   | Name                                  | Sequence               | Why                                    |
| ---------- | ------------------------------------- | ---------------------- | -------------------------------------- |
| Dominant   | Secondary dominant                    | C → B♭7 → E♭           | B♭7 is V7 of E♭ (it wrote A♯7)          |
| Dominant   | Tritone substitution                  | C → E7 → E♭            | E7 (♭II7 of E♭) resolves chromatically |
| Functional | Secondary ii–V                        | C → Fm7 → B♭7 → E♭     | ii–V of E♭                             |
| Chromatic  | Chromatic approach (from below)       | C → D7 → E♭            | D7 rises a half step to E♭             |
| Chromatic  | Chromatic bass walk (ascending)       | C → C♯7 → D7 → E♭      | the bass walks C C♯ D E♭               |
| Chromatic  | Double chromatic approach             | C → D7 → E°7 → E♭      | E♭ encircled from both half steps      |
| Diminished | Diminished approach                   | C → D°7 → E♭           | D°7 resolves up a half step            |
| Diatonic   | Subdominant approach                  | C → A♭ → E♭            | A♭ is IV of E♭                         |
| Cadence    | Backdoor cadence                      | C → D♭7 → E♭           | ♭VII7 of E♭, a jazz and soul colour    |
| Cadence    | Plagal cadence                        | C → A♭maj7 → E♭        | IV → I, the "Amen" cadence             |
| Cadence    | Minor plagal                          | C → A♭m7 → E♭          | iv → I, gospel and pop                 |

(The reference spelled roots with sharps where the key wants flats, A♯7 and G♯maj7; the kernel spells by key.)

**Its documented patterns:** ii–V–I insertion (Cmaj7 → Dm7 → G7 → Cmaj7); tritone substitution (Am7 → D7 → D♭7 →
Cmaj7; D♭7 for G7, sharing the tritone B–F); chromatic approach (Cmaj7 → D♭maj7 → Dm7). **Uses:** songwriting,
reharmonisation, jazz study, arranging; for the app's first users, moving between a hymn's chords.

**The Chord explorer's relationships** (with it): whether two chords are diatonic in the key, the interval between
their roots ("Minor third, 3 steps"), common tones, their distance on the circle of fifths, and the voice leading
between them.

### 10.3 Tensions and reharmonisation (sub-projects 4 and 5)

**Available tensions**, by chord (root C), from the owner's table. Weak harmony: the root and 5th. Strong: the 3rd and
7th (the guide tones). Jazz: the tensions that colour it. Unacceptable: avoid notes.

| Chord   | Weak     | Strong    | Jazz                          | Unacceptable             |
| ------- | -------- | --------- | ----------------------------- | ------------------------ |
| C∆7     | C 1, G 5 | E 3, B 7  | D 9, F♯ ♯11, A 13             | D♭ ♭9, D♯ ♯9, F 11, A♭ ♭13, A♯ ♯13 |
| C−7     | C 1, G 5 | E♭ ♭3, B♭ ♭7 | D 9, F 11, A 13            | D♭ ♭9, E ♭11, F♯ ♯11, A♭ ♭13, B 7 |
| C7      | C 1, G 5 | E 3, B♭ ♭7 | D♭ ♭9, D 9, D♯ ♯9, F♯ ♯11, A♭ ♭13, A 13 | F 11, B 7        |

Other chords: C−7♭5 (C 1 weak; E♭ ♭3, B♭ ♭7 strong; G♭ ♭5 jazz); C7♯5 (C 1; E 3, B♭ ♭7; G♯ ♯5); C−∆7 (C 1, G 5;
E♭ ♭3, B 7); C9sus (C 1, G 5; F 11, B♭ ♭7; D 9); Csus♭9 (C 1, G 5; F 11, B♭ ♭7; D♭ ♭9); C−♭6 (C 1, G 5; E♭ ♭3,
A♭ ♭6). (The table's "E ♭11" in C−7 is the enharmonic 3rd a minor chord must not carry.)

**The chords that hold a melody note:** for a note N, the major chords where N is the 3, 7, 9, ♯11 or 13; the minor
chords where it is the ♭3, ♭7, 9, 11 or 13; the dominant 7ths where it is the 3, ♭7, ♭9, 9, ♯9, ♯11, ♭13 or 13. The
table spelled every note (roots as it wrote them):

| Melody | Major (3 · 7 · 9 · ♯11 · 13)                         | Minor (♭3 · ♭7 · 9 · 11 · 13)            | Dominant 7th (3 · ♭7 · ♭9 · 9 · ♯9 · ♯11 · ♭13 · 13)   |
| ------ | ---------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------ |
| G      | E♭maj7 · A♭maj7 · Fmaj9 · D♭maj7♯11 · B♭maj13         | Em7 · Am7 · Fm9 · Dm11 · B♭m13           | E♭7 · A7 · F♯7 · F7 · E7 · D♭7 · B7 · B♭7              |
| A♭     | Emaj7 · Amaj7 · G♭maj9 · Dmaj7♯11 · Bmaj13            | Fm7 · B♭m7 · G♭m9 · E♭m11 · Bm13         | E7 · B♭7 · G7 · G♭7 · F7 · D7 · C7 · B7                |
| A      | Fmaj7 · B♭maj7 · Gmaj9 · E♭maj7♯11 · Cmaj13           | G♭m7 · Bm7 · Gm9 · Em11 · Cm13           | F7 · B7 · A♭7 · G7 · G♭7 · E♭7 · D♭7 · C7              |
| B♭     | G♭maj7 · Bmaj7 · A♭maj9 · Emaj7♯11 · D♭maj13          | Gm7 · Cm7 · A♭m9 · Fm11 · D♭m13          | G♭7 · C7 · A7 · A♭7 · G7 · E7 · D7 · D♭7               |
| B      | Gmaj7 · Cmaj7 · Amaj9 · Fmaj7♯11 · Dmaj13             | A♭m7 · D♭m7 · Am9 · G♭m11 · Dm13         | G7 · D♭7 · B♭7 · A7 · A♭7 · F7 · E♭7 · D7              |
| C      | A♭maj7 · D♭maj7 · B♭maj9 · G♭maj7♯11 · E♭maj13        | Am7 · Dm7 · B♭m9 · Gm11 · E♭m13          | A♭7 · D7 · B7 · B♭7 · A7 · G♭7 · E7 · E♭7              |
| D♭     | Amaj7 · Dmaj7 · Bmaj9 · Gmaj7♯11 · Emaj13             | B♭m7 · E♭m7 · Bm9 · A♭m11 · Em13         | A7 · E♭7 · C7 · B7 · B♭7 · G7 · F7 · E7                |
| D      | B♭maj7 · E♭maj7 · Cmaj9 · A♭maj7♯11 · Fmaj13          | Bm7 · Em7 · Cm9 · Am11 · Fm13            | B♭7 · E7 · D♭7 · C7 · B7 · A♭7 · G♭7 · F7              |
| E♭     | Bmaj7 · Emaj7 · D♭maj9 · Amaj7♯11 · G♭maj13           | Cm7 · Fm7 · D♭m9 · B♭m11 · G♭m13         | B7 · F7 · D7 · D♭7 · C7 · A7 · G7 · G♭7                |
| E      | Cmaj7 · Fmaj7 · Dmaj9 · B♭maj7♯11 · Gmaj13            | D♭m7 · G♭m7 · Dm9 · Bm11 · Gm13          | C7 · G♭7 · E♭7 · D7 · D♭7 · B♭7 · A♭7 · G7             |
| F      | D♭maj7 · G♭maj7 · E♭maj9 · Bmaj7♯11 · A♭maj13         | Dm7 · Gm7 · E♭m9 · Cm11 · A♭m13          | D♭7 · G7 · E7 · E♭7 · D7 · B7 · A7 · A♭7               |
| G♭     | Dmaj7 · Gmaj7 · Emaj9 · Cmaj7♯11 · Amaj13             | E♭m7 · A♭m7 · Em9 · D♭m11 · Am13         | D7 · A♭7 · F7 · E7 · E♭7 · C7 · B♭7 · A7               |

The kernel computes this for every note and every chord quality it knows, spelling each root by the key; the table is
the test's oracle for these three qualities. Sub-project 2 shows the key's own chords that hold a note (§3.8);
sub-project 5's **Reharmonise** shows all of it, marked in key or not, each chord playable under the note.

### 10.4 Chord and scale types (sub-projects 4 and 7)

- **Chord qualities:** the kernel's 33, in families (triads; 6th & add; 7ths; 9ths & more; altered 7ths).
- **Trainers' chord choices** (the references'): triads major, minor, diminished, augmented, sus2, sus4; 7ths
  major 7, dominant 7, minor 7, minor-major 7, half-diminished (m7♭5), diminished 7; the 9ths of a key (diatonic).
- **Arpeggio types** (The Ultimate Piano's, by feel): *minor* — minor 1-♭3-5, diminished 1-♭3-♭5, minor 7
  1-♭3-5-♭7, minor-major 7 1-♭3-5-7, diminished 7 1-♭3-♭5-𝄫7, half-diminished 1-♭3-♭5-♭7; *major* — major 1-3-5,
  augmented 1-3-♯5, dominant 7 1-3-5-♭7, major 7 1-3-5-7, augmented 7 1-3-♯5-♭7; *neutral* — sus2 1-2-5, sus4 1-4-5.
- **Scale kinds** after sub-project 4: major; natural, harmonic and melodic minor; the modes Dorian, Phrygian, Lydian,
  Mixolydian, Locrian (Ionian is major, Aeolian natural minor); major and minor pentatonic; **major blues** and
  **minor blues** (today's `blues`); sub-project 4 checks for any other standard blues scale, and considers the jazz
  scales §10.7 lists (melodic minor's modes, bebop, whole tone, diminished, augmented) as lessons reach them.
- **The scale's chords** (sub-project 4): on every degree of a seven-note scale, triads, 7ths, 9ths, 11ths and
  13ths, stacked in the scale's thirds; each in every inversion it has; walked up and down.

### 10.5 Exercises (sub-project 7), the full catalogue

Every exercise is generated from a rule in any key (or all 12 in a row), at any tempo, with hands separately or
together, and opens in the Player (sheet music, Wait mode, tempo, loop, swing where its style asks). Each gets a
level (Beginner … Advanced) and a short "what it trains" line. **Research first** (the owner's instruction): each
group's exact form is taken from primary sources before sub-project 7's spec, and written for the app.

| Group                      | Exercises                                                                                                                                  |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Chords by semitones (built) | Any chord qualities root by root, a semitone at a time, up, down or up and back, in the Player (the chromatic walk, ADR 0015) |
| Scales                     | The scale up and down, one to four octaves, hands separately and together; **from any note** (thumb first, or as the scale); in 3rds; in 6ths; in groups of four (1-2-3-4, 2-3-4-5 …) and other groupings (1-3-2-4 …); contrary motion |
| Chords in a scale          | The key's chords walked up and down as triads, 7ths, 9ths, 11ths and 13ths, in root position and each inversion; broken chords; the key's chords in a progression (§3.8) |
| Arpeggios                  | Each type of §10.4, in every inversion, one to four octaves, hands separately and together                                                  |
| Barry Harris (to research) | The major 6th-diminished scale (C6 on C E G A, B°7 on the passing tones: C D E F G G♯ A B) and its chords up and down the scale in each inversion and in drop 2; the minor 6th-diminished scale (Cm6 with B°7); the descending dominant (bebop) scale with the half-step rule that puts chord tones on the beats; arpeggios from the 3rd of a chord (3-5-7-9); 7th chords in drop 2 |
| Piano With Jonny (§9.4)    | 2-5-1 scale over shells (swing); inner voice over the key's 7th chords; modes with the parent fingering; rapid switch through the 12 keys; pattern shifting (melodic sequences) |
| Progressions in every key  | ii–V–I, I–vi–ii–V, round the circle of fifths, and the library of §10.1, in all 12 keys with inversions for smooth voice leading              |
| Technique                  | Hanon's *The Virtuoso Pianist* (public domain), the first part's exercises in any key; five-finger positions for beginners (C, G, F … and their minors) |

### 10.6 Trainers (sub-project 7)

Every trainer: a **choices sheet** (what it asks about), **Levels** (a ladder, each a fixed number of rounds so
results compare) or **Custom**, **run until stopped** or **N rounds** (10 by default), answers by tap, typing or MIDI,
**auto-next** and **reveal the answer** (after a timer, or after as many notes as the answer has) as settings, the
correct answer shown beside yours, a **session summary** (accuracy, average answer time, the ones missed) and
**progress** per trainer (runs, average, the in-session streak and best; no daily streak, PRODUCT.md). Gaps come
from the answers as today (§4.6 of the master spec) for the skills they rate.

| Trainer                         | What it asks                                                                                                           |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Build chord (today's)           | A chord symbol: play it (the steinway trainer's Play a chord)                                                          |
| Name chord (today's)            | A chord played: name it; **the quality only** as a choice; block or arpeggio, up or down, an octave shift               |
| Build scale (today's)           | A scale: play it                                                                                                        |
| Intervals by ear                | Twelve within the octave and the extended (compound) ones; ascending, descending or harmonic; answers with name and semitones |
| Chords by ear                   | Major, minor, diminished, augmented, major 7th, minor 7th, dominant 7th, diminished 7th; block or arpeggio              |
| Scales by ear                   | Major, natural and harmonic minor, the modes; ascending or descending                                                   |
| Reading notes                   | A note on the staff: play it (the ladder below); single or grand staff; note names shown or not                         |
| Reading chords                  | A chord on the staff (with its key signature): name it (Clefs' chord trainer)                                           |
| Key signatures                  | How many sharps or flats in a key; which key a signature on the staff is                                                |
| The degrees of a key            | Play the key's degrees in order                                                                                         |
| A chord's role                  | The key's tonic heard, then a chord: which degree or function                                                           |
| The degrees of a song           | A section of one of the app's pieces played: mark each chord's degree on its beat (an eighth-note count grid)           |
| Progressions                    | A progression in a key: play it (with the circle of fifths)                                                             |
| Arpeggios                       | An arpeggio type in a key: play it, cycle after cycle                                                                   |
| My gaps (today's)               | Gap skills first, then unknown skills from pieces practised                                                             |

**The chords ladder** (The Ultimate Piano's, sixteen levels): 1 the three main chords of C (I, IV, V); 2 all chords of
C major (all seven degrees); 3 1st inversion in C (the third in the bass); 4 2nd inversion in C (the fifth in the
bass); 5 all positions in C (root, 1st and 2nd mixed); 6 7th chords of C major (Imaj7, ii7, V7 … all seven); 7 main
chords in A minor (i, iv, V7, the dominant from harmonic minor); 8 all chords of A minor (harmonic minor); 9 main
chords in G and F (one sharp more, one flat); 10 all chords of G and F (the two neighbouring keys); 11 all positions in
G and F (inversions in two more keys); 12 major triads (all 12 roots); 13 minor triads (all 12 roots); 14 major and
minor, all positions (all roots, all inversions); 15 all 7th chords (maj7, min7, dom7, all roots); 16 diminished and
augmented (the special cases). Beside it: **General** and a **Custom chord list**; switches Show chord name, Show
chord in score.

**The notes ladder** (fifteen levels): 1 the three anchors (bass F, middle C, treble G); 2 anchors everywhere (C, F
and G in octaves 3–5); 3 treble: five-finger (C4–G4, one hand position); 4 treble: lines (E G B D F); 5 treble:
spaces (F A C E); 6 treble clef (C4–G5, no accidentals); 7 bass: five-finger (C3–G3); 8 bass: lines (G B D F A); 9
bass: spaces (A C E G); 10 bass clef (F2–B3, no accidentals); 11 both staves (F2–G5, the full grand staff); 12 both
staves, wider (C2–C6, four octaves); 13 with accidentals (C4–B4, sharps and flats); 14 ledger lines (above and below
the staff); 15 the full range (A0–C8, every key). Beside it: **Create your own**; a switch Show note name.

**Ear training's choices** (The Ultimate Piano): *Intervals* — minor 2nd, major 2nd, minor 3rd, major 3rd, perfect
4th, tritone, perfect 5th, minor 6th, major 6th, minor 7th, major 7th, octave; direction ascending, descending; how
many times. *Chords* — major, minor, diminished, augmented, major 7th, minor 7th, dominant 7th, diminished 7th; how to
play: block or arpeggio; how many. *Scales* — major, natural minor, harmonic minor, Dorian, Phrygian, Lydian,
Mixolydian; direction; how many. Progress: a streak, the average (50%), runs, details.

### 10.7 Lessons (sub-project 5)

**A lesson** is a worksheet (§9.8): title, one-paragraph summary, level (Beginner, Late beginner, Intermediate, Late
intermediate, Advanced), category (Chords, Scales, Theory, Accompaniment, Jazz, Gospel, Reading, Rhythm), and blocks:
prose; a heading; an example (a chord, a scale, a progression, a line) that plays and shows on a keyboard and on a
staff, in place; a 12-root grid (Pianote's); a quiz answered on the keyboard (Pianote's pop quizzes); a note (a
callout); a link the learner chooses to an explorer, a trainer or an exercise. Learn's lesson list filters by level
and category (The Ultimate Piano's worksheets page).

**Modules** (TJPS's shape, which the owner sent, with the app's church accompaniment first):

- **Fundamentals:** finding home on the keys; the staff and note reading; whole and half steps; how major scales work;
  the minor scales; the chromatic scale (Clefs' article); intervals (Clefs' reference); triads (Pianote's); chord
  symbols (today's reading notes); inversions; the chord family of a key (one scale, seven chords); key signatures and
  the circle of fifths; rhythm and meter.
- **Accompaniment** (the app's first users): Боброва's seven accompaniment types; Called to Play's five ways and its
  right-hand techniques; bass and chords; broken chords; arpeggio patterns; accompanying a hymn; common progressions in
  major and minor keys; passing chords between a hymn's chords; reharmonising a melody note.
- **Jazz, in TJPS's modules:** *the basics* (overview, scales, modes, chords and intervals, keys, harmony, swing vs
  straight, jazz for beginners, practising jazz, sheet music); *jazz chords* (extensions and alterations, available
  tensions, shell chords, chord substitution, passing chords, secondary chords, borrowed chords, suspended chords,
  Phrygian chords, slash chords, harmonic rhythm, polychords, modulation); *jazz scales* (the chord-scale system,
  scales over chords, melodic minor's modes, bebop scales, whole-tone, diminished, pentatonic, augmented, minor
  scales, selecting scales, tritone substitution and scales, synthetic scales); *improvisation* (creating tension,
  playing inside, guide tones, embellishing the melody, avoid notes, dissonant intervals, passing notes,
  side-slipping, cycled patterns, symmetrical scales, clichés and quoting, displacing the melody, chord mapping,
  ii–V–I licks and exercises, analysing a solo, chordal improvisation, rhythm and articulation, octave displacement,
  vertical improvisation, triad pairs); *voicings* (rootless, Monk, Powell, three-note, open, So What, Barron,
  Hancock, quartal, upper structures, locked hands, combining voicings, voicing rules, how to comp, walking bass
  lines, tone clusters, comping for a vocalist, stride); *progressions* (common progressions, the circle of fifths,
  the minor ii–V–i, rhythm changes, Coltrane changes, bird changes, line clichés, constant structures, lead sheets,
  contrafacts, voice leading, harmonic analysis, contiguous ii–Vs, disguised chords, turnarounds);
  *reharmonisation* (making a song jazzy, reharmonisation, changing the meter, tonal to modal, ii–V substitution,
  **gospel reharmonisation**, changing genre); *modern jazz theory* (tonal vs modal, modal jazz, pedal point, and the
  rest as the owner's learning reaches them); *genres* (blues piano, swing, bebop, cool, hard bop, bossa nova, modal,
  **gospel-jazz**, jazz blues, funk).
- **Gospel** as its own module where the owner's church playing needs it: gospel progressions (§10.1), passing chords,
  reharmonisation.

Which lessons come first is Claude's call (the owner left it): the Fundamentals and the Accompaniment modules, in
that order, then gospel, then jazz's basics and chords. Every lesson in English and Russian.

### 10.8 Keys and the circle of fifths (sub-project 4)

- **The circle:** 12 major keys outside, their relative minors inside, each key's signature on a small staff; choosing
  a key lights its six neighbours' functions (I, IV, V, ii, iii, vi, vii° in major; i, ii°, III, iv, v, VI, VII in
  minor) and dims the rest; the key's diatonic chords as a row to tap; a random key; play the key's chords.
- **A key page** (§9.6): the signature on a staff; the notes; the relative key and the modes that share the notes; the
  chords with numerals, inversions and the common borrowed ones, each playable; common progressions; the app's pieces
  in the key; a link to its scale and to Chords mode.

### 10.9 Intervals (sub-project 5)

One card per interval, unison to octave and the compound ones to the 13th: its name and short name (P1, m2, M2, m3,
M3, P4, tritone, P5, m6, M6, m7, M7, P8; m9, M9, P11, ♯11, P12, m13, M13), whole tones and semitones, consonance
(perfect consonance, imperfect consonance, dissonance), the interval on a staff and on the keys, and Ascending ·
Descending · Harmonic, each played and shown going down on the keyboard (Clefs' reference).

## 11. Best practices

### 11.1 Interface (sub-project 2 researches Apple's Human Interface Guidelines before its spec)

- **The owner's bar:** "the best UI, not cluttered, like Apple's design guidelines". Simple beats complete on any one
  screen; depth behind progressive disclosure; when a screen feels busy, remove rather than rearrange (Mindscape's
  PRODUCT.md).
- **Choosing:** a **pop-up button** (dropdown) to choose one of many (root, type, key, pattern); a **segmented
  control** for two to five options; a **switch** for on or off; a **sheet** for settings changed less often; a
  **popover** anchored to its button for a few quick choices (the Player's tempo and hands, the keyboard's settings).
  Never a wall of chips or tiles. The HIG pages to read: pop-up and pull-down buttons, segmented controls, sheets,
  popovers, toolbars, tab bars, layout, accessibility. Colour, typography and app icons were read and applied on
  2026-09-27 (§9.11, ADR 0011): a spec keeps their rules (one meaning per colour, colour on one control, a neutral
  "chosen", both themes and increased contrast, Onest on every control).
- **One primary action per screen**, in the thumb zone; destructive actions out of the resting thumb arc, confirmed.
- **44px targets** (44pt, Apple's minimum), 8px between them; a control's footprint includes its focus ring, press
  and drop; icon-only buttons have labels.
- **Every page earns its place** (§3.2): no middle man, no redirect a learner did not choose, no "coming soon".
- **Every state:** loading, empty, error and offline on every surface; a missing state reads as a crash.
- **Motion** means something and animates transform and opacity only; `prefers-reduced-motion` honoured.
- **Space:** the screen is small; what matters while playing comes first; nothing gets its own row that can live in
  an existing one (the keyboard's rail, §3.1).

### 11.2 From Mindscape's guides (read in full for this roadmap)

§4.5 lists what the sub-projects take. In addition, from its `CODE_STYLE.md` and `MOBILE_DESIGN.md`: one centred
column on large screens, never edge to edge; `dvh`, never `vh`; `min-w-0` on flex children so text truncates; safe
areas through utilities; overscroll contained; a sheet's long content scrolls inside it; one overlay at a time;
bottom sheets over centred dialogs; spring physics for finger-driven motion, eased tweens for chrome, 150–300ms in
page, longer for full-height surfaces; direction encodes hierarchy (sheets rise and fall, forward moves inward);
semantic tokens only, no scattered `dark:`; variants as lookup maps of full class strings; compound components over
wide prop lists; one exported component per file, about 200 lines each; logic in hooks and pure logic in `lib` or
`model`; a page's state in one hook, its test surface; confirmations as one pending value, never a flag each; long
lists windowed; heavy dependencies in their own lazy chunks, off the first paint; an installed app locks zoom and
selection outside fields (built by sub-project 1's follow-up, `#standalone-boot`).

### 11.3 Practice

- **Contextual over mechanical** (PWJ): scales as music uses them, the left hand comping, not parallel octaves for
  their own sake.
- **The practice loop** (The Ultimate Piano): warm up about 5 minutes; learn at 50%; step through hard passages; raise
  the tempo step by step (speed training); play along at full tempo; loop the rough spots.
- **Two tempos** per exercise, moderately fast and slow (PWJ); then other keys, nearest first (C, G, F).
- **Levels with fixed rounds**, so results compare between runs (The Ultimate Piano).
- **Principles over single songs** (The Ultimate Piano's worksheets): inversions, voice leading, common progressions
  and the ear carry to hundreds of songs; the app also teaches its songs (Flowkey's way), so it does both.
- **Evidence, not guesses** (PRODUCT.md): gaps come from answers; nothing is locked; streaks never pressure.

### 11.4 Content

- Written for the app from primary sources (§4.4); every text in English and Russian; note and chord names
  international; spellings by the kernel, never a sharp or flat table.
- Lessons teach music, never the app's buttons (§4.3).

## 12. Seen in the references, not yet decided

Each is for the named sub-project's spec to settle (a decision, or "not for this app" with its reason). Sub-project 3
settled its four (its spec §2.9, ADR 0013): lyrics under the staff are planned (§5); a single staff whose clef follows
the range, the metronome's drum grooves and tap tempo, and a MIDI sustain pedal are not for this app (§5).

| Item                                                                                         | Seen in                          | Sub-project |
| -------------------------------------------------------------------------------------------- | -------------------------------- | ----------- |
| Rhythm training                                                                              | Clefs' Exercises                 | 7           |
| A chord chart generator (a progression's diagrams at once)                                   | The Ultimate Piano               | 5           |
| A lead-sheet editor with sections and lyrics (ChordPro export)                               | The Ultimate Piano               | 9           |
| Mark other keys (show the keys outside a scale)                                              | The Ultimate Piano's learn view  | 4           |
| A key chosen for spelling what is played (the live score)                                    | The Ultimate Piano               | planned     |

## 13. Today's app, as the owner saw it (2026-09-25)

| Seen                                                                                      | Cause                                                                   | Where it is fixed |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------- |
| A key sounds late on touch and click                                                      | Keys played on `click` (on lift) and taps waited `PLAY_DELAY` (100 ms)  | 1 (built)         |
| A scale's keys half coloured                                                              | A scale's note was a band over the key's lower 40%                      | 1 (built)         |
| An arpeggio's keys all coloured, the sounding one only dimmed                             | Overlapping notes all "sounding", all under the same tint               | 1 (built)         |
| No Stop after Play                                                                        | Play buttons only started sound                                         | 1 (built)         |
| Keys stubby on one screen, a thin strip on another (the desktop Player)                  | Each screen set a fixed height                                          | 1 (built)         |
| The Path: 63 steps in one list, all at level 1, rows that open other tabs                 | Levelling left for Phase 4; steps link to Songs or Theory               | 6                 |
| Theory's Symbols repeats Chords                                                           | The dictionary lists what Chords chooses                                | 2 (built)         |
| The Player's grid of notes (`Bm · Next · RH/LH · F♯4⁵ …`)                                 | No sheet music                                                          | 3 (built)         |
| Too many options visible (rows of chips on Chords and Scales; the Setup sheet)            | Every choice laid out at once                                           | 2 (built)         |
| The Pattern page: a long list of names and paragraphs, nothing to see or hear             | Patterns are only text in the picker                                    | 8                 |
