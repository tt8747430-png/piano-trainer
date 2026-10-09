import { describe, expect, it } from 'vitest'
import { gainVelocity, TOUCHES, touchVelocity, velocityGain } from './velocity'

describe('velocityGain', () => {
  it('sounds the hardest strike loudest, and softer as the square of the velocity', () => {
    expect(velocityGain(127)).toBe(0.3)
    expect(velocityGain(100)).toBeCloseTo(0.186, 3)
  })
})

describe('touchVelocity', () => {
  it('hears a velocity as struck under the Normal touch', () => {
    expect(touchVelocity(64, 'normal')).toBe(64)
  })

  it('raises a soft velocity under Light and lowers it under Heavy', () => {
    expect(touchVelocity(32, 'light')).toBeGreaterThan(32)
    expect(touchVelocity(32, 'heavy')).toBeLessThan(32)
  })

  it('keeps the softest and the hardest strike under every touch', () => {
    for (const touch of TOUCHES) {
      expect(touchVelocity(1, touch)).toBe(1)
      expect(touchVelocity(127, touch)).toBe(127)
    }
  })
})

describe('gainVelocity', () => {
  it('turns a gain back into the velocity it was struck at', () => {
    expect(gainVelocity(velocityGain(90))).toBe(90)
  })

  it('reads a gain over the loudest as the hardest strike', () => {
    expect(gainVelocity(1)).toBe(127)
  })
})
