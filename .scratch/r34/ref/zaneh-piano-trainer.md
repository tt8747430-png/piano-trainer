# ZaneH/piano-trainer: what we can take

Source: https://github.com/ZaneH/piano-trainer, read 2026-11-06 (README, `src/`). MIT licence: code may be copied with
its notice. A small Tauri and React desktop app for drilling scales and chords with a MIDI keyboard or the computer's
home row.

## What it has

- **Practice modes:** Scales (major, natural minor, melodic minor in every key, including C♭, E♯ and B♯), Chords (the
  key's triads with their Roman numerals), Seventh chords, Fifths.
- **Scale options, as three icon toggles:** Ping-pong (up and down), **Hard mode** (the next note is not shown until it
  is played: the scale from memory), **Shuffle** (a random scale when one is finished).
- **Quiz:** "Press {{key}} on your keyboard" and "Which is a perfect fifth of {{key}}" (major or minor), random.
- **Settings sidebar:** show the keyboard, mute, MIDI input, piano sound (15 General MIDI sounds), language (six),
  crash reports.
- A touch guard: a second tap within 350 ms on the keys does not zoom the page (`touchGuard.ts`).

## Against ours

We have all of it and more: Scales and keys with direction (Up, Down, Up and down), a random key, chords with numerals
and sevenths, Intervals, the Quiz, MIDI and the computer keys, sounds, two languages. Missing:

1. **From memory:** a scale, chord or progression played with no highlighted next key, only the name; the keys light
   only once played, wrong ones marked. A step up from the guided run.
2. **Keep going:** when a scale or chord set is finished, carry on with the next key (random, or round the circle of
   fifths) without stopping; a count of keys done.
3. Their spelling of theoretical keys (C♭, E♯, B♯ major) is worth checking against ours, only to confirm ours names
   them correctly; we keep the practical set.

Nothing else is worth porting.
