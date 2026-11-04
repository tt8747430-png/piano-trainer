import { describe, expect, it } from 'vitest'
import { pieceById } from '@/entities/piece'
import { playedAs, songToShare } from './played-as'

const bz5 = pieceById('bz5')
if (!bz5) throw new Error('bz5 is a piece')

describe('playedAs', () => {
  it('reads how far the Player last moved the piece and Simplify (R29 T)', () => {
    expect(playedAs(bz5, { transpose: -1, version: 'simple', tempo: 60 })).toEqual({
      transpose: -1,
      version: 'simple',
    })
  })

  it('reads the piece as written, not simplified, where the Player kept nothing it can read', () => {
    expect(playedAs(bz5, undefined)).toEqual({ transpose: 0, version: 'original' })
    expect(playedAs(bz5, { transpose: 9, version: 'yes' })).toEqual({
      transpose: 0,
      version: 'original',
    })
  })
})

describe('songToShare', () => {
  it('shares one of the app’s songs as a link to it, as last played', () => {
    expect(songToShare(bz5, 'Song', { transpose: 2, version: 'simple' })).toEqual({
      kind: 'piece',
      id: 'bz5',
      title: 'Song',
      played: { transpose: 2, version: 'simple' },
    })
  })
})
