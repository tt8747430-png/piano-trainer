# ADR 0102 — The Player's tools row; the View menu by view

- **Status:** accepted · **Date:** 2026-10-26 · **Amends:** ADR 0099 (the View's tiles and parts), ADR 0094 and
  0085 (the Player's bar: its View leaves it), ADR 0064 (the layout's names) · **Spec:**
  [Chordify for piano](../superpowers/specs/2026-10-26-chordify-for-piano.md) §3

## Context

The owner found the View misleading. Its four views were tiles, and under them the sheet music's layout stood as a
section of its own: Panorama · Scroll · Pages. It read as three more views, or as every view's layout.

Chordify does it differently in two ways:

- Its song screen names the view in a toolbar row under the header (`PIANO ▾`, `GRID ▾`), beside Transpose and
  Simplify.
- Its web player puts a view's own modes beside the view chosen: Chord diagrams' "Diagram view mode", Animated ·
  Summary.

## Decision

- **A tools row under the Player's bar, at every size** (on a phone on its side, where height is short, in the bar's own row). It holds the View, named by the view shown ("Diagrams ▾"),
  and from Round 3 Transpose and Simplify. The eye leaves the Player's bar; the editor keeps it, as it shows the
  score alone.
- **The View menu by view.**
  - "Show the music as" and its tiles come first. A view the music cannot show is greyed, its reason its tooltip,
    and falls back if saved.
  - "Ask each time a song opens" follows.
  - Then a section named for the view shown, holding only its own: the sheet music's Layout (Pages · Scroll down ·
    Scroll across), Staves and switches; Diagrams' Mode (Animated · Summary) and Lyrics.
  - "Every view" comes last, with the Keys.
- **While Diagrams plays,** the bar and the tools row step aside, as Chordify's do, back at a stop or a tap.
- **`pt-settings` v10** holds `scoreView.diagrams` and `scoreView.askOnOpen`.

## Consequences

- **`widgets/score-view-menu`:** sections by view.
- **`widgets/chord-views`:** greyed tiles and their reasons.
- **`pages/player`:** the tools row and its area in `PlayerScreen`; the bar stepping aside.
- **`entities/settings`:** a new version.
- **`shared/i18n`:** the layout's new names.

The Player and the editor keep one View menu component; the editor's has no tiles.
