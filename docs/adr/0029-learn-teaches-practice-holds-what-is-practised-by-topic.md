# ADR 0029 — Learn teaches, Practice holds what is practised by topic, and a key is a view of its scale

- **Status:** accepted · **Date:** 2026-10-05 · **Amends:** ADR 0012 (four places, the Choosing Rule), ADR 0014 (a
  key is a page), ADR 0017 (Learn computes its references), ADR 0019 (Learn's tools)

## Context

The owner found the app hard to read at a glance: Learn and Practice were two columns of the same grouped rows; on a
phone the references and tools sat under twenty-eight lessons; "References" and "Tools" named a distinction a learner
does not make; Scales and Keys showed the same notes on two pages; a laptop's screen was capped at 72rem beside a
fixed sidebar; the keyboard was stretched in the Player (it took the height left) and its settings repeated
themselves; the Player's Setup, the New song sheet and the score editor were lists of words to read ("more visuals,
less text, more icons"). The owner sent the reference apps again (the chord trainer's builder, Flat's editor,
Ultimate Piano's practice by subject) and asked for the best decision on merging Learn and Practice.

## Decision

- **Learn holds lessons only**, module by module, each numbered in the order taught, with its category and its
  level's mark. Its filters go: three modules need none.
- **Practice holds everything practised, a topic at a time** (`?topic=`, remembered): Chords · Scales and keys · Ear
  and reading · Progressions · Accompaniment · Technique. A topic has up to three ways in, under plain verbs:
  **Explore** (the pages that show a thing on the keys or work it out: no "reference" or "tool"), **Quiz** (its
  trainers) and what it **plays** in the Player (its exercise groups, then the studies or progressions). My gaps,
  which checks across topics, is in Practice's bar. `pages/practice/model/topics.ts` is the one table, held by a test
  to every explorer, trainer, exercise group and practice collection.
- **The explorers live under Practice** (`/practice/chords`, `/practice/scales`, `/practice/intervals`,
  `/practice/tensions`, `/practice/patterns…`, `/practice/chord-finder`, `/practice/reharmonise`,
  `/practice/passing-chords`, `/practice/progressions`), in their own chunk. No redirect from `/learn/…`; `pt-views`
  (version 2) moves each remembered view to its screen's path of today.
- **Keys is a view of Scales.** The Scales page ("Scales and keys") has Scale · Chords · Key, each only where the
  scale has it: Key (a major or minor scale) is the circle of fifths, the signature on a staff, notes, relative and
  modes, the borrowed chords and the songs in the key. The key's own chords are the Chords view's. `/learn/keys` and
  its view are gone; a remembered Keys view is forgotten.
- **The shell takes the width it is given.** The sidebar collapses to its icons (saved: `pt-settings` version 8,
  `sidebar`), Settings is at its foot, the screen's gutter grows with the width (`--gutter`) and no screen is capped;
  a list is a grid of row cards, as many columns as fit (`grid-cards`), never two fixed columns of lists.
- **One focus ring:** the base layer's 3px outline, 2px off every control; inside a scroller that would cut it, inset
  (`focus-visible:-outline-offset-3`). No component draws its own.
- **The keyboard keeps a piano's proportion on every screen** (a key 4.4 times as long as wide, never over 32dvh; a
  white key at least 34px): the Player's no longer fills the height. Glissando is a toggle in the rail; the
  settings popover holds what is left.
- **The Choosing Rule gains pictures.** Twelve notes are a `NotePicker` (all in sight, a tap); a key is a `KeyPicker`
  (the notes, then Major · Minor); an inversion is drawn as its stack of noteheads; on or off, where several sit
  together on a sheet, is a `ToggleTile` (an icon over its name, the learned paint's wash when on); sections of one
  screen are tabs. A pop-up button stays for long lists and for a control row beside other controls.
- **The Setup shows a pattern as what it is:** its name over its two hands, each hand the figure it plays by name,
  with a way back to the pattern's own beside a changed one.
- **A song's page shows the chords it plays**, by name, to tap and hear, in place of chord qualities with rating
  marks; the Check of them stays beside them.
- **The score editor's dock** over the keys holds what they write (the layer, with its picture) and that layer's
  tools as a palette of icons and notation glyphs, each named in a tooltip.

## Consequences

- A link to a key (a lesson's, a song's scale) opens Scales on its Key view.
- Songs loses its level filter; a song's row shows its key, its level's mark and the learned badge.
- Trainers show how far a run has come; their answers and Check keep a hand's width on a laptop.
- Tests that walked Learn → a reference walk Practice → Explore; the Setup's switches are pressed buttons.
