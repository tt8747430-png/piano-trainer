import { describe, expect, it } from 'vitest'
import { note } from './note'
import { harmonicFunction, isStrongMove, rootMove, rootMoveText } from './harmony'
import { parseNumeral, type Numeral } from './numerals'

const numeral = (text: string): Numeral => {
  const read = parseNumeral(text)
  if (!read) throw new RangeError(text)
  return read
}
const major = (text: string) => harmonicFunction(numeral(text), false)
const minor = (text: string) => harmonicFunction(numeral(text), true)

describe('harmonicFunction', () => {
  it('reads a major key’s diatonic chords as tonic, subdominant or dominant', () => {
    expect(['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'].map(major)).toEqual([
      'tonic',
      'subdominant',
      'tonic',
      'subdominant',
      'dominant',
      'tonic',
      'dominant',
    ])
  })

  it('reads sevenths, inversions and the cadential six-four by their degree', () => {
    expect(['IMaj7', 'ii7', 'V7', 'viiø7', 'I/5', 'IV/3'].map(major)).toEqual([
      'tonic',
      'subdominant',
      'dominant',
      'dominant',
      'tonic',
      'subdominant',
    ])
  })

  it('reads a minor key’s chords the same way, its subtonic a dominant', () => {
    expect(['i', 'ii°', 'III', 'iv', 'V', 'v', 'VI', 'VII', 'vii°7'].map(minor)).toEqual([
      'tonic',
      'subdominant',
      'tonic',
      'subdominant',
      'dominant',
      'dominant',
      'tonic',
      'dominant',
      'dominant',
    ])
  })

  it('reads chords borrowed into a major key: the Neapolitan and ♭VI subdominant, ♭VII7 a dominant', () => {
    expect(['♭II', '♭VI', 'iv', '♭VII', '♭VII7', '♭III'].map(major)).toEqual([
      'subdominant',
      'subdominant',
      'subdominant',
      'subdominant',
      'dominant',
      'tonic',
    ])
  })

  it('reads the tritone substitute ♭II7 as a dominant', () => {
    expect(major('♭II7')).toBe('dominant')
  })

  it('reads an applied chord by what it is in its own key', () => {
    expect(['V/V', 'V7/ii', 'vii°7/V', 'ii/V', 'IV/IV'].map(major)).toEqual([
      'dominant',
      'dominant',
      'dominant',
      'subdominant',
      'subdominant',
    ])
  })
})

describe('rootMove', () => {
  it('measures a root’s move by letters: a 4th up is a 5th down, a 6th up a 3rd down', () => {
    expect(rootMove(note('C'), note('F'))).toEqual({ by: 'fifth', down: true })
    expect(rootMove(note('C'), note('G'))).toEqual({ by: 'fifth', down: false })
    expect(rootMove(note('C'), note('A'))).toEqual({ by: 'third', down: true })
    expect(rootMove(note('C'), note('E'))).toEqual({ by: 'third', down: false })
    expect(rootMove(note('F'), note('G'))).toEqual({ by: 'second', down: false })
    expect(rootMove(note('B', -1), note('A'))).toEqual({ by: 'second', down: true })
  })

  it('names no move where the root keeps its letter', () => {
    expect(rootMove(note('C'), note('C'))).toBeNull()
    expect(rootMove(note('F'), note('F', 1))).toBeNull()
  })

  it('writes a move as an arrow and its number', () => {
    expect(rootMoveText({ by: 'fifth', down: true })).toBe('↓5')
    expect(rootMoveText({ by: 'third', down: false })).toBe('↑3')
    expect(rootMoveText({ by: 'second', down: false })).toBe('↑2')
  })

  it('counts a 5th down, a 3rd down and a 2nd up as the strong moves', () => {
    expect(isStrongMove({ by: 'fifth', down: true })).toBe(true)
    expect(isStrongMove({ by: 'third', down: true })).toBe(true)
    expect(isStrongMove({ by: 'second', down: false })).toBe(true)
    expect(isStrongMove({ by: 'fifth', down: false })).toBe(false)
    expect(isStrongMove({ by: 'third', down: false })).toBe(false)
    expect(isStrongMove({ by: 'second', down: true })).toBe(false)
  })
})
