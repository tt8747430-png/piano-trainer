import { describe, expect, it } from 'vitest'
import {
  note,
  noteName,
  parseNoteName,
  pitchClassOf,
  plainSpelling,
  rootSpelling,
  sameNote,
} from './note'
import { pitchClass } from './pitch'

describe('pitchClassOf', () => {
  it.each([
    [note('C'), 0],
    [note('B', 1), 0],
    [note('C', -1), 11],
    [note('F', 2), 7],
    [note('B', -2), 9],
    [note('E', 1), 5],
  ])('%j → %i', (spelled, pc) => {
    expect(pitchClassOf(spelled)).toBe(pc)
  })
})

describe('noteName', () => {
  it.each([
    [note('E', -1), 'E♭'],
    [note('F', 1), 'F#'],
    [note('F', 2), 'F𝄪'],
    [note('B', -2), 'B𝄫'],
    [note('C'), 'C'],
  ])('%j → %s', (spelled, name) => {
    expect(noteName(spelled)).toBe(name)
  })
})

describe('parseNoteName', () => {
  it.each([
    ['Eb', note('E', -1)],
    ['E♭', note('E', -1)],
    ['F#', note('F', 1)],
    ['F♯', note('F', 1)],
    ['F##', note('F', 2)],
    ['F𝄪', note('F', 2)],
    ['Bbb', note('B', -2)],
    ['B𝄫', note('B', -2)],
    ['C', note('C')],
  ])('reads %s', (text, spelled) => {
    expect(parseNoteName(text)).toEqual(spelled)
  })

  it.each(['H', 'E#b', 'e', '', 'Cconstructor', 'C#m'])('refuses %j', (text) => {
    expect(parseNoteName(text)).toBeNull()
  })
})

describe('plainSpelling', () => {
  it('leans to sharps or flats, with at most one accidental', () => {
    expect(plainSpelling(pitchClass(1), true)).toEqual(note('C', 1))
    expect(plainSpelling(pitchClass(1), false)).toEqual(note('D', -1))
    expect(plainSpelling(pitchClass(0), true)).toEqual(note('C'))
    expect(plainSpelling(pitchClass(0), false)).toEqual(note('C'))
  })
})

describe('rootSpelling', () => {
  // Legacy rootFor: only C♯/D♭ and G♯/A♭ follow the preference; E♭, F♯ and B♭ are fixed.
  const LEGACY = [
    ['C', 'C'],
    ['C#', 'D♭'],
    ['D', 'D'],
    ['E♭', 'E♭'],
    ['E', 'E'],
    ['F', 'F'],
    ['F#', 'F#'],
    ['G', 'G'],
    ['G#', 'A♭'],
    ['A', 'A'],
    ['B♭', 'B♭'],
    ['B', 'B'],
  ]

  it.each(LEGACY.map(([sharp, flat], pc) => [pc, sharp, flat]))(
    'pc %i → %s leaning sharp, %s leaning flat',
    (pc, sharp, flat) => {
      expect(noteName(rootSpelling(pitchClass(pc as number), true))).toBe(sharp)
      expect(noteName(rootSpelling(pitchClass(pc as number), false))).toBe(flat)
    },
  )
})

describe('sameNote', () => {
  it('compares letter and accidental, not pitch', () => {
    expect(sameNote(note('E', -1), note('E', -1))).toBe(true)
    expect(sameNote(note('E', -1), note('D', 1))).toBe(false)
  })
})
