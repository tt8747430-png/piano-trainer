import { describe, expect, it } from 'vitest'
import { hasMethodCodes, PIECES, pieceById } from '@/entities/piece'
import { ownChoice } from '@/features/practice'
import { note, noteParam } from '@/shared/lib/music'
import { resolveChoice, searchPatch } from './player-search'

function piece(id: string) {
  const found = pieceById(id)
  if (!found) throw new Error(id)
  return found
}
const bz5 = piece('bz5')
const twofive = piece('twofive')

describe('resolveChoice', () => {
  it('plays the piece as written when the URL chooses nothing', () => {
    expect(resolveChoice(bz5, {}, false)).toEqual(ownChoice(bz5))
  })

  it('takes the key, figures and melody the learner chose', () => {
    expect(
      resolveChoice(bz5, { key: noteParam(note('A')), rh: 't1', lh: 'o' }, true),
    ).toMatchObject({
      tonic: note('A'),
      rh: 't1',
      lh: 'o',
      melody: true,
    })
  })

  it('spells a key for the piece’s mode', () => {
    expect(resolveChoice(bz5, { key: noteParam(note('A', 1)) }, false).tonic).toEqual(note('B', -1))
  })

  it('plays the piece’s own pattern when the chart names no methods', () => {
    const plain = PIECES.find((p) => !hasMethodCodes(p))
    if (!plain) throw new Error('every piece names its methods')
    expect(resolveChoice(plain, { pattern: 'chart' }, false).pattern).toBe(plain.pattern)
  })

  it('lets only a progression that allows it change its chord size', () => {
    expect(resolveChoice(twofive, { chordSize: 'ninths' }, false).chordSize).toBe('ninths')
    expect(resolveChoice(bz5, { chordSize: 'ninths' }, false).chordSize).toBeNull()
  })
})

describe('searchPatch', () => {
  it('writes a choice equal to the piece’s own as absent', () => {
    expect(searchPatch(bz5, { key: noteParam(note('G')) })).toEqual({ key: undefined })
    expect(searchPatch(bz5, { tempo: bz5.tempo })).toEqual({ tempo: undefined })
    expect(searchPatch(bz5, { pattern: ownChoice(bz5).pattern })).toEqual({ pattern: undefined })
    expect(searchPatch(twofive, { chordSize: 'sevenths' })).toEqual({ chordSize: undefined })
  })

  it('keeps a choice that differs', () => {
    expect(searchPatch(bz5, { key: noteParam(note('A')), hands: 'lh' })).toEqual({
      key: 'A',
      hands: 'lh',
    })
    expect(searchPatch(bz5, { tempo: 96 })).toEqual({ tempo: 96 })
  })
})
