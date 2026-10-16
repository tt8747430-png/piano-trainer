import { describe, expect, it } from 'vitest'
import { midi, note, noteName } from '@/shared/lib/music'
import { findChord, readingAt, readingMarks } from './finding'

const keys = (...numbers: number[]) => numbers.map((n) => midi(n))
const C_MAJOR = { tonic: note('C'), minor: false }
const symbols = (numbers: number[], key = C_MAJOR) => {
  const found = findChord(keys(...numbers), key)
  return found.kind === 'chord' ? found.readings.map((reading) => reading.symbol) : []
}

describe('findChord', () => {
  it('finds nothing before a key is chosen', () => {
    expect(findChord([], C_MAJOR)).toEqual({ kind: 'empty' })
  })

  it('names one note, in any octaves, as the key spells it', () => {
    const inF = findChord(keys(70, 82), { tonic: note('F'), minor: false })
    expect(inF.kind === 'note' && noteName(inF.note)).toBe('B♭')
    const inE = findChord(keys(66), { tonic: note('E'), minor: false })
    expect(inE.kind === 'note' && noteName(inE.note)).toBe('F#')
  })

  it('names two notes as their interval, compound past the octave where a chord names it', () => {
    expect(findChord(keys(60, 64), C_MAJOR)).toEqual({ kind: 'interval', interval: 'M3' })
    expect(findChord(keys(60, 74), C_MAJOR)).toEqual({ kind: 'interval', interval: 'M9' })
    expect(findChord(keys(60, 76), C_MAJOR)).toEqual({ kind: 'interval', interval: 'M3' })
    expect(findChord(keys(60, 75), C_MAJOR)).toEqual({ kind: 'interval', interval: 'm3' })
  })

  it('names a perfect 5th also as its power chord', () => {
    expect(findChord(keys(43, 50, 55), C_MAJOR)).toEqual({
      kind: 'interval',
      interval: 'P5',
      power: 'G5',
    })
  })

  it('names a chord by every reading, its best first', () => {
    expect(symbols([57, 60, 64, 67])[0]).toBe('Am7')
    expect(symbols([57, 60, 64, 67])).toContain('C6/A')
  })

  it('reads every kind of chord the Chords page builds', () => {
    expect(symbols([60, 64, 67])[0]).toBe('C')
    expect(symbols([60, 63, 66])[0]).toBe('C°')
    expect(symbols([60, 64, 68])[0]).toBe('C+')
    expect(symbols([60, 65, 67])[0]).toBe('Csus4')
    expect(symbols([60, 64, 67, 71])[0]).toBe('CMaj7')
    expect(symbols([60, 63, 66, 69])[0]).toBe('C°7')
    expect(symbols([60, 63, 66, 70])[0]).toBe('Cm7♭5')
    expect(symbols([60, 63, 67, 71])[0]).toBe('Cm(maj7)')
    expect(symbols([48, 64, 70, 74])[0]).toBe('C9')
    expect(symbols([48, 64, 70, 74, 81])[0]).toBe('C13')
    expect(symbols([48, 64, 70, 73])[0]).toBe('C7♭9')
    expect(symbols([48, 64, 67, 69, 74])[0]).toBe('C6/9')
    expect(symbols([60, 62, 64, 67, 69])[0]).toBe('C6/9')
  })

  it('names an inversion over its bass, and spells it as the key writes it', () => {
    expect(symbols([52, 60, 67])[0]).toBe('C/E')
    expect(symbols([54, 58, 61], { tonic: note('G', -1), minor: false })[0]).toBe('G♭')
    expect(symbols([54, 58, 61], { tonic: note('E'), minor: false })[0]).toBe('F#')
  })

  it('says when three notes or more make no chord', () => {
    expect(findChord(keys(60, 61, 62), C_MAJOR)).toEqual({ kind: 'none' })
  })
})

describe('readings', () => {
  it('marks each key of a reading by its role and degree', () => {
    const found = findChord(keys(57, 60, 64, 67), C_MAJOR)
    if (found.kind !== 'chord') throw new Error('a chord')
    const am7 = readingMarks(found.readings[0], keys(57, 60, 64, 67))
    expect(am7.get(midi(57))).toEqual({ tone: 'root', label: '1' })
    const c6 = readingAt(
      found.readings,
      found.readings.findIndex((r) => r.symbol === 'C6/A'),
    )
    expect(readingMarks(c6, keys(57, 60, 64, 67)).get(midi(57))?.label).toBe('6')
  })

  it('falls back to the best reading for a place it does not have', () => {
    const found = findChord(keys(60, 64, 67), C_MAJOR)
    if (found.kind !== 'chord') throw new Error('a chord')
    expect(readingAt(found.readings, 9)).toBe(found.readings[0])
  })
})
