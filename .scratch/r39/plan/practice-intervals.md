# R39-7 · Intervals, redesigned

Premium here means the interval itself is the page: its name large, how it looks on the staff and the keys, what it
sounds like and the songs that open with it, as musicca's interval pages and the ear-training apps show it.

## The rulings as they stand

- "Every control says what it belongs to": From (the root) and Play as (Ascending · Descending · Harmonic, the exam
  syllabi's names) are labelled; Intervals: Simple · Compound.
- "No strip hides options": the root opens the root grid, never a strip.
- "Every Practice page has its own Settings page": the gear opens Interval settings (Play all: In order · Shuffled;
  Speed: Slow · Medium · Fast; All piano settings ›).
- Ear training is the Quiz's: Train your ear › Intervals by ear opens the Quiz.
- "No explanation line under a control": the line of what an interval sounds like belongs to the interval, in its
  card, not under a control; the rows keep only name and semitones.

## Today

`src/pages/intervals` → `widgets/interval-explorer` (the rows, `interval-songs.ts`); strings `practice.ts`
`intervals.*`. Three icons in the bar, Root C, Play as with icons, a grand staff, folding Simple and Compound lists of
cards with a play button, a meaning, semitones and an ⓘ for songs, a floating Play all over the rows
.

## Will build (canvas row 4)

Phone: From · Play as; the interval card (name in serif, abbreviation and semitones, "C to G", the staff, its sound,
Up and Down songs); Simple · Compound; one list of rows (abbreviation, name, semitones, the two notes), the chosen row
outlined, a tap plays it; Train your ear ›; Play P5 and Play all in their bar above the keys, which light the two
notes. Laptop: the list on the left, the interval, Play, Play all and Train your ear on the right, the keys at the foot.

## History

- 2026-11-08: drawn (canvas v5); waiting for the owner.

Sources: musicca's intervals pages; the ABRSM aural syllabus's names (harmonic, ascending, descending); the app's own
song list (`interval-songs.ts`).

## Canvas 127 (2026-11-11): one segmented control, one stepper, 44 high

- **A choice of two or three in a settings group stands under its label,** across the group's width, so "Ascending ·
  Descending · Harmonic" and "Even · Dotted · Reverse dotted" read whole; it was squeezed beside the label and cut.
- **The segmented control is the Player's:** 44 high, 11 outside and 9 inside; the stepper's − and + are 44 square.
  Changed once in the kit, so Scales, Intervals, Progression, Exercise, Metronome, Tuner and the libraries' Sort and
  filter all follow.
- **Hear it** buttons 44; End the run 12 from the edge.
