# ADR 0090 — Practise · Edit: one score in two modes

- **Status:** accepted · **Date:** 2026-10-23 · **Amends:** ADR 0027 (the Player's way into the editor), ADR
  0064 (the editor's own layout), ADR 0085 (the bars' buttons) · Research:
  [2026-10-flat-and-dorico](../research/2026-10-flat-and-dorico.md) §4

## Context

The Player and the score editor show the same piece's score, but they felt like two apps: the Player opened the
editor with a pencil, the editor had no way back to the Player but Close, neither knew where the other had been,
and each laid the music out by a setting of its own. Flat has one score screen with two modes (Composing and
Read-only) and keeps the cursor and the zoom between them; Dorico's modes share one window. Merging the two
screens would not suit us: half of the Player's uses (walks, the chromatic walk, progressions, exercises) have
no score to edit, a phone has no room for the palette and the caret beside the keys and the transport, and a
learner practising should not change the music by accident. Our Player already is Flat's Read-only.

## Decision

- **Two screens, joined as one with two modes.** A segmented control, **Practise · Edit** (`ModeSwitch`,
  `widgets/mode-switch`), stands first of the round buttons in both bars: the Player's and the editor's. The mode
  shown is a card on the track (`aria-current="page"`); the other is a link to the other screen. On a laptop
  each says its name beside its icon, on a phone its icon alone. It replaces the Player's pencil ("Edit the
  score"). Only a piece whose score can be edited has it: not a walk, the chromatic walk, a progression, an
  exercise, or a piece written in degrees.
- **The bar carries over.** Both URLs take `bar`, the bar as printed (from 1; `/play/$pieceId?bar=`,
  `/edit/$pieceId?bar=`): Edit opens with the caret at the start of the Player's cursor's bar, Practise opens
  with the cursor at the caret's bar. The Player plays the repeats taken, so its cursor's bar is read back to the
  bar as written (`writtenBarAt`) and a written bar opens on its first time played (`beatGroupInBar`). Each
  screen reads `bar` once and drops it from its URL, so a remembered view (ADR 0022) never holds it. The first
  bar is never written.
- **Switching replaces the history entry.** Practise and Edit are one place: switching never adds to the
  history, so Close (`useGoBack`) still goes back where the learner came from (the song's page, a study's), and
  the editor's Close keeps doing what it did.
- While a take records the switch waits for Stop, as the bar's other buttons do.
- **One layout.** The Player's `scoreView.layout` and the editor's `editorLayout` were two settings, so the
  music jumped from pages to a scroll when the mode changed. They are one: `scoreView.layout` (across ·
  scroll · pages), written by both View menus. `editorLayout` and `setEditorLayout` are gone and `pt-settings`
  goes to version 4 (ADR 0038: no migration, a version 3 save starts from the defaults).

## Consequences

`player.editScore` is gone; `player.mode.*` names the switch in both screens. `EditSearch` and `PlayerSearch`
gain `bar`, read by the route validators in `src/app/routes/player-search.ts`. A song's page keeps its own
"Edit the score" link.
