# ADR 0005 — Levels live on the Path, nowhere else

- **Status:** accepted · **Date:** 2026-09-24

## Context

Every Step has a level from 1 to 4, and Songs filters by level. A `level` on each piece as well as the piece's
place on the Path would be two sources of truth, and no test could say which is right when they disagree.

## Decision

`entities/path/content/path.ts` is the only place a level is written: a Step's level is the list it sits in. Pieces
carry no `level`; Songs reads a piece's level through `levelOf(stepId)`. Tests require every Piece on the Path
exactly once and no Listing on it; once the Path is levelled (roadmap sub-project 6), every level holds at least
one Step, and that work adds the test.

## Consequences

- Re-levelling is moving a line in one file.
- Until sub-project 6 levels the Path, everything sits at level 1.
