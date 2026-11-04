import { describe, expect, it } from 'vitest'
import { pieceLink } from './piece-link'

describe('pieceLink', () => {
  it('opens the piece in the Player moved as it is played and as simplified, both said', () => {
    expect(pieceLink('bz5', { transpose: -1, simple: true })).toBe(
      '/play/bz5?transpose=-1&simple=true',
    )
    expect(pieceLink('bz5', { transpose: 0, simple: false })).toBe(
      '/play/bz5?transpose=0&simple=false',
    )
  })
})
