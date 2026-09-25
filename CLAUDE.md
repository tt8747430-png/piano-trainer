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

- **app/**: `router.tsx` (code-based TanStack Router; screens are lazy through `routes/*-screens.ts`),
  `App.tsx` (the provider stack: `<App settingsStore progressStore services router />`), `composition-root.ts` →
  `createServices()` (audio + MIDI, built once in `main.tsx`), `providers/` (`LocaleSync`, `ThemeProvider`,
  `AudioUnlock`), the layouts (`RootLayout`; `ShellLayout` → `AppShell` for screens with the main navigation;
  `FullScreenLayout` for the Player; `TheoryLayout`), `update-prompt/`, `RouteError`, `testing/`.
- **pages/<x>/ui/**: one per route; composes widgets + `shared/ui`.
- **widgets/<x>/**: composite UI tied to screens (`app-nav`, `theory-nav`).
- **features/<x>/**: commands, one use case per file (`set-preference/set-theme.ts`, `mark-learned`,
  `record-answer`, `record-practised`, `reset-progress`), and the machines: `practice` (the pure
  `practice-machine` and `usePractice`, which drives it with audio, MIDI and the clock) and `quiz`.
- **entities/<x>/**: `model/types.ts` (types, guards, validating constructors; no IO, no React),
  `model/store.ts` (zustand `persist` over `safeLocalStorage()`, versioned, sanitising `merge`),
  `model/selectors.ts`, `model/context.ts` (`createStoreContext`), `content/` (authored data), `index.ts`. Content:
  `piece` (51 pieces, 7 listings, chart and progression parsers), `pattern` (39 patterns), `path`. Saved state:
  `settings` (`pt-settings`, version 2), `progress` (`pt-progress`; the evidence rules in `model/mastery.ts`, what
  an answer or a mark changes in `model/changes.ts`).
- **shared/**: `lib` (`cn`, `safeLocalStorage`, `savedObject`, `isOneOf`, `createStoreContext`, `useMediaQuery`; and
  with barrels of their own: `music` the theory kernel, `arrangement` (`arrange`, a chart → a Performance),
  `schedule` (a Performance → sounds in seconds, and Listen's loop), `services` (`ServicesProvider`,
  `useServices`)), `config` (`THEME_COLORS`), `api` (the `audio` and `midi` ports, their browser adapters and
  fakes), `ui` (design system; shadcn in `ui/primitives`), `i18n` (with `LocalText`), `test`.

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
  `renderWithSettings(ui, { locale, theme })`; the whole app: `renderApp(path, { locale })`; both in
  `src/app/testing/`.
- Prettier: no semicolons, single quotes, trailing commas `all`, printWidth 100.
- i18n: interface strings in `src/shared/i18n/locales/{en,ru}/<namespace>.ts`. Russian is typed against English,
  so a missing key fails `tsc`.

## Agent skills

Issues and specs → `.scratch/<feature-slug>/` ([issue tracker](docs/agents/issue-tracker.md)). Labels:
[triage-labels](docs/agents/triage-labels.md). Domain docs: [domain](docs/agents/domain.md).
