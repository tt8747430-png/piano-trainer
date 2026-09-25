import { describe, expect, it } from 'vitest'
import { needsMelody, patternsIn } from './selectors'

describe('needsMelody', () => {
  it('holds for a pattern whose right hand plays the tune, not for one of fixed figures', () => {
    expect(needsMelody('r6')).toBe(true)
    expect(needsMelody('r4')).toBe(false)
  })
})

describe('patternsIn', () => {
  it('lists a group’s patterns in catalog order', () => {
    expect(patternsIn('lesson-3')).toEqual(['M1', 'M2', 'M3', 'M4', 'M5'])
    expect(patternsIn('seven-types')).toEqual(['r1', 'r2', 'r3', 'r4', 'r4b', 'r5', 'r6', 'r7'])
  })

  it('gives the same array on every call, so a subscriber sees no change', () => {
    expect(patternsIn('genres')).toBe(patternsIn('genres'))
  })
})
