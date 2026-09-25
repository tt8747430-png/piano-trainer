# ADR 0008 — The audio port knows which keys it is sounding

- **Status:** accepted · **Date:** 2026-09-25

## Context

The owner asked that every keyboard show what is played: an arpeggio key by key, a scale run, a bar, Listen, a tap.
Sound comes from many places: `usePlay` (chords, bars, runs), Listen's transport (passes queued ahead of the clock),
Your turn's other hand, the quiz's answers. The Scales explorer lit its keys with timers of its own
(`useLitKey`), which only it could use, and which drifted from the audio clock.

## Decision

`AudioOutput` gains `sounding()` and `onSounding(onChange)`, the shape `MidiInput` already has for its status. Both
adapters keep one log (`createSoundingKeys`): every note played becomes a window on the audio clock, and `stop()`
empties it. The WebAudio adapter looks at the clock every animation frame while a window is open and someone listens;
the fake looks when a test moves its clock. `useSoundingKeys()` reads it, and `LiveKeyboard` puts those keys down on
every screen's keyboard.

## Consequences

- Whatever plays, by whatever path, shows on the keys, at the audio clock's time; nothing a screen plays needs its
  own lighting code.
- Tests stay synchronous: a test moves the fake's clock and reads a key's `data-down`.
- The adapter follows the clock only while something sounds and something listens, so a silent screen costs no frames.
