import { describe, expect, it } from 'vitest'
import { PALETTE_TABS, shownTab, tabOpen } from './palette-tabs'

describe('the palette’s tabs', () => {
  it('lists the notes’ tools, the pitch’s, the marks’, a hand’s, the chords’ and the bars’', () => {
    expect(PALETTE_TABS).toEqual([
      'notes',
      'pitch',
      'articulations',
      'lines',
      'dynamics',
      'hand',
      'chords',
      'bars',
    ])
  })

  it('opens the tools of what the keys write, and the bars’ everywhere', () => {
    const marks = ['articulations', 'lines', 'dynamics']
    expect(PALETTE_TABS.filter((tab) => tabOpen(tab, 'melody'))).toEqual([
      'notes',
      'pitch',
      ...marks,
      'bars',
    ])
    expect(PALETTE_TABS.filter((tab) => tabOpen(tab, 'lh'))).toEqual([
      'notes',
      'pitch',
      ...marks,
      'hand',
      'bars',
    ])
    expect(PALETTE_TABS.filter((tab) => tabOpen(tab, 'chords'))).toEqual(['chords', 'bars'])
  })

  it('shows the tab chosen while it is open, else the first of what the keys write', () => {
    expect(shownTab('pitch', 'rh')).toBe('pitch')
    expect(shownTab('hand', 'melody')).toBe('notes')
    expect(shownTab('notes', 'chords')).toBe('chords')
    expect(shownTab('bars', 'chords')).toBe('bars')
  })
})
