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

  it('plays from the pass’s first tick at the pass’s tempo', () => {
    // Four beats in at 72 is 3⅓ seconds into the recording; at 36 it plays at half speed.
    const play = recordingPlay(VOCAL, pass({ fromTick: 48, tempo: 36, end: 80 }))
    expect(play.at).toBe(100)
    expect(play.offset).toBeCloseTo(2.74 + 10 / 3)
    expect(play.rate).toBe(0.5)
    expect(play.until).toBe(180)
  })

  it('plays what leads into the pass during its count-in: the voice’s pickup', () => {
    // A bar's count-in at 72 is 3⅓ seconds: the recording starts that much earlier in the file.
    const play = recordingPlay({ ...VOCAL, start: 3.53 }, pass({ musicStart: 10 / 3 }))
    expect(play.at).toBe(100)
    expect(play.offset).toBeCloseTo(3.53 - 10 / 3)
  })

  it('never starts before the file does: a short lead-in waits in the count-in', () => {
    const play = recordingPlay({ ...VOCAL, start: 1 }, pass({ musicStart: 10 / 3 }))
    expect(play.at).toBeCloseTo(100 + 10 / 3 - 1)
    expect(play.offset).toBe(0)
  })
})
