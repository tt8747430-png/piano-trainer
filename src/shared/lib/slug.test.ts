import { describe, expect, it } from 'vitest'
import { slug } from './slug'

describe('slug', () => {
  it('writes a name as lower-case words joined by hyphens', () => {
    expect(slug('  The Blues Scale, in C! ')).toBe('the-blues-scale-in-c')
  })

  it('keeps letters of any script, dropping only the marks over Latin ones', () => {
    expect(slug('Café — Мой блюз')).toBe('cafe-мой-блюз')
  })

  it('numbers a slug already taken', () => {
    expect(slug('Scales', ['scales', 'scales-2'])).toBe('scales-3')
  })

  it('falls back to a name for a name of no letters', () => {
    expect(slug('!!!', [], 'item')).toBe('item')
    expect(slug('', ['item'], 'item')).toBe('item-2')
  })
})
