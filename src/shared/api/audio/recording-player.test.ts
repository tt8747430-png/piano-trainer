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

  it('starts a play when the clock reaches it, at its offset and rate, routing it then', async () => {
    const recordings = player()
    recordings.load('vocal.m4a')
    recordings.play('vocal.m4a', { at: 1, offset: 2.74, rate: 0.5, until: 20 })
    await vi.advanceTimersByTimeAsync(40)
    expect(media.plays).toBe(0)
    // Routed only once it plays: an AudioContext made before a gesture would start suspended.
    expect(routed).toBe(0)
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
