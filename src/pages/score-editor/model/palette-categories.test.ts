import { describe, expect, it } from 'vitest'
import { categoryOpen, greyedBy, PALETTE_CATEGORIES } from './palette-categories'

describe('the palette’s categories', () => {
  it('holds every tool in one palette, Insert’s kinds among them, the fields’ keys among their kin (ADR 0096)', () => {
    expect(PALETTE_CATEGORIES).toEqual([
      'notes',
      'pitch',
      'articulations',
      'dynamics',
      'lines',
      'bar',
      'clef',
      'key',
      'time',
      'repeats',
      'text',
    ])
  })

  it('opens what works where the caret writes: the notes’ tools on a staff, a hand’s in a hand', () => {
    const open = (layer: Parameters<typeof categoryOpen>[1]) =>
      PALETTE_CATEGORIES.filter((category) => categoryOpen(category, layer))
    // Text & pedal's Chord symbol key opens its field from any row (ADR 0096).
    expect(open('chords')).toEqual(['bar', 'key', 'time', 'repeats', 'text'])
    expect(open('melody')).not.toContain('clef')
    expect(open('melody')).toContain('text')
    expect(open('lh')).toEqual(PALETTE_CATEGORIES)
  })

  it('says why a category is greyed where the caret writes, and nothing where it works', () => {
    const where = { chosen: true }
    expect(greyedBy('text', { ...where, layer: 'chords' })).toBeNull()
    expect(greyedBy('pitch', { ...where, layer: 'chords' })).toBe('staff')
    expect(greyedBy('clef', { ...where, layer: 'melody' })).toBe('hand')
    expect(greyedBy('bar', { ...where, layer: 'chords' })).toBeNull()
  })

  it('greys the tools that change notes until a note is chosen', () => {
    const none = { chosen: false }
    for (const category of ['pitch', 'articulations', 'dynamics', 'lines', 'text'] as const)
      expect(greyedBy(category, { ...none, layer: 'rh' })).toBe('chooseNote')
    expect(greyedBy('notes', { ...none, layer: 'rh' })).toBeNull()
    expect(greyedBy('clef', { chosen: true, layer: 'lh' })).toBeNull()
  })
})
