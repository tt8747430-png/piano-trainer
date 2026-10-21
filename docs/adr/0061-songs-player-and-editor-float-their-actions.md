# ADR 0061 — A song's page, the Player and the editor float their actions; the transport stays in sight

- **Status:** accepted · **Date:** 2026-10-19 · **Amends:** ADR 0055, ADR 0057, ADR 0058, ADR 0028 (takes)

## Context

The newer screens (the Chord finder, Chords, a lesson, Learn) keep the screen bar for Back, the title and status, and
float what does the screen's job in the thumb's reach: one round main action, one more always in sight, the rest in a
dial; a lesson's ‹ n/m › is one floating pill. A song's page, its listing, a shared song, the Player, the score editor
and a take's page still lay their actions out as rows of inline buttons, and the Player and the editor put Play far
from the hands. The floating host (`FloatingHost`) lives in `AppShell` alone, so the full-screen routes (`/play/*`,
`/edit/$pieceId`, the Check) have none.

## Decision

- **A song's page, its listing, a shared song and a take's page float their actions** (`FloatingActions`): the main one
  a `Fab`, a `FabLink` where it opens a page (Practise, Write the chart), a `PlayFab` where it plays (a take); the rest
  (Edit, Check these chords, Print, Share, Delete, Reset, Download) in a `SpeedDial`. One that asks first opens a
  dialog the page controls. Learned is the bar's round button, as on a lesson.
- **The Player's transport and the editor's Undo · Redo · Play are a `FloatingBar`**: the lesson bar's pill, one
  component, with a honey `FloatingBarPlay`. It is a grid area of the screen's layout, never a dial or a menu: the
  transport is used without pause and **stays in sight** at every size, along the foot on a phone, upright beside the
  sheet on a phone on its side (`orientation="landscape-phone"`).
- **Floating buttons stay inside the shell.** `FullScreenLayout` gets no host: a fixed column there would sit over the
  keys, the tools and the notes being read. Its bars float in look and stand in flow, so they cover nothing.
- The keys of a song's page are its `PinnedKeyboard`, docked and folded as the settings say (ADR 0055); the Player's
  move to the foot unless the settings dock them at the top.

## Consequences

Every screen names its job's action in one place, at the thumb. A test reaches a folded action by opening the dial
first. The kit has one floating pill (`FloatingBar`, `FloatingBarButton`, `FloatingBarPlay`), which `LessonBar` uses
too; `FabLink` replaces a hand-made round link.
