import { describe, expect, it } from 'vitest'
import { note } from '@/shared/lib/music'
import { testSong } from '../testing/test-pieces'
import { METERS, beatsPerBar, defineListing, isPiece, pieceKey } from './types'

describe('beatsPerBar', () => {
  it('counts compound meters in dotted quarters', () => {
    expect(METERS.map(beatsPerBar)).toEqual([2, 3, 4, 2, 4])
  })
})

describe('pieceKey', () => {
  it('reads the key a piece is written in', () => {
    expect(pieceKey(testSong(['C'], { key: 'G#m' }))).toEqual({
      tonic: note('G', 1),
      minor: true,
    })
    expect(pieceKey(testSong(['C'], { key: 'Bb' }))).toEqual({
      tonic: note('B', -1),
      minor: false,
    })
  })
})

describe('entries', () => {
  const listing = defineListing({ id: 'bz4', title: 'Listing', key: 'D', meter: '3/4' })

  it('mark a listing as one', () => {
    expect(listing.kind).toBe('listing')
  })

  it('tell a piece from a listing', () => {
    expect(isPiece(listing)).toBe(false)
    expect(isPiece(testSong(['C']))).toBe(true)
  })
})
