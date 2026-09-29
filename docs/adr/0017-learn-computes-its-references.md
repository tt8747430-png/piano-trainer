# ADR 0017 — Learn's references compute what they show: intervals and available tensions

- **Status:** accepted · **Date:** 2026-09-29 · **Amends:** ADR 0013 (a staff outside the Player may show one
  clef), ADR 0014 (available tensions have one source)

## Context

Sub-project 5 (spec `2026-09-29-learn-lessons-references-tools-design.md`) begins with Learn's references: Clefs'
Intervals Reference, which the owner sent, and the owner's reharmonisation table of weak, strong, jazz and
unacceptable notes over a chord. The roadmap also listed a Chord symbols reference, written before the Chords
reference became a builder that writes every way a chord is written. Available tensions already lived in two rules:
the builder's alterations and `scaleChordAt`'s 9ths.

## Decision

- **Intervals** (`/learn/intervals?root=D`): a card for each interval from the unison to the octave and for the
  compound intervals a chord symbol names (♭9 to 13), each with its names, size and consonance, written on one staff
  and played up, down and together; the upper note spelled by letters from the root, a double flat where the
  interval needs one (the minor 2nd over D♭ is E𝄫). The 12th is left out (no chord names one) and the augmented 9th
  added (chords write #9).
- **Available tensions** (`/learn/tensions?root=C&chord=d7`): nine 7th chords (the table's seven, and +Maj7 and °7,
  which a scale also stacks), the twelve notes over each in the table's four groups, the owner's table the test's
  oracle for Maj7, m7 and 7. Every note plays the chord with it on top, as the melody note the table rates. A note
  that is not a chord tone is named by the degree its semitones make, so the table's "♭11" and "#13" read as the
  3rd and ♭7 they sound as.
- **`tensions.ts` is the one source of available tensions:** `scaleChordAt` asks it for a 9th, and the builder's
  alterations are held to it by a test.
- **A staff outside the Player may show one clef** (`staff="treble"`), drawn at its own height (130 units: room for
  a 13th over B4 above, two ledger lines below); the Player and the references that write both hands keep the grand
  staff.
- **No Chord symbols reference:** it would repeat the Chords reference, as Symbols once did; the lesson teaches
  reading symbols.
- **The interval card is a feature** (`features/play-example`), so a lesson's example is the reference's own card.

## Consequences

- Reharmonise (5.3) reads the same groups from the note's side; lessons (5.2) embed the interval card and link to
  both references.
- A reading lesson writes its notes on one staff.
