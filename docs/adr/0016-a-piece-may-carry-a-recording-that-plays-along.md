# ADR 0016 — A piece may carry a recording that plays along

- **Status:** accepted · **Date:** 2026-09-29 · **Amends:** the roadmap's §5 ("Not for this app: audio and YouTube
  players"), ADR 0004's audio port (it plays recordings too)

## Context

On 2026-09-29 the owner sent the course's vocal recording of «Ромашковые поля» (an mp3, 66 s, 320 kbps) and asked for
it to "sync with this playback of chords". The roadmap had refused audio players, for needing a network or an
account. A recording shipped with the app needs neither. The file is the chart's form (verse, chorus with the 1st
ending, last chorus with the 2nd) at a steady 72: its 60.6 s of sound are the 18 bars, bar 1 at 2.70 s.

## Decision

- **A piece may carry a `recording`** (`{ src, start, tempo }`): the file beside the piece's content, AAC `.m4a` at
  128 kbps (converted by `afconvert`: 1.04 MB, under Workbox's 2 MiB precache limit), imported with `?url` so the
  build fingerprints it, and precached with the app (`m4a` in `globPatterns`). The owner chose shipping it over
  loading it from the device.
- **It plays in Listen only, in the piece's own key only**, at any tempo with its pitch kept (an audio element's
  rate), from each pass's first bar, as that bar's music starts (after a count-in); Stop silences it.
- **The timing is pure** (`recordingPlay`: offset from the pass's first tick at the recording's tempo, rate the
  pass's tempo over the recording's). **The port plays it:** `loadRecording`, `playRecording`; the browser adapter
  keeps one audio element per recording, routed through the AudioContext on its first play (the same output and
  latency as the notes), started by a 20 ms timer when the clock reaches it, sought back past 40 ms of drift, paused at
  a pass's end unless another follows (which only seeks), and primed muted on the Play tap so Safari lets it start
  later.
- **A saved Recording switch**, on by default, in the Setup of a piece with one; disabled in another key with "Only in
  D minor". The settings go to version 4: a toggle never saved takes its default.
- **Decided against:** loading recordings from the device (the owner's choice); decoding to an AudioBuffer (exact, but
  it cannot keep pitch at other tempos); a recording in Wait mode (it cannot wait) or in another key (the voice would
  clash); YouTube and streamed audio (still out: a network and an account).

## Consequences

- Another piece gains a recording by adding the file and one line; its `start` is measured (a beat grid over the
  voice, then checked by ear).
- Safari on an iPhone must be checked on a device: a recording that starts after the tap relies on the priming.
