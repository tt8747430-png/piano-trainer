import { describe, expect, it } from 'vitest'
import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import { pieceById } from '@/entities/piece'
import { arrangePiece, ownChoice } from '@/features/practice'
import { chordsOf } from './piece-chords'

const symbols = (id: string) => {
  const piece = pieceById(id)
  if (!piece) throw new Error(`no piece ${id}`)
  return chordsOf(arrangePiece(piece, ownChoice(piece), BUILT_IN_PATTERNS)).map(
    (chord) => chord.symbol,
  )
}

describe('chordsOf', () => {
  it('lists a piece’s chords once each, in the order they first come', () => {
    expect(symbols('bz1')).toEqual(['Bm', 'A', 'G', 'Em', 'F#7'])
  })

  it('names no chord twice', () => {
    const all = symbols('bz5')
    expect(new Set(all).size).toBe(all.length)
    expect(all[0]).toBe('G')
  })
})
