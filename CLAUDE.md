# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Answer style

Concise. Answer first. No preamble, no recap.

Piano Trainer: an offline-first PWA for learning songs, chords and scales at the piano. React 19 + Vite + strict
TypeScript, **Feature-Sliced Design** (lint-enforced), English + Russian, deployed on Vercel. Design:
[spec](docs/superpowers/specs/2026-09-24-piano-trainer-rewrite-design.md).

## Skills — before writing code

- `tdd` → every module, test first (red → green → refactor).
- `vite-react-best-practices` / `vercel-react-best-practices` → performance, bundle, Vite SPA
  ([CODE_STYLE](docs/CODE_STYLE.md) §7).
- `vercel-composition-patterns` → component APIs (§4).
- `shadcn` → anything in `src/shared/ui/primitives` (add with the CLI, never by hand).
- `impeccable` → visual design work (Phase 3 chooses the direction).
- `vercel:knowledge-update` → before touching `vercel.ts` or anything Vercel.
- **Not applicable:** React Native, Next.js and Angular skills.

Non-trivial feature → `superpowers:brainstorming` first; specs in `docs/superpowers/specs/`, plans in
`docs/superpowers/plans/`.

## Change rules

- **Latest stable dependencies, no legacy in code.** Pinned majors: TypeScript 6, Vitest 4, jsdom 29, jest-dom 6,
  eslint-plugin-boundaries 6, and `@vite-pwa/assets-generator` 1 (the range `vite-plugin-pwa` accepts). Bumping
  one is its own change.
- **Saved stores read one version (ADR 0038).** Persisted stores (`pt-settings`, `pt-progress`, …) are
  `createSavedStore`s: they carry a `version`, read a save of that version field by field through one sanitiser (a
  field added later reads as its default), start from their initial state over any other version's save, and
  follow another tab's saves of their version. Until release the app has no users: a shape change bumps the version,
  with no migration and no reader of old saves. The built-in content always works.
- **Staged is deliberate.** Never `git checkout`/`restore`/`stash`/`reset` the owner's work unprompted.
- **New code copies the nearest slice's shape.** Writes → a feature command. Reads → selectors. Pure logic →
  `shared/lib` or `entities/*/model` with a colocated test.
- **Complete, not placeholder.** Every UI string in both `en` and `ru`. Loading, empty, error and offline states.
- **Verify before claiming done:** `npm run typecheck && npm run lint`, then **only the tests your change can
  break**: the files you touched and their importers (`npm run test:related -- <changed source files>`, or
  `npm run test:changed` for everything uncommitted). The full `npm run test` takes minutes: run it once before a
  push that touches shared code (`shared/lib`, an entity's model, `app/`, the test setup or config), never after
  each edit; CI runs it on every push anyway. After touching startup, routing, the PWA or config, also
  `npm run build`.

## Commands

Node 24 (`.nvmrc`, `nvm use`). CI (`.github/workflows/ci.yml`) runs `typecheck`, `lint`, `test:cov` and `build`
on every push and PR; Vercel previews each PR and deploys `main`.
`dev` · `build` · `preview` · `typecheck` · `lint` (includes the layer rules) · `test` (everything) /
`test:unit` (the node half, about two minutes) / `test:related -- <files>` (the tests that import them) /
`test:changed` (the tests uncommitted changes reach) / `test:watch` / `test:cov` (90% lines on `src/shared/lib/**`
and `src/entities/*/model/**`) · `icons` (regenerates the PWA icons from `public/favicon.svg`).
One file: `npx vitest run src/shared/lib/cn.test.ts` · one test: `npx vitest run src/x.test.ts -t "saves a new
language"` (always with its file: `-t` alone still loads every file).
**Never `npm run format`** on the whole repo: `npx prettier --write <files you touched>`.

## Architecture — FSD (lint-enforced)

`app → pages → widgets → features → entities → shared`. Import from your own layer or below, never above; another
slice only through its `index.ts`, by alias or relative path alike. A page imports no other page: what two pages
share is a widget. Inside shared, the kernel is fenced tighter:
`shared/lib/music` imports only itself, `shared/lib/arrangement` and `shared/lib/notation` only music,
`shared/lib/exercise` music and arrangement's types, and none of them imports a package.
`eslint-plugin-boundaries` and `no-restricted-imports` enforce all of it, and `src/app/architecture.test.ts` proves
it. `@` → `src`.

- **app/**: `router.tsx` (code-based TanStack Router, the three places Learn · Songs · Practice (ADR 0049, 0053); Learn is
  `/?view=lessons|courses&journey=` (remembered): its header's toggle between the Lessons, four journeys of chapters (a lesson `/lessons/$lessonId`), and the Courses, shelves of courses (a course `/courses/$courseId`, its own lesson `/courses/$courseId/$lessonId`, not found unless the course has it); Practice is its pages in three groups (ADR 0044, 0052; `/practice` lists them and remembers nothing), a page's URL under its page's: the things, each an explorer that shows one on the
  keys, Chords (`/practice/chords`), Scales and keys (`/practice/scales`, its Scale · Chords · Key views as tabs),
  Intervals (`/practice/intervals`), Progressions (`/practice/progressions`) and Accompaniment
  (`/practice/accompaniment`, its parts Called to Play · Called to Play 2 · Боброва · Горшков · Styles · Yours as tabs, ADR 0033, 0047; a
  pattern's page `…/patterns/$patternRef`, the editor `…/patterns/new` and `…/patterns/$patternRef/edit`; a study's
  page `…/studies/$pieceId`), each page holding the tools that work on it, never a tab or page of its own (ADR 0052): Progressions'
  typed line read in its key (`?key=&p=`) and its Between (`?between=&inKey=`), the Key view's Harmonise (`?melody=&onlyInKey=`); at the keys,
  the Chord finder (`/practice/chord-finder`, `?keys=&key=`, ADR 0054); the training, Exercises (`/practice/exercises`) and Quiz
  (`/practice/quiz`, its trainers `/practice/quiz/$trainerId`); Search (`/search?q=`, every named thing by kind); the Player's `/play/$pieceId`, `/play/walk`,
  `/play/chromatic`, `/play/progression` and `/play/exercise/$exerciseId`; the score editor's `/edit/$pieceId` (`?record=true`
  opens its takes) and, in the shell, a take's page `/edit/$pieceId/takes/$takeId`; screens are
  lazy through `routes/*-screens.ts` (home, settings, search, songs, learn, explorer, tool, accompaniment, practice, player: a chunk holds the screens
  that load together, so Learn carries no Settings popups); `notFound()` for an unknown piece, lesson,
  quiz or check, a piece on the wrong shelf, and a walk of a scale without chords), `routes/<place>-search.ts` (learn, songs, explorer, tool, accompaniment, practice, search, player: each
  place's validators, defaults and route search options, typed with `import type` from the slice that owns each view:
  the router imports no page or widget code, or it would leave its lazy chunk; validators run as the app opens, so they
  import only what a URL is made of, with `read-search.ts`, never a chart's arrangement; each exports its `read*`
  reader and a remembered route's kept params), `routes/remember.ts` (a remembered route's `beforeLoad`: the two rules
  of ADR 0022, one redirect at most; `createAppRouter({ history, views, patterns, pieces, takes })` saves its view `onResolved`), `App.tsx` (the provider stack, `ShortcutsProvider` round the router: `<App settingsStore progressStore patternsStore piecesStore takesStore services router />`;
  the router's context holds the views, patterns, pieces and takes stores),
  `composition-root.ts` → `createServices()` (audio + MIDI, built once in `main.tsx`), `providers/` (`LocaleSync`,
  `ThemeProvider`, `AudioUnlock`, `MidiReconnect`, `MidiSync`: the MIDI keyboard as the settings say, ADR 0034), the layouts (`RootLayout`, the shortcuts' sheet (`ShortcutsHelp`) round its outlet; `ShellLayout` → `AppShell` with the docked tab bar and the laptop's sidebar;
  `FullScreenLayout` for the Player and the Check, the viewport's height), `RoutePending`, `update-prompt/`, `storage-full/` (a save the device had no room for, said so), `RouteError`,
  `testing/`.
- **pages/<x>/ui/**: one per route; composes widgets + `shared/ui`. A page with many acts has one hook in `model/`
  (`pages/player/model/use-player.ts`: a piece → its Performance, then the Player's hook), which is its test surface.
  `pages/player` serves a piece or a walk: one screen (`PlayerLayout`) that `PlayerPage` (`usePlayer`, `PieceSetup`),
  `WalkPlayerPage` (`useWalkPlayer`, `walk-search.ts`, `WalkSetup`) and `ChromaticPlayerPage` (`useChromaticPlayer`,
  `chromatic-search.ts`, `ChromaticSetup`) and `ProgressionPlayerPage` (`useProgressionPlayer`, `progression-search.ts`,
  `ProgressionSetup`) and `ExercisePlayerPage` (`useExercisePlayer`, `exercise-search.ts`, `ExerciseSetup`, the sheet of
  the exercise's own fields) fill; `pages/learn` Learn: its header's toggle (`LearnViewToggle`), the Lessons (`JourneyMap`) or the Courses (`CourseShelves`), the days practised and the songs played last, Continue floating (ADR 0057); `pages/course` a course's page: its icon beside its summary, facts as pictures (`CourseFacts`), progress (`LearnedMeter`), one honey Start course, Continue or Review, its lessons as numbered rows (`CourseLessons`) and its guided songs (`GuidedSongs`); `pages/lesson` a lesson of either kind over `LessonLayout` (one centred column, Learned in its bar; its `LessonTrack`: what it is part of, the lesson before, the way on at its end, which learns it): `LessonPage` (its journey, chapter and number; the journey's next lesson, else back to the journey) and `CourseLessonPage` (its course and number; the course's next lesson, else on to its songs), going on learns it (ADR 0053); `pages/practice` Practice's pages as rows in its three groups; `pages/search` Search (`model/index-entries.ts`: `indexEntries`, one projection of the registries, held to each by a test; `searchIndex`, `typedChord`; `useIndex`; `IndexRow`); `pages/shared-song` a song opened from a shared link (`/songs/shared?song=…`), added to Your songs when asked; `pages/chord-finder` the Chord finder, one stage in the middle, its name over its grand staff (ADR 0058; `useChordFinder`: the chord a MIDI keyboard holds as it grew, read on once let go, else the keys tapped; its log; the reading chosen); `pages/quiz` every
  trainer by group with My gaps in its bar; `pages/exercises`
  the drills of no other page; `pages/chords`, `pages/intervals` and `pages/progressions` three explorers' pages; `pages/scales`
  Scales and keys (`ScaleTabs`, its views; songs in the key, `PiecesInKey`); `pages/accompaniment`
  Accompaniment (`AccompanimentTabs` over its URL's `AccompanimentView`, a part's `PatternShelves`, a method book's
  `BookPieces`; its lessons are its course on Learn alone), `pages/pattern` and `pages/pattern-editor` a pattern's page and the
  editor of the learner's own; `pages/score-editor` the score editor (`editorTarget`, what it writes;
  `useScoreEditor`, the visit's store saving each change, keys, MIDI, `shortcuts.ts` and Play; its bar (`EditorHeader`: Undo · Redo · Play · Record, + (`AddMenu`, `add-menu.ts`: bars, barlines and jumps, lines, text (expressions, pedal, tempo), key, time and staves with each hand's clef from a bar, as engraved tiles, ADR 0065, 0067, 0068, 0069) and the gear (`PieceSettings`: the song, the view, the tune's staff, chord names, the parts' instruments, the layout `?layout=` scroll · pages · horizontal (ADR 0064), MIDI)); its palette (`EditorTools`, `palette-tabs.ts`: the notes' values, pitch, marks, dynamics and fingering; in the chord row the chord names' in the key, built, or typed on `chord-keypad.ts`): one size whatever its tab, at the foot over the keys on a phone held upright and a tablet, a column beside the sheet on a laptop and a phone on its side, folding into a button over the sheet's corner, beside the sheet on the side `paletteSide` says, moved by its tab row's button (ADR 0065, 0071); the sheet its one scroller; a section's own pattern from its heading's menu (`SectionHeading`, `Section.pattern`, ADR 0065); barlines, repeats and endings (`|: :| || |. [1 [2`, the + menu's Barlines; the Player plays them taken, `unfold`, ADR 0067); up to three more voices sung with the tune, each a row and a staff of its own, added from + as an instrument by family and taken away in the settings, where each part's instrument is chosen (`InstrumentChoice`; ADR 0066, 0070); the staff written chosen by a click (or Alt ↑ ↓), a double click writing the note there, the caret's notes dragged by the key's steps; Delete as Backspace; its keys folding; `useEditorTakes`, the recorder
  and the takes' sheet (ADR 0028), `tuneOf` (the song's tune under a take); its parts share one context and read the store narrowly;
  `TakePage`, a take's page: its name, `TakeRoll`, `useTakePlay` and `KeepBars`, ADR 0034).
- **widgets/<x>/**: composite UI tied to screens (`practice-days` (the days practised in a row and the last seven, on Learn), `piece-list` (with `EntryRow`, a song's row wherever it is listed, and `RecentPieces`, the pieces practised last, on Learn), `app-nav` (the phone's bar, a rail down the left on a phone on its side (`landscape-phone`); the laptop's sidebar, which collapses to its icons; Search and Settings at its foot; Alt and 1–3 go to its places, Cmd or Ctrl with K opens Search, with B collapses it), `continue-action` (Continue, one honey button floating over Learn, ADR 0057), `curriculum` (Learn's two views, ADR 0053: `JourneyMap`, the journeys as tabs, its chapters folding (`useFold`) as zigzags of `JourneyNode`s; `CourseFacts`, `LearnedMeter`; `CourseShelves` of `CourseCard`s; `CourseLessons` and `GuidedSongs`, a course's; `continueStep`, Continue, on the track last learned on; `useStepTitle`; `journeyProgress`, `courseProgress`; `LearnView`, its URL),
  `chord-chart` (a piece's lines of bars), `piece-chords` (the chords a piece plays, each to tap, `chordsOf`, and the
  Check of them), `player-setup` (the Setup: its button and sheet, its first page
  composed by its page, `PlayerLayout`'s `setup` slot: `PlayerSetup` over a `PatternFit`, `PatternCard` (the pattern
  over its two hands, each naming its figure, with the `InversionField`: the first chord's position and Nearest, ADR 0039; the hands' figures listed under `LEFT_FIGURE_GROUPS` / `RIGHT_FIGURE_GROUPS`), `KeyWalkField` (Through the keys),
  `MelodyToggle`, `RecordingToggle`), `practice-player` (the Player over any Performance: `usePracticePlayer`, its `PracticeView` URL, `usePlayerShortcuts` over `PLAYER_KEYS` (Space, the arrows, R, Home, Escape), the
  `player-screen` areas, `PlayerDock` (the transport floating as one pill: tempo, ‹ ▶ ›, hands; upright beside the sheet on a phone on its side, ADR 0061), the loop button, Wait mode's line, `PlayingToggles` for the Setup's grid), `sheet-music`
  (`SheetMusic`: the Score engraved, labels, the cursor, bars to jump to, the loop's grips), `chord-explorer` (the
  chord builder, read top to bottom: `ChordBuilder` (its choices as labelled fields), `ChordSheet`, `ChordTensions`
  (a 7th chord's twelve notes in the owner's table's four groups, each played on top), `ChordPractice` (its arpeggio
  and chromatic walk in the Player), `viewChord`, `chordKeys` (what Play sounds), `changedView`), `scale-explorer` (`ScaleExplorer` picks, in
  `ScaleLayout`'s one flow, `RunView`, the run from any Start on note, the playing hand's fingers under the keys, on a
  staff, with `ScaleExercises` (the scale's exercises in the Player), `ChordsView`, the scale's chords to 13ths in an
  inversion, walked, or `KeyView`, a major or minor scale's key: the circle of fifths, its signature,
  facts and borrowed chords; its pure marks, plays, `scaleRunOf`, `keyOfScale` and `showsOf` in `model/`), `interval-explorer` (every interval over a root
  as Clefs' cards), `chord-finder` (ADR 0054: `findChord`, a note, an interval or power chord, or every reading of a chord, spelled in a key; `logKeys`, the chords played in turn; `trailMusic`; `ChordName`, the chord as large as the page allows with its readings; `ChordTrail`, the chords played on a grand staff; `ChordKeys` over `keysHolding`), `score-sheet` (the score editor's sheet: a line of
  grand staff per chart line, `lineMusic`, the caret, the bars chosen, Pattern marks, bars as buttons), `exercise-list` (the Exercises page's groups, `LISTED_GROUPS`, each
  row opening its Player), `pattern-music` (a pattern heard: `patternSample` over a bar of C or a tune's first line,
  `PatternStaff`, `PatternPlay`), `progression-explorer` (`ProgressionExplorer`, a progression in any key: its row of chords, `ProgressionChoice`
  (the library behind one pop-up), the typed field, numerals or a song's chords read in their key (`readProgression`, `typedSearch` for a link to it), and the lead-in into each chord (`playedNumerals`); `ProgressionPractice`, a row into the Player for the key alone and for each walk through the keys, each saying the chords it plays first (`walkPreview`); `ProgressionBetween`, the passing chords between two chords of its row (`changesOf`, `SuggestionCard`); its pure `changedView` (a key turned minor or major shows a
  progression's line in that mode, ADR 0041), `chosenView` and `playerSearch` in `model/`), `lesson-view` (a worksheet over its page's keys under one floating bar (`LessonBar`, ADR 0057, 0058): ‹ the section before, the count opening its contents and what it is part of in a sheet, › the next; each staff's options on its card; a line played shows the keys of the bar it is in; every block, one open question in
  `lesson-question.ts`, `PatternExample` over `patternOpening` (a piece's first line with a pattern), `LessonLinkRow`), `step-panel`, `trainer-board` (one round of a trainer and a run's results, the Check's board too; `useRoundShortcuts`: Enter, 1–9, R),
  `trainer-choice` (a trainer's Custom fields), `trainer-list` (a group of trainers, the Quiz page's groups in `model/quiz-groups.ts`, held by a test to every trainer, and `GapsLink`, My gaps in Quiz's bar), `practice-pages` (Practice's pages wherever they are listed: `PRACTICE_PAGES`, `THINGS`, `PRACTICE_GROUPS` in `model/`; `usePageWords`, a page's name and its line, a page of tabs or groups saying those in its own words; `PageRow`), `take-roll` (`TakeRoll`, a take as a piano roll over `rollOf`, its playhead
  moved by the audio clock)), each owning in `model/` the view type a route's URL holds.
- **features/<x>/**: commands, one use case per file (`set-preference/set-theme.ts`, `mark-learned` with its
  `LearnedButton` on a screen, `record-answer`, `record-practised` (with `recordDay`: a day practised, as the Player opens or a round is answered), `reset-progress`, `backup-data` (every saved store as one file, `writeBackup`, and put back in place of what is on the device, `restoreBackup`; Settings' Backup), `remember-view`, `manage-patterns` (favourite, hide, save and delete
  the learner's own), `edit-piece` (save a version's or own song's music, reset a version, make, rename and delete a
  song with its takes; `chartStart`)), `score-editor` (the draft of a piece's music, `readDraft`/`writeDraft`; its pure edits of notes,
  chords, bars, sections and settings; a take written from the caret's bar, `writeTake`, `takeParts`; the
  caret; `reduce` with undo and redo; `createEditorStore`), `record-take` (ADR 0028: `takeOf`, the keys and the three pedals heard
  against the click, `isKept`; `startRecorder`, the tune under it; `useRecorder`, a take's end `stopped` or `left`), `manage-takes` (`saveTake`, `deleteTake`, `renameTake`, `keepTakeBars`), `connect-midi` (the connection, the status
  control naming a chosen keyboard away, held keys (on under the sustain), `useMidiKeyDown`, `useMidiSync` (ADR 0034: `configure`, MIDI keys through the live voice with Sound the MIDI keyboard, its pedals the voice's, notes through the piano), `MidiSettingsFields`, the rail's `MidiSoundToggle`), `live-keyboard` (`LiveKeyboard`, the keyboard every screen shows, set up by the saved keyboard
  settings: keys go down as they sound or are held on MIDI, a touched or typed key sounds while held (`useLiveVoice`), `PedalToggle` and `useSpacePedal` hold the sustain, `spotlight` puts down only
  the keys struck last, `keyPlays` makes a key play more than itself; the rail's settings, every one in sight as a picture (`KeyZoom`, `NamedKeysToggle`, `ChordNamesToggle`, `TypingToggle`, ADR 0036), the chord a hand holds named in the rail unless `namesChords` is off (a round, ADR 0037), and `KeyboardSettingsFields`, the same as fields in
  Settings; `use-typing`, the computer keyboard as a piano; `PinnedKeyboard`, a page's pinned one (an explorer's, a tool's, a lesson's), docked at the foot or the top and folded as the keyboard settings say (ADR 0055); folded, a Keys button floating where they were (lowest of the screen's actions at the foot, under the screen's bar at the top), which they morph into and out of (`morph`, `vt-keys`); `GlissandoToggle`, the rail's own), `play-example` (the examples an explorer and a
  lesson share, each shown on the page's keys: `IntervalCard`, `ScaleExample`, `NotesExample`, `VoicingsExample`, `ChordRow` (any row of
  chords voiced smoothly: a progression's by `progressionRow`, a passing chords way) with its parts `RowStaff` (each bar naming, numbering and playing its chord, ADR 0059) and
  `RowPlay` (honey in the tool, soft beside other examples), `ScaleChordGrid`, `chordShown` / `scaleShown`, and
  `useShownKeys` (the example played last, forgotten when what it stood on changes)), and the
  machines:
  `practice` (the pure `practice-machine`, `usePractice`, which drives it with audio, MIDI and the clock, and the
  Player's pure parts: `ownChoice`, `arrangePiece`, the marks, the loop's bars (`readLoop`, `loopParam`,
  `loopBeatGroups`), `speedUp`, the walk (`WALK`, `walkChart`, `arrangeWalk`) and `PractiseChords` (a scale's walk
  into the Player and its key's common progressions onto Progressions); an exercise (`arrangeExercise`: its rule over the learner's choice, ADR 0024); the chromatic walk (`CHROMATIC`, `chromaticChart`,
  `arrangeChromatic`, `readChords`); a progression (`PROGRESSION`, `progressionChart`,
  `arrangeProgression`; walked through the keys by `walk`, `walkingFit`); Listen and Wait mode, Play in both, ‹ › in either) and `trainer` (ADR 0025: the round
  machine, every round answered on the keys or by a choice; `draw.ts`, a round from what a run `Asks`; the ladders in
  `ladders/`, `trainers.ts` (each trainer's levels, Custom and asks), `trainer-view.ts` (its URL), `run.ts` (rounds,
  times, streak, summary), `useTrainer`, the Check's plan, My gaps); `record-run` (a run's record); `fold-section` (`useFold`, a section folded as the learner left it, saved in `pt-settings`' `foldedSections`); `shortcuts-help` (`ShortcutsHelp`, the sheet `?` opens over what the screens bind, and `ShortcutsButton`); `share-song` (an own song as a link, `songLinkData` / `readSongLink`, deflated in base64url and read as a save is; `useShareSong` and `ShareSaid`, what it said).
- **entities/<x>/**: `model/types.ts` (types, guards, validating constructors; no IO, no React), `model/store.ts`
  (`createSavedStore`: its key, version, initial state and sanitiser), `model/selectors.ts`, `model/context.ts`
  (`createStoreContext`), `content/` (authored data), `ui/` (only the entity's own data shown: a piece's titles, credits
  and section headings, `PieceLink` to a piece's page on its shelf; a step's title and `ExplorerLink`), `index.ts`.
  Content: `piece` (70 pieces, 7 listings; a chart's parser and the parser of a song written in degrees (`isDegreePiece`:
  a piece's format is not its kind), a piece's `recording`; `SONG_COLLECTIONS` on Songs, `METHOD_BOOK_PIECES` (a method book's: the studies on
  Practice, the hymns),
  `entriesInKey`, `pieceFit`, `choosableChordSize`,
  `isOwnKey`; bars of either hand written out (`hands`, `parseHands`) and the writers back to text (`writeBar`,
  `writeMelody`, `writeHand`, `PieceMusic`, `readMusic`); the learner's own, ADR 0027: `pt-pieces`: their
  versions by piece id and their own songs (`my-<n>`), read through the repertoire (`repertoire`, `useRepertoire`):
  the catalog in the learner's versions and their songs, what the router, Songs, a piece's page and the Player read;
  `selectVersion`, `selectHasVersion`, `selectOwnSong`), `pattern` (48 patterns, each with its idea in a line; the pattern book (`patternBook`, `BUILT_IN_PATTERNS`,
  `usePatternBook`, ADR 0026) over the learner's own (`OwnPattern`, `my-<n>`), looked up by `PatternRef`; `pt-patterns`:
  favourites, hidden, own; `PATTERN_GROUP_BOOK`; `partShelves` (a part of `ACCOMPANIMENT_PARTS`, named by `usePartName`) /
  `pickerShelves`, named by `useShelfName` / `useFullShelfName`; `PatternFit` and `patternNeed` /
  `playablePattern`, what music can play; `followsInversion`, whether an inversion changes it), `step` (the learned marks, ADR 0053: `Step`, `StepId` (`lesson:<id>`, `course:<course>/<lesson>`, `piece:<id>`, `chords:<family>`, `scale:<kind>`), `stepOf`, `STAGES`, `StageMark`, `STAGE_PAINT`, `STEP_PAINT`, `StepLink`, `skillsOfStep`), `course` (the Courses, ADR 0053: `COURSES` on `SHELVES`, each with a level, weeks, its own lessons in `content/<course>/` and its guided songs; `courseLesson`, `nextCourseLesson`, `courseStepIds`, `pieceStage`; `CourseIcon`), `lesson` (lessons as content,
  worksheets: text, steps, notes, chords, voicings as written (each hand's keys, ADR 0040), grids, scales, intervals and lines of notes that play, questions answered on
  the keys, patterns over their pieces and progressions in any key, links by what each opens (`opens`: an explorer, a page's tool (`between`, `harmonise`, `song-chords`), a Quiz trainer or
  the Player; a `player` link opens a progression walked through the keys or in an inversion); `readProgression` reads a progression block or link; `lessonById`; its journeys: `JOURNEYS` of chapters, `lessonPlace`, `nextLessonId`; a journey's lesson plays no piece and names no book, held by `src/app/content/`),
  `book` (the books a Source cites; `METHOD_BOOK_IDS`, `METHOD_BOOK_NAMES`, ADR 0033, 0047), `progression-library` (the one model of a progression that is practised, ADR 0041: one entry for each idea,
  named, by style, its line in each mode it has (`major`, `minor`), with its note, pattern and chord size; `libraryProgression` names a line,
  `progressionMode` the mode one is shown in, `COMMON_PROGRESSIONS` a key's, `LIBRARY_BY_STYLE` what its pop-up lists), `exercise` (the exercises: groups, stages, names, the fields each rule takes and its own choice;
  `exerciseChoice` reads a URL against an exercise). Saved state: `settings` (`pt-settings`, v3, with `floating` (where the floating buttons stand and whether they say their names, ADR 0058), with the laptop's sidebar, open or collapsed, the editor's `paletteSide` (ADR 0071), the title size, the
  keyboard settings (with `chordNames`, `markNotes` (a marked key names its note under its degree, `toneMark`; no row of chips repeats them), and where a page's keys dock, folded, folded on a phone on its side (`foldedLandscape`, a reading page's; `PinnedKeyboard`'s `screen="playing"` keeps them out, ADR 0062), their length, ADR 0055; `railControls`, the buttons the bar over the keys keeps, chosen one by one in Settings as tiles wearing the bar's pictures (`RailControlsField`), ADR 0056), the sections folded, the trainers' auto-next, the recorder's click and tune, and the MIDI keyboard's `midi`: device, sound, through the piano, octave shift, Touch, pedal; `scoreView`, the Player's View menu: layout across · scroll · pages, notation, chord names, the tune's staff, staves hidden, keys, ADR 0064), `take` (ADR 0028, 0034: `pt-takes`: a name, the bar it starts at, its barlines as the piece's bars fell, the three pedals' presses; saved
  compactly through `createSavedStore`'s `write`; `selectTakesOf`, `selectRoomLeft`; `takeSounds` (its pedals, through the Touch) and `takeSoundsFrom`, `barMs`, `takeBarStart`, `keepBars`, `quantise` to `takeGrids` of the take's meter, `midiFile`), `progress` (`pt-progress`, with each trainer level's record and the days practised (`days`, `streak`, `lastWeek`); the evidence rules in `model/mastery.ts`, what an answer or a mark
  changes in `model/changes.ts`; `ratingOf` rates a skill, `continueStep` (`widgets/curriculum`) is Continue), `views` (`pt-views`:
  each remembered screen's last view, at most 200, `selectView`, `viewOf`, `sameView`, `withView`; written by `features/remember-view`).
- **shared/**: `lib` (`cn`, `safeLocalStorage`, `savedObject`, `createSavedStore` (a zustand `persist` store read
  by one sanitiser for its version, saved as its `write` makes it, following other tabs' saves), `downloadFile`, `isOneOf`, `toggled`, `createStoreContext`, `useMediaQuery`,
  `useScrollMotion`, `useWakeLock` (the screen kept on while the Player, the editor, the Chord finder or a round is open), `useElementSize`, `useFitZoom` (a staff shrunk to the width it is given), `useShownOnScrollUp` (the screen bar's hide and show, once the page has scrolled past it), `IN_PLACE` (a navigation that changes the
  screen in place: replace, keep the scroll) and `useViewChange` (a screen's choices written to its URL with it), `morph` (a change made in a view transition, at once under reduced motion), `OPEN_PLAINLY` (a link's history state: open a remembered screen as
  left), `useGoBack`, `usePresses` (the keys a hand holds, each down at least the shortest press), `keyboardLayout` with
  `PIANO_LAYOUT` and `keyAt` (the key under a point), `keyboard-choices` (the keyboard settings' options, the key sizes smallest first: `zoomKeySize`, `nextNamedKeys`), `midi-choices` (the MIDI keyboard's),
  `keyboard-view` (the view's frame, an octave's scroll, `scrollToReveal` and `keepCentre`: keys that hold still, ADR 0059), `typing-keys`, the search-param readers and `chord-params` (a chord's parts as the Chords explorer's URL holds
  them), `foldText`; and with
  barrels of their own: `music` the theory kernel (the piano's ranges; thirteen scale kinds in three families,
  `scaleKey`, `relatedScale`; fingerings from any start and over several octaves, `thumbFingering`, `arpeggioFingering`; `scale-chord.ts`, a scale's chords stacked
  to 13ths and named by `stackSuffix`, `scaleChordAt`, `borrowedChords`; `chord-parts.ts`, a chord built from its parts
  (`buildChord`, `fitParts`), and `chord-name.ts`, the naming tables both share; `writtenSymbol`, `qualityRootSpelling`,
  `readChordSymbol`, `keySymbol`, `keyMode`, `fitInversion`, `STACK_SIZES`; `nameChords`, the Chord finder's, with the tones
  a hand leaves out, `leftOut`; `circle.ts`, the circle of fifths;
  `placeChord` over any tones (from five notes in two hands, the root and a 13th's 5th in the left, the rest close in the right; `chordInversions`, ADR 0035), `placeScale`, `placeScaleChords` and `walkChords`; `interval-facts.ts`,
  the Intervals explorer's intervals and `consonanceOf`; `tensions.ts`, the one source of available tensions; `chord-finder.ts`, `reharmonise.ts`,
  `passing-chords.ts`, `hand-position.ts` (`handPosition`: a hand's inversion, or the tone a rootless hand starts from), `voice-lead.ts` (a row's hands, from a `RowPosition` where one is chosen: a 9th's root left to the bass, a slash chord over the bass it writes, the bass under the hand) and `numerals.ts` (a degree with any chord of the table, read the sheets' way, ADR 0032; applied, `V/ii`, read in that degree's key, ADR 0040), `keys-holding.ts` (`keysHolding`, the keys that hold a chord, each with its numeral), `key-of-chords.ts` (`keysOfChords`, the keys a line of chords is in, most likely first; `readInKey`, each chord's numeral there, an applied dominant as `V/iv`), the tools' kernel; `key-walk.ts` (`walkKeys`, a progression's keys and home); `lead-in.ts` (`withLeadIns`, each chord after its own V or ii–V, ADR 0041);
  `INVERSIONS`; `spellBelow`, `plainRoot`, `tonesInKey` (a key's spelled notes), `kindComingDown`, `circleKey`, `beatsBefore` (a pickup)), `exercise` (the exercises' rules, each a choice → a Performance laid out by
  `exercisePerformance`: scales, sequences, contrary motion, arpeggios, Barry Harris's, Piano With Jonny's, the
  five-finger position, Hanon No. 1), `arrangement`
  (`arrange`, a chart → a Performance: each note's written onset, roll and spelling, the right hand's chord voice-led or
  in one inversion (`voiceInversion`, `inversionPitchClasses`); a figure's compound version in 6/8 and 12/8 and its
  6/8 form (`inCompound`, `inSix`, ADR 0047); a bar's written hands in place of the pattern's;
  `transposeChord`, `transposeNotes`; `playsKeyTriads`), `notation` (`notate`, a
  Performance → a Score: measures, voices, values, ties, accidentals; a bar's blank staff a hidden rest), `schedule` (a Performance → sounds in seconds,
  swing, Listen's loop over a passage with each pass's tempo, a bar, a chord's keys, a recording under a pass (`recordingPlay`), a take's count-in and click (`recorderClicks`, on the Player's bar grid), a walk of chords, a scale's
  run in ticks (`scaleRun`, `runSounds`), a chord written as a bar (`chordBar`), a lesson's line of notes (`noteLine`), a lesson's voicings (`voicingsMusic`), a hand's keys, an interval up, down or
  together (`intervalSounds`), which keys sound when and which were struck last; `damper.ts`, the three pedals over held keys; `velocity.ts`, `velocityGain`, `touchVelocity`), `services`
  (`ServicesProvider`, `useServices`, `usePlay`, `usePlayback` (a Play button's Stop), `usePlayhead` (where a play is, by its onsets on the audio clock: a staff's notes marked as they sound), `useLiveVoice` (a hand's keys: a tap's key or
  the chord a key stands for, sounding while held), `usePedal`, `useSoundingKeys` (the music's, the struck, the live voice's)), `shortcuts` (ADR 0036: `ShortcutsProvider`, the one key listener; `useShortcuts(group, shortcuts)`, what a screen binds and the sheet lists; a `Combo` by physical key or by name, `keyHint`; the guards `isTyping`, `takesKey`, `inPopUp`, which typing and the Space pedal share)), `config` (`THEME_COLORS`, `PRECACHE_FILE_LIMIT`), `api` (the `audio` and `midi` ports, their browser adapters and
  fakes; MIDI events carry their time and the three pedals are `onPedal`; the MIDI port (`MidiPort`) hears the keyboard chosen as `configure` says and lists its speakers (`outputs`, `noteOutput`); the audio port's live voice (`press`, `release`, `pedal`, `live`) beside `play()`, and its notes `notesTo` a keyboard's speaker (`midi-sound-output.ts`); the audio port knows which keys it is sounding,
  whether a play still sounds, and the audio time heard at a moment (`audioTimeAt`); it plays a piece's recording on
  the audio clock: `loadRecording`, `playRecording`, `recording-player.ts`), `ui` (the kit: `PianoKeyboard`
  with `RailButton` (an icon or a glyph), `RailGroup` and the rail's `caption` (what it says of the keys held), `Pinned`, `Docked` (keys docked at the screen's foot over the tab bar, its height the page's `--docked`), `FloatingHost` (the one place they stand, in `AppShell`, where `floating` says, ADR 0058) and `FloatingActions` with `Fab`, `FabLink` (the `Fab` as a link), `PlayFab`, `FabPill`, `SpeedDial` and `SpeedDialAction` (a screen's actions floating in the thumb's reach, each its icon alone unless names are asked, `useFloatingLabels`, ADR 0055), `FoldSection` (a section whose heading folds it, a `Fold`) over `FoldBody` (what folds, sliding), `ScreenHeader` (the screen's bar, sticky, hidden while reading down, a page's `tabs` its second row; a child of the page's root, held by `src/app/screen-bar.test.tsx`; `ScreenBarProvider` in `AppShell`
  sets `--screen-bar`, which `Pinned` and the `top-screen-bar` utility read), `BackButton` (a screen's Back, over `useGoBack`), `RoundButton`, `RoundLink`, `ButtonLink`, `Segmented`, `NamedSegmented`, `Listbox`, `Dropdown` (the pop-up
  button; `bare` under a printed name), `MultiDropdown` (the pop-up that checks several, grouped like `Dropdown`; in both a list with other values is another list, mounted anew: `listKey`),
  `NoteChoice` (a note as written: its letter, then ♮ # ♭) and `KeyChoice` (a key as written: its tonic so, then Major · Minor, only the keys a signature writes), `ToggleChips` (several of a few, all in sight), `PositionField` (a row's first chord's inversion and Nearest) with `usePositionName`, `ChordHeading` (a chord's symbol, a long one a size down), `FoldGroup` (a titled group folding under its heading, its count and bar: the Intervals' groups), `Labelled` (a choice under its name, one field of a page's `grid-fields`), `SettingField` (a choice in Settings under its name), `NavTabs` with `NavTab` (tabs that are router links, each saying whether its page is shown), `InversionChoice` over `InversionGlyph`, `ChordSizeField`, `SwitchRow`, `ToggleTile` and `ToggleGrid`, `ToolButton`, `ToolPalette` (a notation app's palette: its actions, tabs of big `ToolKey`s, a foot), `LearnedBadge`, `TypedField` (music typed by name) and `NameField` (a name the learner gives), `RowLink` (its tile an icon, a number or none, a detail of up to two lines, a trailing slot) and `RowGroup` (a titled grid of row cards), `PAGE_TILES` (the tile a row to each page wears, every row Practice lists among them), `SearchField` (a screen's search box, `/` puts the cursor in it), `Fact`, `PlayToggle` and `ChordButton`, `PlayButton` (an example's Play as a round icon), `SheetOption` (a staff's own option on its card), `PlayLabel` (a Play button's words, Stop while it sounds), `usePlayKey` (Enter plays a screen's one Play), `ShownKeys` with `NO_KEYS` and `unmarked`, `PAINT`,
  `Sheet` with its trigger (its content carries a Close for a screen reader), `RatingMark`, `RankMark` (four rising pips, a stage's), `NotFound` (a page not there, or deleted in another tab), `PageCanvas` (pages at their print size, `PRINT_SCALE`, on a canvas dragged and pinched or Ctrl-wheeled to zoom; `useCanvasReveal`, ADR 0075), `LazyScoreView` (a staff outside the Player,
  VexFlow loaded when first shown; `staff` draws one staff of the grand staff); shadcn in `ui/primitives` (`kbd` for a shortcut's keycaps); `ui/score`, imported by that path only: `ScoreView`, `StaffNames` (each sung staff named where voices sing together, ADR 0066),
  VexFlow over a Score (each note named by its staff and tick, the `selected` ones marked), and `xAtTick`), `i18n` (`Locale`,
  `useLocale`, `useScaleName`, `useKeyName`, `LocalText`; namespaces per place (`learn` Learn's, its journeys', a course's and a lesson's, `practice` Practice's pages', `search`), `music` for the words every screen shares), `test`.

**State:** what you look at → URL search params. What must be remembered → a persisted entity store; a screen's last
view → `pt-views` (ADR 0022). Everything else → component state.
**Keys:** a screen's shortcut → one `useShortcuts` call beside what it drives, never a `keydown` listener of its
own; a letter alone is the piano's (typing), so a shortcut takes a named key or a letter typing leaves free (ADR 0036).
**Theme:** `index.html`'s `#theme-boot` script paints `data-theme` and the browser toolbar before first paint from
`pt-settings` (the build prepends one theme-color per OS scheme); `ThemeProvider` keeps both from `THEME_COLORS`.
`src/app/theme-boot.test.ts` holds the script to the store.
**Installed app:** `#standalone-boot` locks pinch and double-tap zoom in the installed app only (a tab keeps its
zoom); `theme.css`'s base keeps text unselectable outside fields, with no callout, no overscroll and no double-tap
wait on controls (Mindscape's PWA setup; `src/app/standalone-boot.test.ts`).

## Read before you touch

- **Any UI** → [CODE_STYLE](docs/CODE_STYLE.md).
- **Content** (a piece, listing, pattern, path step) → [CONTENT](docs/CONTENT.md).
- **Naming anything** → [UBIQUITOUS_LANGUAGE](docs/UBIQUITOUS_LANGUAGE.md). "Piece" in code, "Song" or "Study" in
  the UI; a "Progression" is the library's, never a piece. A "Skill" is a quiz-rated chord quality or scale kind, nothing else.
- **Why it is this way** → [docs/adr](docs/adr).
- **Music logic** → CODE_STYLE §8 and spec §4.

## Conventions

- Strict TS: `noUncheckedIndexedAccess`, `noUnusedLocals/Parameters`, `verbatimModuleSyntax` → `import type`.
  No `any`.
- Tests colocated as `*.test.ts(x)`; Vitest with **`globals: false`** (import `describe/it/expect/vi`), in two
  projects (`vite.config.ts`): **`unit`** runs `*.test.ts` in node, **`dom`** runs `*.test.tsx` in jsdom. A
  `*.test.ts` that needs a DOM (localStorage, `renderHook`, `document`) opts in with `// @vitest-environment jsdom`
  on its first line; pure logic never does. Setup: `src/shared/test/setup.ts`, and for a DOM `setup-dom.ts`
  (jest-dom, cleanup, English, and per-test fakes: `stubMatchMedia` for the OS
  scheme, `stubServiceWorker` for a waiting version, `stubFonts` for the music font and a canvas that measures text, `stubIntersectionObserver` with everything on screen).
  **`isolate: false`**: a worker's files share their modules, so a test leaves no state behind (the setup puts back
  mocks, globals, localStorage and the language); a file that needs module state fresh (`safeLocalStorage`'s choice,
  once a page) starts with `vi.hoisted(() => vi.resetModules())`. With the settings store:
  `renderWithSettings(ui, { locale, theme })`; the whole app: `await renderApp(path, { locale, storage, webMidi })` (its `viewsStore`, `patternsStore`, `piecesStore` and `takesStore` too); a widget that
  leads elsewhere, `await renderRouted(ui)`; which
  loads every screen's chunk before it renders (so a test never waits on the runner) and returns its fake `audio` and
  `midi` for the test to drive (moving the fake audio's clock with `setNow` moves the keys that sound); both in
  `src/app/testing/`. A screen's test sits beside its page and runs the app through `renderApp`. jsdom lays nothing
  out: where a pointer's position or a scroll matters, `stubBox` and `stubScrolling` (`src/shared/test/layout.ts`).
- Prettier: no semicolons, single quotes, trailing commas `all`, printWidth 100.
- i18n: interface strings in `src/shared/i18n/locales/{en,ru}/<namespace>.ts`. Russian is typed against English,
  so a missing key fails `tsc`.

## Agent skills

Issues and specs → `.scratch/<feature-slug>/` ([issue tracker](docs/agents/issue-tracker.md)). Labels:
[triage-labels](docs/agents/triage-labels.md). Domain docs: [domain](docs/agents/domain.md).
