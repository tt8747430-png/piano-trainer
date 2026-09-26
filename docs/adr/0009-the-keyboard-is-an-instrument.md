# ADR 0009 — The keyboard is an instrument

- **Status:** accepted · **Date:** 2026-09-26 · **Extends:** ADR 0008

## Context

The owner found the keyboard slow to answer a touch, flat to look at, and short of what a piano app offers: a key
played on `click`, when the finger lifted, and then waited `PLAY_DELAY` on the audio clock; a scale's keys wore a band
"cut in two"; an arpeggio showed every chord key down at once; no Play could be stopped; every screen set its own
keyboard height. The references (GarageBand, Flowkey, The Ultimate Piano) treat the keyboard as an instrument first.

## Decision

- **Its look is a material.** The keys hang from a dark rail, stand apart on a key bed, end in a lip or a slope and
  drop when they go down, in a piano's proportions. The rail's shade, the lip and the slope are the No Glow Rule's one
  exception, drawn on keys only.
- **A key plays on touch, at the audio clock's now.** `pointerdown` plays; the pointer's own `click` does not play
  again, and a click no pointer made (Enter, Space, a screen reader) plays once. A tap is one note, with nothing to
  schedule ahead.
- **A key a hand plays is down while the hand holds it, and for at least the shortest press.** A tap or a typed key
  is a hand's play (`PlayOptions.byHand`): the port sounds it without counting it among the keys it shows, and the
  keyboard shows it pressed until the finger lifts or the key is let go, however long the sound rings, but never for
  less than 150 ms (`usePresses`), since a trackpad's tap lifts in the frame it lands and would never show (the
  owner's second look). MIDI keys go through the same presses.
- **The keys hold still under a finger; the rail scrolls them.** A key that plays never lets the keyboard scroll away
  (the keys take the finger from the page, in both swipes). Scroll (the default) plays only the key touched; Glissando
  plays every key a finger slides onto, hit-tested from the keys' layout (`keyAt`) rather than the DOM. The rail runs
  the piano's length inside the scroller, its controls held in view, so a swipe on it scrolls natively; ‹ › move the
  keys an octave, since a mouse cannot swipe.
- **Spotlight keeps every mark.** The keys the app puts down are the ones struck last, and every mark stays; a key
  played stands out by going down, and turns its mark's full colour (a plain key turns Key Down; the colours are
  ADR 0010's). (Revised twice after the owner's reviews: first dimmed marks read as noise, so they were hidden; then
  hidden marks lost the scale while it was played, where The Ultimate Piano keeps them pale and deepens the key
  played.)
- **The focused key keeps its place.** It never rises over its neighbours; a ring in two tones outlines the face a
  finger touches.
- **Typing reads physical keys** (`KeyboardEvent.code`), so every layout plays the same notes; it never plays from a
  text field, with a modifier held, or on auto-repeat.
- **The audio port hands back a play's handle and says whether it still sounds** (`isPlaying`), and which keys were
  struck last (`struck()`), from the same log as `sounding()`. A Stop button is component state over the port
  (`usePlayback`): another button's sound cuts its play off, and the port says so.
- **The keyboard settings are saved state** (`pt-settings` version 3), the same on every keyboard.

## Consequences

- No screen needs a tracker, a provider or timers to know whether its sound still plays, or which key to spotlight.
- `PianoKeyboard` stays presentational: it takes the settings, the letters and `spotlight` as props, and its rail's
  trailing controls as `children`; `LiveKeyboard` reads the store and the port.
- jsdom lays nothing out, so tests give the keys a box (`stubBox`) and the scroller its metrics (`stubScrolling`).
