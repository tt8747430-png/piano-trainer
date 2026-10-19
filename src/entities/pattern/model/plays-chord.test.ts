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

  it('is true for a tune at a line’s ends whose figuration between plays the chord', () => {
    expect(playsChord(RIGHT_FIGURES.melE.figure)).toBe(true)
    expect(playsChord(BUILT_IN_PATTERNS.require('r6').pattern.rh)).toBe(true)
  })
})

describe('followsInversion', () => {
  it('follows From the chart where a pattern the chart plays plays the chord', () => {
    const fromChart = { pattern: 'chart', rh: null } as const
    expect(followsInversion(BUILT_IN_PATTERNS, fromChart, ['flow', 'block'])).toBe(true)
    expect(followsInversion(BUILT_IN_PATTERNS, fromChart, ['flow'])).toBe(false)
  })

  it('follows the right hand’s own figure first, then the pattern’s', () => {
    expect(followsInversion(BUILT_IN_PATTERNS, { pattern: 'block', rh: null })).toBe(true)
    expect(followsInversion(BUILT_IN_PATTERNS, { pattern: 'r6', rh: null })).toBe(true)
    expect(followsInversion(BUILT_IN_PATTERNS, { pattern: 'flow', rh: null })).toBe(false)
    expect(followsInversion(BUILT_IN_PATTERNS, { pattern: 'flow', rh: 'b1' })).toBe(true)
    expect(followsInversion(BUILT_IN_PATTERNS, { pattern: 'chart', rh: 'b1' })).toBe(true)
    expect(followsInversion(BUILT_IN_PATTERNS, { pattern: 'chart', rh: 'inv' })).toBe(false)
  })
})
