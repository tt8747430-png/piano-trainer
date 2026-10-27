# ADR 0002 — Foundations: a clean rewrite, content as code, two languages, offline

- **Status:** accepted · **Date:** 2026-09-24 · consolidated 2026-10-27

## Context

The app was one 1,882-line `index.html`: vanilla JS in one global scope, with no build, types, tests or docs. The
owner wanted new features, other people using it and a redesign. It has no backend and must work offline, in English
and Russian.

## Decision

- **A clean rewrite**, not a migration. It switched over on 2026-10-02 and the old app is gone
  (`git show 9575033:legacy/index.html` reads it). Tests assert music-theory facts and specified behaviour, written
  before the code. Nothing was recorded from the old code as a golden fixture, and nothing was imported from its saved
  data.
- **The stack:** React, Vite and strict TypeScript; TanStack Router, code-based, with typed and validated search
  params; zustand stores; Tailwind v4 and shadcn on Base UI; i18next. The pinned majors are listed in `CLAUDE.md`, and
  bumping one is its own change.
- **Feature-Sliced Design**, enforced by `eslint-plugin-boundaries` and `src/app/architecture.test.ts`. The music
  kernels in `shared/lib` (`music`, `arrangement`, `notation`, `exercise`, `schedule`) are pure, import no package and
  are fenced tighter than the rest. Writes go through feature commands and reads through selectors.
- **Content is code.** Pieces, patterns, lessons, courses and the progression library are TypeScript under
  `entities/<x>/content/`, one file per piece, listed in its collection's `index.ts`. The chart format the owner
  writes is kept (ADR 0097). Catalog tests parse and arrange every piece in all 12 keys, and read every chord symbol
  and every text in both languages, so a broken chart cannot ship.
- **Two languages, the content's too.** Interface strings live in namespaces, the Russian typed against the English,
  so a missing key fails `tsc`. Content text is `LocalText { en, ru }`. Counts take plural forms (`_one`, `_other`,
  and Russian's `_few`, `_many`). Note and chord names are international in both (B, not H).
- **Offline and installable.** The PWA precaches the app, its fonts and icons, the pieces' recordings and the Verovio
  worker. Nothing at runtime needs the network. A waiting version is offered by the update prompt. Storage that is
  blocked or full falls back to memory (`safeLocalStorage`), and a failed save is said in a notice; nothing throws.
- **Hosting:** Vercel, with a preview for each PR and production from `main`.
- **Not for this app:** accounts, sync, a backend or cloud storage; YouTube or streamed audio; a sampled piano (it
  would cost megabytes of precache); takes from a microphone; ChordPro and PDF export (Print makes the PDF, ADR 0107).
  MusicXML import and export are planned, not built.

## Consequences

- Adding a piece is one file and one line in its collection's index. Content ships in the bundle, so it is there
  offline, and changing it takes a pull request.
- Musical correctness rests on tests written from theory.

## History

- 0001 — A clean rewrite, not a migration (2026-09-24).
- 0002 — Content is code, one file per piece (2026-09-24).
- The rewrite's design spec (2026-09-24) and the features roadmap (2026-09-25), deleted 2026-10-27: their stack,
  layers and scope are here and in `CLAUDE.md`.
