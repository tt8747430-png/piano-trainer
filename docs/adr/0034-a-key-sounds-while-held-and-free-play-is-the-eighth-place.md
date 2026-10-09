# ADR 0034 — A key sounds while it is held, the MIDI keyboard is set up once, a take is named and cut to its bars, and Free play is Practice's eighth place

- **Status:** accepted · **Date:** 2026-10-09 · **Builds on:** ADR 0004 and 0008 (audio and MIDI behind ports), ADR
  0003 (the view in the URL, saved state in stores) · **Amends:** ADR 0028 (a take changes only as played), ADR 0030
  (Practice is seven places) · **Reverses:** the roadmap's "not for this app" sustain pedal · **Spec:**
  `2026-10-09-piano-voice-midi-and-free-play-design.md`

## Context

A tap was a note of a fixed 1.2 s that rang on after the finger lifted and that nothing cut; the app read a MIDI
keyboard's keys but not its pedal's effect on what the app sounds, could not hear one keyboard of two, a small
keyboard's octave, a pedal wired the other way round, or a keyboard with no speaker; a take kept only the sustain and
could not be named or trimmed. The owner asked for the piano's missing features: a voice with the pedal, the MIDI
keyboard's settings, how hard a key is struck, and the roadmap's planned Live score and Toggle mode.

## Decision

- **The audio port has a live voice beside `play()`:** `press(key, velocity)`, `release(key)` and
  `pedal(pedal, down)`, over a pure damper (`shared/lib/schedule/damper.ts`): a key sounds from its press until its
  release, on while the sustain is down or the sostenuto caught it; struck again, it stops first; under the soft
  pedal it is two thirds as loud. `stop()` stops the scheduled music only: a key a hand holds ends by its release.
  The live voice's keys are the port's own (`live()`), shown down on the keys but never leading the keyboard's view,
  so a tap never moves the keys under the finger (ADR 0009). One loudness for a velocity (`velocityGain`) serves the
  live voice and a take.
- **A hand plays through `useLiveVoice`** (a tap, a typed key, a key standing for a chord), never through `play()`;
  each press strikes, and a key two presses hold is let go with the last. The rail's **Pedal** and Space (where Space
  has no other job) hold the sustain; the MIDI keyboard's pedals are the voice's pedals, always.
- **The MIDI keyboard is set up once, in Settings** (`pt-settings` version 9, `midi`): the keyboard heard (any, or one
  by name: the others are not listened to, and a chosen one unplugged is `away`), Sound the MIDI keyboard (off: the
  owner's piano sounds itself), Play through the piano, an octave shift, the Touch (how loud a velocity is heard;
  never what a take saves) and a reversed pedal. One provider, `MidiSync`, tells the port (`configure`), so every
  reader of the port hears the same keys; a change lets go of every key and pedal held first.
- **Through the piano:** with it on, the scheduled notes go to the keyboard's speaker as timed note-ons and offs
  (`notesTo`); the click, a recording and the live voice stay in the browser. Stop lets go of every key sent.
- **A take keeps all three pedals and the bar it starts at, and may be named and cut to whole bars** (`pt-takes`
  version 2). ADR 0028 is amended: a take changes when the learner names it or keeps fewer of its bars (Keep bars,
  asked first: it cannot be undone), never otherwise; whole bars keep it on the click's beats. A take has a page of
  its own (`/edit/$pieceId/takes/$takeId`), drawn as a piano roll.
- **Free play is Practice's eighth place** (ADR 0030 amended), `/practice/free-play`: Play writes and names what is
  played on a grand staff (the live score: the chord now and the four before it, keys struck within 50 ms one chord);
  Mark makes a teaching diagram (two colours, the hands', and fingers) kept in the URL, so a diagram is a link.

## Consequences

- `keySounds`, `useSoundKeys` and the `byHand` play are gone; a hand's sound is the live voice's.
- `MidiInput` is `MidiPort`: keys and pedals in, the keyboards' speakers out.
- A version-8 settings save and a version-1 take read on with their defaults (a take's presses the sustain's, from
  bar 1, unnamed). Saved stores read an older save once (`createSavedStore`'s migrate passes it through to `read`).
- Not built: a sampled piano (megabytes against the precache), half-pedalling, takes outside the score editor, an
  image of a diagram.
