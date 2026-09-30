import { describe, expect, it } from 'vitest'
import { midi, noteName } from '@/shared/lib/music'
import { findChord, findingMarks } from './finding'

const keys = (...numbers: number[]) => numbers.map((n) => midi(n))

describe('findChord', () => {
  it('finds nothing before a key is chosen', () => {
    expect(findChord([])).toEqual({ kind: 'empty' })
  })

  it('names one note, in any octaves, plainly', () => {
    const found = findChord(keys(61, 73))
    expect(found.kind === 'note' && noteName(found.note)).toBe('D♭')
  })

  it('names two notes as the interval between them', () => {
    expect(findChord(keys(60, 64))).toEqual({ kind: 'interval', interval: 'M3' })
  })

  it('names a chord, its best name first and the others after', () => {
    const found = findChord(keys(57, 60, 64, 67))
    expect(found.kind === 'chord' && found.best.symbol).toBe('Am7')
    expect(found.kind === 'chord' && found.others.map((other) => other.symbol)).toContain('C6/A')
  })

  it('says when three notes or more make no chord', () => {
    expect(findChord(keys(60, 61, 62))).toEqual({ kind: 'none' })
  })
})

describe('findingMarks', () => {
  it('marks each key of a chord by its role and degree, and nothing else', () => {
    const marks = findingMarks(findChord(keys(60, 64, 67)), keys(60, 64, 67))
    expect(marks.get(midi(64))).toEqual({ tone: '3rd', label: '3' })
    expect(findingMarks(findChord(keys(60, 64)), keys(60, 64)).size).toBe(0)
  })
})
