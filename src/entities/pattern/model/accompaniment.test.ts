import { describe, expect, it } from 'vitest'
import { LEFT_FIGURES, RIGHT_FIGURES } from '../content/figures'
import { accompanimentOptions } from './accompaniment'
import { BUILT_IN_PATTERNS } from './book'
import { LEFT_FIGURE_IDS, RIGHT_FIGURE_IDS } from './types'

describe('accompanimentOptions', () => {
  it('starts a pattern that follows the position in root position, each chord after nearest', () => {
    expect(
      accompanimentOptions(BUILT_IN_PATTERNS, {
        pattern: 'block',
        rh: null,
        lh: null,
        inversion: null,
        nearest: true,
      }),
    ).toEqual({
      pattern: BUILT_IN_PATTERNS.require('block').pattern,
      inversion: 0,
      nearest: true,
    })
  })

  it('lays each hand’s own figure over the pattern', () => {
    const [rh] = RIGHT_FIGURE_IDS
    const [lh] = LEFT_FIGURE_IDS
    if (!rh || !lh) throw new Error('figures')
    expect(
      accompanimentOptions(BUILT_IN_PATTERNS, {
        pattern: 'block',
        rh,
        lh,
        inversion: null,
        nearest: true,
      }),
    ).toMatchObject({
      pattern: BUILT_IN_PATTERNS.require('block').pattern,
      rh: RIGHT_FIGURES[rh].figure,
      lh: LEFT_FIGURES[lh].figure,
    })
  })

  it('keeps the position asked for, and every chord in it without Nearest', () => {
    expect(
      accompanimentOptions(BUILT_IN_PATTERNS, {
        pattern: 'block',
        rh: null,
        lh: null,
        inversion: 2,
        nearest: false,
      }),
    ).toEqual({
      pattern: BUILT_IN_PATTERNS.require('block').pattern,
      inversion: 2,
      nearest: false,
    })
  })

  it('plays no position under a pattern that plays its own shapes, as the faded field says', () => {
    expect(
      accompanimentOptions(BUILT_IN_PATTERNS, {
        pattern: 'flow',
        rh: null,
        lh: null,
        inversion: 2,
        nearest: true,
      }),
    ).toEqual({ pattern: BUILT_IN_PATTERNS.require('flow').pattern })
  })
})
