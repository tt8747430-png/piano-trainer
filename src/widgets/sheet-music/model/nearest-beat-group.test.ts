import { describe, expect, it } from 'vitest'
import { TWO_BARS } from '@/features/practice/testing/performances'
import { nearestBeatGroup } from './nearest-beat-group'

/** Each tick at its own x: 10px a tick. */
const xOf = (tick: number) => tick * 10

describe('nearestBeatGroup', () => {
  it('finds the bar’s beat group nearest an x', () => {
    expect(nearestBeatGroup(TWO_BARS, 1, xOf, 480)).toBe(4)
    expect(nearestBeatGroup(TWO_BARS, 1, xOf, 620)).toBe(5)
    expect(nearestBeatGroup(TWO_BARS, 1, xOf, 9999)).toBe(7)
  })

  it('has none in a bar with no beat group', () => {
    expect(nearestBeatGroup(TWO_BARS, 9, xOf, 0)).toBeNull()
  })
})
