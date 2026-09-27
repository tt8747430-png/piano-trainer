# ADR 0012 — Four places, and choices as pop-up buttons and segments

- **Status:** accepted · **Date:** 2026-09-27 · **Amends:** the master spec's §5 (navigation and routes), ADR 0011's
  "a chip fills umber"

## Context

The app had three places, Path · Songs · Theory. Theory held four tabs on a segmented track (Chords, Scales, Symbols,
Quiz); Symbols' chord list repeated what Chords already chose, and its reading notes sat behind one row. Songs mixed
songs with the method books' studies and one-key progressions. Every explorer laid its choices out as rows of chips
(twelve roots, five families, up to eight qualities, five rhythms), which the owner found cluttered ("too many options
visible and available at once"; "dropdowns better than chips"; "the best UI, not cluttered, like the Apple design
guidelines"). The roadmap (sub-project 2) asked for Apple's Human Interface Guidelines to be read first. They say: a
tab bar holds top-level sections only, few of them, with single-word labels, and never an action; a segmented control
holds two to five closely related choices on a phone and may switch closely related views, never app sections; a
pop-up button chooses one of many mutually exclusive values and shows the current one; a menu groups items under
headers and checks the one in effect; very long sets are lists; popovers are for wide views, sheets for phones; a row
that drills in carries a disclosure chevron.

## Decision

- **Four places:** Path · Songs · Learn · Practice (the docked bar and the laptop's sidebar). Theory and its tab track
  go; every screen below a place has a back button.
- **Learn** holds lessons (the chord-symbol reading notes are the first, as content with examples that play on the
  keys) and references (Chords and Scales, the explorers). Symbols goes: its dictionary is the Chords reference's
  _Written_ line.
- **Practice** holds the Theory quiz and My gaps (each quiz a path, `/practice/quiz/$quiz`) and the studies and
  progressions. **Songs holds songs.** A piece's page lives on its shelf (`/songs/…`, `/practice/studies/…`,
  `/practice/progressions/…`), which one component knows (`PieceLink`).
- **The Choosing Rule:** five or fewer short nouns are a segmented control; more, or longer names, a pop-up button
  (`Dropdown`, over shadcn's Base UI `select`) showing its label and its value, its list grouped and checked in umber;
  on or off a switch; settings changed less often a sheet; a popover only beside the keys. No row of chips is left.
- **The Scales reference has two views**, Scale and Chords: in Chords each degree's key carries its numeral over its
  chord and plays the chord (the keyboard's `keyPlays`, and a mark's `caption`); _Keys play: Notes_ lights the key's
  chords that hold the note a tap, a typed key or a MIDI key plays (`chordHolds`).
- **No redirects** from the old `/theory` addresses (the owner asked for no backwards compatibility): they show the
  not-found screen, which keeps the navigation. No saved store changed shape.

## Consequences

- Later sub-projects build in these places: Learn grows lessons, references and tools (5), Practice exercises and
  trainers (7); the Scales reference's Chords view grows 9ths to 13ths and inversions (4).
- The keyboard settings keep their popover, the one exception to "sheets on a phone": it sits beside the keys and must
  not cover them, so each change shows at once.
- The `theory` strings split into `music` (the words every screen shares) and `learn`; `practice` is new.
- `DESIGN.md` (the Choosing Rule, pop-up buttons, rows, the four places), `docs/CODE_STYLE.md` §1 ("every page earns
  its place") and the glossary record the rules.
