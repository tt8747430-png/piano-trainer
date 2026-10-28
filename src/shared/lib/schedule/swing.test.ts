import { describe, expect, it } from 'vitest'
import { TICKS_PER_BEAT } from '@/shared/lib/music'
import { placement } from './schedule'
import { isSwung, SWING_FEELS, swingTick } from './swing'

const B = TICKS_PER_BEAT

describe('swingTick', () => {
  it('keeps the beats where they are, whatever the feel', () => {
    for (const feel of SWING_FEELS)
      expect([0, B, 2 * B].map((tick) => swingTick(tick, feel))).toEqual([0, B, 2 * B])
  })

  it('plays the off-beat 8th later the harder it swings: 3:2, 2:1 (triplets), 3:1', () => {
    expect(swingTick(0.5 * B, 'straight')).toBe(0.5 * B)
    expect(swingTick(0.5 * B, 'light')).toBeCloseTo((3 * B) / 5)
    expect(swingTick(0.5 * B, 'medium')).toBe((2 * B) / 3)
    expect(swingTick(0.5 * B, 'hard')).toBe(0.75 * B)
    expect(swingTick(1.5 * B, 'medium')).toBe((5 * B) / 3)
  })

  it('moves what lies between in proportion', () => {
    expect(swingTick(0.25 * B, 'medium')).toBe(B / 3)
    expect(swingTick(0.75 * B, 'medium')).toBe((5 * B) / 6)
  })

  it('leaves a note written on the triplet grid where it is: it is long-short already', () => {
    expect(
      [B / 3, (2 * B) / 3, (4 * B) / 3, (5 * B) / 3].map((tick) => swingTick(tick, 'hard')),
    ).toEqual([B / 3, (2 * B) / 3, (4 * B) / 3, (5 * B) / 3])
  })

  it('says straight is no swing', () => {
    expect(SWING_FEELS.filter(isSwung)).toEqual(['light', 'medium', 'hard'])
  })
})

describe('placement: swing marks (ADR 0097)', () => {
  const performance = (swing?: 'eighths' | 'sixteenths' | 'straight') => ({
    meter: '4/4' as const,
    bars: [{ startTick: 0, beats: 4, section: 0, line: 0 }],
    notes: [
      { startTick: 0, ...(swing ? { marks: { swing } } : {}) },
      { startTick: 2 * B, marks: { swing: 'straight' as const } },
    ],
  })

  it('swings the 8ths as triplets from a swing mark, straight again from a straight one', () => {
    const place = placement(performance('eighths') as never, undefined)
    expect(place(0.5 * B)).toBe((2 * B) / 3)
    expect(place(2.5 * B)).toBe(2.5 * B)
  })

  it('swings the 16ths in each half beat from a sixteenths mark', () => {
    const place = placement(performance('sixteenths') as never, undefined)
    expect(place(0.25 * B)).toBe(B / 3)
    expect(place(0.5 * B)).toBe(0.5 * B)
  })

  it('swings as the feel asked, and not at all with no mark and no feel', () => {
    expect(placement(performance('eighths') as never, 'hard')(0.5 * B)).toBe(0.75 * B)
    expect(placement(performance() as never, undefined)(0.5 * B)).toBe(0.5 * B)
  })
})
