import { describe, expect, it } from 'vitest'
import { swingTick } from './swing'

describe('swingTick', () => {
  it('keeps the beats where they are', () => {
    expect([0, 12, 24].map(swingTick)).toEqual([0, 12, 24])
  })

  it('plays the off-beat 8th at two thirds of the beat', () => {
    expect(swingTick(6)).toBe(8)
    expect(swingTick(18)).toBe(20)
  })

  it('moves what lies between in proportion', () => {
    expect(swingTick(3)).toBe(4)
    expect(swingTick(9)).toBe(10)
  })

  it('leaves a note written on the triplet grid where it is: it is long-short already', () => {
    expect([4, 8, 16, 20].map(swingTick)).toEqual([4, 8, 16, 20])
  })
})
