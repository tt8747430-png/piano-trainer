import { describe, expect, it } from 'vitest'
import { pieceById, PIECES } from '@/entities/piece'
import { incipitScore, INCIPIT_BARS } from './incipit'

const piece = (id: string) => {
  const found = pieceById(id)
  if (!found) throw new Error(`no piece ${id}`)
  return found
}

describe('incipitScore', () => {
  it('engraves a song’s first bars on one staff, plain, with no tempo mark', () => {
    const score = incipitScore(piece('mary-lamb'))
    expect(score.measures).toHaveLength(INCIPIT_BARS)
    expect(score.staves).toHaveLength(1)
    expect(score.plain).toBe(true)
    expect(score.measures.every((measure) => measure.tempo === undefined)).toBe(true)
  })

  it('keeps the song’s key and metre', () => {
    const lamb = piece('mary-lamb')
    const score = incipitScore(lamb, 1)
    expect(score.measures).toHaveLength(1)
    expect(score.meter).toEqual(incipitScore(lamb).meter)
  })

  it('engraves every built-in song', () => {
    for (const each of PIECES) expect(incipitScore(each).measures.length).toBeGreaterThan(0)
  })
})
