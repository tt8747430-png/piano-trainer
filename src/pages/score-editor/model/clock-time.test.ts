import { describe, expect, it } from 'vitest'
import { clockTime } from './clock-time'

describe('clockTime', () => {
  it.each([
    [0, '0:00'],
    [999, '0:00'],
    [42_400, '0:42'],
    [61_000, '1:01'],
    [600_000, '10:00'],
  ])('writes %i ms as %s', (ms, text) => {
    expect(clockTime(ms)).toBe(text)
  })
})
