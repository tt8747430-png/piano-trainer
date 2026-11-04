# ADR 0034 — Sound and MIDI sit behind ports; the audio port knows what it sounds

- **Status:** accepted · **Date:** 2026-09-24 · consolidated 2026-10-27 · amended 2026-10-28, 2026-11-04 (R29 SND)

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
- **Scheduled notes sound as a piano's under the pedal.** Every scheduled note decays as a string does for as long
  as it sounds, a hand's or the pedal's (`stringDecay`, the live voice's curve: 1.5 s at the top key to 6 s at the
  bottom), and its damper falls at its end; none holds at a level. A key has one voice: struck again, the voice still
  ringing on it is damped there (in the schedule, `oneVoiceAKey`, and in the adapter). The schedule holds a note struck
  under the pedal to the lift and emits `pedal` sounds at each event of the piece's pedal line (ADR 0097); in the
  browser they are the notes' lengths, and to a connected piano they go as the pedal, control change 64, each note's
  off at its written end (`held`), so the instrument's own pedal holds it on. A Stop lets the pedal up.
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
- **Recorded instruments, played by our own sampler** (R29 SND, A27). The piano, the band's two basses and its
  drum kit play from sample sets the app hosts itself, under `public/samples/<set>/`, each folder with its
  `manifest.json` (the set, its licence, its velocity layers from the softest with the velocity each plays
  below, and every file by its key (`midi`, with `tune` cents) or its piece (`voice`)) and a `SOURCES.md`
  (the set, its author, the URL, the licence and its URL, the files used, the command). Each set is made by
  `scripts/samples/<set>.mjs` with ffmpeg: AAC-LC in `.m4a`, mono (a phone's speaker is mono, and stereo
  doubles the decoded memory), 44.1 kHz, 96 kb/s (the kit's one-shots 128 kb/s), each file cut to its length
  with a 60 ms fade, one gain for a set so its layers keep their dynamics. The source files are not committed.
  `check-samples.test.ts` holds every folder to its manifest, its sources, a licence of CC0, public domain or
  CC BY, mono 44.1 kHz and its budget.

  | Set                                                                                      | Folder          | Licence                                        | Kept                                                                                         |
  | ---------------------------------------------------------------------------------------- | --------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------- |
  | Salamander Grand Piano V3 (Alexander Holm, Yamaha C5)                                    | `piano`         | CC BY 3.0, credited in Settings' Help footnote | 30 roots every minor third A0–C8 × 4 layers (v4, v8, v12, v16), 10/6/3 s by register, 8.8 MB |
  | The light piano (Salamander's v10 until Splendid Grand Piano, public domain, can be had) | `piano-light`   | CC BY 3.0                                      | 30 roots × 1 layer, 3 s, 1.1 MB                                                              |
  | Growlybass (Karoryfer, Squier Jazz Bass, fingered)                                       | `bass-electric` | CC0                                            | 11 roots E1–A3 × 2 layers, 2.5 s, 0.7 MB                                                     |
  | Meatbass (Karoryfer, 1958 double bass, pizzicato)                                        | `bass-upright`  | CC0                                            | 12 roots C1–A3 × 2 layers, 2.5 s, 0.7 MB                                                     |
  | Virtuosity Drums (Versilian and Karoryfer, a jazz kit)                                   | `drums`         | CC0                                            | 12 pieces × 2 strokes (normal, accent), four microphones mixed, 0.7 MB                       |

  CC-BY-SA, NC and unlicensed sets are never used; a set's licence is checked at its source before download.

- **Our own sampler, no library.** `shared/api/audio/sampler.ts` (`createSampler`): a key from its nearest root
  (at most a semitone off), tuned by its cents; the velocity picks the layer and scales the gain inside it; a
  loaded layer of the same root plays while the asked one loads; one voice a key; the piano's damper 0.6 s at C3
  to 0.25 s at C5; a kit's piece by name, a closed or pedal hat choking the open one. smplr was planned for a
  spike (A27); it was not tried, as no npm package may be added in round 29's worktrees, and what it would give
  is a small part of what the adapter already does (the clock, the damper). No Tone.js: we own the scheduler
  (`lookahead.ts`) and the damper (`schedule/damper.ts`).
- **One loader, 80 MB decoded.** `sample-loader.ts` reads a set's manifest once, fetches and decodes a file on
  first need, and keeps the decoded buffers of every set under 80 MB, the least recently struck freed first.
  `instruments.ts` holds the sets of one context: what a `play` will strike is fetched as it is scheduled;
  `unlock` loads the light piano whole and the grand's mp layer from middle C outwards (C2–C7), then fetches the
  grand's other files into the cache one at a time, decoding none.
- **What plays while a set loads.** A piano note: the grand's, else the light piano's, else the synthesised
  voice (oscillators, as before). A bass note: its set's, else the piano's. A drum stroke: the kit's, else the
  synthesised stand-in. The `AudioOutput` port is unchanged; the sounds' shape (`NoteSound.instrument`,
  `DrumSound`) is the schedule's.
- **Offline.** The service worker precaches every set but the grand (about 3.3 MB: the app plays offline from
  its first visit); the grand's files are cached as each is first fetched (`/samples/piano/`, CacheFirst, its own
  cache `samples-piano`, range requests, no expiry), every manifest stale-while-revalidate. Settings › Storage
  and backup › Piano sound shows how much of the grand is kept, downloads the rest for offline with its progress,
  and Remove piano samples empties that cache.
- **The clicks and the Metronome's own sounds** stay as ADR 0052 and A39 have them: synthesised, or the VCSL
  recordings in `public/sounds/`.

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
- r29 — Scheduled notes decay as a string does and are damped at their end, one voice a key, the pedal sent to a
  connected piano as control 64 at each pedal sound, notes off at their written ends (2026-11-03).
- r29 — The sampled grand (Salamander, four layers, self-hosted, ≤ 80 MB decoded); scheduled notes decay as a piano's, one voice per key, the pedal sent to a connected piano as CC 64 (decided 2026-11-02, being built in round 29; spec `.scratch/r29/piano-sampler/spec.md`).
- r29 SND — Recorded instruments (2026-11-04): the grand, a light piano, two basses and a drum kit, all self-hosted
  under `public/samples/`, played by our own sampler through one loader under 80 MB decoded; the grand cached at
  runtime and downloadable for offline, every other set precached. Replaces "every sound is synthesised".
