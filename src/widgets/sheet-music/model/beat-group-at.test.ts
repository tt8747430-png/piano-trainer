import { describe, expect, it } from 'vitest'
import { TWO_BARS } from '@/features/practice/testing/performances'
import { beatGroupAt } from './beat-group-at'

/** Bar 2's written onsets, each tick at 10px a tick; 130 the tied half of the note from 120. */
const onsets = [96, 120, 130, 144, 168].map((tick) => ({ tick, x: tick * 10 }))

describe('beatGroupAt', () => {
  it('finds the beat group of the written note nearest an x', () => {
    expect(TWO_BARS.beatGroups.map((group) => group.tick).slice(4, 8)).toEqual([96, 120, 144, 168])
    expect(beatGroupAt(TWO_BARS, 1, onsets, 965)).toBe(4)
    expect(beatGroupAt(TWO_BARS, 1, onsets, 1450)).toBe(6)
    expect(beatGroupAt(TWO_BARS, 1, onsets, 9999)).toBe(7)
  })

  it('takes a note tied over a beat for the beat group it sounds in, not the next', () => {
    expect(beatGroupAt(TWO_BARS, 1, onsets, 1340)).toBe(5)
  })

  it('takes the bar’s first beat group left of its first note', () => {
    expect(beatGroupAt(TWO_BARS, 1, onsets, 0)).toBe(4)
  })

  it('has none in a bar with no beat group', () => {
    expect(beatGroupAt(TWO_BARS, 9, onsets, 0)).toBeNull()
  })
})
