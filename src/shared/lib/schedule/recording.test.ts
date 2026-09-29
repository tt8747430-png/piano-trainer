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
