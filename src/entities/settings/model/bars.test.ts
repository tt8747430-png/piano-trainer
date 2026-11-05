import { describe, expect, it } from 'vitest'
import {
  barAvailable,
  barCanShrink,
  barHasRoom,
  barOf,
  DEFAULT_BARS,
  normaliseBar,
  type BarAct,
} from './bars'

describe('the bars’ catalog (R29 B10, memory-palaces’ select toolbar)', () => {
  it('adds up to the limit', () => {
    expect(barHasRoom('select.songs', ['move', 'delete'])).toBe(true)
    expect(barHasRoom('select.songs', ['favourite', 'move', 'archive', 'delete'])).toBe(false)
    expect(barHasRoom('swipe.songs.leading', ['favourite', 'move'])).toBe(false)
  })

  it('keeps at least one on Select', () => {
    expect(barCanShrink('select.songs', ['move', 'delete'])).toBe(true)
    expect(barCanShrink('select.songs', ['delete'])).toBe(false)
    // A swipe's side may hold none.
    expect(barCanShrink('swipe.folders.trailing', ['move'])).toBe(true)
  })

  it('reorders', () => {
    const order: BarAct[] = ['delete', 'move', 'favourite']
    expect(normaliseBar('select.songs', order)).toEqual(order)
  })

  it('normalise drops unknown, duplicate and disallowed ids', () => {
    expect(normaliseBar('select.songs', ['move', 'move', 'tune', 'nope', 'delete'])).toEqual([
      'move',
      'delete',
    ])
    expect(normaliseBar('swipe.folders.leading', ['favourite', 'move'])).toEqual(['move'])
    expect(normaliseBar('swipe.songs.leading', ['edit'])).toEqual([])
    // Past its limits, or not a list: its default.
    expect(normaliseBar('select.songs', [])).toEqual(DEFAULT_BARS['select.songs'])
    expect(normaliseBar('select.songs', 'move')).toEqual(DEFAULT_BARS['select.songs'])
  })

  it('Reset gives the defaults', () => {
    expect(barOf({}, 'select.songs')).toEqual(['favourite', 'move', 'archive', 'delete'])
    expect(barOf({ 'select.songs': ['delete', 'move'] }, 'select.songs')).toEqual([
      'delete',
      'move',
    ])
  })

  it('offers what is not on the bar, in the catalog’s order', () => {
    expect(barAvailable('select.songs', ['delete', 'move'])).toEqual([
      'favourite',
      'export',
      'archive',
    ])
  })
})
