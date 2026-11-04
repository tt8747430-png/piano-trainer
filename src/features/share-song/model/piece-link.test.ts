import { describe, expect, it } from 'vitest'
import { pieceLink } from './piece-link'

describe('pieceLink', () => {
  it('opens the piece in the Player moved as it is played and as simplified, both said', () => {
    expect(pieceLink('bz5', { transpose: -1, version: 'simple' })).toBe(
      '/play/bz5?transpose=-1&version=simple',
    )
    expect(pieceLink('bz5', { transpose: 0, version: 'original' })).toBe(
      '/play/bz5?transpose=0&version=original',
    )
  })
})
