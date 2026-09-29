# ADR 0015 — A progression may be written in sections, and a chromatic walk is one more Player source

- **Status:** accepted · **Date:** 2026-09-29 · **Amends:** ADR 0002's progression format, ADR 0014's walk (a
  second walk beside the scale's)

## Context

On 2026-09-29 the owner sent three pages of Vasily Gorshkov's accompaniment course: the theory of 9th chords, its
practice sheet (Exercise 2: m9, Maj9 and 9 walked up by semitones; the song's 7th chords grown to 9ths, D7 → D7♭9
into Gm) and the chart of «Ромашковые поля». The app held only the song's chorus, as a progression that grew every
chord (C7 and A7 where the course writes C and A, Dm7/F for Dm/F), and walked chords only through a scale. The owner
asked for the song as the course writes it, kept on Practice, and to "walk different types or selected types of
chords chromatically, not just in the specific key or scale", root by root.

## Decision

- **A Progression may be written in a chart's Sections**, each line a progression that starts on a new bar and is a
  line of the chart; headings are a chart's. A printed triad is a fixed quality and a printed 7th chord a function,
  so the chord size grows only the 7th chords. «Ромашковые поля» is its verse, its chorus with the 1st ending and its
  last chorus with the 2nd, the repeat written out (the chart format has no repeat signs).
- **The chromatic walk** (`/play/chromatic`) is a chart built in `features/practice` (`chromaticChart`): the chosen
  table qualities root by root, up to the octave, down, or up and back, each root spelled by the kernel's one rule,
  in C. A page hook fills `PlayerLayout`; its Setup chooses the chord types (a `MultiDropdown` grouped by family),
  the root and the direction, then the pattern and figures.
- **A source without a key closes the figures that play the key's triads** (`playsKeyTriads`, `needsKey`), as a
  source without a tune closes the melody's.
- **Practice has Exercises**, the chromatic walk its first; a chord the table names opens it from the Chords
  reference.
- **Decided against:** repeat signs and endings in the chart format (a written-out repeat plays and reads the same);
  a fixed right-hand layout for the walk (the Player voice-leads, 3‑5‑7‑9 or 7‑9‑3‑5 for a 9th, as the course plays
  it); built chords the table does not name in the walk (a Chart chord is a table quality); a 9ths lesson (the owner
  kept this change to the song and the walk).

## Consequences

- More course songs are written as sectioned progressions and grow with the chord size.
- Sub-project 7's exercises join Practice's Exercises group; a generated exercise is one more hook filling
  `PlayerLayout`, and one without a key passes `keyed={false}`.
