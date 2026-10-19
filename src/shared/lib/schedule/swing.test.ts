import { describe, expect, it } from 'vitest'
import { swingTick } from './swing'

describe('swingTick', () => {
  it('keeps the beats where they are', () => {
    expect([0, 24, 48].map(swingTick)).toEqual([0, 24, 48])
  })

  it('plays the off-beat 8th at two thirds of the beat', () => {
    expect(swingTick(12)).toBe(16)
    expect(swingTick(36)).toBe(40)
  })

  it('moves what lies between in proportion', () => {
    expect(swingTick(6)).toBe(8)
    expect(swingTick(18)).toBe(20)
  })

  it('leaves a note written on the triplet grid where it is: it is long-short already', () => {
    expect([8, 16, 32, 40].map(swingTick)).toEqual([8, 16, 32, 40])
  })
})
