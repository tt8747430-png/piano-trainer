# ADR 0034 — Sound and MIDI sit behind ports; the audio port knows what it sounds

- **Status:** accepted · **Date:** 2026-09-24 · consolidated 2026-10-27 · amended 2026-10-28

## Context

`AudioContext` and Web MIDI exist in no test, Web MIDI not at all on Safari or iOS, and browsers start audio
suspended until a gesture. Sound comes from many places (a Play button, Listen's passes, Wait mode's other hand, a
tap, a MIDI keyboard, a recording), and every keyboard must show what sounds, at the audio clock's time. A tap must
ring while it is held and stop when it is let go, under the pedals, as a piano does.

## Decision

- **Ports.** `shared/api/audio` is the audio port and `shared/api/midi` the MIDI port (`MidiPort`).
  `app/composition-root.ts` builds the browser adapters once (`createServices()`), with `midi: null` where Web MIDI
  is missing; code reaches them only through `useServices()`, and tests pass `FakeAudio` and `FakeMidi`. Scheduling
  is pure (`shared/lib/schedule` turns ticks into seconds); an adapter only plays. Audio unlocks on the first gesture.
- **The audio port knows what it sounds.** Every note played is a window on the audio clock: `sounding()`,
  `onSounding()`, `struck()` (the keys struck last) and `isPlaying()` read one log. The adapter follows the clock each
  frame only while something sounds and someone listens. `LiveKeyboard` puts those keys down on every keyboard; a
  Play button's Stop is `usePlayback` over the port.
- **A live voice beside `play()`.** `press`, `release` and `pedal` over a pure damper (`schedule/damper.ts`): a key
  sounds from its press until its release, on while the sustain is down or the sostenuto caught it, two thirds as loud
  under the soft pedal. A hand (a tap, a typed key, a key that stands for a chord) plays through `useLiveVoice`, never
  through `play()`. `stop()` stops the scheduled music only. One loudness for a velocity (`velocityGain`).
- **A gain asked as each sound renders.** `play` takes a gain, so a volume moved while music plays is heard from the
  next sound (the Player's mix, ADR 0105).
- **The MIDI keyboard is set up once, on its own screen** (Settings › MIDI keyboard, `/settings/midi`;
  `pt-settings`' `midi`). Settings keeps one row for it, its state at its right (Off, the keyboard's name, Not
  available). The screen holds, with nothing said twice:
  - **MIDI input** (`input`): on asks for the keyboards and reconnects to an allowed one as the app opens; off stops
    listening (`MidiPort.disconnect()`, status `off`) and asks nothing as the app opens. **MIDI output**
    (`throughPiano`: the scheduled notes sent to the keyboard's speaker) and **MIDI input plays sound** (`sound`)
    need input: greyed, they say so under their label.
  - **Connected devices** (`MidiPort.devices()`): each device by its name, its ports of one name one device, with its
    maker and whether it sends keys or has a speaker; Any keyboard or one chosen (a chosen one unplugged stays,
    away); none, an empty state.
  - **Playing**: the octave shift, the Touch, a reversed pedal.
  - **Bluetooth**: a page cannot pair a BLE-MIDI keyboard, so a row opens the steps (the keyboard's Bluetooth, the
    system's pairing on a Mac, Windows or Android; no iPhone browser has Web MIDI); paired, it shows in the list.
  - **Troubleshooting › MIDI log** (`/settings/midi/log`): the port keeps the last 200 messages every keyboard sent,
    the ones not heard too (`log()`, `onLog`, `clearLog`), read by `describeMidiData`; the log shows them newest
    first, live (note on/off with the note's name, pedals, controllers, program, pitch bend, its velocity or value,
    channel and keyboard, to the millisecond), paused and cleared.
  - Where the browser has no Web MIDI or MIDI was blocked, a line over the switches says so, its ⓘ how to put it
    right, and every control is greyed, never hidden.

  `MidiSync` tells the port (`configure`); a change lets go of every key and pedal held. The three pedals are read
  (`onPedal`); an unplugged keyboard lets go of its keys and pedals.

- **Time is placed where it was heard.** A MIDI event carries its own time stamp, and the audio port answers which
  audio-clock time was heard at a moment (`audioTimeAt`: the context's time less its output latency).
- **A piece's recording plays along** (`Recording`: its file, where bar 1 begins, one steady tempo, its tuning). It
  is an AAC file beside the piece's content, precached, so it must fit the precache limit. It plays in Listen only
  and in the piece's own key only, its rate the tempo's ratio with its pitch kept. It plays by its own audio element,
  not through the AudioContext (WebKit stalls a routed element after each seek), loaded whole as a Blob (Workbox
  answers a range request with the whole file, so a streamed element cannot seek). It starts on the heard clock, is
  sought back past 40 ms of drift, learns the element's seek lag and seeks that far ahead, and is primed muted on the
  Play tap so Safari lets it start later.
- **Every sound is synthesised**: the piano voice from oscillators, the clicks and the Metronome's drums from
  oscillators and a second of noise. Nothing is fetched.

## Consequences

- A screen needs no tracker or timers to know what sounds; tests move the fake's clock and read a key's `data-down`.
- Safari on an iPhone must be checked on a device for the recording's start and its alignment over Bluetooth.
- A browser without Web MIDI cannot record a take (ADR 0028).

## History

- 0004 — Audio and MIDI behind ports (2026-09-24).
- 0008 — The audio port knows which keys it sounds (2026-09-25).
- 0016 — A piece may carry a recording that plays along (2026-09-29).
- 0034 — A key sounds while it is held, the MIDI keyboard set up once (2026-10-09). Its takes are ADR 0028's; its
  Free play went with the Chord finder (ADR 0052).
- r13 — The MIDI keyboard gets its own screen: input and output switches, connected devices, Bluetooth pairing
  steps and a live MIDI log; Settings shows its state in its row (2026-10-28).
