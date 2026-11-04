import { describe, expect, it } from 'vitest'
import { note } from '@/shared/lib/music'
import { exerciseOf } from './selectors'
import { rungAbove, rungOf, TEMPO_LADDER, tempoKey } from './ladder'

describe('the tempo ladder', () => {
  it('climbs from 60 to 132 in steps of 12', () => {
    expect(TEMPO_LADDER).toEqual([60, 72, 84, 96, 108, 120, 132])
    expect(TEMPO_LADDER.slice(1).map((rung, i) => rung - (TEMPO_LADDER[i] ?? 0))).toEqual([
      12, 12, 12, 12, 12, 12,
    ])
  })

  it('names the rung a tempo has reached, and the rung above any tempo', () => {
    expect(rungOf(84)).toBe(84)
    expect(rungOf(90)).toBe(84)
    expect(rungOf(40)).toBe(60)
    expect(rungAbove(60)).toBe(72)
    expect(rungAbove(90)).toBe(96)
    expect(rungAbove(132)).toBe(132)
  })

  it('keeps each Hanon exercise’s tempo apart, any other exercise’s by its id, each key apart', () => {
    const inG = { hanon: 5, root: note('G'), tonality: 'major' } as const
    expect(tempoKey(exerciseOf('hanon'), inG)).toBe('hanon:5:G')
    expect(tempoKey(exerciseOf('scale'), inG)).toBe('scale:G')
    expect(
      tempoKey(exerciseOf('five-finger'), { ...inG, root: note('E', -1), tonality: 'minor' }),
    ).toBe('five-finger:Ebm')
    // A minor tonality is the key's only where the exercise is played in minor.
    expect(tempoKey(exerciseOf('scale'), { ...inG, tonality: 'minor' })).toBe('scale:G')
  })
})
