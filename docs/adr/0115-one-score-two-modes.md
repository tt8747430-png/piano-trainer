# ADR 0115 — One score in two modes: the Player and the editor share one bar, one tools row, one transport

- **Status:** accepted · **Date:** 2026-10-23 · consolidated 2026-10-27 · amended 2026-10-28

## Context

The Player and the score editor show the same score, but felt like two apps: their bars, menus and transports were
drawn, named and ordered differently, the controls jumped as the learner switched, and each laid the music out by a
setting of its own. Flat keeps one score screen with Composing and Read-only modes, the cursor and the zoom carried
between them; Flat's, forScore's, MuseScore's and Dorico for iPad's headers are one toolbar of flat icon buttons.
Merging the two screens would not suit: half the Player's uses (walks, progressions, exercises) have no score to
edit, and a learner practising should not change the music by accident.

## Decision

- **Two screens, one score, two modes.** Practise · Edit (`ModeSwitch`, one pop-up; an editor also sees Edit the
  original) leads both bars. Switching replaces the
  history entry, so Close still goes back where the learner came from. The bar carries over: both URLs take `bar`, the
  bar as written (the Player's cursor read back through the repeats, `writtenBarAt`; a written bar opening on its
  first time played, `beatGroupInBar`), read once and dropped from the URL. Only a piece has the switch, and every
  piece can be edited: a song written in degrees opens as its chart in its key (`asChartPiece`). While a take records
  the switch waits for Stop.
- **One bar** (`ScoreBar`): one band of card paper to the screen's edges with one hairline under it. Its buttons are a
  toolbar's (the button's `tool` variant: no frame at rest, the muted fill on hover, while open and pressed, 44px).
  Close and Practise · Edit lead; each mode's three buttons end it (the Player's MIDI · Setup · More, the editor's
  MIDI · Undo · Redo); the tools stand between. Two rows on a phone held upright and on a tablet, one row from 1024px
  and on a phone on its side. The same height in both modes, so the sheet never moves as the mode switches.
- **One tools row** (`PlayerTools`): the Player's View · Transpose · Simplify; the editor's View · Transpose, then
  Delete · Copy · Cut · Paste. On a phone held upright a tool with a value shows its value alone after its icon.
- **One Transpose** (`widgets/transpose`): its trigger the key as printed, in the accent once moved; inside, − the key
  it lands in +, how far in semitones, and Reset. The Player's moves the key it plays in at once (ADR 0105); the
  editor's adds Apply to key, Apply to chords, the first line moved as a preview, and Transpose, one Undo step.
- **One transport** (`Transport`), one pill floating along the sheet's foot at every size: the tempo, ‹, Play, ›, then
  the mode's three: the Player's loop, Sound and hands; the editor's Record, Takes and the recording's settings. Play
  stands in the same spot in both modes. While a take records, its strip stands in the transport's place. Its
  controls shrink step by step so they fit a 320px phone.
- **What floats over the music takes no room.** The transport stands over the sheet, which has room past its last
  line to scroll above it. It steps aside while the music is read (dragged, scrolled, pinched:
  `useHiddenWhileReading`) and comes back at a tap. While Diagrams plays the whole bar steps aside. The editor's
  palette no longer floats: it is docked beside or under the sheet, taking its own room (ADR 0114), so the bar, the
  tools row, the transport and the keys stand where the Player's do and only the sheet's width or height changes as
  Practise · Edit switches.
- **One View menu** in both modes (ADR 0108) and one layout setting (ADR 0096). The keys fold from their rail and
  come back from the View.

## Consequences

The two screens are learned once, and a new control has one home: the sheet's look (View), how the music plays
(Setup), the song itself (edited where it is printed, ADR 0114), the device (MIDI). The editor's recorder keeps its
own Play melody switch: it plays the tune under a take, not the Player's melody.

## History

- 0061 — The Player's transport a floating bar (2026-10-19).
- 0079, 0081 — The editor floats its tools; what floats over the music takes no room (2026-10-22).
- 0085 — The Player and the editor: one bar, one View (2026-10-23).
- 0090 — Practise · Edit: one score in two modes (2026-10-23).
- 0110 — One bar, one tools row, one transport (2026-10-26).
- 0115 — One band for the bar, one Transpose, a plain Setup (2026-10-27). Its Setup is ADR 0105's, its View ADR
  0108's.
- r13 — The editor's palette docked, not floating (ADR 0114) (2026-10-28).
- r21 — Practise · Edit · Edit the original one pop-up (`ModeSwitch`), its face the mode's icon and name; the
  editor's Mine / The original tabs gone; the editor's Replace · Insert · Chord a pop-up too (2026-10-30).
- r21 — The bar flat and alone (Close, the mode, the screen's own three); the tools (View, Transpose, Simplify)
  a capsule floating under it over the music on a phone held upright and a tablet, in the bar's row where it is
  one row; Delete · Copy · Cut · Paste a selection capsule floating over the transport while notes are chosen,
  the chord row is written or the clip holds some (Apple's layers: navigation, content tools, the edit menu by
  the selection) (2026-10-30).
