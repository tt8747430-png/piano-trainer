# CLAUDE.md

Answer first, concisely, with no preamble or recap.

**Read before anything, every time.** On session start, resume and after every compaction, read this file and the
`owner-way` skill with its references in full, from the files, before any other work, then say which were read. Trust
no summary, recap or note in their place, and check every claim about the repo or earlier work against the code, `git
log` or the artifact. The SessionStart hook (`.claude/hooks/read-instructions.sh`) reminds you.

Piano Trainer is an offline-first PWA where a learner learns and writes music on one score. React 19, Vite, strict
TypeScript, Feature-Sliced Design (lint-enforced), English and Russian, Supabase behind optional accounts, deployed on
Vercel.

| Read                                                         | For                                                    |
| ------------------------------------------------------------ | ------------------------------------------------------ |
| [`owner-way`](.claude/skills/owner-way/SKILL.md)             | how the owner wants work run; at every session start   |
| [`seven-questions`](.claude/skills/seven-questions/SKILL.md) | every screen, every time: before each publish and port |
| [`scan-first`](.claude/skills/scan-first/SKILL.md)           | every screen, with the seven: edges, states, emphasis  |
| [PRODUCT.md](PRODUCT.md)                                     | who it is for, what it claims, what stays true         |
| [DESIGN.md](DESIGN.md)                                       | the look, before any screen                            |
| [docs/CODE_STYLE.md](docs/CODE_STYLE.md)                     | how code is written, before any code                   |
| [docs/CONTENT.md](docs/CONTENT.md)                           | a piece, pattern, lesson or course                     |
| [docs/adr/](docs/adr/README.md)                              | why an area is the way it is                           |

Design work on the canvas loads these, each when its moment comes ([`redesigning-a-screen`](.claude/skills/redesigning-a-screen/SKILL.md) runs the loop):

| Skill                                                                  | When                                                    |
| ---------------------------------------------------------------------- | ------------------------------------------------------- |
| [`product-designer`](.claude/skills/product-designer/SKILL.md)         | a screen designed or judged as a whole                  |
| [`screen-design`](.claude/skills/screen-design/SKILL.md)               | a whole screen or flow, from contract to final QA       |
| [`state-expander`](.claude/skills/state-expander/SKILL.md)             | every state a screen really has; before a port          |
| [`phone-from-laptop`](.claude/skills/phone-from-laptop/SKILL.md)       | one size exists and the other is missing or drifting    |
| [`ux-writing`](.claude/skills/ux-writing/SKILL.md)                     | the words on a screen                                   |
| [`interface-review`](.claude/skills/interface-review/SKILL.md)         | a review, an audit, "something looks off"               |
| [`spacing-audit`](.claude/skills/spacing-audit/SKILL.md)               | paddings and gaps against the 4/8 scale                 |
| [`design-consistency`](.claude/skills/design-consistency/SKILL.md)     | a screen against its own system; before a port          |
| [`board-cleanup`](.claude/skills/board-cleanup/SKILL.md)               | a canvas generator grown hard to read                   |

Contradicting an ADR: say so, then amend it. A refactor does not read the ADRs (`owner-way`, Loops and refactors). This file is a map; a component's detail belongs in its area's ADR.

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

Done is a claim to check: a task marked done, a summary or an agent's report is verified against the request, the code
and the running screen before it is trusted. Do the whole task, then a second pass that checks and improves it.

1. `npm run typecheck && npm run lint`.
2. Only the tests the change can reach: `npm run test:related -- <files>`, or `npm run test:changed`.
3. Any screen: two full passes in a browser, as [`references/testing.md`](.claude/skills/owner-way/references/testing.md)
   sets out.
4. Before any push of code to `main`: the full `npm run test`, once, then `npm run build`. Docs, skills and settings
   that touch no code may go at once. CI runs only by hand, so these local checks are the gate. A command over 10
   seconds runs in the background.

**In a loop, or when the owner says so** (`owner-way`, Loops and refactors), steps 1, 2 and 4 give way: no tests
written or run, no typecheck or lint; step 3's two visual passes stay in full; the build runs once at the end of a big
feature (an area's refactor) and only what breaks it is fixed; work goes to the session branch, and to `main` only when
the owner asks.

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

This is the app as built. The canvas runs ahead: a ruling drawn but not yet ported is in its area's spec
(`.scratch/<round>/plan/`) and the feedback log, and is built from there.

**Learn · Songs · Practice · Profile**; `app/router.tsx` has every route.

- **Learn** (`/`): Lessons by level and Courses; a lesson is one page of sections. Your lessons and Your courses are
  the learner's own, in the same editors on the device. `pages/learn`, `course`, `lesson`, `lesson-editor`;
  `widgets/curriculum`, `lesson-view`; `features/manage-own-lessons`; `entities/own-lessons`.
- **Songs** (`/songs`): My songs · Explore. One library of folders, favourites and an archive; a song's page, Settings and
  Publish; MusicXML and MIDI in and out. `pages/songs`, `piece`, `public-library`; `widgets/song-library`, `piece-cover`;
  `features/manage-library`, `song-files`, `publish`, `share-folder`; `entities/library`, `piece`. Groups and
  folders shared with them: `pages/groups`, `shared/api/groups`.
- **Practice** (`/practice`): Up next, then Chords, Scales and keys, Intervals, Progressions, Accompaniment, the Chord
  player, Exercises and Quiz, the Tools last (Metronome, Tuner, Chord finder, Circle of fifths), each tool's settings
  in place (the Chord finder's on its own page); the bar's Tools menu is `widgets/tools-sheet`. Exercises,
  Accompaniment (patterns only) and Progressions are one library, `widgets/practice-library`, arranged by the learner;
  its favourites, arrangements and the learner's progressions `entities/practice-library`; a progression's page is
  `pages/progression`.
- **The Player** (`/play/$pieceId`): one screen over any Performance. The transport's Pace: Listen at a speed, Wait
  mode, Interpret; the foot's Hands, in every mode; versions Original · Simplified · Easy; the hands at the keys, 3D,
  in the keys' place. `pages/player`; `widgets/practice-player`, `piano-hands`, `chord-views`, `sheet-music`,
  `player-setup`; `features/practice`.
- **The score editor** (`/edit/$pieceId`): the Player's score in Edit mode, sharing its bar. A docked panel
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
- **A loss that can be undone** happens at once, with Undo in its toast (`say`); one that cannot, or that reaches
  other people, asks first through `ConfirmDialog`. A loss is named as one, truly (R38). **A key or root** is one of
  `shared/ui/pickers`. **A bar** is `ScreenHeader` (`ScoreBar` on the full-screen Player and editor).
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
