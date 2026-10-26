import { describe, expect, it } from 'vitest'
import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import { pieceById } from '@/entities/piece'
import { arrangePiece, ownChoice } from '@/features/practice'
import { sectionAt, sectionStarts } from './section-starts'

function played(id: string) {
  const piece = pieceById(id)
  if (!piece) throw new Error(`${id} is a piece`)
  return arrangePiece(piece, ownChoice(piece), BUILT_IN_PATTERNS, { unfold: true })
}

describe('sectionStarts', () => {
  it('says where each section starts, as written, in order', () => {
    expect(sectionStarts(played('bz5'))).toEqual([
      { section: 0, bar: 0 },
      { section: 1, bar: 8 },
      { section: 2, bar: 18 },
    ])
  })
})

describe('sectionAt', () => {
  it('is the section of the bar a beat group is in', () => {
    const bz5 = played('bz5')
    const inChorus = bz5.beatGroups.findIndex((group) => group.bar === 9)
    expect(sectionAt(bz5, 0)).toBe(0)
    expect(sectionAt(bz5, inChorus)).toBe(1)
  })
})
