# ADR 0063 — Notes carry marks; the editor's palette writes them

- **Status:** accepted · **Date:** 2026-10-20 · **Amends:** ADR 0027 (written hands), ADR 0061 (the palette)

## Context

The owner wants the editor to write what a notation app writes (articulations, ornaments, octave lines, slurs,
dynamics, hairpins, grace notes, 32nds, double dots, ties), and, on a phone on its side, a score that fills the screen
under a floating palette. The written hands held only a pitch, a time and a finger.

## Decision

- **A written token may end in marks**, `[acc,stacc]`, words a reader can read (the spec lists them). They belong to
  every note of the token; a note's pitch stays the pitch it sounds, so `8va` changes only where it is written.
- **Marks travel with the note** from the text through the Performance and the Score to VexFlow, and the schedule hears
  those that change the sound: lengths, loudness, rolls, grace notes and ornaments. A fermata lengthens its note, not
  the beat.
- **A tie is a longer note**, not a mark: Tie joins two notes of one key, and the staff ties the value where it needs to.
- **The palette gains tabs** for each kind of mark; on a phone on its side it floats as a card over a score that takes
  the whole screen.

## Consequences

Old songs read as before: a token without marks is as it was. A saved song's text simply holds more; no store version
changes.
