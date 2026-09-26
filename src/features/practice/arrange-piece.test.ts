import { describe, expect, it } from 'vitest'
import { hasMethodCodes, PIECES, pieceById, pieceKey } from '@/entities/piece'
import { note } from '@/shared/lib/music'
import { arrangePiece, defaultPattern, ownChoice } from './arrange-piece'

const piece = (id: string) => {
  const found = pieceById(id)
  if (!found) throw new Error(id)
  return found
}
const bz5 = piece('bz5')

describe('ownChoice', () => {
  it('plays a piece as written', () => {
    expect(ownChoice(bz5)).toEqual({
      tonic: pieceKey(bz5).tonic,
      pattern: 'r4',
      rh: null,
      lh: null,
      chordSize: null,
      melody: false,
    })
  })
})

describe('arrangePiece', () => {
  it('plays a piece in its own key and in another', () => {
    expect(arrangePiece(bz5, ownChoice(bz5)).chords[0]?.symbol).toBe('G')
    expect(arrangePiece(bz5, { ...ownChoice(bz5), tonic: note('A') }).chords[0]?.symbol).toBe('A')
  })

  it('follows the chart’s own methods when asked', () => {
    const withCodes = PIECES.find((p) => hasMethodCodes(p))
    if (!withCodes) throw new Error('no piece names its methods')
    expect(defaultPattern(withCodes)).toBe('chart')
    expect(ownChoice(withCodes).pattern).toBe('chart')
    const patterns = new Set(
      arrangePiece(withCodes, ownChoice(withCodes)).chords.map((c) => c.pattern),
    )
    expect(patterns.size).toBeGreaterThan(0)
    expect([...patterns].every((id) => typeof id === 'string')).toBe(true)
  })

  it('falls back to r4 for a melody pattern on a piece without a melody', () => {
    const performance = arrangePiece(bz5, { ...ownChoice(bz5), pattern: 'r5' })
    expect(performance.chords.every((c) => c.pattern === 'r4')).toBe(true)
  })

  it('grows a progression’s chords with the chord size that it lets the learner choose', () => {
    const twofive = piece('twofive')
    const symbols = (chordSize: 'triads' | 'ninths') =>
      arrangePiece(twofive, { ...ownChoice(twofive), chordSize }).chords.map((c) => c.symbol)
    expect(symbols('triads')[0]).toBe('Dm')
    expect(symbols('ninths')[0]).toBe('Dm9')
  })
})
