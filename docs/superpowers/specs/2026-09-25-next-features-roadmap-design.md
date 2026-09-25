# Next features: the roadmap

- **Status:** decided 2026-09-25. The owner asked for five things at once, with reference screenshots, and asked that
  Mindscape's (`~/projectsGIT/memory-palaces`) guides to UI, spacing, selected states and responsive layout be read
  first. They are too many for one spec, so this document splits them into seven sub-projects, orders them, and takes
  the decisions they share. Each sub-project then gets its own spec, plan and build. Claude's decisions are argued
  where they are not obvious (the owner drives by references, not menus).
- **Builds on:** the master spec (`2026-09-24-piano-trainer-rewrite-design.md`), the screens spec
  (`2026-09-25-phase-3-screens-design.md`) and the live-keyboard design (`2026-09-25-live-keyboard-design.md`).

## 1. What the owner asked

In the owner's words, then what Claude reads them to mean. Where a reading is a guess, it says so; the sub-project's
spec is where a wrong guess is cheapest to correct.

| # | Asked                                                                                                  | Read as |
| - | ------------------------------------------------------------------------------------------------------ | ------- |
| 1 | "A more adaptable keyboard: switch the full mode or not the full mode keyboard, or switch between GarageBand's glissando or scroll mode. The keyboard look should be improved." | Every keyboard can change its key size (down to the whole piano at once), open full screen, and switch GarageBand's **Scroll** (a swipe moves the keyboard) and **Glissando** (a swipe plays the keys it crosses). The keys look like a piano's. "Full mode" is read both ways, the whole piano in view and a full-screen keyboard, since both are cheap once the keyboard is adaptable. |
| 2 | "More modes of the piano."                                                                             | The trainer modes of the owner's reference trainer (steinway.web.app: Play chord, Guess chord, Intervals, Keys, Songs) and of Clefs (Ear training, Drills, reading notes on the staff). **A guess**: it could also mean more GarageBand keyboard modes; those are covered by 1 as far as a piano needs them. |
| 3 | "The Path tab is misleading: tapping some options just redirects to the Chords or Songs tab."          | A Path step opens a page of its own that teaches and practises it there, instead of dropping the learner into another tab. |
| 4 | "Theory and levels should have real pages, not redirects. All pages and options must be useful, not middle men. Look at these theory things" (Clefs' Intervals Reference, its Chromatic Scale article). | Theory becomes a library of real pages: written lessons and references with notation, sound and keyboard; each level of the Path gets a page. Written theory lessons were out of scope in the master spec (§1); they are in scope now. |
| 5 | "Real sheet music of our songs in practice, not just the keyboard" (Flowkey: keyboard above a grand staff, a cursor, chord symbols over numbered bars, a loop, hands and tempo popovers, Wait mode). | The Player shows the arrangement as a grand staff that follows the playing. Sheet-music rendering was out of scope in the master spec (§1) and PRODUCT.md; it is in scope now. |
| 6 | "Edit the scores and the notes, at least on a computer for now."                                       | A score editor for a computer (mouse and keyboard, optionally MIDI): the learner edits a piece's notes and chord symbols and keeps it as their own version, which the Player then plays. |
| 7 | "The patterns are too cluttered, I can't edit or manage them, and nowhere explains what they mean."     | Patterns get pages that show each one in notation and on the keys, with sound; a calmer picker in the Player; favourites and hiding; and an editor for the learner's own patterns. |

## 2. Sub-projects, in order

Each is a spec → plan → build cycle and ships on its own, green (`typecheck`, `lint`, `test`, `build`).

| Order | Sub-project                   | Asks | Needs      | Delivers |
| ----- | ----------------------------- | ---- | ---------- | -------- |
| 1     | **The playable keyboard**     | 1    | —          | Piano-like keys; key size Fit · Large · Whole piano; Scroll · Glissando; a navigator strip over the whole piano; note labels; the computer keyboard as a piano; a full-screen keyboard; a Keyboard group in Settings |
| 2     | **Notation and the sheet-music Player** | 5 | —   | `shared/lib/notation` (a Performance → a score of measures, staves, voices, spelled notes, ties and beams); a staff renderer (VexFlow, §3.1); the Player's **Sheet** view: grand staff with chord symbols and bar numbers, a cursor that follows Listen, Step and Your turn, tap a note to jump there, a loop over chosen bars; hands and tempo in toolbar popovers (Flowkey), Your turn named "Wait mode" in the tempo popover's sense |
| 3     | **Theory as real pages**      | 4    | 2          | A Theory home (lessons, references, the explorers); the lesson format (content as code, text + notation + keyboard + sound blocks, both languages); references: Intervals (Clefs' cards: staff, semitones, consonance, Ascending · Descending · Harmonic), Key signatures (the circle of fifths), the chord dictionary; the first lessons |
| 4     | **The Path as a course**      | 3, 4 | 3          | A page per level and per step: a step's page teaches and practises it in place (an explorer, a check, a song's warm-up with its chords and pattern) and never redirects; the Path home shows levels as cards; the steps ordered and levelled 1–4 (master spec §11, Phase 4's first task, moved here) |
| 5     | **Trainers**                  | 2    | 2 (reading notes, key signatures on a staff) | A Train tab (§3.4): chord quality by ear, intervals by ear, key signatures, the degrees of a key, a chord's function in a key, the degrees of a song (a bar of one of our pieces), reading notes on the staff; each with its choices sheet, auto-next and a session summary; the Theory quiz and My gaps move here |
| 6     | **Patterns**                  | 7    | 2          | A page per pattern (its idea in one line, each hand's figure in notation over a C chord, heard and shown on the keys, the songs that use it); a calmer picker; favourites and hidden patterns; an editor for the learner's own patterns (a step grid per hand: chord tones by subdivision) |
| 7     | **The score editor**          | 6    | 2          | Edit a piece's score on a computer: select, move a note by step or octave, change a duration, add and delete notes and rests, chord symbols; undo and redo; input by mouse, computer keyboard or MIDI; saved as the learner's version, which the Player plays and which can be reset to the original |

**Why this order.** The keyboard is on every screen and needs nothing, so it goes first and every later screen gets
the better one. Notation is the foundation of 3, 5, 6 and 7, and the sheet-music Player is its first and most asked-for
use, so it comes second. Theory's pages come before the Path's because a step's page is built from the same lesson
blocks and explorers. The trainers need the staff for reading notes and key signatures. Patterns' pages need notation
and their editor reuses the editor grid ideas at a smaller scale. The score editor is the largest and the most
computer-bound, and depends on everything notation does, so it goes last.

**Phase 4** (master spec §11) keeps its switch-over (the Russian review, the parity check, pointing production at
Vercel, deleting `legacy/`). Its first task, levelling the Path, moves into sub-project 4, because a course with real
level pages is where levels are decided.

## 3. Decisions the sub-projects share

### 3.1 Notation is VexFlow, over a score model of our own

- **Rendering:** VexFlow 5 (MIT, TypeScript, SVG output; the latest stable release). It engraves what it is given:
  staves, clefs, key and time signatures, notes, accidentals, beams, ties, chord symbols, text. It does not decide
  *what* to engrave, which is what an editor and a cursor need to own anyway.
- **Not chosen:** OpenSheetMusicDisplay (reads MusicXML only, so every change would round-trip through a MusicXML
  string, and its cursor and selection are its own); abcjs (engraves ABC text: simple, but a WYSIWYG editor and a
  per-note cursor fight its text model); Verovio (LGPL, a multi-megabyte WebAssembly build, too heavy for a PWA that
  precaches everything).
- **The score model** is pure TypeScript in `shared/lib/notation`, fenced like the kernel: it imports only `music`
  (and itself). It turns a `Performance` into measures, staves (treble for the right hand and the tune, bass for the
  left), voices, durations, ties across beats and bars, beams and accidentals as a measure needs them, with notes
  spelled by the kernel (CODE_STYLE §8: spelling is never a sharp or flat table). It is what the editor edits and what
  the cursor walks, and its tests say what a bar looks like without a browser.
- **The renderer** is one presentational component in `shared/ui` over VexFlow, lazy-loaded with the screens that
  use it, so VexFlow never enters the first paint. Its music font is self-hosted and precached (offline is normal,
  PRODUCT.md); sub-project 2 verifies how VexFlow 5 loads a local font before its plan is written.

### 3.2 Content stays code; the learner's own things are saved state

- **Lessons** (sub-project 3) are content as code (ADR 0002): `entities/lesson/content/<id>.ts`, one file per lesson,
  typed blocks (text, a staff example, a keyboard example, a play button, a list, a link to an explorer or a trainer),
  every text `LocalText`, validated by a catalog test like pieces are.
- **The learner's own work is saved state:** their score versions (7) and their patterns, favourites and hidden
  patterns (6) are new persisted zustand stores over `safeLocalStorage()`, each with a `version`, a `migrate` and a
  sanitising `merge` (CLAUDE.md, "Saved data keeps working"). Settings gain a `keyboard` group (1, version 3), and
  the trainers' evidence extends `pt-progress` (5). Their exact shapes are each sub-project's to decide.
- **Nothing leaves the device.** No accounts, sync or backend: that line of the master spec stands.

### 3.3 Copy: lessons are the exception to "never explain the obvious"

PRODUCT.md's principle 3 ("no how-to paragraphs") keeps ruling the interface. Theory's lessons and the patterns'
one-line explanations are teaching content, not instructions for the app, so they are the exception, as the reading
notes already are (CODE_STYLE §10). A lesson explains music; it never explains a button.

### 3.4 Navigation gains a fourth tab

The tab bar becomes **Path · Songs · Theory · Train** in sub-project 5: Theory is for learning and looking things
up, Train is for being asked. The Theory quiz and My gaps move to Train then; until sub-project 5, Theory's home lists
the quiz as today. Four items fit the floating tab bar and the left rail as three do.

### 3.5 Every page earns its place

The owner's rule ("all pages and options must be useful, not middle men or redirects") is a design rule from here on,
recorded in CODE_STYLE §1 by sub-project 4: a screen either does its job in place or is a link the learner chose with
full knowledge of where it goes (a chord chip that opens the explorer on that chord, a song's Practise). A list row
that silently opens a different tab is the fault this rule removes.

### 3.6 Mindscape's guides, as they apply here

Read for this roadmap: memory-palaces' `CLAUDE.md`, `docs/CODE_STYLE.md`, `docs/MOBILE_DESIGN.md` and `PRODUCT.md`.
This repo's CODE_STYLE already adapts most of them. What the sub-projects take from them in addition, each into its
own spec where it applies:

- **One header height and one set of header parts** (their §4a): the new pages (lessons, references, level and step
  pages, pattern pages, the editor) use `ScreenHeader`; none hand-rolls a bar.
- **A control's footprint includes its states** (their §5): a selected chip's ring or a pressed key's drop must not
  be clipped by a scrolling row; siblings gap by at least the focus ring (`gap-2`).
- **Two names for a panel on the page** (their §5): a card a learner acts on and a note they read; a tint is a status,
  never a panel. Lessons' callouts are notes.
- **Every gesture has a visible alternative** (their MOBILE_DESIGN §5): in Glissando a swipe plays, so the keyboard
  moves by its navigator strip (tapped, dragged, or stepped an octave at a time); the editor's shortcuts have toolbar
  buttons.
- **One surface owns the finger at a time** (their §12): the keyboard in Glissando takes the finger from the page
  (`touch-action: none` on its keys), and a sheet over it takes it back.
- **Loading, empty, error and offline states on every surface** (their MOBILE_DESIGN §10), **one primary action per
  screen**, **44px targets with 8px between them**, **thumb zone** for primary actions, **`prefers-reduced-motion`**.

## 4. What this changes in the product record

When the sub-project that makes each change true ships, not before:

- PRODUCT.md: sheet-music rendering (2) and written theory lessons (3) leave "No …"; the screens list grows; the
  reference products gain the owner's reference trainer (steinway.web.app) and Clefs' theory pages.
- The master spec's §1 "Not in scope" loses sheet-music rendering and written theory lessons, with a pointer here.
- DESIGN.md, CODE_STYLE, the glossary, ADRs and CLAUDE.md's architecture follow each sub-project's code.
