# CLAUDE.md

## Answer style

Concise. Answer first. No preamble, no recap.

Piano Trainer: an offline-first PWA for learning songs, chords and scales at the piano. React 19 + Vite + strict
TypeScript, **Feature-Sliced Design** (lint-enforced), English + Russian, deployed on Vercel. Design:
[spec](docs/superpowers/specs/2026-09-24-piano-trainer-rewrite-design.md). The old single-file app is
`legacy/index.html`: a reading reference, never imported, deleted at the Phase 4 switch-over.

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
- **Saved data keeps working.** Persisted stores (`pt-settings`, `pt-progress`) carry a `version`; a shape change
  ships a `migrate` and a sanitising `merge`, never a reset.
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
`shared/lib/music` imports only itself, `shared/lib/arrangement` and `shared/lib/notation` only music, and none of them
imports a package.
`eslint-plugin-boundaries` and `no-restricted-imports` enforce all of it, and `src/app/architecture.test.ts` proves
it. `@` → `src`.

- **app/**: `router.tsx` (code-based TanStack Router, the four places Path · Songs · Learn · Practice; Learn's
  references Chords, Scales, Keys (`/learn/keys`), Intervals (`/learn/intervals`) and Available tensions
  (`/learn/tensions`), and the tools Chord finder, Reharmonise and Passing chords (`/learn/chord-finder`,
  `/learn/reharmonise`, `/learn/passing-chords`); the Player's `/play/$pieceId`, `/play/walk` and `/play/chromatic`; screens are
  lazy through `routes/*-screens.ts` (home, songs, learn, practice, player); `notFound()` for an unknown piece, lesson,
  quiz or check, a piece on the wrong shelf, and a walk of a scale without chords), `routes/search.ts` (every route's `validateSearch` and defaults, typed with
  `import type` from the slice that owns each view: the router imports no page or widget code, or it would leave its
  lazy chunk), `App.tsx` (the provider stack: `<App settingsStore progressStore services router />`),
  `composition-root.ts` → `createServices()` (audio + MIDI, built once in `main.tsx`), `providers/` (`LocaleSync`,
  `ThemeProvider`, `AudioUnlock`), the layouts (`RootLayout`; `ShellLayout` → `AppShell` with the docked tab bar and the laptop's sidebar;
  `FullScreenLayout` for the Player and the Check, the viewport's height), `RoutePending`, `update-prompt/`, `RouteError`,
  `testing/`.
- **pages/<x>/ui/**: one per route; composes widgets + `shared/ui`. A page with many acts has one hook in `model/`
  (`pages/player/model/use-player.ts`: a piece → its Performance, then the Player's hook), which is its test surface.
  `pages/player` serves a piece or a walk: one screen (`PlayerLayout`) that `PlayerPage` (`usePlayer`, `PieceSetup`),
  `WalkPlayerPage` (`useWalkPlayer`, `walk-search.ts`, `WalkSetup`) and `ChromaticPlayerPage` (`useChromaticPlayer`,
  `chromatic-search.ts`, `ChromaticSetup`) fill; `pages/keys` is the Keys reference, `pages/intervals` and `pages/tensions` the Intervals and Available tensions
  references.
- **widgets/<x>/**: composite UI tied to screens (`app-nav`, `continue-card`, `path-levels`, `piece-list`,
  `chord-chart` (a piece's lines of bars), `piece-skills`, `player-setup` (the Setup sheet, its first page composed by
  its page: `PlayerSetup` over `FigureChoice`, `FigureRows`, `ChordSizeField`, `MelodySwitch`, `RecordingSwitch`), `practice-player` (the Player over any Performance: `usePracticePlayer`, its `PracticeView` URL, the
  `player-screen` areas, the tempo and hands popovers, the loop button, ‹ ▶ ›, Wait mode's line), `sheet-music`
  (`SheetMusic`: the Score engraved, labels, the cursor, bars to jump to, the loop's grips), `chord-explorer` (the
  chord builder: `ChordBuilder`, `ChordSheet`, `viewChord`, `changedView`), `scale-explorer` (`ScaleExplorer` picks
  `RunView`, the run from any Start on note, fingered, on a staff, or `ChordsView`, the scale's chords to 13ths in an
  inversion with the walk card; its pure marks, plays and `scaleRunOf` in `model/`), `key-explorer` (the circle of
  fifths and a key's facts, signature, chords and borrowed chords), `interval-explorer` (every interval over a root
  as Clefs' cards), `tension-explorer` (a 7th chord's twelve notes in the owner's table's four groups, each played on
  top), `chord-finder` (keys tapped or held named as a chord), `reharmonise` (the chords that hold a melody note),
  `passing-chords` (the ways between two chords, each row voice-led), `lesson-view` (a worksheet under its pinned keys: every block, one open quiz in
  `lesson-quiz.ts`, `LessonLinkRow`), `step-panel`, `quiz-board`, `quiz-choice`), each owning in `model/` the view type a route's URL holds.
- **features/<x>/**: commands, one use case per file (`set-preference/set-theme.ts`, `mark-learned` with its
  `LearnedToggle`, `record-answer`, `record-practised`, `reset-progress`), `connect-midi` (the connection, the status
  control, held keys, `useMidiKeyDown`), `live-keyboard` (`LiveKeyboard`, the keyboard every screen shows, set up by the saved keyboard
  settings: keys go down as they sound or are held on MIDI, a touched or typed key sounds, `spotlight` puts down only
  the keys struck last, `keyPlays` makes a key play more than itself; the rail's settings button and `KeyboardSettingsFields`, the settings in its popover and in
  Settings; `use-typing`, the computer keyboard as a piano; `ExplorerKeyboard`, the references' and a lesson's pinned one), `play-example` (the examples a reference and a
  lesson share, each shown on the page's keys: `IntervalCard`, `ScaleExample`, `NotesExample`, `ShownKeys`), and the
  machines:
  `practice` (the pure `practice-machine`, `usePractice`, which drives it with audio, MIDI and the clock, and the
  Player's pure parts: `ownChoice`, `arrangePiece`, the marks, the loop's bars (`readLoop`, `loopParam`,
  `loopBeatGroups`), `speedUp`, the walk (`WALK`, `walkChart`, `arrangeWalk`) and `PractiseChords` (a scale's walk
  and its key's common progressions into the Player); the chromatic walk (`CHROMATIC`, `chromaticChart`,
  `arrangeChromatic`, `readChords`, `ChromaticWalkLink`); Listen and Wait mode, Play in both, ‹ › in either) and `quiz` (the machine, check plans, the
  Theory quizzes (`isTheoryQuiz`), My gaps, `useQuiz`).
- **entities/<x>/**: `model/types.ts` (types, guards, validating constructors; no IO, no React), `model/store.ts`
  (zustand `persist` over `safeLocalStorage()`, versioned, sanitising `merge`), `model/selectors.ts`, `model/context.ts`
  (`createStoreContext`), `content/` (authored data), `ui/` (only the entity's own data shown: a piece's titles, credits
  and section headings, `PieceLink` to a piece's page on its shelf; a step's title and `ExplorerLink`), `index.ts`.
  Content: `piece` (54 pieces, 7 listings, chart and progression parsers, a progression in one line or in sections, a piece's `recording`; `SONG_COLLECTIONS` on Songs, `STUDIES` and
  `PROGRESSIONS` on Practice, `COMMON_PROGRESSIONS` a key's, `entriesInKey`), `pattern` (39 patterns), `path` (with `LEVEL_NAME`), `lesson` (lessons as content,
  worksheets: text, steps, notes, chords, grids, scales, intervals and lines of notes that play, quizzes answered on
  the keys, links by name; `LESSON_MODULES`). Saved state: `settings` (`pt-settings`, version 5, with the
  keyboard settings), `progress` (`pt-progress`; the evidence rules in `model/mastery.ts`, what an answer or a mark
  changes in `model/changes.ts`; `ratingOf` rates a skill, `selectSuggestedStep` is Continue).
- **shared/**: `lib` (`cn`, `safeLocalStorage`, `savedObject`, `isOneOf`, `createStoreContext`, `useMediaQuery`,
  `useGoBack`, `usePresses` (the keys a hand holds, each down at least the shortest press), `keyboardLayout` with
  `PIANO_LAYOUT` and `keyAt` (the key under a point), `keyboard-choices` (the keyboard settings' options),
  `keyboard-view` (the view's frame, an octave's scroll), `typing-keys`, the search-param readers, `foldText`; and with
  barrels of their own: `music` the theory kernel (the piano's ranges; thirteen scale kinds in three families,
  `scaleKey`, `relatedScale`; fingerings from any start, `thumbFingering`; `scale-chord.ts`, a scale's chords stacked
  to 13ths and named by `stackSuffix`, `scaleChordAt`, `borrowedChords`; `chord-parts.ts`, a chord built from its parts
  (`buildChord`, `fitParts`), and `chord-name.ts`, the naming tables both share; `circle.ts`, the circle of fifths;
  `placeChord` over any tones, `placeScale`, `placeScaleChords`, `walkChords` and `chordHolds`; `interval-facts.ts`,
  the Intervals reference's intervals and `consonanceOf`; `tensions.ts`, the one source of available tensions; `chord-finder.ts`, `reharmonise.ts`,
  `passing-chords.ts` and `voice-lead.ts`, the tools' kernel; `spellBelow`, `plainRoot`, `keyPitchClasses`), `arrangement`
  (`arrange`, a chart → a Performance: each note's written onset, roll and spelling; `playsKeyTriads`), `notation` (`notate`, a
  Performance → a Score: measures, voices, values, ties, accidentals), `schedule` (a Performance → sounds in seconds,
  swing, Listen's loop over a passage with each pass's tempo, a bar, a chord's keys, a recording under a pass (`recordingPlay`), a walk of chords, a scale's
  run in ticks (`scaleRun`, `runSounds`), a chord written as a bar (`chordBar`), a lesson's line of notes (`noteLine`), a hand's keys, an interval up, down or
  together (`intervalSounds`), which keys sound when and which were struck last), `services`
  (`ServicesProvider`, `useServices`, `usePlay`, `usePlayback` (a Play button's Stop), `useSoundKeys` (a hand's play: a tap's key or
  the chord a key stands for), `useSoundingKeys`)), `config` (`THEME_COLORS`), `api` (the `audio` and `midi` ports, their browser adapters and
  fakes; the audio port knows which keys it is sounding and whether a play still sounds; it plays a piece's recording on
  the audio clock: `loadRecording`, `playRecording`, `recording-player.ts`), `ui` (the kit: `PianoKeyboard`
  with `RailButton`, `Pinned`, `ScreenHeader`, `RoundButton`, `RoundLink`, `ButtonLink`, `Segmented`, `Dropdown` (the pop-up
  button), `MultiDropdown` (the pop-up that checks several, grouped like `Dropdown`), `RowLink` and `RowGroup`, `Fact`, `ChordButton`, `PAINT`,
  `Sheet` with its trigger and close, `RatingMark`, `LevelMark`, `LazyScoreView` (a staff outside the Player,
  VexFlow loaded when first shown; `staff` draws one staff of the grand staff); shadcn in `ui/primitives`; `ui/score`, imported by that path only: `ScoreView`,
  VexFlow over a Score, and `xAtTick`), `i18n` (`Locale`,
  `useLocale`, `useScaleName`, `LocalText`; namespaces per place, `music` for the words every screen shares), `test`.

**State:** what you look at → URL search params. What must be remembered → a persisted entity store. Everything
else → component state.
**Theme:** `index.html`'s `#theme-boot` script paints `data-theme` before first paint from `pt-settings`;
`ThemeProvider` keeps it and colours the browser toolbar from `THEME_COLORS`. `src/app/theme-boot.test.ts` holds
the script to the store.
**Installed app:** `#standalone-boot` locks pinch and double-tap zoom in the installed app only (a tab keeps its
zoom); `theme.css`'s base keeps text unselectable outside fields, with no callout, no overscroll and no double-tap
wait on controls (Mindscape's PWA setup; `src/app/standalone-boot.test.ts`).

## Read before you touch

- **Any UI** → [CODE_STYLE](docs/CODE_STYLE.md).
- **Content** (a piece, listing, pattern, path step) → [CONTENT](docs/CONTENT.md).
- **Naming anything** → [UBIQUITOUS_LANGUAGE](docs/UBIQUITOUS_LANGUAGE.md). "Piece" in code, "Song", "Study" or
  "Progression" in the UI. A "Skill" is a quiz-rated chord quality or scale kind, nothing else.
- **Why it is this way** → [docs/adr](docs/adr).
- **Music logic** → CODE_STYLE §8 and spec §4.

## Conventions

- Strict TS: `noUncheckedIndexedAccess`, `noUnusedLocals/Parameters`, `verbatimModuleSyntax` → `import type`.
  No `any`.
- Tests colocated as `*.test.ts(x)`; Vitest + jsdom with **`globals: false`** (import `describe/it/expect/vi`).
  Setup: `src/shared/test/setup.ts` (jest-dom, cleanup, English, and per-test fakes: `stubMatchMedia` for the OS
  scheme, `stubServiceWorker` for a waiting version, `stubFonts` for the music font and a canvas that measures text). Only a test the DOM gets in the way of opts into
  `// @vitest-environment node` (the ESLint API in `architecture.test.ts`). With the settings store:
  `renderWithSettings(ui, { locale, theme })`; the whole app: `await renderApp(path, { locale, webMidi })`, which
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
