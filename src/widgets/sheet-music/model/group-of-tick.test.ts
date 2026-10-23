import { describe, expect, it } from 'vitest'
import { TWO_BARS } from '@/features/practice/testing/performances'
import { groupOfTick } from './group-of-tick'

describe('groupOfTick', () => {
  it('is the beat group starting at a note’s tick', () => {
    expect(TWO_BARS.beatGroups.map((group) => group.tick).slice(4, 8)).toEqual([96, 120, 144, 168])
    expect(groupOfTick(TWO_BARS, 96)).toBe(4)
    expect(groupOfTick(TWO_BARS, 144)).toBe(6)
  })

  it('takes a note tied over a beat for the beat group it sounds in, not the next', () => {
    expect(groupOfTick(TWO_BARS, 130)).toBe(5)
  })

  it('has none before the first', () => {
    expect(groupOfTick({ ...TWO_BARS, beatGroups: TWO_BARS.beatGroups.slice(4) }, 0)).toBeNull()
  })
})
