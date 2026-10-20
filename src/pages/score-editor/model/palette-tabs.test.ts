import { describe, expect, it } from 'vitest'
import { PALETTE_TABS, shownTab, tabOpen } from './palette-tabs'

describe('the editor’s tabs of tools', () => {
  it('lists the notes and their pitch, the marks, the chord names, the bars and a hand’s', () => {
    expect(PALETTE_TABS).toEqual([
      'notes',
      'pitch',
      'articulations',
      'lines',
      'dynamics',
      'chords',
      'bars',
      'hand',
    ])
  })

  it('opens the tools of where the caret writes, and the bars’ everywhere', () => {
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
      'bars',
      'hand',
    ])
    expect(PALETTE_TABS.filter((tab) => tabOpen(tab, 'chords'))).toEqual(['chords', 'bars'])
  })

  it('shows the tab chosen while it works, else the chord names’ in their row, else the first that works', () => {
    expect(shownTab('pitch', 'rh')).toBe('pitch')
    expect(shownTab('hand', 'melody')).toBe('notes')
    expect(shownTab('notes', 'chords')).toBe('chords')
    expect(shownTab('bars', 'chords')).toBe('bars')
  })
})
