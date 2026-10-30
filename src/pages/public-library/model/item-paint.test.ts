import { describe, expect, it } from 'vitest'
import { PAINT } from '@/shared/ui'
import { itemPaint } from './item-paint'

describe('itemPaint', () => {
  it('paints an item the same every time', () => {
    expect(itemPaint('public-7')).toBe(itemPaint('public-7'))
  })

  it('is one of the chrome’s paints', () => {
    for (const id of ['', 'a', 'public-1', 'ünïcode ♯']) expect(PAINT).toHaveProperty(itemPaint(id))
  })

  it('spreads a library’s items over the paints', () => {
    const ids = Array.from({ length: 20 }, (_, i) => `public-${i + 1}`)
    expect(new Set(ids.map(itemPaint)).size).toBeGreaterThanOrEqual(4)
  })
})
