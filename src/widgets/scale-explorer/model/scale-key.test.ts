import { describe, expect, it } from 'vitest'
import { keySymbol, note, noteParam, type ScaleKind, type SpelledNote } from '@/shared/lib/music'
import { keyOfScale } from './scale-key'

const symbol = (root: SpelledNote, kind: ScaleKind) => {
  const key = keyOfScale(noteParam(root), kind)
  return key ? keySymbol(key) : null
}

describe('keyOfScale', () => {
  it('is the major key of a major scale', () => {
    expect(symbol(note('G'), 'major')).toBe('G')
  })

  it('is the minor key of each minor scale', () => {
    expect(symbol(note('A'), 'natural')).toBe('Am')
    expect(symbol(note('A'), 'harmonic')).toBe('Am')
    expect(symbol(note('A'), 'melodic')).toBe('Am')
  })

  it('spells the key as the circle of fifths does', () => {
    expect(symbol(note('E', -1), 'natural')).toBe('D#m')
  })

  it('is no key for a mode or a blues scale', () => {
    expect(symbol(note('D'), 'dorian')).toBeNull()
    expect(symbol(note('C'), 'blues')).toBeNull()
  })
})
