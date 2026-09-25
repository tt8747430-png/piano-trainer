# Next features: the roadmap

- **Status:** agreed with the owner 2026-09-26, after a grilling session (twenty questions, answered one at a time)
  over the owner's requests and reference material. It splits the work into nine sub-projects, orders them, records
  every decision the session took and the ones the owner left to Claude, and lists what is planned but not built.
  Each sub-project gets its own spec, plan and build.
- **Builds on:** the master spec (`2026-09-24-piano-trainer-rewrite-design.md`), the screens spec
  (`2026-09-25-phase-3-screens-design.md`) and the live-keyboard design (`2026-09-25-live-keyboard-design.md`).
- **Read first:** Mindscape's (`~/projectsGIT/memory-palaces`) `CLAUDE.md`, `docs/CODE_STYLE.md`,
  `docs/MOBILE_DESIGN.md` and `PRODUCT.md`, as the owner asked; §4.5 says what the sub-projects take from them.

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

**References the owner sent:** Clefs (home, theory articles, the intervals reference, a practice result), Flowkey's
player (tempo, hands, loop), steinway.web.app (the trainer's five modes and settings), Piano With Jonny's "5 Major
Scale Exercises", Pianote's "How to Play ALL Piano Chords", Hooktheory's key cheat sheet, The Ultimate Piano (its
app: settings, learn mode, circle of fifths, passing chords, progression generator, practice with levels, ear
training, the sheet music player; and its guides, worksheets and docs), a reharmonisation table (available tensions
per chord; the chords that carry a melody note) and The Jazz Piano Site's lesson modules.

## 2. Sub-projects, in order

| #   | Sub-project                          | Delivers |
| --- | ------------------------------------ | -------- |
| 1   | **The playable keyboard**            | Piano-like keys in real proportions; note names C · All · None; a key sounds the instant it is touched; **Scroll** and **Glissando**; key sizes Fit · Large · Whole piano; the keyboard map (off by default); a small options button in the keys' rail; the computer keyboard as a piano; finger numbers in circles under the keys; a scale's notes colour whole keys; the key sounding now stands out alone; Stop on every Play; a Keyboard group in Settings |
| 2   | **Navigation and options**           | The tabs **Path · Songs · Learn · Practice**; Theory becomes Learn (the Chords and Scales explorers, the chord dictionary as a reference, the reading notes as the first lesson); the quiz and My gaps move to Practice; every screen's choices become dropdowns and segmented controls with a sheet for the rest, after researching Apple's Human Interface Guidelines |
| 3   | **Notation and the sheet-music Player** | `shared/lib/notation` and a VexFlow staff (§4.1); the Player in Flowkey's shape (§3.5); the Player can play a fixed score as well as an arrangement; swing; speed training in the loop; **Chord size** replaces the Player's "voicing" |
| 4   | **Scales and chords, deeper**        | The church modes and major and minor blues as scale kinds; **Start on** any note of a scale with fingering *From the thumb* (default) or *As the scale*; the scale's chords as triads, 7ths, 9ths, 11ths and 13ths, in inversions, and *Walk the chords*; the scale as sheet music with the keyboard; a key page for each of the 24 keys and the circle of fifths |
| 5   | **Learn: lessons, references, tools** | Lessons like The Ultimate Piano's worksheets (a level, a category, live diagrams that play in place), in modules from fundamentals to accompaniment to jazz and gospel (TJPS's shape); references (intervals, available tensions, chord symbols); tools: Progressions, Passing chords, Chord explorer, Reharmonise, and chord detection (the app names what you play) |
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
  it is and moves an octave at a time by ‹ ›.
- **"Full mode"** is the key size **Whole piano**. A full-screen keyboard is not built now: it waits for recording
  from a MIDI keyboard (§5), where it makes sense.
- **Key sizes** Fit · Large · Whole piano, not a start octave and an octave count (the owner left it to Claude: Fit
  asks nothing of the learner; a chosen stretch suits teaching diagrams, not playing).
- **The keyboard map** (a strip of all 88 keys framing the part in view) is off by default, with a setting.
- **Controls** live in Settings, plus a small options button in the keys' dark rail, with no extra row: the screen
  is small and every control must earn its space, what matters while playing first.
- **The computer keyboard plays**, on by default on computers, off on phones.
- **Finger numbers** sit in circles under the keys; a key carries its degree or note name.
- **A scale's notes colour the whole key**, never half of it.
- **The key sounding now stands out alone:** while a chord is arpeggiated or a run plays, the other marked keys go
  quiet.
- **Every Play becomes Stop** while its sound plays.

### 3.2 Navigation and options (sub-project 2)

- Four tabs: **Path · Songs · Learn · Practice**. Settings stays behind the gear on Path.
  - **Learn:** lessons, references (Chords, Scales with the modes, Keys with the circle of fifths and key pages,
    Intervals, Chord symbols, Available tensions), tools (Progressions, Passing chords, Chord explorer, Reharmonise).
  - **Practice:** exercises and trainers.
  - **Songs** holds your own scores (the editor, and later recording), The Ultimate Piano's "Create".
- **Symbols** goes: its reading notes become a lesson and its dictionary a reference.
- **Choices are dropdowns**, not rows of chips; segmented controls for two to five options; a sheet (a panel rising
  from the bottom) for settings changed less often. The pattern is Apple's; sub-project 2 researches the Human
  Interface Guidelines before its spec.
- **Every page earns its place** (the owner's rule): a screen does its job in place, or is a link the learner chose
  knowing where it goes. Recorded in CODE_STYLE §1 by sub-project 2.

### 3.3 Scales, exercises and trainers (sub-projects 4 and 7)

- **The church modes are Scale kinds**; a **Key** stays major or minor (a song is written in one). The code's `Mode`
  (`'major' | 'minor'`, `shared/lib/music/key.ts`) is renamed when the modes arrive.
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

- **Tempo popover:** **Wait mode** (today's Your turn), 50%, 75%, 100% or any tempo; speed training.
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
Scale kind), **Study** (a method book's lesson piece: the Piece kind `exercise` becomes `study`), **Exercise** (a line
generated from a rule in any key, in Practice), **Wait mode** (was Your turn), **Chord size** (triads, 7ths, 9ths:
was the Player's "voicing"), **Voicing** (how a chord's notes are laid out: shell, rootless, drop 2, quartal).

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
- Every gesture has a visible alternative: Glissando's swipe has ‹ ›; the editor's shortcuts have buttons.
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

**Not for this app:** audio and YouTube players, streaming overlays, image export, cloud storage, branding, kids'
icons (they need a network, an account or another audience), PDF scores (see §3.6), MuseScore's own `.mscz` files
(MuseScore exports MusicXML).

## 6. What this changes in the product record

When the sub-project that makes each change true ships: PRODUCT.md (sheet music and lessons leave "No …"; the
screens list; the reference products), the master spec's "Not in scope", DESIGN.md, CODE_STYLE, the glossary (terms
already settled above), ADRs and CLAUDE.md's architecture.
