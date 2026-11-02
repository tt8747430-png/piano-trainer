# Spec: the Player plays staves; accompaniment only for a chart (A35, B7)

## Problem
The Player's Setup offers an accompaniment Pattern, Starting position, Move smoothly, Swing and
"Melody: None · Melody staff · Recording" (`pt-settings.melody`, `widgets/player-setup`) on every song, so a
song with written staves (Daisy fields) shows chart machinery that does nothing. "Melody" survives in the
Player after ADR 0097 made staves plain staves. One-hand practice has no "other hand" choices.

## Decision
1. **Two kinds, decided by the piece**: `hasWrittenStaves(piece)` (any staff with notes) → *a score*; else
   *a chart*. One selector in `entities/piece`, used by the Player, its Setup and its settings.
2. **A score plays its staves.** Setup's first section is **Staves**: one row per staff by its name
   (Upper, Lower, Voice…) with Play (switch) and Show (switch), plus the recording as a track of its own when
   the song has one; a volume slider per row on the Player's settings page (Flat's Audio playback).
   State: `PlayerStaves = Record<StaffId, { play: boolean; show: boolean; volume: number }>` in the
   Player's URL for play/show (`staves=`, a compact `u1s1,l0s1` form; default all on) and the volume in
   `pt-settings.sound.staves[StaffId]` (replacing the single `staves` number). `scoreView.hidden` merges
   into Show and is removed.
3. **A chart gets an accompaniment**, under its own heading "Accompaniment from the chords": pattern,
   first chord's inversion ("Inversion", not "Starting position"), voice leading (switch, not "Move
   smoothly"), swing. Hidden on a score.
4. **Melody leaves** the Player and the editor: `pt-settings.melody`, `MelodySource`, `MelodyField`,
   `set-melody`, `widgets/player-setup/model/melody.ts` are deleted; a song's recording is a track (2);
   a chart's tune, where it has one, is its first staff. Explorer links that set `melody=` lose it
   (`explorer-search.ts`). Lesson content using `melody` is converted.
5. **One hand** (Practice mode's Hands: Both · Left · Right): with one hand chosen, "The other hand: Show ·
   Dim · Hide" (Hide shows only the chosen hand's staff) and "Play the other hand" (switch, as "Hear both
   hands"), both on the Player's settings page under Practice. Which staff is which hand: the staff's clef
   and place (`staffHand`), editable on the staff in the editor.
6. **Controls that do nothing are hidden** per kind; the audit table (every Setup, View, Tools and settings
   control × score, chart, lesson example, progression, exercise) goes in `audit.md` and drives a
   `controlsFor(kind)` table in `widgets/practice-player/model`, with its test.

## Tests
- `hasWrittenStaves` for Daisy fields (score), a chart song, a progression.
- Setup on Daisy fields shows Staves and no accompaniment; on a chart shows accompaniment and no Staves.
- Play off silences that staff's notes in the schedule; Show off removes it from the score; the recording
  track's volume reaches `playRecording`.
- Other hand: Dim greys, Hide drops the staff, Play off silences it.
- `controlsFor` table test.

## ADR
0105 (the Player: Setup, staves, other hand), 0097 (no melody), 0038 (`staves=` in the URL).
