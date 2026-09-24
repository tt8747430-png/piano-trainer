# ADR 0001 — A clean rewrite, not a migration

- **Status:** accepted · **Date:** 2026-09-24

## Context

The app was one 1,882-line `index.html`: vanilla JS in a single global scope, with no build, types, tests or docs.
The owner wants new features, other people using it, a redesign, and a Path-first structure that changes every
screen at once. Three ways were weighed: build the new app beside the old one, checked against golden fixtures
recorded from the legacy code; modularise the old page and swap its tabs one at a time; or rewrite cleanly, reading
the old code as a reference.

## Decision

Rewrite cleanly (the owner's choice). The legacy file moves to `legacy/index.html`, stays live on GitHub Pages until
the switch-over (Phase 4), and is never imported. No golden fixtures are recorded from it: tests assert music-theory
facts and specified behaviour, written before the code.

## Consequences

- The new structure and the redesign are not bound to the old DOM.
- Musical correctness rests on tests written from theory, and on the spec's parity checklist (§12), walked by hand
  before the switch-over.
- Until Phase 4 there are two apps. `legacy/` and the Pages workflow are deleted at the switch-over.
