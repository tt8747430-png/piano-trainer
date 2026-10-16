# ADR 0058 — Floating buttons where the learner says; a staff's options on its card

- **Status:** accepted · **Date:** 2026-10-16 · **Amends:** ADR 0055 (floating actions), ADR 0057

## Context

The owner found the floating buttons wordy and always at the right, a lesson's column left half a laptop empty,
its bar and its end both offered the next lesson, its fingers were one switch for every scale, a row of chord
chips repeated the staff under it, the questions were hard to follow, Learn's chapters jumped open and a
journey's tab sent the page to its top, the courses' facts were numbers beside pictures, and the Chord finder's
staff could be turned off into an empty page. The Ultimate Piano's "Just Play" was the reference for the Chord
finder: the keys, and one card in the middle naming the chord over a grand staff.

## Decision

- **Floating buttons** stand in one host (`FloatingHost`, in `AppShell`) at the screen's foot: down its left or
  right edge in a column, or in a row in its middle (the default), as `pt-settings`' `floating.place` says; each
  is its icon alone unless `floating.labels` asks for its name (a pill's words, a dial action's chip, Continue's
  title). Settings' Floating buttons set both. `pt-settings` is version 2: no `lesson`, no Chord finder `staff`.
- **A lesson** is one column in the middle (`max-w-3xl`); Learned is a round check in its bar; its floating bar
  steps through its sections only, its contents sheet ending on what it is part of; the lessons either side are
  its end alone.
- **A staff's own options are on its card** (`SheetOption`): a scale's fingers and notes' names, a line's notes'
  names, a row of chords' names and notes' names. A short row of chords is its staff alone, each bar naming and
  playing its chord (`barShown` shows its degrees); a long one stays buttons.
- **A question** wears a question's sign, is ringed while open, fills a dot for each note chosen and says its
  verdict in colour.
- **Folding slides** (`FoldBody`: a grid row from 0 to its height, `inert` while folded) in every fold; a
  journey's tab changes the page in place (`IN_PLACE`).
- **Counts are words** with plural forms (`_one`/`_other`, Russian's `_few`/`_many`, allowed by `DeepStrings`
  and held by the locales test): a course's lessons, songs and weeks.
- **A course's page** is one card: its icon and summary, its facts, and along its foot its progress and its one
  way in.
- **The Chord finder** is one stage in the middle: the chord's name over its grand staff, always shown, empty and
  faint before a chord is played; the key it spells in is on its settings button.

## Consequences

`setLessonFingers`, `selectLesson`, the Chord finder's staff toggle and the floating column made outside React are
gone.
