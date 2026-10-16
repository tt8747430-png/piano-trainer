# ADR 0059 — One row of floating buttons; keys that hold still; a chord once on the page

- **Status:** accepted · **Date:** 2026-10-16 · **Amends:** ADR 0058, ADR 0054 (the Chord finder), ADR 0009

## Context

The owner found the floating buttons of different sizes, stacked in a column at the edges, and in the way of
reading; Continue as an icon alone said nothing; a row of chords showed each chord twice (a chip and a bar of
the staff), each playing it; a lesson opened on a summary that listed its contents; the keys swung between the
hands' notes and re-zoomed as a page showed other keys; and the Chord finder's Clear forgot the chords it was
asked to remember, with no way to let a tapped chord go at once.

## Decision

- **Floating buttons** are one size (56px, round) and always stand in one row along the foot, at its left, its
  middle or its right. A tap on the page (on no control, no key) folds them away; the next, or another screen,
  brings them back. Continue always says Continue over its step's title.
- **A row of chords is its staff alone** (`RowStaff`): each bar's band names its chord and its numeral and plays
  it as the row voices it, showing its degrees on the keys; every line is drawn at the size the first, full line
  needs. `RowChords` is gone.
- **A lesson opens on its title and place**, not its summary (the summary is search's).
- **The keys hold still:** they bring the keys shown into sight moving no further than that
  (`scrollToReveal`), never re-centre on them, keep their middle as their range changes (`keepCentre`), and a
  page's keys keep the range they opened on.
- **The Chord finder:** the chord's root tapped again lets the whole chord go; Clear lets the keys go and keeps
  the chords played; Forget the chords played clears them, on the staff and the device.
- **Lessons were rewritten** for relevance: one-line summaries, the idea, an example, then practice; background,
  trivia and repeated blocks cut.
