import { describe, expect, it } from 'vitest'
import { midi } from '@/shared/lib/music'
import { BLACK_FRONT, blackTop, handIn, KEY, keyPlace, keyTop, whiteTop } from './keys'

describe('the keys (R36)', () => {
  it('places each key along the keyboard in white keys from middle C, a black key over its gap', () => {
    expect(keyPlace(midi(60))).toBe(0)
    expect(keyPlace(midi(61))).toBe(0.5)
    expect(keyPlace(midi(64))).toBe(2)
    expect(keyPlace(midi(65))).toBe(3)
    expect(keyPlace(midi(72))).toBe(7)
    expect(keyPlace(midi(59))).toBe(-1)
    expect(keyPlace(midi(21))).toBe(-23)
    expect(keyPlace(midi(108))).toBe(28)
  })

  it('sinks a pressed key by its dip at the front edge, not at all at its back end', () => {
    expect(whiteTop(0, 0)).toBeCloseTo(0, 9)
    expect(whiteTop(0, 1)).toBeCloseTo(-KEY.dip, 9)
    expect(whiteTop(-KEY.length, 1)).toBeCloseTo(0, 9)
    expect(blackTop(BLACK_FRONT, 0)).toBeCloseTo(KEY.blackHeight, 9)
    expect(blackTop(BLACK_FRONT, 1)).toBeLessThan(KEY.blackHeight)
    expect(keyTop(midi(61), BLACK_FRONT, 0)).toBe(blackTop(BLACK_FRONT, 0))
    expect(keyTop(midi(60), 0, 0.5)).toBe(whiteTop(0, 0.5))
  })

  it('moves the hand in for the thumb and the 5th on a black key, the thumb furthest', () => {
    expect(handIn('thumb')).toBeCloseTo(-0.035, 9)
    expect(handIn('pinky')).toBeCloseTo(-0.013, 9)
    expect(handIn('index')).toBe(0)
    expect(handIn('middle')).toBe(0)
    expect(handIn('ring')).toBe(0)
  })
})
