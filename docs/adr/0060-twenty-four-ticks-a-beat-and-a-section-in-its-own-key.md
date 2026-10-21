# ADR 0060 — Twenty-four ticks a beat; a section in its own key

- **Status:** accepted · **Date:** 2026-10-19 · **Amends:** ADR 0027 (written hands)

## Context

The owner asked for Natalie R. Blanton's arrangement of _Wonderful Grace of Jesus_ note for note. It runs in 32nds
(bars 44, 63, 76, 95), which twelve ticks to a beat cannot hold (a 32nd is 1.5), writes triplets throughout, which the
hands notation could write only as `.3333333333`, and moves from C to D♭ for its third verse, where a piece had one key.

## Decision

- **A beat is 24 ticks** (`TICKS_PER_BEAT`): a 32nd is 3, a 16th 6, a triplet 8th 8, a triplet 16th 4. The notation's
  binary grid is the 32nd and its triplet grid the triplet 16th. Nothing saved holds ticks: songs and versions are
  written as beats, takes in milliseconds.
- **A fraction writes beats a decimal cannot**: `1:3` is a third of a beat, in a chart's `@beats`, a melody and the
  written hands alike; the writers write one where a decimal would run past three places.
- **A section may have its own key** (`key: 'Db'`): its chords are voiced and spelled in it, the Performance's bars
  carry it (moved as the piece's key is when the learner picks another), the Score's measures carry it, and the
  staff prints the new signature, cancelling the old, where it changes. Written notes keep their own accidentals.

## Consequences

Every tick count in a test of time doubles. A piece written before reads the same: beats are beats.
