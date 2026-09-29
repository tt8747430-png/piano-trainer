import { describe, expect, it } from 'vitest'
import { note } from '@/shared/lib/music'
import { namedHead } from './named-head'

// SMuFL's note name noteheads (U+E150–U+E1AF), as Bravura draws them.
describe('namedHead', () => {
  it('names a filled head by its letter', () => {
    expect(namedHead(note('A'), 4)).toBe('\uE197')
    expect(namedHead(note('G'), 8)).toBe('\uE1A9')
  })

  it('names a sharp or a flat as spelled', () => {
    expect(namedHead(note('F', 1), 4)).toBe('\uE1A7')
    expect(namedHead(note('B', -1), 2)).toBe('\uE182')
  })

  it('hollows a half note’s and a whole note’s head', () => {
    expect(namedHead(note('E'), 1)).toBe('\uE175')
  })

  it('has no head for a double sharp or flat', () => {
    expect(namedHead(note('F', 2), 4)).toBeNull()
    expect(namedHead(note('B', -2), 4)).toBeNull()
  })
})
