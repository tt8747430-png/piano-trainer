import { describe, expect, it } from 'vitest'
import { LEFT_FIGURES, RIGHT_FIGURES } from '../content/figures'
import { PATTERNS } from '../content/patterns'
import { BUILT_IN_PATTERNS } from './book'
import { figureNeed, patternNeed, playableFigure, playablePattern, type PatternFit } from './fit'
import { LEFT_FIGURE_IDS, PATTERN_IDS, RIGHT_FIGURE_IDS } from './types'

const EVERYTHING: PatternFit = { methodCodes: true, melody: true, key: true, simpleTime: true }
const NOTHING: PatternFit = { methodCodes: false, melody: false, key: false, simpleTime: false }

describe('figureNeed', () => {
  it('closes a figure that plays the tune to music without one', () => {
    expect(figureNeed(RIGHT_FIGURES.mel.figure, { ...EVERYTHING, melody: false })).toBe('melody')
    expect(figureNeed(RIGHT_FIGURES.mel.figure, EVERYTHING)).toBeNull()
  })

  it('closes the key’s triads to music without a key, and a figure inside the beat to 6/8', () => {
    expect(figureNeed(RIGHT_FIGURES.flow.figure, { ...EVERYTHING, key: false })).toBe('key')
    expect(figureNeed(LEFT_FIGURES.arp.figure, { ...EVERYTHING, simpleTime: false })).toBe(
      'simpleTime',
    )
    expect(figureNeed(LEFT_FIGURES.arp.figure, { ...EVERYTHING, key: false })).toBeNull()
  })
})

describe('patternNeed', () => {
  it('names the first need of either hand that the music lacks', () => {
    expect(patternNeed(PATTERNS.r6, NOTHING)).toBe('melody')
    expect(patternNeed(PATTERNS.r6, { ...NOTHING, melody: true })).toBe('simpleTime')
    expect(patternNeed(PATTERNS.flow, { ...EVERYTHING, key: false })).toBe('key')
    expect(patternNeed(PATTERNS.block, NOTHING)).toBeNull()
  })
})

describe('playablePattern', () => {
  it('takes a pattern the music can play, else the music’s own', () => {
    expect(playablePattern(BUILT_IN_PATTERNS, 'r6', 'block', EVERYTHING)).toBe('r6')
    expect(
      playablePattern(BUILT_IN_PATTERNS, 'r6', 'block', { ...EVERYTHING, melody: false }),
    ).toBe('block')
    expect(playablePattern(BUILT_IN_PATTERNS, undefined, 'ballad', EVERYTHING)).toBe('ballad')
  })

  it('plays From the chart only where it is the music’s own', () => {
    expect(playablePattern(BUILT_IN_PATTERNS, 'chart', 'chart', EVERYTHING)).toBe('chart')
    expect(playablePattern(BUILT_IN_PATTERNS, 'chart', 'block', EVERYTHING)).toBe('block')
  })
})

describe('playableFigure', () => {
  it('takes a figure the music can play, else the pattern’s own', () => {
    expect(playableFigure('mel', RIGHT_FIGURES, EVERYTHING)).toBe('mel')
    expect(playableFigure('mel', RIGHT_FIGURES, { ...EVERYTHING, melody: false })).toBeNull()
    expect(playableFigure(undefined, LEFT_FIGURES, EVERYTHING)).toBeNull()
  })
})

describe('what needs a key', () => {
  it('is the Chord flow alone: its right hand plays the key’s triads', () => {
    const keyless = { ...EVERYTHING, key: false }
    expect(PATTERN_IDS.filter((id) => patternNeed(PATTERNS[id], keyless))).toEqual(['flow'])
    expect(RIGHT_FIGURE_IDS.filter((id) => figureNeed(RIGHT_FIGURES[id].figure, keyless))).toEqual([
      'flow',
    ])
    expect(LEFT_FIGURE_IDS.filter((id) => figureNeed(LEFT_FIGURES[id].figure, keyless))).toEqual([])
  })
})
