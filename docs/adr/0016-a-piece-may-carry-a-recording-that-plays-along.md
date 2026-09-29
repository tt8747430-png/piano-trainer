# ADR 0016 — A piece may carry a recording that plays along

- **Status:** accepted · **Date:** 2026-09-29 · **Amends:** the roadmap's §5 ("Not for this app: audio and YouTube
  players"), ADR 0004's audio port (it plays recordings too)

## Context

On 2026-09-29 the owner sent the course's vocal recording of «Ромашковые поля» (an mp3, 66 s, 320 kbps) and asked for
it to "sync with this playback of chords". The roadmap had refused audio players, for needing a network or an
account. A recording shipped with the app needs neither. The file is the chart's form (verse, chorus with the 1st
ending, last chorus with the 2nd) at a steady 73, not the chart's 72: bar 1 at 3.26 s, the voice's first note (2.73 s)
a pickup before it, and its choruses on bars 11 and 15. First timed at 72 from bar 1 at 2.70, then 3.53; the owner
heard the voice late, set bar 1 at 3.25, then 3.26 (the grid's best fit), and heard it run ahead of the chords, 0.73 s
by its last bar (2026-09-29).

## Decision

- **A piece may carry a `recording`** (`{ src, start, tempo }`): the file beside the piece's content, AAC `.m4a` at
  128 kbps (converted by `afconvert`: 1.04 MB, under Workbox's 2 MiB precache limit), imported with `?url` so the
  build fingerprints it, and precached with the app (`m4a` in `globPatterns`). The owner chose shipping it over
  loading it from the device.
- **It plays in Listen only, in the piece's own key only**, at any tempo with its pitch kept (an audio element's
  rate), from each pass's first bar as that bar's music starts; during a count-in it plays what leads into the bar
  (the singer's pickup), never from before the file's start. Stop silences it.
- **The timing is pure** (`recordingPlay`: offset from the pass's first tick at the recording's tempo, rate the
  pass's tempo over the recording's). **The port plays it:** `loadRecording`, `playRecording`; the browser adapter
  keeps one audio element per recording, on the clock of what is heard (the AudioContext's time less its
  `outputLatency`), started by a 20 ms timer when that clock reaches it, sought back past 40 ms of drift (never while
  it seeks, nor within 0.3 s of a seek, so a buffering seek is not sought again), paused at a pass's end unless
  another follows (which only seeks), and primed muted on the Play tap so Safari lets it start later.
- **It plays by its own element, not through the AudioContext, and a seek aims ahead by the element's lag.**
  WebKit's element stands still after each seek or play (about 0.1 s alone; routed into the AudioContext by
  `createMediaElementSource`, about 0.45 s, and 0.65 s after a change of rate). Sought back to where it should be, it
  was as far behind again 0.3 s later, and sought again and again: on iPhones and iPads, and Safari anywhere, the
  voice stuttered and never played on. The player learns the lag from each seek once it settles and seeks that far
  ahead, so one more seek puts it in time; Chrome's lag is under the 40 ms it may drift, so it learns none (measured
  2026-09-29 with Playwright's WebKit as an iPhone against a production build, 25 seeks in 8 s before).
- **The element plays the whole file from memory** (`wholeFileMedia`: fetched once, a Blob's object URL), never
  streamed. Streamed, an element asks for byte ranges, and Workbox's precache answers a range with the whole file
  (200, not 206): the deployed app's element could not seek (`seekable` empty), so each seek landed back at 0 s and
  the drift check sought again every 0.3 s, the voice stuttering over its first moments; Safari may refuse such a
  response outright. Local development has no service worker, so it never showed there (found 2026-09-29, a
  production build under `vite preview` driven in Chrome: 30 seeks in 10 s, none with the service worker blocked).
- **A saved Recording switch**, on by default, in the Setup of a piece with one; disabled in another key with "Only in
  D minor". The settings go to version 4: a toggle never saved takes its default.
- **Decided against:** loading recordings from the device (the owner's choice); decoding to an AudioBuffer (exact, but
  it cannot keep pitch at other tempos); a recording in Wait mode (it cannot wait) or in another key (the voice would
  clash); YouTube and streamed audio (still out: a network and an account); a service worker of our own that answers
  byte ranges from the precache (Workbox's `RangeRequestsPlugin` on a route ahead of the precache's: a hand-written
  worker for the whole app, where one file needs it).

## Consequences

- Another piece gains a recording by adding the file and one line; its `start` is measured (a beat grid over the
  voice, then checked by ear).
- Safari on an iPhone must be checked on a device: a recording that starts after the tap relies on the priming, and
  the voice's alignment with the notes over Bluetooth relies on the browser's `outputLatency`.
