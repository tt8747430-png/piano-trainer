# ADR 0028 — A take is kept as played, and written into the score only when asked

- **Status:** accepted · **Date:** 2026-10-05 · **Builds on:** ADR 0004 and 0008 (audio and MIDI behind ports), ADR
  0003 (saved state in stores), ADR 0027 (a version is the piece's music in its own format) · **Spec:**
  `2026-10-05-takes-and-more-chords-design.md`

## Context

The owner asked to record what they play on the piano, and whether the score editor already did it. It did not: the
editor writes one note of the chosen value at the caret for each key, with no timing and nothing to hear back. The
roadmap had planned "Record from a MIDI keyboard" (§5) as notes written into a score. A recording written straight
into notes loses what was played (its timing, touch and pedal) to one choice of note value made before playing, and a
learner who only wants to hear themselves back gets a score they did not ask for.

## Decision

- **A take is what was played, kept as played:** each key's onset, how long it was held and its velocity, and the
  sustain pedal's presses, in milliseconds from the first bar's downbeat at the tempo it was played to. It is heard
  back as played and downloads as a Standard MIDI File.
- **It is written into the score only when asked** (Write into the score): snapped to a note value the learner
  chooses then, split between the hands at a key or kept as the tune, over whole bars from the caret's bar, as one
  undo step. A take can be written again another way; it never changes.
- **It is played to the song's click:** a bar's count-in, then (if the saved Click switch is on) a click on the
  piece's bars, so the take's beats are the piece's and writing it needs no tempo found from the playing.
- **Time is placed where it was heard.** The audio port answers what audio-clock time was being heard at a moment of
  the page's clock (the AudioContext's time less its output latency, the clock recordings play by in ADR 0016,
  moved by how long before now that moment was), and the MIDI port stamps each event with that clock (the event's own
  `timeStamp`, not when a handler ran). Both are the ports' to know (ADR 0004).
- **The pedal is part of the port.** The MIDI port reads CC 64 as the sustain pedal (`onPedal`) beside the keys, and an
  unplugged keyboard lets it go as it lets go of its keys.
- **Takes are saved state: `pt-takes`, version 1,** a `createSavedStore` like every other, saved compactly through
  the store's new `write` (a note `[midi, at, held, velocity]`). localStorage is the app's one store of saved state and
  follows other tabs; a room of 60,000 notes in all (about 1.3 MB) keeps the takes inside every browser's quota, and a
  take stops itself at the room or at 10 minutes.
- **MIDI only.** Record needs a connected MIDI keyboard.
- **Decided against:** writing notes while recording (the note value would be chosen before playing, and what was
  played lost); the microphone (an audio take: another medium, other storage, and nothing to write into a score);
  IndexedDB for takes (a second storage with its own versioning and tab following, for data the room keeps small);
  recording the on-screen keys or the computer keyboard (their timing is the input's lag); a tempo found from free
  playing; importing `.mid`.

## Consequences

- The score editor's tools give way to a recording strip while a take records; the keys played do not write.
- `deleteSong` deletes the song's takes; a version's takes stay with the piece.
- A browser without Web MIDI (Safari) cannot record; the Recorder says so.
