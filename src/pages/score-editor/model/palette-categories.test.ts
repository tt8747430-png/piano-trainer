import { describe, expect, it } from 'vitest'
import { categoryOpen, PALETTE_CATEGORIES } from './palette-categories'

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
})
