import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { RecordingPlay } from '@/shared/lib/schedule'
import { createRecordingPlayer, type RecordingVoice } from './recording-player'

type Change = Parameters<RecordingVoice['play']>[0]

/** A voice the test reads: every play, pause and volume it was told. */
function fakeVoice() {
  const plays: Change[] = []
  const pauses: number[] = []
  const volumes: number[] = []
  return {
    plays,
    pauses,
    volumes,
    play: (change: Change) => void plays.push(change),
    pause: (output: number) => void pauses.push(output),
    volume: (level: number) => void volumes.push(level),
  }
}

const PLAY: RecordingPlay = { at: 10, offset: 2, rate: 1, until: 14, semitones: 0 }

describe('createRecordingPlayer', () => {
  let clock = 0
  beforeEach(() => {
    vi.useFakeTimers()
    clock = 0
  })
  afterEach(() => vi.useRealTimers())

  /** A player over `voices`, its clock moved by `advance`. */
  const player = (voices: Record<string, RecordingVoice | null>) => {
    const voiceFor = vi.fn(async (src: string) => voices[src] ?? null)
    const made = createRecordingPlayer({ now: () => clock, voiceFor })
    const advance = async (seconds: number) => {
      clock += seconds
      await vi.advanceTimersByTimeAsync(seconds * 1000)
    }
    return { made, voiceFor, advance }
  }

  it('schedules a play on its voice, at its time, offset, rate and shift', async () => {
    const voice = fakeVoice()
    const { made } = player({ a: voice })
    made.play('a', { ...PLAY, rate: 0.5, semitones: -3 })
    await vi.advanceTimersByTimeAsync(0)
    expect(voice.plays).toEqual([{ output: 10, input: 2, rate: 0.5, semitones: -3 }])
    expect(voice.volumes).toEqual([1])
  })

  it('makes each voice once, a load readying it before a play', async () => {
    const { made, voiceFor } = player({ a: fakeVoice() })
    made.load('a')
    made.play('a', PLAY)
    made.play('a', { ...PLAY, at: 14, offset: 6 })
    await vi.advanceTimersByTimeAsync(0)
    expect(voiceFor).toHaveBeenCalledTimes(1)
  })

  it('starts a play whose voice comes late from where it should be by then', async () => {
    const voice = fakeVoice()
    let ready: (each: RecordingVoice) => void = () => undefined
    const made = createRecordingPlayer({
      now: () => clock,
      voiceFor: () => new Promise((resolve) => (ready = resolve)),
    })
    made.play('a', { ...PLAY, rate: 0.5 })
    clock = 12
    ready(voice)
    await vi.advanceTimersByTimeAsync(0)
    expect(voice.plays).toEqual([{ output: 12, input: 3, rate: 0.5, semitones: 0 }])
  })

  it('falls silent at the latest play’s end, a following play taking over without a pause', async () => {
    const voice = fakeVoice()
    const { made, advance } = player({ a: voice })
    made.play('a', PLAY)
    made.play('a', { ...PLAY, at: 14, offset: 6, until: 18 })
    await advance(5)
    expect(voice.pauses).toEqual([])
    await advance(14)
    expect(voice.pauses).toEqual([18])
  })

  it('silences the last recording where another one takes over', async () => {
    const first = fakeVoice()
    const second = fakeVoice()
    const { made } = player({ a: first, b: second })
    made.play('a', PLAY)
    await vi.advanceTimersByTimeAsync(0)
    made.play('b', { ...PLAY, at: 14 })
    await vi.advanceTimersByTimeAsync(0)
    expect(first.pauses).toEqual([14])
    expect(second.plays).toHaveLength(1)
  })

  it('stops: silences every voice now and forgets what is queued', async () => {
    const voice = fakeVoice()
    const { made, advance } = player({ a: voice })
    made.play('a', PLAY)
    await advance(1)
    made.stop()
    expect(voice.pauses).toEqual([1])
    await advance(20)
    expect(voice.pauses).toEqual([1])
  })

  it('plays as loud as its volume says, from its start and as it changes (ADR 0105)', async () => {
    const voice = fakeVoice()
    const { made, advance } = player({ a: voice })
    let level = 0.4
    made.play('a', PLAY, () => level)
    await vi.advanceTimersByTimeAsync(0)
    expect(voice.volumes).toEqual([0.4])
    level = 2
    await advance(0.05)
    expect(voice.volumes.at(-1)).toBe(1)
  })

  it('stays silent where no voice can be made', async () => {
    const { made, advance } = player({})
    made.play('a', PLAY)
    await advance(10)
    made.stop()
  })
})
