import { describe, expect, it } from 'vitest'
import { chordSymbol } from './chord'
import { diatonicChords } from './diatonic'
import { note } from './note'
import { spellScale } from './scale'

const read = (chords: ReturnType<typeof diatonicChords>) =>
  chords.map(({ roman, chord }) => `${chordSymbol(chord)} ${roman}`)

describe('diatonicChords', () => {
  it('builds the triads of C major', () => {
    expect(read(diatonicChords(spellScale(note('C'), 'major'), 3))).toEqual([
      'C I',
      'Dm ii',
      'Em iii',
      'F IV',
      'G V',
      'Am vi',
      'B° vii°',
    ])
  })

  it('builds the sevenths of C major', () => {
    expect(read(diatonicChords(spellScale(note('C'), 'major'), 4))).toEqual([
      'CMaj7 I',
      'Dm7 ii',
      'Em7 iii',
      'FMaj7 IV',
      'G7 V',
      'Am7 vi',
      'Bm7♭5 viiø',
    ])
  })

  it('builds the sevenths of A harmonic minor', () => {
    expect(read(diatonicChords(spellScale(note('A'), 'harmonic'), 4))).toEqual([
      'Am(maj7) i',
      'Bm7♭5 iiø',
      'C+Maj7 III+',
      'Dm7 iv',
      'E7 V',
      'FMaj7 VI',
      'G#°7 vii°',
    ])
  })

  it('reads the triads of A natural minor', () => {
    expect(diatonicChords(spellScale(note('A'), 'natural'), 3).map((c) => c.roman)).toEqual([
      'i',
      'ii°',
      'III',
      'iv',
      'v',
      'VI',
      'VII',
    ])
  })

  it('spells each chord from the scale’s own note', () => {
    const chords = diatonicChords(spellScale(note('E', -1), 'harmonic'), 3)
    expect(chords[5]?.chord.root).toEqual(note('C', -1))
  })

  it('has none for a scale of fewer than 7 notes', () => {
    expect(diatonicChords(spellScale(note('C'), 'pent'), 3)).toEqual([])
  })
})
