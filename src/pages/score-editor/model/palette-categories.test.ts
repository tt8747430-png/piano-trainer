import { describe, expect, it } from 'vitest'
import { needsNote, openCategories, PALETTE_CATEGORIES } from './palette-categories'

describe('the palette’s categories', () => {
  it('holds every tool in one palette in Flat’s order, the fields’ keys among their kin (ADR 0096)', () => {
    expect(PALETTE_CATEGORIES).toEqual([
      'notes',
      'pitch',
      'articulations',
      'ornaments',
      'dynamics',
      'measures',
      'clef',
      'key',
      'time',
      'repeats',
      'text',
    ])
  })

  it('shows what works where the caret writes: every tool on a staff, a single one too (ADR 0097)', () => {
    // What acts on bars; the chord symbols are typed where a tap on the chord row opens them (ADR 0114).
    expect(openCategories('chords')).toEqual(['notes', 'measures', 'key', 'time', 'repeats'])
    expect(openCategories('staff0')).toEqual(PALETTE_CATEGORIES)
    expect(openCategories('lh')).toEqual(PALETTE_CATEGORIES)
  })

  it('asks for a note before the categories whose every tool changes notes (R32-B)', () => {
    for (const category of ['pitch', 'articulations', 'ornaments', 'dynamics'] as const) {
      expect(needsNote(category, false)).toBe(true)
      expect(needsNote(category, true)).toBe(false)
    }
    for (const category of ['notes', 'measures', 'clef', 'key', 'time', 'repeats', 'text'] as const)
      expect(needsNote(category, false)).toBe(false)
  })
})
