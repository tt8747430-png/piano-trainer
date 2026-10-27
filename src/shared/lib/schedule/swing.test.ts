import { describe, expect, it } from 'vitest'
import { isSwung, SWING_FEELS, swingTick } from './swing'

describe('swingTick', () => {
  it('keeps the beats where they are, whatever the feel', () => {
    for (const feel of SWING_FEELS)
      expect([0, 24, 48].map((tick) => swingTick(tick, feel))).toEqual([0, 24, 48])
  })

  it('plays the off-beat 8th later the harder it swings: 3:2, 2:1 (triplets), 3:1', () => {
    expect(swingTick(12, 'straight')).toBe(12)
    expect(swingTick(12, 'light')).toBeCloseTo(14.4)
    expect(swingTick(12, 'medium')).toBe(16)
    expect(swingTick(12, 'hard')).toBe(18)
    expect(swingTick(36, 'medium')).toBe(40)
  })

  it('moves what lies between in proportion', () => {
    expect(swingTick(6, 'medium')).toBe(8)
    expect(swingTick(18, 'medium')).toBe(20)
  })

  it('leaves a note written on the triplet grid where it is: it is long-short already', () => {
    expect([8, 16, 32, 40].map((tick) => swingTick(tick, 'hard'))).toEqual([8, 16, 32, 40])
  })

  it('says straight is no swing', () => {
    expect(SWING_FEELS.filter(isSwung)).toEqual(['light', 'medium', 'hard'])
  })
})
