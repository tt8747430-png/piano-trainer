import { describe, expect, it, vi } from 'vitest'
import { midi } from '@/shared/lib/music'
import type { Sound } from '@/shared/lib/schedule'
import { createWebAudioOutput } from './web-audio'

/** Just enough of an AudioContext to see what the adapter builds. */
class FakeContext {
  currentTime = 0
  state: AudioContextState = 'suspended'
  readonly destination = {}
  readonly oscillators: { type: string; frequency: number; start: number; stop: number }[] = []
  readonly gains: { disconnected: boolean; silenced: boolean }[] = []
  resume = vi.fn(async () => {
    this.state = 'running'
  })

  private param(set?: (value: number) => void) {
    return {
      value: 0,
      setValueAtTime: vi.fn(set),
      exponentialRampToValueAtTime: vi.fn(),
      cancelScheduledValues: vi.fn(),
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
    const record = { disconnected: false, silenced: false }
    this.gains.push(record)
    const gain = this.param()
    gain.cancelScheduledValues = vi.fn(() => {
      record.silenced = true
    })
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
  return { context, createContext, frames, audio: createWebAudioOutput({ createContext, frame }) }
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

  it('silences and lets go of what sounds on stop', () => {
    const { context, audio } = setUp()
    audio.play([A4, CLICK], 0)
    audio.stop()
    expect(context.gains.filter((g) => g.silenced || g.disconnected).length).toBeGreaterThan(0)
    const voices = context.gains.filter((g) => g.silenced)
    expect(voices.every((g) => g.disconnected)).toBe(true)
    expect(voices).toHaveLength(2)
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
