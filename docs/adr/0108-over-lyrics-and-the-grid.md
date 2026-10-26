# ADR 0108 — Chords over lyrics' pinned diagrams, text size, hover and ×N; the Grid's words

- **Status:** accepted · **Date:** 2026-10-26 · **Amends:** ADR 0099 (Chords over lyrics, the Grid), ADR 0102
  (the View by view: Chords over lyrics and the Grid gain their own sections) · **Spec:**
  [Chordify for piano](../superpowers/specs/2026-10-26-chordify-for-piano.md) §1.3, §8

## Context

Chords over lyrics showed the song's chord summary once at the top of its column, where it scrolled away with the
first lines; its words had one size; a line of chords repeated stood once for each time it was written, and once
for a repeat however many times it was played. The Grid had no words. Neither view had a section of its own in the
View.

Chordify's Over lyrics pins the song's chord diagrams in a row under its strip, resizes its text ("Adjust view
settings": the font size, − and +), shows a chord's diagram when a computer's pointer rests on it, and writes a
chord line played several times once with "x3". Its Grid has a Lyrics button that shows the words under the beats.

## Decision

- **Chords over lyrics' own section in the View**, under its name:
  - **Diagrams pinned**, a switch (on by default): the chord summary in a smaller row under the beat strip, held
    at the top with it as the song scrolls, the chord sounding outlined in ink and scrolled into the row's sight,
    the others' names muted. Off, the view shows no diagrams; Song information and the song's page keep theirs.
  - **Text size**, − and +: the words and their chips at 80, 90, 100, 115, 130 or 150% of their own size, every
    length of a line in `em`, so a chip grows with its words. A line still wraps a segment (a chord over its words)
    whole; a segment wider than the line wraps its words inside it, never cut. The strip and the pinned diagrams
    keep their size. On a narrow menu the − size + wrap under the name.
- **Hover.** Where the device hovers with a fine pointer (`(hover: hover) and (pointer: fine)`, the theme's own
  hover), a chip rested on shows its chord's diagram, in the inversion the piece chose, in a small popover over it
  (the kit's tooltip). A touch is unchanged: it opens the chord's sheet.
- **×N.** A line of chips alone (no words) played again straight after itself, in its repeat (`|: … :|`) or
  written again in the same section with the same chords on the same beats, is shown once with `×N` at its end; a
  screen reader hears "Played N times". The line counts as playing, and its chip sounding is filled, in any of its
  copies. A line with words is never folded: each verse is shown.
- **The Grid's own section:** its **Lyrics**, the View's one Lyrics switch (`scoreView.lyrics`, the sheet's and
  Diagrams' too). With it on, each bar's words stand under its beats, small, verse by verse, a beat's words from
  its cell to the next sung beat's, wrapping there; a bar's name says its words (verse 1).
- **Greyed with its reason.** Where the music has no words, the Grid's and Diagrams' Lyrics switch is greyed, its
  ⓘ saying "The music has no words".
- **`pt-settings` v12** holds `scoreView.pinned` and `scoreView.textSize`; a save of another version starts afresh
  (ADR 0038).

## Consequences

- **`entities/settings`:** `TEXT_SIZES`, `TextSize`, the two fields, version 12; `index.html`'s theme boot reads
  version 12.
- **`widgets/chord-views`:** `foldRepeats` and `ShownLine` (`model/repeated-lines.ts`), `gridWords`;
  `soundingChip` marks a folded line's copies; `ChordsOverLyrics`, `LyricRow` and `ChordChip` take the text size,
  the pinned row and the hover diagram; `GridView` its words.
- **`widgets/chord-chart`:** `ChordChart` and `BarButton` take `words` (`BarWords`, `BeatWords`).
- **`widgets/chord-diagrams`:** `ChordSummary` follows the music with `sounding`, drawn smaller.
- **`widgets/score-view-menu`:** `LyricsFields`, `GridFields`; `ViewSwitch` greyed with a `reason`; `ViewSection`
  takes whether the music has words.
