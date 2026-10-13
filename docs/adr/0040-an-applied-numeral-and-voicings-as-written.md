# ADR 0040 — An applied numeral is read in its degree's key, and a lesson can write voicings exactly

- **Status:** accepted · **Date:** 2026-10-13 · **Amends:** ADR 0032 (what a numeral is)

## Context

The owner's sheets (the stein_way 2-5-1 course, Jazz Lab's Chord Matrix, the "Minor 2-5-1: beginner to pro" page)
practise a ii–V–I to every chord of one key (to C, then Dm, Em, F, G, Am, B°), secondary dominants and chains of
ii–Vs. A numeral was a degree of the key with a chord on it, so A7 in C could be written `VI7` but not as what it
does, and a progression could not lead to each chord of the key by its own ii–V. The voicing sheets write each hand's
exact notes, which a row of chord symbols, voiced by `voiceLead`, cannot show.

## Decision

- **A numeral may be applied:** `V/ii`, `ii°/vi`, `V7♭9/iii`. After the slash is a degree alone (so `I6/9` is still
  a chord); it is read in the key on that degree, minor under lower case, major under upper. The degree's tonic is
  where the key's chord on that degree has its root, so a minor key's `/vii` is on its leading tone. The chord before
  the slash grows in that key as any numeral grows (`V/vi` in C is E, E7, E7♭9). It is written back as read.
- **The library holds the walks inside a key** as progressions: a ii–V–I to every chord of the key up the scale and
  round its circle of fifths, its minor version (each other's version in the other mode), secondary dominants, a
  ii–V chain, and the Chord Matrix's song examples.
- **A lesson's `voicings` block** writes each hand's keys (`D3 A♭3 | C4 F4`), with its symbol, numeral and the degree
  each key is; it is played and engraved exactly, never voice-led. Its symbol is text, so a chord the table does not
  hold (`Dm11♭5`, `G7♯9♭13`) can still be named as the sheet names it.

## Consequences

- Anything that reads numerals (the Progressions page, the Player, lessons' links) takes applied chords at once.
- The chord table is unchanged: a voicing's symbol is not a chord the kernel builds.
