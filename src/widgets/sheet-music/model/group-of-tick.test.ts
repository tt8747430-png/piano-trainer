import { describe, expect, it } from 'vitest'
import { TICKS_PER_BEAT } from '@/shared/lib/music'
import { TWO_BARS } from '@/features/practice/testing/performances'
import { groupOfTick } from './group-of-tick'

const B = TICKS_PER_BEAT

describe('groupOfTick', () => {
  it('is the beat group starting at a note’s tick', () => {
    expect(TWO_BARS.beatGroups.map((group) => group.tick).slice(4, 8)).toEqual([
      4 * B,
      5 * B,
      6 * B,
      7 * B,
    ])
    expect(groupOfTick(TWO_BARS, 4 * B)).toBe(4)
    expect(groupOfTick(TWO_BARS, 6 * B)).toBe(6)
  })

  it('takes a note tied over a beat for the beat group it sounds in, not the next', () => {
    expect(groupOfTick(TWO_BARS, (65 * B) / 12)).toBe(5)
  })

  it('has none before the first', () => {
    expect(groupOfTick({ ...TWO_BARS, beatGroups: TWO_BARS.beatGroups.slice(4) }, 0)).toBeNull()
  })
})
