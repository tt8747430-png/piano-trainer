# Spec: the pedal as events (A27, A29)

## Problem
The sustain pedal is a note mark (`NoteMarks.pedal: 'down' | 'up' | 'change'`, written `ped`, `pedup`,
`pedch` in a staff's text). MusicXML import merges a stop and a start at one place into the start
(`Object.assign` in `applyDirections`), drops a release over a rest or after the last note, and ignores
`<offset>`, so the Fantaisie-Impromptu's pedal never lifts. A rest cannot carry it. Playback holds a pedalled
note at a flat 40% level (organ-like), stacks voices on a key struck again, and sends the pedal to a
connected piano as longer notes instead of CC 64.

## Decision
1. **Model.** The pedal leaves `NoteMarks`. A piece has one pedal line, `ChartPiece.pedal?: string`, its
   events at beats from the music's start: `down@0 change@4 up@15.5` (kinds `down`, `up`, `change`; a beat as
   the staves write beats). The kernel type is
   `PedalEvent { tick: Tick; kind: 'down' | 'up' | 'change' }`, sorted, a `change` where an up and a down
   meet. Parsed and written in `entities/piece/model/pedal-line.ts` with its test; a malformed event is a
   `ContentError` like a note's. One sustain pedal per piece (soft and sostenuto stay live-only).
2. **Arrangement and Performance.** `Performance.pedal: readonly PedalEvent[]` (replacing the marks
   collected at `arrange.ts:743`); `pedalSpans`/`pedalHeld` read it. Transposing or simplifying keeps it.
3. **Engraving.** `mei.ts` writes each event as `<pedal tstamp=…>` on the lowest staff of its bar
   (`dir="down|up|bounce"`), so a change between notes or over a rest prints where it is.
4. **Import.** MusicXML: every `<pedal>` becomes an event at its measure position plus `<offset>` (divisions
   → ticks); a stop and a start at one tick become `change`; `type="change"` is `change`; a stop after the
   last note is kept. MIDI: CC 64 ≥ 64 down, < 64 up, a down within one tick of an up a `change`.
5. **Export.** MusicXML writes `<direction><direction-type><pedal type="start|stop|change"/>` at each
   event's position with `<offset>` where it isn't on a note; MIDI writes CC 64 at each event.
6. **Sound.** The schedule emits `{ kind: 'pedal', at, down }` sounds. `web-audio` keeps one voice per key
   (a key struck again damps its old voice), lets every note decay as a piano's does whether or not the
   pedal holds it (the live voice's `holdNote` curve, longer for lower keys), and damps the pedal-held
   voices at the lift (`damper.ts`'s rule). `midi-sound-output` sends CC 64 at each pedal sound; notes end at
   their written end.
7. **Editor.** The pedal tool places an event at the selection's start tick (down), at its end (up), or a
   change at a note; dragging a Ped. mark moves its event. A pedal mark on a note in old text is not read:
   the built-in content is converted once by a script (`scripts/pedal-line.mjs`), and `pt-pieces` bumps its
   version (no reader of old saves, CLAUDE.md).
8. **Without pedal marks** (B7/A27): the Player's settings "Pedal: As written · Off · Automatic"; Automatic
   derives events from the chord symbols (a change at each new chord) or, without chords, from each bar's
   first beat, in `schedule/auto-pedal.ts`.

## Tests
- `pedal-line.test.ts`: read/write round trip; change; errors.
- MusicXML fixtures: stop+start at one place → change; release over a rest; release after the last note;
  `<offset>`; Finale's and MuseScore's ways of writing it. The Fantaisie-Impromptu's first eight bars'
  events against the score.
- Schedule: a pedalled note ends at the lift; a re-struck key emits its old voice's end; auto-pedal changes
  at each chord.
- Audio (fake): one voice per key; gain at 2 s below gain at 0.5 s for a held note.
- MIDI out: CC 64 at each event, note-offs at written ends.

## ADR
0097 (the music model: the pedal line), 0034 (sound: decay, one voice per key, CC 64), 0107 (import and
export).
