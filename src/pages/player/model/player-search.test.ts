import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import { describe, expect, it } from 'vitest'
import { LEFT_FIGURE_IDS, LEFT_FIGURES, RIGHT_FIGURE_IDS, RIGHT_FIGURES } from '@/entities/pattern'
import { hasMethodCodes, melodyOf, PIECES, pieceById } from '@/entities/piece'
import { splitsTheBeat } from '@/shared/lib/arrangement'
import { ownChoice } from '@/features/practice'
import { isCompound, note, noteParam } from '@/shared/lib/music'
import { resolveChoice, searchPatch } from './player-search'

function piece(id: string) {
  const found = pieceById(id)
  if (!found) throw new Error(id)
  return found
}
const bz5 = piece('bz5')
const twofive = piece('romashki')

describe('resolveChoice', () => {
  it('plays the piece as written when the URL chooses nothing', () => {
    expect(resolveChoice(bz5, {}, false, BUILT_IN_PATTERNS)).toEqual(ownChoice(bz5))
  })

  it('takes the key, figures and melody the learner chose', () => {
    expect(
      resolveChoice(bz5, { key: noteParam(note('A')), rh: 't1', lh: 'o' }, true, BUILT_IN_PATTERNS),
    ).toMatchObject({
      tonic: note('A'),
      rh: 't1',
      lh: 'o',
      melody: true,
    })
  })

  it('spells a key for the piece’s mode', () => {
    expect(
      resolveChoice(bz5, { key: noteParam(note('A', 1)) }, false, BUILT_IN_PATTERNS).tonic,
    ).toEqual(note('B', -1))
  })

  it('plays the piece’s own pattern when the chart names no methods', () => {
    const plain = PIECES.find((p) => !hasMethodCodes(p))
    if (!plain) throw new Error('every piece names its methods')
    expect(resolveChoice(plain, { pattern: 'chart' }, false, BUILT_IN_PATTERNS).pattern).toBe(
      plain.pattern,
    )
  })

  it('plays a piece in 6/8 by its own pattern and figures when the URL names ones inside the beat', () => {
    const rh = RIGHT_FIGURE_IDS.find((id) => splitsTheBeat(RIGHT_FIGURES[id].figure))
    const lh = LEFT_FIGURE_IDS.find((id) => splitsTheBeat(LEFT_FIGURES[id].figure))
    if (!rh || !lh) throw new Error('figures inside the beat')
    const bz2 = piece('bz2')
    expect(
      resolveChoice(bz2, { pattern: 'ballad', rh, lh }, false, BUILT_IN_PATTERNS),
    ).toMatchObject({
      pattern: ownChoice(bz2).pattern,
      rh: null,
      lh: null,
    })
  })

  it('plays a piece without a tune by its own pattern when the URL names one that plays it', () => {
    const tuneless = PIECES.find(
      (p) => melodyOf(p) === undefined && !hasMethodCodes(p) && !isCompound(p.meter),
    )
    if (!tuneless) throw new Error('a piece in simple time without a melody')
    expect(
      resolveChoice(tuneless, { pattern: 'r6', rh: 'mel' }, false, BUILT_IN_PATTERNS),
    ).toMatchObject({
      pattern: tuneless.pattern,
      rh: null,
    })
  })

  it('lets only a progression that allows it change its chord size', () => {
    expect(
      resolveChoice(twofive, { chordSize: 'ninths' }, false, BUILT_IN_PATTERNS).chordSize,
    ).toBe('ninths')
    expect(
      resolveChoice(bz5, { chordSize: 'ninths' }, false, BUILT_IN_PATTERNS).chordSize,
    ).toBeNull()
  })
})

describe('searchPatch', () => {
  it('writes a choice equal to the piece’s own as absent', () => {
    expect(searchPatch(bz5, { key: noteParam(note('G')) })).toEqual({ key: undefined })
    expect(searchPatch(bz5, { pattern: ownChoice(bz5).pattern })).toEqual({ pattern: undefined })
    expect(searchPatch(twofive, { chordSize: 'sevenths' })).toEqual({ chordSize: undefined })
  })

  it('keeps a choice that differs', () => {
    expect(searchPatch(bz5, { key: noteParam(note('A')), rh: 't1' })).toEqual({
      key: 'A',
      rh: 't1',
    })
  })
})
