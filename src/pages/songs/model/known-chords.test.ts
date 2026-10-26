import { describe, expect, it } from 'vitest'
import { pieceById, SONG_COLLECTIONS, type Entry } from '@/entities/piece'
import { chordChoices, usesOnly } from './known-chords'

const piece = (id: string): Entry => {
  const found = pieceById(id)
  if (!found) throw new Error(`no ${id}`)
  return found
}

describe('chordChoices', () => {
  it('offers every chord the shelves’ songs use, once, the most used first', () => {
    const choices = chordChoices(SONG_COLLECTIONS)
    expect(choices.slice(0, 3)).toEqual(['C', 'G', 'F'])
    expect(new Set(choices).size).toBe(choices.length)
    // bz5's own chords are among them, each over any bass.
    for (const chord of ['G', 'C', 'Em', 'Dsus4', 'D', 'Am', 'D7']) expect(choices).toContain(chord)
    expect(choices).not.toContain('G/B')
  })

  it('counts a song on two shelves once, and puts chords used as often by name', () => {
    const silent = piece('silent')
    expect(chordChoices([{ entries: [silent] }, { entries: [silent] }])).toEqual(
      chordChoices([{ entries: [silent] }]),
    )
    const [first, second] = chordChoices([{ entries: [silent] }])
    expect([first, second].sort()).toEqual([first, second])
  })
})

describe('usesOnly', () => {
  it('keeps a song whose every chord is known', () => {
    const known = new Set(['G', 'C', 'Em', 'Dsus4', 'D', 'Am', 'D7'])
    expect(usesOnly(piece('bz5'), known)).toBe(true)
    expect(usesOnly(piece('bz5'), new Set(['G', 'C', 'Em']))).toBe(false)
  })

  it('keeps no song with no chords to know: a listing, or one of no chord symbol', () => {
    const listing = SONG_COLLECTIONS.flatMap((c) => c.entries).find((e) => e.kind === 'listing')
    if (!listing) throw new Error('a listing')
    expect(usesOnly(listing, new Set(['C', 'G']))).toBe(false)
  })
})
