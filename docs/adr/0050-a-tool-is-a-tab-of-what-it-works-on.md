# ADR 0050 — A tool is a tab of what it works on

- **Status:** superseded by ADR 0052 · **Date:** 2026-10-14 · **Amends:** ADR 0044 (Practice's three groups), ADR 0045
  (Transpose's place)

## Context

The Chord finder, Passing chords, Reharmonise and Transpose were pages of their own, reached from rows on Chords
and Progressions that left the page and lost what it showed. The owner asked for less jumping back and forth.

## Decision

- **Chords** has two tabs, Build and Find (`/practice/chords`, `/practice/chords/find`).
- **Progressions** has four, Play, Passing chords, Reharmonise and Transpose (`/practice/progressions`, `…/passing`,
  `…/reharmonise`, `…/transpose`); a tab opened from another carries its key.
- The rows that led from one of them to another are gone; Practice lists the workspaces, not their tools.

## Consequences

- Search opens a tool on its workspace's tab.
- A tool's URL is under its workspace's, so the sidebar and Back keep the learner in one place.
