# ADR 0020 — Numerals are read in any key, and a progression is one more Player source

- **Status:** accepted · **Date:** 2026-09-29 · **Amends:** ADR 0014 (a Player source beside the walk), ADR 0015 (the
  chromatic walk's shape, reused)

## Context

The roadmap's Progressions tool (§3.8, §10.1) is The Ultimate Piano's progression generator and its library by
style, "each generated in any key, played in the Player with a song's patterns and Chord size". The app's
progressions were Pieces (with Path steps and learned marks), written in their own `degree:function:beats` format.

## Decision

- **Numerals are the kernel's** (`numerals.ts`): upper case a major triad, lower case minor, `°` diminished, `+`
  augmented, an accidental before, a written 7th after (`V7`, `IMaj7`, `viiø7`, `vii°7`); a major key counts from the
  major scale, a minor key from natural minor. A written 7th fixes the chord; otherwise the key's own chord grows as
  the scale's does (`scaleChordAt`), and any other grows as its triad says: a major chord to a dominant, a minor one
  to a minor 7th. Typed chords are written back as numerals in the key (`numeralOf`).
- **The library is content** (`entities/progression-library`): the table's progressions by style in numerals, names
  in both languages. It is not Pieces: a generator has no Path step or learned mark. The blues write their 7ths, and
  the gospel walk-up is ♭VI ♭VII I.
- **A progression is a Player source** (`/play/progression?p=ii-V-I&key=Bb`): a chord a bar in the key
  (`progressionChart`), arranged with a song's patterns; its Setup composes Key, the figures, Chord size and how it
  plays; closing goes back to the tool on the same numerals.
- **The tool** (`/learn/progressions`) keeps its numerals, key and size in the URL; a typed line that reads sets
  them at once, one that does not says so.

## Consequences

- A lesson can name a progression by its numerals and link the tool (5.4).
- Sub-project 7's "progressions in every key" grow from the same source.
