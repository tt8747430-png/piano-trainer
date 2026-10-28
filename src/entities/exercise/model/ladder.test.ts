import { describe, expect, it } from 'vitest'
import { exerciseOf } from './selectors'
import { rungAbove, rungOf, TEMPO_LADDER, tempoKey } from './ladder'

describe('the tempo ladder', () => {
  it('climbs from 60 to 132 in steps of 12', () => {
    expect(TEMPO_LADDER).toEqual([60, 72, 84, 96, 108, 120, 132])
    expect(TEMPO_LADDER.slice(1).map((rung, i) => rung - (TEMPO_LADDER[i] ?? 0))).toEqual([
      12, 12, 12, 12, 12, 12,
    ])
  })

  it('names a tempo’s rung, and the rung above any tempo', () => {
    expect(rungOf(84)).toBe(84)
    expect(rungOf(90)).toBeNull()
    expect(rungAbove(60)).toBe(72)
    expect(rungAbove(90)).toBe(96)
    expect(rungAbove(132)).toBe(132)
  })

  it('keeps each Hanon exercise’s tempo apart, any other exercise’s by its id', () => {
    expect(tempoKey(exerciseOf('hanon'), { hanon: 5 })).toBe('hanon:5')
    expect(tempoKey(exerciseOf('scale'), { hanon: 5 })).toBe('scale')
  })
})
