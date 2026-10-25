import { describe, expect, it } from 'vitest'
import { categoryOpen, greyedBy, PALETTE_CATEGORIES } from './palette-categories'

describe('the palette’s categories', () => {
  it('holds every tool in one palette, Insert’s kinds among them, the chords’ last', () => {
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
      'fingering',
      'chords',
    ])
  })

  it('opens what works where the caret writes: the notes’ tools on a staff, a hand’s in a hand', () => {
    const open = (layer: Parameters<typeof categoryOpen>[1]) =>
      PALETTE_CATEGORIES.filter((category) => categoryOpen(category, layer))
    expect(open('chords')).toEqual(['bar', 'key', 'time', 'repeats', 'chords'])
    expect(open('melody')).not.toContain('fingering')
    expect(open('melody')).not.toContain('clef')
    expect(open('melody')).not.toContain('chords')
    expect(open('lh')).toEqual(PALETTE_CATEGORIES.filter((category) => category !== 'chords'))
  })

  it('says why a category is greyed where the caret writes, and nothing where it works', () => {
    const where = { chosen: true, fingerable: true }
    expect(greyedBy('chords', { ...where, layer: 'melody' })).toBe('chordRow')
    expect(greyedBy('chords', { ...where, layer: 'chords' })).toBeNull()
    expect(greyedBy('pitch', { ...where, layer: 'chords' })).toBe('staff')
    expect(greyedBy('fingering', { ...where, layer: 'melody' })).toBe('hand')
    expect(greyedBy('bar', { ...where, layer: 'chords' })).toBeNull()
  })

  it('greys the tools that change notes until a note is chosen, a finger until one note of a chord is', () => {
    const none = { chosen: false, fingerable: false }
    for (const category of ['pitch', 'articulations', 'dynamics', 'lines', 'text'] as const)
      expect(greyedBy(category, { ...none, layer: 'rh' })).toBe('chooseNote')
    expect(greyedBy('notes', { ...none, layer: 'rh' })).toBeNull()
    expect(greyedBy('fingering', { ...none, layer: 'rh' })).toBe('chooseNote')
    expect(greyedBy('fingering', { chosen: true, fingerable: false, layer: 'lh' })).toBe(
      'chordNote',
    )
    expect(greyedBy('fingering', { chosen: true, fingerable: true, layer: 'lh' })).toBeNull()
  })
})
