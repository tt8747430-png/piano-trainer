import { describe, expect, it } from 'vitest'
import { KEY_SIZES, nextNamedKeys, zoomKeySize } from './keyboard-choices'

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
