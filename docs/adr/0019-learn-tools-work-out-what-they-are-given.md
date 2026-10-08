# ADR 0019 — Learn's tools work out what the learner gives them

- **Status:** accepted · **Date:** 2026-09-29 · **Amends:** ADR 0012 (Learn's places: a Tools group joins References)

## Context

The roadmap's sub-project 5 asked for tools beside the references (§3.2, §10.2, §10.3): chord detection (The
Ultimate Piano names what is played), Reharmonise (the owner's table of the chords that hold a melody note, carried
past the key) and Passing chords (The Ultimate Piano's suggestions between two chords). A reference is looked things
up in; a tool works something out from what the learner gives it.

## Decision

- **A Tools group on Learn**, under References: Chord finder, Reharmonise, Passing chords (and Progressions, ADR
  0020). Each is a page whose URL holds what it was given.
- **The Chord finder names by the builder** (`nameChords`): every chord the builder makes, on each pitch class played
  as its root, matched by pitch classes; a 7th chord or larger may leave out its perfect 5th, as hands do (a 6th or an
  added tone may not, or C E G would also be "G6sus4 without its 5th"). Root position first, then every tone there,
  then a table quality, then fewer notes. Taps choose keys (`selected`); a MIDI keyboard's held keys are the chord
  while held. It opens the named chord in the Chords reference, inversion kept.
- **Reharmonise is the owner's table as roles** (`chordsHolding`): triads as root, 3rd, 5th; major 7ths as 3, 7, 9,
  #11, 13; minor 7ths as ♭3, ♭7, 9, 11, 13; dominants as 3, ♭7, ♭9, 9, #9, #11, ♭13, 13. The whole table is its test.
  Each chord is marked in the key when every tone is the key's (a minor key's raised 6th and 7th included).
- **Passing chords are rules from the target's root** (`passingChords`; twelve then, fourteen with the key's own
  walk since the roadmap §10.2's corrections of 2026-10-09), in The Ultimate Piano's six categories; a row that repeats From, To or an earlier row is left out; every row plays voice-led (`voiceLead`: the
  bass the root, the right hand the inversion nearest the last).
- **Roots are spelled by letters, then named plainly** (`spellBelow`, `spellAbove`, `plainRoot`): F♭ is written E,
  B𝄫 A, as a chord chart writes them.
- **One key pop-up** (`KeyDropdown` in the kit) for the tools.

## Consequences

- Lessons (5.4) link to the tools by name; the Progressions tool (ADR 0020) plays its rows through `voiceLead`.
- Sub-project 7's trainers can name what is played with `nameChords`.
