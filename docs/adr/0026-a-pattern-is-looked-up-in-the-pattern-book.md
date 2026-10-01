# ADR 0026 — A pattern is looked up in the pattern book; the learner's own is a named pair of figures

- **Status:** accepted · **Date:** 2026-10-01 · **Builds on:** ADR 0002 (content as code), ADR 0003 and 0022 (the
  view in the URL, remembered views), ADR 0021 (a pattern is heard over its piece) · **Spec:**
  `2026-10-01-patterns-design.md`

## Context

Sub-project 8 asks for a page per pattern, a calmer picker, favourites and hiding, and patterns of the learner's own.
Every reader of a pattern (the Player's choice, its fit, the inversion field, the arrangement, the picker) read the
built-in catalogue (`PATTERNS[id]`) by a built-in id. A pattern of the learner's own is saved state, known only at
run time, and must be read everywhere a built-in one is.

## Decision

- **The pattern book** (`patternBook(own)` in `entities/pattern`) holds the built-in patterns and the learner's own,
  looked up by a **pattern ref**: a built-in id or `my-<n>`. Every reader takes the book: `playablePattern(book, …)`,
  `followsInversion(book, …)`, `accompanimentOptions(book, …)`, and the Player's four resolvers and arrangements.
  `book.get(ref)` may find nothing (an own pattern since deleted, which the Player reads as the music's own pattern);
  `book.require(ref)` is for a ref already read against the book, and throws on a mistake. `BUILT_IN_PATTERNS` is the
  book for content (pieces, lessons, methods), which names built-in patterns only. `usePatternBook()` builds it from
  the store, again only when the learner's own change.
- **An own pattern is a named pair of figures** from the catalogue (`{ id, name, rh, lh }`): a pattern is a way of
  playing any chord, its notes tokens over the chord, so the 56 written figures already say every hand the sources
  teach. Writing a figure note by note waits for the score editor's note input (sub-project 9).
- **Saved as `pt-patterns`** (version 1): favourites (refs, in the order starred), hidden (built-in ids: an own
  pattern is deleted, not hidden), own patterns, and `nextOwn` (a deleted id is never given again, so a remembered
  view or a URL never finds a different pattern under an old id).
- **Every built-in pattern has an idea**: one line, both languages, what it sounds like and what each hand does. The
  picker shows a name and its idea; the source's description is the pattern's page.
- **The router knows the book** (`RouterContext.patterns`), so a pattern's page and editor are `notFound()` for a ref
  the book does not hold. A URL's `pattern=` is read by its shape (`isPatternRef`); the store is read after.

## Consequences

- A new reader of a pattern takes the book; content keeps naming built-in ids.
- The Player's URL may name an own pattern; on another device, or once deleted, it plays the music's own pattern.
- Patterns' lists (the reference, the picker) share one shelving (`referenceShelves`, `pickerShelves`).
