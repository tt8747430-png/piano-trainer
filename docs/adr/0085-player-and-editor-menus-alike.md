# ADR 0085 — The Player and the editor: one bar, one View, each option where it is looked for

- **Status:** accepted · **Date:** 2026-10-23 · **Amends:** ADR 0061 and 0081 (the transport on a phone on its
  side), ADR 0064 (what the View holds), ADR 0080 (the MIDI keyboard's place)

## Context

An audit of both screens at a phone's and a laptop's sizes
([2026-10-player-editor-ui-audit](../research/2026-10-player-editor-ui-audit.md)) found the two bars drawn and
named differently, the View menus ordered and headed differently, the MIDI keyboard in the Player's bar but in the
editor's Song sheet (where, on Safari, without Web MIDI, it left a heading over nothing), Chord positions among the
Setup's sounds though it only labels the sheet, three different things called "Melody", and the Player's upright
transport on a phone on its side lying over the bar's Setup and the keys' rail.

## Decision

- **One bar.** Both bars read Close · title · the screen's own commands · View · MIDI · the song's settings (Setup
  in the Player, Song in the editor), the round outlined buttons every screen bar uses; Undo and Redo, the editor's
  edit pair, stay plain. The menus that open a pop-up or a sheet (View, Setup, Song) are named from a laptop's width
  (`SetupTrigger`); toggles and status (Loop, Record, MIDI) stay icons with tooltips.
- **The MIDI keyboard is the bar's** on both screens, hidden without Web MIDI; the Song sheet is the song alone.
- **One View.** Both View menus open on the Layout, then their groups (the Player's Staves and Show, the editor's
  Show, then the palette's side where it stands beside the sheet), every group of these menus and sheets under one
  heading (`MenuSection`, the Setup's How it plays and the Song sheet's Parts too).
- **What the sheet shows is the View's, all of it:** Chord positions joins Chord names, Finger numbers and Note
  names there; the Setup keeps how it plays (`PLAYING_TOGGLES`: metronome, count-in; swing, melody and recording
  where the music has them), under a visible "How it plays".
- **Names say which:** the View's "Melody staff", the Setup's Melody under How it plays, the takes' switches each
  with a line; "Keys" in both Views.
- **The transport on a phone on its side lies along the sheet's foot,** as it does upright and as the editor's
  dock does: the sheet between the bar and the keys is shorter than an upright pill, which, floating over it,
  covered the controls round it. Lying down it fits, and still takes no room of its own (ADR 0081).

## Consequences

The two screens can be learned once. A new option has one home by what it does: the sheet's look (View), how the
music plays (Setup) or the song itself (Song), the device (the bar's MIDI).
