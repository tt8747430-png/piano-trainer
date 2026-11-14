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

- **The interval chosen is the hero, its character behind an ⓘ** (canvas 170, loop, from "popups with meaningful
  information … show more things with less UI"): its name over the keys showing it, Sounds like with Hear it, the 13
  intervals as a grid of tiles (abbreviation and semitones), From, Play as and Intervals grouped under them. The ⓘ
  beside the name opens a popover: what it sounds like in one line, a song Up, a song Down, what it Inverts to. No
  list of cards, no explanation line on any row.
- **Intervals in the Chords page's shape (canvas 176, loop, 2026-11-14):** one piano, one bar, one shape across
  Practice, as Scales. The keys edge to edge at the top under Back · Intervals · Settings · Piano (glass); the name
  (serif, its ⓘ) and "7 semitones · C up to G"; one card of its two notes on the staff, Sounds like and Hear it;
  Simple · Compound over the tiles, the chosen tile filled in ink (honey is Play's alone). One floating bar as Scales':
  From (the root, a value over its caption, opening the root grid) · Play P5 ⌄ (Play as: Ascending · Descending ·
  Harmonic, as Scales' Up · Up and down · Down) · Play all. From and Play as stay named: From is the piece's caption,
  Play as the menu's heading. The gear opens Interval settings (Play all: In order · Shuffled; Speed); the piano's
  own button its Piano sheet. Never a From · Play as group under the tiles, a keyboard pinned at the foot, or honey
  on a chosen tile.
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

## Ported (loop, 2026-11-14), canvas 176

- `pages/intervals`: glass Back, the piano's tools and the gear (`SettingsGear page="intervals"`); the Tools menu left
  the bar, as on Scales.
- `widgets/interval-explorer`: the keys at the top (`PinnedKeyboard place="top"`); the name 36px serif bold with its
  ⓘ; one music card (one treble staff, no time signature, open whole notes, `intervalMusic`), Sounds like and Hear it
  on the muted fill; Simple · Compound over the tiles, the chosen tile filled in ink; on a laptop the tiles in a
  26.25rem column beside the interval. One floating bar: From (a `FloatingPiece` that opens the pitch picker, through
  `PickerShell`'s new `trigger`), Play P5 with Play as in its ⌄ (Ascending is the default way now), Play all.
  `WayPicture` and the From · Play as fields are gone.
- Interval settings at `/settings/intervals` (`IntervalsSettingsPage`): Play all In order · Shuffled, Speed Slow ·
  Medium · Fast (`settings.intervals`, version 46); `oneInterval` and `everyInterval` play at the speed's pace.
- `FloatingPlaySplit` takes `menuLabel`: its ⌄ is named for its menu on Chords, Scales and Intervals.
