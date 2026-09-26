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
- **A swipe scrolls or plays, by the learner's choice.** Scroll (the default) lets the browser scroll and cancel the
  press; Glissando takes the finger from the page and plays every key it enters, hit-tested from the keys' layout
  (`keyAt`) rather than the DOM. ‹ › move the keys an octave in both swipes, since a mouse cannot swipe.
- **Typing reads physical keys** (`KeyboardEvent.code`), so every layout plays the same notes; it never plays from a
  text field, with a modifier held, or on auto-repeat.
- **The audio port hands back a play's handle and says whether it still sounds** (`isPlaying`), and which keys were
  struck last (`struck()`), from the same log as `sounding()`. A Stop button is component state over the port
  (`usePlayback`): another button's sound cuts its play off, and the port says so.
- **The keyboard settings are saved state** (`pt-settings` version 3), the same on every keyboard.

## Consequences

- No screen needs a tracker, a provider or timers to know whether its sound still plays, or which key to spotlight.
- `PianoKeyboard` stays presentational: it takes the settings, the letters and the quiet keys as props, and its rail's
  trailing controls as `children`; `LiveKeyboard` reads the store and the port.
- jsdom lays nothing out, so tests give the keys a box (`stubBox`) and the scroller its metrics (`stubScrolling`).
