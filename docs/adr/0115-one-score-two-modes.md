# ADR 0115 — One score in two modes: the Player and the editor share one bar, one tools row, one transport

- **Status:** accepted · **Date:** 2026-10-23 · consolidated 2026-10-27 · amended 2026-11-01

## Context

The Player and the score editor show the same score, but felt like two apps: their bars, menus and transports were
drawn, named and ordered differently, the controls jumped as the learner switched, and each laid the music out by a
setting of its own. Flat keeps one score screen with Composing and Read-only modes, the cursor and the zoom carried
between them; Flat's, forScore's, MuseScore's and Dorico for iPad's headers are one toolbar of flat icon buttons.
Merging the two screens would not suit: half the Player's uses (walks, progressions, exercises) have no score to
edit, and a learner practising should not change the music by accident.

## Decision

- **Two screens, one score, two modes.** The Player's Edit score (its Settings sheet's head) opens the editor; the
  editor's Play · Edit pill (`ModeSwitch`, the bar's middle) goes back. Switching replaces the history entry, so Close still goes back where the learner came from.
  The bar carries over: both URLs take `bar`, the bar as written (the Player's cursor read back through the repeats,
  `writtenBarAt`; a written bar opening on its first time played, `beatGroupInBar`), read once and dropped from the URL.
  Only a piece has the switch, and every piece can be edited: a song written in degrees opens as its chart in its key
  (`asChartPiece`). While a take records the switch waits for Stop.
- **One bar** (`ScoreBar`): bare over the paper, Close leading, a pill in the middle of the room the ends leave
  (the Player's views, the editor's Play · Edit), each mode's buttons at the end (the Player's MIDI · Settings, the
  editor's Undo · Redo · ···). Its buttons are a toolbar's (the button's `tool` variant: round, no frame at rest,
  the muted fill on hover, while open and pressed, 44px). One row at every
  size, the same height in both modes, and the screen's rows meet in both (`SCORE_SCREEN`), so the sheet never moves as
  the mode switches and nothing is left between the editor's palette and the keys.
- **No tools row** (R31-E): the Player's View is its Settings', Transpose its More's; the editor's View and
  Transpose are its gear's first page, Delete · Copy · Cut · Paste float by what is chosen.
- **One Transpose** (`widgets/transpose`): its trigger the key as printed, in the accent once moved; inside, − the key
  it lands in +, how far in semitones, and Reset. The Player's moves the key it plays in at once (ADR 0105); the
  editor's, a page of its gear (`TransposeFields`), adds the first line moved as a preview, and Transpose, one Undo
  step.
- **The Player's transport** (`Transport`) is docked at its foot over the foot bar (ADR 0105): Loop · Restart · ‹ ·
  Play · › · Pace · Metronome. Its controls shrink step by step so they fit a 320px phone. The editor has no
  transport: Play is its bar's, Record a take and Takes its gear's (ADR 0114); while a take records, its strip stands
  at the sheet's foot.
- **Nothing but the sheet's pill floats over the Player's music** (R31-P). In the editor Delete · Copy · Cut · Paste
  float too, while something is chosen, stepping aside while the music is read (`useHiddenWhileReading`). The editor's
  palette is docked beside or under the sheet, taking its own room (ADR 0114), so the bar and the keys stand where the
  Player's do and only the sheet's width or height changes as the modes switch.
- **One layout setting** (ADR 0096) in both modes; the Player's views are Pick your view's (ADR 0108). The keys show
  and hide by the bar's Keyboard (ADR 0062). Which staves show is the Player's Setup's (ADR 0105); the editor shows
  every staff.
- **Each mode a kind page** (B7): the Player's settings (ADR 0105) and the editor's gear (ADR 0114), which holds only
  what the score does not print: Instruments, Layout, Note input, Recording (R32-B).

## Consequences

The two screens are learned once, and a new control has one home: the sheet's look (View), how the music plays
(Setup), the song itself (edited where it is printed, ADR 0114), the device (MIDI). The editor's recorder keeps its
own Play melody switch: it plays the tune under a take.
