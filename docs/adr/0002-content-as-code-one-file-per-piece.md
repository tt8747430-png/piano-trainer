# ADR 0002 — Content is code, one file per piece

- **Status:** accepted · **Date:** 2026-09-24

## Context

Songs, exercises, progressions and accompaniment patterns were object literals inside the legacy script, keyed by
short codes, with English and Russian mixed into strings such as `'Verse · Куплет'`. The app has no backend and must
work offline.

## Decision

Content is TypeScript under `entities/<x>/content/`: one file per piece, written with `definePiece` and listed in
its collection's `index.ts`. The chart format the owner already writes is kept. Text a learner reads is
`LocalText { en, ru }`. Catalog tests parse and arrange every piece in all 12 keys, and check every chord symbol
and every text in both languages.

## Consequences

- A broken chart cannot ship: CI fails.
- Adding a piece is one file, one index line and one Path entry, reviewed like code.
- Content ships in the bundle and is precached, so it is there offline without a fetch.
- Editing content needs a pull request; acceptable while the owner writes it.
