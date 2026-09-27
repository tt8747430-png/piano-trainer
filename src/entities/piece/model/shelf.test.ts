import { describe, expect, it } from 'vitest'
import { shelfOf } from './shelf'

describe('shelfOf', () => {
  it('keeps songs and listings on Songs, and studies and progressions on Practice', () => {
    expect(shelfOf('song')).toBe('songs')
    expect(shelfOf('listing')).toBe('songs')
    expect(shelfOf('study')).toBe('practice')
    expect(shelfOf('progression')).toBe('practice')
  })
})
