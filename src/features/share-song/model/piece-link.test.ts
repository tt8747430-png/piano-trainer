import { describe, expect, it } from 'vitest'
import { pieceLink } from './piece-link'

describe('pieceLink', () => {
  it('opens the piece in the Player in the key it is played and as simplified, both said', () => {
    expect(pieceLink('bz5', { key: 'F#', simple: true })).toBe('/play/bz5?key=F%23&simple=true')
    expect(pieceLink('bz5', { key: 'G', simple: false })).toBe('/play/bz5?key=G&simple=false')
  })
})
