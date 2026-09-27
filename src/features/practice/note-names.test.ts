import { describe, expect, it } from 'vitest'
import { pieceById } from '@/entities/piece'
import { pitchClass } from '@/shared/lib/music'
import { arrangePiece, ownChoice } from './arrange-piece'
import { spellPitchClass } from './note-names'

const bz5 = pieceById('bz5')
if (!bz5) throw new Error('bz5')
const performance = arrangePiece(bz5, ownChoice(bz5))

describe('spellPitchClass', () => {
  it('names a pitch class from the chord it belongs to, else from the key', () => {
    const g = performance.chords.findIndex((chord) => chord.symbol === 'G')
    expect(spellPitchClass(performance, g, pitchClass(11))).toBe('B')
    expect(spellPitchClass(performance, g, pitchClass(1))).toBe('C#')
  })
})
