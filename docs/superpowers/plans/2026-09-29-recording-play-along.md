# A piece's recording, played along — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** «Ромашковые поля»'s vocal recording plays in time with the Player's chords in Listen, in the piece's own
key, at any tempo with its pitch kept.

**Architecture:** The timing is pure (`shared/lib/schedule`: `recordingPlay` over a Pass). The audio port gains
`loadRecording`/`playRecording`, which the browser adapter serves with one audio element per recording, routed
through the AudioContext and kept on the audio clock. The transport plays the recording with every pass; the piece's
page decides whether it plays (the Recording switch, the own key).

**Tech Stack:** React 19, Vite (asset `?url` imports), vite-plugin-pwa/Workbox, strict TypeScript 6, zustand,
i18next, Vitest 4 + jsdom 29, Web Audio + HTMLMediaElement.

**Spec:** `docs/superpowers/specs/2026-09-29-recording-play-along-design.md`

## Global Constraints

- FSD, lint-enforced: `app → pages → widgets → features → entities → shared`; `shared/lib/schedule` stays pure (no
  DOM, no React); browser APIs only in `shared/api` adapters.
- Strict TS, no `any`, no casts in product code, no `eslint-disable`; tests colocated, Vitest `globals: false`.
- Prettier on touched files only (`npx prettier --write <files>`), never `npm run format`.
- Every UI string in `en` and `ru`: "Recording" («Запись»), "Only in {{key}}" («Только в тональности {{key}}»).
- Saved data keeps working: `pt-settings` goes to version 4; a version-3 save gains `recording: true`, keeps the rest.
- Commits on `main`, plain-sentence messages ending `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Verify: `npm run typecheck && npm run lint && npm run test`, and `npm run build` (the PWA's precache changes).

## Review Focus

1. **A loop's round:** the second pass of a loop plays the recording from the loop's first bar, and never pauses and
   restarts the element between rounds. Pinned in Tasks 2 and 3.
2. **Tempo changes mid-play:** 50% or a speed-training pass plays the recording at rate 0.5 / the pass's own rate.
   Pinned in Tasks 1 and 6.
3. **A transposed key or Wait mode:** no recording at all, and the switch says why in another key. Pinned in Task 6.
4. **A refused `play()`** (Safari without a gesture, jsdom): caught, silent, nothing thrown. Pinned in Task 2.
5. **Settings saved before this change** keep every toggle and gain the recording on. Pinned in Task 4.

---

### Task 1: The recording's timing

**Files:**

- Create: `src/shared/lib/schedule/recording.ts`, `src/shared/lib/schedule/recording.test.ts`
- Modify: `src/shared/lib/schedule/schedule.ts` (`Scheduled` gains `fromTick`, `toTick`, `musicStart`),
  `src/shared/lib/schedule/index.ts`
- Test: `src/shared/lib/schedule/schedule.test.ts`

**Interfaces:**

- Produces: `interface Recording { src: string; start: number; tempo: number }`,
  `interface RecordingPlay { at: number; offset: number; rate: number; until: number }`,
  `recordingPlay(recording: Recording, pass: Pass): RecordingPlay`; `Scheduled.fromTick`, `.toTick`, `.musicStart`.

- [ ] **Step 1: Write the failing tests**

Create `src/shared/lib/schedule/recording.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import type { Pass } from './loop'
import { recordingPlay, type Recording } from './recording'

const VOCAL: Recording = { src: 'vocal.m4a', start: 2.74, tempo: 72 }
const pass = (extra: Partial<Pass>): Pass => ({
  sounds: [],
  cues: [],
  end: 60,
  fromTick: 0,
  toTick: 864,
  musicStart: 0,
  start: 100,
  tempo: 72,
  ...extra,
})

describe('recordingPlay', () => {
  it('plays from bar 1 as the pass starts, at the recording’s own rate', () => {
    expect(recordingPlay(VOCAL, pass({}))).toEqual({ at: 100, offset: 2.74, rate: 1, until: 160 })
  })

  it('plays from the pass’s first tick, after its count-in, at the pass’s tempo', () => {
    // Four beats in at 72 is 3⅓ seconds into the recording; at 36 it plays at half speed.
    const play = recordingPlay(VOCAL, pass({ fromTick: 48, musicStart: 6.67, tempo: 36, end: 80 }))
    expect(play.at).toBeCloseTo(106.67)
    expect(play.offset).toBeCloseTo(2.74 + 10 / 3)
    expect(play.rate).toBe(0.5)
    expect(play.until).toBe(180)
  })
})
```

Append inside `describe('schedule', …)` in `src/shared/lib/schedule/schedule.test.ts`:

```ts
  it('says where the pass runs and when its music starts, after a count-in', () => {
    const plain = schedule(perform('C', 'F'), { tempo: 60, hands: ALL, fromTick: 12, toTick: 60 })
    expect([plain.fromTick, plain.toTick, plain.musicStart]).toEqual([12, 60, 0])
    const counted = schedule(perform('C', 'F'), { tempo: 60, hands: ALL, countIn: true })
    expect([counted.fromTick, counted.toTick, counted.musicStart]).toEqual([0, 96, 4])
  })
```

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/shared/lib/schedule/recording.test.ts src/shared/lib/schedule/schedule.test.ts`
Expected: FAIL (`./recording` missing; `fromTick` undefined).

- [ ] **Step 3: Implement**

In `src/shared/lib/schedule/schedule.ts`, extend `Scheduled`:

```ts
export interface Scheduled {
  readonly sounds: readonly Sound[]
  readonly cues: readonly Cue[]
  /** When the pass is over. */
  readonly end: number
  /** The ticks the pass runs from and to. */
  readonly fromTick: Tick
  readonly toTick: Tick
  /** When `fromTick` sounds, after the pass's start: after its count-in. */
  readonly musicStart: number
}
```

and return them from `schedule`: `return { sounds: …, cues, end: at(toTick), fromTick, toTick, musicStart }`.

Create `src/shared/lib/schedule/recording.ts`:

```ts
import { TICKS_PER_BEAT } from '@/shared/lib/music'
import type { Pass } from './loop'

/** A performance of a piece (a singer's) that the Player plays along: in the piece's own key and form. */
export interface Recording {
  /** The audio file's URL: imported with `?url`, so the build fingerprints and precaches it. */
  readonly src: string
  /** Seconds into the file where bar 1 begins. */
  readonly start: number
  /** Its steady tempo in beats per minute, counted as the piece's chart counts them. */
  readonly tempo: number
}

/** Where in a recording one pass plays from, when on the audio clock, how fast, and until when. */
export interface RecordingPlay {
  /** When the pass's first tick sounds, on the audio clock. */
  readonly at: number
  /** Seconds into the file. */
  readonly offset: number
  /** The pass's tempo over the recording's: 0.5 at half speed. */
  readonly rate: number
  /** When the pass is over, on the audio clock. */
  readonly until: number
}

/** The recording under one pass: from the pass's first tick, as its music starts, at its tempo. */
export function recordingPlay(recording: Recording, pass: Pass): RecordingPlay {
  return {
    at: pass.start + pass.musicStart,
    offset: recording.start + (pass.fromTick * 60) / (recording.tempo * TICKS_PER_BEAT),
    rate: pass.tempo / recording.tempo,
    until: pass.start + pass.end,
  }
}
```

In `src/shared/lib/schedule/index.ts` add:
`export { recordingPlay, type Recording, type RecordingPlay } from './recording'`.

- [ ] **Step 4: Run the schedule tests**

Run: `npx vitest run src/shared/lib/schedule && npm run typecheck`
Expected: PASS; typecheck clean (any literal `Scheduled` elsewhere gains the three fields).

- [ ] **Step 5: Format, commit**

```bash
npx prettier --write src/shared/lib/schedule/recording.ts src/shared/lib/schedule/recording.test.ts src/shared/lib/schedule/schedule.ts src/shared/lib/schedule/schedule.test.ts src/shared/lib/schedule/index.ts
git add src/shared/lib/schedule
git commit -m "$(printf 'Time a recording under a pass: from its first tick, as its music starts, at its tempo\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>')"
```

---

### Task 2: The audio port plays a recording on the audio clock

**Files:**

- Create: `src/shared/api/audio/recording-player.ts`, `src/shared/api/audio/recording-player.test.ts`
- Modify: `src/shared/api/audio/types.ts`, `src/shared/api/audio/web-audio.ts`,
  `src/shared/api/audio/fake-audio.ts`, `src/shared/api/audio/index.ts`
- Test: `src/shared/api/audio/fake-audio.test.ts`

**Interfaces:**

- Consumes: Task 1's `RecordingPlay`.
- Produces: `AudioOutput.loadRecording(src: string): void`, `AudioOutput.playRecording(src: string, play:
  RecordingPlay): void`; `FakeAudio.loadedRecordings: readonly string[]`, `FakeAudio.recordings: readonly { src:
  string; play: RecordingPlay }[]`; `createRecordingPlayer(…)`.

- [ ] **Step 1: Write the failing tests**

Create `src/shared/api/audio/recording-player.test.ts`:

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createRecordingPlayer, type Media } from './recording-player'

/** A media element the test drives: it records seeks, rates, plays and pauses; its time moves only when told. */
function fakeMedia(refuse = false) {
  const media = {
    currentTime: 0,
    playbackRate: 1,
    muted: false,
    paused: true,
    seeks: [] as number[],
    plays: 0,
    pauses: 0,
    play: vi.fn(async () => {
      media.plays++
      if (refuse) throw new Error('NotAllowedError')
      media.paused = false
    }),
    pause: vi.fn(() => {
      media.pauses++
      media.paused = true
    }),
  }
  return new Proxy(media, {
    set(target, key, value) {
      if (key === 'currentTime') target.seeks.push(value)
      return Reflect.set(target, key, value)
    },
  })
}

describe('createRecordingPlayer', () => {
  let clock = 0
  let media = fakeMedia()
  let routed = 0
  const player = () =>
    createRecordingPlayer({
      now: () => clock,
      createMedia: (): Media => media,
      route: () => {
        routed++
      },
    })
  beforeEach(() => {
    vi.useFakeTimers()
    clock = 0
    media = fakeMedia()
    routed = 0
  })
  afterEach(() => vi.useRealTimers())

  it('starts a play when the clock reaches it, at its offset and rate', async () => {
    const recordings = player()
    recordings.load('vocal.m4a')
    recordings.play('vocal.m4a', { at: 1, offset: 2.74, rate: 0.5, until: 20 })
    await vi.advanceTimersByTimeAsync(40)
    expect(media.plays).toBe(0)
    clock = 1
    await vi.advanceTimersByTimeAsync(20)
    expect(media.plays).toBe(1)
    expect(media.currentTime).toBeCloseTo(2.74)
    expect(media.playbackRate).toBe(0.5)
    expect(routed).toBe(1)
  })

  it('seeks back when it drifts past 40 ms, and leaves it within', async () => {
    const recordings = player()
    recordings.play('vocal.m4a', { at: 0, offset: 10, rate: 1, until: 60 })
    await vi.advanceTimersByTimeAsync(20)
    const seeks = media.seeks.length
    clock = 2
    media.currentTime = 12.03
    media.seeks.pop()
    await vi.advanceTimersByTimeAsync(20)
    expect(media.seeks).toHaveLength(seeks)
    media.currentTime = 12.1
    media.seeks.pop()
    await vi.advanceTimersByTimeAsync(20)
    expect(media.currentTime).toBeCloseTo(12)
  })

  it('pauses at a play’s end when nothing follows, and seeks without pausing when one does', async () => {
    const recordings = player()
    recordings.play('vocal.m4a', { at: 0, offset: 10, rate: 1, until: 4 })
    recordings.play('vocal.m4a', { at: 4, offset: 10, rate: 1, until: 8 })
    await vi.advanceTimersByTimeAsync(20)
    clock = 4
    media.currentTime = 14
    await vi.advanceTimersByTimeAsync(20)
    expect(media.pauses).toBe(0)
    expect(media.currentTime).toBeCloseTo(10)
    clock = 8
    await vi.advanceTimersByTimeAsync(20)
    expect(media.pauses).toBe(1)
  })

  it('stops: pauses and forgets what is queued', async () => {
    const recordings = player()
    recordings.play('vocal.m4a', { at: 0, offset: 0, rate: 1, until: 30 })
    recordings.play('vocal.m4a', { at: 30, offset: 0, rate: 1, until: 60 })
    await vi.advanceTimersByTimeAsync(20)
    recordings.stop()
    expect(media.paused).toBe(true)
    clock = 30
    await vi.advanceTimersByTimeAsync(20)
    expect(media.plays).toBe(1)
  })

  it('primes a loaded recording inside a gesture: plays it muted and pauses it', async () => {
    const recordings = player()
    recordings.load('vocal.m4a')
    recordings.prime()
    await vi.advanceTimersByTimeAsync(0)
    expect(media.plays).toBe(1)
    expect(media.paused).toBe(true)
    expect(media.muted).toBe(false)
  })

  it('stays silent when the browser refuses to play', async () => {
    media = fakeMedia(true)
    const recordings = player()
    recordings.play('vocal.m4a', { at: 0, offset: 0, rate: 1, until: 30 })
    await expect(vi.advanceTimersByTimeAsync(20)).resolves.not.toThrow()
    expect(media.plays).toBe(1)
  })
})
```

Append to `src/shared/api/audio/fake-audio.test.ts`:

```ts
describe('the fake’s recordings', () => {
  it('records what it loads and each play of a recording', () => {
    const audio = createFakeAudio()
    audio.loadRecording('vocal.m4a')
    audio.playRecording('vocal.m4a', { at: 1, offset: 2, rate: 1, until: 9 })
    expect(audio.loadedRecordings).toEqual(['vocal.m4a'])
    expect(audio.recordings).toEqual([
      { src: 'vocal.m4a', play: { at: 1, offset: 2, rate: 1, until: 9 } },
    ])
  })
})
```

(import `describe`, `expect`, `it` and `createFakeAudio` as the file does.)

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/shared/api/audio`
Expected: FAIL (`./recording-player` missing; `loadRecording` not a function).

- [ ] **Step 3: The recording player**

Create `src/shared/api/audio/recording-player.ts`:

```ts
import type { RecordingPlay } from '@/shared/lib/schedule'

/** What the recording player needs of an audio element. */
export interface Media {
  currentTime: number
  playbackRate: number
  muted: boolean
  readonly paused: boolean
  play(): Promise<void>
  pause(): void
}

export interface RecordingPlayer {
  /** Makes the recording's element and routes it, so a play can start it at once. */
  load(src: string): void
  /** Queues a play; it starts when the clock reaches its `at`. */
  play(src: string, play: RecordingPlay): void
  /** Inside a gesture: plays each loaded recording muted and pauses it, so it may play later without one. */
  prime(): void
  /** Pauses every recording and forgets what is queued. */
  stop(): void
}

/** How often the player looks at the clock, and how far a recording may drift before it is sought back. */
const TICK_MS = 20
const DRIFT = 0.04

interface Queued extends RecordingPlay {
  readonly src: string
}

/**
 * Recordings kept on the audio clock: each queued play starts as the clock reaches it (sought to its
 * offset, at its rate), is sought back whenever it drifts, and is paused at its end unless another
 * play follows, which only seeks it.
 */
export function createRecordingPlayer({
  now,
  createMedia,
  route,
}: {
  now: () => number
  createMedia: (src: string) => Media
  /** Sends an element to the output (once), so it leaves with the notes. */
  route: (media: Media) => void
}): RecordingPlayer {
  const elements = new Map<string, Media>()
  let queue: readonly Queued[] = []
  let current: Queued | null = null
  let timer: ReturnType<typeof setInterval> | null = null

  const element = (src: string): Media => {
    const existing = elements.get(src)
    if (existing) return existing
    const made = createMedia(src)
    elements.set(src, made)
    route(made)
    return made
  }
  const start = (media: Media) => {
    if (media.paused) media.play().catch(() => undefined)
  }
  const expected = (play: Queued, time: number) => play.offset + (time - play.at) * play.rate

  const tick = () => {
    const time = now()
    const due = queue.filter((play) => play.at <= time)
    const next = due.at(-1)
    if (next) {
      queue = queue.filter((play) => play.at > time)
      const media = element(next.src)
      if (current && current.src !== next.src) element(current.src).pause()
      media.playbackRate = next.rate
      media.currentTime = expected(next, time)
      start(media)
      current = next
    } else if (current) {
      const media = element(current.src)
      if (time >= current.until) {
        media.pause()
        current = null
      } else if (Math.abs(media.currentTime - expected(current, time)) > DRIFT) {
        media.currentTime = expected(current, time)
      }
    }
    if (!current && queue.length === 0 && timer !== null) {
      clearInterval(timer)
      timer = null
    }
  }

  return {
    load: (src) => void element(src),
    play(src, play) {
      element(src)
      queue = [...queue, { ...play, src }].sort((a, b) => a.at - b.at)
      timer ??= setInterval(tick, TICK_MS)
    },
    prime() {
      for (const media of elements.values()) {
        if (!media.paused) continue
        media.muted = true
        media
          .play()
          .then(() => media.pause())
          .catch(() => undefined)
          .finally(() => {
            media.muted = false
          })
      }
    },
    stop() {
      queue = []
      current = null
      for (const media of elements.values()) media.pause()
      if (timer !== null) clearInterval(timer)
      timer = null
    },
  }
}
```

- [ ] **Step 4: The port, the adapter and the fake**

In `src/shared/api/audio/types.ts`, import `RecordingPlay` with `Sound` from `@/shared/lib/schedule`, and add to
`AudioOutput`:

```ts
  /** Readies a recording (fetched, routed to the output) so a Play can start it at once. */
  loadRecording(src: string): void
  /** Plays a recording from `play.offset` at `play.rate`, from `play.at` on the audio clock until `play.until`. */
  playRecording(src: string, play: RecordingPlay): void
```

and change the doc lines of `unlock()` and `stop()` to "On the first user gesture: browsers start audio suspended
until one; readies loaded recordings too." and "Silences what sounds, recordings too, and drops what is queued: every
play stops playing."

In `src/shared/api/audio/web-audio.ts`:

- import `createRecordingPlayer, type Media` from `./recording-player`;
- add an injectable `createMedia = (src: string): Media => new Audio(src)` to the adapter's options (its type
  `createMedia?: (src: string) => Media`);
- after `const keys = …`, build:

```ts
  const recordings = createRecordingPlayer({
    now,
    createMedia: (src) => {
      const media = createMedia(src)
      if (media instanceof HTMLMediaElement) media.preload = 'auto'
      return media
    },
    // Through the AudioContext, the recording leaves by the same output, with the same latency, as the notes.
    route: (media) => {
      const audio = openContext()
      if (audio && media instanceof HTMLMediaElement)
        audio.createMediaElementSource(media).connect(audio.destination)
    },
  })
```

- in `unlock()`, call `recordings.prime()` first (synchronously, inside the gesture), then resume the context;
- add `loadRecording: (src) => recordings.load(src)` and
  `playRecording(src, play) { openContext(); recordings.play(src, play) }`;
- in `stop()`, call `recordings.stop()` first.

In `src/shared/api/audio/fake-audio.ts`: extend `FakeAudio` with
`readonly loadedRecordings: readonly string[]` and
`readonly recordings: readonly { readonly src: string; readonly play: RecordingPlay }[]`, keep arrays, implement
`loadRecording(src) { loadedRecordings.push(src) }`, `playRecording(src, play) { recordings.push({ src, play }) }`,
and the two getters.

In `src/shared/api/audio/index.ts` add `export { createRecordingPlayer, type Media, type RecordingPlayer } from
'./recording-player'`.

- [ ] **Step 5: Run the port's tests, typecheck, lint**

Run: `npx vitest run src/shared/api/audio && npm run typecheck && npm run lint`
Expected: PASS. (`web-audio.test.ts` injects `createContext`; any fake context there gains no media calls unless a
recording plays.)

- [ ] **Step 6: Format, commit**

```bash
npx prettier --write src/shared/api/audio
git add src/shared/api/audio
git commit -m "$(printf 'Play a recording on the audio clock: started at its time, kept from drifting, primed on the Play tap\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>')"
```

---

### Task 3: The transport plays the recording with every pass

**Files:**

- Create: `src/features/practice/transport.test.ts`
- Modify: `src/features/practice/transport.ts`, `src/features/practice/use-practice.ts`,
  `src/widgets/practice-player/model/use-practice-player.ts`

**Interfaces:**

- Consumes: Task 1's `Recording`, `recordingPlay`; Task 2's `loadRecording`, `playRecording`.
- Produces: `startTransport(audio, performance, options, on, recording: Recording | null)`;
  `PracticeSetup.recording: Recording | null`; `usePracticePlayer(performance, view, setView, ownTempo, recording?:
  Recording | null)`.

- [ ] **Step 1: Write the failing test**

Create `src/features/practice/transport.test.ts`:

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createFakeAudio } from '@/shared/api/audio'
import { arrange, parseFigure } from '@/shared/lib/arrangement'
import { note, parseChordSymbol } from '@/shared/lib/music'
import { audibleHands } from '@/shared/lib/schedule'
import { startTransport } from './transport'

const BLOCK = {
  id: 'block',
  rh: { kind: 'events', events: parseFigure('0/16 C') },
  lh: { kind: 'events', events: parseFigure('0/16 L1') },
} as const
const performance = arrange(
  {
    key: { tonic: note('C'), minor: false },
    meter: '4/4',
    sections: [
      {
        lines: [
          ['C', 'F', 'G', 'C'].map((symbol) => ({
            chords: [{ ...parseChordSymbol(symbol), beats: 4 }],
            beats: 4,
          })),
        ],
      },
    ],
  },
  { tonic: note('C'), pattern: BLOCK },
)
const VOCAL = { src: 'vocal.m4a', start: 2, tempo: 60 }

describe('startTransport', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('plays the recording with every pass, each from the passage’s first bar', async () => {
    const audio = createFakeAudio()
    const stop = startTransport(
      audio,
      performance,
      { hands: audibleHands('both'), tempo: 60, range: { from: 48, to: 144 }, fromTick: 96 },
      { reach: () => {}, tempo: () => {} },
      VOCAL,
    )
    // The first pass from the cursor (bar 3: 8 seconds in), the second from the loop's first bar (bar 2).
    expect(audio.recordings.map(({ play }) => play.offset)).toEqual([10])
    audio.setNow(4)
    await vi.advanceTimersByTimeAsync(30)
    expect(audio.recordings.map(({ play }) => play.offset)).toEqual([10, 6])
    expect(audio.recordings.every(({ src, play }) => src === 'vocal.m4a' && play.rate === 1)).toBe(
      true,
    )
    stop()
  })

  it('plays none without a recording', () => {
    const audio = createFakeAudio()
    startTransport(
      audio,
      performance,
      { hands: audibleHands('both'), tempo: 60, range: { from: 0, to: 192 }, fromTick: 0 },
      { reach: () => {}, tempo: () => {} },
      null,
    )()
    expect(audio.recordings).toEqual([])
  })
})
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx vitest run src/features/practice/transport.test.ts`
Expected: FAIL (no recording played).

- [ ] **Step 3: Implement**

In `src/features/practice/transport.ts`: import `recordingPlay, type Recording` from `@/shared/lib/schedule`; add the
parameter `recording: Recording | null` after `on` (doc: "and the piece's recording with every pass, when it plays
one"); and replace `play`:

```ts
  const play = (pass: Pass) => {
    audio.play(pass.sounds, pass.start)
    if (recording) audio.playRecording(recording.src, recordingPlay(recording, pass))
  }
```

In `src/features/practice/use-practice.ts`: import `type Recording` from `@/shared/lib/schedule`; add to
`PracticeSetup`:

```ts
  /** The piece's recording, played along in Listen; null plays none. */
  readonly recording: Recording | null
```

destructure `recording` with the other setup fields, pass it as `startTransport`'s last argument, add it to that
effect's dependencies, and add after the MIDI effect:

```ts
  // Loaded while the Player is open, so the first Play starts it at once and the tap primes it.
  useEffect(() => {
    if (recording) audio.loadRecording(recording.src)
  }, [audio, recording])
```

In `src/widgets/practice-player/model/use-practice-player.ts`: import `type Recording` from `@/shared/lib/schedule`
(with `audibleHands, type Hands`); add the parameter `recording: Recording | null = null` after `ownTempo` (doc line
in the hook's comment: "a piece's recording plays along in Listen"), and pass `recording` into `usePractice`'s setup.

- [ ] **Step 4: Run the practice and player tests**

Run: `npx vitest run src/features/practice src/widgets/practice-player src/pages/player && npm run typecheck`
Expected: PASS.

- [ ] **Step 5: Format, commit**

```bash
npx prettier --write src/features/practice/transport.ts src/features/practice/transport.test.ts src/features/practice/use-practice.ts src/widgets/practice-player/model/use-practice-player.ts
git add src/features/practice src/widgets/practice-player
git commit -m "$(printf 'Play a piece'"'"'s recording with every pass of Listen, from each pass'"'"'s first bar\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>')"
```

---

### Task 4: The Recording switch is saved, on by default

**Files:**

- Modify: `src/entities/settings/model/types.ts`, `src/entities/settings/model/store.ts`
- Test: `src/entities/settings/model/store.test.ts`

**Interfaces:**

- Produces: `PracticeToggle` gains `'recording'`; `DEFAULT_PRACTICE.recording === true`; `SETTINGS_VERSION === 4`.

- [ ] **Step 1: Write the failing tests**

In `src/entities/settings/model/store.test.ts`:

- in `'starts on the system theme…'`, the expected `DEFAULT_PRACTICE` gains `recording: true`;
- in `'saves under pt-settings with its version'`, `version: 3` becomes `version: 4`;
- in `'restores what was saved'`, the saved `practice` gains `recording: false`, and `restored(saved, 3)` becomes
  `restored(saved, 4)`;
- append:

```ts
  it('gives a version-3 save the recording on, keeping its toggles', () => {
    const practice = { fingerNumbers: true, melody: true, metronome: false, countIn: true }
    expect(restored({ theme: 'dark', locale: 'en', practice }, 3).practice).toEqual({
      ...practice,
      recording: true,
    })
  })
```

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/entities/settings`
Expected: FAIL (no `recording`, version 3).

- [ ] **Step 3: Implement**

In `src/entities/settings/model/types.ts`:

```ts
export const PRACTICE_TOGGLES = ['fingerNumbers', 'melody', 'metronome', 'countIn', 'recording'] as const
```

update the `PLAYING_TOGGLES` doc to "(the melody and the recording are a piece's own: its setup shows them)", and
`DEFAULT_PRACTICE` gains `recording: true`.

In `src/entities/settings/model/store.ts`: `SETTINGS_VERSION = 4`; replace `practiceToggles`:

```ts
/** A toggle keeps what was saved; one never saved (a newer toggle) takes its default. */
function practiceToggles(value: unknown): PracticeToggles {
  const saved = savedObject<PracticeToggles>(value)
  return Object.fromEntries(
    PRACTICE_TOGGLES.map((toggle) => {
      const kept = saved[toggle]
      return [toggle, typeof kept === 'boolean' ? kept : DEFAULT_PRACTICE[toggle]]
    }),
  ) as Record<keyof PracticeToggles, boolean>
}
```

(the `as Record<…>` is the existing line's, kept: `Object.fromEntries` loses the key type), and the sanitiser's doc
gains "a version-3 save no recording toggle".

- [ ] **Step 4: Run the settings tests and everything that reads settings**

Run: `npx vitest run src/entities/settings src/app src/widgets/player-setup && npm run typecheck`
Expected: PASS.

- [ ] **Step 5: Format, commit**

```bash
npx prettier --write src/entities/settings/model/types.ts src/entities/settings/model/store.ts src/entities/settings/model/store.test.ts
git add src/entities/settings
git commit -m "$(printf 'Save a Recording switch, on by default; a toggle never saved takes its default (settings version 4)\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>')"
```

---

### Task 5: «Ромашковые поля» carries its vocal recording

**Files:**

- Create: `src/entities/piece/content/progressions/romashki-vocal.m4a` (converted from the owner's mp3)
- Modify: `src/entities/piece/model/types.ts`, `src/entities/piece/content/progressions/romashki.ts`,
  `src/entities/piece/index.ts` (if `Recording` is re-exported), `vite.config.ts`
- Test: `src/entities/piece/content/catalog.test.ts`

**Interfaces:**

- Consumes: Task 1's `Recording`.
- Produces: `PieceCommon.recording?: Recording`; `pieceById('romashki').recording` = `{ src, start, tempo: 72 }`.

- [ ] **Step 1: Convert the file and measure bar 1**

```bash
afconvert -f m4af -d aac -b 128000 "/Users/kristianbraila/Downloads/Ромашковые поля (вокал).mp3" src/entities/piece/content/progressions/romashki-vocal.m4a
afinfo src/entities/piece/content/progressions/romashki-vocal.m4a | grep -E "duration|bit rate"
```

Expected: about 66.4 s, 128 kbps, about 1.1 MB. Then measure bar 1 in the scratchpad (not the repo): decode to 11 kHz
mono WAV with `afconvert -f WAVE -d LEI16@11025 -c 1`, and fit a beat grid at 72 BPM to the onset strength (the
positive log-energy difference, 64-sample hops) over the phases 0–0.83 s; bar 1 is the grid beat at or after the
first sound (2.74 s) such that bar 11 lands at the chorus's loudness rise (34–38 s). Write that second as `start`,
to two decimals. If the fit is ambiguous, use 2.74 (the first sound) and say so to the owner.

- [ ] **Step 2: Write the failing test**

In `src/entities/piece/content/catalog.test.ts`, import `TEMPO_RANGE` from `@/shared/lib/schedule`, and append
inside the catalog's `describe`:

```ts
  it('times every recording: bar 1 in the file, a steady tempo the Player can play', () => {
    const recorded = PIECES.flatMap((piece) => (piece.recording ? [piece] : []))
    expect(recorded.map((piece) => piece.id)).toEqual(['romashki'])
    for (const { recording } of recorded) {
      expect(recording?.start).toBeGreaterThanOrEqual(0)
      expect(recording?.tempo).toBeGreaterThanOrEqual(TEMPO_RANGE.min)
      expect(recording?.tempo).toBeLessThanOrEqual(TEMPO_RANGE.max)
      expect(recording?.src).toMatch(/romashki-vocal.*\.m4a$/)
    }
  })
```

Run: `npx vitest run src/entities/piece/content/catalog.test.ts -t "recording"` — Expected: FAIL.

- [ ] **Step 3: Implement**

In `src/entities/piece/model/types.ts`: `import type { Recording } from '@/shared/lib/schedule'`, and in `PieceCommon`:

```ts
  /** A performance of the piece that plays along in Listen: in its own key and form. */
  readonly recording?: Recording
```

In `src/entities/piece/content/progressions/romashki.ts`: `import vocal from './romashki-vocal.m4a?url'` and add
`recording: { src: vocal, start: <measured>, tempo: 72 },` after `chordSize`.

In `vite.config.ts`, Workbox's `globPatterns` becomes `['**/*.{js,css,html,svg,png,ico,woff2,m4a}']`, with a comment
line above it: "The pieces' recordings too, so a recording plays offline."

- [ ] **Step 4: Run the content's tests and build**

Run: `npx vitest run src/entities/piece src/entities/path && npm run typecheck && npm run build`
Expected: PASS; the build's precache count rises by one and `dist/assets/romashki-vocal-*.m4a` exists
(`ls dist/assets | grep m4a`).

- [ ] **Step 5: Format, commit**

```bash
npx prettier --write src/entities/piece/model/types.ts src/entities/piece/content/progressions/romashki.ts src/entities/piece/content/catalog.test.ts vite.config.ts
git add src/entities/piece vite.config.ts
git commit -m "$(printf 'Give «Ромашковые поля» its vocal recording, timed to bar 1 at 72 and precached\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>')"
```

---

### Task 6: The Player plays it: Listen, the own key, the switch

**Files:**

- Create: `src/widgets/player-setup/ui/RecordingSwitch.tsx`
- Modify: `src/widgets/player-setup/index.ts`, `src/pages/player/model/use-player.ts`,
  `src/pages/player/ui/PieceSetup.tsx`, `src/shared/i18n/locales/{en,ru}/player.ts`
- Test: `src/pages/player/ui/PlayerPage.test.tsx`

**Interfaces:**

- Consumes: Tasks 3–5.
- Produces: `RecordingSwitch({ ownKey: string | null })` (null in the piece's own key; else the key's name for the
  note).

- [ ] **Step 1: Write the failing tests**

Append inside `describe('Player', …)` in `src/pages/player/ui/PlayerPage.test.tsx`:

```tsx
  it('plays «Ромашковые поля»’s recording along in Listen, from bar 1 at its own rate', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/romashki')
    expect(audio.loadedRecordings).toHaveLength(1)
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    const [first] = audio.recordings
    expect(first?.play.rate).toBe(1)
    expect(first?.play.offset).toBe(pieceById('romashki')?.recording?.start)
  })

  it('plays the recording at half speed at 50%', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/romashki?tempo=36')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect(audio.recordings[0]?.play.rate).toBe(0.5)
  })

  it('plays no recording in another key, and says why in the Setup', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/romashki?key=E')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect(audio.recordings).toEqual([])
    await user.click(screen.getByRole('button', { name: 'Setup' }))
    expect(await screen.findByRole('switch', { name: /Recording/ })).toBeDisabled()
    expect(screen.getByText('Only in D minor')).toBeInTheDocument()
  })

  it('plays no recording with the switch off, and saves the switch', async () => {
    const user = userEvent.setup()
    const { audio, settingsStore } = await renderApp('/play/romashki')
    await user.click(await screen.findByRole('button', { name: 'Setup' }))
    await user.click(await screen.findByRole('switch', { name: /Recording/ }))
    expect(settingsStore.getState().practice.recording).toBe(false)
    await user.keyboard('{Escape}')
    await user.click(screen.getByRole('button', { name: 'Play' }))
    expect(audio.recordings).toEqual([])
  })
```

(add `pieceById` to the `@/entities/piece` import.) And in a separate `it`, Wait mode:

```tsx
  it('plays no recording in Wait mode', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/romashki?mode=wait')
    await user.click(await screen.findByRole('button', { name: 'Play' }))
    expect(audio.recordings).toEqual([])
  })
```

- [ ] **Step 2: Run them to see them fail**

Run: `npx vitest run src/pages/player/ui/PlayerPage.test.tsx -t "recording"`
Expected: FAIL (nothing loaded or played; no switch).

- [ ] **Step 3: Implement**

`src/shared/i18n/locales/en/player.ts`: in `toggles` add `recording: 'Recording',`; at top level add
`ownKeyOnly: 'Only in {{key}}',`. `ru/player.ts`: `recording: 'Запись',` and `ownKeyOnly: 'Только в тональности
{{key}}',`.

Create `src/widgets/player-setup/ui/RecordingSwitch.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { selectPractice, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setPracticeToggle } from '@/features/set-preference'
import { Switch } from '@/shared/ui/primitives/switch'

/**
 * The recording switch: a piece's recording played along in Listen, saved for every piece with one.
 * In another key it is off, and says in which key it plays.
 */
export function RecordingSwitch({ ownKey }: { ownKey: string | null }) {
  const { t } = useTranslation('player')
  const settings = useSettingsStoreApi()
  const { recording } = useSettings(selectPractice)
  return (
    <label className="flex min-h-14 items-center justify-between gap-3 border-b border-border text-lg">
      <span className="flex flex-col">
        {t('toggles.recording')}
        {ownKey ? (
          <span className="text-sm text-muted-foreground">{t('ownKeyOnly', { key: ownKey })}</span>
        ) : null}
      </span>
      <Switch
        checked={recording && ownKey === null}
        disabled={ownKey !== null}
        onCheckedChange={(on) => setPracticeToggle(settings, 'recording', on)}
      />
    </label>
  )
}
```

Export it from `src/widgets/player-setup/index.ts` (`export { RecordingSwitch } from './ui/RecordingSwitch'`).

In `src/pages/player/model/use-player.ts`:

```ts
  const { melody, recording: withRecording } = useSettings(selectPractice)
  …
  const inOwnKey = pitchClassOf(choice.tonic) === pitchClassOf(pieceKey(piece).tonic)
  const recording = piece.recording && withRecording && inOwnKey ? piece.recording : null
  const player = usePracticePlayer(performance, search, setSearch, piece.tempo, recording)
```

(imports: `pieceKey` from `@/entities/piece`, `pitchClassOf` from `@/shared/lib/music`.) Wait mode needs no rule
here: only Listen's transport plays a recording.

In `src/pages/player/ui/PieceSetup.tsx`, add `RecordingSwitch` to the widget import and, after the melody switch:

```tsx
      {piece.recording ? (
        <RecordingSwitch
          ownKey={
            pitchClassOf(choice.tonic) === pitchClassOf(pieceKey(piece).tonic)
              ? null
              : t(minor ? 'keyOf.minor' : 'keyOf.major', {
                  tonic: noteName(pieceKey(piece).tonic),
                })
          }
        />
      ) : null}
```

(import `pitchClassOf` with the other `@/shared/lib/music` names; `minor` is already `pieceKey(piece).minor`.)

- [ ] **Step 4: Run the Player's tests**

Run: `npx vitest run src/pages/player src/widgets/player-setup && npm run typecheck && npm run lint`
Expected: PASS.

- [ ] **Step 5: Format, commit**

```bash
npx prettier --write src/widgets/player-setup/ui/RecordingSwitch.tsx src/widgets/player-setup/index.ts src/pages/player/model/use-player.ts src/pages/player/ui/PieceSetup.tsx src/pages/player/ui/PlayerPage.test.tsx src/shared/i18n/locales/en/player.ts src/shared/i18n/locales/ru/player.ts
git add src
git commit -m "$(printf 'Play a piece'"'"'s recording along in Listen, in its own key, with a saved Recording switch in the Setup\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>')"
```

---

### Task 7: Record it

**Files:**

- Create: `docs/adr/0016-a-piece-may-carry-a-recording-that-plays-along.md`
- Modify: `docs/UBIQUITOUS_LANGUAGE.md`, `docs/CONTENT.md`, `DESIGN.md`,
  `docs/superpowers/specs/2026-09-25-next-features-roadmap-design.md`, `CLAUDE.md`

- [ ] **Step 1: Write the records**

- **ADR 0016** (Status accepted, 2026-09-29; Amends the roadmap's §5 on audio players): Context (the owner's mp3 and
  words; the roadmap's refusal was of players needing a network or an account); Decision (a piece's `recording`
  shipped and precached as AAC; played along in Listen only, in the piece's own key, at any tempo with pitch kept,
  from each pass's first bar; audio elements behind the port, routed through the AudioContext, kept on the clock by a
  20 ms timer and a 40 ms drift bound, primed on the Play tap; a saved Recording switch, on by default, settings
  version 4); Decided against (loading recordings from the device: the owner chose to ship it; decoding to an
  AudioBuffer: exact, but it cannot keep pitch at other tempos; a recording in Wait mode or another key; YouTube and
  streamed audio, still out); Consequences (more pieces may carry a recording; each needs its `start` measured).
- **Glossary** (Practice table, after **Loop**): `| **Recording** | A performance shipped with a piece (a singer's),
  played along in Listen in the piece's own key, at any tempo with its pitch kept, from each pass's first bar
  («Запись») | track, audio (and not "record from a MIDI keyboard", which writes a score) |`
- **CONTENT.md**, after "The melody": a "## The recording" section: the field `recording: { src, start, tempo }`; the
  file beside the piece's file, AAC `.m4a` at 128 kbps (`afconvert -f m4af -d aac -b 128000 …`), imported with
  `?url`; `start` is the second bar 1 begins (measure the first sound and fit the beat grid, then check by ear);
  `tempo` its steady tempo; its form must be the chart's (write a repeat out).
- **DESIGN.md**, the Setup's list: "Recording (a piece with one): a switch, on by default; in another key disabled,
  with 'Only in D minor' under it."
- **The roadmap:** the Status bullet gains "Revised 2026-09-29: a piece may carry a recording that plays along (ADR
  0016)"; §5's "Not for this app" line: "audio and YouTube players" → "YouTube and streamed audio players (a
  recording shipped with a piece plays along: ADR 0016)"; §7 gains the owner's words (the spec's §1).
- **CLAUDE.md:** the `api` bullet: "the audio port knows which keys it is sounding and whether a play still sounds"
  gains "; it plays a piece's recording on the audio clock (`loadRecording`, `playRecording`)"; `player-setup` lists
  `RecordingSwitch` beside `MelodySwitch`; `settings` "version 3" → "version 4"; `schedule` gains "a recording under
  a pass (`recordingPlay`)".

- [ ] **Step 2: Verify everything**

Run: `npm run typecheck && npm run lint && npm run test && npm run build`
Expected: all pass; `npm run test:cov` keeps 90% lines on `src/shared/lib/**` and `src/entities/*/model/**`.

- [ ] **Step 3: Format, commit**

```bash
npx prettier --write docs/adr/0016-a-piece-may-carry-a-recording-that-plays-along.md docs/UBIQUITOUS_LANGUAGE.md docs/CONTENT.md DESIGN.md docs/superpowers/specs/2026-09-25-next-features-roadmap-design.md CLAUDE.md
git add docs DESIGN.md CLAUDE.md
git commit -m "$(printf 'Record a piece'"'"'s recording played along: ADR 0016, the glossary, CONTENT, DESIGN, the roadmap and CLAUDE.md\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>')"
```
