import { describe, expect, it } from 'vitest'
import { RIGHT_FIGURES } from '../content/figures'
import { BUILT_IN_PATTERNS } from './book'
import { followsInversion, playsChord } from './plays-chord'

describe('playsChord', () => {
  it('is true for a right hand that plays the chord or its voices, false for its own shapes', () => {
    expect(playsChord(RIGHT_FIGURES.b1.figure)).toBe(true)
    expect(playsChord(RIGHT_FIGURES.jaz.figure)).toBe(true)
    expect(playsChord(RIGHT_FIGURES.inv.figure)).toBe(false)
    expect(playsChord(RIGHT_FIGURES.flow.figure)).toBe(false)
  })

  it('is false for a right hand that plays the tune', () => {
    expect(playsChord(BUILT_IN_PATTERNS.require('r5').pattern.rh)).toBe(false)
  })
})

describe('followsInversion', () => {
  it('follows the right hand’s own figure first, then the pattern’s; the chart’s plan may', () => {
    expect(followsInversion(BUILT_IN_PATTERNS, { pattern: 'block', rh: null })).toBe(true)
    expect(followsInversion(BUILT_IN_PATTERNS, { pattern: 'flow', rh: null })).toBe(false)
    expect(followsInversion(BUILT_IN_PATTERNS, { pattern: 'flow', rh: 'b1' })).toBe(true)
    expect(followsInversion(BUILT_IN_PATTERNS, { pattern: 'chart', rh: null })).toBe(true)
    expect(followsInversion(BUILT_IN_PATTERNS, { pattern: 'chart', rh: 'inv' })).toBe(false)
  })
})
