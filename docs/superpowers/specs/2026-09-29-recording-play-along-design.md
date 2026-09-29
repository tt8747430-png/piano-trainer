# A piece's recording, played along in the Player

- **Status:** agreed with the owner 2026-09-29 (brainstorming: one question, then the design approved as presented).
- **Builds on:** ADR 0004 (audio behind ports), ADR 0008 (the audio port knows what it sounds), ADR 0013 (the
  Player's Listen passes on the audio clock), ADR 0015 («Ромашковые поля» as the course writes it).
- **Reverses:** the roadmap's §5 "Not for this app: audio and YouTube players" for a recording shipped inside the app
  (it needs no network, no account); YouTube and streamed audio stay out.

## 1. What the owner asked

> can you also sink the audio with this playback of chords '/Users/kristianbraila/Downloads/Ромашковые поля (вокал).mp3'

| #   | Question                         | Answer                                                                 |
| --- | -------------------------------- | ---------------------------------------------------------------------- |
| 1   | Where does the recording come from? | **Shipped inside the app**, on every device and offline (not loaded from the device) |
| 2   | The design (§2–§4)               | **Approved**, with the file converted to 128 kbps AAC                   |

### 1.1 The file, measured

`Ромашковые поля (вокал).mp3`: 66.38 s, 48 kHz stereo, 320 kbps (2.65 MB). Sound runs from **2.74 s** to **63.30 s**
(60.56 s): the chart's 18 bars (verse, chorus with the 1st ending, last chorus with the 2nd) at the piece's **72
BPM** take exactly 60 s, and the loudness rises at 34–38 s, where bar 11 (the chorus) falls if bar 1 starts near
2.7 s. The recording is the chart's form at a steady 72. Bar 1's exact second is pinned by fitting a beat grid to the
voice's onsets when the content is written (§3), and the owner confirms it by ear; it is one number in the piece's
file.

## 2. The recording, as content

```ts
// shared/lib/schedule/recording.ts
/** A performance of a piece (a singer's) that the Player plays along: in the piece's own key and form. */
export interface Recording {
  /** The audio file's URL: imported with `?url`, so the build fingerprints and precaches it. */
  readonly src: string
  /** Seconds into the file where bar 1 begins. */
  readonly start: number
  /** Its steady tempo in beats per minute, counted as the piece's chart counts them. */
  readonly tempo: number
}
```

- A piece may carry one: `recording?: Recording` on every Piece (`entities/piece/model/types.ts`). «Ромашковые
  поля» carries the vocal: `romashki-vocal.m4a` beside `romashki.ts`, `start` as measured, `tempo: 72`.
- **The file:** converted to AAC at 128 kbps in an `.m4a` by macOS's `afconvert` (Apple's AAC encoder): about 1.1 MB,
  under Workbox's 2 MiB precache limit, and inaudibly different for a voice. Every browser the app targets decodes
  AAC (Safari, Chrome, Edge, Firefox on macOS, Windows and Android). The 320 kbps mp3 is not committed.
- **Offline:** the PWA's `globPatterns` gain `m4a`, so the recording is precached with the app.
- The catalog test holds every recording to `start ≥ 0` and a tempo within `TEMPO_RANGE`.

## 3. When and how it plays

- **Listen mode only**, while the transport runs. Wait mode waits for the learner; a recording cannot wait.
- **Only in the piece's own key:** a transposed key would put the voice against other chords.
- **At any tempo, its pitch kept:** its rate is the pass's tempo over the recording's (50%, 75%, speed training's
  passes); an audio element keeps pitch when its rate changes (`preservesPitch`, on by default).
- **From where the pass plays:** every pass (the first from the cursor, each round of a loop, the whole piece again)
  plays the recording from its first bar's point in the file, when that bar's music starts (after a count-in).
- **Stop** silences it; the swing, the hands, the pattern and the chord size change nothing in it.

### 3.1 The timing, pure (`shared/lib/schedule`)

- `Scheduled` (one pass's schedule) gains `fromTick`, `toTick` and `musicStart` (the seconds after the pass's start at
  which `fromTick` sounds: after the count-in).
- `recordingPlay(recording, pass): RecordingPlay`, with
  `RecordingPlay = { at, offset, rate, until }`: `at` = the pass's start + its music start (audio clock), `offset` =
  `recording.start` + `fromTick`'s seconds at the recording's tempo, `rate` = pass tempo ÷ recording tempo, `until` =
  the pass's end (audio clock).

### 3.2 The audio port

`AudioOutput` gains two calls; `unlock()` and `stop()` cover recordings too.

```ts
/** Readies a recording (fetched, routed to the output) so a Play can start it at once. */
loadRecording(src: string): void
/** Plays a recording from `offset` seconds at `rate`, starting at `at` on the audio clock, until `until`. */
playRecording(src: string, play: RecordingPlay): void
```

- **The browser adapter** (`shared/api/audio/recording-player.ts`, wired into `web-audio.ts`): one audio element per
  recording, routed through the AudioContext (`createMediaElementSource`), so it leaves by the same output, and so the
  same latency, as the notes. A timer every 20 ms starts a queued play when the clock reaches its `at` (seeking to its
  offset, setting its rate), keeps it on time (a drift past 40 ms from `offset + (now − at) × rate` seeks it back),
  and pauses it at `until` when nothing follows. A play that follows another at once only seeks, so a loop never
  pauses and restarts the element.
- **Unlocking:** `unlock()` (called on the Play tap) starts and pauses every loaded recording, muted, inside the
  gesture, so Safari lets it play later without one; a play the browser still refuses stays silent and is dropped.
- **The fake** records `loadedRecordings` and `recordings` (each play's `src` and `RecordingPlay`) for tests.

### 3.3 The Player

- `startTransport(…, recording)` plays the recording with every pass it queues: `audio.playRecording(src,
  recordingPlay(recording, pass))`. `usePractice`'s setup gains `recording: Recording | null` and loads it on mount;
  `usePracticePlayer` passes it through (a walk passes none).
- `usePlayer` decides: the piece's recording when it has one, the Recording switch is on, and the Player is in the
  piece's own key; else none.

### 3.4 The switch

- **Recording** («Запись»): a saved Practice toggle like Melody, **on by default**, shown in the Setup of a piece that
  has a recording (`RecordingSwitch` in `widgets/player-setup`). In another key it is disabled with the note "Only in
  D minor" («Только в тональности D минор»: the key's name as `keyOf` writes it).
- **Saved state:** `recording` joins `PRACTICE_TOGGLES` with its default in `DEFAULT_PRACTICE`; the sanitiser keeps a
  toggle saved as `true` or `false` and gives one never saved its default (today it turns any missing toggle off,
  which would turn the recording off for everyone who saved settings). `SETTINGS_VERSION` becomes 4; the migration is
  the sanitiser, as for versions 1–3.

## 4. Words and records

- **Glossary:** **Recording** («Запись»): a performance of a piece shipped with it (a singer's), played along in
  Listen in the piece's own key, at any tempo with its pitch kept. Not the planned "record from a MIDI keyboard"
  (§5 of the roadmap), which writes a score.
- **ADR 0016:** a piece may carry a recording that plays along; audio elements behind the port, synced to the audio
  clock; shipped and precached; Listen and the own key only.
- `CONTENT.md` (the `recording` field, how to measure `start`), `DESIGN.md` (the switch), the roadmap (§5's line
  amended, the owner's words in §7), `CLAUDE.md` (the port's calls, the switch).

## 5. Testing (test first)

- `recording.test.ts`: `recordingPlay` from bar 1 and from a later tick, at the recording's tempo and at half of it,
  after a count-in. `schedule.test.ts`: `fromTick`, `toTick`, `musicStart`.
- `recording-player.test.ts` (fake element, fake timers, a clock the test moves): a play starts at its `at` at its
  offset and rate; drift beyond 40 ms seeks, within it does not; `until` pauses; a following play seeks without
  pausing; `stop()` pauses; `prime()` plays muted and pauses; a refused play is caught.
- `transport.test.ts`: every pass plays the recording, a loop's second pass from the loop's first bar.
- `store.test.ts`: a version-3 save gains `recording: true`; a saved `false` stays; the other toggles unchanged.
- `PlayerPage.test.tsx` (through `renderApp`): «Ромашковые поля» in Listen plays its recording from `start` at rate 1;
  none in another key (the switch disabled with its note), in Wait mode, or with the switch off; at 50% its rate is
  0.5; the switch saves.
- `catalog.test.ts`: every recording's `start` and `tempo`. `npm run build`: the precache lists the `.m4a`.
