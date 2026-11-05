# CLAUDE.md

Answer first, concisely, with no preamble or recap.

Piano Trainer is an offline-first PWA where a learner learns and writes music on one score. React 19, Vite, strict
TypeScript, Feature-Sliced Design (lint-enforced), English and Russian, Supabase behind optional accounts, deployed on
Vercel.

| Read                                                        | For                                                  |
| ----------------------------------------------------------- | ---------------------------------------------------- |
| [`owner-way`](.claude/skills/owner-way/SKILL.md)            | how the owner wants work run; at every session start |
| [PRODUCT.md](PRODUCT.md)                                    | who it is for, what it claims, what stays true       |
| [DESIGN.md](DESIGN.md)                                      | the look, before any screen                          |
| [docs/CODE_STYLE.md](docs/CODE_STYLE.md)                    | how code is written, before any code                 |
| [docs/CONTENT.md](docs/CONTENT.md)                          | a piece, pattern, lesson or course                   |
| [docs/adr/](docs/adr/README.md)                             | why an area is the way it is                         |

Contradicting an ADR: say so, then amend it. This file is a map; a component's detail belongs in its area's ADR.

## Change rules

- **Final code only.** No legacy, shims, fallbacks, casts, `eslint-disable`, placeholders or "tidy later" notes. Latest
  stable dependencies. Pinned majors, each bumped as its own change: TypeScript 6, Vitest 4, jsdom 29, jest-dom 6,
  eslint-plugin-boundaries 6, `@vite-pwa/assets-generator` 1.
- **Complete, not partial.** Every string in `en` and `ru`; loading, empty, error and offline states; the same features
  on a phone and a laptop.
- **One implementation of a thing,** used everywhere. A changed pattern changes everywhere it occurs.
- **New code copies the nearest slice's shape.** Writes are feature commands, reads are selectors, pure logic is in
  `shared/lib` or `entities/*/model` with a colocated test.
- **Saved stores read one version.** Every store is a `createSavedStore`. The app has no users until release, so a shape
  change bumps the version with no migration.
- **Staged work is deliberate.** Never `checkout`, `restore`, `stash` or `reset` the owner's work unprompted. Stage by
  path, never `git add .`.
- **Secrets and config never enter git.** Config is Vercel's environment variables, `.env.local` on a machine, names in
  `.env.example`. Security, keys, accounts and hosting are the owner's decisions.
- **Never read a learner's saved data.** Diagnose from logs, aggregates and code.

## Verify before claiming done

1. `npm run typecheck && npm run lint`.
2. Only the tests the change can reach: `npm run test:related -- <files>`, or `npm run test:changed`.
3. Any screen: two full passes in a browser, as [`references/testing.md`](.claude/skills/owner-way/references/testing.md)
   sets out.
4. Before a push that touches shared code (`shared/lib`, an entity's model, `app/`, test setup, config): the full
   `npm run test`, once. After startup, routing, the PWA or config: `npm run build` too. CI runs only by hand, so these
   local checks are the gate. A command over 10 seconds runs in the background.

## Commands

Node 24 (`nvm use`). `dev` · `build` · `preview` · `typecheck` · `lint` · `test` · `test:unit` · `test:related` ·
`test:changed` · `test:watch` · `test:cov` (90% lines on `src/shared/lib/**` and `src/entities/*/model/**`) · `e2e`
(Playwright on the production build; `PLAYWRIGHT_CHROMIUM` names an installed Chromium) · `icons`.

One file: `npx vitest run src/shared/lib/cn.test.ts`. One test: add `-t "saves a new language"`, always with its file.
**Never `npm run format`:** `npx prettier --write <files you touched>`, and never on this file.

## Architecture

`app → pages → widgets → features → entities → shared`. Import from your own layer or below; reach another slice only
through its `index.ts`; a page imports no other page. `@` is `src`. `eslint-plugin-boundaries` and
`src/app/architecture.test.ts` enforce it.

**The kernel** in `shared/lib` is fenced tighter and imports no package: `music` imports itself, `notation` and
`arrangement` import `music`, `exercise` imports `music` and `arrangement`. A chart becomes a Performance (`arrangement`),
a Performance becomes a Score (`notation`) or sounds (`schedule`).

- **app/**: `router.tsx` (code-based TanStack Router), `routes/` (lazy `*-screens.ts`, validators in `*-search.ts`,
  Back's parents in `parents.ts`), `composition-root.ts` (services, stores, content, backend, auth, sync, built once in
  `main.tsx`), the layouts, `testing/`. The router imports no page or widget code.
- **pages/<x>/**: one per route, composing widgets and the kit. A page with many acts has one hook in `model/`.
- **widgets/<x>/**: composite UI tied to screens, owning the view type its route's URL holds.
- **features/<x>/**: commands, one use case per file, and machines (`practice`, `trainer`, `score-editor`): pure reducers
  with a hook driving them.
- **entities/<x>/**: `model/` (types, store, selectors, context), `content/` (authored data), `ui/`, `index.ts`.
- **shared/**: `lib`, `api` (the audio, MIDI, content, network, auth, sync and Supabase ports, each with fakes), `ui` (the
  kit; shadcn in `ui/primitives`; `ui/score`, Verovio, imported by that path only), `i18n`, `config`, `test`.

## The places

**Learn · Songs · Practice · Profile**; `app/router.tsx` has every route.

- **Learn** (`/`): Lessons by level and Courses; a lesson is one page of sections. Your lessons and Your courses are
  the learner's own, in the same editors on the device. `pages/learn`, `course`, `lesson`, `lesson-editor`;
  `widgets/curriculum`, `lesson-view`; `features/manage-own-lessons`; `entities/own-lessons`.
- **Songs** (`/songs`): My songs · Explore. One library of folders, favourites and an archive; a song's page, Settings and
  Publish; MusicXML and MIDI in and out. `pages/songs`, `piece`, `public-library`; `widgets/song-library`;
  `features/manage-library`, `song-files`, `publish`, `share-folder`; `entities/library`, `piece`. Groups and
  folders shared with them: `pages/groups`, `shared/api/groups`.
- **Practice** (`/practice`): Tools (Metronome, Chord finder, Circle of fifths, Tuner), then Chords, Scales and keys,
  Intervals, Progressions, Accompaniment, the Chord player, Exercises and Quiz. Exercises, Accompaniment and
  Progressions are one library, `widgets/practice-library`, its favourites and the learner's progressions
  `entities/practice-library`; a progression's page is `pages/progression`.
- **The Player** (`/play/$pieceId`): one screen over any Performance. Modes Listen · Sight-read · Practice · Interpret,
  versions Original · Simple · Easy. `pages/player`; `widgets/practice-player`, `chord-views`, `sheet-music`,
  `player-setup`; `features/practice`.
- **The score editor** (`/edit/$pieceId`): the Player's score in Edit mode, sharing its bar and transport. A docked panel
  from 48rem, a bottom sheet on a phone. `pages/score-editor`; `widgets/score-sheet`, `mode-switch`;
  `features/score-editor`, `edit-piece`, `record-take`.
- **The Profile** (`/profile`): the learner, badges, achievements, streak, notifications.
- **Elsewhere:** Search is a palette (`widgets/search-palette`); Settings (`widgets/settings-screen`) holds only what is
  app-wide; each screen's own settings are its gear's; the account pages, Legal, the Admin area (`/admin`).

## Rules that span areas

- **State:** what you look at is in the URL; what must be remembered is a saved store; a screen's last view is `pt-views`;
  everything else is component state.
- **Back** is Up within the app: where the learner came from, else the parent in `parents.ts`. Screens call `useUp()`; a
  view, tab or step written into the URL replaces the entry (`useSetSearch`).
- **Settings:** each preference has one home (`entities/settings/model/registry.ts`, held by `settings-homes.test.ts`);
  elsewhere a link row to it, never a second control.
- **A loss asks first** through `ConfirmDialog`. **A key or root** is one of `shared/ui/pickers`. **A bar** is `ScreenHeader`.
- **Keys:** a shortcut is one `useShortcuts` call beside what it drives. A letter alone is the piano's.
- **Theme:** `index.html`'s `#theme-boot` paints before first paint and `theme-boot.test.ts` holds it to the store.
- **Installed app:** `#standalone-boot` locks zoom when installed; `theme.css` keeps text unselectable outside fields.
- **Backend:** `supabase/` holds migrations (no `drop` statements), Edge Functions and access tests. A schema change is a
  new migration, applied, the access tests run, then `shared/api/supabase/database.types.ts` brought level. Built-in
  content is published by `scripts/export-content.mjs` then `scripts/seed-content.mjs`. Accounts are optional, and an
  action waits on the network only when the server must answer for it to be right (ADR 0116).

## Words in code

"Piece" in code, "Song" or "Study" in the interface. A "Progression" is the library's, never a piece. A "Skill" is a
quiz-rated chord quality or scale kind. A level's lessons are a `Journey` in code. The musician's term always wins in
the interface; `src/shared/i18n/avoid-words.test.ts` fails the phrases the owner rejected.
