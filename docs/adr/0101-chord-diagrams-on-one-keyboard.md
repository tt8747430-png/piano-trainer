# ADR 0101 — Chord diagrams on one keyboard, each chord in the inversion the learner chose

- **Status:** accepted · **Date:** 2026-10-26 · **Amends:** ADR 0099 (a chord diagram's keys, the Diagrams view) ·
  **Spec:** [Chordify for piano](../superpowers/specs/2026-10-26-chordify-for-piano.md) §2

## Context

ADR 0099 drew a chord as the keys the Player's right hand plays it with, on keys from the C or F under its lowest
to the E or B over its highest, the bass the hand leaves to the left a ring under them. The owner found the Diagrams
view did not work as Chordify's does. Chordify draws every chord on the same keys, F to B, its tones folded into the
octave from F to E, so a song's chords stand in one place and change by a key or two. It shows the chord sounding
and the next, the same size. And it lets the learner page through a chord's other shapes and keeps the one chosen
for that chord in that song.

Our diagrams changed their keys with every chord, and their size with their place: the next a third of the room,
two more from a tablet's width. They showed a voicing the learner had not chosen.

## Decision

- **One keyboard.** Every chord diagram is drawn on F3–B4: the Diagrams view, a chord's sheet, the summaries, a
  section's page and its learning keys.
- **Chordify's place by default.** A chord's tones are folded into F3–E4.
  - A slash chord's bass that is one of its tones is the lowest.
  - A bass that is not one of its tones is its key in that octave, a ring, under the chord close above it.
  - Where a slash chord over its bass would run past B4 (C/E over E4 reaches C5; F♯m/D♯ over D♯4, C♯5), its notes
    fold as any chord's and its bass is a ring where it falls, so it is still told from the chord alone.
  - A chord of five notes or more is folded the same way.
- **An inversion per chord, the learner's.** A chord of three or four notes can be drawn in each of its inversions
  that fit the keys, chosen on its sheet.
  - The choice is kept for that chord in that song (`pt-diagram-inversions`), and every diagram of it shows it.
  - It changes the picture, not what the Player plays; Wait mode takes any inversion.
- **The Diagrams view shows two chords:** the chord sounding and the next, the same size. Its Summary mode shows
  the song's chords at once, the one sounding marked.
- **Words and beats as Chordify's.**
  - The beat strip names a chord only where it changes, a rest sign where the music turns to none.
  - The words light as they are sung, the next line under them.
  - Between lines, a dash runs to the next.
- **In Listen mode, the keys at the foot of a chord view** mark the chord sounding as its diagram draws it.

## Consequences

- **`features/practice`:** `diagramChord` takes the piece's choice and gives a diagram's keys and the inversions
  that fit.
- **`shared/ui`:** `KeyDiagram` takes its range.
- **New slices:** the entity `diagram-inversion`, a saved store in the backup, and the feature
  `choose-diagram-inversion`.
- **`widgets/chord-diagrams` and `widgets/chord-views`:** they change throughout.
- **`pages/player`:** the keys at the foot of a chord view.

The Player's own voicing (ADR 0039's Position and Nearest) is untouched. A walk, a progression and an exercise keep
no choice.
