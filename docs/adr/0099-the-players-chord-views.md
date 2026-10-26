# ADR 0099 — The Player's chord views: Sheet music, Chords over lyrics, Diagrams, Grid

- **Status:** accepted · **Date:** 2026-10-25 · **Amends:** ADR 0064 (the View), ADR 0098 (the Player's chord
  chart), ADR 0094 and 0085 (the Player's bar and transport: the loop moves to the transport) · **Spec:** [chord
  views and song lessons](../superpowers/specs/2026-10-25-chord-views-and-song-lessons.md) · **Amended by:** ADR
  0101 (diagrams on one keyboard, an inversion per chord), ADR 0102 (the tools row; the View by view)

## Context

The owner showed Chordify's song screen: a choice of views ("Pick your view": Over lyrics · Diagrams · Grid), a strip
of beats that follows the song, the chord playing as a keyboard diagram beside the next, the chords as chips over the
words, a grid of beats, a chord tapped opening its diagram with Play, the song's chords as a row of diagrams, and a
menu with Song information and Export to MIDI. The Player had the sheet music or, with it off, a chord chart of bars
(ADR 0098).

## Decision

- **Four views.** The Player shows a piece as **Sheet music**, **Chords over lyrics**, **Diagrams** or **Grid**,
  chosen as picture tiles at the top of its View menu and saved for every piece (`scoreView.music`, in place of the
  `notation` switch). The rest of the menu is what the view chosen has. The editor shows the score alone.
- **Beats.** The chord views count a bar in beat cells as its meter counts beats, follow the cursor and Listen's
  clock a beat at a time, and take the cursor to a beat tapped. The **beat strip**, one row sliding under a fixed
  point, is Over lyrics' head and Diagrams' middle; the **Grid** is the chord chart in beats.
- **Chord diagrams.** A chord is drawn as a keyboard diagram of the keys the Player's right hand plays it with (its
  voiced chord; close from the root where the figure voices none). A chord tapped anywhere opens its sheet: the
  diagram large, Close and Play. A piece's **chord summary** is its chords as diagrams in the order they first sound.
- **More.** The Player's bar ends in More: Song information (the summary, key, time, tempo), Export to MIDI (the
  music as played) and an own song's Share. A song's row lists its first chords.
- **The loop is the transport's.** Seven round buttons (Close, Practise · Edit, the loop, View, MIDI, Setup, More)
  do not keep one row on a 375px phone, and the bar is the same at every size; Chordify's transport carries its
  loop beside the tempo, so the loop moves from the bar into the floating transport: the tempo, ‹ ▶ ›, the loop and
  the hands. Its key (R), tooltip and pressed look stay. On a phone held upright the transport's controls are the
  44px target, side by side, and it may stand into the gutters, so the six fit from 360px; under 360px they are
  40px, as on a phone on its side, so they fit from 320px.
- **Not Chordify's:** no view picker on opening, no instrument but the piano, no capo or tuning, no Transpose or
  Simplify items (the Setup's key transposes), no volume.

## Consequences

`entities/settings` (`scoreView.music`, version up), `widgets/score-view-menu` (a `views` slot), `widgets/chord-chart`
(beats), new `widgets/chord-views` and `widgets/chord-diagrams`, `shared/ui` (`KeyDiagram`), `pages/player`
(`PlayerLayout` shows the view chosen; More), `widgets/practice-player` (the loop in `PlayerDock`), `entities/piece`
(`PieceFactCards`, the song page's and Song information's), `entities/take`'s MIDI writer shared with a
performance's. ADR 0098's "Sheet music off shows the chord chart" becomes the Grid view.
