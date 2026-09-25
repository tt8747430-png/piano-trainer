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
`shared/lib/music` imports only itself, `shared/lib/arrangement` only music, and neither imports a package.
`eslint-plugin-boundaries` and `no-restricted-imports` enforce all of it, and `src/app/architecture.test.ts` proves
it. `@` → `src`.

- **app/**: `router.tsx` (code-based TanStack Router; screens are lazy through `routes/*-screens.ts`; `notFound()`
  for an unknown piece or check), `routes/search.ts` (every route's `validateSearch` and defaults, typed with
  `import type` from the slice that owns each view: the router imports no page or widget code, or it would leave its
  lazy chunk), `App.tsx` (the provider stack: `<App settingsStore progressStore services router />`),
  `composition-root.ts` → `createServices()` (audio + MIDI, built once in `main.tsx`), `providers/` (`LocaleSync`,
  `ThemeProvider`, `AudioUnlock`), the layouts (`RootLayout`; `ShellLayout` → `AppShell` with the floating tab bar;
  `FullScreenLayout` for the Player and the Check; `TheoryLayout`), `RoutePending`, `update-prompt/`, `RouteError`,
  `testing/`.
- **pages/<x>/ui/**: one per route; composes widgets + `shared/ui`. A page with many acts has one hook in `model/`
  (`pages/player/model/use-player.ts`), which is its test surface.
- **widgets/<x>/**: composite UI tied to screens (`app-nav`, `theory-nav`, `continue-card`, `path-levels`,
  `piece-list`, `chord-chart`, `piece-skills`, `player-setup`, `chord-explorer`, `scale-explorer`, `step-panel`,
  `quiz-board`, `quiz-choice`), each owning in `model/` the view type a route's URL holds.
- **features/<x>/**: commands, one use case per file (`set-preference/set-theme.ts`, `mark-learned` with its
  `LearnedToggle`, `record-answer`, `record-practised`, `reset-progress`), `connect-midi` (the connection, the status
  control, held keys), `live-keyboard` (`LiveKeyboard`, the keyboard every screen shows: keys go down as they sound or
  are held on MIDI, and a tapped key sounds), and the machines: `practice` (the pure `practice-machine`, `usePractice`, which drives it with
  audio, MIDI and the clock, and the Player's pure parts: `ownChoice`, `arrangePiece`, the note grid, the marks) and
  `quiz` (the machine, check plans, the theory quizzes, My gaps, `useQuiz`).
- **entities/<x>/**: `model/types.ts` (types, guards, validating constructors; no IO, no React),
  `model/store.ts` (zustand `persist` over `safeLocalStorage()`, versioned, sanitising `merge`),
  `model/selectors.ts`, `model/context.ts` (`createStoreContext`), `content/` (authored data), `ui/` (only the
  entity's own data shown: a piece's titles, credits and section headings; a step's title and `ExplorerLink`),
  `index.ts`. Content:
  `piece` (51 pieces, 7 listings, chart and progression parsers), `pattern` (39 patterns), `path`. Saved state:
  `settings` (`pt-settings`, version 2), `progress` (`pt-progress`; the evidence rules in `model/mastery.ts`, what
  an answer or a mark changes in `model/changes.ts`; `ratingOf` rates a skill, `selectSuggestedStep` is Continue).
- **shared/**: `lib` (`cn`, `safeLocalStorage`, `savedObject`, `isOneOf`, `createStoreContext`, `useMediaQuery`,
  `useGoBack`, `keyboardLayout`, the search-param readers, `foldText`; and with barrels of their own: `music` the theory kernel
  (with the piano's ranges and `placeChord`/`placeScale`), `arrangement` (`arrange`, a chart → a Performance),
  `schedule` (a Performance → sounds in seconds, Listen's loop, a bar, a chord, a scale run, a tap, which keys sound
  when), `services` (`ServicesProvider`, `useServices`, `usePlay`, `usePlayChord`, `useSoundKey`, `useSoundingKeys`)),
  `config` (`THEME_COLORS`), `api` (the `audio` and `midi` ports, their browser adapters and fakes; the audio port
  knows which keys it is sounding), `ui` (the kit: `PianoKeyboard`, `Pinned`, `ScreenHeader`, `RoundButton`,
  `RoundLink`, `ButtonLink`, `Segmented`, `ChipRow`, `Sheet` with its trigger and close, `RoleLegend`, `RatingMark`,
  `LevelMark`; shadcn in `ui/primitives`), `i18n` (`Locale`, `useLocale`, `useScaleName`, `LocalText`), `test`.

**State:** what you look at → URL search params. What must be remembered → a persisted entity store. Everything
else → component state.
**Theme:** `index.html`'s `#theme-boot` script paints `data-theme` before first paint from `pt-settings`;
`ThemeProvider` keeps it and colours the browser toolbar from `THEME_COLORS`. `src/app/theme-boot.test.ts` holds
the script to the store.

## Read before you touch

- **Any UI** → [CODE_STYLE](docs/CODE_STYLE.md).
- **Content** (a piece, listing, pattern, path step) → [CONTENT](docs/CONTENT.md).
- **Naming anything** → [UBIQUITOUS_LANGUAGE](docs/UBIQUITOUS_LANGUAGE.md). "Piece" in code, "Song" or "Exercise"
  in the UI. A "Skill" is a quiz-rated chord quality or scale kind, nothing else.
- **Why it is this way** → [docs/adr](docs/adr).
- **Music logic** → CODE_STYLE §8 and spec §4.

## Conventions

- Strict TS: `noUncheckedIndexedAccess`, `noUnusedLocals/Parameters`, `verbatimModuleSyntax` → `import type`.
  No `any`.
- Tests colocated as `*.test.ts(x)`; Vitest + jsdom with **`globals: false`** (import `describe/it/expect/vi`).
  Setup: `src/shared/test/setup.ts` (jest-dom, cleanup, English, and per-test fakes: `stubMatchMedia` for the OS
  scheme, `stubServiceWorker` for a waiting version). Only a test the DOM gets in the way of opts into
  `// @vitest-environment node` (the ESLint API in `architecture.test.ts`). With the settings store:
  `renderWithSettings(ui, { locale, theme })`; the whole app: `renderApp(path, { locale, webMidi })`, which returns
  its fake `audio` and `midi` for the test to drive (moving the fake audio's clock with `setNow` moves the keys that
  sound); both in `src/app/testing/`. A screen's test sits beside its page and runs the app through `renderApp`.
- Prettier: no semicolons, single quotes, trailing commas `all`, printWidth 100.
- i18n: interface strings in `src/shared/i18n/locales/{en,ru}/<namespace>.ts`. Russian is typed against English,
  so a missing key fails `tsc`.

## Agent skills

Issues and specs → `.scratch/<feature-slug>/` ([issue tracker](docs/agents/issue-tracker.md)). Labels:
[triage-labels](docs/agents/triage-labels.md). Domain docs: [domain](docs/agents/domain.md).
