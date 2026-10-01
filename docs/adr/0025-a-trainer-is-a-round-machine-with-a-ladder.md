# ADR 0025 — A trainer is a round machine with a ladder, its progress kept per level

- **Status:** accepted · **Date:** 2026-10-01 · **Builds on:** ADR 0003 (view state in the URL, saved state in
  stores), ADR 0006 (gaps from quiz evidence only), ADR 0022 (a screen opened plainly comes back as left) ·
  **Spec:** `2026-10-01-practice-exercises-and-trainers-design.md` §5–§7

## Context

Practice had the Theory quiz: Build chord, Name chord and Build scale over chord families and scales saved in
`pt-settings`, and My gaps, open-ended, with one count of right answers over every quiz in `pt-progress`. Sub-project 7
asks for trainers in The Ultimate Piano's shape (a ladder of levels with fixed rounds so runs compare, or a custom
choice; a session summary; progress per trainer) and for the trainers the references showed: intervals, chords and
scales by ear, reading notes, key signatures, a key's degrees, a chord's role.

## Decision

- **One round machine** (`features/trainer/round-machine.ts`, the quiz machine grown): a round is answered by keys
  chosen and checked (Build chord, in an inversion when a level asks one, and Build scale), by keys pressed and
  judged at once (Reading notes, in its octave; a key's degrees, in order, any octave), or by a choice (Name chord,
  the ear trainers, key signatures, a chord's role). The Check runs on it too, from its fixed plan.
- **What a run asks is one value** (`Asks`): skills on any root, a ladder's chords, intervals and how they sound,
  qualities, scales, notes on their staves, keys. Each trainer (`trainers.ts`) turns its level, or Custom's choices,
  into one; `drawRound` draws each round from it, never the same twice in a row where it can help it.
- **A run** (`run.ts`) counts rounds (10, 20 or until stopped), times each answer from the round shown, keeps the
  streak, and sums up: accuracy, average time, best streak, the rounds missed with their answers.
- **What a trainer asks is view state:** its level, rounds and Custom's choices live in the URL, and the screen is
  remembered per trainer (ADR 0022). The Theory quiz's saved choice leaves `pt-settings` (version 6), which saves
  only how every trainer goes: auto-next.
- **What a learner did is saved state:** each run adds to its trainer level's record in `pt-progress` (version 2:
  runs, last and best accuracy, best streak). The quiz's single count belonged to no trainer and is not read from a
  version-1 save; its answers, learned steps and practised pieces are.
- **Evidence stays the quiz's:** only rounds on a chord quality or a scale kind are evidence on a Skill (ADR 0006).

## Consequences

- A new trainer is a ladder, an entry in `trainers.ts` (and its `Asks` kind and round mode if it asks something new),
  its words, and its row in `TrainerList`; its screen, URL, record and summary come with the route.
- The Check, a lesson's quiz and the trainers share one board and one machine; the board's rounds are tested once.
- Reading chords on a staff and the degrees of a song are planned (spec §7); Progressions and Arpeggios are the
  exercises' Wait mode, not trainers.
