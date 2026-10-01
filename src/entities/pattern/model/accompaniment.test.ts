import { describe, expect, it } from 'vitest'
import { LEFT_FIGURES, RIGHT_FIGURES } from '../content/figures'
import { PATTERNS } from '../content/patterns'
import { accompanimentOptions } from './accompaniment'
import { LEFT_FIGURE_IDS, RIGHT_FIGURE_IDS } from './types'

describe('accompanimentOptions', () => {
  it('plays the pattern alone when no hand has a figure of its own', () => {
    expect(accompanimentOptions({ pattern: 'block', rh: null, lh: null, inversion: null })).toEqual(
      {
        pattern: PATTERNS.block.pattern,
      },
    )
  })

  it('lays each hand’s own figure over the pattern', () => {
    const [rh] = RIGHT_FIGURE_IDS
    const [lh] = LEFT_FIGURE_IDS
    if (!rh || !lh) throw new Error('figures')
    expect(accompanimentOptions({ pattern: 'block', rh, lh, inversion: null })).toEqual({
      pattern: PATTERNS.block.pattern,
      rh: RIGHT_FIGURES[rh].figure,
      lh: LEFT_FIGURES[lh].figure,
    })
  })

  it('keeps the inversion asked for', () => {
    expect(accompanimentOptions({ pattern: 'block', rh: null, lh: null, inversion: 2 })).toEqual({
      pattern: PATTERNS.block.pattern,
      inversion: 2,
    })
  })
})
