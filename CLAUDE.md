# CLAUDE.md

## Answer style

Concise. Answer first. No preamble, no recap.

Piano Trainer: an offline-first PWA for learning songs, chords and scales at the piano. React 19 + Vite + strict
TypeScript, **Feature-Sliced Design** (lint-enforced), English + Russian, deployed on Vercel. Product:
[PRODUCT.md](PRODUCT.md).

## Skills — before writing code

- `owner-way` (`.claude/skills/owner-way`) → at the start of every session: the owner's quality bar, reference apps
  and workflow (rounds, worktree agents, merging, reporting).
- `tdd` → every module, test first (red → green → refactor).
- `vite-react-best-practices` / `vercel-react-best-practices` → performance, bundle, Vite SPA.
- `vercel-composition-patterns` → component APIs.
- `shadcn` → anything in `src/shared/ui/primitives` (add with the CLI, never by hand).
- `impeccable` → visual design work, over [DESIGN.md](DESIGN.md): call it with a command and a target
  (`audit`, `polish`, `adapt`, `harden`, `clarify`, `distill` …); our screens are its Operate mode.
- `vercel:knowledge-update` → before touching `vercel.ts` or anything Vercel.
- `humanizer` / `writing-guidelines` → docs and any prose the app shows.
- `superpowers:*` (enabled in `.claude/settings.json`) → `systematic-debugging`, `verification-before-completion`,
  `writing-plans` for a large feature, run inline; the owner-way skill decides when agents are worth it.
- **Not applicable:** React Native, Next.js and Angular skills.

Which skill when, who calls it, and impeccable's commands: `.claude/skills/owner-way/references/practices.md`. A large
feature gets a short spec in `.scratch/<feature>/spec.md` first.

## Change rules

- **Latest stable dependencies, no legacy in code.** No shims, fallbacks or deprecated APIs. Pinned majors:
  TypeScript 6, Vitest 4, jsdom 29, jest-dom 6, eslint-plugin-boundaries 6, and `@vite-pwa/assets-generator` 1 (the
  range `vite-plugin-pwa` accepts). Bumping one is its own change.
- **Saved stores read one version.** Every persisted store (`pt-settings`, `pt-progress`, `pt-pieces`, `pt-library`,
  …) is a `createSavedStore` (`shared/lib/saved-store.ts`): it carries a `version`, reads a save of that version field
  by field through one sanitiser (a field added later reads as its default), starts from its initial state over any
  other version's save, and follows another tab's saves of its version. Until release the app has no users: a shape
  change bumps the version, with no migration and no reader of old saves. The built-in content always works.
- **Staged is deliberate.** Never `git checkout`/`restore`/`stash`/`reset` the owner's work unprompted.
- **New code copies the nearest slice's shape.** Writes → a feature command. Reads → selectors. Pure logic →
  `shared/lib` or `entities/*/model` with a colocated test.
- **Complete, not placeholder.** Every UI string in both `en` and `ru`. Loading, empty, error and offline states.
- **Verify before claiming done:** `npm run typecheck && npm run lint`, then **only the tests your change can
  break** (`npm run test:related -- <changed source files>`, or `npm run test:changed` for everything uncommitted).
  The full `npm run test` takes minutes: run it once before a push that touches shared code (`shared/lib`, an
  entity's model, `app/`, the test setup or config), never after each edit. After touching startup, routing, the PWA
  or config, also `npm run build`. CI runs only by hand, so these local checks are the gate.
- **Work inline; agents are the exception** (the `owner-way` skill's maximum principle: the best result for the
  least usage). When a large, separable part does go to an agent (worktree), it commits one task at a time and checks only what it changed
  (`typecheck`, `lint`, `test:related`/`test:changed`; `build` only after touching startup, routing, the PWA or
  config), never the full suite. The session's branch merges every agent's branch, runs the full `npm run test` and
  `npm run build` once on the merged result, updates this file and the docs, then pushes the branch and `main`.

## Commands

Node 24 (`.nvmrc`, `nvm use`). `dev` · `build` · `preview` · `typecheck` · `lint` (includes the layer rules) ·
`test` (everything) / `test:unit` (the node half) / `test:related -- <files>` / `test:changed` / `test:watch` /
`test:cov` (90% lines on `src/shared/lib/**` and `src/entities/*/model/**`) · `icons` (the PWA icons from
`public/favicon.svg`). CI (`.github/workflows/ci.yml`: typecheck, lint, `test:cov`, build) runs only when started by
hand. Vercel previews each PR and deploys `main`.

One file: `npx vitest run src/shared/lib/cn.test.ts` · one test: `npx vitest run src/x.test.ts -t "saves a new
language"` (always with its file: `-t` alone still loads every file).
**Never `npm run format`** on the whole repo: `npx prettier --write <files you touched>`.

## Architecture — FSD (lint-enforced)

`app → pages → widgets → features → entities → shared`. Import from your own layer or below, never above; another
slice only through its `index.ts`. A page imports no other page: what two pages share is a widget. `@` → `src`.

**The kernel** inside `shared/lib` is fenced tighter: `music` imports only itself, `notation` and `arrangement` only
music, `exercise` music and arrangement, and none of them imports a package. `eslint-plugin-boundaries` and
`no-restricted-imports` enforce all of it (`eslint.config.js`); `src/app/architecture.test.ts` proves it.

- **app/** — `router.tsx` (code-based TanStack Router), `routes/` (each place's lazy screens in `*-screens.ts`, its
  search validators and defaults in `*-search.ts`, the remembered-view redirect in `remember.ts`), `App.tsx` (the
  provider stack), `composition-root.ts` (`createServices()`: audio + MIDI, built once in `main.tsx`), `providers/`,
  the layouts (`RootLayout`, `ShellLayout` → `AppShell` with the tab bar and the laptop's sidebar,
  `FullScreenLayout` for the Player), `testing/`. The router imports no page or widget code: its search files import
  types only, or a screen would leave its lazy chunk.
- **pages/<x>/** — one per route; composes widgets and `shared/ui`. A page with many acts has one hook in `model/`
  (`pages/player/model/use-player.ts`, `pages/songs/model/use-library-page.ts`): that hook is its test surface.
- **widgets/<x>/** — composite UI tied to screens (`practice-player`, `sheet-music`, `chord-views`, `song-library`,
  `curriculum`), each owning in `model/` the view type its route's URL holds.
- **features/<x>/** — commands, one use case per file (`set-preference/set-theme.ts`, `manage-library`,
  `record-answer`), and the machines (`practice`, `trainer`, `score-editor`): pure reducers with a hook driving them.
- **entities/<x>/** — `model/types.ts` (types, guards, validating constructors; no IO, no React), `model/store.ts`
  (`createSavedStore`: key, version, initial state, sanitiser), `model/selectors.ts`, `model/context.ts`
  (`createStoreContext`), `content/` (authored data: pieces, patterns, lessons, courses, progressions), `ui/` (only
  the entity's own data shown), `index.ts`.
- **shared/** — `lib` (pure helpers and hooks, plus the kernel: `music` theory, `arrangement` (a chart → a
  Performance), `notation` (a Performance → a Score), `schedule` (a Performance → sounds), `exercise`; and `services`
  (audio and MIDI to React) and `shortcuts`), `api` (the `audio` and `midi` ports, browser adapters and fakes),
  `ui` (the kit; shadcn in `ui/primitives`; `ui/score`, Verovio over a Score, imported by that path only), `i18n`,
  `config`, `test`.

### The places and the main slices

Three places: **Learn · Songs · Practice** (`app/router.tsx` has every route; `routes/*-search.ts` every URL's
params). Decisions and their reasons: the ADRs in `docs/adr/` (index in its README).

- **Learn** (`/`, `?view=lessons|courses`) — the Lessons (journeys of chapters, `/lessons/$lessonId`) and the
  Courses (`/courses/$courseId`, its lessons under it); a lesson paged a section at a time on a phone, its
  progress and prerequisites on the contents. `pages/learn`, `pages/course`, `pages/lesson`;
  `widgets/curriculum`, `widgets/lesson-view`; `entities/lesson`, `course`, `step`, `progress`.
- **Songs** (`/songs`) — one library of folders, favourites and an archive; a song's page and its sections;
  MusicXML and MIDI import, MusicXML and MIDI export (`features/song-files`, `shared/lib/musicxml`).
  `pages/songs`, `pages/song-archive`, `pages/piece`; `widgets/song-library`; `features/manage-library`;
  `entities/library` (only what the learner changed, read over the catalog by `arrangeLibrary`) and
  `entities/piece` (the catalog, the learner's versions and own songs, `repertoire`).
- **Practice** (`/practice`) — explorers (Chords, Scales and keys, Intervals, Progressions, Accompaniment), the
  Chord finder, the Metronome, Exercises and Quiz (one setup and four drills for every trainer,
  `widgets/trainer-setup`), in three groups. Each page holds the tools that work on its thing, never a page of
  their own. `pages/<thing>`, `widgets/*-explorer`, `widgets/practice-pages`, `features/trainer`. Fingering by hand
  (scales and arpeggios as the printed books, chords by rule) and the voicings live in the kernel (`music/fingering`,
  `chord-fingering`, `voicing`); Hanon and the daily scale routine in `shared/lib/exercise`.
- **The Player** (`/play/$pieceId`, and walks, progressions and exercises under `/play/`) — one screen
  (`pages/player`'s `PlayerLayout`) over any Performance. `widgets/practice-player` (bar, tools row, dock,
  shortcuts), `widgets/chord-views` and `widgets/sheet-music` (the views), `widgets/player-setup`;
  `features/practice` (the practice machine, the arrangement of a piece, loops, beats) and `shared/lib/schedule`.
- **The score editor** (`/edit/$pieceId`, takes under it) — Flat's palette: a docked panel and a note-entry
  toolbar from 48rem wide, a bottom sheet on a phone (`EditorPalette`, `TOOL_SHORTCUTS`); the Player's score in Edit mode, sharing its bar and
  transport (`widgets/mode-switch`, `ScoreBar`). `pages/score-editor`, `widgets/score-sheet`;
  `features/score-editor` (the draft, its pure edits, undo, `createEditorStore`), `features/edit-piece` (saving),
  `features/record-take` and `manage-takes`.
- **Elsewhere** — Search (`/search`), Settings (`/settings`, How to use and the MIDI keyboard with its log under it), a shared song
  (`/songs/shared`).

**State:** what you look at → URL search params. What must be remembered → a saved entity store; a screen's last
view → `pt-views`. Everything else → component state.

**Keys:** a screen's shortcut → one `useShortcuts` call beside what it drives (`shared/lib/shortcuts`), never a
`keydown` listener of its own. A letter alone is the piano's (typing), so a shortcut takes a named key or a letter
typing leaves free.

**Theme:** `index.html`'s `#theme-boot` paints `data-theme` and the browser toolbar from `pt-settings` before first
paint; `ThemeProvider` keeps both from `THEME_COLORS`. `src/app/theme-boot.test.ts` holds the script to the store.

**Text accidentals:** neither face has ♭ ♮ ♯; both stacks take them from Text Accidentals (`src/styles/fonts/`,
written by `python3 scripts/text-accidentals.py`) before Noto Music.

**Installed app:** `#standalone-boot` locks pinch and double-tap zoom in the installed app only; `theme.css` keeps
text unselectable outside fields, with no callout, no overscroll and no double-tap wait
(`src/app/standalone-boot.test.ts`).

## Read before you touch

- **Any UI** → [CODE_STYLE](docs/CODE_STYLE.md); its look → [DESIGN.md](DESIGN.md).
- **Content** (a piece, listing, pattern, lesson, course) → [CONTENT](docs/CONTENT.md).
- **Naming anything** → [UBIQUITOUS_LANGUAGE](docs/UBIQUITOUS_LANGUAGE.md). "Piece" in code, "Song" or "Study" in
  the UI; a "Progression" is the library's, never a piece; a "Skill" is a quiz-rated chord quality or scale kind.
- **Why it is this way** → `docs/adr/` (index in its README). Contradicting an ADR → say so, then amend or supersede it.

## Conventions

- Strict TS: `noUncheckedIndexedAccess`, `noUnusedLocals/Parameters`, `verbatimModuleSyntax` → `import type`.
  No `any`.
- **Tests** colocated as `*.test.ts(x)`; Vitest with **`globals: false`** (import `describe/it/expect/vi`), in two
  projects (`vite.config.ts`): **`unit`** runs `*.test.ts` in node, **`dom`** runs `*.test.tsx` in jsdom. A
  `*.test.ts` that needs a DOM opts in with `// @vitest-environment jsdom` on its first line; pure logic never does.
  Setup: `src/shared/test/setup.ts`, and `setup-dom.ts` for a DOM (jest-dom, cleanup, English, per-test fakes:
  `stubMatchMedia`, `stubServiceWorker`, `stubIntersectionObserver`).
- **`isolate: false`**: a worker's files share their modules, window and document. The setup puts back mocks,
  globals, localStorage and the language and takes apart every tree a test mounted, so a test must leave nothing
  else behind: a listener it adds to the window or document stops when the test ends (`untilTestEnds()`, a saved
  store's `signal`, `heardUntil` round a router; `src/shared/test/listeners.ts`). A file that needs fresh module
  state starts with `vi.hoisted(() => vi.resetModules())`.
- **Rendering:** `renderWithSettings(ui, { locale, theme })`; the whole app, `await renderApp(path, { locale,
  storage, webMidi })`, which returns its stores and its fake `audio` and `midi` (`setNow` moves the audio clock); a
  widget that links elsewhere, `await renderRouted(ui)`; the router alone, `testRouter(path)` (all in
  `src/app/testing/`). A screen's test sits beside its page and runs the app through `renderApp`. jsdom lays nothing
  out: `stubBox` and `stubScrolling` (`src/shared/test/layout.ts`) where a position or a scroll matters.
- Prettier: no semicolons, single quotes, trailing commas `all`, printWidth 100.
- i18n: interface strings in `src/shared/i18n/locales/{en,ru}/<namespace>.ts`, one namespace per place plus
  `common` and `music`. Russian is typed against English, so a missing key fails `tsc`.

## Agent skills

- `.claude/skills/owner-way` → the owner's preferences and workflow. Read it at the start of every session.
- Issues and specs → `.scratch/<feature-slug>/` ([issue tracker](docs/agents/issue-tracker.md)). Labels:
  [triage-labels](docs/agents/triage-labels.md). Domain docs: [domain](docs/agents/domain.md).
