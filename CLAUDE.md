# CLAUDE.md

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
- **Saved data keeps working.** Persisted stores (`pt-settings`, `pt-progress`) are `createSavedStore`s: they carry
  a `version`, read any version's save through one sanitiser (a shape change is a new version and a sanitiser that
  reads the old, never a reset), and follow another tab's saves of their version or older.
- **Staged is deliberate.** Never `git checkout`/`restore`/`stash`/`reset` the owner's work unprompted.
- **New code copies the nearest slice's shape.** Writes → a feature command. Reads → selectors. Pure logic →
  `shared/lib` or `entities/*/model` with a colocated test.
- **Complete, not placeholder.** Every UI string in both `en` and `ru`. Loading, empty, error and offline states.
- **Verify before claiming done:** `npm run typecheck && npm run lint && npm run test`; after touching startup,
  routing, the PWA or config, also `npm run build`.

## Commands

`dev` · `build` · `preview` · `typecheck` · `lint` (includes the layer rules) · `test` / `test:watch` / `test:cov`
(90% lines on `src/shared/lib/**` and `src/entities/*/model/**`) · `icons` (regenerates the PWA icons from
`public/favicon.svg`).
One file: `npx vitest run src/shared/lib/cn.test.ts` · one test: `npx vitest run -t "saves a new language"`.
**Never `npm run format`** on the whole repo: `npx prettier --write <files you touched>`.

## Architecture — FSD (lint-enforced)

`app → pages → widgets → features → entities → shared`. Import from your own layer or below, never above; another
slice only through its `index.ts`, by alias or relative path alike. Inside shared, the kernel is fenced tighter:
`shared/lib/music` imports only itself, `shared/lib/arrangement` and `shared/lib/notation` only music,
`shared/lib/exercise` music and arrangement's types, and none of them imports a package.
`eslint-plugin-boundaries` and `no-restricted-imports` enforce all of it, and `src/app/architecture.test.ts` proves
it. `@` → `src`.

- **app/**: `router.tsx` (code-based TanStack Router, the four places Path · Songs · Learn · Practice (ADR 0029); Learn is
  its lessons (`/learn`, `/learn/lessons/$lessonId`); Practice is eight places, each one page family for a thing
  practised (ADR 0030, 0034; `/practice` lists them and remembers nothing): Chords (`/practice/chords` Build,
  `/practice/chords/find` Find), Scales and keys (`/practice/scales`, its Scale · Chords · Key views as tabs),
  Progressions (`/practice/progressions`, `…/passing`, `…/reharmonise`), Intervals (`/practice/intervals`),
  Accompaniment (`/practice/accompaniment`, its Called to Play · Боброва · Styles · Yours as tabs, ADR 0033; a
  pattern's page `/practice/patterns/$patternRef` and the editor `/practice/patterns/new` and `…/$patternRef/edit`;
  a study's page `/practice/studies/$pieceId`), Exercises (`/practice/exercises`), Quiz (`/practice/quiz`, its trainers
  `/practice/trainers/$trainerId`) and Free play (`/practice/free-play`, Play · Mark, ADR 0034); the Player's `/play/$pieceId`, `/play/walk`,
  `/play/chromatic`, `/play/progression` and `/play/exercise/$exerciseId`; the score editor's `/edit/$pieceId` (`?record=true`
  opens its takes) and, in the shell, a take's page `/edit/$pieceId/takes/$takeId`; screens are
  lazy through `routes/*-screens.ts` (home, settings, songs, learn, explorer, practice, player: a chunk holds the screens
  that load together, so the Path carries no Settings popups); `notFound()` for an unknown piece, lesson,
  quiz or check, a piece on the wrong shelf, and a walk of a scale without chords), `routes/<place>-search.ts` (songs, explorer, practice, player: each
  place's validators, defaults and route search options, typed with `import type` from the slice that owns each view:
  the router imports no page or widget code, or it would leave its lazy chunk; validators run as the app opens, so they
  import only what a URL is made of, with `read-search.ts`, never a chart's arrangement; each exports its `read*`
  reader and a remembered route's kept params), `routes/remember.ts` (a remembered route's `beforeLoad`: the two rules
  of ADR 0022, one redirect at most; `createAppRouter({ history, views, patterns, pieces, takes })` saves its view `onResolved`), `App.tsx` (the provider stack: `<App settingsStore progressStore patternsStore piecesStore takesStore services router />`;
  the router's context holds the views, patterns, pieces and takes stores),
  `composition-root.ts` → `createServices()` (audio + MIDI, built once in `main.tsx`), `providers/` (`LocaleSync`,
  `ThemeProvider`, `AudioUnlock`, `MidiReconnect`, `MidiSync`: the MIDI keyboard as the settings say, ADR 0034), the layouts (`RootLayout`; `ShellLayout` → `AppShell` with the docked tab bar and the laptop's sidebar;
  `FullScreenLayout` for the Player and the Check, the viewport's height), `RoutePending`, `update-prompt/`, `RouteError`,
  `testing/`.
- **pages/<x>/ui/**: one per route; composes widgets + `shared/ui`. A page with many acts has one hook in `model/`
  (`pages/player/model/use-player.ts`: a piece → its Performance, then the Player's hook), which is its test surface.
  `pages/player` serves a piece or a walk: one screen (`PlayerLayout`) that `PlayerPage` (`usePlayer`, `PieceSetup`),
  `WalkPlayerPage` (`useWalkPlayer`, `walk-search.ts`, `WalkSetup`) and `ChromaticPlayerPage` (`useChromaticPlayer`,
  `chromatic-search.ts`, `ChromaticSetup`) and `ProgressionPlayerPage` (`useProgressionPlayer`, `progression-search.ts`,
  `ProgressionSetup`) and `ExercisePlayerPage` (`useExercisePlayer`, `exercise-search.ts`, `ExerciseSetup`, the sheet of
  the exercise's own fields) fill; `pages/learn` is the lessons by module; `pages/practice` the eight places as rows; `pages/free-play` Free play (`useFreePlay`: Play's trail or Mark's marks, the URL's `marks`; `MarkTools`); `pages/quiz` every
  trainer by group (`model/quiz-groups.ts`, held by a test to every trainer) with My gaps in its bar; `pages/exercises`
  the drills of no other page; `pages/chords` and `pages/chord-finder` Chords' Build and Find; `pages/scales`
  Scales and keys (its Key view's songs in the key, `PiecesInKey`); `pages/progressions`, `pages/passing-chords` and
  `pages/reharmonise` Progressions' three tabs; `pages/intervals`; `pages/accompaniment` Accompaniment (a
  part's `PatternShelves`, a method book's `BookPieces`), `pages/pattern` and `pages/pattern-editor` a pattern's page and the
  editor of the learner's own; `pages/score-editor` the score editor (`editorTarget`, what it writes;
  `useScoreEditor`, the visit's store saving each change, keys, MIDI, `shortcuts.ts` and Play; `useEditorTakes`, the recorder
  and the takes' sheet (ADR 0028), `tuneOf` (the song's tune under a take); its parts share one context and read the store narrowly;
  `TakePage`, a take's page: its name, `TakeRoll`, `useTakePlay` and `KeepBars`, ADR 0034).
- **widgets/<x>/**: composite UI tied to screens (`app-nav` (the phone's bar; the laptop's sidebar, which collapses to its icons), `continue-card`, `path-levels`, `piece-list`,
  `chord-chart` (a piece's lines of bars), `piece-chords` (the chords a piece plays, each to tap, `chordsOf`, and the
  Check of them), `player-setup` (the Setup: its button and sheet, its first page
  composed by its page, `PlayerLayout`'s `setup` slot: `PlayerSetup` over a `PatternFit`, `PatternCard` (the pattern
  over its two hands, each naming its figure, with the `InversionField`), `KeyWalkField` (Through the keys),
  `MelodyToggle`, `RecordingToggle`), `practice-player` (the Player over any Performance: `usePracticePlayer`, its `PracticeView` URL, the
  `player-screen` areas, the tempo and hands popovers, the loop button, ‹ ▶ ›, Wait mode's line, `PlayingToggles` for the Setup's grid), `sheet-music`
  (`SheetMusic`: the Score engraved, labels, the cursor, bars to jump to, the loop's grips), `chord-explorer` (the
  chord builder, read top to bottom: `ChordBuilder` (its choices as labelled fields), `ChordSheet`, `ChordTensions`
  (a 7th chord's twelve notes in the owner's table's four groups, each played on top), `ChordPractice` (its arpeggio
  and chromatic walk in the Player), `viewChord`, `changedView`), `scale-explorer` (`ScaleExplorer` picks, in
  `ScaleLayout`'s one flow, `RunView`, the run from any Start on note, the playing hand's fingers under the keys, on a
  staff, with `ScaleExercises` (the scale's exercises in the Player), `ChordsView`, the scale's chords to 13ths in an
  inversion, walked, or `KeyView`, a major or minor scale's key: the circle of fifths, its signature,
  facts and borrowed chords; its pure marks, plays, `scaleRunOf`, `keyOfScale` and `showsOf` in `model/`), `interval-explorer` (every interval over a root
  as Clefs' cards), `chord-finder` (keys tapped or held named as a chord), `reharmonise` (the chords that hold a melody note),
  `passing-chords` (the ways between two chords, each row voice-led), `subject-tabs` (a subject's pages as tabs that
  are links: `ChordsTabs`, `ScalesTabs`, `ProgressionsTabs`, `AccompanimentTabs` over its URL's `AccompanimentView`), `score-sheet` (the score editor's sheet: a line of
  grand staff per chart line, `lineMusic`, the caret, the bars chosen, Pattern marks, bars as buttons), `exercise-list` (the Exercises page's groups, each
  row opening its Player), `pattern-music` (a pattern heard: `patternSample` over a bar of C or a tune's first line,
  `PatternStaff`, `PatternPlay`), `progressions` (a progression in any key: its row of chords, `ProgressionChoice`
  (the library behind one pop-up) and the typed field; `ProgressionPractice`, a row into the Player for the key alone and for each walk through the keys; its pure `changedView` (a key turned minor or major takes a
  cadence to its version in that mode, ADR 0031), `chosenView` and `playerSearch` in `model/`), `lesson-view` (a worksheet under its pinned keys: every block, one open quiz in
  `lesson-quiz.ts`, `PatternExample` over `patternOpening` (a piece's first line with a pattern), `LessonLinkRow`), `step-panel`, `trainer-board` (one round of a trainer and a run's results, the Check's board too),
  `trainer-choice` (a trainer's Custom fields), `trainer-list` (a group of trainers, and `GapsLink`, My gaps in Quiz's bar), `take-roll` (`TakeRoll`, a take as a piano roll over `rollOf`, its playhead
  moved by the audio clock), `live-score` (`LiveScore`: the trail of chords played, `strike` within 50 ms, `trailMusic`, `liveName`)), each owning in `model/` the view type a route's URL holds.
- **features/<x>/**: commands, one use case per file (`set-preference/set-theme.ts`, `mark-learned` with its
  `LearnedCheck` on a row and `LearnedButton` on a screen, `record-answer`, `record-practised`, `reset-progress`, `remember-view`, `manage-patterns` (favourite, hide, save and delete
  the learner's own), `edit-piece` (save a version's or own song's music, reset a version, make, rename and delete a
  song with its takes; `chartStart`)), `score-editor` (the draft of a piece's music, `readDraft`/`writeDraft`; its pure edits of notes,
  chords, bars, sections and settings; a take written from the caret's bar, `writeTake`, `takeParts`; the
  caret; `reduce` with undo and redo; `createEditorStore`), `record-take` (ADR 0028: `takeOf`, the keys and the three pedals heard
  against the click, `isKept`; `startRecorder`, the tune under it; `useRecorder`, a take's end `stopped` or `left`), `manage-takes` (`saveTake`, `deleteTake`, `renameTake`, `keepTakeBars`), `connect-midi` (the connection, the status
  control naming a chosen keyboard away, held keys (on under the sustain), `useMidiKeyDown`, `useMidiSync` (ADR 0034: `configure`, MIDI keys through the live voice with Sound the MIDI keyboard, its pedals the voice's, notes through the piano), `MidiSettingsFields`, the rail's `MidiSoundToggle`), `live-keyboard` (`LiveKeyboard`, the keyboard every screen shows, set up by the saved keyboard
  settings: keys go down as they sound or are held on MIDI, a touched or typed key sounds while held (`useLiveVoice`), `PedalToggle` and `useSpacePedal` hold the sustain, `spotlight` puts down only
  the keys struck last, `keyPlays` makes a key play more than itself; the rail's settings button and `KeyboardSettingsFields`, the settings in its popover and in
  Settings; `use-typing`, the computer keyboard as a piano; `ExplorerKeyboard`, the explorers' and a lesson's pinned one; `GlissandoToggle`, the rail's own), `play-example` (the examples an explorer and a
  lesson share, each shown on the page's keys: `IntervalCard`, `ScaleExample`, `NotesExample`, `ChordRow` (any row of
  chords voiced smoothly: a progression's by `progressionRow`, a passing chords way) with its parts `RowChords` and
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
  times, streak, summary), `useTrainer`, the Check's plan, My gaps); `record-run` (a run's record).
- **entities/<x>/**: `model/types.ts` (types, guards, validating constructors; no IO, no React), `model/store.ts`
  (`createSavedStore`: its key, version, initial state and sanitiser), `model/selectors.ts`, `model/context.ts`
  (`createStoreContext`), `content/` (authored data), `ui/` (only the entity's own data shown: a piece's titles, credits
  and section headings, `PieceLink` to a piece's page on its shelf; a step's title and `ExplorerLink`), `index.ts`.
  Content: `piece` (42 pieces, 7 listings; a chart's parser and the parser of a song written in degrees (`isDegreePiece`:
  a piece's format is not its kind), a piece's `recording`; `SONG_COLLECTIONS` on Songs, `METHOD_BOOK_PIECES` (a method book's: the studies on
  Practice, the hymns),
  `entriesInKey`, `pieceFit`, `choosableChordSize`,
  `isOwnKey`; bars of either hand written out (`hands`, `parseHands`) and the writers back to text (`writeBar`,
  `writeMelody`, `writeHand`, `PieceMusic`, `readMusic`); the learner's own, ADR 0027: `pt-pieces`, version 1, their
  versions by piece id and their own songs (`my-<n>`), read through the repertoire (`repertoire`, `useRepertoire`):
  the catalog in the learner's versions and their songs, what the router, Songs, a piece's page and the Player read;
  `selectVersion`, `selectHasVersion`, `selectOwnSong`), `pattern` (39 patterns, each with its idea in a line; the pattern book (`patternBook`, `BUILT_IN_PATTERNS`,
  `usePatternBook`, ADR 0026) over the learner's own (`OwnPattern`, `my-<n>`), looked up by `PatternRef`; `pt-patterns`,
  version 1: favourites, hidden, own; `PATTERN_GROUP_BOOK`; `referenceShelves` (a part of `REFERENCE_PARTS`) /
  `pickerShelves`, named by `useShelfName` / `useFullShelfName`; `PatternFit` and `patternNeed` /
  `playablePattern`, what music can play; `followsInversion`, whether an inversion changes it), `path` (with `LEVEL_NAME`), `lesson` (lessons as content,
  worksheets: text, steps, notes, chords, grids, scales, intervals and lines of notes that play, quizzes answered on
  the keys, patterns over their pieces and progressions in any key, links by name to the explorers and
  the Player (a `player` link opens a progression walked through the keys or in an inversion); `readProgression` reads a progression block or link; `LESSON_MODULES`: Fundamentals, Accompaniment,
  each method book, Gospel), `book` (the books a Source cites; `METHOD_BOOK_IDS`, `METHOD_BOOK_NAMES`, ADR 0033), `progression-library` (the one model of a progression that is practised: named, by style, in numerals,
  each line once in its mode, with its note, pattern and chord size; `libraryProgression` names a line, `COMMON_PROGRESSIONS`
  a key's, `LIBRARY_BY_STYLE` what its pop-up lists, `otherModeVersion` a cadence's version in the other mode, from
  `MODE_VERSIONS`), `exercise` (the exercises: groups, levels, names, the fields each rule takes and its own choice;
  `exerciseChoice` reads a URL against an exercise). Saved state: `settings` (`pt-settings`, version 9, with the laptop's sidebar, open or collapsed, the
  keyboard settings, the trainers' auto-next, the recorder's click and tune, and the MIDI keyboard's `midi`: device, sound, through the piano, octave shift, Touch, pedal), `take` (ADR 0028, 0034: `pt-takes`, version 2: a name, the bar it starts at, the three pedals' presses; saved
  compactly through `createSavedStore`'s `write`; `selectTakesOf`, `selectRoomLeft`; `takeSounds` (its pedals, through the Touch) and `takeSoundsFrom`, `barMs`, `keepBars`, `quantise` to `takeGrids` of the take's meter, `midiFile`), `progress` (`pt-progress`, version 2, with each trainer level's record; the evidence rules in `model/mastery.ts`, what an answer or a mark
  changes in `model/changes.ts`; `ratingOf` rates a skill, `selectSuggestedStep` is Continue), `views` (`pt-views`,
  version 3: each remembered screen's last view under its path of today, at most 200, `selectView`, `viewOf`, `sameView`, `withView`; written by `features/remember-view`).
- **shared/**: `lib` (`cn`, `safeLocalStorage`, `savedObject`, `createSavedStore` (a zustand `persist` store read
  by one sanitiser for any version, saved as its `write` makes it, following other tabs' saves), `downloadFile`, `isOneOf`, `toggled`, `createStoreContext`, `useMediaQuery`,
  `useScrollMotion`, `useShownOnScrollUp` (the screen bar's hide and show), `IN_PLACE` (a navigation that changes the
  screen in place: replace, keep the scroll) and `useViewChange` (a screen's choices written to its URL with it), `OPEN_PLAINLY` (a link's history state: open a remembered screen as
  left), `useGoBack`, `usePresses` (the keys a hand holds, each down at least the shortest press), `keyboardLayout` with
  `PIANO_LAYOUT` and `keyAt` (the key under a point), `keyboard-choices` (the keyboard settings' options), `midi-choices` (the MIDI keyboard's), `diagram-marks` (a teaching diagram's marks in a URL, `markKey`),
  `keyboard-view` (the view's frame, an octave's scroll), `typing-keys`, the search-param readers and `chord-params` (a chord's parts as the Chords explorer's URL holds
  them), `foldText`; and with
  barrels of their own: `music` the theory kernel (the piano's ranges; thirteen scale kinds in three families,
  `scaleKey`, `relatedScale`; fingerings from any start and over several octaves, `thumbFingering`, `arpeggioFingering`; `scale-chord.ts`, a scale's chords stacked
  to 13ths and named by `stackSuffix`, `scaleChordAt`, `borrowedChords`; `chord-parts.ts`, a chord built from its parts
  (`buildChord`, `fitParts`), and `chord-name.ts`, the naming tables both share; `writtenSymbol`, `qualityRootSpelling`,
  `readChordSymbol`, `keySymbol`, `keyMode`, `fitInversion`, `STACK_SIZES`; `nameChords`, the Chord finder's, with the tones
  a hand leaves out, `leftOut`; `circle.ts`, the circle of fifths;
  `placeChord` over any tones, `placeScale`, `placeScaleChords` and `walkChords`; `interval-facts.ts`,
  the Intervals explorer's intervals and `consonanceOf`; `tensions.ts`, the one source of available tensions; `chord-finder.ts`, `reharmonise.ts`,
  `passing-chords.ts`, `voice-lead.ts` (a row's hands: a 9th's root left to the bass, a slash chord over the bass it writes, the bass under the hand) and `numerals.ts` (a degree with any chord of the table, read the sheets' way, ADR 0032), the tools' kernel; `key-walk.ts` (`walkKeys`, a progression's keys and home);
  `INVERSIONS`; `spellBelow`, `plainRoot`, `tonesInKey` (a key's spelled notes), `kindComingDown`, `circleKey`, `beatsBefore` (a pickup)), `exercise` (the exercises' rules, each a choice → a Performance laid out by
  `exercisePerformance`: scales, sequences, contrary motion, arpeggios, Barry Harris's, Piano With Jonny's, the
  five-finger position, Hanon No. 1), `arrangement`
  (`arrange`, a chart → a Performance: each note's written onset, roll and spelling, the right hand's chord voice-led or
  in one inversion (`voiceInversion`, `inversionPitchClasses`); a bar's written hands in place of the pattern's;
  `chartInKeys`, a chart once per key; `transposeChord`, `transposeNotes`; `playsKeyTriads`), `notation` (`notate`, a
  Performance → a Score: measures, voices, values, ties, accidentals; a bar's blank staff a hidden rest), `schedule` (a Performance → sounds in seconds,
  swing, Listen's loop over a passage with each pass's tempo, a bar, a chord's keys, a recording under a pass (`recordingPlay`), a take's count-in and click (`recorderClicks`, on the Player's bar grid), a walk of chords, a scale's
  run in ticks (`scaleRun`, `runSounds`), a chord written as a bar (`chordBar`), a lesson's line of notes (`noteLine`), a hand's keys, an interval up, down or
  together (`intervalSounds`), which keys sound when and which were struck last; `damper.ts`, the three pedals over held keys; `velocity.ts`, `velocityGain`, `touchVelocity`), `services`
  (`ServicesProvider`, `useServices`, `usePlay`, `usePlayback` (a Play button's Stop), `useLiveVoice` (a hand's keys: a tap's key or
  the chord a key stands for, sounding while held), `usePedal`, `useSoundingKeys` (the music's, the struck, the live voice's))), `config` (`THEME_COLORS`, `PRECACHE_FILE_LIMIT`), `api` (the `audio` and `midi` ports, their browser adapters and
  fakes; MIDI events carry their time and the three pedals are `onPedal`; the MIDI port (`MidiPort`) hears the keyboard chosen as `configure` says and lists its speakers (`outputs`, `noteOutput`); the audio port's live voice (`press`, `release`, `pedal`, `live`) beside `play()`, and its notes `notesTo` a keyboard's speaker (`midi-sound-output.ts`); the audio port knows which keys it is sounding,
  whether a play still sounds, and the audio time heard at a moment (`audioTimeAt`); it plays a piece's recording on
  the audio clock: `loadRecording`, `playRecording`, `recording-player.ts`), `ui` (the kit: `PianoKeyboard`
  with `RailButton` and `RailChoice` (a choice set on the keyboard's rail), `Pinned`, `ScreenHeader` (the screen's bar, sticky, hidden while reading down; `ScreenBarProvider` in `AppShell`
  sets `--screen-bar`, which `Pinned` and the `top-screen-bar` utilities read), `BackButton` (a screen's Back, over `useGoBack`), `RoundButton`, `RoundLink`, `ButtonLink`, `Segmented`, `NamedSegmented`, `Listbox`, `Dropdown` (the pop-up
  button; `bare` under a printed name), `MultiDropdown` (the pop-up that checks several, grouped like `Dropdown`; in both a list with other values is another list, mounted anew: `listKey`),
  `NoteChoice` (a note as written: its letter, then ♮ # ♭) and `KeyChoice` (a key as written: its tonic so, then Major · Minor, only the keys a signature writes), `ToggleChips` (several of a few, all in sight), `ChordHeading` (a chord's symbol, a long one a size down), `Labelled` (a choice under its name, one field of a page's `grid-fields`), `SettingField` (a choice in Settings under its name), `NavTabs` with `NavTab` (tabs that are router links, each saying whether its page is shown), `InversionChoice` over `InversionGlyph`, `ChordSizeField`, `SwitchRow`, `ToggleTile` and `ToggleGrid`, `ToolButton`, `LearnedBadge`, `TypedField`, `RowLink` (its tile an icon, a number or none, a detail of one line, a trailing slot) and `RowGroup` (a titled grid of row cards), `PAGE_TILES` (the tile a row to each page wears), `Fact`, `PlayToggle` and `ChordButton`, `ToneChip`, `PlayLabel` (a Play button's words, Stop while it sounds), `ShownKeys` with `NO_KEYS` and `unmarked`, `PAINT`,
  `Sheet` with its trigger (its content carries a Close for a screen reader), `RatingMark`, `LevelMark`, `NotFound` (a page not there, or deleted in another tab), `LazyScoreView` (a staff outside the Player,
  VexFlow loaded when first shown; `staff` draws one staff of the grand staff); shadcn in `ui/primitives`; `ui/score`, imported by that path only: `ScoreView`,
  VexFlow over a Score (each note named by its staff and tick, the `selected` ones marked), and `xAtTick`), `i18n` (`Locale`,
  `useLocale`, `useScaleName`, `useKeyName`, `LocalText`; namespaces per place, `music` for the words every screen shares), `test`.

**State:** what you look at → URL search params. What must be remembered → a persisted entity store; a screen's last
view → `pt-views` (ADR 0022). Everything else → component state.
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
- Tests colocated as `*.test.ts(x)`; Vitest + jsdom with **`globals: false`** (import `describe/it/expect/vi`).
  Setup: `src/shared/test/setup.ts` (jest-dom, cleanup, English, and per-test fakes: `stubMatchMedia` for the OS
  scheme, `stubServiceWorker` for a waiting version, `stubFonts` for the music font and a canvas that measures text, `stubIntersectionObserver` with everything on screen). Only a test the DOM gets in the way of opts into
  `// @vitest-environment node` (the ESLint API in `architecture.test.ts`). With the settings store:
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
