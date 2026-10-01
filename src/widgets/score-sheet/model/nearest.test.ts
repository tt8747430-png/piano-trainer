import { describe, expect, it } from 'vitest'
import { nearestPlace } from './nearest'

describe('nearestPlace', () => {
  it('is the place drawn nearest the point', () => {
    const xOf = (tick: number) => tick * 2
    expect(nearestPlace([0, 12, 24, 36], 30, xOf)).toBe(12)
    expect(nearestPlace([0, 12, 24, 36], 70, xOf)).toBe(36)
    expect(nearestPlace([], 70, xOf)).toBeUndefined()
  })
})
