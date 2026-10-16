# ADR 0055 — A page's keys dock where the learner says; its actions float

- **Status:** accepted · **Date:** 2026-10-16 · **Amends:** ADR 0036 (every rail setting in sight) and ADR 0009
  (a page's keys pinned under the screen's bar)

## Context

A page's pinned keyboard (an explorer's, a tool's, a lesson's) sat under the screen's bar and took about a third
of a phone's screen; as the bar slid away and back the keys moved with it, and with the bar shown the two left
little of the page. The owner found the pages cluttered, with nothing to hide, nothing to arrange, and the actions
used over and over (Play, New song, Clear) scattered through the page.

## Decision

- **The keys dock where the keyboard settings say** (`dock`): at the screen's foot over the tab bar (the
  default; `Docked`, which sets the page's `--docked` so the page pads its foot clear of it) or at its top as
  before (`Pinned`). The screen's bar then hides and comes back without moving the keys.
- **They fold** (`folded`) from a button at the rail's end into a **Keys** button that brings them back; folded,
  they stay folded on every page until then.
- **Short keys** (`keyLength: 'short'`) are about two thirds as long as a piano's proportion.
- **A compact rail** (`rail: 'compact'`) keeps only the keys' size and how they play (MIDI sound, glissando,
  pedal); how they look (names, chord names, typing) is left to Settings. The full rail stays the default.
- **A screen's actions float** in the thumb's reach (`FloatingActions`), over the keys docked at its foot: its
  main one a large round **`Fab`** (the Chord finder's Play, Songs' New song), the rest folded into a
  **`SpeedDial`** beside it (the Chord finder's Open in Chords and Clear), each named in words once open. A
  lesson's contents are a floating button saying the section being read (`2 / 7`) whose sheet lists the
  sections on a phone; a laptop keeps them in the column beside the lesson.
- **A page's secondary sections fold** from their headings (`FoldSection`, `RowGroup`'s `fold`): Chords' tensions
  and Practise in the Player, a scale's exercises, Progressions' Player rows, walks and Between. What is folded is
  saved by section id (`foldedSections` in `pt-settings`, `useFold`) and stays folded on every visit.
- A staff's notes are marked as they sound (`usePlayhead` over a play's start on the audio clock): a lesson's
  line or run played whole, or a bar tapped.

## Consequences

Every page with a pinned keyboard docks it at the bottom by default; its `className` (a laptop grid's row) applies
only docked at the top. The settings store reads the four new keyboard fields as their defaults from a save
without them (ADR 0038).
