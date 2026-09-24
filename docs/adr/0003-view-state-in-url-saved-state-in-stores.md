# ADR 0003 — What you look at is in the URL; what must be remembered is in a store

- **Status:** accepted · **Date:** 2026-09-24

## Context

The legacy app kept everything in one `localStorage` object (`piano-v3`): the chord on screen, the tempo, the quiz
score, the last tab. Stale view state survived reloads, and nothing could be linked to.

## Decision

- **View state** (an explorer's root and quality; the Player's key, tempo, hands, mode and pattern) lives in typed,
  validated URL search params. An invalid value falls back to the default.
- **Remembered state** lives in versioned zustand `persist` stores: `settings` (`pt-settings`) and, from Phase 2,
  `progress` (`pt-progress`). Each has a `version`, a `migrate`, and a `merge` that keeps only valid stored fields.
- Nothing is imported from `piano-v3`: it held nothing worth carrying over.

## Consequences

- Links can be shared, and the back button works.
- A store shape change ships a migration, never a reset.
- Blocked or full storage never breaks the app: `safeLocalStorage()` falls back to memory and loses failed writes
  instead of throwing.
