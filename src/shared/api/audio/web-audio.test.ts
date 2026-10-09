import { describe, expect, it, vi } from 'vitest'
import { midi } from '@/shared/lib/music'
import type { Sound } from '@/shared/lib/schedule'
import { createWebAudioOutput, wholeFileMedia } from './web-audio'

/** Just enough of an AudioContext to see what the adapter builds. */
class FakeContext {
  currentTime = 0
  outputLatency = 0
  state: AudioContextState = 'suspended'
  readonly destination = {}
  readonly oscillators: { type: string; frequency: number; start: number; stop: number }[] = []
  readonly gains: { disconnected: boolean; targets: { value: number; at: number }[] }[] = []
  resume = vi.fn(async () => {
    this.state = 'running'
  })

  private param(targets: { value: number; at: number }[] = []) {
    return {
      value: 0,
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn(),
      cancelScheduledValues: vi.fn(),
      setTargetAtTime: vi.fn((value: number, at: number) => void targets.push({ value, at })),
    }
  }

  private node<T extends object>(extra: T) {
    const node = {
      ...extra,
      connect: (next: unknown) => next,
      disconnect: vi.fn(),
    }
    return node
  }

  createGain() {
    const record = { disconnected: false, targets: [] as { value: number; at: number }[] }
    this.gains.push(record)
    const gain = this.param(record.targets)
    const node = this.node({ gain })
    node.disconnect = vi.fn(() => {
      record.disconnected = true
    })
    return node
  }

  createBiquadFilter() {
    return this.node({ type: 'lowpass', frequency: this.param() })
  }

  createOscillator() {
    const record = { type: 'sine', frequency: 0, start: -1, stop: -1 }
    this.oscillators.push(record)
    // Built whole, not spread: a spread would drop the setters that record what is set.
    return {
      connect: (next: unknown) => next,
      disconnect: vi.fn(),
      set type(value: string) {
        record.type = value
      },
      frequency: {
        set value(hz: number) {
          record.frequency = hz
        },
      },
      start: (at: number) => {
        record.start = at
      },
      stop: (at: number) => {
        record.stop = at
      },
      onended: null as (() => void) | null,
    }
  }
}

const A4: Sound = { kind: 'note', midi: midi(69), at: 0.05, duration: 1, velocity: 0.2 }
const CLICK: Sound = { kind: 'click', at: 0, accent: true }

function setUp() {
  const context = new FakeContext()
  const createContext = vi.fn(() => context as unknown as AudioContext)
  const frames: (() => void)[] = []
  const frame = (look: () => void) => void frames.push(look)
  const page = { now: 0 }
  const audio = createWebAudioOutput({ createContext, frame, pageNow: () => page.now })
  return { context, createContext, frames, page, audio }
}

describe('createWebAudioOutput', () => {
  it('creates no audio context before it is needed', () => {
    const { createContext, audio } = setUp()
    expect(createContext).not.toHaveBeenCalled()
    expect(audio.now()).toBe(0)
  })

  it('plays a note as three oscillators from the sound’s time', () => {
    const { context, audio } = setUp()
    audio.play([A4], 0.125)
    expect(context.oscillators.map((o) => o.start)).toEqual([0.175, 0.175, 0.175])
    expect(context.oscillators.map((o) => o.type)).toEqual(['triangle', 'sine', 'sine'])
    expect(context.oscillators.map((o) => Math.round(o.frequency))).toEqual([440, 880, 1320])
  })

  it('leaves a sound beyond the lookahead for later', () => {
    const { context, audio } = setUp()
    audio.play([A4], 1)
    expect(context.oscillators).toHaveLength(0)
    audio.stop()
  })

  it('places a moment of the page’s clock on the audio clock, as what was heard then', () => {
    const { context, page, audio } = setUp()
    // No audio clock yet: the page's own, in seconds.
    expect(audio.audioTimeAt(2500)).toBe(2.5)
    audio.play([CLICK])
    context.currentTime = 10
    context.outputLatency = 0.05
    page.now = 20_000
    expect(audio.audioTimeAt(20_500)).toBeCloseTo(10.45)
    expect(audio.audioTimeAt(19_000)).toBeCloseTo(8.95)
  })

  it('plays a click as one oscillator', () => {
    const { context, audio } = setUp()
    audio.play([CLICK], 0)
    expect(context.oscillators).toHaveLength(1)
  })

  it('starts shortly after now when no time is given', () => {
    const { context, audio } = setUp()
    context.currentTime = 2
    audio.play([CLICK])
    expect(context.oscillators[0]?.start).toBeCloseTo(2.1)
  })

  it('resumes a suspended context on unlock', async () => {
    const { context, audio } = setUp()
    await audio.unlock()
    expect(context.resume).toHaveBeenCalledOnce()
    expect(context.state).toBe('running')
  })

  it('resumes a context iOS interrupted, on the next unlock, and leaves a running one alone', async () => {
    const { context, audio } = setUp()
    await audio.unlock()
    context.state = 'interrupted'
    await audio.unlock()
    await audio.unlock()
    expect(context.resume).toHaveBeenCalledTimes(2)
  })

  it('silences what sounds on stop, and stops its oscillators at once rather than at their end', () => {
    const { context, audio } = setUp()
    audio.play([A4, CLICK], 0)
    context.currentTime = 0.5
    audio.stop()
    // Each voice's output: the note's envelope and the click's gain.
    expect(context.gains.filter((g) => g.disconnected)).toHaveLength(2)
    expect(context.oscillators).toHaveLength(4)
    expect(context.oscillators.every((o) => o.stop === 0.5)).toBe(true)
  })

  it('follows the keys sounding on the audio clock, frame by frame', () => {
    const { context, frames, audio } = setUp()
    audio.onSounding(() => {})
    audio.play([A4], 0)
    context.currentTime = 0.1
    frames.shift()?.()
    expect([...audio.sounding()]).toEqual([69])
    audio.stop()
    expect(audio.sounding().size).toBe(0)
  })

  it('hands back a play that plays until it is stopped', () => {
    const { audio } = setUp()
    const play = audio.play([A4], 0)
    expect(audio.isPlaying(play)).toBe(true)
    audio.stop()
    expect(audio.isPlaying(play)).toBe(false)
  })

  it('does nothing, and throws nothing, where the browser has no audio', async () => {
    const createContext = vi.fn(() => null)
    const audio = createWebAudioOutput({ createContext })
    await expect(audio.unlock()).resolves.toBeUndefined()
    expect(() => audio.play([A4])).not.toThrow()
    expect(() => audio.stop()).not.toThrow()
    expect(audio.now()).toBe(0)
    expect(audio.sounding().size).toBe(0)
    expect(audio.isPlaying(audio.play([A4]))).toBe(false)
    expect(audio.struck().size).toBe(0)
    expect(createContext).toHaveBeenCalledOnce()
  })
})

describe('the live voice', () => {
  it('sounds a pressed key until it is let go: oscillators with no stop', () => {
    const { context, audio } = setUp()
    audio.press(midi(69), 100)
    expect(context.oscillators.map((o) => Math.round(o.frequency))).toEqual([440, 880, 1320])
    expect(context.oscillators.every((o) => o.stop === -1)).toBe(true)
  })

  it('lets a key go: its gain dies away and its oscillators stop soon after', () => {
    const { context, audio } = setUp()
    audio.press(midi(69), 100)
    context.currentTime = 2
    audio.release(midi(69))
    const envelope = context.gains.find((gain) => gain.targets.length > 0)
    expect(envelope?.targets.at(-1)).toEqual({ value: 0.0001, at: 2 })
    expect(context.oscillators.every((o) => o.stop === 2.25)).toBe(true)
  })

  it('keeps a pressed key sounding through a stop of the music', () => {
    const { context, audio } = setUp()
    audio.press(midi(69), 100)
    audio.stop()
    expect(context.oscillators.every((o) => o.stop === -1)).toBe(true)
    expect([...audio.sounding()]).toEqual([69])
  })

  it('holds a key let go under the sustain until it comes up', () => {
    const { context, audio } = setUp()
    audio.pedal('sustain', true)
    audio.press(midi(69), 100)
    audio.release(midi(69))
    expect(context.oscillators.every((o) => o.stop === -1)).toBe(true)
    audio.pedal('sustain', false)
    expect(context.oscillators.every((o) => o.stop === 0.25)).toBe(true)
    expect(audio.sounding().size).toBe(0)
  })
})

describe('a recording', () => {
  it('plays by its own element on the clock of what is heard: the notes’ clock less the output’s latency', async () => {
    vi.useFakeTimers()
    const context = new FakeContext()
    context.outputLatency = 0.1
    const media = {
      currentTime: 0,
      playbackRate: 1,
      muted: false,
      paused: true,
      seeking: false,
      play: vi.fn(async () => {
        media.paused = false
      }),
      pause: vi.fn(),
    }
    const audio = createWebAudioOutput({
      createContext: () => context as unknown as AudioContext,
      frame: () => undefined,
      createMedia: () => media,
    })
    audio.play([A4], 1)
    audio.playRecording('vocal.m4a', { at: 1, offset: 3.26, rate: 1, until: 60 })
    // The notes' clock has reached bar 1, but its first note is heard only 0.1 s later.
    context.currentTime = 1.05
    await vi.advanceTimersByTimeAsync(20)
    expect(media.play).not.toHaveBeenCalled()
    context.currentTime = 1.1
    await vi.advanceTimersByTimeAsync(20)
    expect(media.play).toHaveBeenCalledOnce()
    expect(media.currentTime).toBeCloseTo(3.26)
    vi.useRealTimers()
  })
})

describe('wholeFileMedia', () => {
  it('plays a recording from the whole file in memory, never streamed, so it can always seek', async () => {
    // Streamed, the element asks for byte ranges, and the service worker's precache answers with the
    // whole file: the element could not seek, and each seek landed back at 0 s.
    const fetchFile = vi.fn(async () => new Response('m4a'))
    vi.stubGlobal('fetch', fetchFile)
    // jsdom has no object URLs.
    vi.stubGlobal(
      'URL',
      class extends URL {
        static override createObjectURL = () => 'blob:vocal'
      },
    )
    const media = wholeFileMedia('/assets/vocal.m4a')
    expect(media.getAttribute('src')).toBeNull()
    await vi.waitFor(() => expect(media.src).toBe('blob:vocal'))
    expect(fetchFile).toHaveBeenCalledWith('/assets/vocal.m4a')
    expect(media.preload).toBe('auto')
  })
})
