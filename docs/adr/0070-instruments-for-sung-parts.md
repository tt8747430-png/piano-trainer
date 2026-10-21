# ADR 0070 — The tune and each voice played on an instrument

- **Status:** accepted · **Date:** 2026-10-21

## Context

ADR 0066 let a song sing up to three more voices with its tune, all in one voice. The owner asked for instruments
added as a notation app adds them, by family, each part with its sound, its clef and its name.

## Decision

- **A part's instrument.** `INSTRUMENTS` (`shared/lib/music/instrument.ts`): the voice, violin and cello, flute,
  oboe and clarinet, trumpet and horn, the guitar; `INSTRUMENT_OF` gives each its family and its clef (the cello's
  and the horn's bass). A piece's `instruments` names the tune's first, then each more voice's; `voice` where none
  is named. A save keeps them only where every one names an instrument.
- **Heard.** `arrange` sings the parts (`Performance.sung`) where there are more voices or the tune is on an
  instrument, with `Performance.instruments` beside them; `schedule` gives each note its part's instrument as its
  timbre; the web-audio adapter plays each from a table of tones (waves, attack, release, vibrato, brightness, a
  plucked string's decay). A MIDI keyboard's speaker plays the piano alone.
- **Written.** `TimedMusic.staffInstruments` names each sung staff's instrument: `notate` writes the staff in its
  clef (`clefIn`, `staffClefAt`), and `StaffNames` names the staff by its instrument.
- **Editor.** The + menu's Staves adds an instrument by family (its clef and its short name on the tile), each a
  part sung with the tune on a staff of its own; the settings' Instruments choose the tune's and each part's. A
  part that writes nothing is not saved, nor its instrument.

## Consequences

The guitar is written where it sounds, not an octave up. A part's range is not checked.
