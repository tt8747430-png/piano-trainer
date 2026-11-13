# ADR 0028 — A take is kept as played, and written into the score only when asked

- **Status:** accepted · **Date:** 2026-10-05 · consolidated 2026-10-27

## Context

The owner asked to record what they play on the piano. A recording written straight into notes loses what was played
(its timing, touch and pedal) to a note value chosen before playing, and a learner who only wants to hear themselves
back gets a score they did not ask for.

## Decision

- **A take is what was played**: each key's onset, how long it was held and its velocity, and the three pedals'
  presses, in milliseconds from its first bar's downbeat; the bar it starts at and its barlines as the piece's bars
  fell under the click; a name. It is heard back as played and downloads as a MIDI file.
- **It is written into the score only when asked**: snapped to a note value chosen then, split between the hands at
  a key or kept as the tune, over whole bars from the caret's bar, as one undo step. It can be written again another
  way. A take changes only when it is named or cut to fewer of its bars (Keep bars, asked first).
- **It is played to the song's click**: a bar's count-in, then the click if the Click switch is on, and Play melody
  (the song's top single staff) under it if that is on. Both may change while it records. The take's beats are the
  piece's, so writing it needs no tempo found from the playing. Each key and pedal is placed where it was heard less
  the piano's own lateness, as Calibrate timing measured it (ADR 0034); how did I play judges at ±80 ms, early or
  late beyond that within half a beat (`feedbackOf`), so the windows need no setting of their own.
- **MIDI only.** Record needs a connected MIDI keyboard; without one its popover says so and how to connect one. The
  on-screen keys and the computer's keys are not recorded: their timing is the input's lag.
- **In the editor's gear** (ADR 0114): Record a take, Takes (only once the song has one) and Settings › Recording;
  while it records, the recording strip stands at the sheet's foot. The takes' sheet opens by itself on
  a take just kept. A take has a page (`/edit/$pieceId/takes/$takeId`): its name, a piano roll, Play and Keep bars.
- **Saved in `pt-takes`**, written compactly. Room for 60,000 notes in all keeps the takes inside every browser's
  quota; a take stops at the room or at 10 minutes. A take ends kept when the editor is left or the app hidden.
  Deleting a song deletes its takes.
- **Decided against:** writing notes while recording, a microphone, IndexedDB, a tempo found from free playing,
  importing `.mid`.

## Consequences

Time is placed where it was heard: the ports stamp MIDI events and answer the heard audio time (ADR 0034). Safari,
without Web MIDI, cannot record.
