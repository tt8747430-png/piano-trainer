# ADR 0039 — The first chord's position, then Nearest

- **Status:** accepted · **Date:** 2026-10-13 · **Amends:** the Player's Setup inversion field

## Context

The Setup's inversion field offered Nearest (each chord voice-led from the last, the first wherever lies nearest
middle C) beside Root to 3rd (every chord in that inversion). A learner could not choose where a walk starts and
then let it move smoothly: the two were one choice.

## Decision

- **Two choices.** The first chord's position, Root to 3rd (Root by default, the URL's `inversion` absent); and
  **Nearest**, a switch on by default: each chord after the first moves to the voicing nearest the last. Off
  (`nearest=false`), every chord stays in the first one's inversion.
- **One set of notes.** With a position chosen, the right hand plays a chord as an inversion stacks it (a 7th chord
  whole; a bigger one rootless, at most four notes) whether it is placed or led, so a walk keeps its size.
- `arrange` keeps its own default: an `inversion` alone is every chord's, `nearest` makes it the first's.
  `accompanimentOptions` always gives a position where the pattern follows one.
- A lesson's link in an inversion is every chord's: it writes `nearest=false`.

## Consequences

- Every piece, walk and progression now starts in root position with its 7th chords whole in the right hand, where
  before a 7th chord played rootless.
