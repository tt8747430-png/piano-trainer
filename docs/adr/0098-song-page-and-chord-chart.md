# ADR 0098 — A song's page introduces it; its chord chart is a way the Player shows it

- **Status:** accepted · **Date:** 2026-10-24 · **Amends:** the song's page (`PieceView`), the Player's View
  (Sheet music off)

## Context

The owner: the song's page is cluttered with its chords and its chart; the chart belongs where the music is played:
with the sheet music off, the chords alone, showing what is played.

## Decision

- **The song's page** says what the song is: its title and bar (Edit, Learned, More), its facts and who wrote it, its
  form (each section opening the Player there), its note; Practise floats. The chord chart and the chords' grid leave
  it; Check these chords stays in More.
- **The Player's chord chart.** With Sheet music off in the View, the Player shows the song's chord chart by section,
  the bar that plays marked as it plays, a bar tapped going there, its chord shown on the keys.

## Consequences

`pages/piece`, `widgets/chord-chart` (followed by the Player), `widgets/piece-chords` (in the Player's chart where a
chord is tapped), the Player's sheet area.
