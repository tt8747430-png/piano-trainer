import { describe, expect, it } from 'vitest'
import {
  changedPages,
  changesOf,
  layoutOf,
  placeOn,
  placesFor,
  readLayouts,
  withPanel,
} from './layout'

describe('layoutOf', () => {
  it('comes as the board draws it: keys at the foot, controls floating, the Genos compact on the right', () => {
    expect(layoutOf({}, 'chord-player')).toEqual({
      keys: { place: 'bottom', size: 'medium', hidden: false },
      dock: { place: 'float', size: 'full', hidden: false },
      genos: { place: 'right', size: 'compact', hidden: false },
      chords: { place: 'right', size: 'wide', hidden: false },
    })
  })
})

describe('withPanel', () => {
  it('keeps only what differs from how the panel came', () => {
    const moved = withPanel({}, 'chord-player', 'keys', { place: 'top' })
    expect(moved).toEqual({
      'chord-player': { keys: { place: 'top', size: 'medium', hidden: false } },
    })
    expect(layoutOf(moved, 'chord-player').keys.place).toBe('top')
  })

  it('forgets a panel put back as it came, and the page with nothing changed', () => {
    const moved = withPanel({}, 'chord-player', 'keys', { place: 'top' })
    expect(withPanel(moved, 'chord-player', 'keys', { place: 'bottom' })).toEqual({})
  })

  it('ignores a place or size the panel cannot take', () => {
    expect(withPanel({}, 'chord-player', 'dock', { place: 'left', size: 'huge' })).toEqual({})
  })
})

describe('changesOf', () => {
  it('names each change panel by panel, a hidden panel only as hidden', () => {
    let changed = withPanel({}, 'chord-player', 'keys', { place: 'top', size: 'large' })
    changed = withPanel(changed, 'chord-player', 'genos', { hidden: true, size: 'full' })
    expect(changesOf(changed, 'chord-player')).toEqual([
      { panel: 'keys', kind: 'place', place: 'top' },
      { panel: 'keys', kind: 'size', size: 'large' },
      { panel: 'genos', kind: 'hidden' },
    ])
    expect(changedPages(changed)).toEqual(['chord-player'])
  })
})

describe('placesFor and placeOn', () => {
  it('leaves the columns beside the content to a laptop; a phone floats what stands in one', () => {
    const spec = {
      places: ['top', 'float', 'bottom', 'left', 'right'] as const,
      sizes: [],
      place: 'right',
      size: '',
    } as const
    expect(placesFor(spec, false)).toEqual(['top', 'float', 'bottom'])
    expect(placesFor(spec, true)).toHaveLength(5)
    expect(placeOn('right', false)).toBe('float')
    expect(placeOn('right', true)).toBe('right')
  })
})

describe('readLayouts', () => {
  it('reads a save panel by panel, dropping what is none', () => {
    expect(
      readLayouts({
        'chord-player': {
          keys: { place: 'top', size: 'tiny', hidden: 'yes' },
          lamp: { place: 'top' },
        },
        nowhere: { keys: { place: 'top' } },
      }),
    ).toEqual({ 'chord-player': { keys: { place: 'top', size: 'medium', hidden: false } } })
    expect(readLayouts(null)).toEqual({})
  })
})
