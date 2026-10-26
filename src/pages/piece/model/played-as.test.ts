import { describe, expect, it } from 'vitest'
import { pieceById } from '@/entities/piece'
import { playedAs } from './played-as'

const bz5 = pieceById('bz5')
if (!bz5) throw new Error('bz5 is a piece')

describe('playedAs', () => {
  it('reads the key and Simplify the Player last kept for the piece', () => {
    expect(playedAs(bz5, { key: 'F#', simple: true, tempo: 60 })).toEqual({
      key: 'F#',
      simple: true,
    })
  })

  it('reads the piece’s own key, not simplified, where the Player kept none or one it cannot read', () => {
    expect(playedAs(bz5, undefined)).toEqual({ key: 'G', simple: false })
    expect(playedAs(bz5, { key: 'H', simple: 'yes' })).toEqual({ key: 'G', simple: false })
  })
})
