# ADR 0037 — The rail names the chord a hand holds

- **Status:** accepted · **Date:** 2026-10-09 · **Amends:** ADR 0036 (the rail's pictures: the pedal, the chips'
  place in the rail), ADR 0009 (the keyboard's settings)

## Context

The owner asked for three things about the keyboard: to see, or not, the chords they play wherever there is a
keyboard; a pedal picture they like (the drawn pedal of ADR 0036 read as a thermometer); and room between the rail's
buttons and the rail (a pressed chip was as tall as the rail and the last one stood flush with its end).

Only Free play and the Chord finder named what a hand plays, each on its own page. Every other keyboard (the
explorers, a lesson, a piece, the Player, the editors) said nothing.

## Decision

- **`keyboard.chordNames` is a keyboard setting** (`pt-settings` version 11; on for a new learner and for a
  version-10 save), set by a rail button that wears a chord symbol (`Cm7`) and by a switch in Settings.
- **The rail names what a hand holds, not what the app sounds.** The keys are the live voice's and a MIDI keyboard's,
  held or on under the pedal, named by the chord finder's first name (`nameChords`): three notes or more, else
  nothing. A note and an interval are Free play's and the Chord finder's to name, in the key or over the bass they
  know; the rail knows no key.
- **The name is the rail's caption** (`PianoKeyboard`'s `caption`): beside the buttons, in the room the map leaves;
  on a rail with no such room it starts at the rail's start, over the map, whole rather than cut. It is words to
  read, with its name for a screen reader, not a status: a screen's own status line stays the one thing it says
  aloud.
- **A trainer's round names nothing** (`namesChords={false}`): the chord, or its name, is the question, and the
  evidence a round records must be the learner's (ADR 0006). The button stays in its place, off and out of reach, so
  the rail's other buttons do not move.
- **The pedal wears the score's pedal mark** (𝆮, U+1D1AE) in Noto Music, the face the app already loads, set by
  its own metrics (`font-music`). `PedalIcon` goes.
- **The rail is 36px and its chips 28px**, 4px clear of it above and below and at least that from its ends and
  from each other. The strip is still 44px, the buttons' target, so the keyboard is no taller; an explorer's
  keyboard gives back the 8px the strip no longer leaves blank.

## Consequences

- A screen that asks for a chord by name passes `namesChords={false}`; every other keyboard names by the setting.
- Free play and the Chord finder name the same chord twice while it is held: once their way, once in the rail. The
  learner who minds turns the rail's off.
- `justify-self: safe end` places the caption; a browser without `safe` starts it at the rail's start.
