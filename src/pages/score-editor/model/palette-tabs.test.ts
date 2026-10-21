import { describe, expect, it } from 'vitest'
import { PALETTE_TABS, shownTab, tabOpen } from './palette-tabs'

describe('the palette’s tabs', () => {
  it('lists what is done to the notes: their values, pitch, marks, dynamics and fingers', () => {
    expect(PALETTE_TABS).toEqual(['notes', 'pitch', 'articulations', 'dynamics', 'hand'])
  })

  it('opens a hand’s own only in a hand', () => {
    expect(PALETTE_TABS.filter((tab) => tabOpen(tab, 'melody'))).toEqual([
      'notes',
      'pitch',
      'articulations',
      'dynamics',
    ])
    expect(PALETTE_TABS.filter((tab) => tabOpen(tab, 'lh'))).toEqual(PALETTE_TABS)
  })

  it('shows the tab chosen while it works, else the notes’', () => {
    expect(shownTab('pitch', 'rh')).toBe('pitch')
    expect(shownTab('hand', 'melody')).toBe('notes')
  })
})
