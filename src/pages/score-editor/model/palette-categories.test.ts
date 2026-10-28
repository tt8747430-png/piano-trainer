import { describe, expect, it } from 'vitest'
import { categoryOpen, greyedBy, PALETTE_CATEGORIES } from './palette-categories'

describe('the palette’s categories', () => {
  it('holds every tool in one palette in Flat’s order, the fields’ keys among their kin (ADR 0096)', () => {
    expect(PALETTE_CATEGORIES).toEqual([
      'notes',
      'pitch',
      'articulations',
      'ornaments',
      'dynamics',
      'bar',
      'clef',
      'key',
      'time',
      'repeats',
      'text',
    ])
  })

  it('opens what works where the caret writes: every tool on a staff, a single one too (ADR 0097)', () => {
    const open = (layer: Parameters<typeof categoryOpen>[1]) =>
      PALETTE_CATEGORIES.filter((category) => categoryOpen(category, layer))
    // What acts on bars; the chord symbols are typed where a tap on the chord row opens them (ADR 0114).
    expect(open('chords')).toEqual(['bar', 'key', 'time', 'repeats'])
    expect(open('staff0')).toEqual(PALETTE_CATEGORIES)
    expect(open('lh')).toEqual(PALETTE_CATEGORIES)
  })

  it('says why a category is greyed where the caret writes, and nothing where it works', () => {
    const where = { chosen: true }
    expect(greyedBy('text', { ...where, layer: 'chords' })).toBe('staff')
    expect(greyedBy('pitch', { ...where, layer: 'chords' })).toBe('staff')
    expect(greyedBy('clef', { ...where, layer: 'chords' })).toBe('staff')
    expect(greyedBy('clef', { ...where, layer: 'staff1' })).toBeNull()
    expect(greyedBy('bar', { ...where, layer: 'chords' })).toBeNull()
  })

  it('greys the tools that change notes until a note is chosen', () => {
    const none = { chosen: false }
    for (const category of ['pitch', 'articulations', 'ornaments', 'dynamics', 'text'] as const)
      expect(greyedBy(category, { ...none, layer: 'rh' })).toBe('chooseNote')
    expect(greyedBy('notes', { ...none, layer: 'rh' })).toBeNull()
    expect(greyedBy('clef', { chosen: true, layer: 'lh' })).toBeNull()
  })
})
