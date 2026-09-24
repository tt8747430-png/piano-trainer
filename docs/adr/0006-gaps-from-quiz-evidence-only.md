# ADR 0006 — Theory gaps come from quiz answers only

- **Status:** accepted · **Date:** 2026-09-24

## Context

The owner wants the app to find and fill gaps in a learner's theory, without lesson text. Two signals exist: quiz
answers, and wrong notes in the Player's Your turn.

## Decision

A **Skill** (one chord quality or one scale kind) is rated from its **Evidence**, the last 5 quiz answers: Known =
at least 4 of 5 right, including the latest; Gap = tried but not Known; Unknown = never tried. Player mistakes are
not evidence: a wrong note there is as likely rhythm or hand position as theory. Gaps surface on the Piece screen
(Check these chords), on chord and scale Steps (Check yourself, which marks the Step learned once its family is
Known), in the quiz's My gaps mode, and as one line on the Continue card.

## Consequences

- The rating is pure (`entities/progress/model/mastery.ts`) and exhaustively tested.
- A learner who only plays and never quizzes sees Unknowns, not Gaps: the Checks are the way in.
- Five answers per Skill keeps storage small (40 Skills × 5).
