import { describe, expect, it } from 'vitest'
import { CHROMATIC } from '@/features/practice'
import { note, noteParam } from '@/shared/lib/music'
import { chromaticChoice, chromaticPatch } from './chromatic-search'

const search = { chords: 'm9.n9', root: noteParam(note('G')), direction: 'both' } as const

describe('chromaticChoice', () => {
  it('reads the chords, and takes the walk’s own pattern where the URL chooses none', () => {
    expect(chromaticChoice(search)).toEqual({
      root: note('G'),
      chords: ['m9', 'n9'],
      direction: 'both',
      pattern: CHROMATIC.pattern,
      rh: null,
      lh: null,
    })
  })

  it('reads From the chart, and anything that needs a key, as the walk’s own', () => {
    expect(chromaticChoice({ ...search, pattern: 'chart' }).pattern).toBe(CHROMATIC.pattern)
    expect(chromaticChoice({ ...search, pattern: 'flow', rh: 'flow' })).toMatchObject({
      pattern: CHROMATIC.pattern,
      rh: null,
    })
    expect(chromaticChoice({ ...search, pattern: 'ballad', rh: 't1' })).toMatchObject({
      pattern: 'ballad',
      rh: 't1',
    })
  })
})

describe('chromaticPatch', () => {
  it('writes the walk’s own pattern as absent', () => {
    expect(chromaticPatch({ pattern: CHROMATIC.pattern })).toEqual({ pattern: undefined })
    expect(chromaticPatch({ rh: 't1' })).toEqual({ rh: 't1' })
  })
})
