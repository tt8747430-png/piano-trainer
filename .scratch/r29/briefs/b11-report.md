# B11 — Tools, as a group of their own (the agent's report)

## Built
- **Tools first on Practice** (`PRACTICE_GROUPS`): Metronome, Chord finder, Circle of fifths, Tap tempo, Recorder, Drone, Tuner; Search and `parents.ts` follow. Metronome left Training, Chord finder left Playing.
- **`widgets/tool-page` `ToolPage`**: Back, title, act, ⚙; readout filling the middle; controls; floating Start/Stop (icon and stop label per tool), slots for pinned keys and a dial. Metronome and Chord finder moved onto it.
- **Pages**: Metronome + `/practice/metronome/settings` (sound, between beats, speed trainer, silent bars); Tap tempo (large pad, Italian word, Use in Metronome; one `useTapTempo` shared with the Metronome's Tap); Circle of fifths (`?key=`, a tapped sector: signature, relative key, seven chords that play, Open in Scales and keys; `KeyCircle` takes `onChoose`, never a picker); Drone (PitchPicker root, Note · Fifth · Major · Minor `ChoiceCard`, octave, volume, saved; `audio.drone()` on the port, oscillators with gain ramps, fake records drones); Recorder (free MIDI takes at the Metronome's tempo/time, all recordings grouped free/per song: play, rename, export MIDI, Make a song from it via `songOfTake` = take → MIDI → import, Delete asks); Tuner + `/practice/tuner/settings` (A4 in `pt-settings.tuner`, v24; Player's TunerSheet reads it via shared `TunerReadout`).
- **Tools sheet over screens** (`widgets/tools-sheet`): quick Metronome (song's tempo/time in the Player, else the Metronome's own; writes the saved tempo only without a song), Recorder, Tuner; Tools button in a lesson, Chords, Scales and keys, Intervals, Chord player with All tools.
- **One engine**: `features/metronome` (`useMetronome(song?)`, `clickVoice`, `quickTime`); the Player's count-in/click read `clickVoice`.

## Commits
8e6198b0 settings + drone port · c6c9e9eb free recordings + songOfTake · 9dc3da6a Tools group, ToolPage, the tools · f0b7bb4f Tools sheet over screens · (final) fixes, screenshots, report.

## Rulings (cost if wrong)
- `pt-takes` stays v2: `free` is a field added later, read as `[]` (CLAUDE.md allows); bumping broke `pages/score-editor` tests I may not touch. Cheap to bump later.
- Free takes are a separate `free` list (`FreeTake`), not an optional `pieceId`, so the editor's code keeps its types.
- Metronome beat squares (accents) stay on the face (tapped there); Settings holds sound, subdivision, trainers.
- Chord finder's gear still opens `/settings/chord-finder` (its existing home), not `/practice/chord-finder/settings`.
- Quick metronome on the Chord player follows the Metronome, not the sheet's tempo.
- The Player's foot-bar Metronome still navigates to the Metronome page (B10's catalog).

## Left
- The score editor's Tools button (off-limits this round).
- Tools sheet "beats" shown as the time signature, not lit beat squares.

## Checks
typecheck, lint clean; `test:changed` all pass except `composition-root.test.ts` (no Supabase env in this worktree, unrelated). Build OK (placeholder env inline). Screenshots `b11-*` at 402, 874, 1280; no overflow. No migrations.
