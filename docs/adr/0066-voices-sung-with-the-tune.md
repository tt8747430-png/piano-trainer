# ADR 0066 — Voices sung with the tune, each on a staff of its own

- **Status:** accepted · **Date:** 2026-10-21 · **Amends:** ADR 0064 (the tune's staff)

## Context

The owner wanted proper staves and instruments in the editor, as Sibelius adds them. Asked which instruments,
they chose voice and piano: songs with several sung lines (a hymn's soprano, alto, tenor) over the piano.

## Decision

- **Music.** A piece may sing up to three more voices with its tune (`voices`, each written as the tune is,
  ADR 0063's marks and all); a saved song reads them field by field, dropping one that does not read or outruns the
  chart, so `pt-pieces` keeps its version (ADR 0038).
- **Staves.** `STAVES` writes, top down, the tune's (`melody`), the more voices' (`voice2`, `voice3`, `voice4`, each a
  treble) and the piano's grand staff. A note sung by a more voice carries its `voice`; `TimedMusic.voiceStaves`
  says which are written. Where voices are sung together, each sung staff is named over its start (`StaffNames`).
- **Editor.** Each more voice is a row the caret writes, one line like the tune, between the tune's and the
  right hand's (a click on its staff, Alt ↑ ↓). The + menu's Staves adds the next voice; the settings take one away
  with its notes, the later ones moving up.
- **Sound.** The arranger carries every voice sung, the tune first, in the key played (`Performance.sung`), apart
  from the notes the hands play: Wait mode never waits on a voice. The schedule sings them whatever hands are
  heard, in a voice of their own (`timbre: 'voice'`): a sustained, filtered tone with a slow vibrato, never sent to
  a MIDI keyboard's speaker.
- **Player.** A piece with more voices shows every voice on its own staff, the tune's first, over the piano.

## Consequences

Other instruments (woodwind, strings, transposing parts, percussion) are left out: each would need its clef, its
range and a sound. The voices are heard but not practised; a learner plays the piano's part.
