import { describe, expect, it } from 'vitest'
import { note } from '@/shared/lib/music'
import { testSong } from '../testing/test-pieces'
import { defineListing, isLeadSheet, isPiece, pieceKey, showsAStaff } from './types'

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

describe('showsAStaff', () => {
  it('says whether a score with these rows hidden still shows a staff (ADR 0083)', () => {
    const none = { melody: false, voices: 0 }
    expect(showsAStaff([], none)).toBe(true)
    expect(showsAStaff(['chords'], none)).toBe(true)
    expect(showsAStaff(['piano'], none)).toBe(false)
    expect(showsAStaff(['piano'], { melody: true, voices: 0 })).toBe(true)
    expect(showsAStaff(['piano', 'melody'], { melody: true, voices: 0 })).toBe(false)
    expect(showsAStaff(['piano', 'melody'], { melody: true, voices: 1 })).toBe(true)
    expect(showsAStaff(['piano', 'melody', 'voice2'], { melody: true, voices: 1 })).toBe(false)
    // A voice the score has not is no staff.
    expect(showsAStaff(['piano'], { melody: false, voices: 0 })).toBe(false)
  })
})

describe('isLeadSheet', () => {
  it('is a piece that hides its piano: the tune and the chord names (ADR 0083)', () => {
    const song = testSong(['C'])
    expect(isLeadSheet(song)).toBe(false)
    expect(isLeadSheet({ ...song, melody: 'C4/4', hidden: ['piano'] })).toBe(true)
    expect(isLeadSheet({ ...song, hidden: ['chords'] })).toBe(false)
  })
})
