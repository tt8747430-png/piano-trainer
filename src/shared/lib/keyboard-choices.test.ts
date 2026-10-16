import { describe, expect, it } from 'vitest'
import {
  KEY_SIZES,
  nextNamedKeys,
  railControls,
  RAIL_CONTROLS,
  zoomKeySize,
} from './keyboard-choices'

describe('the key sizes', () => {
  it('run from the whole piano to large keys, as a zoom does', () => {
    expect(KEY_SIZES).toEqual(['piano', 'fit', 'large'])
  })

  it('zoom a step in or out, and no further than the ends', () => {
    expect(zoomKeySize('piano', 1)).toBe('fit')
    expect(zoomKeySize('fit', 1)).toBe('large')
    expect(zoomKeySize('large', 1)).toBeNull()
    expect(zoomKeySize('large', -1)).toBe('fit')
    expect(zoomKeySize('fit', -1)).toBe('piano')
    expect(zoomKeySize('piano', -1)).toBeNull()
  })
})

describe('the named keys', () => {
  it('go round: every C, every key, none', () => {
    expect(nextNamedKeys('c')).toBe('all')
    expect(nextNamedKeys('all')).toBe('none')
    expect(nextNamedKeys('none')).toBe('c')
  })
})

describe('the rail’s controls', () => {
  it('reads a saved list as the controls it names, each once, in the rail’s order', () => {
    expect(railControls(['pedal', 'zoom', 'pedal', 'nope', 3], RAIL_CONTROLS)).toEqual([
      'zoom',
      'pedal',
    ])
    expect(railControls([], RAIL_CONTROLS)).toEqual([])
  })

  it('keeps the current controls where the save is no list', () => {
    expect(railControls('full', ['zoom'])).toEqual(['zoom'])
  })
})
